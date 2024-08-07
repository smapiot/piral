---
title: Overview
description: Overview of the deployment guides.
---

# Deployment Guides Overview

We have a few guides for some of the most popular hosting services online.

<div class="deploy-guides">

[![AWS Amplify](../logos/aws-amplify.svg){.auto}](./aws-amplify.md)

[![Buddy](../logos/buddy.svg)](./buddy.md)

[![Cloudflare Pages](../logos/cloudflare.svg)](./cloudflare.md)

[![Edge.io](../logos/edgio.svg)](./edgio.md)

[![GitHub Pages](../logos/github.svg){.auto}](./github.md)

[![GitLab Pages](../logos/gitlab.svg)](./gitlab.md)

[![Google Cloud](../logos/google-cloud.svg)](./google-cloud.md)

[![Google Firebase](../logos/google-firebase.svg)](./google-firebase.md)

[![Heroku](../logos/heroku.svg){.auto}](./heroku.md)

[![Microsoft Azure Static Web Apps](../logos/ms-azure.svg)](./ms-azure.md)

[![Netlify](../logos/netlify.svg)](./netlify.md)

[![Render](../logos/render.svg)](./render.md)

[![Vercel](../logos/vercel.svg){.auto}](./vercel.md)

</div>

In general, you an always use Piral as a static web site on some public storage. If you want to run a Docker container instead you could place your static files in an nginx container:

```docker
FROM nginx as webserver

WORKDIR /usr/share/nginx/html

COPY dist/release/ .

COPY nginx.conf /etc/nginx/nginx.conf
```

In this case the *nginx.conf* file could be (add, remove, or modify the security headers as you need them):

```nginx
events {
    worker_connections 1024;
}

http {
    include mime.types;

    server {
        error_log /var/log/nginx/localhost.error.log error;
        listen 80;
        server_name localhost;

        # Hide nginx version in server http header
        server_tokens off;

        # Define security http header
        add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'; script-src 'self' assets.piral.cloud 'unsafe-eval'; object-src 'self'" always;
        add_header Strict-Transport-Security 'max-age=31536000; includeSubdomains; preload' always;
        add_header X-Content-Type-Options 'nosniff' always;
        add_header X-Frame-Options 'SAMEORIGIN' always;
        add_header X-XSS-Protection '1; mode=block' always;

        # Enable gzip
        gzip on;

        index index.html;
        root /usr/share/nginx/html;

        location / {
            try_files $uri $uri/ /index.html;
        }
    }
}
```
