from xml.etree.ElementTree import Element, SubElement, tostring

from fastapi import APIRouter, Depends
from fastapi.responses import Response
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.deps import get_db
from app.models.vehicle import Vehicle
from app.services.vehicle_service import HIDDEN_VEHICLE_STATUSES


router = APIRouter(tags=["seo"])
SITE_URL = "https://smithssales.net"
STATIC_PATHS = (
    "/",
    "/inventory",
    "/delivery",
    "/guarantee",
    "/warranty",
    "/about",
    "/team",
    "/contact",
    "/privacy-policy",
    "/terms",
)
SITEMAP_NAMESPACE = "http://www.sitemaps.org/schemas/sitemap/0.9"


@router.get("/sitemap.xml", include_in_schema=False)
def get_sitemap(db: Session = Depends(get_db)) -> Response:
    root = Element("urlset", xmlns=SITEMAP_NAMESPACE)
    paths = list(STATIC_PATHS)
    slugs = db.scalars(
        select(Vehicle.slug)
        .where(Vehicle.status.not_in(HIDDEN_VEHICLE_STATUSES))
        .order_by(Vehicle.slug)
    ).all()
    paths.extend(f"/inventory/{slug}/" for slug in slugs)

    for path in paths:
        url = SubElement(root, f"{{{SITEMAP_NAMESPACE}}}url")
        canonical_path = path if path == "/" or path.endswith("/") else f"{path}/"
        SubElement(url, f"{{{SITEMAP_NAMESPACE}}}loc").text = f"{SITE_URL}{canonical_path}"

    xml = tostring(root, encoding="utf-8", xml_declaration=True)
    return Response(content=xml, media_type="application/xml")
