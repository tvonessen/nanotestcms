import type { Media, TeamMember } from '@/payload-types';
import { SpinnerGap } from '@phosphor-icons/react/dist/ssr';

export default function TeamMemberCard({ member }: { member: TeamMember }) {
  const clipPathId = `clip-path-${member.id}`;
  const imgUrl = (member.portrait as Media).sizes?.small?.url as string;

  return (
    <div key={member.id} className="team-member-card w-32 aspect-square">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 101 110"
        style={{
          fillRule: 'evenodd',
          clipRule: 'evenodd',
          strokeLinejoin: 'round',
          strokeMiterlimit: 0,
        }}
      >
        <title>{member.name}</title>
        <defs>
          <clipPath id={clipPathId}>
            <path d="M13.19,26.903l28.829,-15.92c5.075,-2.803 11.13,-2.803 16.197,-0l28.83,15.92c5.321,2.94 8.626,8.534 8.626,14.606l-0,29.56c-0,5.947 -3.205,11.483 -8.364,14.456l-28.829,16.61c-2.575,1.485 -5.471,2.229 -8.359,2.229c-2.892,0 -5.789,-0.744 -8.364,-2.229l-28.829,-16.61c-5.159,-2.973 -8.364,-8.509 -8.364,-14.456l0,-29.56c0,-6.072 3.305,-11.666 8.627,-14.606Z" />
          </clipPath>
        </defs>
        <path
          className="fill-[var(--primary)]"
          d="M13.189,26.903l28.83,-15.92c5.075,-2.803 11.13,-2.803 16.197,-0l28.83,15.92c5.321,2.94 8.626,8.534 8.626,14.606l-0.001,29.56c0.001,5.947 -3.204,11.483 -8.363,14.456l-28.829,16.61c-2.575,1.485 -5.471,2.229 -8.36,2.229c-2.892,0 -5.788,-0.744 -8.364,-2.229l-28.828,-16.61c-5.159,-2.973 -8.364,-8.509 -8.364,-14.456l-0,-29.56c-0,-6.072 3.304,-11.666 8.626,-14.606Zm-2.213,63.671l28.829,15.919c6.459,3.569 14.165,3.561 20.624,0l28.829,-15.919c6.772,-3.743 10.981,-10.867 10.981,-18.594l-0,-34.131c-0,-7.569 -4.084,-14.618 -10.647,-18.398l-28.829,-16.611c-3.284,-1.892 -6.968,-2.84 -10.644,-2.84c-3.679,0 -7.363,0.948 -10.647,2.84l-28.829,16.611c-6.563,3.78 -10.643,10.829 -10.643,18.398l-0,34.131c-0,7.727 4.204,14.851 10.976,18.594Z"
          style={{ fillRule: 'nonzero' }}
        />
        <image
          xlinkHref={(member.portrait as Media).blurDataUrl as string}
          className="blur-sm"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid slice"
          clipPath={`url(#${clipPathId})`}
        />
        <SpinnerGap
          size={31}
          x={(101 - 31) / 2}
          y={(110 - 31) / 2}
          color="var(--primary)"
          className="[transform-origin:center] spin-loader"
        />
        {/* <image
          href={imgUrl}
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid slice"
          clipPath={`url(#${clipPathId})`}
        /> */}
      </svg>
    </div>
  );
}
