import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../store/cartSlice';
import { createOrder } from '../services/api';

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

const CheckoutForm = ({ totalAmount, items, currentUser, shipping }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!currentUser?.email) {
      setErrorMessage('Please login to place an order.');
      return;
    }
    setIsProcessing(true);
    try {
      await createOrder({
        items: items.map((item) => ({
          ornament_id: item.id || item._id,
          quantity: item.quantity || 1,
        })),
        shipping_name: shipping.fullName,
        shipping_email: shipping.email,
        shipping_address: `${shipping.address1}${shipping.address2 ? `, ${shipping.address2}` : ''}, ${shipping.city}, ${shipping.postalCode}, ${shipping.country}`,
      });
      setIsProcessing(false);
      dispatch(clearCart());
      alert('Order placed successfully. Thank you for shopping with Kathir Vel.');
      navigate('/');
    } catch (error) {
      setIsProcessing(false);
      setErrorMessage(error.message || 'Unable to place order.');
    }
  };

  return (
    <form id="checkout-form" onSubmit={handleSubmit}>
      <div style={{ color: 'var(--color-charcoal)', marginBottom: '1rem' }}>
        Payment mode: Cash on Delivery
      </div>
      {errorMessage && <div style={{ color: 'red', marginBottom: '1rem' }}>{errorMessage}</div>}
      <button
        type="submit"
        className="btn-primary"
        disabled={isProcessing}
        style={{ width: '100%', padding: '1rem', marginTop: '2rem', opacity: isProcessing ? 0.7 : 1 }}
      >
        {isProcessing ? 'Placing Order...' : `Place Order (Rs. ${totalAmount})`}
      </button>
    </form>
  );
};

const Checkout = () => {
  const items = useSelector((state) => state.cart.items);
  const currentUser = useSelector((state) => state.user.currentUser);
  const totalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const [shipping, setShipping] = useState({
    fullName: currentUser?.name || '',
    email: currentUser?.email || '',
    address1: '',
    address2: '',
    city: '',
    postalCode: '',
    country: '',
  });

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
            <input type="text" placeholder="Full Name" required style={inputStyle} value={shipping.fullName} onChange={(e) => setShipping((c) => ({ ...c, fullName: e.target.value }))} />
            <input type="email" placeholder="Email Address" required style={inputStyle} value={shipping.email} onChange={(e) => setShipping((c) => ({ ...c, email: e.target.value }))} />
            <input type="text" placeholder="Address Line 1" required style={inputStyle} value={shipping.address1} onChange={(e) => setShipping((c) => ({ ...c, address1: e.target.value }))} />
            <input type="text" placeholder="Address Line 2 (Optional)" style={inputStyle} value={shipping.address2} onChange={(e) => setShipping((c) => ({ ...c, address2: e.target.value }))} />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input type="text" placeholder="City" required style={inputStyle} value={shipping.city} onChange={(e) => setShipping((c) => ({ ...c, city: e.target.value }))} />
              <input type="text" placeholder="Postal Code" required style={inputStyle} value={shipping.postalCode} onChange={(e) => setShipping((c) => ({ ...c, postalCode: e.target.value }))} />
            </div>
            <input type="text" placeholder="Country" required style={inputStyle} value={shipping.country} onChange={(e) => setShipping((c) => ({ ...c, country: e.target.value }))} />
          </div>
        </div>

        {/* Payment and Summary */}
        <div style={{ background: 'var(--color-white)', padding: '2.5rem', borderRadius: '8px', border: '1px solid var(--color-gold)', height: 'fit-content', boxShadow: 'var(--shadow-hover)' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '2rem' }}>Payment Details</h3>

          <div style={{ marginBottom: '2rem' }}>
            <CheckoutForm totalAmount={totalAmount} items={items} currentUser={currentUser} shipping={shipping} />
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
