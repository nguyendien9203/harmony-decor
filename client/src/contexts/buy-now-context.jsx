import { createContext, useContext, useState } from "react";

const BuyNowContext = createContext();

export const BuyNowProvider = ({ children }) => {
  const [buyNowItem, setBuyNowItemState] = useState(() => {
    const savedItem = localStorage.getItem("buyNowItem");
    return savedItem ? JSON.parse(savedItem) : null;
  });

  const setBuyNowItem = (item) => {
    setBuyNowItemState(item);
    if (item) {
      localStorage.setItem("buyNowItem", JSON.stringify(item));
    } else {
      localStorage.removeItem("buyNowItem");
    }
  };

  const clearBuyNowItem = () => {
    setBuyNowItemState(null);
    localStorage.removeItem("buyNowItem");
  };

  return (
    <BuyNowContext.Provider
      value={{ buyNowItem, setBuyNowItem, clearBuyNowItem }}
    >
      {children}
    </BuyNowContext.Provider>
  );
};

export const useBuyNow = () => {
  const context = useContext(BuyNowContext);
  if (!context) {
    throw new Error("useBuyNow must be used within a BuyNowProvider");
  }
  return context;
};

export default BuyNowProvider;
