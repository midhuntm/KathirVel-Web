import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

const initialForm = { name: '', email: '', password: '' };

const inputStyle = {
  width: '100%',
  background: 'var(--color-white)',
  border: '1px solid var(--color-gray-light)',
  borderRadius: '4px',
  color: 'var(--color-black)',
  padding: '0.9rem 1rem',
  outline: 'none',
  fontFamily: 'var(--font-body)'
};

const LoginModal = ({ isOpen, onClose, onLogin, onRegister }) => {
  const [form, setForm] = useState(initialForm);
  const [mode, setMode] = useState('login');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isOpen) { 
        setForm(initialForm); setMode('login'); setIsSubmitting(false); setError(''); setSuccess(''); 
    }
  }, [isOpen]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); setError(''); setSuccess('');
    try {
      if (mode === 'login') {
        const res = await onLogin({ email: form.email, password: form.password });
        setSuccess(`Welcome back, ${res.user.name}.`);
      } else {
        const res = await onRegister({ name: form.name, email: form.email, password: form.password });
        setSuccess(`Account created for ${res.item.name}.`);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem'
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            style={{
              width: '100%', maxWidth: '440px', background: 'var(--color-white)',
              borderRadius: '8px', boxShadow: 'var(--shadow-hover)', padding: '2.5rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <div>
                <p style={{ color: 'var(--color-gold-dark)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem', fontWeight: 600 }}>Account</p>
                <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-black)' }}>
                  {mode === 'login' ? 'Sign In' : 'Sign Up'}
                </h2>
              </div>
              <button onClick={onClose} style={{ background: 'transparent' }}><X size={24} color="var(--color-charcoal)" /></button>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
              <button 
                type="button" onClick={() => setMode('login')} 
                style={mode === 'login' ? activeTabStyle : inactiveTabStyle}>Sign In</button>
              <button 
                type="button" onClick={() => setMode('register')} 
                style={mode === 'register' ? activeTabStyle : inactiveTabStyle}>Sign Up</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.2rem' }}>
              {mode === 'register' && (
                <input name="name" type="text" value={form.name} onChange={handleChange} placeholder="Full Name" required style={inputStyle} />
              )}
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email address" required style={inputStyle} />
              <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" required style={inputStyle} />
              
              {error && <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>}
              {success && <p style={{ color: 'green', fontSize: '0.9rem' }}>{success}</p>}

              <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ marginTop: '1rem' }}>
                {isSubmitting ? 'Processing...' : mode === 'login' ? 'Access Account' : 'Create Account'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const activeTabStyle = {
  flex: 1, padding: '0.8rem', background: 'transparent', borderBottom: '2px solid var(--color-gold)', 
  color: 'var(--color-black)', fontWeight: 600, fontFamily: 'var(--font-body)', fontSize: '0.9rem'
};
const inactiveTabStyle = {
  flex: 1, padding: '0.8rem', background: 'transparent', borderBottom: '1px solid var(--color-gray-light)', 
  color: 'var(--color-charcoal)', fontFamily: 'var(--font-body)', fontSize: '0.9rem'
};

export default LoginModal;
