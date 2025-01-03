import type { ProductProps } from '@/types';

export const mockProducts: ProductProps[] = [
  {
    title: 'TIMA',
    subtitle: 'Thermal Interface Material Analyzer',
    description:
      'The TIMA is a fully automated, high-throughput, and high-accuracy testing system for the thermal characterization of TIMs.',
    article: (
      <>
        <h2>Everyone needs TIMA</h2>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Similique repellendus nisi,
          assumenda ab iste deserunt. Ipsum deserunt quo, quis magni quasi delectus repellat
          voluptatum tempora et fugit ratione expedita illum. Vero ad facere, quidem sit ipsum,
          dicta a ut vitae culpa officia corrupti nemo ullam necessitatibus, blanditiis pariatur eum
          quis at quasi debitis saepe alias sapiente deserunt accusantium. Dolorem, cumque?
          Asperiores doloremque dolorum libero modi deleniti laborum perferendis non ab. Autem,
          fugit officia atque consequuntur ipsam magni ab dolor provident quas mollitia commodi
          dignissimos. Maxime fugiat ducimus delectus quibusdam labore. Molestias blanditiis omnis
          nam. Impedit reprehenderit nulla eius ipsa facere architecto dolore dolores ullam eum!
          Velit in expedita earum, dolores labore itaque cupiditate ullam autem iure omnis, qui
          nihil alias!
        </p>
      </>
    ),
    image: { url: '/img/gap_filler_video.jpg', width: 1920, height: 1080 },
    href: '/solutions/tima',
    categoryId: 0,
  },
  {
    title: 'TTV',
    subtitle: 'Thermal Test Vehicle',
    description:
      'The TTV is a highly customizable and versatile thermal test vehicle for the characterization of TIMs and thermal interface materials.',
    article: (
      <>
        <h2>A chip without chap</h2>
        <p>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Debitis totam tempora illum,
          facilis veritatis harum quod officiis quas hic perspiciatis quis tempore quo cumque rem
          id, consequuntur enim quaerat reiciendis. Deserunt ducimus sapiente qui omnis eveniet,
          ratione id aliquid quaerat perspiciatis asperiores beatae nam provident, architecto
          voluptatem. Magnam iusto hic magni consectetur dolorum facilis repellendus tempora! Dicta
          facere distinctio voluptates! Necessitatibus error odio vitae minus fugiat omnis esse
          aspernatur officia aut, ea illo hic quasi soluta amet qui voluptate nam corporis
          consectetur laudantium molestias consequatur. Placeat fuga sit exercitationem culpa. Ea
          commodi est fugiat aliquam. Nam accusamus inventore nulla officiis cupiditate consequuntur
          ex, debitis recusandae dolorem sequi voluptatem nihil autem quas tempore id tenetur
          nesciunt voluptas a quisquam ipsam repellat.
        </p>
        <h3>Subtitle</h3>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quam non, reiciendis sunt
          doloremque eveniet quas doloribus! Velit non voluptates nihil quisquam dolor aperiam
          libero repellat. Suscipit dolorem hic labore sunt. Sapiente iusto suscipit hic voluptate?
          Laborum ipsum tenetur laudantium iure eum aliquid at tempore atque doloremque aperiam
          perspiciatis quos, porro corporis a, fugit esse nulla necessitatibus non veniam omnis eos.
        </p>
        <h3>Subtitle</h3>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus soluta labore
          consectetur ducimus sunt eaque nisi beatae voluptate illo reiciendis sed repudiandae
          aspernatur quas ipsam laborum aliquid quae, excepturi vel!
        </p>
      </>
    ),
    image: { url: '/img/TTV.png', width: 466, height: 311 },
    href: '/solutions/ttv',
    categoryId: 2,
  },
  {
    title: 'TOCS',
    subtitle: 'Three-Omega Characterization System',
    description:
      'The TOCS is a high-accuracy, high-throughput, and non-destructive thermal conductivity measurement system.',
    article: (
      <>
        <h2>TOCS is the best</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam doloribus, voluptatem,
          quidem, quia quod fugit dolorum voluptatum possimus iusto magnam voluptas
        </p>
        <h3>Subtitle</h3>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam doloribus, voluptatem,
          quidem, quia quod fugit dolorum voluptatum possimus iusto magnam voluptas
        </p>
      </>
    ),
    image: { url: '/img/IMG_9708.jpg', width: 5472, height: 3648 },
    href: '/solutions/tocs',
    categoryId: 0,
    new: true,
  },
  {
    title: 'LaTIMA',
    subtitle: 'In-Plane thermal material characteriation',
    description:
      'The LaTIMA is a fully automated, high-throughput, and high-accuracy testing system for the thermal characterization of TIMs.',
    article: (
      <>
        <h2>LaTIMA is the best</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam doloribus, voluptatem,
          quidem, quia quod fugit dolorum voluptatum possimus iusto magnam voluptas
        </p>
        <h3>Subtitle</h3>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam doloribus, voluptatem,
          quidem, quia quod fugit dolorum voluptatum possimus iusto magnam voluptas
        </p>
      </>
    ),
    image: { url: '/img/latima.jpg', width: 1200, height: 675 },
    href: '/solutions/latima',
    categoryId: 0,
  },
  {
    title: 'AMB',
    subtitle: 'Advanced Mixed Mode Bending System',
    description:
      'The AMB is a high-accuracy, high-throughput, and non-destructive thermal conductivity measurement system.',
    article: (
      <>
        <h2>AMB is the best</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam doloribus, voluptatem,
          quidem, quia quod fugit dolorum voluptatum possimus iusto magnam voluptas
        </p>
        <h3>Subtitle</h3>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam doloribus, voluptatem,
          quidem, quia quod fugit dolorum voluptatum possimus iusto magnam voluptas
        </p>
      </>
    ),
    image: { url: '/img/amb.jpg', width: 1280, height: 1123 },
    href: '/solutions/amb',
    categoryId: 1,
  },
];
