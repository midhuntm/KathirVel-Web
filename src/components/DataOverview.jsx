import React from 'react';

const cardStyle = {
  background: 'var(--color-white)',
  border: '1px solid var(--color-gray-light)',
  borderRadius: '8px',
  padding: '2rem',
  boxShadow: 'var(--shadow-subtle)',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
};

const cellStyle = {
  borderTop: '1px solid var(--color-gray-light)',
  padding: '1rem 0.75rem',
  textAlign: 'left',
  wordBreak: 'break-word',
  fontFamily: 'var(--font-body)',
};

const DataTable = ({ columns, rows, rawItems, onRowClick, emptyMessage, isLoading, error }) => {
  if (isLoading) return <p style={{ color: 'var(--color-charcoal)' }}>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!rows.length) return <p style={{ color: 'var(--color-charcoal)' }}>{emptyMessage}</p>;

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={tableStyle}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column} style={{ ...cellStyle, borderTop: 'none', color: 'var(--color-charcoal)', fontWeight: 600 }}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr 
              key={`${row[0]}-${rowIndex}`}
              onClick={() => onRowClick && onRowClick(rawItems ? rawItems[rowIndex] : null)}
              style={onRowClick ? { cursor: 'pointer', transition: 'background 0.2s' } : {}}
              onMouseEnter={(e) => {
                 if (onRowClick) e.currentTarget.style.backgroundColor = 'var(--color-gray-light)';
              }}
              onMouseLeave={(e) => {
                 if (onRowClick) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {row.map((value, cellIndex) => (
                <td
                  key={`${value}-${cellIndex}`}
                  style={{
                    ...cellStyle,
                    color: cellIndex === row.length - 1 ? 'var(--color-gold-dark)' : 'var(--color-black)',
                    fontWeight: cellIndex === row.length - 1 ? 600 : 400
                  }}
                >
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  background: 'var(--color-white)',
  border: '1px solid var(--color-gray-light)',
  borderRadius: '4px',
  color: 'var(--color-black)',
  padding: '0.9rem 1rem',
  outline: 'none',
  fontFamily: 'var(--font-body)',
};

const AdminInviteCard = ({ currentUser, onInviteAdmin }) => {
  const [form, setForm] = React.useState({ name: '', email: '' });
  const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleChange = (e) => setForm((c) => ({ ...c, [e.target.name]: e.target.value }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); setMessage(''); setError('');
    try {
      const res = await onInviteAdmin({ inviter_email: currentUser.email, name: form.name, email: form.email });
      setMessage(res.message);
      setForm({ name: '', email: '' });
    } catch (err) {
      setError(err.message || 'Unable to send invite.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ ...cardStyle, gridColumn: '1 / -1' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div>
          <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)' }}>Admin Invite</h3>
          <p style={{ color: 'var(--color-charcoal)', marginTop: '0.35rem', fontFamily: 'var(--font-body)' }}>Logged in as admin. Invite a new admin by email from here.</p>
        </div>
        <span style={{ color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem', fontWeight: 600 }}>Admin Access</span>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', alignItems: 'end' }}>
        <label style={{ display: 'grid', gap: '0.45rem' }}>
          <span style={{ color: 'var(--color-charcoal)', fontSize: '0.9rem' }}>Admin name</span>
          <input name="name" value={form.name} onChange={handleChange} placeholder="New Admin" required style={inputStyle} />
        </label>
        <label style={{ display: 'grid', gap: '0.45rem' }}>
          <span style={{ color: 'var(--color-charcoal)', fontSize: '0.9rem' }}>Admin email</span>
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="newadmin@example.com" required style={inputStyle} />
        </label>
        <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ width: '100%', padding: '0.95rem 1.25rem', opacity: isSubmitting ? 0.75 : 1 }}>
          {isSubmitting ? 'Sending...' : 'Invite Admin'}
        </button>
      </form>
      {message && <p style={{ color: 'green', marginTop: '1rem' }}>{message}</p>}
      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
    </div>
  );
};

const UploadOrnamentCard = ({ onCreateOrnament }) => {
  const [form, setForm] = React.useState({ name: '', category: '', price: '', originalPrice: '' });
  const [imageBase64, setImageBase64] = React.useState(null);
  const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleChange = (e) => setForm((c) => ({ ...c, [e.target.name]: e.target.value }));
  const handleImage = (localEvent) => {
    const file = localEvent.target.files[0];
    if (file) {
      const r = new FileReader();
      r.onloadend = () => setImageBase64(r.result);
      r.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); setMessage(''); setError('');
    try {
      const payload = { 
        name: form.name, 
        category: form.category, 
        price: Number(form.price), 
        image: imageBase64 
      };
      if (form.originalPrice) {
         payload.originalPrice = Number(form.originalPrice);
      }
      await onCreateOrnament(payload);
      setMessage('Ornament successfully uploaded!');
      setForm({ name: '', category: '', price: '', originalPrice: '' });
      setImageBase64(null);
    } catch (err) {
      setError(err.message || 'Unable to upload ornament.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ ...cardStyle, gridColumn: '1 / -1' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div>
          <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)' }}>Upload Ornament</h3>
          <p style={{ color: 'var(--color-charcoal)', marginTop: '0.35rem', fontFamily: 'var(--font-body)' }}>Add a new product to the collection.</p>
        </div>
        <span style={{ color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem', fontWeight: 600 }}>Admin Access</span>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', alignItems: 'end' }}>
        <label style={{ display: 'grid', gap: '0.45rem' }}>
          <span style={{ color: 'var(--color-charcoal)', fontSize: '0.9rem' }}>Name</span>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Gold Necklace" required style={inputStyle} />
        </label>
        <label style={{ display: 'grid', gap: '0.45rem' }}>
          <span style={{ color: 'var(--color-charcoal)', fontSize: '0.9rem' }}>Category</span>
          <select name="category" value={form.category} onChange={handleChange} required style={{ ...inputStyle, cursor: 'pointer' }}>
            <option value="" disabled>Select category</option>
            <option value="Ring">Ring</option>
            <option value="Necklace">Necklace</option>
          </select>
        </label>
        <label style={{ display: 'grid', gap: '0.45rem' }}>
          <span style={{ color: 'var(--color-charcoal)', fontSize: '0.9rem' }}>Crossed Rate / Original Price (Rs.) [Optional]</span>
          <input name="originalPrice" type="number" value={form.originalPrice} onChange={handleChange} placeholder="6000" min="0" style={inputStyle} />
        </label>
        <label style={{ display: 'grid', gap: '0.45rem' }}>
          <span style={{ color: 'var(--color-charcoal)', fontSize: '0.9rem' }}>Final Selling Price (Rs.)</span>
          <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="5000" min="0" required style={inputStyle} />
        </label>
        <label style={{ display: 'grid', gap: '0.45rem' }}>
          <span style={{ color: 'var(--color-charcoal)', fontSize: '0.9rem' }}>Image URL / File</span>
          <input type="file" accept="image/*" onChange={handleImage} style={{ ...inputStyle, padding: '0.7rem 1rem' }} />
        </label>
        <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ width: '100%', padding: '0.95rem 1.25rem', opacity: isSubmitting ? 0.75 : 1 }}>
          {isSubmitting ? 'Uploading...' : 'Upload Data'}
        </button>
      </form>
      {message && <p style={{ color: 'green', marginTop: '1rem' }}>{message}</p>}
      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
    </div>
  );
};

const DataOverview = ({ ornaments, users, orders, currentUser, isLoading, error, onInviteAdmin, onCreateOrnament, onNavigateToUser, onNavigateToOrder }) => {
  const [activeTab, setActiveTab] = React.useState('users');

  const navCardStyle = (isActive) => ({
    ...cardStyle,
    cursor: 'pointer',
    border: isActive ? '2px solid var(--color-gold)' : '1px solid var(--color-gray-light)',
    background: isActive ? 'var(--color-cream)' : 'var(--color-white)',
    boxShadow: isActive ? 'var(--shadow-hover)' : 'var(--shadow-subtle)',
    transition: 'all var(--transition-smooth)',
  });

  return (
    <section style={{ padding: '6rem 0', background: 'var(--color-gray-light)', minHeight: '80vh' }}>
      <div className="container">
        
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', color: 'var(--color-black)' }}>Admin Dashboard</h2>
          <p style={{ color: 'var(--color-charcoal)' }}>Manage users, products, and orders.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          <div style={navCardStyle(activeTab === 'users')} onClick={() => setActiveTab('users')}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--color-charcoal)', fontFamily: 'var(--font-body)' }}>Total Users</h3>
            <span style={{ fontSize: '2.5rem', color: 'var(--color-black)', fontWeight: 600 }}>{users.length}</span>
          </div>
          <div style={navCardStyle(activeTab === 'ornaments')} onClick={() => setActiveTab('ornaments')}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--color-charcoal)', fontFamily: 'var(--font-body)' }}>Total Ornaments</h3>
            <span style={{ fontSize: '2.5rem', color: 'var(--color-black)', fontWeight: 600 }}>{ornaments.length}</span>
          </div>
          <div style={navCardStyle(activeTab === 'orders')} onClick={() => setActiveTab('orders')}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--color-charcoal)', fontFamily: 'var(--font-body)' }}>Total Orders</h3>
            <span style={{ fontSize: '2.5rem', color: 'var(--color-black)', fontWeight: 600 }}>{orders.length}</span>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '2rem' }}>
          
          {activeTab === 'users' && (
            <>
              {currentUser?.role?.toLowerCase() === 'admin' && <AdminInviteCard currentUser={currentUser} onInviteAdmin={onInviteAdmin} />}
              <div style={cardStyle}>
                <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', marginBottom: '1rem' }}>Users Database</h3>
                <DataTable
                  columns={['Name', 'Email', 'Role']}
                  rows={users.map((user) => [user.name, user.email, user.role || 'customer'])}
                  rawItems={users}
                  onRowClick={onNavigateToUser}
                  emptyMessage="No users found."
                  isLoading={isLoading}
                  error={error}
                />
              </div>
            </>
          )}

          {activeTab === 'ornaments' && (
            <>
              {currentUser?.role?.toLowerCase() === 'admin' && <UploadOrnamentCard onCreateOrnament={onCreateOrnament} />}
              <div style={cardStyle}>
                <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', marginBottom: '1rem' }}>Ornaments Inventory</h3>
                <DataTable
                  columns={['Name', 'Category', 'Price']}
                  rows={ornaments.map((ornament) => [ornament.name, ornament.category || 'Uncategorized', `Rs. ${ornament.price}`])}
                  emptyMessage="No ornaments found."
                  isLoading={isLoading}
                  error={error}
                />
              </div>
            </>
          )}

          {activeTab === 'orders' && (
            <div style={cardStyle}>
              <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', marginBottom: '1rem' }}>Order Records</h3>
              <DataTable
                columns={['Order ID', 'User']}
                rows={orders.map((order) => [order.id, order.user?.name || 'Unknown user'])}
                rawItems={orders}
                onRowClick={onNavigateToOrder}
                emptyMessage="No recent orders."
                isLoading={isLoading}
                error={error}
              />
            </div>
          )}

        </div>
      </div>
    </section>
  );
};

export default DataOverview;
