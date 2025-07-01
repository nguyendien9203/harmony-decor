exports.formatOrder = (orderDoc) => {
  return {
    _id: orderDoc._id,
    createdAt: orderDoc.createdAt,
    items: orderDoc.items.map((item) => ({
      productId: item.productId._id,
      name: item.productId.name,
      images: item.productId.images,
      price: item.productId.price,
      quantity: item.quantity,
    })),
    total: orderDoc.total,
    discountCode: orderDoc.discountCode,
    discountAmount: orderDoc.discountAmount,
    totalAmount: orderDoc.totalAmount,
    paymentMethod: orderDoc.paymentMethod,
    shippingAddress: orderDoc.shippingAddress,
    userId: orderDoc.userId,
    orderStatus: orderDoc.orderStatus,
    paymentStatus: orderDoc.paymentStatus,
    paidAt: orderDoc.paidAt,
    transactionId: orderDoc.transactionId,
    note: orderDoc.note,
  };
};
