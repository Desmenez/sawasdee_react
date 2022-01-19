import React, { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  useGLTF,
  OrbitControls,
} from "@react-three/drei";
import { HexColorPicker } from "react-colorful";
import { proxy, useSnapshot } from "valtio";

import "./App.css";

// valtio state ทำการ interact ระหว่าง DOM กับตัว canvas
// wrap state ของโมเดล
// item เก็บค่าสีที่ต้องการเปลี่ยน
const state = proxy({
  current: null,
  items: {
    Body: "#414548",
    Controller_Left: "#00C3E3",
    Controller_Right: "#FF4554",
    Joystick: "#323232",
  },
});

//ตัวโมเดล
function Model() {
  const ref = useRef();
  // useSnapshot ตรวจจับการเปลี่ยนแปลงของ state
  const snap = useSnapshot(state);
  // useGLTF ทำการ hook ให้อัตโนมัติซึ่งต่างจาก useLoader
  const { nodes, materials } = useGLTF("/nintendo.gltf");

  // Animate model
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    ref.current.rotation.z = -0.15 - (1 + Math.sin(time / 1.5)) / 20;
    ref.current.rotation.x = Math.cos(time / 4) / 8;
    ref.current.rotation.y = Math.sin(time / 4) / 8;
    ref.current.position.y = (2 + Math.sin(time / 1.5)) / 10;
  });

  // set scale model
  const { viewport } = useThree();

  // Cursor แสดงสถานะสีปัจจุบัน
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const cursor = `<svg width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0)"><path fill="rgba(255, 255, 255, 0.5)" d="M29.5 54C43.031 54 54 43.031 54 29.5S43.031 5 29.5 5 5 15.969 5 29.5 15.969 54 29.5 54z" stroke="#000"/><g filter="url(#filter0_d)"><path d="M29.5 47C39.165 47 47 39.165 47 29.5S39.165 12 29.5 12 12 19.835 12 29.5 19.835 47 29.5 47z" fill="${snap.items[hovered]}"/></g><path d="M2 2l11 2.947L4.947 13 2 2z" fill="#000"/><text fill="#000" style="white-space:pre" font-family="Inter var, sans-serif" font-size="10" letter-spacing="-.01em"><tspan x="35" y="63">${hovered}</tspan></text></g><defs><clipPath id="clip0"><path fill="#fff" d="M0 0h64v64H0z"/></clipPath><filter id="filter0_d" x="6" y="8" width="47" height="47" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="2"/><feGaussianBlur stdDeviation="3"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/><feBlend in2="BackgroundImageFix" result="effect1_dropShadow"/><feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape"/></filter></defs></svg>`;
    const auto = `<svg width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="rgba(255, 255, 255, 0.5)" d="M29.5 54C43.031 54 54 43.031 54 29.5S43.031 5 29.5 5 5 15.969 5 29.5 15.969 54 29.5 54z" stroke="#000"/><path d="M2 2l11 2.947L4.947 13 2 2z" fill="#000"/></svg>`;
    if (hovered) {
      document.body.style.cursor = `url('data:image/svg+xml;base64,${btoa(
        cursor
      )}'), auto`;
      return () =>
        (document.body.style.cursor = `url('data:image/svg+xml;base64,${btoa(
          auto
        )}'), auto`);
    }
  }, [hovered]);

  // GLTFJSX เชื่อม app-state และ hook up events
  return (
    <group
      ref={ref}
      dispose={null}
      onPointerOver={(e) => (
        e.stopPropagation(), setHovered(e.object.material.name)
      )}
      onPointerOut={(e) => e.intersections.length === 0 && setHovered(null)}
      onPointerMissed={() => (state.current = null)}
      onClick={(e) => (
        e.stopPropagation(), (state.current = e.object.material.name)
      )}
    >
      {/* viewport.width < 6 ? 1 : 2 */}
      <group
        rotation={[-Math.PI, 0, 0]}
        scale={viewport.width < 6 ? viewport.width / 3.8 : 2}
      >
        <mesh
          geometry={nodes.Nbackbody.geometry}
          material={materials.Backbody}
          position={[-1.03, 0.94, 0.54]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={1.3}
        />
        <mesh
          geometry={nodes.Nbody.geometry}
          material={materials.Body}
          material-color={snap.items.Body}
          position={[-1.03, 0.94, 0.54]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={1.3}
        />
        <mesh
          geometry={nodes.Nbolt.geometry}
          material={materials.Bolt}
          position={[-1.03, 0.94, 0.54]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={1.3}
        />
        <mesh
          geometry={nodes.Nborder.geometry}
          material={materials.Border}
          position={[-1.03, 0.94, 0.54]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={1.3}
        />
        <mesh
          geometry={nodes.Ndisplay.geometry}
          material={materials.Display}
          position={[-1.03, 0.94, 0.54]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={1.3}
        />
        <mesh
          geometry={nodes.Nhand_left.geometry}
          material={materials.Controller_Left}
          material-color={snap.items.Controller_Left}
          position={[-1.03, 0.94, 0.54]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={1.3}
        />
        <mesh
          geometry={nodes.Nhand_right.geometry}
          material={materials.Controller_Right}
          material-color={snap.items.Controller_Right}
          position={[-1.03, 0.94, 0.54]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={1.3}
        />
        <mesh
          geometry={nodes.Njoy.geometry}
          material={materials.Joystick}
          material-color={snap.items.Joystick}
          position={[-1.03, 0.94, 0.54]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={1.3}
        />
        <mesh
          geometry={nodes.Nport.geometry}
          material={materials.Port}
          position={[-1.03, 0.94, 0.54]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={1.3}
        />
        <mesh
          geometry={nodes.Ntiny.geometry}
          material={materials.Tiny}
          position={[-1.03, 0.94, 0.54]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={1.3}
        />
      </group>
    </group>
  );
}

// color picker
function Picker() {
  const snap = useSnapshot(state);
  // เมื่อทำการคลิกจะแสดง color picker
  return (
    <div style={{ display: snap.current ? "block" : "none" }}>
      <HexColorPicker
        className="picker"
        color={snap.items[snap.current]}
        onChange={(color) => (state.items[snap.current] = color)}
      />
      <h2>{snap.current}</h2>
    </div>
  );
}

export default function App() {
  return (
    <>
      <h1>
        สวัสดี
        <br />
        <span>REACT</span>
      </h1>
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 8], fov: 50 }}>
        <ambientLight intensity={0.7} />
        <spotLight
          intensity={0.5}
          angle={0.1}
          penumbra={1}
          position={[10, 15, 10]}
          // castShadow
        />
        <Suspense fallback={null}>
          <Environment preset="city" />

          <OrbitControls
            minPolarAngle={Math.PI / 2}
            maxPolarAngle={Math.PI / 2}
            enableZoom={false}
            enablePan={false}
          />

          <Model />
        </Suspense>
      </Canvas>
      <a
        href="https://napatpon-resume.netlify.app/"
        className="link"
        target="_blank"
        rel="noreferrer"
      >
        napatpon-resume
      </a>
      <Picker />
    </>
  );
}
