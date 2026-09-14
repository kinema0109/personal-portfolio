import { useLayoutEffect, useRef, useState } from 'react'
import { APARTMENT_FOCUS, ApartmentScene, POSTER_BOX, type ScreenMode } from '../art/ApartmentScene'
import { frameCamera, type Region } from '../art/camera'
import { WORKSHOP_FOCUS, WorkshopScene } from '../art/WorkshopScene'
import { site } from '../content/site'
import type { SceneId } from '../content/types'

interface SceneProps {
  scene: SceneId
  screen: ScreenMode
  speaker: string
  posterEnabled: boolean
  onPoster: () => void
  /** Screen area not covered by the UI; the camera keeps the focus inside it. */
  region: Region | null
}

const DESCRIPTIONS: Record<SceneId, string> = {
  apartment:
    'Tranh pixel: căn hộ nhỏ ban đêm. Một lập trình viên ngồi ở bàn với laptop, quạt bàn, cốc nước, băng game và tai nghe. Trên tường có một tấm poster.',
  workshop:
    'Tranh pixel: xưởng máy tưởng tượng. Một thợ máy chuột hư cấu mặc quần yếm, đeo kính bảo hộ, cầm cờ lê, đứng cạnh bàn máy.',
}

export function Scene({ scene, screen, speaker, posterEnabled, onPoster, region }: SceneProps) {
  const layerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight })

  useLayoutEffect(() => {
    const el = layerRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      setSize({ w: entry.contentRect.width, h: entry.contentRect.height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const free = region ?? { left: 0, top: 0, width: size.w, height: size.h }
  const cam = frameCamera(size.w, size.h, free, scene === 'apartment' ? APARTMENT_FOCUS : WORKSHOP_FOCUS)
  const viewBox = `${cam.x} ${cam.y} ${cam.w} ${cam.h}`

  // Poster hotspot in CSS px; only shown when it is not hidden behind the UI.
  const poster = {
    left: (POSTER_BOX.x - cam.x) * cam.scale,
    top: (POSTER_BOX.y - cam.y) * cam.scale,
    width: POSTER_BOX.w * cam.scale,
    height: POSTER_BOX.h * cam.scale,
  }
  const posterVisible =
    poster.left >= free.left &&
    poster.top >= free.top &&
    poster.left + poster.width <= free.left + free.width &&
    poster.top + poster.height <= free.top + free.height

  return (
    <div className="scene-layer" ref={layerRef}>
      <figure className="scene" role="img" aria-label={DESCRIPTIONS[scene]}>
        <div className="scene-art" key={scene}>
          {scene === 'apartment' ? (
            <ApartmentScene viewBox={viewBox} screen={screen} speaking={speaker === 'THỌ'} />
          ) : (
            <WorkshopScene viewBox={viewBox} speaking={speaker === 'THỢ MÁY'} />
          )}
        </div>
      </figure>

      {site.review.showArtworkNotice && (
        <p className="art-notice">
          Minh hoạ tạm
          <span className="art-notice-detail">
            {scene === 'apartment' ? ' · nhân vật chưa phải chân dung thật' : ' · nhân vật hư cấu'}
          </span>
        </p>
      )}

      {scene === 'apartment' && posterEnabled && posterVisible && (
        <button type="button" className="poster-hotspot" style={poster} onClick={onPoster}>
          <span className="poster-hotspot-label">Xem poster</span>
        </button>
      )}
    </div>
  )
}
