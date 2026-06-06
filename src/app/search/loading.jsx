import DiscoveryWorkspace from '@/components/site/DiscoveryWorkspace';
import { buildDiscoveryViewModel } from '@/lib/site/discovery';

export default function SearchLoading() {
  return <DiscoveryWorkspace mode="search" viewModel={buildDiscoveryViewModel('')} initialTab="all" />;
}
