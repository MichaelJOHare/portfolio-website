"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const Cube = () => {
  const cubeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cube: THREE.Mesh | undefined;
    let renderer: THREE.WebGLRenderer | undefined;
    let camera: THREE.PerspectiveCamera | undefined;
    if (cubeRef.current) {
      camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );

      const animate = () => {
        if (cube && camera && renderer) {
          cube.rotation.x += 0.01;
          cube.rotation.y += 0.01;
          renderer.render(scene, camera);
        }
      };

      renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth * 0.75, window.innerHeight * 0.75);
      renderer.setAnimationLoop(animate);

      cube = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshBasicMaterial({ color: 0x00ff00 })
      );

      const scene = new THREE.Scene();
      scene.add(cube);

      camera.position.z = 5;

      cubeRef.current.appendChild(renderer.domElement);

      return () => {
        if (renderer) {
          renderer.setAnimationLoop(null);
          renderer.domElement.remove();
          renderer.dispose();
        }
      };
    }
  }, []);

  return (
    <div
      className="flex justify-center"
      ref={cubeRef}
      style={{ width: "100%", height: "70vmin" }}
    />
  );
};

export default Cube;
