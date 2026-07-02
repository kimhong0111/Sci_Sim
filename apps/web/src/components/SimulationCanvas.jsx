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

            const originalSetup = p.setup;
            p.setup = () => {
                const canvas = p.createCanvas(800, 500);
                canvas.parent(canvasRef.current);
                originalSetup?.();
            };
        });

        return () => {
            instance.remove();
            if (canvasRef.current) {
                canvasRef.current.innerHTML = "";
            }
        };
    }, [sketchFn]);

    return (
        <div
            ref={canvasRef}
            style={{ width: "800px", height: "500px", border: "1px solid #333" }}
        />
    );
}