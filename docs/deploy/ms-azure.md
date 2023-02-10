---
title: Microsoft Azure
description: How to deploy your Piral instance to the web using Microsoft Azure.
---

# ![Microsoft Azure Logo](../logos/ms-azure.svg){height=24px} Deploy your Piral instance to Microsoft Azure

[Azure](https://azure.microsoft.com/) is a cloud platform from Microsoft. You can deploy your Piral instance with Microsoft Azure's [Static Web Apps](https://aka.ms/staticwebapps) service.

## Prerequisites

To follow this guide you will need:

- An Azure account and a subscription key. You can create a [free Azure account here](https://azure.microsoft.com/free).
- An Azure Static Web App created via the portal. See [the guide online](https://learn.microsoft.com/en-us/azure/static-web-apps/get-started-portal?tabs=vanilla-javascript&pivots=github). **Important**: As deployment source select "custom". You'll need to have a valid *deployment token* for the created Azure Static Web App.

## How to deploy

1. Install the `@azure/static-web-apps-cli` npm package using `npm i @azure/static-web-apps-cli --save-dev` or a similar command for your preferred package manager.

2. Build your Piral instance using `npx piral build`. The output should be available in `dist/release`.

3. Publish the Piral instance using `npx swa deploy ./dist/release --env production --deployment-token $SWA_TOKEN` where `SWA_TOKEN` is the deployment token of your Azure Static Web App.
