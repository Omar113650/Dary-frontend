export type Locale = 'ar' | 'en';

export type Direction = 'rtl' | 'ltr';

export interface TranslationStrings {
  // Navigation
  nav_home: string;
  nav_properties: string;
  nav_about: string;
  nav_login: string;
  nav_register: string;
  site_name: string;

  // Page titles
  page_home_title: string;
  page_properties_title: string;
  page_property_details_title: string;
  page_about_title: string;

  // About Page
  about_hero_title: string;
  about_hero_subtitle: string;
  about_purpose_tagline: string;
  about_purpose_title: string;
  about_mission_label: string;
  about_mission_title: string;
  about_mission_desc: string;
  about_vision_label: string;
  about_vision_title: string;
  about_vision_desc: string;

  // Hero
  hero_kicker: string;
  hero_headline: string;
  hero_subtitle: string;

  // Search
  search_location: string;
  search_type: string;
  search_price: string;
  search_button: string;
  search_all_locations: string;
  search_all_types: string;
  search_all_prices: string;

  // Trust Features
  trust_tagline: string;
  trust_heading: string;
  trust_easiest: string;
  trust_easiest_desc: string;
  trust_direct: string;
  trust_direct_desc: string;
  trust_trusted: string;
  trust_trusted_desc: string;

  // Featured Properties
  featured_tagline: string;
  featured_title: string;
  featured_view: string;

  // How It Works
  how_tagline: string;
  how_title: string;
  how_step1: string;
  how_step1_desc: string;
  how_step2: string;
  how_step2_desc: string;
  how_step3: string;
  how_step3_desc: string;

  // Why DARY
  why_tagline: string;
  why_title: string;
  why_direct: string;
  why_direct_desc: string;
  why_time: string;
  why_time_desc: string;
  why_cost: string;
  why_cost_desc: string;
  why_transparent: string;
  why_transparent_desc: string;

  // CTA
  cta_eyebrow: string;
  cta_title: string;
  cta_desc: string;
  cta_button: string;

  // Footer
  footer_desc: string;
  footer_links_title: string;
  footer_language_title: string;
  footer_social_title: string;
  footer_copyright: string;

  // Property details
  per_month: string;
  bedrooms_label: string;
  bathrooms_label: string;

  // Properties Page
  properties_subtitle: string;
  properties_filter_all: string;
  properties_filter_bedrooms: string;
  properties_filter_search_placeholder: string;
  properties_filter_location: string;
  properties_filter_type: string;
  properties_filter_price: string;
  properties_sort_by: string;
  properties_sort_recommended: string;
  properties_sort_price_asc: string;
  properties_sort_price_desc: string;
  properties_results_count: string;
  properties_reset_filters: string;
  properties_empty_title: string;
  properties_empty_desc: string;
  properties_error_title: string;
  properties_error_desc: string;
  properties_error_retry: string;
  properties_mobile_filters_btn: string;
  properties_mobile_close: string;
  properties_apply_filters: string;
  properties_bedrooms_any: string;
  properties_bedrooms_1: string;
  properties_bedrooms_2: string;
  properties_bedrooms_3plus: string;

  // Auth
  auth_login_eyebrow: string;
  auth_login_title: string;
  auth_login_subtitle: string;
  auth_register_eyebrow: string;
  auth_register_title: string;
  auth_register_subtitle: string;
  auth_name_label: string;
  auth_name_placeholder: string;
  auth_email_label: string;
  auth_email_placeholder: string;
  auth_password_label: string;
  auth_password_placeholder: string;
  auth_confirm_password_label: string;
  auth_confirm_password_placeholder: string;
  auth_remember_me: string;
  auth_forgot_password: string;
  auth_login_button: string;
  auth_register_button: string;
  auth_divider_or: string;
  auth_google_login: string;
  auth_google_register: string;
  auth_no_account: string;
  auth_create_account_link: string;
  auth_have_account: string;
  auth_login_link: string;
  auth_brand_badge: string;
  auth_brand_tagline: string;
  auth_brand_feature1: string;
  auth_brand_feature2: string;
  auth_brand_feature3: string;
  auth_back_home: string;
}

export const translations: Record<Locale, TranslationStrings> = {
  ar: {
    nav_home: 'الرئيسية',
    nav_properties: 'العقارات',
    nav_about: 'عن داري',
    nav_login: 'تسجيل الدخول',
    nav_register: 'إنشاء حساب',
    site_name: 'داري',

    page_home_title: 'الرئيسية',
    page_properties_title: 'العقارات',
    page_property_details_title: 'تفاصيل العقار',
    page_about_title: 'عن داري',

    // About Page
    about_hero_title: 'عن داري',
    about_hero_subtitle: 'نعمل على تبسيط تجربة السكن الطلابي وربط الطلاب بالسكن المناسب بطريقة أوضح وأسهل.',
    about_purpose_tagline: 'رؤيتنا ورسالتنا',
    about_purpose_title: 'نبني تجربة سكن طلابي استثنائية',
    about_mission_label: 'رسالتنا',
    about_mission_title: 'تسهيل تجربة السكن الطلابي',
    about_mission_desc: 'تسهيل تجربة السكن الطلابي من خلال منصة موثوقة تربطهم مباشرة بأصحاب الشقق، وتوفر وقتهم وتقلل التكاليف وتضمن تجربة حجز آمنة وشفافة بدون وسطاء.',
    about_vision_label: 'رؤيتنا',
    about_vision_title: 'المنصة الأكثر ثقة للمغتربين',
    about_vision_desc: 'أن نكون المنصة الأكثر ثقة التي تحل مشاكل السكن للمغتربين.',

    hero_kicker: '',
    hero_headline: 'بنو ّصلك للي يناسبك',
    hero_subtitle: '',

    search_location: 'الموقع',
    search_type: 'نوع العقار',
    search_price: 'السعر',
    search_button: 'البحث',
    search_all_locations: 'جميع المواقع',
    search_all_types: 'جميع الأنواع',
    search_all_prices: 'جميع الأسعار',

    trust_tagline: 'قيمنا الأساسية',
    trust_heading: 'تجربة سكن طلابي مصممة لراحتك',
    trust_easiest: 'أسهل',
    trust_easiest_desc: 'البحث عن السكن المناسب من خلال تجربة بسيطة وواضحة.',
    trust_direct: 'مباشر',
    trust_direct_desc: 'تواصل مباشرة مع أصحاب الشقق بدون وسطاء.',
    trust_trusted: 'موثوق',
    trust_trusted_desc: 'تجربة سكن موثوقة وشفافة مصممة خصيصاً للطلاب.',

    featured_tagline: 'مختارات مميزة',
    featured_title: 'عقارات مميزة للطلاب',
    featured_view: 'عرض التفاصيل',

    how_tagline: 'خطوات بسيطة',
    how_title: 'كيف يعمل داري',
    how_step1: 'إبحث',
    how_step1_desc: 'تصفح الخيارات المتاحة وقارن بين المواقع والأسعار بكل وضوح.',
    how_step2: 'تواصل',
    how_step2_desc: 'تواصل مباشرة مع المالك لطرح استفساراتك وترتيب المعاينة.',
    how_step3: 'اختر',
    how_step3_desc: 'اختر السكن الملائم لميزانيتك وقربك من جامعتك بكل ثقة.',

    why_tagline: 'ميزتنا',
    why_title: 'لماذا يختار الطلاب داري',
    why_direct: 'تواصل مباشر مع الملاك',
    why_direct_desc: 'تواصل فوري ومباشر مع أصحاب الشقق دون تدخل وسطاء أو عمولات غير مبررة.',
    why_time: 'توفير الوقت والجهد',
    why_time_desc: 'استكشف وقارن جميع خيارات السكن في منصة واحدة منظمة وسريعة.',
    why_cost: 'تقليل التكاليف الإضافية',
    why_cost_desc: 'أسعار واضحة مباشرة من المالك تمنحك الشفافية المالية دون رسوم خفية.',
    why_transparent: 'تجربة سكن شفافة',
    why_transparent_desc: 'بيانات وتفاصيل واقعية عن الغرف والخدمات لمساعدتك في اتخاذ القرار الأنسب.',

    cta_eyebrow: 'جاهز تبدأ؟',
    cta_title: 'ابدأ بالبحث عن سكنك الطلابي اليوم',
    cta_desc: 'اكتشف شقق واستوديوهات قريبة من جامعتك وتواصل مباشرة مع أصحاب العقارات.',
    cta_button: 'تصفح جميع العقارات',

    footer_desc: 'داري منصة سكن طلابي بتسهّل عليك الوصول للسكن المناسب، بمعلومات واضحة وتواصل مباشر مع المالك.',
    footer_links_title: 'روابط سريعة',
    footer_language_title: 'اللغة',
    footer_social_title: 'تابعنا',
    footer_copyright: '© 2026 داري — جميع الحقوق محفوظة.',

    per_month: '/شهر',
    bedrooms_label: 'غرف',
    bathrooms_label: 'حمامات',

    // Properties Page
    properties_subtitle: 'اكتشف السكن المناسب لك بالقرب من جامعتك.',
    properties_filter_all: 'الكل',
    properties_filter_bedrooms: 'عدد الغرف',
    properties_filter_search_placeholder: 'ابحث بالاسم، المدينة، أو الجامعة...',
    properties_filter_location: 'الموقع',
    properties_filter_type: 'نوع السكن',
    properties_filter_price: 'الميزانية',
    properties_sort_by: 'ترتيب حسب',
    properties_sort_recommended: 'الموصى بها',
    properties_sort_price_asc: 'السعر: من الأقل للأعلى',
    properties_sort_price_desc: 'السعر: من الأعلى للأقل',
    properties_results_count: 'عقار متوفر',
    properties_reset_filters: 'إعادة ضبط الفلاتر',
    properties_empty_title: 'لا توجد عقارات تطابق بحثك.',
    properties_empty_desc: 'جرّب تغيير خيارات البحث أو إعادة ضبط الفلاتر للوصول إلى خيارات أكثر.',
    properties_error_title: 'تعذر تحميل العقارات',
    properties_error_desc: 'تعذر الاتصال بالخادم في الوقت الحالي. يرجى التحقق من اتصالك بالإنترنت والمحاولة مجدداً.',
    properties_error_retry: 'إعادة المحاولة',
    properties_mobile_filters_btn: 'تصفية النتائج',
    properties_mobile_close: 'إغلاق',
    properties_apply_filters: 'عرض النتائج',
    properties_bedrooms_any: 'أي عدد',
    properties_bedrooms_1: 'غرفة واحدة',
    properties_bedrooms_2: 'غرفتان',
    properties_bedrooms_3plus: '3 غرف أو أكثر',

    // Auth
    auth_login_eyebrow: 'مرحبًا بعودتك',
    auth_login_title: 'تسجيل الدخول',
    auth_login_subtitle: 'سجّل دخولك للوصول إلى حسابك ومتابعة خيارات السكن المناسبة لك.',
    auth_register_eyebrow: 'ابدأ رحلتك مع داري',
    auth_register_title: 'إنشاء حساب',
    auth_register_subtitle: 'أنشئ حسابك لاستكشاف السكن المناسب لك بسهولة.',
    auth_name_label: 'الاسم الكامل',
    auth_name_placeholder: 'أحمد محمد',
    auth_email_label: 'البريد الإلكتروني',
    auth_email_placeholder: 'name@example.com',
    auth_password_label: 'كلمة المرور',
    auth_password_placeholder: '••••••••',
    auth_confirm_password_label: 'تأكيد كلمة المرور',
    auth_confirm_password_placeholder: '••••••••',
    auth_remember_me: 'تذكرني',
    auth_forgot_password: 'نسيت كلمة المرور؟',
    auth_login_button: 'تسجيل الدخول',
    auth_register_button: 'إنشاء حساب',
    auth_divider_or: 'أو',
    auth_google_login: 'المتابعة باستخدام Google',
    auth_google_register: 'التسجيل باستخدام Google',
    auth_no_account: 'ليس لديك حساب؟',
    auth_create_account_link: 'إنشاء حساب',
    auth_have_account: 'لديك حساب بالفعل؟',
    auth_login_link: 'تسجيل الدخول',
    auth_brand_badge: 'داري للسكن الطلابي',
    auth_brand_tagline: 'سكنك الطلابي الأنسب، بخطوات أوضح وأسهل',
    auth_brand_feature1: 'تواصل مباشر مع المالك',
    auth_brand_feature2: 'عقارات مناسبة لميزانيتك',
    auth_brand_feature3: 'خيارات سكنية قريبة من جامعتك',
    auth_back_home: 'العودة للرئيسية',
  },
  en: {
    nav_home: 'Home',
    nav_properties: 'Properties',
    nav_about: 'About',
    nav_login: 'Sign in',
    nav_register: 'Create account',
    site_name: 'DARY',

    page_home_title: 'Home',
    page_properties_title: 'Properties',
    page_property_details_title: 'Property Details',
    page_about_title: 'About',

    // About Page
    about_hero_title: 'About DARY',
    about_hero_subtitle: 'We make the student-housing experience simpler by connecting students with suitable homes in a clearer and easier way.',
    about_purpose_tagline: 'Our Purpose',
    about_purpose_title: 'Building an Exceptional Student Living Experience',
    about_mission_label: 'Our Mission',
    about_mission_title: 'Empowering Student Living',
    about_mission_desc: 'Facilitating the student housing experience through a reliable platform that connects them directly with apartment owners, saving them time, reducing costs, and ensuring a safe and transparent booking experience without brokers.',
    about_vision_label: 'Our Vision',
    about_vision_title: 'The Most Trusted Platform',
    about_vision_desc: 'To be the most trusted platform that solves housing problems for expatriates.',

    hero_kicker: '',
    hero_headline: 'We connect you with what suits you',
    hero_subtitle: '',

    search_location: 'Location',
    search_type: 'Property Type',
    search_price: 'Price',
    search_button: 'Search',
    search_all_locations: 'All Locations',
    search_all_types: 'All Types',
    search_all_prices: 'All Prices',

    trust_tagline: 'Core Values',
    trust_heading: 'A student housing experience designed for clarity',
    trust_easiest: 'Easiest',
    trust_easiest_desc: 'Find the right place through a simple and clear experience.',
    trust_direct: 'Direct',
    trust_direct_desc: 'Connect directly with apartment owners without intermediaries.',
    trust_trusted: 'Trusted',
    trust_trusted_desc: 'A transparent and reliable housing experience for students.',

    featured_tagline: 'Handpicked Listings',
    featured_title: 'Featured Student Housing',
    featured_view: 'View Details',

    how_tagline: 'Simple Steps',
    how_title: 'How DARY Works',
    how_step1: 'Search',
    how_step1_desc: 'Browse available listings and compare locations and rates with complete clarity.',
    how_step2: 'Connect',
    how_step2_desc: 'Reach out directly to property owners to ask questions and arrange viewings.',
    how_step3: 'Choose',
    how_step3_desc: 'Select the home that matches your budget and university commute with confidence.',

    why_tagline: 'The DARY Advantage',
    why_title: 'Why Students Choose DARY',
    why_direct: 'Direct Connection with Owners',
    why_direct_desc: 'Direct communication with apartment owners with no intermediaries or unnecessary commissions.',
    why_time: 'Save Time & Effort',
    why_time_desc: 'Discover and compare housing options in one clean, centralized platform.',
    why_cost: 'Reduce Unnecessary Costs',
    why_cost_desc: 'Transparent pricing straight from owners, free of hidden brokerage expenses.',
    why_transparent: 'Transparent Housing Experience',
    why_transparent_desc: 'Accurate room details, realistic expectations, and clear terms for confident decisions.',

    cta_eyebrow: 'Ready to start?',
    cta_title: 'Start Searching for Your Student Housing',
    cta_desc: 'Explore apartments and studios close to your campus and connect directly with owners.',
    cta_button: 'Browse All Properties',

    footer_desc: 'DARY is a student-housing platform that makes it easier to find the right place with clear information and direct contact with property owners.',
    footer_links_title: 'Quick Links',
    footer_language_title: 'Language',
    footer_social_title: 'Follow Us',
    footer_copyright: '© 2026 DARY — All rights reserved.',

    per_month: '/mo',
    bedrooms_label: 'Beds',
    bathrooms_label: 'Baths',

    // Properties Page
    properties_subtitle: 'Find the right place to stay near your university.',
    properties_filter_all: 'All',
    properties_filter_bedrooms: 'Bedrooms',
    properties_filter_search_placeholder: 'Search by name, city, or university...',
    properties_filter_location: 'Location',
    properties_filter_type: 'Property Type',
    properties_filter_price: 'Price Range',
    properties_sort_by: 'Sort by',
    properties_sort_recommended: 'Recommended',
    properties_sort_price_asc: 'Price: Low to High',
    properties_sort_price_desc: 'Price: High to Low',
    properties_results_count: 'properties available',
    properties_reset_filters: 'Reset Filters',
    properties_empty_title: 'No properties match your search.',
    properties_empty_desc: 'Try adjusting your search terms or resetting filters to see more results.',
    properties_error_title: 'Failed to load properties',
    properties_error_desc: 'Unable to connect to the server at this time. Please check your internet connection and try again.',
    properties_error_retry: 'Try Again',
    properties_mobile_filters_btn: 'Filters',
    properties_mobile_close: 'Close',
    properties_apply_filters: 'Show Results',
    properties_bedrooms_any: 'Any',
    properties_bedrooms_1: '1 Bedroom',
    properties_bedrooms_2: '2 Bedrooms',
    properties_bedrooms_3plus: '3+ Bedrooms',

    // Auth
    auth_login_eyebrow: 'Welcome back',
    auth_login_title: 'Sign in',
    auth_login_subtitle: 'Sign in to access your account and continue exploring housing options that suit you.',
    auth_register_eyebrow: 'Start your journey with DARY',
    auth_register_title: 'Create your account',
    auth_register_subtitle: 'Create your account to easily explore housing options that suit you.',
    auth_name_label: 'Full name',
    auth_name_placeholder: 'Mohamed Ahmed',
    auth_email_label: 'Email',
    auth_email_placeholder: 'name@example.com',
    auth_password_label: 'Password',
    auth_password_placeholder: '••••••••',
    auth_confirm_password_label: 'Confirm password',
    auth_confirm_password_placeholder: '••••••••',
    auth_remember_me: 'Remember me',
    auth_forgot_password: 'Forgot password?',
    auth_login_button: 'Sign in',
    auth_register_button: 'Create account',
    auth_divider_or: 'or',
    auth_google_login: 'Continue with Google',
    auth_google_register: 'Sign up with Google',
    auth_no_account: "Don't have an account?",
    auth_create_account_link: 'Create account',
    auth_have_account: 'Already have an account?',
    auth_login_link: 'Sign in',
    auth_brand_badge: 'DARY Student Living',
    auth_brand_tagline: 'The student housing that fits you, made simpler',
    auth_brand_feature1: 'Direct contact with owners',
    auth_brand_feature2: 'Homes that fit your budget',
    auth_brand_feature3: 'Housing options near your university',
    auth_back_home: 'Back to home',
  },
};

export function getDirection(locale: Locale): Direction {
  return locale === 'ar' ? 'rtl' : 'ltr';
}
