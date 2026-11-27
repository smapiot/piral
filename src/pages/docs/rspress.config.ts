import { defineConfig } from '@rspress/core';

import { getRoot } from './scripts/get-root.mjs';

const root = getRoot();

export default defineConfig({
  root,
  title: 'Piral',
  description: 'Framework for next-generation micro frontend applications',
  icon: '/favicon.svg',
  // Old per-package reference pages were consolidated into /reference/piral-packages
  route: {
    exclude: [
      'reference/piral-package.md',
      'reference/piral-core.md',
      'reference/piral-base.md',
      'api/create-instance.md',
      'api/standard-pilet-api.md',
      'commands/*',
      'deploy/*',
      'messages/*',
      'specs/*',
      'tips.md',
    ],
  },
  logo: {
    light: '/piral-logo.svg',
    dark: '/piral-logo-dark.svg',
  },
  themeConfig: {
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/smapiot/piral',
      },
      {
        icon: 'discord',
        mode: 'link',
        content: 'https://discord.gg/kKJ2FZmK8t',
      },
    ],
    editLink: {
      docRepoBaseUrl: 'https://github.com/smapiot/piral/tree/documentation/docs',
    },
    footer: {
      message:
        'Released under the <a href="https://opensource.org/licenses/MIT">MIT License</a>. Built with <a href="https://rspress.rs">Rspress</a>.',
    },
    enableScrollToTop: true,
    nav: [
      { text: 'Guide', link: '/getting-started/introduction', activeMatch: '^/(getting-started|concepts|guides)/' },
      { text: 'Reference', link: '/reference/cli', activeMatch: '^/(reference|api)/' },
      { text: 'Advanced', link: '/advanced/custom-feed', activeMatch: '^/advanced/' },
    ],
    sidebar: {
      '/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'What is Piral?', link: '/getting-started/introduction' },
            { text: 'Quick start', link: '/getting-started/quick-start' },
            { text: 'Why micro frontends?', link: '/getting-started/why-micro-frontends' },
            { text: 'Why Piral?', link: '/getting-started/why-piral' },
            { text: 'Project structure', link: '/getting-started/project-structure' },
          ],
        },
        {
          text: 'Concepts',
          items: [
            { text: 'Architecture overview', link: '/concepts/architecture' },
            { text: 'App shell', link: '/concepts/app-shell' },
            { text: 'Pilets', link: '/concepts/pilets' },
            { text: 'Feed service', link: '/concepts/feed-service' },
            { text: 'Pilet API', link: '/concepts/pilet-api' },
            { text: 'Dependency sharing', link: '/concepts/dependency-sharing' },
            { text: 'Emulator', link: '/concepts/emulator' },
            { text: 'Extension slots', link: '/concepts/extension-slots' },
          ],
        },
        {
          text: 'Guides',
          items: [
            { text: 'Building your app shell', link: '/guides/building-app-shell' },
            { text: 'Creating your first pilet', link: '/guides/creating-pilet' },
            { text: 'Routing & navigation', link: '/guides/routing' },
            { text: 'Sharing state between pilets', link: '/guides/shared-state' },
            { text: 'Multi-framework pilets', link: '/guides/multi-framework' },
            { text: 'Authentication', link: '/guides/authentication' },
            { text: 'Testing', link: '/guides/testing' },
            { text: 'TypeScript types', link: '/guides/typescript' },
            { text: 'Deploying to production', link: '/guides/deployment' },
            { text: 'Using LLMs with Piral', link: '/guides/llms' },
          ],
        },
        {
          text: 'Advanced',
          items: [
            { text: 'Custom feed services', link: '/advanced/custom-feed' },
            { text: 'Performance & lazy loading', link: '/advanced/performance' },
            { text: 'Module & Native Federation', link: '/advanced/module-federation' },
            { text: 'Pilet portability', link: '/advanced/pilet-portability' },
            { text: 'Monorepo setup', link: '/advanced/monorepo' },
            { text: 'Server-side rendering', link: '/advanced/ssr' },
            { text: 'Migrating from a monolith', link: '/advanced/migration' },
          ],
        },
        {
          text: 'Reference',
          items: [
            { text: 'CLI reference', link: '/reference/cli' },
            { text: 'Configuration', link: '/reference/configuration' },
            { text: 'Piral packages', link: '/reference/piral-packages' },
            { text: 'Hooks', link: '/api/hooks' },
            { text: 'Piral Plugins', link: '/api/piral-plugin' },
            { text: 'Official plugins', link: '/reference/plugins' },
            { text: 'Creating a converter', link: '/reference/creating-a-converter' },
          ],
        },
      ],
    },
  },
});
