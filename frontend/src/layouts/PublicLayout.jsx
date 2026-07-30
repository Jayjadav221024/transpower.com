import { Outlet } from 'react-router-dom';
import SiteHeader from '../components/site/SiteHeader';
import SiteFooter from '../components/site/SiteFooter';
import StickyActions from '../components/common/StickyActions';

export default function PublicLayout() {
  return (
    <>
      <SiteHeader />
      <main>
        <Outlet />
      </main>
      <StickyActions />
      <SiteFooter />
    </>
  );
}
