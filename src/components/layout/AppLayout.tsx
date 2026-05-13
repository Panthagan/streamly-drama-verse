import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { MobileNav } from "./MobileNav";
import { Footer } from "./Footer";

export const AppLayout = () => (
  <div className="min-h-screen bg-background overflow-x-hidden">
    <Sidebar />
    <div className="lg:pl-64 min-w-0">
      <Header />
      <main className="overflow-x-hidden">
        <Outlet />
      </main>
      <Footer />
      <div className="pb-24 lg:pb-0" />
    </div>
    <MobileNav />
  </div>
);
