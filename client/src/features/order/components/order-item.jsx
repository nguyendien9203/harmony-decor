const OrderItem = ({ item }) => {
  return (
    <div className="py-4 flex flex-col md:flex-row gap-4">
      <img
        src={item.image}
        alt={item.name}
        className="w-16 h-16 object-cover rounded"
      />
      <div className="flex-1">
        <div className="font-medium">{item.name}</div>
        {item.strains && (
          <ul className="text-sm text-gray-500 list-disc ml-5 mt-1">
            {item.strains.map((strain, i) => (
              <li key={i}>
                Strain {i + 1}: {strain}
              </li>
            ))}
          </ul>
        )}
        {item.capsuleSize && (
          <p className="text-sm text-gray-500">
            Capsule size: {item.capsuleSize}
            <br />
            Capsule quantity: {item.capsuleQty}
          </p>
        )}
        {item.shirtColor && (
          <p className="text-sm text-gray-500">
            Shirt color: {item.shirtColor} | Size: {item.shirtSize}
          </p>
        )}
        {item.recurring && (
          <p className="text-sm text-green-600">{item.recurring}</p>
        )}
      </div>
      <div className="text-right">
        <div className="text-sm font-semibold">{item.price}</div>
        {item.originalPrice && (
          <div className="text-xs line-through text-gray-400">
            {item.originalPrice}
          </div>
        )}
        <div className="text-xs text-gray-500">{item.quantity}</div>
      </div>
    </div>
  );
};

export default OrderItem;
