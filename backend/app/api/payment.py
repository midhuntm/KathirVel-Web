import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import stripe

router = APIRouter()

stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "sk_test_placeholder_while_dev")

class PaymentIntentRequest(BaseModel):
    amount: float
    currency: str = "inr"
    receipt_email: str = None

@router.post("/create-payment-intent")
def create_payment_intent(payload: PaymentIntentRequest):
    try:
        # Stripe requires amount in smallest currency unit (e.g. paise for INR)
        amount_in_paise = int(payload.amount * 100)
        
        intent = stripe.PaymentIntent.create(
            amount=amount_in_paise,
            currency=payload.currency,
            receipt_email=payload.receipt_email,
            automatic_payment_methods={"enabled": True},
        )
        return {"clientSecret": intent.client_secret}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
