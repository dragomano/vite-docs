import type { DefaultTheme } from 'vitepress'
import { defineConfig } from 'vitepress'
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import {
  groupIconMdPlugin,
  groupIconVitePlugin,
} from 'vitepress-plugin-group-icons'
import llmstxt from 'vitepress-plugin-llms'
import type { PluginOption } from 'vite'
import { buildEnd } from './buildEnd.config'

const ogDescription = 'Инструментарий для фронтенда нового поколения'
const ogImage = 'https://vite-docs.ru/og-image.jpg'
const ogTitle = 'Vite по-русски'
const ogUrl = 'https://vite-docs.ru/'

const versionLinks = ((): DefaultTheme.NavItemWithLink[] => {
  const oldVersions: DefaultTheme.NavItemWithLink[] = [
    {
      text: 'Документация Vite 5',
      link: 'https://v5.vite.dev',
    },
    {
      text: 'Документация Vite 4',
      link: 'https://v4.vite.dev',
    },
    {
      text: 'Документация Vite 3',
      link: 'https://v3.vite.dev',
    },
    {
      text: 'Документация Vite 2',
      link: 'https://v2.vite.dev',
    },
  ]

  return [
    {
      text: 'Документация Vite 6 (релиз)',
      link: 'https://vite.dev',
    },
    ...oldVersions,
  ]
})()

export default defineConfig({
  lang: 'ru',
  title: `Vite по-русски`,
  description: 'Инструментарий для фронтенда нового поколения',
  base: '/vite-docs/',
  sitemap: {
    hostname: 'https://vite-docs.ru/'
  },
  lastUpdated: true,
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/vite-docs/logo.svg' }],
    [
      'link',
      { rel: 'alternate', type: 'application/rss+xml', href: '/vite-docs/blog.rss' },
    ],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    [
      'link',
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'true',
      },
    ],
    [
      'link',
      {
        rel: 'preload',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@600&family=IBM+Plex+Mono:wght@400&display=swap',
        as: 'style',
      },
    ],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@600&family=IBM+Plex+Mono:wght@400&display=swap',
      },
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
      {},
      `(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "p4lpwfiwp1")`,
    ],
  ],

  locales: {
    root: { label: 'Русский' },
    en: { label: 'English', link: 'https://vite.dev' },
    zh: { label: '简体中文', link: 'https://cn.vite.dev' },
    ja: { label: '日本語', link: 'https://ja.vite.dev' },
    es: { label: 'Español', link: 'https://es.vite.dev' },
    pt: { label: 'Português', link: 'https://pt.vite.dev' },
    ko: { label: '한국어', link: 'https://ko.vite.dev' },
    de: { label: 'Deutsch', link: 'https://de.vite.dev' },
  },

  themeConfig: {
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

    algolia: {
      appId: '2ACEBREEXB',
      apiKey: 'a22b601c17d7f746322d0df34b5bbdb2',
      indexName: 'dragomanoio',
      searchParameters: {
        //facetFilters: ['tags:en', 'tags:ru'],
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

    footer: {
      message: `Выпущено под лицензией MIT.`,
      copyright: '© 2019 — настоящее время, VoidZero Inc. и контрибьюторы Vite',
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
          { text: 'Обучающий курс', link: 'https://www.youtube.com/playlist?list=PL-FhWbGlJPfZg649Ukk5vPa4nUjHhQ6o3' }
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
          text: 'Введение',
          items: [
            {
              text: 'Начало работы',
              link: '/guide/',
            },
            {
              text: 'Философия',
              link: '/guide/philosophy',
            },
            {
              text: 'Почему Vite',
              link: '/guide/why',
            },
          ],
        },
        {
          text: 'Руководство',
          items: [
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
              text: 'Продакшен-сборка',
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
              text: 'Решение проблем',
              link: '/guide/troubleshooting',
            },
            {
              text: 'Производительность',
              link: '/guide/performance',
            },
            {
              text: 'Rolldown',
              link: '/guide/rolldown',
            },
            {
              text: 'Переход с версии v5',
              link: '/guide/migration',
            },
            {
              text: 'Критические изменения',
              link: '/changes/',
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
              text: 'Справочник по конфигурации',
              link: '/config/',
            },
          ],
        },
        {
          text: 'Environment API',
          items: [
            {
              text: 'Введение',
              link: '/guide/api-environment',
            },
            {
              text: 'Экземпляры окружения',
              link: '/guide/api-environment-instances',
            },
            {
              text: 'Плагины',
              link: '/guide/api-environment-plugins',
            },
            {
              text: 'Фреймворки',
              link: '/guide/api-environment-frameworks',
            },
            {
              text: 'Среды выполнения',
              link: '/guide/api-environment-runtimes',
            },
          ],
        },
      ],
      '/config/': [
        {
          text: 'Настройка',
          items: [
            {
              text: 'Конфигурация Vite',
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
              text: 'Параметры сервера предварительного просмотра',
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
      '/changes/': [
        {
          text: 'Критические изменения',
          link: '/changes/',
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
              link: '/changes/this-environment-in-hooks',
            },
            {
              text: 'Хук hotUpdate плагина HMR',
              link: '/changes/hotupdate-hook',
            },
            {
              text: 'Переход на API для каждой среды',
              link: '/changes/per-environment-apis',
            },
            {
              text: 'SSR с использованием ModuleRunner API',
              link: '/changes/ssr-using-modulerunner',
            },
            {
              text: 'Общие плагины во время сборки',
              link: '/changes/shared-plugins-during-build',
            },
          ],
        },
        {
          text: 'Прошлые',
          items: [],
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
      .replace(/\.md$/, '')
    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.unshift(
      ['link', { rel: 'canonical', href: canonicalUrl }],
      ['meta', { property: 'og:title', content: pageData.title }],
    )
    return pageData
  },
  markdown: {
    codeTransformers: [transformerTwoslash()],
    languages: ['js', 'jsx', 'ts', 'tsx', 'json'],
    config(md) {
      md.use(groupIconMdPlugin)
    },
    container: {
      tipLabel: 'СОВЕТ',
      warningLabel: 'ПРЕДУПРЕЖДЕНИЕ',
      dangerLabel: 'ОПАСНОСТЬ',
      infoLabel: 'ИНФОРМАЦИЯ',
      detailsLabel: 'Подробная информация'
    }
  },
  vite: {
    plugins: [
      groupIconVitePlugin({
        customIcon: {
          firebase: 'vscode-icons:file-type-firebase',
          '.gitlab-ci.yml': 'vscode-icons:file-type-gitlab',
        },
      }),
      llmstxt({
        ignoreFiles: ['blog/*', 'blog.md', 'index.md', 'team.md'],
        description: 'Инструмент сборки для веба',
        details: `\
- 💡 Мгновенный запуск сервера
- ⚡️ Молниеносный HMR
- 🛠️ Богатые возможности
- 📦 Оптимизированная сборка
- 🔩 Универсальный интерфейс плагинов
- 🔑 Полностью типизированные API

Vite это новый вид инструментария для сборки фронтендов, который значительно улучшает опыт разработки. Он состоит из двух основных частей:

- Сервер разработки, который обслуживает ваши исходные файлы через [собственные модули ES](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) с [богатыми встроенными функциями](https://vite.dev/guide/features.html) и удивительно быструю [горячую замену модулей (HMR)](https://vite.dev/guide/features.html#hot-module-replacement).

- [Команда сборки](https://vite.dev/guide/build.html), которая объединяет ваш код с помощью сборщика [Rollup](https://rollupjs.org), предварительно настроенным на выдачу высокооптимизированных статических ресурсов для продакшена.

Кроме того, Vite обладает широкими возможностями расширения благодаря [Plugin API](https://vite.dev/guide/api-plugin.html) и [JavaScript API](https://vite.dev/guide/api-javascript.html) с полной поддержкой типизации.`,
      }) as PluginOption,
    ],
    optimizeDeps: {
      include: [
        '@shikijs/vitepress-twoslash/client',
        'gsap',
        'gsap/dist/ScrollTrigger',
        'gsap/dist/MotionPathPlugin',
      ],
    },
  },
  buildEnd,
})
