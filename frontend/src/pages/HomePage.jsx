import HeroCarousel from '../components/site/HeroCarousel';
import ProductCatalog from '../components/site/ProductCatalog';
import LoadCalculator from '../components/site/LoadCalculator';
import ComparisonTable from '../components/site/ComparisonTable';
import Applications from '../components/site/Applications';
import RfqForm from '../components/site/RfqForm';
import Feature108Demo from '../components/ui/demo-feature108';
import HomeBlog from '../components/site/HomeBlog';
import SEO from '../components/common/SEO';

export default function HomePage() {
  return (
    <>
      <SEO 
        title="Industrial FRP Gratings, Cable Trays & Power Systems" 
        description="Transpower Technologies Pvt. Ltd. manufactures high-efficiency composite FRP gratings, structural profiles, cable trays, industrial gearboxes, and switchgear panels." 
        keywords="FRP gratings, fiberglass cable trays, industrial gear boxes, switchgear panels, pultruded profiles, Transpower"
      />
      <HeroCarousel />
      <ProductCatalog />
      <LoadCalculator />
      <ComparisonTable />
      <Applications />
      <Feature108Demo />
      <HomeBlog />
      <RfqForm />
    </>
  );
}
