import { Block } from "./bridge";
import type { Season } from "@/data/letters";
import { palette as p, seasons } from "./scene-palette";

function Townhouse({
  x,
  z,
  floors,
  brick,
  pitched = false,
}: {
  x: number;
  z: number;
  floors: number;
  brick: string;
  pitched?: boolean;
}) {
  const h = floors * 1.05;

  return (
    <group position={[x, 1.7, z]}>
      <Block position={[0, h / 2, 0]} size={[2.6, h, 2.8]} color={brick} />
      <Block
        position={[0, h + 0.12, 0]}
        size={[2.85, 0.22, 3]}
        color={p.trim}
      />
      {pitched && (
        <mesh position={[0, h + 0.65, 0]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[2, 1.1, 4]} />
          <meshStandardMaterial color={p.roof} />
        </mesh>
      )}
      <Block
        position={[0.85, h + 0.55, -0.65]}
        size={[0.3, 0.8, 0.4]}
        color={brick}
      />
      {Array.from({ length: floors }, (_, floor) => (
        <group key={floor}>
          <Block
            position={[0, floor * 1.05 + 0.15, 1.43]}
            size={[2.7, 0.08, 0.08]}
            color={p.trim}
          />
          {[-0.8, 0, 0.8].map((xw, i) => (
            <Block
              key={xw}
              position={[xw, floor * 1.05 + 0.65, 1.42]}
              size={[0.34, 0.57, 0.04]}
              color={(floor + i + Math.abs(x)) % 4 < 2 ? p.window : p.dark}
            />
          ))}
        </group>
      ))}
      <Block
        position={[0, 0.4, 1.44]}
        size={[0.45, 0.8, 0.08]}
        color={p.dark}
      />
    </group>
  );
}

function Tree({
  x,
  z,
  tall = 1,
  foliage,
}: {
  x: number;
  z: number;
  tall?: number;
  foliage: string;
}) {
  return (
    <group position={[x, 1.7, z]} scale={tall}>
      <Block position={[0, 0.65, 0]} size={[0.12, 1.3, 0.12]} color={p.trunk} />
      <mesh position={[0, 1.55, 0]} scale={[0.65, 1, 0.65]}>
        <icosahedronGeometry args={[0.9, 1]} />
        <meshStandardMaterial color={foliage} roughness={1} />
      </mesh>
    </group>
  );
}

function StreetLamp({ x }: { x: number }) {
  return (
    <group position={[x, 1.7, 1.8]}>
      <Block position={[0, 1, 0]} size={[0.07, 2, 0.07]} color={p.dark} />
      <Block
        position={[0, 2.05, 0]}
        size={[0.24, 0.28, 0.24]}
        color={p.window}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.035, 0]}>
        <circleGeometry args={[0.65, 16]} />
        <meshBasicMaterial
          color={p.window}
          transparent
          opacity={0.08}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function Castle() {
  return (
    <group position={[37, 1.7, -8]}>
      <Block position={[0, 1.7, 0]} size={[8, 3.4, 4]} color={p.stone} />
      <Block position={[0, 3.5, 0]} size={[8.3, 0.25, 4.3]} color={p.trim} />
      {[-3.7, 3.7].flatMap((x) =>
        [-1.7, 1.7].map((z) => (
          <group key={`${x}-${z}`} position={[x, 0, z]}>
            <Block position={[0, 2.4, 0]} size={[1, 4.8, 1]} color={p.trim} />
            <mesh position={[0, 5.25, 0]}>
              <coneGeometry args={[0.85, 1.1, 4]} />
              <meshStandardMaterial color={p.roof} />
            </mesh>
          </group>
        )),
      )}
      {[-2.7, -1.35, 0, 1.35, 2.7].map((x) => (
        <Block
          key={x}
          position={[x, 2.3, 2.02]}
          size={[0.35, 0.75, 0.03]}
          color={p.window}
        />
      ))}
    </group>
  );
}

/** A composed side elevation: Southwark to the left, Tower Hamlets to the right.
 * Their actual banks are south and north; this is not a geographic map. */
export function LondonBanks({ season }: { season: Season }) {
  return (
    <group>
      {[-1, 1].map((side) => (
        <group key={side}>
          <Block
            position={[side * 59, 0.7, -4]}
            size={[66, 2, 22]}
            color={p.bank}
          />
          <Block
            position={[side * 59, 1.71, -4]}
            size={[66, 0.03, 22]}
            color={seasons[season].grass}
          />
          <Block
            position={[side * 59, 1.76, 0]}
            size={[62, 0.08, 1.8]}
            color={p.road}
          />
          <Block
            position={[side * 59, 1.79, 1.3]}
            size={[62, 0.1, 0.65]}
            color={p.pavement}
          />
          <Block
            position={[side * 59, 1.79, -1.3]}
            size={[62, 0.1, 0.65]}
            color={p.pavement}
          />
          <Block
            position={[side * 59, 0.85, 7]}
            size={[66, 1.7, 0.35]}
            color={p.stone}
          />
          <Block
            position={[side * 59, 1.72, 6.6]}
            size={[66, 0.12, 1.1]}
            color={p.pavement}
          />
          {/* A side road joins the bridge approach and continues through each borough. */}
          <Block
            position={[side * 49, 1.77, -6]}
            size={[2, 0.08, 12]}
            color={p.road}
          />
          {Array.from({ length: 24 }, (_, i) => (
            <Block
              key={i}
              position={[side * (29 + i * 2.5), 1.81, 0]}
              size={[0.8, 0.015, 0.035]}
              color={p.trim}
            />
          ))}
          {Array.from({ length: 8 }, (_, i) => (
            <StreetLamp key={i} x={side * (29 + i * 7)} />
          ))}
          {Array.from({ length: 12 }, (_, i) => (
            <Tree
              foliage={seasons[season].foliage}
              key={i}
              x={side * (28 + i * 4.8)}
              z={i % 2 ? 4.5 : -2.3}
              tall={0.75 + (i % 3) * 0.12}
            />
          ))}
        </group>
      ))}
      {Array.from({ length: 14 }, (_, i) => (
        <Townhouse
          key={`south-${i}`}
          x={-31 - i * 3.65}
          z={-5}
          floors={3 + (i % 3)}
          brick={[p.brick, p.stone, p.cream][i % 3]}
          pitched={i % 3 === 0}
        />
      ))}
      {Array.from({ length: 10 }, (_, i) => (
        <Townhouse
          key={`north-${i}`}
          x={49 + i * 3.6}
          z={-5}
          floors={2 + (i % 4)}
          brick={[p.cream, p.brick, p.stone][i % 3]}
          pitched={i % 2 === 0}
        />
      ))}
      <Castle />
      <mesh position={[-53, 8.7, -11]}>
        <coneGeometry args={[2.2, 14, 4]} />
        <meshStandardMaterial color={p.steel} roughness={0.4} />
      </mesh>
      <Block
        position={[-53, 9, -9.9]}
        size={[0.07, 11, 0.04]}
        color={p.window}
      />
    </group>
  );
}
