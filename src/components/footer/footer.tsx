import NanotestLogo from '../nanotest-logo';

const Footer = () => {
  return (
    <footer className="w-full flex items-center justify-center py-3 my-2">
      <span className="font-semibold dark:font-light text-foreground" suppressHydrationWarning>
        &copy; {new Date().getFullYear()}
      </span>
      <NanotestLogo hideLogo className="h-4 ps-2 fill-foreground" />
    </footer>
  );
};

export default Footer;
