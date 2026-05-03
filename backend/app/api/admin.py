import os
import smtplib
from datetime import datetime, timedelta, timezone
from email.message import EmailMessage

from fastapi import APIRouter, HTTPException, Depends
import jwt

from ..database import get_database
from ..schemas import AdminInviteRequest, AcceptInviteRequest
from ..core.security import get_password_hash, create_access_token, SECRET_KEY, ALGORITHM
from .auth import serialize_document, require_admin

router = APIRouter()

def send_invitation_email(recipient_email, recipient_name, invite_token):
    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = os.getenv("SMTP_PORT")
    smtp_username = os.getenv("SMTP_USERNAME")
    smtp_password = os.getenv("SMTP_PASSWORD")
    sender_email = os.getenv("SMTP_SENDER_EMAIL", smtp_username)

    

    if not all([smtp_host, smtp_port, smtp_username, smtp_password, sender_email]):
        return False

    message = EmailMessage()
    message["Subject"] = "Admin invitation for KathirVel"
    message["From"] = sender_email
    message["To"] = recipient_email
    message.set_content(
        f"Hello {recipient_name},\n\n"
        "You have been invited as an admin for KathirVel.\n"
        "Please click the secure link below to set your password and access the dashboard:\n"
        f"http://localhost:5173/?invite_token={invite_token}\n\n"
        "Thank you,\nThe KathirVel Team"
    )

    with smtplib.SMTP(smtp_host, int(smtp_port)) as server:
        server.starttls()
        server.login(smtp_username, smtp_password)
        server.send_message(message)

    return True


@router.post("/invite")
def invite_admin(payload: AdminInviteRequest, admin_user=Depends(require_admin)):
    database = get_database()

    inviter_email = admin_user.get("email") or payload.inviter_email

    existing_user = database.user.find_one({"email": payload.email})
    if existing_user:
      raise HTTPException(status_code=409, detail="A user with this email already exists.")

    token = jwt.encode({"sub": payload.email, "role": "admin", "exp": datetime.now(timezone.utc) + timedelta(days=1)}, SECRET_KEY, algorithm=ALGORITHM)

    invitation_document = {
        "name": payload.name,
        "email": payload.email,
        "role": "admin",
        "invited_by": inviter_email,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "status": "pending",
    }
    database.admin_invites.insert_one(invitation_document)

    email_sent = send_invitation_email(payload.email, payload.name, token)
    if email_sent:
        return {"message": f"Admin invite sent to {payload.email}."}

    print(f"SMTP NOT CONFIGURED. TEST LINK FOR {payload.email}: http://localhost:5173/?invite_token={token}")

    return {
        "message": (
            f"Admin invite saved for {payload.email}. "
            "SMTP is not configured yet, so no email was sent. Internal fallback active."
        )
    }

@router.get("/invite/validate")
def validate_invite(token: str):
    try:
        token_payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = token_payload.get("sub")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=400, detail="Invite token has expired.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=400, detail="Invalid invite token structure.")

    database = get_database()
    invite = database.admin_invites.find_one({"email": email, "status": "pending"})
    if not invite:
        raise HTTPException(status_code=404, detail="No pending invite found. The invite might be processed already.")

    return {"valid": True, "email": email, "name": invite.get("name")}

@router.post("/invite/accept")
def accept_invite(payload: AcceptInviteRequest):
    try:
        token_data = jwt.decode(payload.token, SECRET_KEY, algorithms=[ALGORITHM])
        email = token_data.get("sub")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=400, detail="Invite token has naturally expired.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=400, detail="Invalid invite token formatting.")

    database = get_database()
    invite = database.admin_invites.find_one({"email": email, "status": "pending"})
    if not invite:
        raise HTTPException(status_code=404, detail="Invite is invalid or already consumed.")

    existing_user = database.user.find_one({"email": email})
    if existing_user:
        raise HTTPException(status_code=409, detail="Account already exists. Please login instead.")

    user_document = {
        "name": invite.get("name"),
        "email": email,
        "password": get_password_hash(payload.password),
        "role": "admin"
    }
    inserted = database.user.insert_one(user_document)
    created_user = database.user.find_one({"_id": inserted.inserted_id}, {"password": 0})
    
    database.admin_invites.update_one({"_id": invite["_id"]}, {"$set": {"status": "accepted"}})

    serialized = serialize_document(created_user)
    session_token = create_access_token({"sub": serialized["email"], "role": serialized.get("role")})
    return {"message": "Account created successfully.", "user": serialized, "token": session_token}
