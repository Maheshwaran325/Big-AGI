/**
 * Application Identity (Brand)
 *
 * Also note that the 'Brand' is used in the following places:
 *  - README.md               all over
 *  - package.json            app-slug and version
 *  - [public/manifest.json]  name, short_name, description, theme_color, background_color
 */
export const Brand = {
  Title: {
    Base: 'Sprochatai',
    Common: (process.env.NODE_ENV === 'development' ? '[DEV] ' : '') + 'Sprochatai',
  },
  Meta: {
    Description: 'Sprochatai from Statix.pro offers complete control over your data and AI models, unlocking advanced features, personalized AI interactions, and AI personas. Experience a revolutionary interface designed to inspire innovation and redefine your AI marketing experience.',
    SiteName: 'Sprochatai | AI for Marketing with Personas',
    ThemeColor: '#0d2137',
    InstagramInvite: 'https://www.instagram.com/statix_pro',
  },
  URIs: {
    Home: 'https://statix.pro',
    // App: 'https://statix.pro',
    CardImage: 'http://statix.pro/wp-content/uploads/2024/02/sprochat-logo-new.png',
    OpenRepo: 'https://github.com/enricoros/big-agi',
    OpenProject: 'https://github.com/users/enricoros/projects/4',
    SupportInvite: 'https://discord.gg/MkH4qj2Jp9',
    InstagramInvite: 'https://www.instagram.com/statix_pro',
    WhatsappInvite: 'https://wa.me/9361091908',
    // Twitter: 'https://www.twitter.com/enricoros',
    // PrivacyPolicy: 'https://big-agi.com/privacy',
  },
};