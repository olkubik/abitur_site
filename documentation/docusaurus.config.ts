import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Документация проекта Герцен. Абитуриентам',
  tagline: 'BRD, SRS, архитектура, API и проектная документация сайта',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://example.com',
  baseUrl: '/',
  organizationName: 'herzen-coursework',
  projectName: 'applicants-docs',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'ru',
    locales: ['ru'],
  },

  markdown: {
    mermaid: true,
  },

  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Герцен. Абитуриентам',
      logo: {
        alt: 'Документация проекта',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'projectSidebar',
          position: 'left',
          label: 'Документация',
        },
        {
          href: 'pathname:///files/openapi.yaml',
          label: 'OpenAPI',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Разделы',
          items: [
            {label: 'План проекта', to: '/docs/project-plan'},
            {label: 'Пользователи', to: '/docs/users'},
            {label: 'Архитектура', to: '/docs/architecture'},
          ],
        },
        {
          title: 'Артефакты',
          items: [
            {label: 'API', to: '/docs/api'},
            {label: 'База данных', to: '/docs/database'},
            {label: 'UML', to: '/docs/diagrams'},
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Курсовой проект «Герцен. Абитуриентам».`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
