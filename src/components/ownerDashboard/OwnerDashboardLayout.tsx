import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import OwnerDashboardSidebar from './OwnerDashboardSidebar';
import OwnerDashboardHeader from './OwnerDashboardHeader';
import '../dashboard/Dashboard.css';

interface OwnerDashboardLayoutProps {
  basePath?: string;
}

export default function OwnerDashboardLayout({ basePath: customBasePath }: OwnerDashboardLayoutProps) {
  const location = useLocation();
  const basePath =
    customBasePath ||
    (location.pathname.startsWith('/owner-dashboard-preview') ? '/owner-dashboard-preview' : '/owner-dashboard');

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
      <OwnerDashboardSidebar
        basePath={basePath}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="dary-main-wrapper">
        <OwnerDashboardHeader
          onOpenMobile={() => setMobileOpen(true)}
        />

        <main className="dary-content-outlet">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
