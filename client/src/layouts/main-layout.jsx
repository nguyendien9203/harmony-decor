import React from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen font-inter">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow">
        <div className="container mx-auto py-8">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;
