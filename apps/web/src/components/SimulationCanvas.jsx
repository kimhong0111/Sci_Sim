import { useRef, useEffect, useState } from "react"
import p5 from "p5"
export function SimulationCanvas({ config }) {
  const canvasRef = useRef(null)
  const configRef = useRef(config)

  useEffect(() => {
    configRef.current = config
  }, [config])

  useEffect(() => {
    if (!canvasRef.current) return
    if (canvasRef.current.children.length > 0) return

    const sketch = (p) => {
      let x = 400
      let y = 50
      let vy = 0

      p.setup = () => {
        p.createCanvas(600, 600).parent(canvasRef.current)
      }

      p.draw = () => {
        const { gravity, mass } = configRef.current

        p.background(30)

        vy += gravity * 0.05
        y += vy

        if (y >= 570) {
          y = 570
          vy *= -0.7
        }

        p.fill(100, 180, 255)
        p.noStroke()
        p.ellipse(x, y, mass * 10, mass * 10)

        p.fill(255)
        p.textSize(14)
        p.text(`gravity: ${gravity}`, 20, 30)
        p.text(`mass: ${mass}`, 20, 50)
      }

      p.mousePressed = () => {
        x = p.mouseX
        y = 50
        vy = 0
      }
    }

    const instance = new p5(sketch)
    return () => instance.remove()
  }, [])

  return (
    <div
      ref={canvasRef}
      style={{ width: "600px", height: "600px", border: "1px solid #333" }}
    />
  )
}

