import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../store/cartSlice';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Setup Stripe outside component
const stripePromise = loadStripe('pk_test_sample');

const inputStyle = {
  width: '100%',
  background: 'var(--color-white)',
  border: '1px solid var(--color-gray-light)',
  borderRadius: '4px',
  color: 'var(--color-black)',
  padding: '0.9rem 1rem',
  outline: 'none',
  fontFamily: 'var(--font-body)',
  marginBottom: '1rem'
};

const CheckoutForm = ({ totalAmount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required'
    });

    if (error) {
      setErrorMessage(error.message);
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      setIsProcessing(false);
      dispatch(clearCart());
      alert('Secure Payment Successful! Thank you for purchasing from Kathir Vel.');
      navigate('/');
    } else {
      setIsProcessing(false);
      alert('Payment status: ' + paymentIntent?.status);
    }
  };

  return (
    <form id="checkout-form" onSubmit={handleSubmit}>
      <PaymentElement />
      {errorMessage && <div style={{ color: 'red', marginTop: '1rem' }}>{errorMessage}</div>}
      <button
        type="submit"
        className="btn-primary"
        disabled={isProcessing || !stripe || !elements}
        style={{ width: '100%', padding: '1rem', marginTop: '2rem', opacity: isProcessing ? 0.7 : 1 }}
      >
        {isProcessing ? 'Processing Secure Payment...' : `Pay Rs. ${totalAmount}`}
      </button>
    </form>
  );
};

const Checkout = () => {
  const items = useSelector((state) => state.cart.items);
  const currentUser = useSelector((state) => state.user.currentUser);
  const totalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    if (totalAmount > 0) {
      fetch('http://localhost:8000/api/payment/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalAmount })
      })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret))
        .catch((err) => console.error('Failed to create payment intent', err));
    }
  }, [totalAmount]);

  if (items.length === 0) {
    return <div style={{ padding: '8rem', textAlign: 'center' }}>Your cart is empty. Please shop first.</div>;
  }

  return (
    <div style={{ padding: '6rem 5%', minHeight: '80vh', background: 'var(--color-gray-light)' }}>
      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: '3rem', textAlign: 'center' }}>Secure Checkout</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', maxWidth: '1200px', margin: '0 auto' }}>

        {/* Shipping details */}
        <div style={{ background: 'var(--color-white)', padding: '2.5rem', borderRadius: '8px', boxShadow: 'var(--shadow-subtle)' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '2rem' }}>Shipping Information</h3>
          <div>
            <input type="text" placeholder="Full Name" required style={inputStyle} defaultValue={currentUser?.name || ''} />
            <input type="email" placeholder="Email Address" required style={inputStyle} defaultValue={currentUser?.email || ''} />
            <input type="text" placeholder="Address Line 1" required style={inputStyle} />
            <input type="text" placeholder="Address Line 2 (Optional)" style={inputStyle} />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input type="text" placeholder="City" required style={inputStyle} />
              <input type="text" placeholder="Postal Code" required style={inputStyle} />
            </div>
            <input type="text" placeholder="Country" required style={inputStyle} />
          </div>
        </div>

        {/* Payment and Summary */}
        <div style={{ background: 'var(--color-white)', padding: '2.5rem', borderRadius: '8px', border: '1px solid var(--color-gold)', height: 'fit-content', boxShadow: 'var(--shadow-hover)' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '2rem' }}>Payment Details</h3>

          <div style={{ marginBottom: '2rem' }}>
            {clientSecret ? (
              <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                <CheckoutForm totalAmount={totalAmount} />
              </Elements>
            ) : (
              <p>Initializing secure payment gateway...</p>
            )}
          </div>

          <div style={{ borderTop: '1px solid var(--color-gray-light)', paddingTop: '1.5rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--color-charcoal)' }}>
              <span>Order Subtotal</span>
              <span>Rs. {totalAmount}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-black)' }}>
              <span>Total to Pay</span>
              <span>Rs. {totalAmount}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
