---
pageType: home
hero:
  name: Piral
  text: Micro frontends that actually ship
  tagline: Compose your web application at runtime from independently deployed modules. Give each team full autonomy without sacrificing a coherent user experience.
  image:
    src: /piral-mark.svg
    alt: Piral
  actions:
    - theme: brand
      text: Get started
      link: /getting-started/introduction
    - theme: alt
      text: GitHub
      link: https://github.com/smapiot/piral
features:
  - title: Independent deploys
    details: Each team ships their pilet on their own schedule. No shared release windows. No coordination overhead. Push a fix at 2pm Friday without touching anyone else.
    icon: 🚀
  - title: Distributed sharing
    details: Dependencies are shared across pilets automatically — not just from a central app shell. Any pilet can share a library with others via its own importmap.
    icon: 🔗
  - title: Extension slots
    details: Pilets contribute UI into each other's pages without coupling. The cart page doesn't know about the promotions team. They connect through named slots at runtime.
    icon: 🧩
  - title: The emulator
    details: Develop any pilet locally against the real app shell with hot reload — without running the full platform. One npm install and you're working.
    icon: ⚡
  - title: Dynamic discovery
    details: The feed service controls which pilets load for which users. Roll out a new pilet to 10% of users. Roll back a bad one in seconds. No app shell redeploy.
    icon: 🎯
  - title: Framework agnostic
    details: Write pilets in React, Angular, Vue, Svelte, Solid, Blazor, or plain web components. The app shell stays React. The pilets stay independent.
    icon: 🌐
---
