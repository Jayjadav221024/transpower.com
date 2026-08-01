import HeroCarousel from '../components/site/HeroCarousel';
import ProductCatalog from '../components/site/ProductCatalog';
import LoadCalculator from '../components/site/LoadCalculator';
import ComparisonTable from '../components/site/ComparisonTable';
import Applications from '../components/site/Applications';
import AuthorizedBrands from '../components/site/AuthorizedBrands';
import ReputedClients from '../components/site/ReputedClients';
import Testimonials from '../components/site/Testimonials';
import RfqForm from '../components/site/RfqForm';
import Feature108Demo from '../components/ui/demo-feature108';
import HomeBlog from '../components/site/HomeBlog';
import SEO from '../components/common/SEO';

import { useState, useEffect } from 'react';
import { publicApi } from '../api/client';

export default function HomePage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    publicApi.getPageContent('homepage')
      .then(res => {
        if (res && res.content) {
          setData(res.content);
          if (res.content.accentColor) {
            document.documentElement.style.setProperty('--accent-orange', res.content.accentColor);
          }
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <SEO 
        title="Industrial FRP Gratings, Cable Trays & Power Systems" 
        description="Transpower Technologies Pvt. Ltd. manufactures high-efficiency composite FRP gratings, structural profiles, cable trays, industrial gearboxes, and switchgear panels." 
        keywords="FRP gratings, fiberglass cable trays, industrial gear boxes, switchgear panels, pultruded profiles, Transpower"
      />
      <HeroCarousel pageData={data} />
      <ProductCatalog />
      <LoadCalculator />
      <ComparisonTable />
      <Applications />
      <Feature108Demo />
      <AuthorizedBrands />
      <ReputedClients />
      <Testimonials />
      <HomeBlog />
      <RfqForm />
    </>
  );
}
