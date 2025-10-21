import * as THREE from "three";
import { useEffect, useRef, useState, type JSX } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

import fragmentShader from "./shaders/fragment.glsl";
import fragmentShaderMain from "./shaders/fragmentMain.glsl";
import fragmentShaderPars from "./shaders/fragmentPars.glsl";

import vertexShader from "./shaders/vertex.glsl";
import vertexShaderPars from "./shaders/vertexPars.glsl";
import vertexShaderMain from "./shaders/vertexMain.glsl";

import { OrbitControls } from "@react-three/drei";

import {
  EffectComposer,
  Bloom,
  ToneMapping,
} from "@react-three/postprocessing";

function Box(props: JSX.IntrinsicElements["mesh"]) {
  const ref = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null!);

  // const [hovered, hover] = useState(false);
  // const [clicked, click] = useState(false);

  useFrame((_, delta) => {
    /* @ts-ignore */
    // ref.current.material.uniforms.uTime.value += .15 * delta;

    // ref.current.rotation.x += 1 * delta;
    // ref.current.rotation.y += 0.5 * delta;

    const shader = materialRef.current.userData.shader;
    if (shader) shader.uniforms.uTime.value += 0.15 * delta;
  });

  // useEffect(() => {
  //   /* @ts-ignore */
  //   console.log("uniforms", ref?.current.material.uniforms);
  // }, [ref]);
  const color = "hotpink";

  return (
    <mesh
      {...props}
      ref={ref}
      // scale={clicked ? 1.5 : 1}
      // onClick={() => click(!clicked)}
      // onPointerOver={() => hover(true)}
      // onPointerOut={() => hover(false)}
    >
      <icosahedronGeometry args={[2, 300]} />
      <meshStandardMaterial
        emissive={color}
        emissiveIntensity={3}
        ref={materialRef}
        onBeforeCompile={(shader) => {
          materialRef.current.userData.shader = shader;

          shader.uniforms.uTime = { value: 0 };

          const parsVertexStr = /* glsl */ `#include <displacementmap_pars_vertex>`;
          /* The first line of the pars/main file continues at the end of the last file in the include. This means that it ruins an ifdef block, then the compilation fails. If theres one free line at the beginning of the main file, this won't happen. But if the code starts at the first line, need to add linebreak into the replace
           */
          shader.vertexShader = shader.vertexShader.replace(
            parsVertexStr,
            parsVertexStr + "\n" + vertexShaderPars
          );

          const mainVertexStr = /* glsl */ `#include <displacementmap_vertex>`;
          shader.vertexShader = shader.vertexShader.replace(
            mainVertexStr,
            mainVertexStr + "\n" + vertexShaderMain
          );

          const mainFragmentStr = /* glsl */ `#include <normal_fragment_maps>`;
          shader.fragmentShader = shader.fragmentShader.replace(
            mainFragmentStr,
            mainFragmentStr + "\n" + fragmentShaderMain
          );

          const parsFragmentStr = /* glsl */ `#include <bumpmap_pars_fragment>`;
          shader.fragmentShader = shader.fragmentShader.replace(
            parsFragmentStr,
            parsFragmentStr + "\n" + fragmentShaderPars
          );

          console.log(shader.fragmentShader);
        }}
      />
    </mesh>
  );
}

export default function App() {
  return (
    <Canvas camera={{position:[0,0,1.7], fov:200}}>
      <ambientLight intensity={0.5} />
      {/* <ambientLight color={`#4255ff`} intensity={0.5} />
      <directionalLight
        position={[5, 5, 5]}
        color={`#526cff`}
        intensity={0.6}
      /> */}
      <EffectComposer enableNormalPass={false}>
        <Bloom
          mipmapBlur
          luminanceThreshold={1}
          levels={7}
          intensity={0.1 * 4}
        />
        <ToneMapping />
      </EffectComposer>

      <OrbitControls />

      <Box position={[0, 0, 0]} />
    </Canvas>
  );
}
