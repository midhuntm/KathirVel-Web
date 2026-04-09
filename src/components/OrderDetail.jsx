import React from 'react';

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

const DetailTable = ({ title, columns, rows }) => (
  <div style={cardStyle}>
    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{title}</h3>
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
            <tr key={`${title}-${rowIndex}`}>
              {row.map((value, cellIndex) => (
                <td
                  key={`${title}-${rowIndex}-${cellIndex}`}
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
  </div>
);

const OrderDetail = ({ order, onBack }) => {
  if (!order) return null;

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
            marginBottom: '2rem',
          }}
        >
          &larr; Back to Dashboard
        </button>

        <div style={{ ...cardStyle, marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{order.id}</h2>
          <div style={{ display: 'flex', gap: '2rem', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
            <p><strong>User:</strong> {order.user?.name || 'Unknown user'}</p>
            <p><strong>Status:</strong> <span style={{ color: 'var(--accent-gold)', textTransform: 'uppercase' }}>{order.status}</span></p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <DetailTable
            title="Order Table"
            columns={['Order ID', 'Date', 'Qty', 'Total']}
            rows={[[
              order.id,
              order.placedOn,
              order.quantity,
              `Rs. ${order.total}`,
            ]]}
          />

          <DetailTable
            title="User Table"
            columns={['Name', 'Email', 'Role']}
            rows={[[
              order.user?.name || 'Unknown user',
              order.user?.email || '-',
              order.user?.role || 'customer',
            ]]}
          />

          <DetailTable
            title="Ornament Table"
            columns={['Name', 'Category', 'Price']}
            rows={[[
              order.ornament?.name || 'Unknown ornament',
              order.ornament?.category || 'Uncategorized',
              `Rs. ${order.ornament?.price ?? 0}`,
            ]]}
          />
        </div>
      </div>
    </section>
  );
};

export default OrderDetail;
