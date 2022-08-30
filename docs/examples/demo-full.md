---
title: Full Piral
---

# Example: Full Piral

An example app based on `piral`.

> Pilets are fetched dynamically. Data loading and pilet communication is demonstrated.

## Description

The sample shows how a full Piral instance can be created using a completely custom UI and only standard functional components. The idea behind this example is to illustrate how little needs to be done to create a micro frontend shell. A virtual pilet is brought in via the attach API.

![Piral Full Demo](../diagrams/demo-full.png)

No backend interactions are mocked. However, there is no sample gateway. Instead, pilets are going directly through different backend services such as the OpenWeather API. Pilets are retrieved from the sample feed.

The sample pilets are all available in our sample pilets repository on GitHub. Each sample is also published on NPM to easily allow playing around with them.

## Links

- [Demo Online](https://demo-full.piral.io)
- [Code on GitHub](https://github.com/smapiot/piral/tree/main/src/samples/sample-piral)
