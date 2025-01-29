import Link from 'next/link';
import NanotestLogo from '../nanotest-logo';
import styles from './footer.module.scss';
import { At, LinkedinLogo, Phone } from '@phosphor-icons/react/dist/ssr';

const Footer = () => {
  return (
    <footer className={`pt-3 pb-6 mt-3 w-full ${styles.globalFooter}`}>
      <div className="w-full max-w-6xl mx-0 md:mx-auto px-12 flex gap-12 md:gap-24 flex-col-reverse md:flex-row items-center md:items-start justify-center">
        <div className="block text-center md:text-left max-w-72 md:max-w-[480px]">
          Nanotest is one of the co-founders and members of{' '}
          <b>ISA - International Semiconductor Alliance</b>, a cooperation of internally leading
          technology companies from the semiconductor industry.
          <br />
          <Link
            className="inline-block rounded-lg h-8 px-2 pt-1 mt-4 border-1 border-primary hover:border-secondary focus-visible:border-secondary transition-colors"
            href="https://isa-semi.com/"
            target="_blank"
          >
            Visit ISA-Semi.com
          </Link>
        </div>
        <div>
          <div className="relative ps-3 before:absolute before:left-0 before:top-0 before:w-1 before:h-full before:bg-primary before:rounded text-lg">
            <h3 className="font-semibold text-nowrap">Berliner Nanotest und Design GmbH</h3>
            <p className="text-sm opacity-80">
              Volmerstr. 9 B <span className="text-primary">|</span> D-12489 Berlin{' '}
              <span className="text-primary">|</span> Germany
            </p>
            <p className="mt-10 flex gap-2">
              <Link
                className="flex items-center justify-center rounded-lg w-8 h-8 bg-primary hover:bg-secondary focus-visible:bg-secondary  dark:hover:text-background dark:focus-visible:text-background transition-colors"
                href="tel:+49307002100"
              >
                <Phone size={24} />
              </Link>
              <Link
                className="flex items-center justify-center rounded-lg w-8 h-8 bg-primary hover:bg-secondary focus-visible:bg-secondary dark:hover:text-background dark:focus-visible:text-background transition-colors"
                href="mailto:info@nanotest.eu"
              >
                <At size={24} />
              </Link>
              <Link
                className="flex items-center justify-center rounded-lg w-8 h-8 bg-primary hover:bg-secondary focus-visible:bg-secondary dark:hover:text-background dark:focus-visible:text-background transition-colors"
                target="_blank"
                href="https://www.linkedin.com/company/nanotest/"
              >
                <LinkedinLogo size={24} />
              </Link>
              <Link
                className="text-md flex items-center justify-center rounded-lg h-8 px-2 bg-primary hover:bg-secondary focus-visible:bg-secondary dark:hover:text-background dark:focus-visible:text-background transition-colors"
                href="/about/imprint"
              >
                Imprint
              </Link>
              <Link
                className="text-md flex items-center justify-center rounded-lg h-8 px-2 bg-primary hover:bg-secondary focus-visible:bg-secondary dark:hover:text-background dark:focus-visible:text-background transition-colors"
                href="/about/imprint"
              >
                Privacy
              </Link>
            </p>
          </div>
        </div>
      </div>
      <div className="w-full mt-12 flex items-center justify-center">
        <span className="font-medium" suppressHydrationWarning>
          &copy; {new Date().getFullYear()}
        </span>
        <NanotestLogo hideLogo className="h-4 px-1" />
      </div>
    </footer>
  );
};

export default Footer;
