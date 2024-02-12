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
    Description: 'Launch Sprochatai to unlock the full potential of AI, with precise control over your data and models. AI personas, advanced features, and fun UX.',
    SiteName: 'Sprochatai | Precision AI for You',
    ThemeColor: '#32383E',
    TwitterSite: '',
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
    PrivacyPolicy: 'https://big-agi.com/privacy',
  },
};