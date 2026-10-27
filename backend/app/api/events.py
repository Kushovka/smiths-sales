from urllib.parse import urlsplit, urlunsplit

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import Response
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.deps import get_db
from app.schemas.event import ContactActionCreate
from app.schemas.lead import CapiLeadEventCreate
from app.models.lead import Lead
from app.models.vehicle import Vehicle
from app.services.capi_ticket import verify_capi_ticket
from app.services.meta_capi import send_contact_action_event, send_lead_event


router = APIRouter(prefix="/events", tags=["events"])


def _client_ip(request: Request) -> str | None:
    forwarded_for = request.headers.get("x-forwarded-for")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()

    if request.client:
        return request.client.host

    return None


@router.post("/contact-action", status_code=status.HTTP_202_ACCEPTED)
def contact_action(payload: ContactActionCreate, request: Request):
    payload.client_ip_address = payload.client_ip_address or _client_ip(request)
    payload.user_agent = payload.user_agent or request.headers.get("user-agent")
    body, meta_status, content_type = send_contact_action_event(payload)
    return Response(content=body, status_code=meta_status, media_type=content_type)


def _trusted_page_url(request: Request) -> str:
    configured = urlsplit(settings.PUBLIC_SITE_URL)
    referer = urlsplit(request.headers.get("referer", ""))
    if (
        referer.scheme == configured.scheme
        and referer.netloc.lower() == configured.netloc.lower()
        and referer.path.startswith("/")
    ):
        return urlunsplit((referer.scheme, referer.netloc, referer.path, referer.query, ""))
    return settings.PUBLIC_SITE_URL + "/"


@router.post("/capi", include_in_schema=False)
def lead_capi_event(
    payload: CapiLeadEventCreate,
    request: Request,
    db: Session = Depends(get_db),
):
    claims = verify_capi_ticket(payload.capi_ticket, payload.lead_id, payload.event_id)
    if claims is None:
        raise HTTPException(status_code=401, detail="Invalid or expired CAPI ticket")

    lead = db.get(Lead, payload.lead_id)
    if lead is None:
        raise HTTPException(status_code=404, detail="Lead not found")

    vehicle = db.get(Vehicle, lead.vehicle_id) if lead.vehicle_id else None
    if lead.vehicle_id and vehicle is None:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    body, meta_status, content_type = send_lead_event(
        lead,
        vehicle,
        event_id=payload.event_id,
        event_source_url=_trusted_page_url(request),
        fbp=claims.get("fbp"),
        fbc=claims.get("fbc"),
        client_ip_address=_client_ip(request),
        client_user_agent=request.headers.get("user-agent"),
        test_event_code=settings.META_TEST_EVENT_CODE or None,
    )
    return Response(content=body, status_code=meta_status, media_type=content_type)
