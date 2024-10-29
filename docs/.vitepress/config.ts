import type { DefaultTheme } from 'vitepress'
import { defineConfig } from 'vitepress'
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import { buildEnd } from './buildEnd.config'

const ogDescription = 'Инструментарий для фронтенда нового поколения'
const ogImage = 'https://vitejs.dev/og-image.png'
const ogTitle = 'Vite'
const ogUrl = 'https://vitejs.dev'

// netlify envs
const deployURL = process.env.DEPLOY_PRIME_URL || ''
const commitRef = process.env.COMMIT_REF?.slice(0, 8) || 'dev'

const deployType = (() => {
  switch (deployURL) {
    case 'https://main--vite-docs-main.netlify.app':
      return 'main'
    case '':
      return 'local'
    default:
      return 'release'
  }
})()
const additionalTitle = ((): string => {
  switch (deployType) {
    case 'main':
      return ' (main branch)'
    case 'local':
      return ' (local)'
    case 'release':
      return ''
  }
})()
const versionLinks = ((): DefaultTheme.NavItemWithLink[] => {
  const oldVersions: DefaultTheme.NavItemWithLink[] = [
    {
      text: 'Документация Vite 4',
      link: 'https://v4.vitejs.dev',
    },
    {
      text: 'Документация Vite 3',
      link: 'https://v3.vitejs.dev',
    },
    {
      text: 'Документация Vite 2',
      link: 'https://v2.vitejs.dev',
    },
  ]

  switch (deployType) {
    case 'main':
    case 'local':
      return [
        {
          text: 'Документация Vite 5 (релиз)',
          link: 'https://vitejs.dev',
        },
        ...oldVersions,
      ]
    case 'release':
      return oldVersions
  }
})()

export default defineConfig({
  title: `Vite${additionalTitle}`,
  description: 'Инструментарий для фронтенда нового поколения',

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    [
      'link',
      { rel: 'alternate', type: 'application/rss+xml', href: '/blog.rss' },
    ],
    ['link', { rel: 'me', href: 'https://m.webtoo.ls/@vite' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: ogTitle }],
    ['meta', { property: 'og:image', content: ogImage }],
    ['meta', { property: 'og:url', content: ogUrl }],
    ['meta', { property: 'og:description', content: ogDescription }],
    ['meta', { property: 'og:site_name', content: 'vitejs' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:site', content: '@vite_js' }],
    ['meta', { name: 'theme-color', content: '#646cff' }],
    [
      'script',
      {
        src: 'https://cdn.usefathom.com/script.js',
        'data-site': 'CBDFBSLI',
        'data-spa': 'auto',
        defer: '',
      },
    ],
  ],

  locales: {
    root: { label: 'Русский' },
    en: { label: 'English', link: 'https://vitejs.dev' },
    zh: { label: '简体中文', link: 'https://cn.vitejs.dev' },
    ja: { label: '日本語', link: 'https://ja.vitejs.dev' },
    es: { label: 'Español', link: 'https://es.vitejs.dev' },
    pt: { label: 'Português', link: 'https://pt.vitejs.dev' },
    ko: { label: '한국어', link: 'https://ko.vitejs.dev' },
    de: { label: 'Deutsch', link: 'https://de.vitejs.dev' },
  },

  themeConfig: {
    logo: '/logo.svg',

    editLink: {
      pattern: 'https://github.com/vitejs/vite/edit/main/docs/:path',
      text: 'Предложить изменения',
    },

    socialLinks: [
      { icon: 'mastodon', link: 'https://elk.zone/m.webtoo.ls/@vite' },
      { icon: 'twitter', link: 'https://twitter.com/vite_js' },
      { icon: 'discord', link: 'https://chat.vitejs.dev' },
      { icon: 'github', link: 'https://github.com/vitejs/vite' },
    ],

    algolia: {
      appId: '7H67QR5P0A',
      apiKey: 'deaab78bcdfe96b599497d25acc6460e',
      indexName: 'vitejs',
      searchParameters: {
        facetFilters: ['tags:en', 'tags:ru'],
      },
      placeholder: 'Поиск в документации',
      translations: {
        button: {
          buttonText: 'Поиск',
          buttonAriaLabel: 'Поиск'
        },
        modal: {
          searchBox: {
            resetButtonTitle: 'Сбросить поиск',
            resetButtonAriaLabel: 'Сбросить поиск',
            cancelButtonText: 'Отменить поиск',
            cancelButtonAriaLabel: 'Отменить поиск'
          },
          startScreen: {
            recentSearchesTitle: 'История поиска',
            noRecentSearchesText: 'Нет истории поиска',
            saveRecentSearchButtonTitle: 'Сохранить в истории поиска',
            removeRecentSearchButtonTitle: 'Удалить из истории поиска',
            favoriteSearchesTitle: 'Избранное',
            removeFavoriteSearchButtonTitle: 'Удалить из избранного'
          },
          errorScreen: {
            titleText: 'Невозможно получить результаты',
            helpText:
              'Вам может потребоваться проверить подключение к Интернету'
          },
          footer: {
            selectText: 'выбрать',
            navigateText: 'перейти',
            closeText: 'закрыть',
            searchByText: 'поставщик поиска'
          },
          noResultsScreen: {
            noResultsText: 'Нет результатов для',
            suggestedQueryText: 'Вы можете попытаться узнать',
            reportMissingResultsText:
              'Считаете, что поиск даёт ложные результаты？',
            reportMissingResultsLinkText:
              'Нажмите на кнопку «Обратная связь»'
          }
        }
      }
    },

    carbonAds: {
      code: 'CEBIEK3N',
      placement: 'vitejsdev',
    },

    footer: {
      message: `Выпущено под лицензией MIT. (${commitRef})`,
      copyright: '© 2019 — настоящее время, Эван Ю и контрибьюторы Vite',
    },

    nav: [
      { text: 'Руководство', link: '/guide/', activeMatch: '/guide/' },
      { text: 'Конфигурация', link: '/config/', activeMatch: '/config/' },
      { text: 'Плагины', link: '/plugins/', activeMatch: '/plugins/' },
      {
        text: 'Ресурсы',
        items: [
          { text: 'Команда', link: '/team' },
          { text: 'Блог', link: '/blog' },
          { text: 'Релизы', link: '/releases' },
          {
            items: [
              {
                text: 'Mastodon',
                link: 'https://elk.zone/m.webtoo.ls/@vite',
              },
              {
                text: 'Twitter',
                link: 'https://twitter.com/vite_js',
              },
              {
                text: 'Чат Discord',
                link: 'https://chat.vitejs.dev',
              },
              {
                text: 'Awesome Vite',
                link: 'https://github.com/vitejs/awesome-vite',
              },
              {
                text: 'ViteConf',
                link: 'https://viteconf.org',
              },
              {
                text: 'DEV Community',
                link: 'https://dev.to/t/vite',
              },
              {
                text: 'Журнал изменений',
                link: 'https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md',
              },
              {
                text: 'Сотрудничество',
                link: 'https://github.com/vitejs/vite/blob/main/CONTRIBUTING.md',
              },
            ],
          },
        ],
      },
      {
        text: 'Версия',
        items: versionLinks,
      },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Руководство',
          items: [
            {
              text: 'Почему Vite',
              link: '/guide/why',
            },
            {
              text: 'Начало работы',
              link: '/guide/',
            },
            {
              text: 'Возможности',
              link: '/guide/features',
            },
            {
              text: 'Консоль',
              link: '/guide/cli',
            },
            {
              text: 'Использование плагинов',
              link: '/guide/using-plugins',
            },
            {
              text: 'Предварительное объединение зависимостей',
              link: '/guide/dep-pre-bundling',
            },
            {
              text: 'Обработка статических ресурсов',
              link: '/guide/assets',
            },
            {
              text: 'Рабочая сборка',
              link: '/guide/build',
            },
            {
              text: 'Развёртывание статического сайта',
              link: '/guide/static-deploy',
            },
            {
              text: 'Переменные окружения и режимы',
              link: '/guide/env-and-mode',
            },
            {
              text: 'Серверный рендеринг (SSR)',
              link: '/guide/ssr',
            },
            {
              text: 'Интеграция с бэкэндом',
              link: '/guide/backend-integration',
            },
            {
              text: 'Сравнения',
              link: '/guide/comparisons',
            },
            {
              text: 'Решение проблем',
              link: '/guide/troubleshooting',
            },
            {
              text: 'Производительность',
              link: '/guide/performance',
            },
            {
              text: 'Философия',
              link: '/guide/philosophy',
            },
            {
              text: 'Переход с версии v4',
              link: '/guide/migration',
            },
          ],
        },
        {
          text: 'Интерфейсы',
          items: [
            {
              text: 'Plugin API',
              link: '/guide/api-plugin',
            },
            {
              text: 'HMR API',
              link: '/guide/api-hmr',
            },
            {
              text: 'JavaScript API',
              link: '/guide/api-javascript',
            },
            {
              text: 'Vite Runtime API',
              link: '/guide/api-vite-runtime',
            },
            {
              text: 'Справочник по конфигурации',
              link: '/config/',
            },
          ],
        },
      ],
      '/config/': [
        {
          text: 'Конфигурация',
          items: [
            {
              text: 'Настройка Vite',
              link: '/config/',
            },
            {
              text: 'Общие параметры',
              link: '/config/shared-options',
            },
            {
              text: 'Параметры сервера',
              link: '/config/server-options',
            },
            {
              text: 'Параметры сборки',
              link: '/config/build-options',
            },
            {
              text: 'Параметры предварительного просмотра',
              link: '/config/preview-options',
            },
            {
              text: 'Параметры оптимизации зависимостей',
              link: '/config/dep-optimization-options',
            },
            {
              text: 'Параметры SSR',
              link: '/config/ssr-options',
            },
            {
              text: 'Параметры воркера',
              link: '/config/worker-options',
            },
          ],
        },
      ],
    },

    outline: {
      level: [2, 3],
    },
  },
  transformPageData(pageData) {
    const canonicalUrl = `${ogUrl}/${pageData.relativePath}`
      .replace(/\/index\.md$/, '/')
      .replace(/\.md$/, '/')
    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.unshift(
      ['link', { rel: 'canonical', href: canonicalUrl }],
      ['meta', { property: 'og:title', content: pageData.title }],
    )
    return pageData
  },
  markdown: {
    codeTransformers: [transformerTwoslash()],
  },
  buildEnd,
})
