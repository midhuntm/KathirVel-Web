const orderStatuses = ['Placed', 'Processing', 'Delivered'];

const getEntityId = (item, fallback) => item?._id || item?.id || fallback;

export const buildOrders = (users, ornaments) => {
  const customers = users.filter((user) => (user.role || 'customer').toLowerCase() !== 'admin');

  if (!customers.length || !ornaments.length) {
    return [];
  }

  return customers.map((user, index) => {
    const ornament = ornaments[index % ornaments.length];
    const quantity = (index % 3) + 1;
    const price = Number(ornament.price) || 0;

    return {
      id: `ORD-${String(index + 1).padStart(3, '0')}`,
      status: orderStatuses[index % orderStatuses.length],
      placedOn: `2026-04-${String((index % 9) + 1).padStart(2, '0')}`,
      quantity,
      total: price * quantity,
      user,
      ornament,
      userId: getEntityId(user, `user-${index}`),
      ornamentId: getEntityId(ornament, `ornament-${index}`),
    };
  });
};

export const getOrdersForUser = (orders, user) => {
  if (!user) {
    return [];
  }

  const userId = getEntityId(user, user.email);
  return orders.filter(
    (order) =>
      order.userId === userId ||
      order.user?.email === user.email ||
      order.user_email === user.email
  );
};
