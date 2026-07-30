import { Layout, Pointer, Zap } from "lucide-react";

import { Feature108 } from "./shadcnblocks-com-feature108"

const demoData = {
  badge: "Transpower Solutions",
  heading: "High-Efficiency FRP Power Distribution Equipment",
  description: "Explore our modular, corrosion-resistant power products engineered for harsh environments.",
  tabs: [
    {
      value: "tab-1",
      icon: <Zap className="h-auto w-4 shrink-0" />,
      label: "Switchgears & MCCs",
      content: {
        badge: "Industrial Grade",
        title: "Maximum safety with FRP insulation.",
        description:
          "Our FRP Switchgear and Motor Control Centers are built with high short-circuit withstand capacity, keeping your plant operations safe and compliant.",
        buttonText: "View Specifications",
        imageSrc:
          "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
        imageAlt: "electrical control panel",
      },
    },
    {
      value: "tab-2",
      icon: <Pointer className="h-auto w-4 shrink-0" />,
      label: "Custom Busducts",
      content: {
        badge: "Low Resistance",
        title: "Optimized power transfer efficiency.",
        description:
          "Minimize electrical losses and prevent moisture damage. Designed to integrate directly into complex plant layouts with zero maintenance.",
        buttonText: "Calculate Load",
        imageSrc:
          "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
        imageAlt: "server room infrastructure",
      },
    },
    {
      value: "tab-3",
      icon: <Layout className="h-auto w-4 shrink-0" />,
      label: "Modular Enclosures",
      content: {
        badge: "IP66 Protection",
        title: "All-weather structural stability.",
        description:
          "Engineered for high chemical and UV exposure. Ideal for offshore platforms, chemical processing, and coastal distribution grids.",
        buttonText: "Request CAD Design",
        imageSrc:
          "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
        imageAlt: "microchip hardware circuit",
      },
    },
  ],
};

function Feature108Demo() {
  return <Feature108 {...demoData} />;
}

export { Feature108Demo };
export default Feature108Demo;
