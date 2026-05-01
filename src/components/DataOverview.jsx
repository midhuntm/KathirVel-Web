import React from 'react';

const cardStyle = {
  background: 'linear-gradient(180deg, #ffffff 0%, #fffefb 100%)',
  border: '1px solid #eee2c8',
  borderRadius: '16px',
  padding: '2rem',
  boxShadow: '0 10px 20px rgba(28, 20, 5, 0.06)',
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
  border: '1px solid #e8dcc2',
  borderRadius: '10px',
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
  const [form, setForm] = React.useState({
    name: '',
    category: '',
    price: '',
    originalPrice: '',
  });
  const [imageBase64List, setImageBase64List] = React.useState([]);
  const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleChange = (e) => setForm((c) => ({ ...c, [e.target.name]: e.target.value }));
  const handleImage = async (localEvent) => {
    const files = Array.from(localEvent.target.files || []);
    if (!files.length) {
      setImageBase64List([]);
      return;
    }
    const encodeFile = (file) =>
      new Promise((resolve) => {
        const r = new FileReader();
        r.onloadend = () => resolve(r.result);
        r.readAsDataURL(file);
      });
    const encoded = await Promise.all(files.map((file) => encodeFile(file)));
    setImageBase64List(encoded.filter(Boolean));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); setMessage(''); setError('');
    try {
      const payload = { 
        name: form.name, 
        category: form.category, 
        price: Number(form.price), 
        image: imageBase64List[0] || null,
        images: imageBase64List,
      };
      if (form.originalPrice) {
         payload.originalPrice = Number(form.originalPrice);
      }
      await onCreateOrnament(payload);
      setMessage('Ornament successfully uploaded!');
      setForm({ name: '', category: '', price: '', originalPrice: '' });
      setImageBase64List([]);
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
          <span style={{ color: 'var(--color-charcoal)', fontSize: '0.9rem' }}>Product Images (Multiple)</span>
          <input type="file" accept="image/*" multiple onChange={handleImage} style={{ ...inputStyle, padding: '0.7rem 1rem' }} />
        </label>
        <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ width: '100%', padding: '0.95rem 1.25rem', opacity: isSubmitting ? 0.75 : 1 }}>
          {isSubmitting ? 'Uploading...' : 'Upload Data'}
        </button>
      </form>
      <p style={{ marginTop: '0.75rem', color: 'var(--color-charcoal)' }}>
        {imageBase64List.length > 0 ? `${imageBase64List.length} image(s) selected` : 'Select one or more images'}
      </p>
      {imageBase64List.length > 0 && (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.6rem' }}>
          {imageBase64List.slice(0, 6).map((img, index) => (
            <img
              key={`${index}-${img.slice(0, 24)}`}
              src={img}
              alt={`preview-${index + 1}`}
              style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #e3d8bf' }}
            />
          ))}
        </div>
      )}
      {message && <p style={{ color: 'green', marginTop: '1rem' }}>{message}</p>}
      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
    </div>
  );
};

const DataOverview = ({ ornaments, users, orders, currentUser, isLoading, error, onInviteAdmin, onCreateOrnament, onDeleteOrnament, onNavigateToUser, onNavigateToOrder }) => {
  const [activeTab, setActiveTab] = React.useState('users');
  const [deleteLoadingId, setDeleteLoadingId] = React.useState('');

  const handleDeleteOrnament = async (ornamentId) => {
    const ok = window.confirm('Delete this ornament? This action cannot be undone.');
    if (!ok) return;
    try {
      setDeleteLoadingId(ornamentId);
      await onDeleteOrnament(ornamentId);
    } finally {
      setDeleteLoadingId('');
    }
  };

  const navCardStyle = (isActive) => ({
    ...cardStyle,
    cursor: 'pointer',
    border: isActive ? '2px solid var(--color-gold)' : '1px solid #eadfcb',
    background: isActive ? 'linear-gradient(135deg, #fff6db 0%, #fffdf7 100%)' : 'linear-gradient(180deg, #ffffff 0%, #fffefb 100%)',
    boxShadow: isActive ? '0 14px 24px rgba(71, 49, 9, 0.14)' : '0 8px 16px rgba(54, 40, 12, 0.06)',
    transition: 'all var(--transition-smooth)',
  });

  return (
    <section style={{ padding: '6rem 0', background: 'radial-gradient(circle at top, #fff9ea 0%, #f7f3ea 38%, #f2f0ec 100%)', minHeight: '80vh' }}>
      <div className="container" style={{ padding: '0 5%' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '3rem', background: '#ffffffb8', border: '1px solid #efe5d4', borderRadius: '16px', padding: '1.8rem 1rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.7rem', color: 'var(--color-black)' }}>Admin Dashboard</h2>
          <p style={{ color: 'var(--color-charcoal)' }}>Manage users, products, and orders with a cleaner workflow.</p>
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
                {isLoading && <p style={{ color: 'var(--color-charcoal)' }}>Loading...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {!isLoading && !error && ornaments.length === 0 && <p style={{ color: 'var(--color-charcoal)' }}>No ornaments found.</p>}
                {!isLoading && !error && ornaments.length > 0 && (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={tableStyle}>
                      <thead>
                        <tr>
                          <th style={{ ...cellStyle, borderTop: 'none', color: 'var(--color-charcoal)', fontWeight: 600 }}>Name</th>
                          <th style={{ ...cellStyle, borderTop: 'none', color: 'var(--color-charcoal)', fontWeight: 600 }}>Category</th>
                          <th style={{ ...cellStyle, borderTop: 'none', color: 'var(--color-charcoal)', fontWeight: 600 }}>Price</th>
                          <th style={{ ...cellStyle, borderTop: 'none', color: 'var(--color-charcoal)', fontWeight: 600 }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ornaments.map((ornament) => {
                          const ornamentId = ornament.id || ornament._id;
                          return (
                            <tr key={ornamentId}>
                              <td style={cellStyle}>{ornament.name}</td>
                              <td style={cellStyle}>{ornament.category || 'Uncategorized'}</td>
                              <td style={cellStyle}>Rs. {ornament.price}</td>
                              <td style={cellStyle}>
                                <button
                                  className="btn-secondary"
                                  disabled={deleteLoadingId === ornamentId}
                                  onClick={() => handleDeleteOrnament(ornamentId)}
                                  style={{ padding: '0.45rem 0.8rem', fontSize: '0.75rem' }}
                                >
                                  {deleteLoadingId === ornamentId ? 'Deleting...' : 'Delete'}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
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
