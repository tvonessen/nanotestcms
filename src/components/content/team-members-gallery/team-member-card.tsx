import type { Media, TeamMember } from '@/payload-types';
import { At, Phone, SpinnerGap } from '@phosphor-icons/react/dist/ssr';
import type React from 'react';

interface TeamMemberCardProps extends React.HTMLProps<HTMLLIElement> {
  member: TeamMember;
}

export default function TeamMemberCard({ member, className }: TeamMemberCardProps) {
  const clipPathId = `clip-path-${member.id}`;
  const imgUrl = (member.portrait as Media).sizes?.small?.url as string;

  return (
    <li
      key={member.id}
      className={`relative group flex team-member-card w-full aspect-square rounded-2xl ${className}`}
    >
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
            <path
              d="M13.19,26.903l28.829,-15.92c5.075,-2.803 11.13,-2.803 16.197,-0l28.83,15.92c5.321,2.94 8.626,8.534 8.626,14.606l-0,29.56c-0,5.947 -3.205,11.483 -8.364,14.456l-28.829,16.61c-2.575,1.485 -5.471,2.229 -8.359,2.229c-2.892,0 -5.789,-0.744 -8.364,-2.229l-28.829,-16.61c-5.159,-2.973 -8.364,-8.509 -8.364,-14.456l0,-29.56c0,-6.072 3.305,-11.666 8.627,-14.606Z"
              stroke="green"
              fill="none"
            />
          </clipPath>
        </defs>
        <g>
          <image
            xlinkHref={(member.portrait as Media).blurDataUrl as string}
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid slice"
            clipPath={`url(#${clipPathId})`}
          />
          <SpinnerGap
            size="33.333333%"
            x={101 / 3}
            y={110 / 3}
            color="var(--primary)"
            className="[transform-origin:center] spin-loader left-6"
          />
          <image
            href={imgUrl}
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid slice"
            clipPath={`url(#${clipPathId})`}
          />
        </g>
        <path
          className="stroke-primary fill-transparent group-hover:stroke-foreground group-focus-within:stroke-f  oreground group-hover:fill-primary group-focus-within:fill-primary transition-colors"
          d="M13.19,26.903l28.829,-15.92c5.075,-2.803 11.13,-2.803 16.197,-0l28.83,15.92c5.321,2.94 8.626,8.534 8.626,14.606l-0,29.56c-0,5.947 -3.205,11.483 -8.364,14.456l-28.829,16.61c-2.575,1.485 -5.471,2.229 -8.359,2.229c-2.892,0 -5.789,-0.744 -8.364,-2.229l-28.829,-16.61c-5.159,-2.973 -8.364,-8.509 -8.364,-14.456l0,-29.56c0,-6.072 3.305,-11.666 8.627,-14.606Z" // prettier-ignore
          style={{
            strokeWidth: 2,
            fillOpacity: 0.9,
          }}
        />
      </svg>
      <div className="absolute inset-0 w-full h-fit px-10 py-3 m-auto opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-[opacity] text-foreground">
        <h3 className="text-xl font-bold leading-tight">{member.name}</h3>
        <p className="text-md">{member.position}</p>
        {(member.phone || member.email) && (
          <ul className="list-none flex flex-row mt-2 gap-2">
            {member.phone && (
              <li>
                <a
                  href={`tel:${member.phone}`}
                  className="block p-1 bg-transparent rounded-lg transition-colors hover:bg-background focus-visible:bg-background"
                >
                  <Phone weight="fill" size={28} />
                </a>
              </li>
            )}
            {member.email && (
              <li>
                <a
                  href={`tel:${member.email}`}
                  className="block p-1 bg-transparent rounded-lg transition-colors hover:bg-background focus-visible:bg-background"
                >
                  <At weight="bold" size={28} />
                </a>
              </li>
            )}
          </ul>
        )}
      </div>
    </li>
  );
}
