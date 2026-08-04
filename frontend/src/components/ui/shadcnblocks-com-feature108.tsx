import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Layout, Pointer, Zap } from "lucide-react";

import { Badge } from "./badge";
import { Button } from "./button";

interface TabContent {
  badge: string;
  title: string;
  description: string;
  buttonText: string;
  imageSrc: string;
  imageAlt: string;
}

interface Tab {
  value: string;
  icon: React.ReactNode;
  label: string;
  content: TabContent;
}

interface Feature108Props {
  badge?: string;
  heading?: string;
  description?: string;
  tabs?: Tab[];
}

const STYLE = `
.f108-section {
  padding: 80px 0;
  background: var(--bg-primary);
  position: relative;
  overflow: hidden;
  font-family: var(--font-sans);
}
.f108-grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}
.f108-header {
  margin-bottom: 40px;
  max-width: 700px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}
.f108-header h2 {
  font-size: clamp(2rem, 3.5vw, 2.8rem);
  font-weight: 800;
  color: var(--text-main);
  line-height: 1.15;
}
.f108-header p {
  color: var(--text-muted);
  font-size: 1rem;
  line-height: 1.5;
  margin-top: 5px;
}
.f108-tabs-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 24px;
  margin-bottom: 35px;
  width: 100%;
}
.f108-tab-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--text-muted);
  background: transparent;
  border: 1px solid transparent;
  padding: 10px 20px;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.f108-tab-trigger:hover {
  background: rgba(0, 0, 0, 0.04);
  color: var(--text-main);
}
.f108-tab-trigger[data-state="active"] {
  background: var(--accent-orange);
  color: #ffffff;
  box-shadow: var(--shadow-glow);
}
.f108-content-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 45px;
  box-shadow: var(--shadow-lift);
  width: 100%;
  max-width: 1050px;
  text-align: left;
}
.f108-content-grid {
  display: grid;
  grid-template-columns: 1.15fr 1.3fr;
  gap: 50px;
  align-items: center;
}
/* A grid item's automatic minimum is its min-content width, so a long
   unbroken heading could hold the column open wider than the card. */
.f108-content-grid > * {
  min-width: 0;
}
@media (max-width: 868px) {
  .f108-content-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  .f108-content-card {
    padding: 25px;
  }
  .f108-text-col {
    align-items: center;
    text-align: center;
  }
  .f108-text-col .badge-tag {
    align-self: center;
  }
}
@media (max-width: 767px) {
  .f108-section {
    padding: 40px 0;
  }
  .f108-grid {
    padding: 0 var(--gutter);
  }
  .f108-header {
    margin-bottom: 24px;
  }
  .f108-tabs-list {
    flex-wrap: nowrap;
    justify-content: flex-start;
    overflow-x: auto;
    overscroll-behavior-x: contain;
    padding-bottom: 12px;
    margin-bottom: 20px;
    scrollbar-width: none;
    -ms-overflow-style: none;
    /* Bleeds to the screen edges by cancelling the grid's own padding. This was
       width:100vw, which is measured including the scrollbar and so left the
       strip overhanging its container to the right by that width. */
    width: auto;
    margin-inline: calc(var(--gutter) * -1);
    padding-left: var(--gutter);
    padding-right: var(--gutter);
  }
  .f108-tabs-list::-webkit-scrollbar {
    display: none;
  }
  .f108-tab-trigger {
    flex-shrink: 0;
    min-height: 48px;
    padding: 8px 16px;
    font-size: 0.76rem;
  }
  .f108-content-card {
    padding: 20px 15px;
    border-radius: var(--radius-md);
  }
}
@media (max-width: 479px) {
  .f108-btn {
    width: 100%;
    white-space: normal;
  }
}
.f108-text-col {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 15px;
}
.f108-text-col h3 {
  font-size: clamp(1.8rem, 2.5vw, 2.2rem);
  font-weight: 800;
  color: var(--text-main);
  line-height: 1.2;
}
.f108-text-col p {
  color: var(--text-muted);
  font-size: 0.95rem;
  line-height: 1.6;
}
/* The shadcn Button ships Tailwind utility classes, but this project has no
   Tailwind build — so the button is styled here to match .btn-primary. */
.f108-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 8px;
  padding: 0.7rem 1.6rem;
  border: 1px solid transparent;
  border-radius: var(--radius-pill);
  background: var(--accent-orange);
  color: #ffffff;
  font-family: var(--font-sans);
  font-size: 0.85rem;
  font-weight: 700;
  line-height: 1;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
  cursor: pointer;
  box-shadow: var(--shadow-glow);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast), background var(--transition-fast);
}
.f108-btn:hover {
  background: var(--accent-orange-deep);
  transform: translateY(-2px);
  box-shadow: 0 10px 26px -8px rgba(225, 89, 11, 0.55);
}
.f108-btn:focus-visible {
  outline: 2px solid var(--accent-orange-deep);
  outline-offset: 2px;
}
.f108-btn .f108-btn-arrow {
  transition: transform var(--transition-fast);
}
.f108-btn:hover .f108-btn-arrow {
  transform: translateX(3px);
}
.f108-image-col {
  overflow: hidden;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-card);
}
.f108-image-col img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
  transition: transform 0.5s ease;
}
.f108-image-col:hover img {
  transform: scale(1.02);
}
`;

const Feature108 = ({
  badge = "shadcnblocks.com",
  heading = "A Collection of Components Built With Shadcn & Tailwind",
  description = "Join us to build flawless web solutions.",
  tabs = [
    {
      value: "tab-1",
      icon: <Zap className="h-auto w-4 shrink-0" />,
      label: "Boost Revenue",
      content: {
        badge: "Modern Tactics",
        title: "Make your site a true standout.",
        description:
          "Discover new web trends that help you craft sleek, highly functional sites that drive traffic and convert leads into customers.",
        buttonText: "See Plans",
        imageSrc:
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
        imageAlt: "analytics screenshot",
      },
    },
    {
      value: "tab-2",
      icon: <Pointer className="h-auto w-4 shrink-0" />,
      label: "Higher Engagement",
      content: {
        badge: "Expert Features",
        title: "Boost your site with top-tier design.",
        description:
          "Use stellar design to easily engage users and strengthen their loyalty. Create a seamless experience that keeps them coming back for more.",
        buttonText: "See Tools",
        imageSrc:
          "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80",
        imageAlt: "dashboard mockup",
      },
    },
    {
      value: "tab-3",
      icon: <Layout className="h-auto w-4 shrink-0" />,
      label: "Stunning Layouts",
      content: {
        badge: "Elite Solutions",
        title: "Build an advanced web experience.",
        description:
          "Lift your brand with modern tech that grabs attention and drives action. Create a digital experience that stands out from the crowd.",
        buttonText: "See Options",
        imageSrc:
          "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
        imageAlt: "web design workspace",
      },
    },
  ],
}: Feature108Props) => {
  return (
    <>
      <style>{STYLE}</style>
      <section className="f108-section">
        <div className="f108-grid">
          <div className="f108-header">
            <Badge variant="outline" className="badge-tag">
              {badge}
            </Badge>
            <h2>{heading}</h2>
            <p>{description}</p>
          </div>
          <Tabs defaultValue={tabs[0].value} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <TabsList className="f108-tabs-list">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="f108-tab-trigger"
                >
                  {tab.icon} {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="f108-content-card">
              {tabs.map((tab) => (
                <TabsContent
                  key={tab.value}
                  value={tab.value}
                  style={{ outline: 'none' }}
                >
                  <div className="f108-content-grid">
                    <div className="f108-text-col">
                      <Badge variant="outline" className="badge-tag" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
                        {tab.content.badge}
                      </Badge>
                      <h3>{tab.content.title}</h3>
                      <p>{tab.content.description}</p>
                      <Button className="f108-btn">
                        {tab.content.buttonText}
                        <span className="f108-btn-arrow" aria-hidden="true">→</span>
                      </Button>
                    </div>
                    <div className="f108-image-col">
                      <img
                        src={tab.content.imageSrc}
                        alt={tab.content.imageAlt}
                      />
                    </div>
                  </div>
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </div>
      </section>
    </>
  );
};

export { Feature108 };
