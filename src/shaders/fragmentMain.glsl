// taken from normal_fragment_maps.glsl.js for the bumpmap
// perturbNormalArb is a func from bumpmap_pars_fragment.glsl.js
normal = perturbNormalArb( - vViewPosition, normal, vec2(dFdx(vDisplacement), dFdy(vDisplacement)), faceDirection );