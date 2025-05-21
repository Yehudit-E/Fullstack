"use client"

import { useEffect, useRef } from "react"
import "./style/ColorSplashBackground.css"

interface ColorSplashBackgroundProps {
  opacity?: number
}

const ColorSplashBackground = ({ opacity = 0.3 }: ColorSplashBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D | null
    if (!ctx) return
    const colors: string[] = [
      "rgba(236, 72, 153, 0.7)", // Pink
      "rgba(139, 92, 246, 0.7)", // Purple
      "rgba(6, 182, 212, 0.7)", // Cyan
      "rgba(249, 115, 22, 0.7)", // Orange
      "rgba(16, 185, 129, 0.7)", // Emerald
    ]
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      drawSplashes()
    }

    window.addEventListener("resize", handleResize)
    handleResize()



    function drawSplashes() {
      if (!canvas || !ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, "rgba(0, 0, 0, 0.9)")
      gradient.addColorStop(1, "rgba(20, 20, 20, 0.95)")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < 8; i++) {
        drawSplash(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          Math.random() * 300 + 100,
          colors[Math.floor(Math.random() * colors.length)],
          opacity,
        )
      }

      for (let i = 0; i < 15; i++) {
        drawSplash(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          Math.random() * 100 + 50,
          colors[Math.floor(Math.random() * colors.length)],
          opacity * 0.7,
        )
      }

      applyNoiseTexture(0.03)
    }

    function drawSplash(
      x: number,
      y: number,
      size: number,
      color: string,
      alpha: number
    ): void {
      if (!ctx) return

      ctx.globalAlpha = alpha

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size)
      gradient.addColorStop(0, color)
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)")
      ctx.fillStyle = gradient

      ctx.beginPath()

      const arms = Math.floor(Math.random() * 5) + 5

      for (let i = 0; i < arms; i++) {
        const angle = ((Math.PI * 2) / arms) * i
        const length = size * (0.7 + Math.random() * 0.3)

        const controlPoint1X = x + Math.cos(angle - 0.2) * length * 0.5
        const controlPoint1Y = y + Math.sin(angle - 0.2) * length * 0.5
        const controlPoint2X = x + Math.cos(angle + 0.2) * length * 0.5
        const controlPoint2Y = y + Math.sin(angle + 0.2) * length * 0.5
        const endX = x + Math.cos(angle) * length
        const endY = y + Math.sin(angle) * length

        if (i === 0) {
          ctx.moveTo(endX, endY)
        } else {
          ctx.quadraticCurveTo(controlPoint1X, controlPoint1Y, endX, endY)
        }
      }

      ctx.closePath()
      ctx.fill()
      ctx.globalAlpha = 1
    }

    function applyNoiseTexture(intensity: number): void {
      if (!canvas || !ctx) return

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * intensity * 255

        data[i] = Math.min(255, Math.max(0, data[i] + noise))
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise))
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise))
      }

      ctx.putImageData(imageData, 0, 0)
    }

    drawSplashes()

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [opacity])

  return <canvas ref={canvasRef} className="color-splash-background" />
}

export default ColorSplashBackground
