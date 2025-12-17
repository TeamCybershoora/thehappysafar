"use client";

import { gsap } from "gsap";
import React, { useEffect, useMemo, useRef } from "react";
import CurvedLoop from "./CurvedLoop";

const DEFAULT_PEEP_FRAMES = Array.from({ length: 50 }, (_, idx) => [`/images/peeps/${idx + 1}.svg`]).flat();

interface CrowdCanvasProps {
  /**
   * Optional sprite sheet source. When provided, rows/cols determine slicing.
   * If omitted, individual frame images from `frames` will be used instead.
   */
  src?: string;
  rows?: number;
  cols?: number;
  frames?: string[];
}

const CrowdCanvas = ({ src, rows = 15, cols = 7, frames = DEFAULT_PEEP_FRAMES }: CrowdCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameSources = useMemo(() => (frames.length ? frames : DEFAULT_PEEP_FRAMES), [frames]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const config = {
      src,
      rows,
      cols,
      frames: frameSources,
    };

    // UTILS
    const randomRange = (min: number, max: number) =>
      min + Math.random() * (max - min);
    const randomIndex = (array: any[]) => randomRange(0, array.length) | 0;
    const removeFromArray = (array: any[], i: number) => array.splice(i, 1)[0];
    const removeItemFromArray = (array: any[], item: any) =>
      removeFromArray(array, array.indexOf(item));
    const removeRandomFromArray = (array: any[]) =>
      removeFromArray(array, randomIndex(array));
    const getRandomFromArray = (array: any[]) => array[randomIndex(array) | 0];

    // TWEEN FACTORIES
    const resetPeep = ({ stage, peep }: { stage: any; peep: any }) => {
      const direction = Math.random() > 0.5 ? 1 : -1;
      const offsetY = 100 - 250 * gsap.parseEase("power2.in")(Math.random());
      const startY = stage.height - peep.height + offsetY;
      let startX: number;
      let endX: number;

      if (direction === 1) {
        startX = -peep.width;
        endX = stage.width;
        peep.scaleX = 1;
      } else {
        startX = stage.width + peep.width;
        endX = 0;
        peep.scaleX = -1;
      }

      peep.x = startX;
      peep.y = startY;
      peep.anchorY = startY;

      return {
        startX,
        startY,
        endX,
      };
    };

    const normalWalk = ({ peep, props }: { peep: any; props: any }) => {
      const { startX, startY, endX } = props;
      const xDuration = 10;
      const yDuration = 0.25;

      const tl = gsap.timeline();
      tl.timeScale(randomRange(0.5, 1.5));
      tl.to(
        peep,
        {
          duration: xDuration,
          x: endX,
          ease: "none",
        },
        0,
      );
      tl.to(
        peep,
        {
          duration: yDuration,
          repeat: xDuration / yDuration,
          yoyo: true,
          y: startY - 10,
        },
        0,
      );

      return tl;
    };

    const walks = [normalWalk];

    // TYPES
    type Peep = {
      image: HTMLImageElement;
      rect: number[];
      width: number;
      height: number;
      drawArgs: any[];
      x: number;
      y: number;
      anchorY: number;
      scaleX: number;
      walk: any;
      setRect: (rect: number[]) => void;
      render: (ctx: CanvasRenderingContext2D) => void;
    };

    // FACTORY FUNCTIONS
    const createPeep = ({
      image,
      rect,
    }: {
      image: HTMLImageElement;
      rect: number[];
    }): Peep => {
      const peep: Peep = {
        image,
        rect: [],
        width: 0,
        height: 0,
        drawArgs: [],
        x: 0,
        y: 0,
        anchorY: 0,
        scaleX: 1,
        walk: null,
        setRect: (rect: number[]) => {
          peep.rect = rect;
          peep.width = rect[2];
          peep.height = rect[3];
          peep.drawArgs = [peep.image, ...rect, 0, 0, peep.width, peep.height];
        },
        render: (ctx: CanvasRenderingContext2D) => {
          ctx.save();
          ctx.translate(peep.x, peep.y);
          ctx.scale(peep.scaleX, 1);
          ctx.drawImage(
            peep.image,
            peep.rect[0],
            peep.rect[1],
            peep.rect[2],
            peep.rect[3],
            0,
            0,
            peep.width,
            peep.height,
          );
          ctx.restore();
        },
      };

      peep.setRect(rect);
      return peep;
    };

    // MAIN
    const img = document.createElement("img");
    const stage = {
      width: 0,
      height: 0,
    };

    const allPeeps: Peep[] = [];
    const availablePeeps: Peep[] = [];
    const crowd: Peep[] = [];

    const createSpriteSheetPeeps = (sprite: HTMLImageElement) => {
      const { rows, cols } = config;
      const { naturalWidth: width, naturalHeight: height } = sprite;
      const total = rows * cols;
      const rectWidth = width / rows;
      const rectHeight = height / cols;

      for (let i = 0; i < total; i++) {
        allPeeps.push(
          createPeep({
            image: sprite,
            rect: [
              (i % rows) * rectWidth,
              ((i / rows) | 0) * rectHeight,
              rectWidth,
              rectHeight,
            ],
          }),
        );
      }
    };

    const createFramePeeps = (images: HTMLImageElement[]) => {
      images.forEach((image) => {
        const inferredWidth = image.naturalWidth || image.width || 512;
        const inferredHeight = image.naturalHeight || image.height || 512;

        allPeeps.push(
          createPeep({
            image,
            rect: [0, 0, inferredWidth, inferredHeight],
          }),
        );
      });
    };

    const initCrowd = () => {
      while (availablePeeps.length) {
        addPeepToCrowd().walk.progress(Math.random());
      }
    };

    const addPeepToCrowd = () => {
      const peep = removeRandomFromArray(availablePeeps);
      const walk = getRandomFromArray(walks)({
        peep,
        props: resetPeep({
          peep,
          stage,
        }),
      }).eventCallback("onComplete", () => {
        removePeepFromCrowd(peep);
        addPeepToCrowd();
      });

      peep.walk = walk;

      crowd.push(peep);
      crowd.sort((a, b) => a.anchorY - b.anchorY);

      return peep;
    };

    const removePeepFromCrowd = (peep: Peep) => {
      removeItemFromArray(crowd, peep);
      availablePeeps.push(peep);
    };

    const render = () => {
      if (!canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(devicePixelRatio, devicePixelRatio);

      crowd.forEach((peep) => {
        peep.render(ctx);
      });

      ctx.restore();
    };

    const resize = () => {
      if (!canvas) return;
      stage.width = canvas.clientWidth;
      stage.height = canvas.clientHeight;
      canvas.width = stage.width * devicePixelRatio;
      canvas.height = stage.height * devicePixelRatio;

      crowd.forEach((peep) => {
        peep.walk.kill();
      });

      crowd.length = 0;
      availablePeeps.length = 0;
      availablePeeps.push(...allPeeps);

      initCrowd();
    };

    const finalize = () => {
      availablePeeps.push(...allPeeps);
      resize();
      gsap.ticker.add(render);
      window.addEventListener("resize", resize);
    };

    if (config.src) {
      const spriteImg = document.createElement("img");
      spriteImg.onload = () => {
        createSpriteSheetPeeps(spriteImg);
        finalize();
      };
      spriteImg.src = config.src;
    } else {
      const loadFrameImages = async () => {
        const loadedImages: HTMLImageElement[] = [];

        await Promise.all(
          config.frames.map(
            (path) =>
              new Promise<void>((resolve) => {
                const image = document.createElement("img");
                image.onload = () => {
                  loadedImages.push(image);
                  resolve();
                };
                image.onerror = () => {
                  console.warn(`[CrowdCanvas] Failed to load ${path}`);
                  resolve();
                };
                image.src = path;
              }),
          ),
        );

        if (!loadedImages.length) {
          console.error("[CrowdCanvas] No frame images could be loaded.");
          return;
        }

        createFramePeeps(loadedImages);
        finalize();
      };

      loadFrameImages().catch((error) => {
        console.error("[CrowdCanvas] Unexpected error while loading frames", error);
      });
    }

    return () => {
      window.removeEventListener("resize", resize);
      gsap.ticker.remove(render);
      crowd.forEach((peep) => {
        if (peep.walk) peep.walk.kill();
      });
    };
  }, [frameSources, cols, rows, src]);
  return (
    <canvas ref={canvasRef} className="absolute bottom-0 h-[90vh] w-full" />
  );
};

const Skiper39 = () => {
  return (
    <div className="relative w-full" style={{ minHeight: "70vh" }}>
      <div className="pointer-events-none absolute inset-x-0 top-4 flex justify-center text-base uppercase tracking-[0.7em] text-orange-500">
        Thanks for Visiting
      </div>
       <div className="pt-31">
         <CurvedLoop marqueeText="The Happy Safar ✦ Across Rajasthan ✦ Custom Desert Trails ✦" speed={7} curveAmount={-200} />
       </div>
      <CrowdCanvas rows={15} cols={7} />
    </div>
  );
};

export { CrowdCanvas, Skiper39 };

