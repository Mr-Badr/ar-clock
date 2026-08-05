import './tools-v2.css';
import CalculatorAdLayout from '@/components/ads/CalculatorAdLayout';

export default function ToolsLayout({ children }) {
  return <CalculatorAdLayout sidebarMode="dual">{children}</CalculatorAdLayout>;
}
