import { useRef, useEffect } from "react";
import p5 from "p5";

export function SimulationCanvas({ config, sketchFn }) {
  const canvasRef = useRef(null);
  const configRef = useRef(config);

  useEffect(() => {
    configRef.current = config;
  }, [config]);

  useEffect(() => {
    if (!canvasRef.current || !sketchFn) return;

    canvasRef.current.innerHTML = "";

    const instance = new p5((p) => {
      sketchFn(p, configRef);
    }, canvasRef.current);

    return () => {
      instance.remove();
      if (canvasRef.current) {
        canvasRef.current.innerHTML = "";
      }
    };
  }, [sketchFn]);

  return <div className="sim-canvas" ref={canvasRef} />;
}