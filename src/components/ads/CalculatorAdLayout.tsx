import AdLayoutWrapper from "./AdLayoutWrapper";

interface CalculatorAdLayoutProps {
  children: React.ReactNode;
}

export default function CalculatorAdLayout({ children }: CalculatorAdLayoutProps) {
  return (
    <AdLayoutWrapper layout="standard" sidebarMode="single">
      <div className="layout-content-shell calculator-layout-shell">
        {children}
      </div>
    </AdLayoutWrapper>
  );
}
