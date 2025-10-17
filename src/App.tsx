import * as THREE from "three";
import { useEffect, useRef, useState, type JSX } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

import fragmentShader from "./shaders/fragment.glsl";
import vertexShader from "./shaders/vertex.glsl";
import { OrbitControls } from "@react-three/drei";

function Box(props: JSX.IntrinsicElements["mesh"]) {
  const ref = useRef<THREE.Mesh>(null!);
  // const [hovered, hover] = useState(false);
  // const [clicked, click] = useState(false);

  useFrame((_, delta) => {
    // console.log("state", state);
    // console.log('delta', delta)
    /* @ts-ignore */
    ref.current.material.uniforms.uTime.value += .15 * delta;
    // ref.current.rotation.x += 1 * delta;
    // ref.current.rotation.y += 0.5 * delta;
  });

  useEffect(() => {
    /* @ts-ignore */
    console.log(ref?.current.material.uniforms);
  }, [ref]);

  return (
    <mesh
      {...props}
      ref={ref}
      // scale={clicked ? 1.5 : 1}
      // onClick={() => click(!clicked)}
      // onPointerOver={() => hover(true)}
      // onPointerOut={() => hover(false)}
    >
      <icosahedronGeometry args={[2, 10]} />
      <shaderMaterial
        uniforms={{ uTime: { value: 0 } }}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
      />
    </mesh>
  );
}

export default function App() {
  return (
    <Canvas>
      <ambientLight intensity={Math.PI / 2} />
      <OrbitControls/>
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
