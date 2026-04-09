import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

const initialForm = {
  name: '',
  email: '',
  password: '',
};

const inputStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '10px',
  color: 'var(--text-primary)',
  padding: '0.9rem 1rem',
  outline: 'none',
};

const LoginModal = ({ isOpen, onClose, onLogin, onRegister }) => {
  const [form, setForm] = useState(initialForm);
  const [mode, setMode] = useState('login');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setForm(initialForm);
      setMode('login');
      setIsSubmitting(false);
      setError('');
      setSuccess('');
    }
  }, [isOpen]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      if (mode === 'login') {
        const response = await onLogin({
          email: form.email,
          password: form.password,
        });
        setSuccess(`Welcome back, ${response.user.name}.`);
      } else {
        const response = await onRegister({
          name: form.name,
          email: form.email,
          password: form.password,
        });
        setSuccess(`Account created for ${response.item.name} as customer.`);
      }
    } catch (submitError) {
      setError(submitError.message || 'Authentication failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            zIndex: 150
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            style={{
              width: '100%',
              maxWidth: '440px',
              background: 'linear-gradient(180deg, rgba(20,20,20,0.98) 0%, rgba(10,10,10,0.98) 100%)',
              border: '1px solid var(--glass-border)',
              borderRadius: '18px',
              boxShadow: '0 24px 80px rgba(0,0,0,0.45)',
              padding: '2rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div>
                <p style={{ color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.16em', fontSize: '0.75rem' }}>
                  Account Access
                </p>
                <h2 style={{ marginTop: '0.4rem', fontSize: '2rem' }}>
                  {mode === 'login' ? 'Sign In' : 'Sign Up'}
                </h2>
              </div>
              <button onClick={onClose} style={{ color: 'var(--text-secondary)' }} aria-label="Close login form">
                <X size={20} />
              </button>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.6rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '999px',
                padding: '0.35rem',
                marginBottom: '1.5rem',
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                  setSuccess('');
                }}
                style={mode === 'login' ? activeTabStyle : inactiveTabStyle}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError('');
                  setSuccess('');
                }}
                style={mode === 'register' ? activeTabStyle : inactiveTabStyle}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
              {mode === 'register' && (
                <label style={{ display: 'grid', gap: '0.45rem' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Name</span>
                  <input
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="KathirVel"
                    required
                    style={inputStyle}
                  />
                </label>
              )}

              <label style={{ display: 'grid', gap: '0.45rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Email</span>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="admin@example.com"
                  required
                  style={inputStyle}
                />
              </label>

              <label style={{ display: 'grid', gap: '0.45rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Password</span>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  style={inputStyle}
                />
              </label>
              {error && <p style={{ color: '#ffb3b3', fontSize: '0.9rem' }}>{error}</p>}
              {success && <p style={{ color: '#b7f5c5', fontSize: '0.9rem' }}>{success}</p>}

              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
                style={{ width: '100%', padding: '0.95rem 1.25rem', opacity: isSubmitting ? 0.75 : 1 }}
              >
                {isSubmitting
                  ? 'Please wait...'
                  : mode === 'login'
                    ? 'Login to Dashboard'
                    : 'Create Account'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const activeTabStyle = {
  background: 'var(--accent-gold)',
  color: 'var(--bg-primary)',
  borderRadius: '999px',
  padding: '0.7rem 1rem',
  fontWeight: 600,
};

const inactiveTabStyle = {
  color: 'var(--text-secondary)',
  borderRadius: '999px',
  padding: '0.7rem 1rem',
};

export default LoginModal;
