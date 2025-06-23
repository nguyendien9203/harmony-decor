import { createContext, useContext, useState } from "react";

const BuyNowContext = createContext();

export const BuyNowProvider = ({ children }) => {
  const [buyNowItem, setBuyNowItem] = useState(null);

  const clearBuyNowItem = () => {
    setBuyNowItem(null);
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
