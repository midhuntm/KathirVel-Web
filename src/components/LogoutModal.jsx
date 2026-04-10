import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const LogoutModal = ({ isOpen, onClose, onLogout }) => {
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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{
              width: '100%', maxWidth: '400px', background: 'var(--color-white)',
              borderRadius: '8px', padding: '2.5rem', textAlign: 'center'
            }}
          >
            <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: '1rem' }}>Sign Out</h2>
            <p style={{ color: 'var(--color-charcoal)', marginBottom: '2rem' }}>Are you sure you want to log out of your account?</p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={onClose} 
                className="btn-secondary"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button 
                onClick={onLogout} 
                className="btn-primary"
                style={{ flex: 1 }}
              >
                Logout
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LogoutModal;
