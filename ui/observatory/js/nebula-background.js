/**
 * Room Atmosphere Background — Warm dark gradient with subtle particles
 * Matches WeeCare Foundation aesthetic: deep blue-black with warm undertones
 */
import * as THREE from 'three';

const BG_VERTEX = `
varying vec3 vWorldPos;
void main() {
  vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const BG_FRAGMENT = `
uniform float uTime;
uniform float uOctaves;
varying vec3 vWorldPos;

vec3 hash33(vec3 p) {
  p = fract(p * vec3(443.8975, 397.2973, 491.1871));
  p += dot(p, p.yxz + 19.19);
  return fract(vec3(p.x * p.y, p.y * p.z, p.z * p.x));
}

float noise3d(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float n = mix(
    mix(mix(dot(hash33(i), f), dot(hash33(i + vec3(1,0,0)), f - vec3(1,0,0)), f.x),
        mix(dot(hash33(i + vec3(0,1,0)), f - vec3(0,1,0)), dot(hash33(i + vec3(1,1,0)), f - vec3(1,1,0)), f.x), f.y),
    mix(mix(dot(hash33(i + vec3(0,0,1)), f - vec3(0,0,1)), dot(hash33(i + vec3(1,0,1)), f - vec3(1,0,1)), f.x),
        mix(dot(hash33(i + vec3(0,1,1)), f - vec3(0,1,1)), dot(hash33(i + vec3(1,1,1)), f - vec3(1,1,1)), f.x), f.y),
    f.z);
  return n * 0.5 + 0.5;
}

float fbm(vec3 p, float octaves) {
  float v = 0.0, a = 0.5;
  for (float i = 0.0; i < 5.0; i++) {
    if (i >= octaves) break;
    v += a * noise3d(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec3 dir = normalize(vWorldPos);

  // Soft luminous atmosphere with subtle color variation
  float n1 = fbm(dir * 2.5 + uTime * 0.008, uOctaves);
  float n2 = fbm(dir * 4.0 - uTime * 0.005, max(1.0, uOctaves - 1.0));

  // Light Palette: crisp silver-white to soft sky-ice blue
  vec3 lightTop     = vec3(0.97, 0.98, 1.0);
  vec3 lightBottom  = vec3(0.90, 0.93, 0.97);
  vec3 mintTint     = vec3(0.92, 0.97, 0.95);

  vec3 bg = mix(lightBottom, lightTop, max(0.0, dir.y * 0.8 + 0.2));
  bg = mix(bg, mintTint, n1 * 0.15);

  // Subtle ground ambient
  float groundFactor = max(0.0, -dir.y) * 0.05;
  bg -= vec3(0.03, 0.03, 0.02) * groundFactor;

  gl_FragColor = vec4(bg, 1.0);
}
`;

export class NebulaBackground {
  constructor(scene) {
    this._octaves = 4;

    this.uniforms = {
      uTime: { value: 0 },
      uOctaves: { value: this._octaves },
    };

    const geo = new THREE.SphereGeometry(150, 32, 32);
    const mat = new THREE.ShaderMaterial({
      vertexShader: BG_VERTEX,
      fragmentShader: BG_FRAGMENT,
      uniforms: this.uniforms,
      side: THREE.BackSide,
      depthWrite: false,
    });

    this.mesh = new THREE.Mesh(geo, mat);
    scene.add(this.mesh);
  }

  update(dt, elapsed) {
    this.uniforms.uTime.value = elapsed;
  }

  setQuality(level) {
    this._octaves = [2, 3, 4][level] || 4;
    this.uniforms.uOctaves.value = this._octaves;
  }

  dispose() {
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
  }
}
