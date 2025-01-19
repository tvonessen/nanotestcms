import { Fragment } from 'react';

interface NanotestLogoProps {
  hideLogo?: boolean;
  hideText?: boolean;
  className?: string;
}

const NanotestLogo = ({ hideLogo, hideText, ...props }: NanotestLogoProps) => {
  const getViewBox = (hideLogo: boolean, hideText: boolean): string => {
    const x = hideLogo ? 30 : 0;
    const width = (hideLogo ? 0 : 25) + (hideText ? 0 : 130) + (hideLogo || hideText ? 0 : 4);

    const y = hideLogo ? 3 : 0;
    const height = hideLogo ? 24 : 27;

    return `${x} ${y} ${width} ${height}`;
  };

  return (
    <svg
      style={{
        fillRule: 'evenodd',
        clipRule: 'evenodd',
        strokeLinejoin: 'round',
        strokeMiterlimit: 2,
      }}
      viewBox={getViewBox(hideLogo || false, hideText || false)}
      {...props}
    >
      <title>Nanotest Logo</title>
      <g transform="matrix(1,0,0,1,-41.1471,-43.6)">
        {!hideLogo && (
          <Fragment key="logo">
            <path
              d="M43.6,65.4L50.5,69.2C52,70.1 53.9,70.1 55.5,69.2L62.4,65.4C64,64.5 65,62.8 65,60.9L65,52.7C65,50.9 64,49.2 62.5,48.3L55.6,44.3C54.8,43.8 53.9,43.6 53.1,43.6C52.3,43.6 51.3,43.8 50.6,44.3L43.7,48.3C42.1,49.2 41.2,50.9 41.2,52.7L41.2,60.9C40.9,62.7 41.9,64.5 43.6,65.4ZM44.1,50L51,46.2C52.2,45.5 53.7,45.5 54.9,46.2L61.8,50C63.1,50.7 63.9,52 63.9,53.5L63.9,60.6C63.9,62 63.1,63.4 61.9,64.1L55,68.1C54.4,68.5 53.7,68.6 53,68.6C52.3,68.6 51.6,68.4 51,68.1L44.1,64.1C42.9,63.4 42.1,62.1 42.1,60.6L42.1,53.5C42,52.1 42.8,50.8 44.1,50Z"
              style={{ fillRule: 'nonzero' }}
            />
            <path
              className="fill-[var(--primary)]"
              d="M59.4,56C55.2,50.7 51.8,59.7 49.1,57.3L46.3,54.3C45.4,53.3 43.9,54.6 44.7,55.7C48.5,60.4 50.2,61.6 55.1,57.2C57.6,55 59.4,58.3 61.4,59.3C60.8,58.2 60.1,57.1 59.4,56Z"
              style={{ fillRule: 'nonzero' }}
            />
          </Fragment>
        )}

        {!hideText && (
          <Fragment key="text">
            <path
              d="M84.7,62.7L84.7,49.1L87.1,49.1L87.1,67.2L84.8,67.2L78.5,57.7L75.9,53.7L75.7,53.7L75.7,67.1L73.3,67.1L73.3,49.1L75.6,49.1L82.1,58.9L84.5,62.7L84.7,62.7Z"
              style={{ fillRule: 'nonzero' }}
            />
            <path
              d="M102.3,67.2L100.9,63.1L93.7,63.1L92.3,67.2L89.8,67.2L96.1,49.1L98.5,49.1L104.8,67.2L102.3,67.2ZM97.2,52.5L95.9,56.7L94.5,61L100.1,61L98.7,56.7L97.4,52.5L97.2,52.5Z"
              style={{ fillRule: 'nonzero' }}
            />
            <path
              d="M118.9,62.7L118.9,49.1L121.3,49.1L121.3,67.2L119,67.2L112.7,57.7L110.1,53.7L109.9,53.7L109.9,67.1L107.5,67.1L107.5,49.1L109.8,49.1L116.3,58.9L118.7,62.7L118.9,62.7Z"
              style={{ fillRule: 'nonzero' }}
            />
            <path
              d="M139,61.6C139,62.5 138.8,63.4 138.5,64.1C138.2,64.9 137.7,65.5 137.1,66C136.5,66.5 135.8,66.9 135,67.2C134.2,67.5 133.3,67.6 132.4,67.6C131.4,67.6 130.5,67.5 129.7,67.2C128.9,66.9 128.2,66.5 127.6,66C127,65.5 126.6,64.8 126.2,64.1C125.9,63.3 125.7,62.5 125.7,61.6L125.7,54.8C125.7,53.9 125.9,53.1 126.2,52.3C126.5,51.5 127,50.9 127.6,50.4C128.2,49.9 128.9,49.4 129.7,49.2C130.5,48.9 131.4,48.7 132.4,48.7C133.4,48.7 134.3,48.9 135.1,49.2C135.9,49.5 136.6,49.9 137.2,50.4C137.8,50.9 138.3,51.6 138.6,52.3C138.9,53 139.1,53.9 139.1,54.8L139.1,61.6L139,61.6ZM136.5,55.1C136.5,54.4 136.4,53.7 136.2,53.2C136,52.7 135.7,52.2 135.3,51.9C134.9,51.6 134.5,51.3 133.9,51.1C133.3,50.9 132.8,50.9 132.3,50.9C131.8,50.9 131.2,51 130.7,51.1C130.2,51.2 129.7,51.5 129.4,51.9C129,52.2 128.7,52.7 128.5,53.2C128.3,53.7 128.2,54.4 128.2,55.1L128.2,61.3C128.2,62 128.3,62.7 128.5,63.2C128.7,63.7 129,64.1 129.4,64.5C129.8,64.8 130.2,65.1 130.8,65.2C131.4,65.3 131.9,65.4 132.4,65.4C133,65.4 133.5,65.3 134,65.2C134.5,65 134.9,64.8 135.4,64.5C135.8,64.2 136.1,63.7 136.3,63.2C136.5,62.7 136.6,62 136.6,61.3L136.5,55.1Z"
              style={{ fillRule: 'nonzero' }}
            />

            <path
              className="fill-primary-500"
              d="M148.3,51.4L148.3,67.3L145.8,67.3L145.8,51.4L140.9,51.4L140.9,49.2L153.5,49.2L153.5,51.4L148.3,51.4Z"
              style={{ fillRule: 'nonzero' }}
            />
            <path
              className="fill-primary-500"
              d="M156.4,67.2L156.4,49.1L168.2,49.1L168.2,51.3L158.9,51.3L158.9,57.1L166.8,57.1L166.8,59.3L158.9,59.3L158.9,65L168.2,65L168.2,67.2L156.4,67.2Z"
              style={{ fillRule: 'nonzero' }}
            />
            <path
              className="fill-primary-500"
              d="M183.6,62.2C183.6,63 183.5,63.7 183.1,64.4C182.8,65 182.4,65.6 181.8,66C181.2,66.4 180.6,66.8 179.8,67C179,67.2 178.1,67.3 177.2,67.3C176,67.3 174.8,67.1 173.7,66.8C172.6,66.5 171.6,65.9 170.5,65.1L171.9,63.4C172.7,64 173.6,64.4 174.5,64.7C175.4,65 176.3,65.2 177.3,65.2C178.5,65.2 179.5,64.9 180.2,64.4C180.9,63.9 181.3,63.1 181.3,62.2C181.3,61.6 181.2,61.1 180.9,60.7C180.6,60.3 180.3,60 179.8,59.8C179.4,59.6 178.9,59.4 178.4,59.3C177.9,59.2 177.4,59.1 176.9,59C176.2,58.9 175.5,58.7 174.8,58.5C174.1,58.3 173.6,58 173,57.6C172.5,57.2 172.1,56.7 171.8,56.2C171.5,55.6 171.3,54.9 171.3,54.1C171.3,53.3 171.4,52.6 171.7,52C172,51.4 172.4,50.8 172.9,50.4C173.4,49.9 174,49.6 174.7,49.3C175.4,49 176.2,48.9 177.1,48.9C178.2,48.9 179.2,49 180.2,49.2C181.2,49.4 182.1,49.8 183.1,50.3L182,52.3C181.2,51.8 180.4,51.5 179.6,51.3C178.8,51.1 178,51 177.2,51C176.7,51 176.3,51.1 175.9,51.2C175.5,51.3 175.1,51.5 174.8,51.8C174.5,52 174.2,52.4 174,52.8C173.8,53.2 173.7,53.6 173.7,54.1C173.7,54.6 173.8,55 174.1,55.3C174.4,55.6 174.7,55.9 175.1,56.1C175.5,56.3 175.9,56.5 176.4,56.6C176.9,56.7 177.3,56.8 177.7,56.9C178.5,57.1 179.2,57.3 179.9,57.5C180.6,57.7 181.3,58 181.8,58.4C182.3,58.8 182.8,59.3 183.2,59.9C183.4,60.5 183.6,61.3 183.6,62.2Z"
              style={{ fillRule: 'nonzero' }}
            />
            <path
              className="fill-primary-500"
              d="M192.9,51.4L192.9,67.3L190.4,67.3L190.4,51.4L185.2,51.4L185.2,49.2L198.1,49.2L198.1,51.4L192.9,51.4Z"
              style={{ fillRule: 'nonzero' }}
            />
          </Fragment>
        )}
      </g>
    </svg>
  );
};

export default NanotestLogo;
