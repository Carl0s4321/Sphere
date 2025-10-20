import * as THREE from "three";
import { useEffect, useRef, useState, type JSX } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

import fragmentShader from "./shaders/fragment.glsl";
import vertexShader from "./shaders/vertex.glsl";
import vertexShaderPars from "./shaders/vertexPars.glsl";
import vertexShaderMain from "./shaders/vertexMain.glsl";

import { OrbitControls } from "@react-three/drei";

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

  return (
    <mesh
      {...props}
      ref={ref}
      // scale={clicked ? 1.5 : 1}
      // onClick={() => click(!clicked)}
      // onPointerOver={() => hover(true)}
      // onPointerOut={() => hover(false)}
    >
      <icosahedronGeometry args={[2, 100]} />
      <meshStandardMaterial
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
          )
          console.log(shader.vertexShader);
        }}
      />
    </mesh>
  );
}

export default function App() {
  return (
    <Canvas>
      <ambientLight intensity={Math.PI / 2} />
      <OrbitControls />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        decay={0}
        intensity={Math.PI}
      />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />

      <Box position={[0, 0, 0]} />
    </Canvas>
  );
}
