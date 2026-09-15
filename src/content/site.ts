import type { SiteConfig } from './types'

export const site: SiteConfig = {
  // The role line is translated in src/content/i18n/*.ts.
  name: 'Hoàng Công Thọ',

  cv: {
    // Drop the PDF into public/cv/ with this name. Missing file → "CV not added yet".
    file: 'cv/hoang-cong-tho-cv.pdf',
  },

  // Email from the CV; GitHub and LinkedIn from Thọ's previous portfolio. null renders as "Not provided yet".
  contact: [
    { id: 'email', kind: 'email', value: 'thoqb123456@gmail.com' },
    { id: 'github', kind: 'url', value: 'https://github.com/kinema0109' },
    { id: 'linkedin', kind: 'url', value: 'https://www.linkedin.com/in/th%E1%BB%8D-ho%C3%A0ng-c%C3%B4ng-12322b260/' },
  ],

  review: {
    showContentStatus: true,
    showArtworkNotice: false,
  },
}
