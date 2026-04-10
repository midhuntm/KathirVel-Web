import React from 'react';
import { getOrdersForUser } from '../utils/orders';

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

const DetailTable = ({ columns, rows, emptyMessage }) => {
  if (!rows.length) {
    return <p style={{ color: 'var(--color-charcoal)', fontFamily: 'var(--font-body)' }}>{emptyMessage}</p>;
  }

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
            <tr key={`${rowIndex}-${row[0]}`}>
              {row.map((value, cellIndex) => (
                <td
                  key={`${rowIndex}-${cellIndex}`}
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

const UserDetail = ({ user, orders, onBack }) => {
  if (!user) return null;

  const userOrders = getOrdersForUser(orders, user);
  const userOrnaments = userOrders.map((order) => order.ornament);

  return (
    <section style={{ padding: '6rem 0', background: 'var(--color-gray-light)', minHeight: '80vh' }}>
      <div className="container">
        <button 
          onClick={onBack}
          className="btn-secondary"
          style={{ marginBottom: '2rem' }}
        >
          &larr; Back to Dashboard
        </button>

        <div style={{ ...cardStyle, marginBottom: '2rem', borderLeft: '4px solid var(--color-gold)' }}>
          <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', marginBottom: '0.5rem', color: 'var(--color-black)' }}>{user.name}</h2>
          <div style={{ display: 'flex', gap: '2rem', color: 'var(--color-charcoal)', fontFamily: 'var(--font-body)' }}>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> <span style={{ color: 'var(--color-gold-dark)', textTransform: 'uppercase', fontWeight: 600 }}>{user.role || 'customer'}</span></p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <div style={cardStyle}>
            <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', marginBottom: '1rem' }}>User Ornaments</h3>
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
            <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', marginBottom: '1rem' }}>Order Details</h3>
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
