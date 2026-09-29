import React, { createContext, useContext, useState, useEffect } from 'react';

export type SupportedLanguage = 'en' | 'ur' | 'ko' | 'ja' | 'es' | 'ar';

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  direction: 'ltr' | 'rtl';
  region: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English (US)',
    flag: '🇺🇸',
    direction: 'ltr',
    region: 'Global / United States'
  },
  {
    code: 'ur',
    name: 'Urdu',
    nativeName: 'اردو (پاکستان)',
    flag: '🇵🇰',
    direction: 'rtl',
    region: 'Pakistan / South Asia'
  },
  {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어 (대한민국)',
    flag: '🇰🇷',
    direction: 'ltr',
    region: 'South Korea'
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    direction: 'ltr',
    region: 'Japan'
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    direction: 'ltr',
    region: 'Spain / Latin America'
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    direction: 'rtl',
    region: 'Middle East'
  }
];

const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    // Navigation
    'nav.explore': 'Explore',
    'nav.categories': 'Categories',
    'nav.characters': 'Characters',
    'nav.multimedia': 'Cinema & Media',
    'nav.articles': 'Articles & Lore',
    'nav.events': 'Events & Cons',
    'nav.merchandise': 'Merchandise',
    'nav.upcoming': 'Upcoming Releases',
    'nav.submissions': 'Fan Submissions',
    'nav.more': 'More',
    'nav.search': 'Search...',
    'nav.bookmarks': 'Bookmarks',
    'nav.login': 'Log In',
    'nav.join': 'Join Universe',
    'nav.dashboard': 'Fan Dashboard',
    'nav.profile': 'Edit Profile',
    'nav.admin': 'Admin Dashboard',
    'nav.signout': 'Sign Out',
    'nav.settings': 'Settings & Language',
    'nav.feedback': 'Submit Feedback',
    'nav.sitemap': 'Platform Sitemap',

    // Hero
    'hero.badge': 'THE DEFINITIVE FANDOM PORTAL',
    'hero.title1': 'YOUR UNIVERSE.',
    'hero.title2': 'YOUR FANDOM.',
    'hero.subtitle': 'Step into an expansive entertainment cosmos spanning Anime, Blockbuster Cinema, AAA Gaming, Prestige TV, Comics, Manga, and Cosplay.',
    'hero.exploreBtn': 'Explore Multiverse',
    'hero.trailerBtn': 'Watch Cinema Trailers',
    'hero.statRealms': 'Fandom Realms',
    'hero.statMedia': '4K Media & Lore',
    'hero.statCommunity': 'Active Fans',
    'hero.statRank': 'IMAX & UHD Quality',

    // Features
    'battle.title': 'Multiverse Battle Arena',
    'battle.badge': 'LIVE FAN SHOWDOWN',
    'battle.subtitle': 'Vote for the ultimate multiverse champion and witness live telemetry percentage shifts.',
    'battle.castVote': 'Cast Vote',
    'battle.voted': 'Your Champion',
    'trivia.title': 'Multiverse Knowledge Trial',
    'trivia.badge': 'DAILY ARCHIVIST LORE TRIAL',
    'cinema.spotlight': 'Cinema & Media Spotlight',
    'characters.trending': 'Legendary Characters',

    // Settings Modal
    'settings.title': 'Platform Settings',
    'settings.subtitle': 'Customize your language, interface scale, audio, and visual preferences.',
    'settings.languageTab': 'Language & Region',
    'settings.displayTab': 'Display & Theme',
    'settings.audioTab': 'Audio & FX',
    'settings.selectLang': 'Select Interface Language',
    'settings.langDesc': 'All navigation, buttons, badges, and headers will instantly update in your selected language.',
    'settings.themeMode': 'Visual Theme',
    'settings.themeDark': 'Dark Cosmos',
    'settings.themeLight': 'Light Daylight',
    'settings.fontSize': 'Text Size',
    'settings.sizeNormal': 'Normal (100%)',
    'settings.sizeLarge': 'Comfortable (115%)',
    'settings.sizeCompact': 'Compact (90%)',
    'settings.soundEffects': 'Ambient Multiverse Soundtrack',
    'settings.save': 'Save & Close',
    'settings.active': 'Active'
  },

  ur: {
    // Navigation
    'nav.explore': 'دریافت کریں',
    'nav.categories': 'اقسام و شعبے',
    'nav.characters': 'کردار و ہیروز',
    'nav.multimedia': 'سنیما اور میڈیا',
    'nav.articles': 'مضامین اور تاریخ',
    'nav.events': 'تقریبات اور کنونشنز',
    'nav.merchandise': 'سامان اور مجسمے',
    'nav.upcoming': 'آنے والی ریلیزز',
    'nav.submissions': 'مداحوں کی تخلیقات',
    'nav.more': 'مزید',
    'nav.search': 'تلاش کریں...',
    'nav.bookmarks': 'محفوظ شدہ',
    'nav.login': 'لاگ ان',
    'nav.join': 'کائنات میں شامل ہوں',
    'nav.dashboard': 'فین ڈیش بورڈ',
    'nav.profile': 'پروفائل میں ترمیم',
    'nav.admin': 'ایڈمن ڈیش بورڈ',
    'nav.signout': 'سائن آؤٹ',
    'nav.settings': 'ترتیبات اور زبان',
    'nav.feedback': 'رائے دیں',
    'nav.sitemap': 'سائٹ میپ',

    // Hero
    'hero.badge': 'حتمی پاپ کلچر فینڈم پورٹل',
    'hero.title1': 'آپ کی کائنات۔',
    'hero.title2': 'آپ کا جنون۔',
    'hero.subtitle': 'اینیمی، بلاک بسٹر سنیما، ٹرپل اے گیمنگ، ٹی وی شوز، کامکس اور کاس پلے کی وسیع و عریض کائنات میں قدم رکھیں۔',
    'hero.exploreBtn': 'ملٹیورس دریافت کریں',
    'hero.trailerBtn': 'سنیما ٹریلرز دیکھیں',
    'hero.statRealms': 'فینڈم شعبے',
    'hero.statMedia': '4K میڈیا اور کہانیاں',
    'hero.statCommunity': 'سرگرم مداح',
    'hero.statRank': 'آئی میکس و الٹرا ایچ ڈی',

    // Features
    'battle.title': 'ملٹیورس بیٹل ارینا',
    'battle.badge': 'براہِ راست فین دنگل',
    'battle.subtitle': 'اینیمی، گیمنگ اور سنیما کے چیمپئن کو اپنا ووٹ دیں اور لائیو رزلٹ دیکھیں۔',
    'battle.castVote': 'ووٹ ڈالیں',
    'battle.voted': 'آپ کا چیمپئن',
    'trivia.title': 'ملٹیورس علم کا امتحان',
    'trivia.badge': 'روزانہ آرکائیوسٹ سوال',
    'cinema.spotlight': 'سنیما اور میڈیا اسپاٹ لائٹ',
    'characters.trending': 'مشہور تاریخی کردار',

    // Settings Modal
    'settings.title': 'پلیٹ فارم ترتیبات',
    'settings.subtitle': 'اپنی زبان، ٹیکسٹ کا سائز، آڈیو اور بصری ترتیبات کو اپنی مرضی کے مطابق منتخب کریں۔',
    'settings.languageTab': 'زبان اور علاقہ',
    'settings.displayTab': 'ڈسپلے اور تھیم',
    'settings.audioTab': 'آڈیو اور ساؤنڈ',
    'settings.selectLang': 'انٹرفیس کی زبان منتخب کریں',
    'settings.langDesc': 'تمام مینو لنکس، بٹنز اور سرخیاں فوری طور پر آپ کی منتخب کردہ زبان میں تبدیل ہو جائیں گی۔',
    'settings.themeMode': 'بصری تھیم',
    'settings.themeDark': 'ڈارک کاسموس (رات)',
    'settings.themeLight': 'لائٹ ڈے (دن)',
    'settings.fontSize': 'فونٹ کا سائز',
    'settings.sizeNormal': 'نارمل (100%)',
    'settings.sizeLarge': 'بڑا و واضح (115%)',
    'settings.sizeCompact': 'چھوٹا (90%)',
    'settings.soundEffects': 'سینمیٹک بیک گراؤنڈ میوزک',
    'settings.save': 'محفوظ کریں اور بند کریں',
    'settings.active': 'فعال'
  },

  ko: {
    // Navigation
    'nav.explore': '탐색',
    'nav.categories': '카테고리',
    'nav.characters': '캐릭터',
    'nav.multimedia': '시네마 및 미디어',
    'nav.articles': '기사 및 세계관 로어',
    'nav.events': '이벤트 및 콘서트',
    'nav.merchandise': '공식 굿즈',
    'nav.upcoming': '출시 예정작',
    'nav.submissions': '팬 창작물',
    'nav.more': '더보기',
    'nav.search': '검색...',
    'nav.bookmarks': '북마크',
    'nav.login': '로그인',
    'nav.join': '유니버스 가입',
    'nav.dashboard': '팬 대시보드',
    'nav.profile': '프로필 편집',
    'nav.admin': '관리자 대시보드',
    'nav.signout': '로그아웃',
    'nav.settings': '설정 및 언어',
    'nav.feedback': '피드백 제출',
    'nav.sitemap': '사이트맵',

    // Hero
    'hero.badge': '궁극의 팝 컬처 팬덤 포털',
    'hero.title1': '당신의 유니버스.',
    'hero.title2': '당신의 팬덤.',
    'hero.subtitle': '애니메이션, 블록버스터 영화, AAA 게임, 명작 드라마, 코믹스 및 코스프레를 아우르는 방대한 엔터테인먼트 세계로 뛰어드세요.',
    'hero.exploreBtn': '멀티버스 탐색하기',
    'hero.trailerBtn': '4K 트레일러 감상',
    'hero.statRealms': '팬덤 영역',
    'hero.statMedia': '4K 미디어 & 로어',
    'hero.statCommunity': '활성 팬 커뮤니티',
    'hero.statRank': 'IMAX & UHD 품질',

    // Features
    'battle.title': '멀티버스 배틀 아레나',
    'battle.badge': '실시간 팬 투표 대결',
    'battle.subtitle': '애니메이션, 게임, 시네마 최고의 챔피언에게 투표하고 실시간 지지율 변화를 확인하세요.',
    'battle.castVote': '투표하기',
    'battle.voted': '나의 챔피언',
    'trivia.title': '멀티버스 지식 챌린지',
    'trivia.badge': '일일 아카이비스트 퀴즈',
    'cinema.spotlight': '시네마 & 미디어 스포트라이트',
    'characters.trending': '전설적인 캐릭터',

    // Settings Modal
    'settings.title': '플랫폼 환경 설정',
    'settings.subtitle': '언어, 글꼴 크기, 테마 및 사운드 환경을 취향에 맞게 설정하세요.',
    'settings.languageTab': '언어 및 지역',
    'settings.displayTab': '디스플레이 및 테마',
    'settings.audioTab': '오디오 효과',
    'settings.selectLang': '인터페이스 언어 선택',
    'settings.langDesc': '모든 메뉴, 버튼, 배지 및 헤더가 선택한 언어로 즉시 동기화됩니다.',
    'settings.themeMode': '비주얼 테마',
    'settings.themeDark': '다크 코스모스 (Dark)',
    'settings.themeLight': '라이트 데이라이트 (Light)',
    'settings.fontSize': '글꼴 크기',
    'settings.sizeNormal': '기본 (100%)',
    'settings.sizeLarge': '크게 (115%)',
    'settings.sizeCompact': '컴팩트 (90%)',
    'settings.soundEffects': '시네마틱 배경 음악 자동 재생',
    'settings.save': '저장 및 닫기',
    'settings.active': '선택됨'
  },

  ja: {
    // Navigation
    'nav.explore': '探索',
    'nav.categories': 'カテゴリー',
    'nav.characters': 'キャラクター',
    'nav.multimedia': 'シネマ＆メディア',
    'nav.articles': '記事・世界観',
    'nav.events': 'イベント＆フェス',
    'nav.merchandise': '公式グッズ',
    'nav.upcoming': '公開・発売予定',
    'nav.submissions': 'ファン投稿',
    'nav.more': 'もっと見る',
    'nav.search': '検索...',
    'nav.bookmarks': 'ブックマーク',
    'nav.login': 'ログイン',
    'nav.join': '宇宙に参加する',
    'nav.dashboard': 'ファン ダッシュボード',
    'nav.profile': 'プロフィール編集',
    'nav.admin': '管理者ダッシュボード',
    'nav.signout': 'ログアウト',
    'nav.settings': '設定と言語',
    'nav.feedback': 'フィードバック',
    'nav.sitemap': 'サイトマップ',

    // Hero
    'hero.badge': '究極のポップカルチャー・ファンダムポータル',
    'hero.title1': 'あなたの宇宙。',
    'hero.title2': 'あなたの情熱。',
    'hero.subtitle': 'アニメ、映画、AAAゲーム、ドラマ、コミック、コスプレまで広がる広大なエンタメの世界へ。',
    'hero.exploreBtn': 'マルチバースを探索',
    'hero.trailerBtn': '予告編を見る',
    'hero.statRealms': 'レルム領域',
    'hero.statMedia': '4Kメディア・伝承',
    'hero.statCommunity': 'アクティブファン',
    'hero.statRank': 'IMAX & UHD品質',

    // Features
    'battle.title': 'マルチバース バトルアリーナ',
    'battle.badge': 'リアルタイム ファン投票',
    'battle.subtitle': 'アニメ、ゲーム、シネマの最強チャンピオンに投票しましょう。',
    'battle.castVote': '投票する',
    'battle.voted': 'あなたのチャンピオン',
    'trivia.title': '知識の試練',
    'trivia.badge': '毎日のクイズ',
    'cinema.spotlight': 'シネマ スポットライト',
    'characters.trending': '伝説のキャラクター',

    // Settings Modal
    'settings.title': 'プラットフォーム設定',
    'settings.subtitle': '言語、フォントサイズ、テーマ、サウンドをカスタマイズします。',
    'settings.languageTab': '言語と地域',
    'settings.displayTab': '表示とテーマ',
    'settings.audioTab': 'オーディオ',
    'settings.selectLang': '表示言語の選択',
    'settings.langDesc': 'すべてのナビゲーションとヘッダーが選択した言語に即座に切り替わります。',
    'settings.themeMode': '外観テーマ',
    'settings.themeDark': 'ダーク コスモス',
    'settings.themeLight': 'ライト デイ',
    'settings.fontSize': '文字サイズ',
    'settings.sizeNormal': '標準 (100%)',
    'settings.sizeLarge': '拡大 (115%)',
    'settings.sizeCompact': 'コンパクト (90%)',
    'settings.soundEffects': 'BGMサウンドトラック',
    'settings.save': '保存して閉じる',
    'settings.active': '選択中'
  },

  es: {
    // Navigation
    'nav.explore': 'Explorar',
    'nav.categories': 'Categorías',
    'nav.characters': 'Personajes',
    'nav.multimedia': 'Cine y Medios',
    'nav.articles': 'Artículos y Lore',
    'nav.events': 'Eventos y Convenciones',
    'nav.merchandise': 'Mercancía',
    'nav.upcoming': 'Próximos Estrenos',
    'nav.submissions': 'Envíos de Fans',
    'nav.more': 'Más',
    'nav.search': 'Buscar...',
    'nav.bookmarks': 'Favoritos',
    'nav.login': 'Iniciar Sesión',
    'nav.join': 'Unirse al Universo',
    'nav.dashboard': 'Panel de Fan',
    'nav.profile': 'Editar Perfil',
    'nav.admin': 'Panel de Administrador',
    'nav.signout': 'Cerrar Sesión',
    'nav.settings': 'Configuración e Idioma',
    'nav.feedback': 'Enviar Comentarios',
    'nav.sitemap': 'Mapa del Sitio',

    // Hero
    'hero.badge': 'EL PORTAL DEFINITIVO DE FANDOM',
    'hero.title1': 'TU UNIVERSO.',
    'hero.title2': 'TU PASIÓN.',
    'hero.subtitle': 'Adéntrate en un cosmos de entretenimiento que abarca Anime, Cine Taquillero, Videojuegos AAA, Series, Cómics y Cosplay.',
    'hero.exploreBtn': 'Explorar Multiverso',
    'hero.trailerBtn': 'Ver Tráilers de Cine',
    'hero.statRealms': 'Reinos de Fandom',
    'hero.statMedia': 'Medios 4K y Lore',
    'hero.statCommunity': 'Fans Activos',
    'hero.statRank': 'Calidad IMAX y UHD',

    // Features
    'battle.title': 'Arena de Batalla del Multiverso',
    'battle.badge': 'ENFRENTAMIENTO EN VIVO',
    'battle.subtitle': 'Vota por el campeón definitivo en Anime, Videojuegos y Cine.',
    'battle.castVote': 'Votar',
    'battle.voted': 'Tu Campeón',
    'trivia.title': 'Prueba de Conocimiento',
    'trivia.badge': 'DESAFÍO DIARIO DE LORE',
    'cinema.spotlight': 'Destacados de Cine y Medios',
    'characters.trending': 'Personajes Legendarios',

    // Settings Modal
    'settings.title': 'Configuración de la Plataforma',
    'settings.subtitle': 'Personaliza tu idioma, escala de texto, audio y preferencias visuales.',
    'settings.languageTab': 'Idioma y Región',
    'settings.displayTab': 'Pantalla y Tema',
    'settings.audioTab': 'Audio y Efectos',
    'settings.selectLang': 'Seleccionar Idioma de Interfaz',
    'settings.langDesc': 'Toda la navegación, botones y encabezados se actualizarán al instante.',
    'settings.themeMode': 'Tema Visual',
    'settings.themeDark': 'Cosmos Oscuro',
    'settings.themeLight': 'Luz de Día',
    'settings.fontSize': 'Tamaño de Texto',
    'settings.sizeNormal': 'Normal (100%)',
    'settings.sizeLarge': 'Cómodo (115%)',
    'settings.sizeCompact': 'Compacto (90%)',
    'settings.soundEffects': 'Banda Sonora Ambiental',
    'settings.save': 'Guardar y Cerrar',
    'settings.active': 'Activo'
  },

  ar: {
    // Navigation
    'nav.explore': 'استكشف',
    'nav.categories': 'الفئات',
    'nav.characters': 'الشخصيات',
    'nav.multimedia': 'السينما والوسائط',
    'nav.articles': 'المقالات والتاريخ',
    'nav.events': 'الفعاليات',
    'nav.merchandise': 'البضائع والتماثيل',
    'nav.upcoming': 'الإصدارات القادمة',
    'nav.submissions': 'مشاركات المعجبين',
    'nav.more': 'المزيد',
    'nav.search': 'بحث...',
    'nav.bookmarks': 'الإشارات المرجعية',
    'nav.login': 'تسجيل الدخول',
    'nav.join': 'انضم إلى الكون',
    'nav.dashboard': 'لوحة المعجب',
    'nav.profile': 'تعديل الملف الشخصي',
    'nav.admin': 'لوحة الإدارة',
    'nav.signout': 'تسجيل الخروج',
    'nav.settings': 'الإعدادات واللغة',
    'nav.feedback': 'إرسال ملاحظات',
    'nav.sitemap': 'خريطة الموقع',

    // Hero
    'hero.badge': 'البوابة الشاملة لعشاق الفنون والترفيه',
    'hero.title1': 'كونك الخاص.',
    'hero.title2': 'شغفك الدائم.',
    'hero.subtitle': 'انغمس في عالم ترفيهي واسع يمتد عبر الأنمي، السينما العالمية، ألعاب الفيديو، المسلسلات، والقصص المصورة.',
    'hero.exploreBtn': 'استكشف العوالم المتعددة',
    'hero.trailerBtn': 'شاهد العروض الدعائية',
    'hero.statRealms': 'عوالم الفاندوم',
    'hero.statMedia': 'وسائط 4K وتاريخ',
    'hero.statCommunity': 'معجبون متفاعلون',
    'hero.statRank': 'جودة IMAX فائقة',

    // Features
    'battle.title': 'حلبة الصراع الكوني',
    'battle.badge': 'مواجهة مباشرة',
    'battle.subtitle': 'صوت لبطلك المفضل وشاهد النسب المئوية المباشرة.',
    'battle.castVote': 'صوت الآن',
    'battle.voted': 'بطلك المختار',
    'trivia.title': 'اختبار المعرفة الكونية',
    'trivia.badge': 'تحدي الأرشيف اليومي',
    'cinema.spotlight': 'أبرز أفلام السينما',
    'characters.trending': 'الشخصيات الأسطورية',

    // Settings Modal
    'settings.title': 'إعدادات المنصة',
    'settings.subtitle': 'خصص لغتك، حجم الخط، والسمة البصرية حسب تفضيلاتك.',
    'settings.languageTab': 'اللغة والمنطقة',
    'settings.displayTab': 'المظهر والسمة',
    'settings.audioTab': 'المؤثرات الصوتية',
    'settings.selectLang': 'اختر لغة الواجهة',
    'settings.langDesc': 'سيتم تحديث كافة القوائم والأزرار فوراً باللغة المختارة.',
    'settings.themeMode': 'السمة البصرية',
    'settings.themeDark': 'الكون المظلم (داكن)',
    'settings.themeLight': 'ضوء النهار (فاتح)',
    'settings.fontSize': 'حجم الخط',
    'settings.sizeNormal': 'عادي (100%)',
    'settings.sizeLarge': 'مريح (115%)',
    'settings.sizeCompact': 'مدمج (90%)',
    'settings.soundEffects': 'الموسيقى التصويرية التفاعلية',
    'settings.save': 'حفظ وإغلاق',
    'settings.active': 'مفعل'
  }
};

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  direction: 'ltr' | 'rtl';
  t: (key: string, fallback?: string) => string;
  isSettingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    return (localStorage.getItem('fanhub_language') as SupportedLanguage) || 'en';
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const currentLangInfo = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];
  const direction = currentLangInfo.direction;

  useEffect(() => {
    localStorage.setItem('fanhub_language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = direction;

    if (language === 'ur') {
      document.documentElement.classList.add('font-urdu');
      document.documentElement.classList.remove('font-korean');
    } else if (language === 'ko') {
      document.documentElement.classList.add('font-korean');
      document.documentElement.classList.remove('font-urdu');
    } else {
      document.documentElement.classList.remove('font-urdu', 'font-korean');
    }
  }, [language, direction]);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
  };

  const t = (key: string, fallback?: string): string => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    if (langDict[key]) return langDict[key];
    const enDict = TRANSLATIONS.en;
    if (enDict[key]) return enDict[key];
    return fallback || key;
  };

  const openSettings = () => setIsSettingsOpen(true);
  const closeSettings = () => setIsSettingsOpen(false);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        direction,
        t,
        isSettingsOpen,
        openSettings,
        closeSettings
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
