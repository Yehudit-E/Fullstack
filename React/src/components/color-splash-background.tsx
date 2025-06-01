
import { useEffect, useRef } from "react"

interface ColorSplashBackgroundProps {
  className?: string
}

const ColorSplashBackground = ({ className }: ColorSplashBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight * 3 // Make canvas taller to cover the whole page
      drawSplashes(ctx, canvas.width, canvas.height)
    }

    const drawSplashes = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      ctx.clearRect(0, 0, width, height)

      // Get computed styles to access CSS variables
      const computedStyle = getComputedStyle(document.documentElement)
      const gradientStart = computedStyle.getPropertyValue("--gradient-start").trim() || "#ff4d4d"
      const gradientMiddle = computedStyle.getPropertyValue("--gradient-middle").trim() || "#f9cb28"
      const gradientEnd = computedStyle.getPropertyValue("--gradient-end").trim() || "#ff4d4d"

      const colors = [gradientStart, gradientMiddle, gradientEnd]

      // Create larger, more organic splashes
      const splashCount = Math.max(5, Math.floor(width / 300))

      for (let i = 0; i < splashCount; i++) {
        const x = Math.random() * width
        const y = Math.random() * height
        const color = colors[Math.floor(Math.random() * colors.length)]

        drawSplash(ctx, x, y, color)
      }

      // Add some smaller accent splashes
      for (let i = 0; i < splashCount * 2; i++) {
        const x = Math.random() * width
        const y = Math.random() * height
        const color = colors[Math.floor(Math.random() * colors.length)]

        drawAccentSplash(ctx, x, y, color)
      }
    }

    const drawSplash = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string) => {
      const size = 100 + Math.random() * 200

      ctx.globalAlpha = 0.05 + Math.random() * 0.1 // Very subtle opacity

      // Main blob
      ctx.beginPath()
      ctx.fillStyle = color

      // Create an organic shape with bezier curves
      const points = 6 + Math.floor(Math.random() * 6)
      const angleStep = (Math.PI * 2) / points

      for (let i = 0; i < points; i++) {
        const angle = i * angleStep
        const radius = size * (0.7 + Math.random() * 0.3)

        const px = x + Math.cos(angle) * radius
        const py = y + Math.sin(angle) * radius

        if (i === 0) {
          ctx.moveTo(px, py)
        } else {
          const cpx1 = x + Math.cos(angle - angleStep / 3) * radius * 1.2
          const cpy1 = y + Math.sin(angle - angleStep / 3) * radius * 1.2

          const cpx2 = x + Math.cos(angle - angleStep / 6) * radius * 1.1
          const cpy2 = y + Math.sin(angle - angleStep / 6) * radius * 1.1

          ctx.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, px, py)
        }
      }

      ctx.closePath()
      ctx.fill()

      // Add some smaller blobs around the main one
      const smallBlobCount = 3 + Math.floor(Math.random() * 4)

      for (let i = 0; i < smallBlobCount; i++) {
        const angle = Math.random() * Math.PI * 2
        const distance = size * 0.6 + Math.random() * size * 0.4

        const bx = x + Math.cos(angle) * distance
        const by = y + Math.sin(angle) * distance
        const bsize = size * (0.2 + Math.random() * 0.3)

        ctx.beginPath()
        ctx.arc(bx, by, bsize, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const drawAccentSplash = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string) => {
      const size = 20 + Math.random() * 40

      ctx.globalAlpha = 0.05 + Math.random() * 0.05 // Very subtle opacity

      // Small accent splash
      ctx.beginPath()
      ctx.fillStyle = color

      // Create a small organic shape
      const points = 4 + Math.floor(Math.random() * 3)
      const angleStep = (Math.PI * 2) / points

      for (let i = 0; i < points; i++) {
        const angle = i * angleStep
        const radius = size * (0.7 + Math.random() * 0.3)

        const px = x + Math.cos(angle) * radius
        const py = y + Math.sin(angle) * radius

        if (i === 0) {
          ctx.moveTo(px, py)
        } else {
          ctx.quadraticCurveTo(
            x + Math.cos(angle - angleStep / 2) * radius * 1.5,
            y + Math.sin(angle - angleStep / 2) * radius * 1.5,
            px,
            py,
          )
        }
      }

      ctx.closePath()
      ctx.fill()
    }

    // Initial setup
    resizeCanvas()

    // Handle window resize
    window.addEventListener("resize", resizeCanvas)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`fixed top-0 left-0 w-full h-full pointer-events-none z-0 ${className || ""}`}
      style={{ opacity: 0.8 }}
    />
  )
}

export default ColorSplashBackground
