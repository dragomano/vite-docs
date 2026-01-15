import path from 'node:path'
import fs from 'node:fs'
import type { HeadConfig } from 'vitepress'
import { defineConfig } from 'vitepress'
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import {
  groupIconMdPlugin,
  groupIconVitePlugin,
  localIconLoader,
} from 'vitepress-plugin-group-icons'
import { markdownItImageSize } from 'markdown-it-image-size'
import { extendConfig } from '@voidzero-dev/vitepress-theme/config'
import type { FooterLink } from '@voidzero-dev/vitepress-theme'
import packageJson from '../../package.json' with { type: 'json' }
import { buildEnd } from './buildEnd.config'

const viteVersion = packageJson.devDependencies.vite.replace(/^\^/, '')
const viteMajorVersion = +viteVersion.split('.')[0]

const ogDescription = 'Инструментарий для фронтенда нового поколения'
const ogImage = 'https://vite-docs.ru/og-image.jpg'
const ogTitle = 'Vite по-русски'
const ogUrl = 'https://vite-docs.ru/'

const versionLinks = (() => {
  const links: FooterLink[] = []

  links.push({
    text: 'Документация в разработке',
    link: 'https://main.vite.dev',
  })

  links.push({
    text: `Документация Vite ${viteMajorVersion} (релиз)`,
    link: '/',
  })

  // Create version links from v2 onwards
  for (let i = viteMajorVersion - 1; i >= 2; i--) {
    links.push({
      text: `Документация Vite ${i}`,
      link: `https://v${i}.vite.dev`,
    })
  }

  return links
})()

function inlineScript(file: string): HeadConfig {
  return [
    'script',
    {},
    fs.readFileSync(
      path.resolve(__dirname, `./inlined-scripts/${file}`),
      'utf-8',
    ),
  ]
}

function getGuideSidebar(prefix: string = '') {
  return [
    {
      text: 'Введение',
      items: [
        {
          text: 'Начало работы',
          link: `${prefix}/guide`,
        },
        {
          text: 'Философия',
          link: `${prefix}/guide/philosophy`,
        },
        {
          text: 'Почему Vite',
          link: `${prefix}/guide/why`,
        },
      ],
    },
    {
      text: 'Руководство',
      items: [
        {
          text: 'Возможности',
          link: `${prefix}/guide/features`,
        },
        {
          text: 'Консоль',
          link: `${prefix}/guide/cli`,
        },
        {
          text: 'Использование плагинов',
          link: `${prefix}/guide/using-plugins`,
        },
        {
          text: 'Предварительное объединение зависимостей',
          link: `${prefix}/guide/dep-pre-bundling`,
        },
        {
          text: 'Обработка статических ресурсов',
          link: `${prefix}/guide/assets`,
        },
        {
          text: 'Продакшен-сборка',
          link: `${prefix}/guide/build`,
        },
        {
          text: 'Развёртывание статического сайта',
          link: `${prefix}/guide/static-deploy`,
        },
        {
          text: 'Переменные окружения и режимы',
          link: `${prefix}/guide/env-and-mode`,
        },
        {
          text: 'Серверный рендеринг (SSR)',
          link: `${prefix}/guide/ssr`,
        },
        {
          text: 'Интеграция с бэкэндом',
          link: `${prefix}/guide/backend-integration`,
        },
        {
          text: 'Решение проблем',
          link: `${prefix}/guide/troubleshooting`,
        },
        {
          text: 'Производительность',
          link: `${prefix}/guide/performance`,
        },
        prefix === 'next' ? {} : {
          text: 'Rolldown',
          link: `${prefix}/guide/rolldown`,
        },
        {
          text: `Переход с версии v${prefix === 'next' ? 7 : viteMajorVersion - 1}`,
          link: `${prefix}/guide/migration`,
        },
        {
          text: 'Критические изменения',
          link: `${prefix}/changes`,
        },
      ],
    },
    {
      text: 'Интерфейсы',
      items: [
        {
          text: 'Plugin API',
          link: `${prefix}/guide/api-plugin`,
        },
        {
          text: 'HMR API',
          link: `${prefix}/guide/api-hmr`,
        },
        {
          text: 'JavaScript API',
          link: `${prefix}/guide/api-javascript`,
        },
        {
          text: 'Справочник по конфигурации',
          link: `${prefix}/config`,
        },
      ],
    },
    {
      text: 'Environment API',
      items: [
        {
          text: 'Введение',
          link: `${prefix}/guide/api-environment`,
        },
        {
          text: 'Экземпляры окружения',
          link: `${prefix}/guide/api-environment-instances`,
        },
        {
          text: 'Плагины',
          link: `${prefix}/guide/api-environment-plugins`,
        },
        {
          text: 'Фреймворки',
          link: `${prefix}/guide/api-environment-frameworks`,
        },
        {
          text: 'Среды выполнения',
          link: `${prefix}/guide/api-environment-runtimes`,
        },
      ],
    },
  ];
}

function getConfigSidebar(prefix: string = '') {
  return [
    {
      text: 'Настройка',
      items: [
        {
          text: 'Конфигурация Vite',
          link: `${prefix}/config`,
        },
        {
          text: 'Общие параметры',
          link: `${prefix}/config/shared-options`,
        },
        {
          text: 'Параметры сервера',
          link: `${prefix}/config/server-options`,
        },
        {
          text: 'Параметры сборки',
          link: `${prefix}/config/build-options`,
        },
        {
          text: 'Параметры сервера предварительного просмотра',
          link: `${prefix}/config/preview-options`,
        },
        {
          text: 'Параметры оптимизации зависимостей',
          link: `${prefix}/config/dep-optimization-options`,
        },
        {
          text: 'Параметры SSR',
          link: `${prefix}/config/ssr-options`,
        },
        {
          text: 'Параметры воркера',
          link: `${prefix}/config/worker-options`,
        },
      ],
    },
  ];
}

function getChangesSidebar(prefix: string = '') {
  return [
    {
      text: 'Критические изменения',
      link: `${prefix}/changes`,
    },
    {
      text: 'Текущие',
      items: [],
    },
    {
      text: 'Будущие',
      items: [
        {
          text: 'this.environment в хуках',
          link: `${prefix}/changes/this-environment-in-hooks`,
        },
        {
          text: 'Хук hotUpdate плагина HMR',
          link: `${prefix}/changes/hotupdate-hook`,
        },
        {
          text: 'Переход на API для каждой среды',
          link: `${prefix}/changes/per-environment-apis`,
        },
        {
          text: 'SSR с использованием ModuleRunner API',
          link: `${prefix}/changes/ssr-using-modulerunner`,
        },
        {
          text: 'Общие плагины во время сборки',
          link: `${prefix}/changes/shared-plugins-during-build`,
        },
      ],
    },
    {
      text: 'Прошлые',
      items: [],
    },
  ];
}

const config = defineConfig({
  lang: 'ru',
  title: `Vite по-русски`,
  description: 'Инструментарий для фронтенда нового поколения',
  cleanUrls: true,
  //base: '/vite-docs/',
  sitemap: {
    hostname: 'https://vite-docs.ru/'
  },
  lastUpdated: true,
  head: [
    [
      'link',
      { rel: 'icon', type: 'image/svg+xml', href: '/logo-without-border.svg' },
    ],
    [
      'link',
      { rel: 'alternate', type: 'application/rss+xml', href: '/blog.rss' },
    ],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    inlineScript('banner.js'),
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
    /* [
      'script',
      {},
      `(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "p4lpwfiwp1")`,
    ], */
  ],

  locales: {
    root: { label: 'Русский' },
    en: { label: 'English', link: 'https://vite.dev' },
  },

  themeConfig: {
    variant: 'vite',
    logo: '/logo.svg',

    outlineTitle: 'Содержание',
    docFooter: {
      prev: 'Предыдущая страница',
      next: 'Следующая страница'
    },
    lastUpdatedText: 'Обновлено',
    darkModeSwitchLabel: 'Оформление',
    lightModeSwitchTitle: 'Переключить на светлую тему',
    darkModeSwitchTitle: 'Переключить на тёмную тему',
    sidebarMenuLabel: 'Меню',
    returnToTopLabel: 'Вернуться к началу',
    langMenuLabel: 'Изменить язык',
    notFound: {
      title: 'СТРАНИЦА НЕ НАЙДЕНА',
      quote: 'Но если не менять направление и продолжать искать, то можно оказаться там, где надо.',
      linkLabel: 'перейти на главную',
      linkText: 'Вернуться на главную'
    },

    banner: {
      id: 'vite+',
      text: 'Поставьте звезду репозиторию перевода на GitHub',
      url: 'https://github.com/dragomano/vite-docs',
    },

    editLink: {
      pattern: 'https://github.com/dragomano/vite-docs/edit/main/docs/:path',
      text: 'Предложить изменения',
    },

    socialLinks: [
      { icon: 'bluesky', link: 'https://bsky.app/profile/vite.dev' },
      { icon: 'mastodon', link: 'https://elk.zone/m.webtoo.ls/@vite' },
      { icon: 'x', link: 'https://x.com/vite_js' },
      { icon: 'discord', link: 'https://chat.vite.dev' },
      { icon: 'github', link: 'https://github.com/vitejs/vite' },
    ],

    search: {
      provider: 'algolia',
      options: {
        appId: 'VETIKID9KS',
        apiKey: '9c447d0510cb766c2c7fbac08a206050',
        indexName: 'vite-ru',
        locales: {
          root: {
            placeholder: 'Поиск в документации',
            translations: {
              button: {
                buttonText: 'Поиск',
                buttonAriaLabel: 'Поиск'
              },
              modal: {
                searchBox: {
                  clearButtonTitle: 'Очистить поиск',
                  clearButtonAriaLabel: 'Очистить поиск',
                  closeButtonText: 'Закрыть',
                  closeButtonAriaLabel: 'Закрыть',
                  placeholderText: 'Поиск в документации',
                  placeholderTextAskAi: 'Задайте вопрос ИИ:',
                  placeholderTextAskAiStreaming: 'Формируется ответ...',
                  searchInputLabel: 'Поиск',
                  backToKeywordSearchButtonText: 'Вернуться к поиску по ключевым словам',
                  backToKeywordSearchButtonAriaLabel: 'Вернуться к поиску по ключевым словам'
                },
                startScreen: {
                  recentSearchesTitle: 'История поиска',
                  noRecentSearchesText: 'Нет истории поиска',
                  saveRecentSearchButtonTitle: 'Сохранить в истории поиска',
                  removeRecentSearchButtonTitle: 'Удалить из истории поиска',
                  favoriteSearchesTitle: 'Избранное',
                  removeFavoriteSearchButtonTitle: 'Удалить из избранного',
                  recentConversationsTitle: 'Последние диалоги',
                  removeRecentConversationButtonTitle: 'Удалить диалог из истории'
                },
                errorScreen: {
                  titleText: 'Невозможно получить результаты',
                  helpText: 'Проверьте подключение к Интернету'
                },
                noResultsScreen: {
                  noResultsText: 'Ничего не найдено',
                  suggestedQueryText: 'Попробуйте изменить запрос',
                  reportMissingResultsText: 'Считаете, что результаты должны быть?',
                  reportMissingResultsLinkText: 'Сообщите об этом'
                },
                resultsScreen: {
                  askAiPlaceholder: 'Задайте вопрос ИИ: '
                },
                askAiScreen: {
                  disclaimerText: 'Ответ сгенерирован ИИ и может быть неточным. Пожалуйста, проверьте информацию самостоятельно.',
                  relatedSourcesText: 'Связанные источники',
                  thinkingText: 'Думаю...',
                  copyButtonText: 'Копировать',
                  copyButtonCopiedText: 'Скопировано!',
                  copyButtonTitle: 'Копировать',
                  likeButtonTitle: 'Нравится',
                  dislikeButtonTitle: 'Не нравится',
                  thanksForFeedbackText: 'Спасибо за ваш отзыв!',
                  preToolCallText: 'Идёт поиск...',
                  duringToolCallText: 'Поиск ',
                  afterToolCallText: 'Поиск выполнен'
                },
                footer: {
                  selectText: 'выбрать',
                  submitQuestionText: 'Отправить вопрос',
                  selectKeyAriaLabel: 'Клавиша Enter',
                  navigateText: 'перейти',
                  navigateUpKeyAriaLabel: 'Стрелка вверх',
                  navigateDownKeyAriaLabel: 'Стрелка вниз',
                  closeText: 'закрыть',
                  backToSearchText: 'Вернуться к поиску',
                  closeKeyAriaLabel: 'Клавиша Esc',
                  poweredByText: 'поиск от'
                }
              }
            }
          }
        }
      }
    },

    footer: {
      copyright: `© 2025 VoidZero Inc. и контрибьюторы Vite.`,
      nav: [
        {
          title: 'Vite',
          items: [
            { text: 'Руководство', link: '/guide/' },
            { text: 'Конфигурация', link: '/config/' },
            { text: 'Плагины', link: '/plugins/' },
          ],
        },
        {
          title: 'Ресурсы',
          items: [
            { text: 'Команда', link: '/team' },
            { text: 'Блог', link: '/blog' },
            {
              text: 'Релизы',
              link: 'https://github.com/vitejs/vite/releases',
            },
          ],
        },
        {
          title: 'Версии',
          items: versionLinks,
        },
      ],
      social: [
        { icon: 'github', link: 'https://github.com/vitejs/vite' },
        { icon: 'discord', link: 'https://chat.vite.dev' },
        { icon: 'bluesky', link: 'https://bsky.app/profile/vite.dev' },
        { icon: 'x', link: 'https://x.com/vite_js' },
      ],
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
            text: 'Документальный фильм о Vite',
            link: 'https://www.youtube.com/watch?v=bmWQqAKLgT4',
          },
          {
            items: [
              {
                text: 'Bluesky',
                link: 'https://bsky.app/profile/vite.dev',
              },
              {
                text: 'Mastodon',
                link: 'https://elk.zone/m.webtoo.ls/@vite',
              },
              {
                text: 'X',
                link: 'https://x.com/vite_js',
              },
              {
                text: 'Чат Discord',
                link: 'https://chat.vite.dev',
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
            ],
          },
        ],
      },
      {
        text: `v${viteVersion}`,
        items: [
          {
            text: 'Журнал изменений',
            link: 'https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md',
          },
          {
            text: 'Сотрудничество',
            link: 'https://github.com/vitejs/vite/blob/main/CONTRIBUTING.md',
          },
          {
            items: versionLinks,
          },
        ],
      },
    ],

    sidebar: {
      '/guide/': getGuideSidebar(),
      '/config/': getConfigSidebar(),
      '/changes/': getChangesSidebar(),
    },

    outline: {
      level: [2, 3],
    },
  },
  transformHead(ctx) {
    const path = ctx.page.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')

    if (path !== '404') {
      const canonicalUrl = path ? `${ogUrl}/${path}` : ogUrl
      ctx.head.push(
        ['link', { rel: 'canonical', href: canonicalUrl }],
        ['meta', { property: 'og:title', content: ctx.pageData.title }],
      )
    }

    // For the landing page, move the google font links to the top for better performance
    if (path === '') {
      const googleFontLinks: HeadConfig[] = []
      for (let i = 0; i < ctx.head.length; i++) {
        const tag = ctx.head[i]
        if (
          tag[0] === 'link' &&
          (tag[1]?.href?.includes('fonts.googleapis.com') ||
            tag[1]?.href?.includes('fonts.gstatic.com'))
        ) {
          ctx.head.splice(i, 1)
          googleFontLinks.push(tag)
          i--
        }
      }
      ctx.head.unshift(...googleFontLinks)
    }
  },
  markdown: {
    codeTransformers: [
      transformerTwoslash(),
      // add `style:*` support
      {
        root(hast) {
          const meta = this.options.meta?.__raw
            ?.split(' ')
            .find((m) => m.startsWith('style:'))
          if (meta) {
            const style = meta.slice('style:'.length)
            const rootPre = hast.children.find(
              (n): n is typeof n & { type: 'element'; tagName: 'pre' } =>
                n.type === 'element' && n.tagName === 'pre',
            )
            if (rootPre) {
              rootPre.properties.style += '; ' + style
            }
          }
        },
      },
    ],
    languages: ['js', 'jsx', 'ts', 'tsx', 'json'],
    config(md) {
      md.use(groupIconMdPlugin, {
        titleBar: {
          includeSnippet: true,
        },
      })
      md.use(markdownItImageSize, {
        publicDir: path.resolve(import.meta.dirname, '../public'),
      })
    },
    container: {
      dangerLabel: 'ОПАСНОСТЬ',
      detailsLabel: 'ПОДРОБНОСТИ',
      importantLabel: 'ВАЖНО',
      infoLabel: 'ИНФОРМАЦИЯ',
      tipLabel: 'СОВЕТ',
      warningLabel: 'ПРЕДУПРЕЖДЕНИЕ',
    }
  },
  vite: {
    build: {
      chunkSizeWarningLimit: 1000,
    },
    plugins: [
      groupIconVitePlugin({
        customIcon: {
          firebase: 'vscode-icons:file-type-firebase',
          '.gitlab-ci.yml': 'vscode-icons:file-type-gitlab',
          'vite.config': localIconLoader(
            import.meta.url,
            '../public/logo-without-border.svg',
          ),
        },
      }),
    ],
    optimizeDeps: {
      include: ['@shikijs/vitepress-twoslash/client'],
    },
    define: {
      __VITE_VERSION__: JSON.stringify(viteVersion),
    },
  },
  buildEnd,
})

export default extendConfig(config)
