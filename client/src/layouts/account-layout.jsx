import { Outlet } from "react-router-dom";
import AccountSidebar from "@/components/common/account-side-bar";

const AccountLayout = () => {
  return (
    <div className="flex flex-col md:flex-row mt-4">
      <AccountSidebar />
      <main className="flex-1 p-4 md:p-0 bg-white rounded-2xl border md:ml-4">
        <Outlet />
      </main>
    </div>
  );
};

export default AccountLayout;
