import { ApartmentScene, POSTER_BOX } from '../art/ApartmentScene'
import { WorkshopScene } from '../art/WorkshopScene'
import { H, W } from '../art/palette'
import { site } from '../content/site'
import type { SceneId } from '../content/types'

interface SceneProps {
  scene: SceneId
  posterEnabled: boolean
  onPoster: () => void
}

const DESCRIPTIONS: Record<SceneId, string> = {
  apartment:
    'Tranh pixel: căn hộ nhỏ ban đêm. Một lập trình viên ngồi ở bàn với laptop, quạt bàn, cốc nước, băng game và tai nghe. Trên tường có một tấm poster.',
  workshop:
    'Tranh pixel: xưởng máy tưởng tượng. Một thợ máy chuột hư cấu mặc quần yếm, đeo kính bảo hộ, cầm cờ lê, đứng cạnh bàn máy.',
}

const pct = (v: number, total: number) => `${(v / total) * 100}%`

export function Scene({ scene, posterEnabled, onPoster }: SceneProps) {
  return (
    <figure className="scene" role="img" aria-label={DESCRIPTIONS[scene]}>
      {scene === 'apartment' ? <ApartmentScene /> : <WorkshopScene />}

      {site.review.showArtworkNotice && (
        <figcaption className="art-notice">
          Minh hoạ tạm (placeholder)
          <span className="art-notice-detail">
            {scene === 'apartment' ? ' · nhân vật chưa phải chân dung thật' : ' · nhân vật hư cấu'}
          </span>
        </figcaption>
      )}

      {scene === 'apartment' && posterEnabled && (
        <button
          type="button"
          className="poster-hotspot"
          style={{
            left: pct(POSTER_BOX.x, W),
            top: pct(POSTER_BOX.y, H),
            width: pct(POSTER_BOX.w, W),
            height: pct(POSTER_BOX.h, H),
          }}
          onClick={onPoster}
        >
          <span className="poster-hotspot-label">Xem poster</span>
        </button>
      )}
    </figure>
  )
}
