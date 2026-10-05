"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, RoundedBox, useTexture } from "@react-three/drei";
import { Suspense, useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";

/** Estado compartido con la sección: avance del scroll y posición del mouse. */
export type SceneInput = { p: number; mx: number; my: number; reduced: boolean };

const LAPTOP_SCREENS = [
  "/projects/devices/laptop-web.jpg",
  "/projects/dentalmate-preview.jpg",
  "/projects/grupo-gi-preview.jpg",
  "/projects/jonal-parfum-preview.jpg",
];
const PHONE_SCREENS = ["/projects/devices/phone-ios.jpg", "/projects/devices/phone-android.jpg"];

/** Color correcto y nitidez en ángulo para las texturas cargadas. */
function prepareTexture(tex: THREE.Texture | THREE.Texture[]) {
  for (const t of Array.isArray(tex) ? tex : [tex]) {
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
  }
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const lerp = THREE.MathUtils.lerp;

/** Textura de teclado dibujada en un canvas: teclas con retroiluminación azul. */
function useKeyboardTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 1024;
    c.height = 360;
    const g = c.getContext("2d")!;
    g.fillStyle = "#07090e";
    g.fillRect(0, 0, c.width, c.height);
    const rows = 5;
    const cols = 14;
    const gap = 10;
    const kw = (c.width - gap * (cols + 1)) / cols;
    const kh = (c.height - gap * (rows + 1)) / rows;
    for (let r = 0; r < rows; r++) {
      for (let k = 0; k < cols; k++) {
        const x = gap + k * (kw + gap);
        const y = gap + r * (kh + gap);
        const w = r === rows - 1 && k === 5 ? kw * 4 + gap * 3 : kw;
        if (r === rows - 1 && k > 5 && k < 9) continue;
        g.fillStyle = "#151a24";
        g.beginPath();
        g.roundRect(x, y, w, kh, 8);
        g.fill();
        g.strokeStyle = "rgba(77,140,255,0.28)";
        g.lineWidth = 2;
        g.stroke();
      }
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  }, []);
}

const aluminum = { color: "#a3abb8", metalness: 0.78, roughness: 0.3 };
const titanium = { color: "#8e939c", metalness: 0.9, roughness: 0.28 };
const graphite = { color: "#3b4458", metalness: 0.82, roughness: 0.32 };

function Screen({
  texture,
  width,
  height,
  z,
}: {
  texture: THREE.Texture;
  width: number;
  height: number;
  z: number;
}) {
  return (
    <mesh position={[0, 0, z]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

function Laptop({ input, screens }: { input: MutableRefObject<SceneInput>; screens: THREE.Texture[] }) {
  const lid = useRef<THREE.Group>(null);
  const keyboard = useKeyboardTexture();
  const logo = useTexture("/brand/atrix-mark-on-dark-v5.png", prepareTexture);
  const screenMat = useRef<THREE.MeshBasicMaterial>(null);
  const shown = useRef(0);

  useFrame((_, dt) => {
    const { p, reduced } = input.current;
    const open = reduced ? 1 : smooth(0.02, 0.32, p);
    // Cerrada: la tapa descansa sobre la base. Abierta: ligeramente inclinada hacia atrás.
    const target = lerp(Math.PI / 2 - 0.03, -0.22, open);
    if (lid.current) lid.current.rotation.x = THREE.MathUtils.damp(lid.current.rotation.x, target, 6, dt);

    // Cambia de sitio en pantalla según el avance.
    const idx = reduced ? 0 : Math.min(screens.length - 1, Math.floor(smooth(0.3, 0.95, p) * screens.length));
    if (idx !== shown.current && screenMat.current) {
      shown.current = idx;
      screenMat.current.map = screens[idx];
      screenMat.current.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Base */}
      <RoundedBox args={[3.3, 0.11, 2.25]} radius={0.05} smoothness={4}>
        <meshStandardMaterial {...aluminum} />
      </RoundedBox>
      <mesh position={[0, 0.056, -0.28]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.85, 1.0]} />
        <meshStandardMaterial map={keyboard} emissive="#1a63e6" emissiveIntensity={0.12} emissiveMap={keyboard} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.056, 0.62]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.15, 0.68]} />
        <meshStandardMaterial color="#2b313c" metalness={0.6} roughness={0.25} />
      </mesh>

      {/* Tapa con bisagra en el borde trasero */}
      <group ref={lid} position={[0, 0.055, -1.12]} rotation={[Math.PI / 2 - 0.03, 0, 0]}>
        <RoundedBox args={[3.3, 2.15, 0.07]} radius={0.04} smoothness={4} position={[0, 1.075, 0]}>
          <meshStandardMaterial {...aluminum} />
        </RoundedBox>
        {/* Logo iluminado en la tapa: es lo que se ve con la laptop cerrada. */}
        <mesh position={[0, 1.075, -0.037]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[0.62, 0.62]} />
          <meshBasicMaterial map={logo} transparent toneMapped={false} />
        </mesh>
        <mesh position={[0, 1.09, 0.036]}>
          <planeGeometry args={[3.16, 2.0]} />
          <meshStandardMaterial color="#05070b" roughness={0.2} metalness={0.2} />
        </mesh>
        <mesh position={[0, 1.1, 0.038]}>
          <planeGeometry args={[3.02, 1.86]} />
          <meshBasicMaterial ref={screenMat} map={screens[0]} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

function Phone({ texture, finish }: { texture: THREE.Texture; finish: "titanium" | "graphite" }) {
  const mat = finish === "titanium" ? titanium : graphite;
  return (
    <group>
      <RoundedBox args={[0.8, 1.64, 0.085]} radius={0.11} smoothness={6}>
        <meshStandardMaterial {...mat} />
      </RoundedBox>
      <mesh position={[0, 0, 0.0435]}>
        <planeGeometry args={[0.76, 1.6]} />
        <meshStandardMaterial color="#020305" roughness={0.15} metalness={0.3} />
      </mesh>
      <Screen texture={texture} width={0.71} height={1.53} z={0.045} />
      {/* Módulo de cámara trasero */}
      <RoundedBox args={[0.32, 0.32, 0.03]} radius={0.06} position={[-0.17, 0.56, -0.055]}>
        <meshStandardMaterial {...mat} roughness={0.5} />
      </RoundedBox>
    </group>
  );
}

function Rig({ input }: { input: MutableRefObject<SceneInput> }) {
  const laptopTex = useTexture(LAPTOP_SCREENS, prepareTexture);
  const phoneTex = useTexture(PHONE_SCREENS, prepareTexture);
  const group = useRef<THREE.Group>(null);
  const iphone = useRef<THREE.Group>(null);
  const android = useRef<THREE.Group>(null);
  useFrame((state, dt) => {
    const { camera } = state;
    const { p, mx, my, reduced } = input.current;
    const t = state.clock.elapsedTime;
    const turn = reduced ? 0.6 : smooth(0.05, 0.95, p);
    const phonesIn = reduced ? 1 : smooth(0.26, 0.5, p);

    if (group.current) {
      const ry = lerp(-0.75, 0.35, turn) + mx * 0.18;
      const rx = 0.12 + my * 0.07;
      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, ry, 4, dt);
      group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, rx, 4, dt);
      group.current.position.y = -1.05 + (reduced ? 0 : Math.sin(t * 0.8) * 0.04);
    }

    // Los celulares entran en órbita desde los lados.
    const place = (ref: THREE.Group | null, from: number[], to: number[], rotTo: number, phase: number) => {
      if (!ref) return;
      ref.position.x = THREE.MathUtils.damp(ref.position.x, lerp(from[0], to[0], phonesIn), 5, dt);
      ref.position.y = THREE.MathUtils.damp(ref.position.y, lerp(from[1], to[1], phonesIn) + (reduced ? 0 : Math.sin(t * 1.1 + phase) * 0.06), 5, dt);
      ref.position.z = THREE.MathUtils.damp(ref.position.z, lerp(from[2], to[2], phonesIn), 5, dt);
      ref.rotation.y = THREE.MathUtils.damp(ref.rotation.y, lerp(rotTo + 1.6, rotTo, phonesIn), 5, dt);
      ref.rotation.z = Math.sin(t * 0.7 + phase) * (reduced ? 0 : 0.03);
    };
    // En pantallas verticales los celulares se acomodan al frente de la laptop.
    const aspect = state.size.width / Math.max(1, state.size.height);
    const portrait = aspect < 0.9;
    place(iphone.current, [-5, -2.2, 1.8], portrait ? [-1.05, -0.55, 1.9] : [-2.05, 0.05, 1.35], 0.42, 0);
    place(android.current, [5, -2.2, 1.9], portrait ? [1.1, -0.6, 2.0] : [2.1, -0.05, 1.45], -0.48, 1.7);

    // Acercamiento de cámara, alejándose lo necesario para que todo quepa a lo ancho.
    const halfFov = THREE.MathUtils.degToRad((camera as THREE.PerspectiveCamera).fov / 2);
    const fitWidth = portrait ? 3.9 : 6.6;
    const fitZ = fitWidth / 2 / (Math.tan(halfFov) * aspect);
    const z = Math.max(lerp(9.8, 8.4, reduced ? 1 : smooth(0, 0.45, p)), fitZ);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, z, 3, dt);
    camera.lookAt(0, 0.38, 0);
  });

  return (
    <>
      <group ref={group}>
        <Laptop input={input} screens={laptopTex} />
      </group>
      <group ref={iphone} position={[-5, -2.2, 1.8]} scale={1.08}>
        <Phone texture={phoneTex[0]} finish="titanium" />
      </group>
      <group ref={android} position={[5, -2.2, 1.9]} scale={1.08}>
        <Phone texture={phoneTex[1]} finish="graphite" />
      </group>
      <ContactShadows position={[0, -1.12, 0]} opacity={0.55} scale={12} blur={2.6} far={3} resolution={512} frames={1} color="#000000" />
    </>
  );
}

export default function DeviceScene3D({
  input,
  active,
  lowPower,
}: {
  input: MutableRefObject<SceneInput>;
  active: boolean;
  lowPower: boolean;
}) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={lowPower ? [1, 1.25] : [1, 1.75]}
      gl={{ antialias: !lowPower, powerPreference: "high-performance", alpha: true }}
      camera={{ position: [0, 1.25, 9], fov: 32 }}
      style={{ position: "absolute", inset: 0 }}
      aria-hidden
    >
      <ambientLight intensity={0.45} />
      <directionalLight position={[3, 5, 4]} intensity={2.4} color="#e6eeff" />
      <directionalLight position={[-2, 3, -4]} intensity={1.6} color="#9cc0ff" />
      <pointLight position={[-4, 1.5, 2]} intensity={18} color="#2f7bff" distance={12} />
      <pointLight position={[4, -0.5, 2]} intensity={8} color="#ffb547" distance={10} />
      <Suspense fallback={null}>
        <Rig input={input} />
        {/* Reflejos de estudio sin descargar mapas HDR externos. */}
        <Environment resolution={128} frames={1}>
          <Lightformer form="rect" intensity={3} position={[0, 4, -2]} scale={[8, 2, 1]} />
          <Lightformer form="rect" intensity={2} color="#4d8cff" position={[-5, 1, 1]} rotation-y={Math.PI / 2} scale={[4, 2, 1]} />
          <Lightformer form="rect" intensity={1.2} color="#ffd29a" position={[5, 1, 1]} rotation-y={-Math.PI / 2} scale={[4, 2, 1]} />
        </Environment>
      </Suspense>
    </Canvas>
  );
}
