import React from 'react';

const cardStyle = {
  background: 'linear-gradient(180deg, rgba(20,20,20,0.95) 0%, rgba(14,14,14,0.95) 100%)',
  border: '1px solid var(--glass-border)',
  borderRadius: '18px',
  padding: '1.5rem',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
};

const cellStyle = {
  borderTop: '1px solid rgba(255,255,255,0.06)',
  padding: '0.9rem 0.75rem',
  textAlign: 'left',
  wordBreak: 'break-word',
};

const DataTable = ({ columns, rows, rawItems, onRowClick, emptyMessage, isLoading, error }) => {
  if (isLoading) {
    return <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: '#ffb3b3' }}>{error}</p>;
  }

  if (!rows.length) {
    return <p style={{ color: 'var(--text-secondary)' }}>{emptyMessage}</p>;
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={tableStyle}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column} style={{ ...cellStyle, borderTop: 'none', color: 'var(--text-secondary)', fontWeight: 500 }}>
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
            >
              {row.map((value, cellIndex) => (
                <td
                  key={`${value}-${cellIndex}`}
                  style={{
                    ...cellStyle,
                    color: cellIndex === row.length - 1 ? 'var(--accent-gold)' : 'var(--text-primary)',
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

const AdminInviteCard = ({ currentUser, onInviteAdmin }) => {
  const [form, setForm] = React.useState({ name: '', email: '' });
  const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    setError('');

    try {
      const response = await onInviteAdmin({
        inviter_email: currentUser.email,
        name: form.name,
        email: form.email,
      });
      setMessage(response.message);
      setForm({ name: '', email: '' });
    } catch (submitError) {
      setError(submitError.message || 'Unable to send invite.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ ...cardStyle, gridColumn: '1 / -1' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h3 style={{ fontSize: '1.5rem' }}>Admin Invite</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
            Logged in as admin. Invite a new admin by email from here.
          </p>
        </div>
        <span style={{ color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Admin only
        </span>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', alignItems: 'end' }}>
        <label style={{ display: 'grid', gap: '0.45rem' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Admin name</span>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="New Admin"
            required
            style={inputStyle}
          />
        </label>

        <label style={{ display: 'grid', gap: '0.45rem' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Admin email</span>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="newadmin@example.com"
            required
            style={inputStyle}
          />
        </label>

        <button
          type="submit"
          className="btn-primary"
          disabled={isSubmitting}
          style={{ width: '100%', padding: '0.95rem 1.25rem', opacity: isSubmitting ? 0.75 : 1 }}
        >
          {isSubmitting ? 'Sending...' : 'Invite Admin'}
        </button>
      </form>

      {message && <p style={{ color: '#b7f5c5', marginTop: '1rem' }}>{message}</p>}
      {error && <p style={{ color: '#ffb3b3', marginTop: '1rem' }}>{error}</p>}
    </div>
  );
};

const UploadOrnamentCard = ({ onCreateOrnament }) => {
  const [form, setForm] = React.useState({ name: '', category: '', price: '' });
  const [imageBase64, setImageBase64] = React.useState(null);
  const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    setError('');

    try {
      await onCreateOrnament({
        name: form.name,
        category: form.category,
        price: Number(form.price),
        image: imageBase64
      });
      setMessage('Ornament successfully uploaded!');
      setForm({ name: '', category: '', price: '' });
      setImageBase64(null);
    } catch (submitError) {
      setError(submitError.message || 'Unable to upload ornament.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ ...cardStyle, gridColumn: '1 / -1' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h3 style={{ fontSize: '1.5rem' }}>Upload Ornament</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
            Add a new product to the collection.
          </p>
        </div>
        <span style={{ color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Admin only
        </span>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', alignItems: 'end' }}>
        <label style={{ display: 'grid', gap: '0.45rem' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Name</span>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Gold Necklace" required style={inputStyle} />
        </label>

        <label style={{ display: 'grid', gap: '0.45rem' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Category</span>
          <select name="category" value={form.category} onChange={handleChange} required style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
            <option value="" disabled>Select category</option>
            <option value="Ring">Ring</option>
            <option value="Necklace">Necklace</option>
          </select>
        </label>

        <label style={{ display: 'grid', gap: '0.45rem' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Rate (Rs.)</span>
          <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="5000" min="0" required style={inputStyle} />
        </label>

        <label style={{ display: 'grid', gap: '0.45rem' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Image</span>
          <input type="file" accept="image/*" onChange={handleImage} style={{ ...inputStyle, padding: '0.7rem 1rem' }} />
        </label>

        <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ width: '100%', padding: '0.95rem 1.25rem', opacity: isSubmitting ? 0.75 : 1 }}>
          {isSubmitting ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      {message && <p style={{ color: '#b7f5c5', marginTop: '1rem' }}>{message}</p>}
      {error && <p style={{ color: '#ffb3b3', marginTop: '1rem' }}>{error}</p>}
    </div>
  );
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

const DataOverview = ({
  ornaments,
  users,
  orders,
  currentUser,
  isLoading,
  error,
  onInviteAdmin,
  onCreateOrnament,
  onNavigateToUser,
  onNavigateToOrder,
}) => {
  const [activeTab, setActiveTab] = React.useState('users');

  const navCardStyle = (isActive) => ({
    ...cardStyle,
    cursor: 'pointer',
    border: isActive ? '1px solid var(--accent-gold)' : '1px solid var(--glass-border)',
    background: isActive ? 'linear-gradient(180deg, rgba(30,25,15,0.95) 0%, rgba(20,18,12,0.95) 100%)' : cardStyle.background,
    transition: 'all 0.3s ease',
  });

  return (
    <section id="dashboard" style={{ padding: '8rem 0 8rem' }}>
      <div className="container">
        
        {/* Top Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          
          <div style={navCardStyle(activeTab === 'users')} onClick={() => setActiveTab('users')}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Total Users</h3>
            <span style={{ fontSize: '2.5rem', color: 'var(--text-primary)' }}>{users.length}</span>
          </div>

          <div style={navCardStyle(activeTab === 'ornaments')} onClick={() => setActiveTab('ornaments')}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Total Ornaments</h3>
            <span style={{ fontSize: '2.5rem', color: 'var(--text-primary)' }}>{ornaments.length}</span>
          </div>

          <div style={navCardStyle(activeTab === 'orders')} onClick={() => setActiveTab('orders')}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Total Orders</h3>
            <span style={{ fontSize: '2.5rem', color: 'var(--text-primary)' }}>{orders.length}</span>
          </div>

        </div>

        {/* Dynamic Detail Panels */}
        <div style={{ display: 'grid', gap: '2rem' }}>
          
          {/* USER TAB CONTENT */}
          {activeTab === 'users' && (
            <>
              {currentUser?.role?.toLowerCase() === 'admin' && (
                <AdminInviteCard currentUser={currentUser} onInviteAdmin={onInviteAdmin} />
              )}
              
              <div style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.5rem' }}>Users Database</h3>
                </div>
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

          {/* ORNAMENTS TAB CONTENT */}
          {activeTab === 'ornaments' && (
            <>
              {currentUser?.role?.toLowerCase() === 'admin' && (
                <UploadOrnamentCard onCreateOrnament={onCreateOrnament} />
              )}

              <div style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.5rem' }}>Ornaments Inventory</h3>
                </div>
                <DataTable
                  columns={['Name', 'Category', 'Price']}
                  rows={ornaments.map((ornament) => [
                    ornament.name,
                    ornament.category || 'Uncategorized',
                    `Rs. ${ornament.price}`,
                  ])}
                  emptyMessage="No ornaments found."
                  isLoading={isLoading}
                  error={error}
                />
              </div>
            </>
          )}

          {/* ORDERS TAB CONTENT */}
          {activeTab === 'orders' && (
            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.5rem' }}>Order Records</h3>
              </div>
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
