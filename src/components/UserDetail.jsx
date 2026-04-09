import React from 'react';
import { getOrdersForUser } from '../utils/orders';

const cardStyle = {
  background: 'linear-gradient(180deg, rgba(20,20,20,0.95) 0%, rgba(14,14,14,0.95) 100%)',
  border: '1px solid var(--glass-border)',
  borderRadius: '18px',
  padding: '2rem',
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

const DetailTable = ({ columns, rows, emptyMessage }) => {
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
            <tr key={`${rowIndex}-${row[0]}`}>
              {row.map((value, cellIndex) => (
                <td
                  key={`${rowIndex}-${cellIndex}`}
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

const UserDetail = ({ user, orders, onBack }) => {
  if (!user) return null;

  const userOrders = getOrdersForUser(orders, user);
  const userOrnaments = userOrders.map((order) => order.ornament);

  return (
    <section style={{ padding: '8rem 0 8rem' }}>
      <div className="container">
        <button 
          onClick={onBack}
          style={{
            background: 'transparent',
            border: '1px solid var(--glass-border)',
            color: 'var(--text-secondary)',
            padding: '0.5rem 1rem',
            borderRadius: '999px',
            cursor: 'pointer',
            display: 'inline-block',
            marginBottom: '2rem'
          }}
        >
          &larr; Back to Dashboard
        </button>

        <div style={{ ...cardStyle, marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{user.name}</h2>
          <div style={{ display: 'flex', gap: '2rem', color: 'var(--text-secondary)' }}>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> <span style={{ color: 'var(--accent-gold)', textTransform: 'uppercase' }}>{user.role || 'customer'}</span></p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <div style={cardStyle}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>User Ornaments</h3>
            <DetailTable
              columns={['Ornament', 'Category', 'Price']}
              rows={userOrnaments.map((ornament) => [
                ornament?.name || 'Unknown ornament',
                ornament?.category || 'Uncategorized',
                `Rs. ${ornament?.price ?? 0}`,
              ])}
              emptyMessage="No linked ornaments available for this user."
            />
          </div>

          <div style={cardStyle}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Order Details</h3>
            <DetailTable
              columns={['Order ID', 'Status', 'Total']}
              rows={userOrders.map((order) => [
                order.id,
                order.status,
                `Rs. ${order.total}`,
              ])}
              emptyMessage="This user has no past order history to display."
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserDetail;
