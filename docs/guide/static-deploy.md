# Развёртывание статического сайта {#deploying-a-static-site}

Следующие руководства основаны на некоторых общих предположениях:

- Вы используете расположение по умолчанию для выходных данных сборки (`dist`). Это расположение [можно изменить с помощью параметра `build.outDir`](/config/build-options.md#build-outdir), и в этом случае вы можете экстраполировать инструкции из этих руководств.
- Вы используете npm. Вы можете использовать эквивалентные команды для запуска скриптов, если вы используете Yarn или другие менеджеры пакетов.
- Vite установлен как локальная зависимость разработки в вашем проекте, и вы настроили следующие npm-скрипты:

```json
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

Важно отметить, что `vite preview` предназначен для предварительного просмотра сборки локально и не предназначен для использования в качестве продакшен-сервера.

::: tip ПРИМЕЧАНИЕ
Эти руководства предоставляют инструкции по выполнению статического развёртывания вашего сайта на Vite. Vite также поддерживает серверный рендеринг (SSR). SSR относится к фронтенд-фреймворкам, которые поддерживают запуск одного и того же приложения в Node.js, предварительно рендеря его в HTML, а затем гидратируя его на клиенте. Ознакомьтесь с [руководством по SSR](./ssr), чтобы узнать больше об этой функции. С другой стороны, если вы ищете интеграцию с традиционными серверными фреймворками, ознакомьтесь с [руководством по интеграции с бэкендом](./backend-integration).
:::

## Сборка приложения {#building-the-app}

Вы можете выполнить команду `npm run build`, чтобы собрать приложение.

```bash
$ npm run build
```

По умолчанию выходные данные сборки будут помещены в `dist`. Вы можете развернуть эту папку `dist` на любой из ваших предпочтительных платформ.

### Тестирование приложения локально {#testing-the-app-locally}

После того как вы собрали приложение, вы можете протестировать его локально, выполнив команду `npm run preview`.

```bash
$ npm run preview
```

Команда `vite preview` запустит локальный статический веб-сервер, который будет обслуживать файлы из `dist` по адресу `http://localhost:4173`. Это простой способ проверить, выглядит ли продакшен-сборка нормально в вашей локальной среде.

Вы можете настроить порт сервера, передав флаг `--port` в качестве аргумента.

```json
{
  "scripts": {
    "preview": "vite preview --port 8080"
  }
}
```

Теперь команда `preview` запустит сервер по адресу `http://localhost:8080`.

## GitHub Pages {#github-pages}

1. Установите правильное значение `base` в `vite.config.js`.

   Если вы развёртываете на `https://<USERNAME>.github.io/` или на пользовательском домене через GitHub Pages (например, `www.example.com`), установите `base` в `'/'`. В качестве альтернативы, вы можете удалить `base` из конфигурации, так как по умолчанию оно равно `'/'`.

   Если вы развёртываете на `https://<USERNAME>.github.io/<REPO>/` (например, ваш репозиторий находится по адресу `https://github.com/<USERNAME>/<REPO>`), тогда установите `base` в `'/<REPO>/'`.

2. Перейдите к настройкам вашего репозитория на странице конфигурации GitHub Pages и выберите «GitHub Actions» в качестве источника развёртывания. Это приведёт вас к созданию рабочего процесса, который собирает и развёртывает ваш проект. Пример рабочего процесса, который устанавливает зависимости и собирает с помощью npm:

   ```yml
   # Простой рабочий процесс для развёртывания статического контента на GitHub Pages
   name: Deploy static content to Pages

   on:
     # Запускается при пушах в целевую ветку по умолчанию
     push:
       branches: ['main']

     # Позволяет вам запускать этот рабочий процесс вручную из вкладки Actions
     workflow_dispatch:

   # Устанавливает разрешения для GITHUB_TOKEN, чтобы разрешить развёртывание на GitHub Pages
   permissions:
     contents: read
     pages: write
     id-token: write

   # Разрешает одно параллельное развёртывание
   concurrency:
     group: 'pages'
     cancel-in-progress: true

   jobs:
     # Один рабочий процесс, так как мы просто развёртываем
     deploy:
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       runs-on: ubuntu-latest
       steps:
         - name: Checkout
           uses: actions/checkout@v4
         - name: Set up Node
           uses: actions/setup-node@v4
           with:
             node-version: 20
             cache: 'npm'
         - name: Install dependencies
           run: npm ci
         - name: Build
           run: npm run build
         - name: Setup Pages
           uses: actions/configure-pages@v4
         - name: Upload artifact
           uses: actions/upload-pages-artifact@v3
           with:
             # Загружаем папку dist
             path: './dist'
         - name: Deploy to GitHub Pages
           id: deployment
           uses: actions/deploy-pages@v4
   ```

## GitLab Pages и GitLab CI {#gitlab-pages-and-gitlab-ci}

1. Установите правильное значение `base` в `vite.config.js`.

   Если вы развёртываете на `https://<USERNAME or GROUP>.gitlab.io/`, вы можете опустить `base`, так как по умолчанию оно равно `'/'`.

   Если вы развёртываете на `https://<USERNAME or GROUP>.gitlab.io/<REPO>/`, например, ваш репозиторий находится по адресу `https://gitlab.com/<USERNAME>/<REPO>`, тогда установите `base` в `'/<REPO>/'`.

2. Создайте файл с именем `.gitlab-ci.yml` в корне вашего проекта с содержимым ниже. Это будет собирать и развёртывать ваш сайт всякий раз, когда вы вносите изменения в ваш контент:

   ```yaml
   image: node:16.5.0
   pages:
     stage: deploy
     cache:
       key:
         files:
           - package-lock.json
         prefix: npm
       paths:
         - node_modules/
     script:
       - npm install
       - npm run build
       - cp -a dist/. public/
     artifacts:
       paths:
         - public
     rules:
       - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
   ```

## Netlify {#netlify}

1. Установите [Netlify CLI](https://cli.netlify.com/).
2. Создайте новый сайт с помощью `ntl init`.
3. Разверните с помощью `ntl deploy`.

```bash
# Установите Netlify CLI
$ npm install -g netlify-cli

# Создайте новый сайт в Netlify
$ ntl init

# Разверните на уникальном URL для предварительного просмотра
$ ntl deploy
```

Netlify CLI предоставит вам URL для предварительного просмотра, чтобы вы могли его проверить. Когда вы будете готовы к развёртыванию продакшен-версии, используйте флаг `prod`:

```bash
# Разверните продакшен-версию
$ ntl deploy --prod
```

## Vercel {#vercel}

### Vercel CLI {#vercel-cli}

1. Установите [Vercel CLI](https://vercel.com/cli) и выполните команду `vercel` для развёртывания.
2. Vercel обнаружит, что вы используете Vite, и включит правильные настройки для вашего развёртывания.
3. Ваше приложение развёрнуто! (например, [vite-vue-template.vercel.app](https://vite-vue-template.vercel.app/))

```bash
$ npm i -g vercel
$ vercel init vite
Vercel CLI
> Success! Initialized "vite" example in ~/your-folder.
- To deploy, `cd vite` and run `vercel`.
```

### Vercel для Git {#vercel-for-git}

1. Запушьте ваш код в ваш git-репозиторий (GitHub, GitLab, Bitbucket).
2. [Импортируйте ваш проект Vite](https://vercel.com/new) в Vercel.
3. Vercel обнаружит, что вы используете Vite, и включит правильные настройки для вашего развёртывания.
4. Ваше приложение развёрнуто! (например, [vite-vue-template.vercel.app](https://vite-vue-template.vercel.app/))

После того как ваш проект будет импортирован и развёрнут, все последующие пуши в ветки будут генерировать [предварительные развёртывания](https://vercel.com/docs/concepts/deployments/environments#preview), а все изменения, внесённые в продакшен-ветку (обычно «main»), приведут к [развёртыванию продакшен-версии](https://vercel.com/docs/concepts/deployments/environments#production).

Узнайте больше об [интеграции Git с Vercel](https://vercel.com/docs/concepts/git).

## Cloudflare Pages {#cloudflare-pages}

### Cloudflare Pages через Wrangler {#cloudflare-pages-via-wrangler}

1. Установите [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/get-started/).
2. Аутентифицируйте Wrangler с вашим аккаунтом Cloudflare, используя команду `wrangler login`.
3. Выполните вашу команду сборки.
4. Разверните с помощью `npx wrangler pages deploy dist`.

```bash
# Установите Wrangler CLI
$ npm install -g wrangler

# Войдите в аккаунт Cloudflare из CLI
$ wrangler login

# Выполните вашу команду сборки
$ npm run build

# Создайте новое развёртывание
$ npx wrangler pages deploy distwrangler pages deploy dist
```

После загрузки ваших ресурсов Wrangler предоставит вам URL для предварительного просмотра, чтобы вы могли проверить ваш сайт. Когда вы войдете в панель управления Cloudflare Pages, вы увидите ваш новый проект.

### Cloudflare Pages с Git {#cloudflare-pages-with-git}

1. Запушьте ваш код в ваш git-репозиторий (GitHub, GitLab).
2. Войдите в панель управления Cloudflare и выберите ваш аккаунт в разделе **Account Home** > **Pages**.
3. Выберите **Create a new Project** (**Создать новый проект**) и опцию **Connect Git** (**Подключить Git**).
4. Выберите git-проект, который вы хотите развернуть, и нажмите **Begin setup** (**Начать настройку**).
5. Выберите соответствующий пресет фреймворка в настройках сборки в зависимости от выбранного вами фреймворка Vite.
6. Затем сохраните и разверните!
7. Ваше приложение развёрнуто! (например, `https://<PROJECTNAME>.pages.dev/`)

После того как ваш проект будет импортирован и развёрнут, все последующие пуши в ветки будут генерировать [предварительные развёртывания](https://developers.cloudflare.com/pages/platform/preview-deployments/), если не указано иное в ваших [управлениях сборкой веток](https://developers.cloudflare.com/pages/platform/branch-build-controls/). Все изменения в продакшен-ветке (обычно «main») приведут к развёртыванию продакшен-версии.

Вы также можете добавлять пользовательские домены и настраивать параметры сборки на Pages. Узнайте больше об [интеграции Git с Cloudflare Pages](https://developers.cloudflare.com/pages/get-started/#manage-your-site).

## Google Firebase {#google-firebase}

1. Убедитесь, что у вас установлен пакет [firebase-tools](https://www.npmjs.com/package/firebase-tools).

2. Создайте `firebase.json` и `.firebaserc` в корне вашего проекта со следующим содержимым:

   `firebase.json`:

   ```json
   {
     "hosting": {
       "public": "dist",
       "ignore": [],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     }
   }
   ```

   `.firebaserc`:

   ```js
   {
     "projects": {
       "default": "<YOUR_FIREBASE_ID>"
     }
   }
   ```

3. После выполнения команды `npm run build` разверните с помощью команды `firebase deploy`.

## Surge {#surge}

1. Сначала установите [surge](https://www.npmjs.com/package/surge), если вы ещё этого не сделали.

2. Выполните команду `npm run build`.

3. Разверните на Surge, введя `surge dist`.

Вы также можете развернуть на [пользовательском домене](http://surge.sh/help/adding-a-custom-domain), добавив `surge dist yourdomain.com`.

## Azure Static Web Apps {#azure-static-web-apps}

Вы можете быстро развернуть ваше приложение Vite с помощью сервиса Microsoft Azure [Static Web Apps](https://aka.ms/staticwebapps). Вам потребуется:

- Аккаунт Azure и ключ подписки. Вы можете создать [бесплатный аккаунт Azure здесь](https://azure.microsoft.com/free).
- Код вашего приложения, отправленный на [GitHub](https://github.com).
- [Расширение SWA](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps) в [Visual Studio Code](https://code.visualstudio.com).

Установите расширение в VS Code и перейдите в корень вашего приложения. Откройте расширение Static Web Apps, войдите в Azure и нажмите на знак '+' для создания нового статического веб-приложения. Вам будет предложено указать, какой ключ подписки использовать.

Следуйте мастеру, запущенному расширением, чтобы дать вашему приложению имя, выбрать пресет фреймворка и указать корень приложения (обычно `/`) и расположение собранных файлов `/dist`. Мастер выполнит необходимые действия и создаст GitHub action в вашем репозитории в папке `.github`.

Этот action будет работать для развёртывания вашего приложения (следите за его прогрессом на вкладке Actions вашего репозитория), и, когда он успешно завершится, вы сможете просмотреть ваше приложение по адресу, предоставленному в окне прогресса расширения, нажав кнопку «Browse Website», которая появится после выполнения GitHub action.

## Render {#render}

Вы можете развернуть ваше приложение Vite как статический сайт на [Render](https://render.com/).

1. Создайте [аккаунт Render](https://dashboard.render.com/register).

2. В [панели управления](https://dashboard.render.com/) нажмите кнопку **New** и выберите **Static Site**.

3. Подключите свой аккаунт GitHub/GitLab или используйте публичный репозиторий.

4. Укажите имя проекта и ветку.

   - **Команда сборки**: `npm install && npm run build`
   - **Папка для публикации**: `dist`

5. Нажмите **Create Static Site**.

   Ваше приложение должно быть развёрнуто по адресу `https://<PROJECTNAME>.onrender.com/`.

По умолчанию любое новое изменение, запушенное в указанную ветку, автоматически запустит новое развёртывание. [Автоматическое развёртывание](https://render.com/docs/deploys#toggling-auto-deploy-for-a-service) можно настроить в настройках проекта.

Вы также можете добавить [пользовательский домен](https://render.com/docs/custom-domains) к вашему проекту.

<!--
  ЗАМЕТКА: Разделы ниже зарезервированы для других платформ развёртывания, не перечисленных выше.
  Не стесняйтесь отправлять PR, который добавляет новый раздел с ссылкой на руководство по развёртыванию вашей платформы,
  при условии, что оно соответствует следующим критериям:

  1. Пользователи должны иметь возможность развернуть свой сайт бесплатно.
  2. Предложения бесплатного уровня должны размещать сайт на неограниченный срок и не должны быть ограничены по времени.
     Предложение ограниченного количества вычислительных ресурсов или количества сайтов в обмен допустимо.
  3. Связанные руководства не должны содержать вредоносного контента.

  Команда Vite может изменять критерии и периодически проверять текущий список.
  Если раздел будет удален, мы уведомим авторов оригинальных PR перед этим.
-->

## Flightcontrol {#flightcontrol}

Разверните свой статический сайт, используя [Flightcontrol](https://www.flightcontrol.dev/?ref=docs-vite) и следуя этим [инструкциям](https://www.flightcontrol.dev/docs/reference/examples/vite?ref=docs-vite).

## Хостинг статических сайтов Kinsta {#kinsta-static-site-hosting}

Разверните свой статический сайт, используя [Kinsta](https://kinsta.com/static-site-hosting/) и следуя этим [инструкциям](https://kinsta.com/docs/react-vite-example/).

## Хостинг статических сайтов xmit {#xmit-static-site-hosting}

Разверните свой статический сайт, используя [xmit](https://xmit.co) и следуя этому [руководству](https://xmit.dev/posts/vite-quickstart/).
