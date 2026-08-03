import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import SiteHeader from '../components/site/SiteHeader';
import SiteFooter from '../components/site/SiteFooter';
import StickyActions from '../components/common/StickyActions';

export default function PublicLayout() {
  return (
    <>
      <SiteHeader />
      <main>
        {/* The boundary sits inside the chrome, so a lazily-loaded page swaps
            the content area only — the header and footer never blank out. */}
        <Suspense fallback={<div className="route-fallback" aria-busy="true" />}>
          <Outlet />
        </Suspense>
      </main>
      <StickyActions />
      <SiteFooter />
    </>
  );
}
