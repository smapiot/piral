---
title: Environment Variables
description: The used environment variables to determine some behavior of Piral.
section: Internals
---

# Environment Variables

The `piral-cli` sets some environment variables depending on what kind of task is demanded.

In pretty much all cases the environment variables `BUILD_TIME`, `BUILD_TIME_FULL`, `BUILD_PCKG_VERSION`, `BUILD_PCKG_NAME`, and `PIRAL_CLI_VERSION` are being set. In many bundlers (e.g., using `esbuild` via `piral-cli-esbuild`) you can access these variables in your frontend code via, e.g., `process.env.BUILD_TIME`. When the bundler supports this the reference in your frontend code will be just replaced with the current value of the environment variable.

Some bundlers such as `parcel` v2 (e.g., via `piral-cli-parcel2`) will not allow you to access these variables. In that case you can still replace / use them via, e.g., some plugin for the bundler or a *.codegen* file.

## General Variables

The following variables are always available:

| Name | Purpose | Example |
|------|---------|---------|
| `BUILD_TIME` | - | `Mon Aug 15 2022` |
| `BUILD_TIME_FULL` | - | `2022-08-15T19:08:23.719Z` |
| `BUILD_PCKG_VERSION` | - | `1.0.0` |
| `BUILD_PCKG_NAME` | - | `my-app` |
| `PIRAL_CLI_VERSION` | - | `0.15.0` |
| `NODE_ENV` | - | `production` |

## Piral Build Variables

The following variables are available when `piral build` or `piral debug` (or related commands such as `piral publish`) is running:

| Name | Purpose | Example |
|------|---------|---------|
| `SHARED_DEPENDENCIES` | - | `react,react-dom` |
| `PIRAL_PUBLIC_PATH` | - | `/foo` |
| `DEBUG_PIRAL` | - | `0.15` |
| `DEBUG_PILET` | - | `on` |

## Pilet Build Variables

The following variables are available when `pilet build` or `pilet debug` (or related commands such as `pilet publish`) is running:

| Name | Purpose | Example |
|------|---------|---------|
| `PIRAL_INSTANCE` | - | `my-app` |
