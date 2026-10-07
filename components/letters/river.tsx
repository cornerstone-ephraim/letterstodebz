"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Color, type ShaderMaterial } from "three";
import { atmospheres, type Atmosphere } from "./scene-palette";

// A single surface adds detail without reflection render targets or extra draw calls.
export function River({
  atmosphere,
  paused,
}: {
  atmosphere: Atmosphere;
  paused: boolean;
}) {
  const material = useRef<ShaderMaterial>(null);
  const palette = atmospheres[atmosphere];
  const uniforms = useMemo(
    () => ({
      time: { value: 0 },
      water: { value: new Color(palette.river) },
      sky: { value: new Color(palette.horizon) },
      glint: { value: new Color(palette.reflection) },
    }),
    [palette],
  );
  useFrame((_, delta) => {
    if (!paused && material.current)
      material.current.uniforms.time.value += Math.min(delta, 0.05);
  });
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.18, 0]}>
      <planeGeometry args={[250, 250]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={`varying vec2 riverPosition;
   void main() { riverPosition=position.xy; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`}
        fragmentShader={`uniform float time; uniform vec3 sky; uniform vec3 water; uniform vec3 glint; varying vec2 riverPosition;
   void main() {
    vec2 p=riverPosition;
    float swell=sin(p.y*0.7+sin(p.x*0.13)+time*0.3)*0.035;
    float wave=sin(p.y*2.5+sin(p.x*0.6+time*0.25)*1.5-time*0.65);
    float fine=sin(p.y*6.0+sin(p.x*1.4-time*0.18));
    float broken=smoothstep(0.15,0.8,sin(p.x*1.7+p.y*0.2+time*0.2));
    float ripples=smoothstep(0.88,1.0,wave)*broken;
    float path=exp(-pow((p.x+15.0+sin(p.y*0.4)*3.0)/12.0,2.0));
    float shimmer=path*smoothstep(0.6,1.0,fine)*0.12;
    vec3 color=water*(0.92+swell)+glint*(ripples*0.045+shimmer);
    color=mix(color,sky,smoothstep(8.0,85.0,p.y)*0.85);
    gl_FragColor=vec4(color,1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
   }`}
      />
    </mesh>
  );
}
