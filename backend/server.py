from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import asyncio
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr, constr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import resend


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Email config
RESEND_API_KEY = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
CONTACT_RECIPIENT_EMAIL = os.environ.get('CONTACT_RECIPIENT_EMAIL', '')
if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# ============== Models ==============
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class ContactCreate(BaseModel):
    name: constr(strip_whitespace=True, min_length=1, max_length=120)
    email: EmailStr
    subject: Optional[constr(strip_whitespace=True, max_length=200)] = None
    message: constr(strip_whitespace=True, min_length=10, max_length=4000)


class ContactResponse(BaseModel):
    id: str
    status: str
    email_id: Optional[str] = None


# ============== Routes ==============
@api_router.get("/")
async def root():
    return {"message": "Hello World"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.model_dump())
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    rows = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for r in rows:
        if isinstance(r['timestamp'], str):
            r['timestamp'] = datetime.fromisoformat(r['timestamp'])
    return rows


def _build_contact_email_html(name: str, email: str, subject: str, message: str) -> str:
    safe_msg = (message or "").replace("\n", "<br/>")
    return f"""
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#05060a;padding:32px 0;font-family:Arial,Helvetica,sans-serif;">
      <tr><td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#0a0b12;border:1px solid #1a1b22;border-radius:4px;color:#d0d0d0;">
          <tr><td style="padding:28px 32px 8px 32px;font-size:11px;letter-spacing:4px;color:#6a00ff;">NEW CONTACT MESSAGE</td></tr>
          <tr><td style="padding:0 32px 24px 32px;font-size:22px;color:#ffffff;letter-spacing:1px;">{subject or 'Inquiry from website'}</td></tr>
          <tr><td style="padding:0 32px 8px 32px;font-size:12px;color:#9a9aa3;">FROM</td></tr>
          <tr><td style="padding:0 32px 16px 32px;font-size:14px;color:#ffffff;">{name} &lt;{email}&gt;</td></tr>
          <tr><td style="padding:0 32px 8px 32px;font-size:12px;color:#9a9aa3;">MESSAGE</td></tr>
          <tr><td style="padding:0 32px 28px 32px;font-size:14px;line-height:1.6;color:#d0d0d0;">{safe_msg}</td></tr>
        </table>
      </td></tr>
    </table>
    """


@api_router.post("/contact", response_model=ContactResponse)
async def submit_contact(payload: ContactCreate):
    # Persist every submission (also acts as backup if email delivery fails)
    record_id = str(uuid.uuid4())
    doc = {
        "id": record_id,
        "name": payload.name,
        "email": payload.email,
        "subject": payload.subject or "",
        "message": payload.message,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "email_status": "pending",
        "email_id": None,
    }
    await db.contact_submissions.insert_one(doc)

    # If recipient or API key not configured, accept the submission but skip sending
    if not RESEND_API_KEY or not CONTACT_RECIPIENT_EMAIL:
        await db.contact_submissions.update_one(
            {"id": record_id},
            {"$set": {"email_status": "skipped_not_configured"}},
        )
        logger.info("Contact submission stored without email send (Resend not configured).")
        return ContactResponse(id=record_id, status="stored")

    params = {
        "from": SENDER_EMAIL,
        "to": [CONTACT_RECIPIENT_EMAIL],
        "reply_to": payload.email,
        "subject": payload.subject or f"New inquiry from {payload.name}",
        "html": _build_contact_email_html(
            payload.name, payload.email, payload.subject or "", payload.message
        ),
    }

    try:
        result = await asyncio.to_thread(resend.Emails.send, params)
        email_id = result.get("id") if isinstance(result, dict) else None
        await db.contact_submissions.update_one(
            {"id": record_id},
            {"$set": {"email_status": "sent", "email_id": email_id}},
        )
        return ContactResponse(id=record_id, status="sent", email_id=email_id)
    except Exception as e:
        logger.error(f"Resend send failed: {e}")
        await db.contact_submissions.update_one(
            {"id": record_id},
            {"$set": {"email_status": f"failed: {str(e)[:200]}"}},
        )
        raise HTTPException(status_code=502, detail="Email delivery failed. Please try again later.")


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
