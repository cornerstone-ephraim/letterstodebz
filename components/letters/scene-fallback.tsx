import { atmospheres, type Atmosphere } from "./scene-palette";

export function SceneFallback({ atmosphere }: { atmosphere: Atmosphere }) {
  return (
    <svg
      className="scene-fallback"
      viewBox="0 0 1400 430"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      <path fill={atmospheres[atmosphere].river} d="M0 250H1400V430H0z" />
      <path
        fill="#667386"
        d="M0 225V185H80V160H140V205H210V150H270V175H340V210H1090V185H1160V155H1210V195H1320V160H1400V260H0z"
      />
      <g>
        <path fill="#334c43" d="M0 254H405V310H0zM995 254H1400V310H995z" />
        <path fill="#969287" d="M0 278H410V290H0zM990 278H1400V290H990z" />
        {Array.from({ length: 16 }, (_, i) => {
          const x = i < 8 ? i * 47 : 1010 + (i - 8) * 47;
          const h = 52 + (i % 3) * 17;
          return (
            <g key={i}>
              <rect
                x={x}
                y={264 - h}
                width="35"
                height={h}
                fill={i % 2 ? "#76685f" : "#89909b"}
              />
              {[0, 1, 2].map((row) => (
                <g key={row}>
                  <rect
                    x={x + 7}
                    y={272 - h + row * 15}
                    width="5"
                    height="8"
                    fill="#f5cd89"
                  />
                  <rect
                    x={x + 23}
                    y={272 - h + row * 15}
                    width="5"
                    height="8"
                    fill="#f5cd89"
                  />
                </g>
              ))}
              <path d={`M${x + 39} 276v-22`} stroke="#635549" strokeWidth="3" />
              <ellipse cx={x + 39} cy="249" rx="7" ry="12" fill="#3c5c4b" />
            </g>
          );
        })}
      </g>
      <g fill="#89909b" stroke="#a1a9b5" strokeWidth="5">
        <path d="M420 280V100H470V70H530V100H580V280H535V215Q500 170 465 215V280z" />
        <path d="M820 280V100H870V70H930V100H980V280H935V215Q900 170 865 215V280z" />
      </g>
      <g fill="#6c8587">
        <path d="M410 100L443 45L479 100zM523 100L556 45L590 100zM810 100L843 45L879 100zM923 100L956 45L990 100z" />
      </g>
      <g fill="none" stroke="#83a6af">
        <path strokeWidth="14" d="M0 281H1400M565 139H835" />
        <path
          strokeWidth="6"
          d="M0 277Q230 270 435 120M970 120Q1170 270 1400 277"
        />
      </g>
      <g stroke={atmospheres[atmosphere].reflection} opacity=".3">
        {Array.from({ length: 55 }, (_, i) => (
          <path
            key={i}
            d={`M${(i * 137) % 1400} ${315 + ((i * 17) % 110)}h${12 + ((i * 7) % 65)}`}
          />
        ))}
      </g>
      <g stroke="#e9e3d7" opacity=".5">
        <path d="M230 355h170m350 35h220m150-50h100M100 410h180" />
      </g>
    </svg>
  );
}
