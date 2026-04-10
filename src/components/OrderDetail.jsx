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

const DetailTable = ({ title, columns, rows }) => (
  <div style={cardStyle}>
    <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', marginBottom: '1rem' }}>{title}</h3>
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
            <tr key={`${title}-${rowIndex}`}>
              {row.map((value, cellIndex) => (
                <td
                  key={`${title}-${rowIndex}-${cellIndex}`}
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
  </div>
);

const OrderDetail = ({ order, onBack }) => {
  if (!order) return null;

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
          <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', marginBottom: '0.5rem', color: 'var(--color-black)' }}>{order.id}</h2>
          <div style={{ display: 'flex', gap: '2rem', color: 'var(--color-charcoal)', flexWrap: 'wrap', fontFamily: 'var(--font-body)' }}>
            <p><strong>User:</strong> {order.user?.name || 'Unknown user'}</p>
            <p><strong>Status:</strong> <span style={{ color: 'var(--color-gold-dark)', textTransform: 'uppercase', fontWeight: 600 }}>{order.status}</span></p>
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
