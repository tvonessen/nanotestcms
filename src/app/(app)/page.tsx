import Jumbo from '@/components/jumbo/Jumbo';
import JumboCards from '@/components/partials/jumboCards';
import Highlight from '@/components/partials/highlight';
import { mockProducts } from '@/data/mockProducts';

export default function Home() {
  return (
    <>
      <Jumbo />

      <Highlight />

      <JumboCards cards={mockProducts} />

      <Highlight variant="secondary" />

      <JumboCards cards={mockProducts} />
    </>
  );
}
