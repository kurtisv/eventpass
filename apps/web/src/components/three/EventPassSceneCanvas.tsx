"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Line, Text } from "@react-three/drei";
import { useRef, useState } from "react";
import type { Group, Mesh } from "three";

function Ticket({ active }: { active: boolean }) {
  const ref = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.x = -1.25 + (active ? 0.72 : 0);
    ref.current.position.y = 0.22 + Math.sin(clock.elapsedTime * 0.9) * 0.06;
    ref.current.rotation.z = -0.12 + Math.sin(clock.elapsedTime * 0.5) * 0.02;
  });

  return (
    <group ref={ref} position={[-1.25, 0.22, 0.35]} rotation={[0.04, 0.22, -0.12]}>
      <mesh castShadow>
        <boxGeometry args={[1.34, 1.9, 0.055]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.32} />
      </mesh>
      <mesh position={[0, 0.34, 0.04]}>
        <boxGeometry args={[0.62, 0.62, 0.02]} />
        <meshStandardMaterial color="#17132a" roughness={0.4} />
      </mesh>
      <Text position={[0, -0.56, 0.055]} fontSize={0.11} color="#3c2f69" anchorX="center">
        ALL ACCESS
      </Text>
    </group>
  );
}

function Scanner({ active }: { active: boolean }) {
  const beamRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (!beamRef.current) return;
    beamRef.current.scale.y = active ? 1 + Math.sin(clock.elapsedTime * 5) * 0.12 : 0.2;
  });

  return (
    <group position={[0.78, 0.0, 0.42]} rotation={[0, -0.36, 0]}>
      <mesh castShadow>
        <boxGeometry args={[0.72, 1.5, 0.24]} />
        <meshStandardMaterial color="#221a44" roughness={0.24} metalness={0.18} />
      </mesh>
      <mesh position={[0, 0.18, 0.14]}>
        <boxGeometry args={[0.48, 0.48, 0.02]} />
        <meshStandardMaterial color="#111827" emissive="#7c3aed" emissiveIntensity={0.28} />
      </mesh>
      <mesh ref={beamRef} position={[-0.52, 0.12, 0.18]} rotation={[0, 0, -0.1]}>
        <boxGeometry args={[0.06, 1.18, 0.018]} />
        <meshBasicMaterial color="#ffe1a8" transparent opacity={active ? 0.58 : 0.12} />
      </mesh>
    </group>
  );
}

function CapacityGauge() {
  const points = Array.from({ length: 42 }, (_, index) => {
    const angle = (Math.PI * 1.55 * index) / 41 + Math.PI * 0.72;
    return [Math.cos(angle) * 0.62, Math.sin(angle) * 0.62, 0] as [number, number, number];
  });

  return (
    <group position={[2.08, 0.86, 0.32]}>
      <Line points={points} color="#c4b5fd" lineWidth={3} />
      <Text position={[0, 0, 0.03]} fontSize={0.17} color="#f8fafc" anchorX="center" anchorY="middle">
        78%
      </Text>
      <Text position={[0, -0.34, 0.03]} fontSize={0.075} color="#c4b5fd" anchorX="center">
        capacity
      </Text>
    </group>
  );
}

function Badge({ position, label, color }: { position: [number, number, number]; label: string; color: string }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.26, 0.26, 0.06, 32]} />
        <meshStandardMaterial color={color} roughness={0.28} metalness={0.1} />
      </mesh>
      <Text position={[0, -0.42, 0]} fontSize={0.08} color="#e9d5ff" anchorX="center">
        {label}
      </Text>
    </group>
  );
}

function EventAccessGate() {
  const groupRef = useRef<Group>(null);
  const [active, setActive] = useState(false);

  useFrame(({ clock, pointer }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = pointer.x * 0.14 + Math.sin(clock.elapsedTime * 0.22) * 0.05;
    groupRef.current.rotation.x = -0.16 + pointer.y * 0.04;
  });

  return (
    <group ref={groupRef} rotation={[-0.16, -0.18, 0]}>
      <mesh position={[0, -1.55, -0.2]} receiveShadow>
        <boxGeometry args={[5.2, 0.16, 2.35]} />
        <meshStandardMaterial color="#17132a" roughness={0.34} />
      </mesh>
      <mesh position={[0, 0.28, -0.92]} receiveShadow>
        <boxGeometry args={[4.6, 2.48, 0.14]} />
        <meshStandardMaterial color="#2a2150" roughness={0.28} />
      </mesh>
      <group
        onPointerOver={(event) => {
          event.stopPropagation();
          setActive(true);
        }}
        onPointerOut={() => setActive(false)}
      >
        <Ticket active={active} />
      </group>
      <Scanner active={active} />
      <CapacityGauge />
      <Badge position={[-2.05, -1.0, 0.42]} label="Confirmed" color="#ffe1a8" />
      <Badge position={[-0.42, -1.05, 0.42]} label="Scanned" color="#ff7a45" />
      <Badge position={[1.22, -1.05, 0.42]} label="Checked-in" color="#c4b5fd" />
      <Line points={[[0.42, 1.45, 0.15], [0.42, -1.22, 0.15]]} color="#ffe1a8" lineWidth={1.4} transparent opacity={active ? 0.75 : 0.24} />
      <Text position={[0, 1.46, 0.2]} fontSize={0.16} color="#f8fafc" anchorX="center">
        Event Access Gate
      </Text>
    </group>
  );
}

export default function EventPassSceneCanvas() {
  return (
    <Canvas className="min-h-[440px]" style={{ width: "100%", height: "440px" }} shadows dpr={[1, 1.5]} camera={{ position: [0, 0.2, 6.2], fov: 42 }} gl={{ antialias: true, powerPreference: "high-performance" }}>
      <color attach="background" args={["#17132a"]} />
      <ambientLight intensity={0.72} />
      <directionalLight position={[2.2, 4, 4.5]} intensity={1.7} castShadow />
      <pointLight position={[-2.4, 1.8, 2.6]} intensity={1.8} color="#7c3aed" />
      <pointLight position={[2.5, 1.2, 2.2]} intensity={1.3} color="#ffe1a8" />
      <EventAccessGate />
    </Canvas>
  );
}
