import { createContext, useContext } from "react";

export const DaylightContext = createContext(false);

import { palette as p } from "./scene-palette";

type Point = [number, number, number];
export function Block({
  position,
  size,
  color,
}: {
  position: Point;
  size: Point;
  color: string;
}) {
  const daylight = useContext(DaylightContext);
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={daylight && color === p.window ? p.dark : color}
        roughness={0.9}
        emissive={color === p.window ? p.window : "#000000"}
        emissiveIntensity={!daylight && color === p.window ? 1.3 : 0}
      />
    </mesh>
  );
}

function Tower({ x }: { x: number }) {
  return (
    <group position={[x, 0, 0]}>
      <Block position={[0, 0.3, 0]} size={[3.5, 0.7, 3.7]} color={p.stone} />
      {[-1, 1].map((side) => (
        <group key={side}>
          <Block
            position={[side * 1.03, 3.5, 0]}
            size={[0.85, 5.8, 2.5]}
            color={p.stone}
          />
          <Block
            position={[side * 1.03, 6.7, 0]}
            size={[1.02, 0.3, 2.8]}
            color={p.trim}
          />
        </group>
      ))}
      <Block position={[0, 5.4, 0]} size={[2.9, 1.6, 2.5]} color={p.stone} />
      <Block position={[0, 6.25, 0]} size={[3.15, 0.25, 2.75]} color={p.trim} />
      <Block position={[0, 7.05, 0]} size={[2.7, 1.35, 2.45]} color={p.stone} />
      {[-1, 1].flatMap((a) =>
        [-1, 1].map((b) => (
          <group key={`${a}-${b}`} position={[a * 1.15, 0, b * 1.1]}>
            <mesh position={[0, 5.2, 0]} castShadow>
              <cylinderGeometry args={[0.3, 0.37, 5.8, 8]} />
              <meshStandardMaterial color={p.trim} />
            </mesh>
            <mesh position={[0, 8.2, 0]} castShadow>
              <coneGeometry args={[0.5, 1.45, 4]} />
              <meshStandardMaterial color={p.roof} />
            </mesh>
            <Block
              position={[0, 8.95, 0]}
              size={[0.055, 0.45, 0.055]}
              color={p.dark}
            />
          </group>
        )),
      )}
      <mesh position={[0, 7.95, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[1.65, 1.25, 4]} />
        <meshStandardMaterial color={p.roof} />
      </mesh>
      {[-0.62, 0, 0.62].map((wx) => (
        <group key={wx}>
          <Block
            position={[wx, 5.65, 1.26]}
            size={[0.26, 0.7, 0.025]}
            color={p.window}
          />
          <Block
            position={[wx, 7, 1.24]}
            size={[0.23, 0.55, 0.025]}
            color={p.dark}
          />
        </group>
      ))}
      {[-1, 1].map((side) => (
        <Block
          key={side}
          position={[side * 1.04, 3.6, 1.26]}
          size={[0.22, 0.75, 0.025]}
          color={p.window}
        />
      ))}
    </group>
  );
}

function Beam({
  from,
  to,
  width = 0.08,
  color = p.steel,
}: {
  from: Point;
  to: Point;
  width?: number;
  color?: string;
}) {
  const dx = to[0] - from[0],
    dy = to[1] - from[1];
  return (
    <mesh
      position={[(from[0] + to[0]) / 2, (from[1] + to[1]) / 2, from[2]]}
      rotation={[0, 0, -Math.atan2(dx, dy)]}
    >
      <boxGeometry args={[width, Math.hypot(dx, dy), width]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

export function Bridge() {
  return (
    <group>
      <Block position={[0, 1.55, 0]} size={[56, 0.35, 2.5]} color={p.stone} />
      <Block position={[0, 1.75, 0]} size={[56, 0.08, 1.8]} color={p.road} />
      <Tower x={-7} />
      <Tower x={7} />
      {[-1.22, 1.22].map((z) => (
        <group key={z}>
          <Block
            position={[0, 6.15, z]}
            size={[14, 0.48, 0.28]}
            color={p.steel}
          />
          <Block
            position={[0, 6.45, z]}
            size={[14, 0.12, 0.36]}
            color={p.trim}
          />
          <Block
            position={[0, 2.08, z]}
            size={[56, 0.1, 0.09]}
            color={p.steel}
          />
          {Array.from({ length: 57 }, (_, i) => (
            <Block
              key={i}
              position={[i - 28, 1.9, z]}
              size={[0.055, 0.35, 0.055]}
              color={p.steel}
            />
          ))}
          {[-1, 1].map((side) => (
            <group key={side}>
              {Array.from({ length: 18 }, (_, i) => {
                const x1 = 7 + i,
                  x2 = x1 + 1;
                const y1 = 2.05 + 3.9 * Math.pow(1 - i / 18, 2);
                const y2 = 2.05 + 3.9 * Math.pow(1 - (i + 1) / 18, 2);
                return (
                  <group key={i}>
                    <Beam
                      from={[side * x1, y1, z]}
                      to={[side * x2, y2, z]}
                      width={0.15}
                    />
                    <Beam
                      from={[side * x1, 2.1, z]}
                      to={[side * x1, y1, z]}
                      width={0.045}
                    />
                  </group>
                );
              })}
            </group>
          ))}
          {Array.from({ length: 14 }, (_, i) => (
            <group key={i}>
              <Beam
                from={[i - 7, 5.95, z]}
                to={[i - 6, 6.35, z]}
                width={0.045}
              />
              <Beam
                from={[i - 7, 6.35, z]}
                to={[i - 6, 5.95, z]}
                width={0.045}
              />
            </group>
          ))}
        </group>
      ))}
    </group>
  );
}
