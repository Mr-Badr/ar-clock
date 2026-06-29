import AdLayoutWrapper from "./AdLayoutWrapper";
import SiteTrustPanel from "@/components/site/SiteTrustPanel";

interface CalculatorAdLayoutProps {
  children: React.ReactNode;
}

export default function CalculatorAdLayout({ children }: CalculatorAdLayoutProps) {
  return (
    <AdLayoutWrapper layout="wide" sidebarMode="single">
      <div className="layout-content-shell calculator-layout-shell">
        {children}
        <SiteTrustPanel panel="calculators" />
      </div>
    </AdLayoutWrapper>
  );
}
