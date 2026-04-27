import AdLayoutWrapper from "./AdLayoutWrapper";
import SiteTrustPanel from "@/components/site/SiteTrustPanel";

interface EconomyAdLayoutProps {
  children: React.ReactNode;
}

export default function EconomyAdLayout({ children }: EconomyAdLayoutProps) {
  return (
    <AdLayoutWrapper layout="narrow" sidebarMode="dual">
      <div className="layout-content-shell">
        <main className="economy-shell content-col">
          {children}
          <SiteTrustPanel panel="economy" />
        </main>
      </div>
    </AdLayoutWrapper>
  );
}
