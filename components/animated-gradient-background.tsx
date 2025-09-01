"use client"

import { useEffect, useRef, useState, useCallback } from "react"

interface AnimatedGradientBackgroundProps {
  /** Animation speed multiplier (0.1 - 2.0) */
  speed?: number
  /** Animation intensity (0.1 - 1.0) */
  intensity?: number
  /** Custom color palette */
  colors?: string[]
  /** Random seed for noise generation */
  seed?: number
  /** Additional CSS classes */
  className?: string
}

/**
 * WebGL-powered animated gradient background with organic movement
 * Features: noise-based animation, mouse parallax, accessibility support, fallback
 */
export default function AnimatedGradientBackground({
  speed = 1.0,
  intensity = 0.7,
  colors = ["#FF2D2D", "#BA1F1F", "#D9D9D9", "#6B7280", "#0A0A0A", "#FFFFFF"],
  seed = 42,
  className = "",
}: AnimatedGradientBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const glRef = useRef<WebGLRenderingContext | null>(null)
  const programRef = useRef<WebGLProgram | null>(null)
  const animationRef = useRef<number>()
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const [isWebGLSupported, setIsWebGLSupported] = useState(true)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  // Vertex shader - positions the quad
  const vertexShaderSource = `
    attribute vec2 a_position;
    varying vec2 v_uv;
    
    void main() {
      v_uv = a_position * 0.5 + 0.5;
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `

  // Fragment shader - creates the animated gradient
  const fragmentShaderSource = `
    precision mediump float;
    
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;
    uniform float u_speed;
    uniform float u_intensity;
    uniform float u_seed;
    uniform vec3 u_colors[6];
    
    varying vec2 v_uv;
    
    // Improved noise function for organic movement
    float noise(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }
    
    float smoothNoise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      
      float a = noise(i);
      float b = noise(i + vec2(1.0, 0.0));
      float c = noise(i + vec2(0.0, 1.0));
      float d = noise(i + vec2(1.0, 1.0));
      
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }
    
    float fbm(vec2 p) {
      float value = 0.0;
      float amplitude = 0.5;
      float frequency = 1.0;
      
      for(int i = 0; i < 4; i++) {
        value += amplitude * smoothNoise(p * frequency + u_seed);
        amplitude *= 0.5;
        frequency *= 2.0;
      }
      
      return value;
    }
    
    void main() {
      vec2 uv = v_uv;
      vec2 resolution = u_resolution;
      
      // Normalize coordinates
      vec2 st = uv;
      
      // Add subtle mouse parallax
      vec2 mouse = u_mouse * 0.1;
      st += mouse;
      
      // Create organic movement with multiple noise layers
      float time = u_time * u_speed * 0.02;
      
      vec2 noise1 = vec2(
        fbm(st * 2.0 + time),
        fbm(st * 2.0 + time + 100.0)
      );
      
      vec2 noise2 = vec2(
        fbm(st * 3.0 + time * 0.7 + noise1 * 0.3),
        fbm(st * 3.0 + time * 0.7 + noise1 * 0.3 + 200.0)
      );
      
      // Create color mixing zones
      float zone1 = fbm(st * 1.5 + time * 0.5 + noise2 * u_intensity);
      float zone2 = fbm(st * 2.2 + time * 0.3 + noise1 * u_intensity);
      float zone3 = fbm(st * 1.8 + time * 0.8 + noise2 * u_intensity * 0.7);
      
      // Smooth color transitions
      zone1 = smoothstep(0.2, 0.8, zone1);
      zone2 = smoothstep(0.1, 0.9, zone2);
      zone3 = smoothstep(0.3, 0.7, zone3);
      
      // Mix colors based on zones
      vec3 color1 = mix(u_colors[0], u_colors[1], zone1);
      vec3 color2 = mix(u_colors[2], u_colors[3], zone2);
      vec3 color3 = mix(u_colors[4], u_colors[5], zone3);
      
      // Final color mixing
      vec3 finalColor = mix(
        mix(color1, color2, zone2 * 0.7),
        color3,
        zone3 * 0.5
      );
      
      // Add subtle brightness variation
      float brightness = 0.9 + 0.1 * fbm(st * 4.0 + time);
      finalColor *= brightness;
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `

  // Convert hex colors to RGB
  const hexToRgb = useCallback((hex: string): [number, number, number] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? [
          Number.parseInt(result[1], 16) / 255,
          Number.parseInt(result[2], 16) / 255,
          Number.parseInt(result[3], 16) / 255,
        ]
      : [0, 0, 0]
  }, [])

  // Create shader
  const createShader = useCallback((gl: WebGLRenderingContext, type: number, source: string) => {
    const shader = gl.createShader(type)
    if (!shader) return null

    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("Shader compilation error:", gl.getShaderInfoLog(shader))
      gl.deleteShader(shader)
      return null
    }

    return shader
  }, [])

  // Create program
  const createProgram = useCallback(
    (gl: WebGLRenderingContext) => {
      const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
      const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)

      if (!vertexShader || !fragmentShader) return null

      const program = gl.createProgram()
      if (!program) return null

      gl.attachShader(program, vertexShader)
      gl.attachShader(program, fragmentShader)
      gl.linkProgram(program)

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Program linking error:", gl.getProgramInfoLog(program))
        gl.deleteProgram(program)
        return null
      }

      return program
    },
    [createShader, vertexShaderSource, fragmentShaderSource],
  )

  // Handle mouse movement
  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (prefersReducedMotion) return

      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return

      mouseRef.current = {
        x: (event.clientX - rect.left) / rect.width,
        y: 1.0 - (event.clientY - rect.top) / rect.height,
      }
    },
    [prefersReducedMotion],
  )

  // Handle resize
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current
    const gl = glRef.current
    if (!canvas || !gl) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr

    gl.viewport(0, 0, canvas.width, canvas.height)
  }, [])

  // Animation loop
  const animate = useCallback(
    (time: number) => {
      const gl = glRef.current
      const program = programRef.current
      const canvas = canvasRef.current

      if (!gl || !program || !canvas) return

      // Clear canvas
      gl.clearColor(0, 0, 0, 1)
      gl.clear(gl.COLOR_BUFFER_BIT)

      // Set uniforms
      const timeLocation = gl.getUniformLocation(program, "u_time")
      const resolutionLocation = gl.getUniformLocation(program, "u_resolution")
      const mouseLocation = gl.getUniformLocation(program, "u_mouse")
      const speedLocation = gl.getUniformLocation(program, "u_speed")
      const intensityLocation = gl.getUniformLocation(program, "u_intensity")
      const seedLocation = gl.getUniformLocation(program, "u_seed")

      gl.uniform1f(timeLocation, time * 0.001)
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height)
      gl.uniform2f(mouseLocation, mouseRef.current.x, mouseRef.current.y)
      gl.uniform1f(speedLocation, prefersReducedMotion ? 0 : speed)
      gl.uniform1f(intensityLocation, intensity)
      gl.uniform1f(seedLocation, seed)

      // Set color uniforms
      colors.forEach((color, index) => {
        const rgb = hexToRgb(color)
        const location = gl.getUniformLocation(program, `u_colors[${index}]`)
        gl.uniform3f(location, rgb[0], rgb[1], rgb[2])
      })

      // Draw
      gl.drawArrays(gl.TRIANGLES, 0, 6)

      if (!prefersReducedMotion) {
        animationRef.current = requestAnimationFrame(animate)
      }
    },
    [speed, intensity, seed, colors, hexToRgb, prefersReducedMotion],
  )

  // Initialize WebGL
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener("change", handleMotionChange)

    try {
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
      if (!gl) {
        setIsWebGLSupported(false)
        return
      }

      glRef.current = gl as WebGLRenderingContext

      // Create program
      const program = createProgram(gl as WebGLRenderingContext)
      if (!program) {
        setIsWebGLSupported(false)
        return
      }

      programRef.current = program

      // Create geometry (full-screen quad)
      const positions = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1])

      const positionBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)

      const positionLocation = gl.getAttribLocation(program, "a_position")
      gl.enableVertexAttribArray(positionLocation)
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

      // Handle resize
      handleResize()
      window.addEventListener("resize", handleResize)
      window.addEventListener("mousemove", handleMouseMove)

      // Start animation
      animationRef.current = requestAnimationFrame(animate)
    } catch (error) {
      console.error("WebGL initialization error:", error)
      setIsWebGLSupported(false)
    }

    return () => {
      mediaQuery.removeEventListener("change", handleMotionChange)
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [createProgram, handleResize, handleMouseMove, animate])

  // CSS fallback gradient
  const fallbackGradient = `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 25%, ${colors[2]} 50%, ${colors[3]} 75%, ${colors[4]} 100%)`

  if (!isWebGLSupported) {
    return (
      <div
        className={`fixed inset-0 -z-10 ${className}`}
        style={{
          background: fallbackGradient,
          opacity: 0.8,
        }}
        aria-hidden="true"
      />
    )
  }

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 -z-10 w-full h-full ${className}`}
      style={{
        background: fallbackGradient,
        opacity: 0.8,
      }}
      aria-hidden="true"
    />
  )
}
