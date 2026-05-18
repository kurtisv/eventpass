"use client";

import { Line, RoundedBox, Text } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Group, Mesh, MeshBasicMaterial, PlaneGeometry } from "three";

const SEAT_RATIO = 86 / 120;
const QR_PATTERN = [
  "111001111",
  "100101001",
  "101101011",
  "001010100",
  "111011101",
  "100100101",
  "101111011",
  "100010001",
  "111101111",
] as const;

type Vector3Tuple = [number, number, number];

function StatusBand({ ready }: { ready: boolean }) {
  return (
    <group position={[-0.75, -0.9, 0.12]}>
      <RoundedBox args={[1.9, 0.48, 0.08]} radius={0.12} smoothness={5}>
        <meshStandardMaterial color={ready ? "#1f8a70" : "#2c9b82"} roughness={0.36} metalness={0.08} emissive={ready ? "#134e44" : "#0b3b35"} emissiveIntensity={ready ? 0.22 : 0.12} />
      </RoundedBox>
      <Text position={[-0.42, 0.04, 0.05]} fontSize={0.1} color="#d6fff5" anchorX="left">
        Status
      </Text>
      <Text position={[-0.42, -0.09, 0.05]} fontSize={0.14} color="#ffffff" anchorX="left">
        {ready ? "Ready for check-in" : "Confirmed"}
      </Text>
    </group>
  );
}

function QrCode({ ready }: { ready: boolean }) {
  const scanRef = useRef<Mesh<PlaneGeometry, MeshBasicMaterial>>(null);

  useFrame(({ clock }) => {
    if (!scanRef.current) {
      return;
    }

    scanRef.current.position.y = 0.52 - ((clock.elapsedTime * 0.28) % 1.04);
    scanRef.current.material.opacity = ready ? 0.28 : 0.18;
  });

  return (
    <group position={[1.42, 0.08, 0.12]}>
      <RoundedBox args={[1.34, 1.62, 0.08]} radius={0.16} smoothness={5}>
        <meshStandardMaterial color="#f7f1ff" roughness={0.3} metalness={0.04} />
      </RoundedBox>

      <group position={[0, -0.02, 0.05]}>
        <RoundedBox args={[1.02, 1.02, 0.04]} radius={0.12} smoothness={4}>
          <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.02} />
        </RoundedBox>

        {QR_PATTERN.flatMap((row, rowIndex) =>
          row.split("").map((cell, columnIndex) =>
            cell === "1" ? (
              <mesh
                key={`${rowIndex}-${columnIndex}`}
                position={[-0.36 + columnIndex * 0.09, 0.36 - rowIndex * 0.09, 0.04]}
              >
                <boxGeometry args={[0.062, 0.062, 0.02]} />
                <meshStandardMaterial color="#22163f" roughness={0.4} metalness={0.05} />
              </mesh>
            ) : null,
          ),
        )}

        <mesh ref={scanRef} position={[0, 0.4, 0.06]}>
          <planeGeometry args={[1.02, 0.12]} />
          <meshBasicMaterial color="#a78bfa" transparent opacity={0.22} />
        </mesh>
      </group>

      <Text position={[0, -0.72, 0.06]} fontSize={0.1} color="#6c5a99" anchorX="center">
        QR
      </Text>
    </group>
  );
}

function CapacityRing({ active }: { active: boolean }) {
  const basePoints = useMemo<Vector3Tuple[]>(() => {
    return Array.from({ length: 64 }, (_, index) => {
      const angle = (Math.PI * 1.75 * index) / 63 + Math.PI * 0.65;
      return [Math.cos(angle) * 0.56, Math.sin(angle) * 0.56, 0];
    });
  }, []);

  const progressPoints = useMemo<Vector3Tuple[]>(() => {
    const count = Math.max(2, Math.floor(64 * SEAT_RATIO));
    return Array.from({ length: count }, (_, index) => {
      const angle = (Math.PI * 1.75 * index) / (count - 1) + Math.PI * 0.65;
      return [Math.cos(angle) * 0.56, Math.sin(angle) * 0.56, 0.01];
    });
  }, []);

  return (
    <group position={[2.45, 1.02, 0.18]}>
      <Line points={basePoints} color="#4c3d75" lineWidth={1.2} transparent opacity={0.65} />
      <Line points={progressPoints} color="#cab7ff" lineWidth={2.2} transparent opacity={active ? 1 : 0.88} />
      <Text position={[0, 0.02, 0.04]} fontSize={0.14} color="#ffffff" anchorX="center" anchorY="middle">
        86 / 120
      </Text>
      <Text position={[0, -0.22, 0.04]} fontSize={0.075} color="#cab7ff" anchorX="center">
        seats
      </Text>
    </group>
  );
}

function FloatingTag({
  position,
  rotation,
  label,
  value,
  color,
  active,
  phase,
}: {
  position: Vector3Tuple;
  rotation: Vector3Tuple;
  label: string;
  value: string;
  color: string;
  active: boolean;
  phase: number;
}) {
  const ref = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) {
      return;
    }

    ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * 0.7 + phase) * (active ? 0.01 : 0.04);
  });

  return (
    <group ref={ref} position={position} rotation={rotation}>
      <RoundedBox args={[1.3, 0.56, 0.12]} radius={0.14} smoothness={5}>
        <meshStandardMaterial color="#1a1430" roughness={0.3} metalness={0.12} emissive={color} emissiveIntensity={0.08} />
      </RoundedBox>
      <Text position={[0, 0.08, 0.07]} fontSize={0.08} color="#b7a8dc" anchorX="center">
        {label}
      </Text>
      <Text position={[0, -0.09, 0.07]} fontSize={0.1} color="#ffffff" anchorX="center">
        {value}
      </Text>
    </group>
  );
}

function EventCard({ active, ready }: { active: boolean; ready: boolean }) {
  return (
    <group>
      <RoundedBox args={[4.32, 2.72, 0.18]} radius={0.2} smoothness={6} castShadow receiveShadow>
        <meshPhysicalMaterial color="#f4eefc" roughness={0.42} metalness={0.06} clearcoat={0.8} clearcoatRoughness={0.58} reflectivity={0.2} />
      </RoundedBox>

      <RoundedBox args={[4.05, 2.44, 0.04]} radius={0.18} smoothness={5} position={[0, 0, 0.1]}>
        <meshPhysicalMaterial color="#fbf8ff" roughness={0.22} metalness={0.02} transparent opacity={0.92} transmission={0.04} thickness={0.18} />
      </RoundedBox>

      <mesh position={[0, 0.98, 0.11]}>
        <planeGeometry args={[3.8, 0.38]} />
        <meshBasicMaterial color="#cdbdff" transparent opacity={0.12} />
      </mesh>

      <group position={[-1.52, 0.56, 0.13]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.28, 0.28, 0.12, 42]} />
          <meshStandardMaterial color="#332257" roughness={0.3} metalness={0.16} />
        </mesh>
        <Text position={[0, 0.01, 0.08]} fontSize={0.16} color="#ffffff" anchorX="center" anchorY="middle">
          MC
        </Text>
      </group>

      <Text position={[-1.12, 0.92, 0.14]} fontSize={0.09} color="#6f5ba2" anchorX="left">
        Client event pass
      </Text>
      <Text position={[-1.12, 0.66, 0.14]} fontSize={0.22} color="#231641" anchorX="left">
        Mara Chen
      </Text>
      <Text position={[-1.12, 0.46, 0.14]} fontSize={0.12} color="#5c5375" anchorX="left">
        Northline Studio
      </Text>

      <Text position={[-1.62, 0.08, 0.14]} fontSize={0.09} color="#8a7ab2" anchorX="left">
        Event
      </Text>
      <Text position={[-1.62, -0.12, 0.14]} fontSize={0.18} color="#231641" anchorX="left" maxWidth={2.4}>
        KV Client Launch Summit
      </Text>

      <Text position={[-1.62, -0.52, 0.14]} fontSize={0.085} color="#8a7ab2" anchorX="left">
        Venue
      </Text>
      <Text position={[-1.62, -0.68, 0.14]} fontSize={0.11} color="#4e4569" anchorX="left">
        Port Hall Montreal
      </Text>

      <Text position={[-0.28, -0.52, 0.14]} fontSize={0.085} color="#8a7ab2" anchorX="left">
        Date
      </Text>
      <Text position={[-0.28, -0.68, 0.14]} fontSize={0.11} color="#4e4569" anchorX="left">
        June 12, 2026
      </Text>

      <Text position={[-1.6, -1.18, 0.14]} fontSize={0.08} color="#8a7ab2" anchorX="left">
        Source
      </Text>
      <Text position={[-1.6, -1.32, 0.14]} fontSize={0.1} color="#4e4569" anchorX="left">
        ClientHub
      </Text>

      <Text position={[-0.72, -1.18, 0.14]} fontSize={0.08} color="#8a7ab2" anchorX="left">
        Ticket token
      </Text>
      <Text position={[-0.72, -1.32, 0.14]} fontSize={0.1} color="#4e4569" anchorX="left">
        EVP-2026-0612
      </Text>

      <StatusBand ready={ready} />
      <QrCode ready={ready} />

      <mesh position={[1.36, 0.8, 0.11]}>
        <planeGeometry args={[1.48, 0.32]} />
        <meshBasicMaterial color={ready ? "#ede9fe" : "#e9e3ff"} transparent opacity={0.8} />
      </mesh>
      <Text position={[1.36, 0.8, 0.14]} fontSize={0.09} color="#5e4d8c" anchorX="center">
        {ready ? "Ready for check-in" : "Confirmed"}
      </Text>

      <mesh position={[0.1, -1.54, -0.01]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[3.2, 1.1]} />
        <shadowMaterial transparent opacity={active ? 0.24 : 0.18} />
      </mesh>
    </group>
  );
}

function ClientEventCardScene() {
  const rootRef = useRef<Group>(null);
  const [active, setActive] = useState(false);
  const [readyPulse, setReadyPulse] = useState(false);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setReadyPulse((current) => !current);
    }, 4200);

    return () => window.clearInterval(interval);
  }, []);

  useFrame(({ clock, pointer }) => {
    if (!rootRef.current) {
      return;
    }

    rootRef.current.position.y = Math.sin(clock.elapsedTime * 0.58) * 0.08;
    rootRef.current.position.z = active ? 0.18 : 0;
    rootRef.current.rotation.x = 0.16 + pointer.y * 0.06 + Math.sin(clock.elapsedTime * 0.24) * 0.01;
    rootRef.current.rotation.y = -0.42 + pointer.x * 0.09 + (active ? 0.1 : 0);
    rootRef.current.rotation.z = -0.02 + Math.sin(clock.elapsedTime * 0.18) * 0.01;
  });

  const ready = active || readyPulse;

  return (
    <group>
      <mesh position={[0, 0.2, -1.25]}>
        <planeGeometry args={[8, 5.2]} />
        <meshBasicMaterial color="#5b3f9e" transparent opacity={0.08} />
      </mesh>

      <mesh position={[0.1, -1.9, -0.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[6.5, 4.3]} />
        <shadowMaterial transparent opacity={0.16} />
      </mesh>

      <group ref={rootRef}>
        <group
          onPointerOver={(event) => {
            event.stopPropagation();
            setActive(true);
          }}
          onPointerOut={() => setActive(false)}
        >
          <EventCard active={active} ready={ready} />
        </group>

        <CapacityRing active={active} />
        <FloatingTag position={[-2.55, 1.04, 0.12]} rotation={[0, 0.26, -0.08]} label="Ticket" value="Token" color="#7c3aed" active={active} phase={0.2} />
        <FloatingTag position={[-2.46, -0.86, 0.1]} rotation={[0, 0.36, 0.1]} label="Check-in" value={ready ? "Ready" : "Confirmed"} color="#22c55e" active={active} phase={1.2} />
        <FloatingTag position={[2.46, -0.92, 0.12]} rotation={[0, -0.3, -0.08]} label="Capacity" value="86 / 120" color="#a78bfa" active={active} phase={2.2} />
      </group>
    </group>
  );
}

export default function EventPassSceneCanvas() {
  return (
    <Canvas
      className="h-full w-full"
      style={{ width: "100%", height: "100%" }}
      shadows
      dpr={[1, 1.4]}
      camera={{ position: [0, 0.1, 7], fov: 34 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#161326"]} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[-3.4, 4.6, 5.2]} intensity={2.2} color="#ffffff" castShadow />
      <directionalLight position={[3.6, -1.8, 3.2]} intensity={1.1} color="#ffe7d1" />
      <pointLight position={[1.8, 1.6, 2.8]} intensity={1.2} color="#8b5cf6" />
      <pointLight position={[-2.5, -0.6, 2.2]} intensity={0.75} color="#d9cbff" />
      <ClientEventCardScene />
    </Canvas>
  );
}
