import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'MFE Forge',
  description: 'Production-ready Micro Frontend framework',
  base: '/mfe-forge/',

  themeConfig: {
    nav: [
      { text: 'Guide', link: '/getting-started' },
      { text: 'CLI', link: '/cli' },
      { text: 'API', link: '/architecture' }
    ],

    sidebar: {
      '/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/getting-started' },
            { text: 'Installation', link: '/installation' },
            { text: 'Quick Start', link: '/quick-start' }
          ]
        },
        {
          text: 'CLI Reference',
          items: [
            { text: 'Commands', link: '/cli' },
            { text: 'Configuration', link: '/config' }
          ]
        },
        {
          text: 'Architecture',
          items: [
            { text: 'Overview', link: '/architecture' },
            { text: 'Design System', link: '/design-system' },
            { text: 'Testing', link: '/testing' }
          ]
        },
        {
          text: 'Advanced',
          items: [
            { text: 'Publishing', link: '/publishing' },
            { text: 'Migration', link: '/migration' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/D-Rayno/mfe-forge' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026 MFE Forge Contributors'
    }
  }
})
