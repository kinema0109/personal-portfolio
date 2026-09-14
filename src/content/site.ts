import type { SiteConfig } from './types'

export const site: SiteConfig = {
  name: 'Hoàng Công Thọ',
  role: 'Middle Fullstack Developer',

  cv: {
    // Drop the PDF into public/cv/ with this name. Missing file → "CV chưa được thêm".
    file: 'cv/hoang-cong-tho-cv.pdf',
  },

  // MISSING: fill in real values. null renders as "Chưa bổ sung".
  contact: [
    { label: 'Email', kind: 'email', value: null },
    { label: 'GitHub', kind: 'url', value: null },
    { label: 'LinkedIn', kind: 'url', value: null },
  ],

  review: {
    showContentStatus: true,
    showArtworkNotice: true,
  },
}
