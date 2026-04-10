import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { removeFromCart, updateQuantity } from '../store/cartSlice';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const items = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const totalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div style={{ padding: '8rem 5%', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <ShoppingBag size={64} color="var(--color-gold)" style={{ marginBottom: '2rem' }} />
        <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: '1rem' }}>Your Cart is Empty</h2>
        <p style={{ color: 'var(--color-charcoal)', marginBottom: '2rem' }}>Discover our premium collections.</p>
        <button className="btn-primary" onClick={() => navigate('/shop')}>Start Shopping</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '6rem 5%', minHeight: '80vh', background: 'var(--color-gray-light)' }}>
      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: '3rem', textAlign: 'center' }}>Shopping Cart</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Cart Items */}
        <div>
          {items.map((item) => (
            <div key={item.id} style={{
              display: 'flex', gap: '1.5rem', padding: '1.5rem', background: 'var(--color-white)', 
              borderRadius: '8px', marginBottom: '1rem', boxShadow: 'var(--shadow-subtle)', alignItems: 'center'
            }}>
              <img src={item.image || 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=200&q=80'} alt={item.name} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }} />
              
              <div style={{ flex: 1 }}>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: '0.25rem' }}>{item.name}</h4>
                <p style={{ color: 'var(--color-charcoal)', fontSize: '0.9rem', marginBottom: '1rem' }}>{item.category}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-gray-light)', borderRadius: '4px' }}>
                    <button onClick={() => dispatch(updateQuantity({ id: item.id, quantity: Math.max(1, item.quantity - 1) }))} style={{ padding: '0.25rem 0.5rem', background: 'transparent' }}><Minus size={14} /></button>
                    <span style={{ padding: '0 0.5rem', fontSize: '0.9rem' }}>{item.quantity}</span>
                    <button onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))} style={{ padding: '0.25rem 0.5rem', background: 'transparent' }}><Plus size={14} /></button>
                  </div>
                  <button onClick={() => dispatch(removeFromCart(item.id))} style={{ color: 'red', background: 'transparent', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem' }}>
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </div>
              
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: 'var(--color-gold)', fontWeight: 600 }}>Rs. {item.price * item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div style={{ background: 'var(--color-white)', padding: '2.5rem', borderRadius: '8px', border: '1px solid var(--color-gold)', height: 'fit-content', boxShadow: 'var(--shadow-hover)' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--color-gray-light)', paddingBottom: '1rem' }}>Order Summary</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--color-charcoal)' }}>
            <span>Subtotal ({items.length} items)</span>
            <span>Rs. {totalAmount}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', color: 'var(--color-charcoal)' }}>
            <span>Shipping</span>
            <span>Complimentary</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-black)' }}>
            <span>Total</span>
            <span>Rs. {totalAmount}</span>
          </div>

          <button className="btn-primary" onClick={() => navigate('/checkout')} style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '1rem' }}>
            Proceed to Checkout <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default Cart;
