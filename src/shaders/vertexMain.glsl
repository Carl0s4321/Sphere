vec3 coords = vNormal;
coords.y += uTime;
vec3 noisePattern = vec3(noise(coords));
vDisplacement = wave(noisePattern);

    // position + normal * vDisplacement -> from the original sphere, push by `vDisplacement` value along the normal
float displacement = vDisplacement / 2.0; // too tall

    // look at shaderChunks.js -> displacementmap_vertex.glsl.js to find out where transformed comes from
transformed += normalize(objectNormal) * displacement;