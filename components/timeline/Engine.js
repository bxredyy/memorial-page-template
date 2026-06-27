import * as THREE from 'three'
import { Gallery } from './Gallery.js'
import { Background } from './Background.js'
import { TrailController } from './TrailController.js'

class Engine {
  constructor(canvas, containerElement) {
    if (!(canvas instanceof HTMLCanvasElement)) {
      throw new Error('Engine requires a valid canvas element')
    }

    this.canvas = canvas
    this.container = containerElement || canvas.parentElement || document.body

    this.isInitialized = false
    this.isRunning = false
    this.animationFrameRequestId = null
    this.preloadedTextures = new Map()

    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
    this.camera.position.set(0, 0, 6)

    this.gallery = new Gallery()
    this.background = new Background()
    this.trailController = new TrailController({ gallery: this.gallery })

    // Scroll-driven progress, set externally via setProgress(0..1).
    this.progressTarget = 0
    this.progressCurrent = 0
    this.progressSmoothing = 0.12

    // Computed scroll-like state passed into the gallery for breath/drift.
    this.scrollState = {
      velocity: 0,
      velocityMax: 1.5,
      minCameraZ: -Infinity,
      maxCameraZ: Infinity,
    }
    this._previousProgress = 0
    this._rawVelocity = 0
    this._velocityDamping = 0.18
    // Scale derivative of progress into the same range Codrops expects.
    this._velocityScale = 60

    this.firstPlaneViewOffset = 5
    this.lastPlaneViewOffset = 5

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false,
    })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.autoClear = false

    this.onResize = () => this.resize()
    this.animate = this.update.bind(this)
  }

  async init() {
    if (this.isInitialized) return

    this.preloadedTextures = await this.preloadTextures()
    this.gallery.setPreloadedTextures(this.preloadedTextures)
    await this.gallery.init(this.scene, this.container)
    this.background.init()
    this.trailController.init(this.scene, this.camera)

    this.updateCameraBounds()
    this.camera.position.z = this.scrollState.maxCameraZ

    this.resize()
    window.addEventListener('resize', this.onResize)

    this.isInitialized = true
    this.start()
  }

  start() {
    if (!this.isInitialized || this.isRunning) return
    this.isRunning = true
    this.update()
  }

  stop() {
    this.isRunning = false
    if (this.animationFrameRequestId !== null) {
      cancelAnimationFrame(this.animationFrameRequestId)
      this.animationFrameRequestId = null
    }
  }

  resize() {
    const width = this.canvas.clientWidth || this.container.clientWidth || window.innerWidth || 1
    const height = this.canvas.clientHeight || this.container.clientHeight || window.innerHeight || 1
    if (width <= 0 || height <= 0) return

    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height, false)
    this.gallery.updatePlaneScale()
    this.gallery.layoutPlanes()
    this.updateCameraBounds()
  }

  updateCameraBounds() {
    const depthRange = this.gallery.getDepthRange()
    this.scrollState.maxCameraZ = depthRange.nearestZ + this.firstPlaneViewOffset
    this.scrollState.minCameraZ = depthRange.deepestZ + this.lastPlaneViewOffset
    if (this.scrollState.minCameraZ > this.scrollState.maxCameraZ) {
      this.scrollState.minCameraZ = this.scrollState.maxCameraZ
    }
  }

  async preloadTextures() {
    const textureSources = this.gallery.getTextureSources()
    if (!textureSources.length) return new Map()

    const textureLoader = new THREE.TextureLoader()
    textureLoader.setCrossOrigin('anonymous')
    const loadedTextures = new Map()

    await Promise.all(
      textureSources.map(async (textureSource) => {
        try {
          const texture = await textureLoader.loadAsync(textureSource)
          texture.colorSpace = THREE.SRGBColorSpace
          loadedTextures.set(textureSource, texture)
        } catch (error) {
          console.warn(`Texture failed to load: ${textureSource}`, error)
        }
      })
    )

    return loadedTextures
  }

  setProgress(normalizedProgress) {
    this.progressTarget = THREE.MathUtils.clamp(normalizedProgress || 0, 0, 1)
  }

  update() {
    if (!this.isRunning) return

    this.animationFrameRequestId = requestAnimationFrame(this.animate)
    const time = performance.now()

    // Smooth scroll progress.
    this.progressCurrent = THREE.MathUtils.lerp(
      this.progressCurrent,
      this.progressTarget,
      this.progressSmoothing
    )

    // Map progress (0=top, 1=bottom) to cameraZ (near→far).
    const { maxCameraZ, minCameraZ } = this.scrollState
    const cameraZ = THREE.MathUtils.lerp(maxCameraZ, minCameraZ, this.progressCurrent)
    this.camera.position.z = cameraZ

    // Derive velocity from progress delta (negative=going forward, like Codrops scroll).
    const rawDelta = (this.progressCurrent - this._previousProgress) * this._velocityScale
    this._rawVelocity = rawDelta
    this.scrollState.velocity = THREE.MathUtils.lerp(
      this.scrollState.velocity,
      this._rawVelocity,
      this._velocityDamping
    )
    this.scrollState.velocity = THREE.MathUtils.clamp(
      this.scrollState.velocity,
      -this.scrollState.velocityMax,
      this.scrollState.velocityMax
    )
    if (Math.abs(this.scrollState.velocity) < 0.0001) this.scrollState.velocity = 0
    this._previousProgress = this.progressCurrent

    // Trail + gallery updates.
    this.trailController.update(this.camera, this.scrollState, time)
    this.gallery.update(this.camera, this.scrollState)

    // Background mood + motion response.
    const moodBlendData = this.gallery.getMoodBlendData(this.camera.position.z)
    if (moodBlendData) this.background.setMoodBlend(moodBlendData)

    const depthProgress = this.gallery.getDepthProgress(this.camera.position.z)
    const velocityMax = this.scrollState.velocityMax
    const velocityIntensity = THREE.MathUtils.clamp(
      Math.abs(this.scrollState.velocity) / Math.max(velocityMax, 0.0001),
      0,
      1
    )
    const planeBlendData = this.gallery.getPlaneBlendData(this.camera.position.z)
    const blend = planeBlendData?.blend ?? 0
    const distanceFromBlendCenter = Math.abs(blend - 0.5) * 2
    const transitionStability = THREE.MathUtils.smoothstep(distanceFromBlendCenter, 0.35, 1)
    const stabilizedVelocityIntensity = velocityIntensity * transitionStability

    this.background.setMotionResponse({
      depthProgress,
      velocityIntensity: stabilizedVelocityIntensity,
    })
    this.background.update(time)

    // Render: clear, background, planes (+ depth cleared so background doesn't fight planes).
    this.renderer.clear(true, true, true)
    this.background.render(this.renderer)
    this.renderer.clearDepth()
    this.renderer.render(this.scene, this.camera)
  }

  getActivePlaneIndex() {
    const blendData = this.gallery.getPlaneBlendData(this.camera.position.z)
    if (!blendData) return 0
    return blendData.blend >= 0.5 ? blendData.nextPlaneIndex : blendData.currentPlaneIndex
  }

  dispose() {
    this.stop()
    window.removeEventListener('resize', this.onResize)
    this.trailController.dispose()
    this.gallery.dispose()
    this.background.dispose()
    this.preloadedTextures.forEach((texture) => texture.dispose())
    this.preloadedTextures.clear()
    this.renderer.dispose()
  }
}

export { Engine }
