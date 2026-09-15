import type { LocaleContent } from '../types'

/** Vietnamese, translated from en.ts. Draft until Thọ confirms the wording. */
export const vi: LocaleContent = {
  translationStatus: 'draft',
  meta: {
    title: 'Hoàng Công Thọ — Portfolio (bản thử)',
    description: 'Hoàng Công Thọ — Kỹ sư Full-Stack. Portfolio dạng visual novel ngắn.',
  },
  role: 'Kỹ sư Full-Stack',
  present: 'nay',
  speakers: { tho: 'THỌ', note: 'GHI CHÚ' },

  story: {
    intro: [
      [
        'Chào bạn, mình là Thọ, kỹ sư Full-Stack với ba năm kinh nghiệm trong hệ sinh thái JavaScript và TypeScript.',
        'Mình xây dựng giao diện React, Next.js hiệu năng cao và thiết kế API NestJS trên cơ sở dữ liệu SQL lẫn NoSQL.',
        'Mình chú trọng design pattern rõ ràng, kiểm thử và CI/CD.',
      ],
      [
        'Hiện mình làm ở HDWEBSOFT tại TP. Hồ Chí Minh, trên các nền tảng thương mại điện tử, logistics, đào tạo doanh nghiệp và quản lý bất động sản.',
        'Bạn có thể hỏi mình đã làm những gì, làm việc ra sao, hay rời bàn phím thì làm gì.',
        'Hoặc cứ nhìn quanh căn phòng; vài món trên bàn có thể mở ra đấy.',
      ],
    ],
    work: [
      [
        'Mình là kỹ sư Full Stack tại HDWEBSOFT từ tháng 3/2025.',
        'Trước đó mình xây dựng mạng xã hội cộng đồng ở Suzu Group (2024–2025), và làm các ứng dụng karaoke, âm nhạc xã hội ở InmobiVN (2022–2024).',
      ],
      [
        'Mình chủ yếu viết TypeScript và JavaScript: React, Next.js, Redux, Vue.js ở frontend; NestJS, Express ở backend; ngoài ra còn Python/Django và Java.',
        'Về dữ liệu mình dùng PostgreSQL, MongoDB, MySQL, Supabase, và triển khai bằng Docker, GCP, Vercel, Jenkins.',
      ],
    ],
    workOverview: (archived) => [
      'Ba dự án thể hiện rõ nhất công việc hằng ngày của mình: CBPO, CA2T và TheAvoTree.',
      `${archived} dự án còn lại nằm trong kho dự án.`,
    ],
    how: [
      [
        'Có một thói quen xuyên suốt công việc của mình: dùng công cụ AI như Claude Code để làm nhanh hơn.',
        'Mình vẫn tự review, debug và kiểm thử kết quả, để tốc độ không đánh đổi chất lượng code.',
      ],
      [
        'Mình có thể kể sâu hơn về ba phần việc trong CV.',
        'Chọn một nhé: chuyển MongoDB production từ Atlas sang GCP tự vận hành, pipeline webhook thời gian thực, hoặc phân quyền theo vai trò.',
      ],
    ],
    'how-migration': [
      [
        'CBPO là nền tảng điều phối dữ liệu thương mại điện tử và logistics, xây dựng dạng microservices Python/Django và Vue.js trên GCP.',
        'Nền tảng tập trung xử lý đơn hàng, lấy dữ liệu sàn Amazon như BuyBox và theo dõi đối thủ, bảo vệ giá thương hiệu và tối ưu vận chuyển.',
      ],
      [
        'Tầng dữ liệu của nó là dạng lai.',
        'PostgreSQL giữ các giao dịch đơn hàng dạng quan hệ, còn MongoDB giữ số liệu sàn cập nhật liên tục và log phân tích.',
      ],
      [
        'Phần việc lớn nhất của mình ở đó là chuyển MongoDB production ra khỏi MongoDB Atlas.',
        'Mình dựng một hệ thống tự vận hành gồm sáu VM trên GCP, điều phối bằng Docker, rồi chuyển nhiều cụm MongoDB 1.5TB sang đó.',
      ],
      [
        'Để nền tảng không bị gián đoạn, mình thiết kế pipeline replication không downtime và restore song song bằng Docker Compose.',
        'Việc chuyển đổi cũng giúp nền tảng bớt phụ thuộc vào giấy phép của bên thứ ba.',
      ],
    ],
    'how-events': [
      [
        'TheAvoTree là một nền tảng thương mại điện tử lớn, kết nối WordPress/WooCommerce với một hệ thống quản lý JavaScript hiện đại.',
        'Mình làm phần kết nối này full-stack: API NestJS trên MongoDB và dashboard quản trị bằng React.',
      ],
      [
        'Mình thiết kế schema MongoDB hiệu năng cao, phản chiếu cấu trúc dữ liệu phức tạp của WooCommerce.',
        'Nhờ vậy dữ liệu luôn nhất quán giữa hai nền tảng.',
      ],
      [
        'Đơn hàng và cập nhật tồn kho được gửi tới qua webhook của WooCommerce.',
        'Mình xây dựng một webhook listener bảo mật, thời gian thực, xử lý hàng nghìn sự kiện mỗi ngày mà không mất dữ liệu.',
      ],
      [
        'Trên nền dữ liệu đó là dashboard quản trị React cho doanh số, hành vi người dùng và hiệu quả nội dung.',
        'Mình cũng viết unit test và integration test cho logic nghiệp vụ cốt lõi.',
      ],
    ],
    'how-roles': [
      [
        'CA2T là hệ thống quản lý học tập (LMS) cho đào tạo doanh nghiệp, xây dựng bằng React, Python/Django và PostgreSQL.',
        'Ở đó mình là kỹ sư Full Stack và dẫn dắt nhóm.',
      ],
      ['Mình thiết kế hệ thống phân quyền động theo vai trò.', 'Quản trị viên và học viên đều có dashboard và giao diện học riêng.'],
      ['Mình dẫn dắt một nhóm đa chức năng gồm năm người.', 'Mình giữ cho tiến độ và các quyết định kỹ thuật đi cùng một hướng.'],
      ['Mình cũng đưa công cụ AI (Claude Code) vào quy trình của nhóm để tăng tốc bàn giao.'],
    ],
    outside: [
      [
        'Ngoài công việc, mình chơi game khá nhiều.',
        'Mình bắt đầu từ thời Famicom/NES và giờ vẫn chơi game hiện đại, cả game gacha nữa.',
      ],
      ['Thấy cuốn album trên bàn mình không?', 'Mở ra xem một bộ sưu tập pixel art nho nhỏ nhé.'],
    ],
  },

  choices: {
    work: 'Bạn đã làm những gì?',
    how: 'Bạn làm việc thế nào?',
    outside: 'Ngoài công việc thì sao?',
    archive: 'Kho dự án',
    archiveMore: (count) => `Thêm ${count} dự án`,
    archiveAll: 'Mọi dự án trong CV',
    migration: 'MongoDB: Atlas → GCP tự vận hành',
    events: 'Webhook thời gian thực',
    roles: 'Phân quyền theo vai trò',
    seeDetails: (project) => `Xem chi tiết ${project}`,
    askOther: 'Hỏi chuyện khác',
    album: 'Cuốn album trên bàn',
    albumHint: 'Bộ sưu tập pixel art',
    approach: 'Bạn đã xử lý nó thế nào?',
    seeFeatured: 'Xem dự án tiêu biểu',
  },

  views: {
    project: (p, hasDeepDive) => [
      `${p.name} là dự án ở ${p.company} (${p.period}), mình làm với vai trò ${p.role}.`,
      hasDeepDive
        ? 'Bảng bên cạnh cho thấy mình đã làm gì và dùng stack nào. Hỏi mình đã xử lý phần khó nhất ra sao nhé.'
        : 'Bảng bên cạnh cho thấy mình đã làm gì và dùng stack nào.',
    ],
    archive: [
      'Đây là tất cả dự án trong CV của mình, mới nhất xếp trước.',
      'Chọn một dự án để xem bối cảnh, vai trò, những gì mình đóng góp và stack.',
    ],
    galleryEmpty: ['Album hiện đang trống.', 'Thọ sẽ sớm thêm các bức pixel art.'],
    gallery: ['Album này tập hợp các bức pixel art.', 'Chọn một bức để xem cỡ lớn, dùng phím mũi tên để lật qua lại.'],
    cv: ['Đây là tóm tắt CV của mình: kinh nghiệm, học vấn và thông tin liên hệ.', 'Nhấn vào tên dự án để xem chi tiết.'],
  },

  projects: {
    cbpo: {
      context:
        'Nền tảng điều phối dữ liệu thương mại điện tử và logistics: xử lý đơn hàng, dữ liệu sàn Amazon, giá thương hiệu và quy trình vận chuyển.',
      role: 'Kỹ sư Full Stack',
      contributions: [
        'Microservices có khả năng mở rộng với Python/Django và Vue.js trên GCP',
        'Tầng dữ liệu lai: PostgreSQL cho giao dịch đơn hàng, MongoDB cho số liệu sàn',
        'Dựng môi trường MongoDB tự vận hành gồm 6 VM trên GCP, điều phối bằng Docker',
        'Chuyển nhiều cụm MongoDB 1.5TB từ MongoDB Atlas sang môi trường đó mà không downtime',
        'Phát triển tính năng có AI hỗ trợ, review tới chất lượng production',
      ],
    },
    ca2t: {
      context: 'Hệ thống quản lý học tập cho đào tạo doanh nghiệp, có vai trò quản trị viên và học viên riêng.',
      role: 'Kỹ sư Full Stack / Trưởng nhóm',
      contributions: [
        'Phân quyền động theo vai trò, mỗi vai trò có dashboard riêng',
        'Dẫn dắt nhóm đa chức năng 5 người',
        'Đưa công cụ AI (Claude Code) vào để tăng tốc bàn giao',
        'Giao diện nhanh, tương tác tốt với React và Tailwind',
      ],
    },
    theavotree: {
      context: 'Nền tảng thương mại điện tử lớn, kết nối WordPress/WooCommerce với một hệ thống quản lý JavaScript.',
      role: 'Kỹ sư Full Stack',
      contributions: [
        'Kết nối WooCommerce full-stack: API NestJS và dashboard quản trị React',
        'Schema MongoDB hiệu năng cao phản chiếu cấu trúc dữ liệu WooCommerce',
        'Webhook listener thời gian thực xử lý hàng nghìn sự kiện mỗi ngày, không mất dữ liệu',
        'Unit test và integration test cho logic nghiệp vụ cốt lõi',
      ],
    },
    singlekey: {
      context: 'Nền tảng quản lý bất động sản, giúp việc thuê nhà đơn giản hơn cho cả chủ nhà và người thuê.',
      role: 'Kỹ sư Full Stack',
      contributions: [
        'Landing page có tỷ lệ chuyển đổi cao bằng Next.js và TypeScript',
        'Thư viện component React tái sử dụng, giảm 30% thời gian làm tính năng mới',
        'A/B testing với VWO giúp tăng lượt đăng ký',
        'Chuyển yêu cầu sản phẩm thành đặc tả kỹ thuật',
      ],
    },
    suzu: {
      context: 'Mạng xã hội cộng đồng cho nhà sáng tạo, nghệ sĩ và người hâm mộ của họ.',
      role: 'Kỹ sư Full Stack',
      contributions: [
        'Mạng xã hội xây dựng bằng Next.js và Supabase',
        'Nhắn tin tức thời với Supabase Realtime qua WebSocket (giảm 40% độ trễ)',
        'Xếp hạng "Smart Feed" bằng hàm PostgreSQL',
        'Core Web Vitals đạt mức "Good", thời lượng phiên trung bình tăng 15%',
        'Pipeline CI/CD tự động trên Vercel, giảm 50% thời gian triển khai',
      ],
    },
    'ikara-admin': {
      context: 'Hệ thống quản trị và kinh tế trong ứng dụng của iKara, ứng dụng karaoke do InmobiVN phát triển.',
      role: 'Kỹ sư Full Stack',
      contributions: [
        'CMS bằng Java Servlet và React quản lý dữ liệu cho hơn 10.000 người dùng, toàn vẹn giao dịch 100%',
        'Quản lý cửa hàng ảo, vật phẩm và quy trình kiểm tra giá',
        'Công cụ báo cáo nội bộ, gồm báo cáo chi tiêu tiền ảo',
        'REST API đồng bộ vật phẩm cửa hàng trên Android và iOS',
        'Pipeline build và triển khai bằng Jenkins',
      ],
    },
    yokara: {
      context: 'Ứng dụng karaoke và âm nhạc xã hội của InmobiVN để hát, thu âm và chia sẻ bài hát.',
      role: 'Kỹ sư Full Stack',
      contributions: [
        'REST API với Express và Firebase Functions, bảo mật bằng JWT',
        'Backend tiền ảo và giao dịch trong ứng dụng, chính xác tài chính 100%',
        'Tối ưu truy vấn MongoDB cho mini-game thời gian thực tải cao',
        'Đồng bộ tính năng với ứng dụng di động Flutter và Swift',
      ],
    },
  },

  cv: {
    school: 'Đại học Duy Tân',
    major: 'Cử nhân Khoa học ngành Công nghệ Phần mềm',
    languages: ['Tiếng Việt: bản ngữ', 'Tiếng Anh: sử dụng trong công việc (TOEIC 695/990)'],
  },

  ui: {
    skipToDialogue: 'Tới hộp thoại',
    language: 'Ngôn ngữ',
    sound: 'Âm thanh',
    soundOn: 'Bật',
    soundOff: 'Tắt',
    details: 'Chi tiết',
    dialogue: 'Hội thoại',
    choices: 'Lựa chọn',
    dialogueNav: 'Điều hướng hội thoại',
    back: 'Quay lại',
    home: 'Đầu',
    next: 'Tiếp',
    lineOf: (line, total) => `Đoạn ${line}/${total}`,
    hotspots: { laptop: 'Xem dự án', album: 'Mở album', drawer: 'Mở hồ sơ CV' },
    sceneDescription:
      'Căn phòng pixel art ban đêm: Thọ làm việc bên laptop và cuốn album ảnh. Alhazard và Langrisser trong khung treo tường; Gran Centurio và Alpha Legion trong tủ trưng bày, Ambicion trên giá ở ngăn giữa; Grey Seer trên bàn. Có thể nhấn vào laptop, album và ngăn kéo bàn để khám phá.',
    artNotice: 'Hình minh hoạ tạm',
    artNoticeDetail: ' · hình chính thức sẽ có sau',
    portrait: 'Chân dung lập trình viên (tạm)',
    portraitTemp: 'Tạm',
    status: {
      draft: 'Nháp · cần Thọ xác nhận',
      placeholder: 'Đang chờ nội dung thật',
      translationDraft: 'Bản dịch nháp · cần Thọ xác nhận',
      source: (source) => `Nguồn: ${source}`,
    },
    project: {
      context: 'Bối cảnh',
      role: 'Vai trò',
      contributions: 'Đóng góp',
      technologies: 'Công nghệ',
      noContext: 'CV chưa có mô tả bối cảnh cho dự án này.',
      reviewNote: 'Nguồn: CV, cùng trang công khai của sản phẩm cho phần bối cảnh mà CV không có.',
    },
    cv: {
      openPdf: 'Mở CV (PDF)',
      notAdded: 'Chưa có file CV',
      checking: 'Đang kiểm tra…',
      sections: 'Các phần của CV',
      experience: 'Kinh nghiệm',
      education: 'Học vấn',
      contact: 'Liên hệ',
      languages: 'Ngoại ngữ',
      gpa: (value) => `GPA ${value}`,
      notProvided: 'Chưa cung cấp',
      contactLabels: { email: 'Email', github: 'GitHub', linkedin: 'LinkedIn' },
    },
    gallery: {
      eyebrow: 'Thư viện ảnh',
      title: 'Album pixel art',
      open: (title) => `Mở “${title}”`,
      noPictures: 'Chưa có ảnh',
      placeholderNote: 'Tạm thời: Thọ sẽ thêm ảnh pixel art vào public/gallery/.',
      prev: 'Trước',
      next: 'Sau',
      close: 'Đóng',
    },
  },
}
