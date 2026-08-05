import AdLayoutWrapper from "./AdLayoutWrapper";

interface CalculatorAdLayoutProps {
  children: React.ReactNode;
  /** single = one sticky right rail (old /calculators pages), dual = both rails with the
   * content centered between them (/tools v2 — big screens get fixed ads on both sides). */
  sidebarMode?: "single" | "dual";
}

export default function CalculatorAdLayout({ children, sidebarMode = "single" }: CalculatorAdLayoutProps) {
  return (
    <AdLayoutWrapper layout="wide" sidebarMode={sidebarMode}>
      <div className="layout-content-shell calculator-layout-shell">
        {children}
      </div>
    </AdLayoutWrapper>
  );
}
