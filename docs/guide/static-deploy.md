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

Важно отметить, что команда `vite preview` предназначена для предварительного просмотра сборки локально, а не для использования в качестве продакшен-сервера.

::: tip ПРИМЕЧАНИЕ
Эти руководства предоставляют инструкции по выполнению статического развёртывания вашего сайта на Vite. Vite также поддерживает серверный рендеринг (SSR). SSR относится к фронтенд-фреймворкам, которые поддерживают запуск одного и того же приложения в Node.js, предварительно рендеря его в HTML, а затем гидратируя его на клиенте. Ознакомьтесь с [руководством по SSR](./ssr), чтобы узнать больше об этой функции. С другой стороны, если вы ищете интеграцию с традиционными серверными фреймворками, ознакомьтесь с [руководством по интеграции с бэкендом](./backend-integration).
:::

## Сборка приложения {#building-the-app}

Вы можете выполнить команду `npm run build`, чтобы собрать приложение.

```bash
$ npm run build
```

По умолчанию выходные данные сборки будут помещены в `dist`. Вы можете развернуть эту папку `dist` на любой из предпочитаемых вами платформе.

### Локальное тестирование приложения {#testing-the-app-locally}

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

1. **Обновите конфигурацию Vite**

   Установите правильное значение `base` в `vite.config.js`.

   Если вы развёртываете на `https://<USERNAME>.github.io/` или на пользовательском домене через GitHub Pages (например, `www.example.com`), установите `base` в `'/'`. В качестве альтернативы, вы можете удалить `base` из конфигурации, так как по умолчанию оно равно `'/'`.

   Если вы развёртываете на `https://<USERNAME>.github.io/<REPO>/` (например, ваш репозиторий находится по адресу `https://github.com/<USERNAME>/<REPO>`), тогда установите `base` в `'/<REPO>/'`.

2. **Включите GitHub Pages**

   В вашем репозитории перейдите в **Settings → Pages**. В разделе **Build and deployment** откройте выпадающее меню **Source** и выберите **GitHub Actions**.

   GitHub теперь сам соберёт и опубликует ваш сайт с помощью [сценария](https://docs.github.com/ru/actions/concepts/workflows-and-actions/workflows) GitHub Actions. Это необходимо, потому что для Vite сайт нужно сначала собрать.

3. **Создайте файл сценария**

   Создайте новый файл в вашем репозитории по пути `.github/workflows/deploy.yml`. Вы также можете нажать на **«create your own»** на предыдущем шаге, что сгенерирует для вас заготовку сценария.

   Вот пример файла, который при каждом пуше изменений в ветку `main` устанавливает зависимости с помощью npm, собирает сайт и разворачивает его:

   <<< ./static-deploy-github-pages.yaml#content [.github/workflows/deploy.yml]

## GitLab Pages и GitLab CI {#gitlab-pages-and-gitlab-ci}

1. Установите правильное значение `base` в `vite.config.js`.

   Если вы развёртываете на `https://<USERNAME or GROUP>.gitlab.io/`, вы можете опустить `base`, так как по умолчанию оно равно `'/'`.

   Если вы развёртываете на `https://<USERNAME or GROUP>.gitlab.io/<REPO>/`, например, ваш репозиторий находится по адресу `https://gitlab.com/<USERNAME>/<REPO>`, тогда установите `base` в `'/<REPO>/'`.

2. Создайте файл с именем `.gitlab-ci.yml` в корне вашего проекта с содержимым ниже. Это будет собирать и развёртывать ваш сайт всякий раз, когда вы вносите изменения в ваш контент:

   ```yaml
   image: node:lts
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

### Netlify CLI {netlify-cli}

1. Установите [Netlify CLI](https://docs.netlify.com/api-and-cli-guides/cli-guides/get-started-with-cli/) с помощью команды `npm install -g netlify-cli`
2. Создайте новый сайт командой `netlify init`
3. Разверните с помощью `netlify deploy`

Netlify CLI покажет вам URL предпросмотра, чтобы вы могли посмотреть результат. Когда будете готовы выложить сайт в продакшен, используйте флаг `--prod`: `netlify deploy --prod`

### Netlify с Git {netlify-with-git}

1. Запушьте ваш код в git-репозиторий (GitHub, GitLab, BitBucket, Azure DevOps).
2. [Импортируйте проект](https://app.netlify.com/start) в Netlify.
3. Выберите ветку, папку со сборкой (output directory) и при необходимости настройте переменные окружения.
4. Нажмите **Deploy**.
5. Ваше Vite-приложение успешно развёрнуто!

После того как проект импортирован и впервые развёрнут, все последующие пуши в ветки, отличные от продакшен-ветки, а также пулреквесты будут автоматически создавать [Preview Deployments](https://docs.netlify.com/site-deploys/deploy-previews/) (предпросмотры), а все изменения в продакшен-ветке (обычно это «main») будут приводить к [Production Deployment](https://docs.netlify.com/site-deploys/overview/#definitions) (развёртыванию в продакшен).

## Vercel {#vercel}

### Vercel CLI {#vercel-cli}

1. Установите [Vercel CLI](https://vercel.com/cli) командой `npm i -g vercel` и выполните команду `vercel` для развёртывания.
2. Vercel обнаружит, что вы используете Vite, и включит правильные настройки для вашего развёртывания.
3. Ваше приложение развёрнуто! (например, [vite-vue-template.vercel.app](https://vite-vue-template.vercel.app/))

### Vercel с Git {#vercel-with-git}

1. Запушьте ваш код в ваш git-репозиторий (GitHub, GitLab, Bitbucket).
2. [Импортируйте ваш проект Vite](https://vercel.com/new) в Vercel.
3. Vercel обнаружит, что вы используете Vite, и включит правильные настройки для вашего развёртывания.
4. Ваше приложение развёрнуто! (например, [vite-vue-template.vercel.app](https://vite-vue-template.vercel.app/))

После того как ваш проект будет импортирован и развёрнут, все последующие пуши в ветки будут генерировать [предварительные развёртывания](https://vercel.com/docs/concepts/deployments/environments#preview), а все изменения, внесённые в продакшен-ветку (обычно «main»), приведут к [развёртыванию продакшен-версии](https://vercel.com/docs/concepts/deployments/environments#production).

Узнайте больше об [интеграции Git с Vercel](https://vercel.com/docs/concepts/git).

## Cloudflare {#cloudflare}

### Cloudflare Workers {#cloudflare-workers}

[Плагин Cloudflare для Vite](https://developers.cloudflare.com/workers/vite-plugin/) обеспечивает интеграцию с Cloudflare Workers и использует Environment API, чтобы запускать ваш серверный код в среде выполнения Cloudflare Workers уже на этапе разработки.

Чтобы добавить Cloudflare Workers в существующий проект на Vite, установите плагин и добавьте его в конфигурацию:

```bash
$ npm install --save-dev @cloudflare/vite-plugin
```

```js [vite.config.js]
import { defineConfig } from 'vite'
import { cloudflare } from '@cloudflare/vite-plugin'

export default defineConfig({
  plugins: [cloudflare()],
})
```

```jsonc [wrangler.jsonc]
{
  "name": "my-vite-app",
}
```

После выполнения команды `npm run build` ваше приложение теперь можно рзавернуть с помощью команды `npx wrangler deploy`.

Вы также можете легко добавить серверные API в ваше Vite-приложение, чтобы безопасно взаимодействовать с ресурсами Cloudflare. Эти API будут работать в среде Workers во время разработки и развёртываться вместе с вашим фронтендом. Полное пошаговое руководство смотрите в [туториале по плагину Cloudflare для Vite](https://developers.cloudflare.com/workers/vite-plugin/tutorial/).

### Cloudflare Pages {#cloudflare-pages}

### Cloudflare Pages с Git {#cloudflare-pages-with-git}

Cloudflare Pages предоставляет способ развёртывания напрямую в Cloudflare без необходимости управлять файлом Wrangler.

1. Запушьте ваш код в git-репозиторий (GitHub, GitLab).
2. Войдите в дашборд Cloudflare и выберите ваш аккаунт в **Account Home** → **Workers & Pages**.
3. Нажмите **Create a new Project**, выберите опцию **Pages**, затем выберите **Git**.
4. Выберите git-проект, который хотите задеплоить, и нажмите **Begin setup**.
5. В настройках сборки выберите соответствующий пресет фреймворка в зависимости от того, какой Vite-фреймворк вы используете. В противном случае укажите свою команду сборки для проекта и ожидаемую выходную директорию.
6. Сохраните настройки и запустите развёртывание!
7. Ваше приложение развёрнуто! (например, `https://<PROJECTNAME>.pages.dev/`)

После того как проект импортирован и впервые развёрнут, все последующие пуши в любые ветки будут автоматически создавать [Preview Deployments](https://developers.cloudflare.com/pages/platform/preview-deployments/), если вы не укажете иное в настройках [branch build controls](https://developers.cloudflare.com/pages/platform/branch-build-controls/). Все изменения в продакшен-ветке (обычно это «main») будут приводить к Production Deployment (развёртыванию в продакшен).

Вы также можете добавлять пользовательские домены и настраивать параметры сборки на Pages. Узнайте больше об [интеграции Git с Cloudflare Pages](https://developers.cloudflare.com/pages/get-started/#manage-your-site).

## Google Firebase {#google-firebase}

1. Установите пакет [firebase-tools](https://www.npmjs.com/package/firebase-tools) командой `npm i -g firebase-tools`.

2. Создайте следующие файлы в корне вашего проекта:

  ::: code-group

   ```json [firebase.json]
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

   ```js [.firebaserc]
   {
     "projects": {
       "default": "<YOUR_FIREBASE_ID>"
     }
   }
   ```

   :::

3. После выполнения команды `npm run build` разверните с помощью команды `firebase deploy`.

## Surge {#surge}

1. Установите пакет [surge](https://www.npmjs.com/package/surge) командой `npm i -g surge`.

2. Выполните команду `npm run build`.

3. Разверните на Surge, введя `surge dist`.

Вы также можете развернуть на [пользовательском домене](https://surge.sh/help/adding-a-custom-domain), добавив `surge dist yourdomain.com`.

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

5. Нажмите **Create Static Site**. Ваше приложение должно быть развёрнуто по адресу `https://<PROJECTNAME>.onrender.com/`.

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

Разверните свой статический сайт, используя [Kinsta](https://kinsta.com/static-site-hosting/) и следуя этим [инструкциям](https://kinsta.com/docs/static-site-hosting/static-site-quick-start/react-static-site-examples/#react-with-vite).

## Хостинг статических сайтов xmit {#xmit-static-site-hosting}

Разверните свой статический сайт, используя [xmit](https://xmit.co) и следуя этому [руководству](https://xmit.dev/posts/vite-quickstart/).

## Zephyr Cloud

[Zephyr Cloud](https://zephyr-cloud.io) — это платформа для развёртывания, которая интегрируется непосредственно в ваш процесс сборки и обеспечивает глобальное распределение на периферии для федерации модулей и других типов приложений.

Zephyr использует подход, отличный от других облачных провайдеров. Он интегрируется непосредственно с процессом сборки Vite, поэтому каждый раз, когда вы собираете или запускаете сервер разработки для вашего приложения, оно автоматически развёртывается с помощью Zephyr Cloud.

Следуйте инструкциям в [руководстве по развёртыванию Vite](https://docs.zephyr-cloud.io/bundlers/vite), чтобы начать.

## EdgeOne Pages

Разверните свой статический сайт с помощью [EdgeOne Pages](https://edgeone.ai/products/pages), следуя этим [инструкциям](https://pages.edgeone.ai/document/vite).
