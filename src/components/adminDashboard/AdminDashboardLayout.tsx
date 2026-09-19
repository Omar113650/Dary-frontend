import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminDashboardSidebar from './AdminDashboardSidebar';
import AdminDashboardHeader from './AdminDashboardHeader';
import '../dashboard/Dashboard.css';

interface AdminDashboardLayoutProps {
  basePath?: string;
}

export default function AdminDashboardLayout({ basePath: customBasePath }: AdminDashboardLayoutProps) {
  const location = useLocation();
  const basePath =
    customBasePath ||
    (location.pathname.startsWith('/admin-preview') ? '/admin-preview' : '/admin');

  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="dary-dashboard-shell">
      {/* Mobile Drawer Backdrop */}
      <div
        className={`dary-backdrop ${mobileOpen ? 'mobile-open' : ''}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <AdminDashboardSidebar
        basePath={basePath}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="dary-main-wrapper">
        <AdminDashboardHeader
          onOpenMobile={() => setMobileOpen(true)}
        />

        <main className="dary-content-outlet">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
