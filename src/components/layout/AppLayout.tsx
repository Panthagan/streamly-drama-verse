import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { MobileNav } from "./MobileNav";

export const AppLayout = () => (
  <div className="min-h-screen bg-background overflow-x-hidden">
    <Sidebar />
    <div className="lg:pl-64 min-w-0">
      <Header />
      <main className="pb-24 lg:pb-12 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
    <MobileNav />
  </div>
);
