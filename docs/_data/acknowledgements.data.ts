export interface Dependency {
  name: string
  description?: string
  author?: string
  authorUrl?: string
  repository?: string
  funding?: string
}

export interface PastDependency {
  name: string
  description: string
  repository: string
}

export interface AuthorPackage {
  name: string
  funding?: string
}

export interface Author {
  name: string
  url?: string
  funding?: string
  packages: AuthorPackage[]
}

export interface AcknowledgementsData {
  bundledDependencies: Dependency[]
  notableDependencies: Dependency[]
  devTools: Dependency[]
  pastNotableDependencies: PastDependency[]
  authors: Author[]
}

const notableDependencies: Dependency[] = [
  {
    name: 'rolldown',
    description: 'Fast JavaScript/TypeScript bundler in Rust with Rollup-compatible API',
    repository: 'https://github.com/rolldown/rolldown',
  },
  {
    name: 'postcss',
    description: 'Tool for transforming styles with JS plugins',
    author: 'Andrey Sitnik',
    authorUrl: 'https://sitnik.ru',
    repository: 'https://github.com/postcss/postcss',
    funding: 'https://opencollective.com/postcss',
  },
  {
    name: 'lightningcss',
    description: 'A CSS parser, transformer, and minifier written in Rust',
    repository: 'https://github.com/parcel-bundler/lightningcss',
    funding: 'https://opencollective.com/parcel',
  },
  {
    name: 'chokidar',
    description: 'Minimal and efficient cross-platform file watching library',
    author: 'Paul Miller',
    authorUrl: 'https://paulmillr.com',
    repository: 'https://github.com/paulmillr/chokidar',
    funding: 'https://paulmillr.com/funding/',
  },
  {
    name: 'magic-string',
    description: 'Modify strings, generate sourcemaps',
    author: 'Rich Harris',
    repository: 'https://github.com/Rich-Harris/magic-string',
  },
]

const devTools: Dependency[] = [
  {
    name: 'eslint',
    description: 'An AST-based pattern checker for JavaScript',
    author: 'Nicholas C. Zakas',
    repository: 'https://github.com/eslint/eslint',
    funding: 'https://eslint.org/donate',
  },
  {
    name: 'playwright-chromium',
    description: 'Chromium build for Playwright',
    author: 'Microsoft Corporation',
    repository: 'https://github.com/microsoft/playwright',
  },
  {
    name: 'prettier',
    description: 'Prettier is an opinionated code formatter',
    author: 'James Long',
    repository: 'https://github.com/prettier/prettier',
    funding: 'https://github.com/prettier/prettier?sponsor=1',
  },
  {
    name: 'typescript',
    description: 'TypeScript is a language for application scale JavaScript development',
    author: 'Microsoft Corporation',
    repository: 'https://github.com/microsoft/TypeScript',
  },
  {
    name: 'vitest',
    description: 'Next generation testing framework powered by Vite',
    author: 'Anthony Fu',
    repository: 'https://github.com/vitest-dev/vitest',
    funding: 'https://opencollective.com/vitest',
  },
]

const pastNotableDependencies: PastDependency[] = [
  {
    name: 'esbuild',
    description:
      'JavaScript/TypeScript bundler and minifier (now using Rolldown, Oxc, and LightningCSS)',
    repository: 'https://github.com/evanw/esbuild',
  },
  {
    name: 'rollup',
    description: 'ES module bundler (now using Rolldown)',
    repository: 'https://github.com/rollup/rollup',
  },
  {
    name: 'http-proxy',
    description: 'HTTP proxying (now using http-proxy-3)',
    repository: 'https://github.com/http-party/node-http-proxy',
  },
  {
    name: 'acorn',
    description: 'JavaScript parser',
    repository: 'https://github.com/acornjs/acorn',
  },
  {
    name: 'fast-glob',
    description: 'Fast glob matching (now using tinyglobby/fdir)',
    repository: 'https://github.com/mrmlnc/fast-glob',
  },
  {
    name: 'debug',
    description: 'Debug logging (now using obug)',
    repository: 'https://github.com/debug-js/debug',
  },
]

function groupByAuthor(dependencies: Dependency[]): Author[] {
  const authorMap = new Map()

  for (const dep of dependencies) {
    if (dep.author) {
      const existing = authorMap.get(dep.author)
      if (existing) {
        existing.packages.push({ name: dep.name, funding: dep.funding })
        if (!existing.url && dep.authorUrl) {
          existing.url = dep.authorUrl
        }
      } else {
        authorMap.set(dep.author, {
          url: dep.authorUrl,
          packages: [{ name: dep.name, funding: dep.funding }],
        })
      }
    }
  }

  return Array.from(authorMap.entries())
    .map(([name, info]: [string, { url?: string; packages: AuthorPackage[] }]) => {
      const sortedPackages = info.packages.sort((a, b) =>
        a.name.localeCompare(b.name),
      )
      const fundingUrls = new Set(
        sortedPackages.map((p) => p.funding).filter(Boolean),
      )
      const sharedFunding =
        fundingUrls.size === 1 ? [...fundingUrls][0] : undefined
      return {
        name,
        url: info.url,
        funding: sharedFunding,
        packages: sharedFunding
          ? sortedPackages.map((p) => ({ name: p.name }))
          : sortedPackages,
      }
    })
    .sort((a, b) => a.name.localeCompare(b.name))
}

function loadData(): AcknowledgementsData {
  const allDeps = [...notableDependencies, ...devTools]

  return {
    bundledDependencies: [],
    notableDependencies,
    devTools,
    pastNotableDependencies,
    authors: groupByAuthor(allDeps),
  }
}

declare const data: AcknowledgementsData
export { data }

export default {
  watch: ['../../node_modules/vite/LICENSE.md'],
  load(): AcknowledgementsData {
    return loadData()
  },
}