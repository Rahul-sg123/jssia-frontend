import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations } from '@react-three/drei';

function Avatar() {
  const group = useRef();
  const { scene, animations } = useGLTF('/assets/model.glb');
  const { actions } = useAnimations(animations, group);

  // play the first animation once the model loads
  React.useEffect(() => {
    if (actions && Object.keys(actions).length) {
      actions[Object.keys(actions)[0]].play();
    }
  }, [actions]);

  // ─── swing only ±45° (¼ turn) ───
  const maxAngle = Math.PI / 4;      // 45 degrees
  const speed    = 0.6;              // tweak for faster / slower sway

  useFrame(({ clock }) => {
  const t = clock.getElapsedTime();
  const swaySpeed = 0.5; // speed of sway
  const swayAngle = Math.PI / 6; // ~30 degrees

  group.current.rotation.y = Math.sin(t * swaySpeed) * swayAngle;
});




  return (
    <primitive
      ref={group}
      object={scene}
      position={[0, 0, 0]}
      scale={1.1}
    />
  );
}

export default function MyAvatar() {
  return (
    <div className="w-full h-[500px]">
      <Canvas shadows camera={{ position: [0, 1, 5], fov: 25 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
        <Suspense fallback={null}>
          <Avatar />
        </Suspense>
        {/* Disable user spin so the model keeps its limited sway */}
        <OrbitControls enableZoom={false} enableRotate={false} />
      </Canvas>
    </div>
  );
}
