'use client';

import { BlurFade } from '@/src/components/magicui/blur-fade';
import { useState, useEffect, Fragment } from 'react';
import ProjectForm from './ProjectForm';

import { Canvas, extend, useFrame, useThree } from '@react-three/fiber';
import { useAspect, useTexture } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three/webgpu';
import { bloom } from 'three/examples/jsm/tsl/display/BloomNode.js';

import {
  abs,
  blendScreen,
  float,
  mod,
  mx_cell_noise_float,
  oneMinus,
  smoothstep,
  texture,
  uniform,
  uv,
  vec2,
  vec3,
  pass,
  mix,
  add
} from 'three/tsl';
import { FlickeringGrid } from '../ui/flickering-grid';

const TEXTUREMAP = { src: 'https://i.postimg.cc/XYwvXN8D/img-4.png' };
const DEPTHMAP = { src: 'https://i.postimg.cc/2SHKQh2q/raw-4.webp' };

extend(THREE as any);

// Post Processing component
const PostProcessing = ({
  strength = 1,
  threshold = 1,
  fullScreenEffect = true,
}: {
  strength?: number;
  threshold?: number;
  fullScreenEffect?: boolean;
}) => {
  const { gl, scene, camera } = useThree();
  const progressRef = useRef({ value: 0 });

  const render = useMemo(() => {
    const postProcessing = new THREE.PostProcessing(gl as any);
    const scenePass = pass(scene, camera);
    const scenePassColor = scenePass.getTextureNode('output');
    const bloomPass = bloom(scenePassColor, strength, 0.5, threshold);

    // Create the scanning effect uniform
    const uScanProgress = uniform(0);
    progressRef.current = uScanProgress;

    // Create a red overlay that follows the scan line
    const scanPos = float(uScanProgress.value);
    const uvY = uv().y;
    const scanWidth = float(0.05);
    const scanLine = smoothstep(0, scanWidth, abs(uvY.sub(scanPos)));
    const redOverlay = vec3(1, 0, 0).mul(oneMinus(scanLine)).mul(0.4);

    // Mix the original scene with the red overlay
    const withScanEffect = mix(
      scenePassColor,
      add(scenePassColor, redOverlay),
      fullScreenEffect ? smoothstep(0.9, 1.0, oneMinus(scanLine)) : 1.0
    );

    // Add bloom effect after scan effect
    const final = withScanEffect.add(bloomPass);

    postProcessing.outputNode = final;

    return postProcessing;
  }, [camera, gl, scene, strength, threshold, fullScreenEffect]);

  useFrame(({ clock }) => {
    // Animate the scan line from top to bottom
    progressRef.current.value = (Math.sin(clock.getElapsedTime() * 0.5) * 0.5 + 0.5);
    render.renderAsync();
  }, 1);

  return null;
};

const WIDTH = 350;
const HEIGHT = 350;

const Scene = () => {
  const [rawMap, depthMap] = useTexture([TEXTUREMAP.src, DEPTHMAP.src]);

  const { material, uniforms } = useMemo(() => {
    const uPointer = uniform(new THREE.Vector2(0));
    const uProgress = uniform(0);

    const strength = 0.01;

    const tDepthMap = texture(depthMap);

    const tMap = texture(
      rawMap,
      uv().add(tDepthMap.r.mul(uPointer).mul(strength))
    );

    const aspect = float(WIDTH).div(HEIGHT);
    const tUv = vec2(uv().x.mul(aspect), uv().y);

    const tiling = vec2(120.0);
    const tiledUv = mod(tUv.mul(tiling), 2.0).sub(1.0);

    const brightness = mx_cell_noise_float(tUv.mul(tiling).div(2));

    const dist = float(tiledUv.length());
    const dot = float(smoothstep(0.5, 0.49, dist)).mul(brightness);

    const depth = tDepthMap;

    const flow = oneMinus(smoothstep(0, 0.02, abs(depth.sub(uProgress))));

    const mask = dot.mul(flow).mul(vec3(10, 0, 0));

    const final = blendScreen(tMap, mask);

    const material = new THREE.MeshBasicNodeMaterial({
      colorNode: final,
    });

    return {
      material,
      uniforms: {
        uPointer,
        uProgress,
      },
    };
  }, [rawMap, depthMap]);

  const [w, h] = useAspect(WIDTH, HEIGHT);

  useFrame(({ clock }) => {
    uniforms.uProgress.value = (Math.sin(clock.getElapsedTime() * 0.5) * 0.5 + 0.5);
  });

  useFrame(({ pointer }) => {
    uniforms.uPointer.value = pointer;
  });

  const scaleFactor = 0.45;
  return (
    <mesh scale={[w * scaleFactor, h * scaleFactor, 1]} material={material}>
      <planeGeometry />
    </mesh>
  );
};

export const HeroSection = () => {
  const titleWords = `Build Your Blooms`.split(' ');
  const subtitle = 'AI-powered creativity for the next generation.';
  const [visibleWords, setVisibleWords] = useState(0);
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const [delays, setDelays] = useState<number[]>([]);
  const [subtitleDelay, setSubtitleDelay] = useState(0);

  useEffect(() => {
    setDelays(titleWords.map(() => Math.random() * 0.07));
    setSubtitleDelay(Math.random() * 0.1);
  }, [titleWords.length]);

  useEffect(() => {
    if (visibleWords < titleWords.length) {
      const timeout = setTimeout(() => setVisibleWords(visibleWords + 1), 200);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => setSubtitleVisible(true), 400);
      return () => clearTimeout(timeout);
    }
  }, [visibleWords, titleWords.length]);

  return (
    <>
      <div className="h-svh">
        <div className="h-svh uppercase items-center w-full absolute z-60 pointer-events-none px-10 flex justify-center flex-col">
          <div className="text-3xl md:text-5xl xl:text-6xl 2xl:text-7xl font-extrabold relative">
            <div className="flex items-center space-x-2 lg:space-x-6 overflow-hidden text-white">
              {titleWords.map((word, index) => (
                <Fragment key={index}>
                  <BlurFade delay={index * 0.43 + (delays[index] || 0)} inView>
                    <div
                      className={`${index < visibleWords ? 'fade-in' : ''}`}
                      style={{
                        animationDelay: `${index * 0.13 + (delays[index] || 0)}s`,
                        opacity: index < visibleWords ? undefined : 0,
                      }}
                    >
                      {word}
                    </div>
                  </BlurFade>
                  {index === 1 && (
                    <BlurFade delay={(index + 0.5) * 0.43 + (delays[index] || 0)} inView>
                      <img
                        src="/media/bloom.svg"
                        alt="bloom logo"
                        className={`w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 xl:w-16 xl:h-16 2xl:w-20 2xl:h-20 object-contain inline-block ${index < visibleWords ? 'fade-in' : ''}`}
                        style={{
                          animationDelay: `${(index + 0.5) * 0.13 + (delays[index] || 0)}s`,
                          opacity: index < visibleWords ? undefined : 0,
                        }}
                      />
                    </BlurFade>
                  )}
                </Fragment>
              ))}

            </div>
          </div>
          <div className='pointer-events-auto'>
            <ProjectForm />
          </div>
          <div className="text-xs md:text-xl xl:text-2xl 2xl:text-3xl mt-2 overflow-hidden text-white font-bold">
            <BlurFade delay={titleWords.length * 0.45} inView>
              <div
                className={subtitleVisible ? 'fade-in-subtitle' : ''}
                style={{ animationDelay: `${titleWords.length * 0.13 + 0.2 + subtitleDelay}s`, opacity: subtitleVisible ? undefined : 0 }}
              >
                {subtitle}
              </div>
            </BlurFade>
          </div>
        </div>

        <Canvas
          className='relative z-10'
          flat
          gl={async (props: any) => {
            const renderer = new THREE.WebGPURenderer({
              ...props,
              alpha: true,
              antialias: true
            } as any);
            await renderer.init();
            renderer.setClearColor(0x000000, 0); // Set clear color to transparent
            return renderer;
          }}
        >
          <PostProcessing fullScreenEffect={true} />
          <Scene />
        </Canvas>


        <FlickeringGrid
          className="z-10 absolute inset-0 size-full mix-blend-screen"
          squareSize={4}
          gridGap={6}
          color="#6B7280"
          maxOpacity={0.1}
          flickerChance={0.1}
        />
      </div>
    </>
  );
};




export default HeroSection;
