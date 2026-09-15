import type { LocaleContent } from '../types'

/** Japanese, translated from en.ts. Draft until Thọ confirms the wording. */
export const ja: LocaleContent = {
  translationStatus: 'draft',
  meta: {
    title: 'Hoàng Công Thọ — ポートフォリオ（試作版）',
    description: 'Hoàng Công Thọ — フルスタックエンジニア。短いビジュアルノベル形式のポートフォリオ。',
  },
  role: 'フルスタックエンジニア',
  present: '現在',
  speakers: { tho: 'THỌ', note: 'メモ' },

  story: {
    intro: [
      [
        'こんにちは、Thọ（トー）です。JavaScript/TypeScriptのエコシステムで3年の経験を持つフルスタックエンジニアです。',
        '高速なReact・Next.jsの画面を作り、SQLとNoSQLのデータベースの上にNestJSのAPIを設計しています。',
        'きれいな設計パターン、テスト、CI/CDを大切にしています。',
      ],
      [
        '現在はホーチミン市のHDWEBSOFTで、EC、物流、企業研修、不動産管理向けのプラットフォームを開発しています。',
        'これまで作ってきたもの、仕事の進め方、キーボードを離れたときの過ごし方など、気軽に聞いてください。',
        '部屋を見回してみるのもおすすめです。机の上のいくつかの物は開けられます。',
      ],
    ],
    work: [
      [
        '2025年3月からHDWEBSOFTでフルスタックエンジニアとして働いています。',
        'それ以前は、Suzu Group（2024–2025）でコミュニティ型SNSを開発し、InmobiVN（2022–2024）ではカラオケや音楽SNSアプリに携わりました。',
      ],
      [
        '主にTypeScriptとJavaScriptを使っています。フロントエンドはReact、Next.js、Redux、Vue.js、バックエンドはNestJSとExpressで、Python/DjangoとJavaも使います。',
        'データにはPostgreSQL、MongoDB、MySQL、Supabaseを使い、Docker、GCP、Vercel、Jenkinsでデプロイしています。',
      ],
    ],
    workOverview: (archived) => [
      '日々の仕事を一番よく表しているのは、CBPO、CA2T、TheAvoTreeの3つです。',
      `残りの${archived}件はプロジェクト一覧にあります。`,
    ],
    how: [
      [
        'すべての仕事に共通する習慣があります。Claude CodeなどのAIツールを使って開発を速めることです。',
        'それでもレビュー、デバッグ、テストは自分で行い、スピードのためにコード品質を犠牲にしません。',
      ],
      [
        'CVにある3つの仕事について、もう少し詳しくお話しできます。',
        '本番MongoDBのAtlasからセルフホストGCPへの移行、リアルタイムWebhookパイプライン、ロールベースのアクセス制御から1つ選んでください。',
      ],
    ],
    'how-migration': [
      [
        'CBPOは、GCP上のPython/DjangoとVue.jsのマイクロサービスで構築された、ECデータ連携と物流のプラットフォームです。',
        '注文処理を一元化し、BuyBoxや競合追跡などのAmazonマーケットプレイスのデータを取り込み、ブランド価格を守りながら配送を最適化します。',
      ],
      [
        'データ層はハイブリッド構成です。',
        'PostgreSQLがリレーショナルな注文トランザクションを、MongoDBが高頻度で更新されるマーケットプレイス指標と分析ログを扱います。',
      ],
      [
        'そこでの一番大きな仕事は、本番環境のMongoDBをMongoDB Atlasから移すことでした。',
        'GCP上にDockerで構成した6台のVMのセルフホスト環境を構築し、1.5TB規模のMongoDBクラスタを複数そこへ移行しました。',
      ],
      [
        'サービスを止めないように、Docker Composeでダウンタイムなしのレプリケーションと並列リストアのパイプラインを設計しました。',
        'この移行により、サードパーティのライセンスへの依存も減らせました。',
      ],
    ],
    'how-events': [
      [
        'TheAvoTreeは、WordPress/WooCommerceとモダンなJavaScriptの管理システムをつなぐ大規模なECプラットフォームです。',
        'この連携をフルスタックで担当し、MongoDBを使ったNestJSのAPIとReactの管理ダッシュボードを作りました。',
      ],
      [
        'WooCommerceの複雑なデータ構造を反映した、高性能なMongoDBスキーマを設計しました。',
        'これにより、両プラットフォーム間でデータの整合性が保たれます。',
      ],
      [
        '注文や在庫の更新はWooCommerceのWebhookで届きます。',
        '1日数千件のリアルタイムイベントをデータを失わずに処理する、安全なWebhookリスナーを構築しました。',
      ],
      [
        'そのデータの上に、売上、ユーザー行動、コンテンツの成果を見るReactの管理ダッシュボードがあります。',
        'コアとなるビジネスロジックのユニットテストと結合テストも書きました。',
      ],
    ],
    'how-roles': [
      [
        'CA2Tは、React、Python/Django、PostgreSQLで構築した企業研修向けの学習管理システム（LMS）です。',
        '私はフルスタックエンジニアとしてチームを率いました。',
      ],
      ['動的なロールベースのアクセス制御を設計しました。', '管理者と受講者それぞれに専用のダッシュボードと学習画面があります。'],
      ['5人の職種横断チームを率いました。', 'スケジュールと技術的な判断の足並みをそろえる役割です。'],
      ['チームの開発フローにAIツール（Claude Code）を取り入れ、開発を加速しました。'],
    ],
    outside: [
      ['仕事以外では、ゲームをよく遊びます。', 'ファミコンの頃から始めて、今もガチャゲームを含めて最新のゲームを遊んでいます。'],
      ['机の上のアルバムが見えますか？', '開くと、小さなピクセルアートのギャラリーが見られます。'],
    ],
  },

  choices: {
    work: 'どんなものを作ってきましたか？',
    how: 'どのように仕事をしていますか？',
    outside: '仕事以外では？',
    archive: 'プロジェクト一覧',
    archiveMore: (count) => `ほか${count}件`,
    archiveAll: 'CVにあるすべてのプロジェクト',
    migration: 'MongoDB：Atlas → セルフホストGCP',
    events: 'リアルタイムWebhook',
    roles: 'ロールベースのアクセス制御',
    seeDetails: (project) => `${project}の詳細を見る`,
    askOther: '別のことを聞く',
    album: '机の上のアルバム',
    albumHint: 'ピクセルアートのギャラリー',
    approach: 'どのように取り組みましたか？',
    seeFeatured: '代表的なプロジェクトを見る',
  },

  views: {
    project: (p, hasDeepDive) => [
      `${p.name}は${p.company}のプロジェクト（${p.period}）で、私は${p.role}として参加しました。`,
      hasDeepDive
        ? 'パネルに担当内容と技術スタックをまとめています。一番難しかった部分への取り組み方も聞いてください。'
        : 'パネルに担当内容と使った技術スタックをまとめています。',
    ],
    archive: [
      'CVにあるすべてのプロジェクトです。新しい順に並んでいます。',
      '選ぶと、概要、私の役割、担当内容、技術スタックが見られます。',
    ],
    galleryEmpty: ['アルバムは今のところ空です。', 'ピクセルアートはThọが近いうちに追加します。'],
    gallery: ['このアルバムにはピクセルアートを集めています。', '選ぶと大きく表示され、矢印キーでめくれます。'],
    cv: ['CVの要約です。職歴、学歴、連絡先をまとめています。', 'プロジェクト名をクリックすると詳細が開きます。'],
  },

  projects: {
    cbpo: {
      context: 'ECデータ連携と物流のプラットフォーム。注文処理、Amazonマーケットプレイスのデータ、ブランド価格、配送ワークフローを扱います。',
      role: 'フルスタックエンジニア',
      contributions: [
        'GCP上のPython/DjangoとVue.jsによるスケーラブルなマイクロサービス',
        'ハイブリッドなデータ層：注文トランザクションはPostgreSQL、マーケットプレイス指標はMongoDB',
        'GCP上にDockerで構成した6台のVMのセルフホストMongoDB環境を構築',
        '1.5TB規模のMongoDBクラスタ複数をMongoDB Atlasからその環境へダウンタイムなしで移行',
        'AI支援による機能開発と、本番品質までのレビュー',
      ],
    },
    ca2t: {
      context: '管理者と受講者のロールを分けた、企業研修向けの学習管理システム。',
      role: 'フルスタックエンジニア / チームリード',
      contributions: [
        'ロールごとに専用ダッシュボードを持つ動的なロールベースのアクセス制御',
        '5人の職種横断チームをリード',
        'AIツール（Claude Code）を導入して開発を加速',
        'ReactとTailwindによる高速でインタラクティブなUI',
      ],
    },
    theavotree: {
      context: 'WordPress/WooCommerceとJavaScriptの管理システムをつなぐ大規模ECプラットフォーム。',
      role: 'フルスタックエンジニア',
      contributions: [
        'NestJSのAPIとReactの管理ダッシュボードによるフルスタックのWooCommerce連携',
        'WooCommerceのデータ構造を反映した高性能なMongoDBスキーマ',
        '1日数千件のイベントをデータ損失なしで処理するリアルタイムWebhookリスナー',
        'コアビジネスロジックのユニットテストと結合テスト',
      ],
    },
    singlekey: {
      context: '家主と入居者の賃貸手続きをシンプルにする不動産管理プラットフォーム。',
      role: 'フルスタックエンジニア',
      contributions: [
        'Next.jsとTypeScriptによるコンバージョンの高いランディングページ',
        '新機能の開発時間を30%短縮した再利用可能なReactコンポーネントライブラリ',
        '登録数を伸ばしたVWOでのA/Bテスト',
        'プロダクト要件を技術仕様に落とし込み',
      ],
    },
    suzu: {
      context: 'クリエイター、アーティストとそのファンのためのコミュニティ型SNS。',
      role: 'フルスタックエンジニア',
      contributions: [
        'Next.jsとSupabaseで構築したSNS',
        'WebSocket上のSupabase Realtimeによるインスタントメッセージ（遅延40%削減）',
        'PostgreSQL関数による「Smart Feed」のランキング',
        'Core Web Vitalsを「Good」に改善し、平均セッション時間が15%増加',
        'Vercel上の自動CI/CDパイプラインでデプロイ時間を50%短縮',
      ],
    },
    'ikara-admin': {
      context: 'InmobiVNのカラオケアプリiKaraを支える、管理とアプリ内経済のシステム。',
      role: 'フルスタックエンジニア',
      contributions: [
        '1万人以上のユーザーのデータを取引の完全性100%で管理するJava ServletとReactのCMS',
        '仮想ストア、アイテム、価格検証フローの管理',
        '仮想通貨の消費を含む社内レポートツール',
        'AndroidとiOSでストアのアイテムを同期するREST API',
        'Jenkinsによるビルドとデプロイのパイプライン',
      ],
    },
    yokara: {
      context: '歌う、録音する、シェアするための、InmobiVNの音楽SNS・カラオケアプリ。',
      role: 'フルスタックエンジニア',
      contributions: [
        'JWTで保護したExpressとFirebase FunctionsのREST API',
        '財務精度100%の仮想通貨・アプリ内課金バックエンド',
        '高負荷のリアルタイムミニゲーム向けにMongoDBクエリを最適化',
        'FlutterとSwiftのモバイルアプリと同等の機能を実装',
      ],
    },
  },

  cv: {
    school: 'ズイタン大学（Duy Tan University）',
    major: 'ソフトウェア技術 理学士',
    languages: ['ベトナム語：ネイティブ', '英語：業務で使えるレベル（TOEIC 695/990）'],
  },

  ui: {
    skipToDialogue: '会話へ移動',
    language: '言語',
    sound: 'サウンド',
    soundOn: 'オン',
    soundOff: 'オフ',
    details: '詳細',
    dialogue: '会話',
    choices: '選択肢',
    dialogueNav: '会話の操作',
    back: '戻る',
    home: '最初へ',
    next: '次へ',
    lineOf: (line, total) => `${total}件中${line}件目`,
    hotspots: { laptop: 'プロジェクトを見る', album: 'アルバムを開く', drawer: 'CVを開く' },
    sceneDescription:
      '夜の小さな部屋のピクセルアート。Thọは机でノートPCとフォトアルバムを前に作業しています。壁の額にはAlhazardとLangrisser、飾り棚にはGran CenturioとAlpha Legion、中段の台にAmbicion、机の上にGrey Seerがあります。ノートPC、アルバム、机の引き出しをクリックして探索できます。',
    artNotice: '仮のイラスト',
    artNoticeDetail: ' · 完成版は後日',
    portrait: '開発者の肖像（仮）',
    portraitTemp: '仮',
    status: {
      draft: '下書き · Thọの確認待ち',
      placeholder: '内容の追加待ち',
      translationDraft: '翻訳の下書き · Thọの確認待ち',
      source: (source) => `出典: ${source}`,
    },
    project: {
      context: '概要',
      role: '担当',
      contributions: '主な仕事',
      technologies: '技術',
      noContext: 'CVにこのプロジェクトの概要はありません。',
      reviewNote: '出典：CV。CVに概要がない場合は製品の公開ページも参照しています。',
    },
    cv: {
      openPdf: 'CVを開く（PDF）',
      notAdded: 'CVはまだありません',
      checking: '確認中…',
      sections: 'CVの項目',
      experience: '職歴',
      education: '学歴',
      contact: '連絡先',
      languages: '語学',
      gpa: (value) => `GPA ${value}`,
      notProvided: '未登録',
      contactLabels: { email: 'メール', github: 'GitHub', linkedin: 'LinkedIn' },
    },
    gallery: {
      eyebrow: 'ギャラリー',
      title: 'ピクセルアートのアルバム',
      open: (title) => `「${title}」を開く`,
      noPictures: 'まだ画像がありません',
      placeholderNote: '仮：Thọがpublic/gallery/にピクセルアートを追加する予定です。',
      prev: '前へ',
      next: '次へ',
      close: '閉じる',
    },
  },
}
