import type { Media, TeamMember } from '@/payload-types';
import { At, Phone, SpinnerGap } from '@phosphor-icons/react/dist/ssr';
import type React from 'react';

interface TeamMemberCardProps extends React.HTMLProps<HTMLLIElement> {
  member: TeamMember;
}

export default function TeamMemberCard({ member, className }: TeamMemberCardProps) {
  const clipPathId = `clip-path-${member.id}`;
  const imgUrl =
    (member.portrait as Media)?.sizes?.small?.url ??
    `https://api.dicebear.com/9.x/personas/svg?seed=${member.name.replaceAll(' ', '+')}&backgroundColor=00a984,6d1b67&backgroundType=gradientLinear&clothingColor=e0e0e0`;

  return (
    <li
      key={member.id}
      className={`relative group flex team-member-card w-full aspect-square rounded-2xl focus-visible:outline-none ${className}`}
      tabIndex={0}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 96 99"
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
              d="M10.711,19.931l29.112,-15.84c5.124,-2.788 11.238,-2.788 16.355,-0l29.112,15.84c5.373,2.925 8.71,8.49 8.71,14.532l0,29.411c0,5.917 -3.236,11.424 -8.445,14.382l-29.111,16.526c-2.601,1.478 -5.525,2.218 -8.442,2.218c-2.92,0 -5.845,-0.74 -8.446,-2.218l-29.11,-16.526c-5.21,-2.958 -8.446,-8.465 -8.446,-14.382l-0,-29.411c-0,-6.042 3.337,-11.607 8.711,-14.532Z"
              stroke="green"
              fill="none"
            />
          </clipPath>
        </defs>
        <g>
          {member.portrait && (
            <image
              xlinkHref={(member.portrait as Media).blurDataUrl as string}
              width="100%"
              height="100%"
              preserveAspectRatio="xMidYMid slice"
              clipPath={`url(#${clipPathId})`}
            />
          )}
          <SpinnerGap
            size="33.333333%"
            x={96 / 3}
            y={99 / 3}
            color="var(--primary)"
            className="[transform-origin:center] spin-loader"
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
          className="stroke-primary fill-transparent group-hover:stroke-foreground group-focus-visible:stroke-focus group-focus-within:stroke-foreground group-hover:fill-primary group-focus-within:fill-primary transition-colors"
          d="M10.711,19.931l29.112,-15.84c5.124,-2.788 11.238,-2.788 16.355,-0l29.112,15.84c5.373,2.925 8.71,8.49 8.71,14.532l0,29.411c0,5.917 -3.236,11.424 -8.445,14.382l-29.111,16.526c-2.601,1.478 -5.525,2.218 -8.442,2.218c-2.92,0 -5.845,-0.74 -8.446,-2.218l-29.11,-16.526c-5.21,-2.958 -8.446,-8.465 -8.446,-14.382l-0,-29.411c-0,-6.042 3.337,-11.607 8.711,-14.532Z" // prettier-ignore
          style={{
            strokeWidth: 2,
            fillOpacity: 0.9,
          }}
        />
      </svg>
      <div className="absolute inset-0 w-full h-fit ps-[11%] group-hover:ps-[13%] group-focus-within:ps-[13%] py-3 m-auto opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-[opacity,padding] text-foreground">
        <h3 className="text-xl font-bold leading-tight">{member.name}</h3>
        <p className="text-md">{member.position}</p>
        {(member.phone || member.email) && (
          <ul className="list-none flex flex-row mt-2 gap-2 pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto">
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
