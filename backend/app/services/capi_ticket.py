import base64
import hashlib
import hmac
import json
import time

from app.core.config import settings

TICKET_TTL_SECONDS = 15 * 60


def create_capi_ticket(
    lead_id: str,
    event_id: str | None,
    *,
    fbp: str | None,
    fbc: str | None,
) -> str | None:
    if not settings.META_PIXEL_ID or not settings.META_ACCESS_TOKEN or not event_id:
        return None

    payload = json.dumps({
        "lead_id": lead_id,
        "event_id": event_id,
        "fbp": fbp,
        "fbc": fbc,
        "expires_at": int(time.time()) + TICKET_TTL_SECONDS,
    }, separators=(",", ":")).encode("utf-8")
    encoded = base64.urlsafe_b64encode(payload).decode("ascii").rstrip("=")
    signature = hmac.new(
        settings.META_ACCESS_TOKEN.encode("utf-8"),
        encoded.encode("ascii"),
        hashlib.sha256,
    ).hexdigest()
    return f"{encoded}.{signature}"


def verify_capi_ticket(ticket: str, lead_id: str, event_id: str) -> dict | None:
    if not settings.META_PIXEL_ID or not settings.META_ACCESS_TOKEN:
        return None

    try:
        encoded, supplied_signature = ticket.split(".", 1)
        expected_signature = hmac.new(
            settings.META_ACCESS_TOKEN.encode("utf-8"),
            encoded.encode("ascii"),
            hashlib.sha256,
        ).hexdigest()
        if not hmac.compare_digest(supplied_signature, expected_signature):
            return None

        payload_bytes = base64.urlsafe_b64decode(encoded + "=" * (-len(encoded) % 4))
        payload = json.loads(payload_bytes)
        now = int(time.time())
        if (
            payload.get("lead_id") != lead_id
            or payload.get("event_id") != event_id
            or not now <= int(payload.get("expires_at", 0)) <= now + TICKET_TTL_SECONDS + 5
        ):
            return None
        return payload
    except (ValueError, TypeError, json.JSONDecodeError):
        return None
