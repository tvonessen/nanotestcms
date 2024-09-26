import Jumbo from '@/components/partials/jumbo';
import JumboCards from '@/components/partials/jumboCards';
import Highlight from '@/components/partials/highlight';
import { mockProducts } from '@/data/mockProducts';

export default function Home() {
  return (
    <>
      <Jumbo
        description="There's an endless story. Of possibilities and power. Of sensitivity and resolution. Of customized turnkey TTV solutions."
        image={{ url: '/img/IMG_9708.jpg', width: 1920, height: 1080 }}
        title="Underneath the hood"
      />
      <Highlight />

      <JumboCards cards={mockProducts} />

      <Highlight variant="secondary" />

      <JumboCards cards={mockProducts} />
    </>
  );
}
