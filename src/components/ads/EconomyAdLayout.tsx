import AdLayoutWrapper from "./AdLayoutWrapper";

interface EconomyAdLayoutProps {
  children: React.ReactNode;
}

export default function EconomyAdLayout({ children }: EconomyAdLayoutProps) {
  return (
    <AdLayoutWrapper layout="narrow" sidebarMode="dual">
      <main className="economy-shell">{children}</main>
    </AdLayoutWrapper>
  );
}
