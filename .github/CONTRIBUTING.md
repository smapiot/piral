# Contributing

:tada: First off, thanks for taking the time to contribute!

The following is a set of guidelines for contributing to Piral, which is hosted in the smapiot organization on GitHub. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.

## Code of Conduct

This project and everyone participating in it is governed by the [Code of Conduct](../CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the email specified there.

## How Can I Contribute

### Development Instructions

Please find more information about how to set up your machine for developing Piral in [the source documentation](../src/README.md).

### Reporting Bugs

Before creating a bug report, please make sure that you first check the [existing issues](https://github.com/smapiot/piral/issues?q=is%3Aopen+is%3Aissue+label%3Abug), as you might find that the issue is already reported. Fill out [the required template](https://github.com/smapiot/piral/issues/new?template=bug_report.md), the information it asks for helps us resolve issues faster.

Following these guidelines helps maintainers and the community understand your report :pencil:, reproduce the behavior :computer:, and find related reports :mag_right:.

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for Piral, including completely new features and minor improvements to existing functionality.

Before creating enhancement suggestions, please make sure that you first check the [existing suggestions](https://github.com/smapiot/piral/issues?q=is%3Aopen+is%3Aissue+label%3Aenhancement), as you might find that the enhancement has already been requested. Fill out [the template](https://github.com/smapiot/piral/issues/new?template=feature_request.md), including the steps that you imagine you would take if the feature you're requesting existed.

#### How Do I Submit a Suggestion

Enhancements or general suggestions are tracked as [GitHub issues](https://docs.github.com/en/issues/tracking-your-work-with-issues/about-issues). After you've determined that the enhancement is not already requested, go ahead and create an issue providing the following information:

- **Use a clear and descriptive title** for the issue to identify the suggestion.
- **Provide a step-by-step description of the suggested enhancement** in as many details as possible.
- **Describe the current behavior** and **explain which behavior you expected to see instead** and why.
- **Include screenshots and animated GIFs** which help you demonstrate the steps or point out the part of Piral to which the suggestion is related. *Note*: We usually live in code. Any code you can already show would be the best illustration.

## Branching Model

### Main Branches

The central repository holds four main branches with an infinite lifetime:

- **main**
- **develop**
- **experimental**
- **documentation**

We consider `main` to be the main branch where the source code always reflects a production-ready state, and `develop` to be the main branch where the source code always reflects a state with the latest delivered changes for the next release. When the source code in the `develop` branch reaches a stable point and is ready to be released, all of the changes should be merged back into main. Therefore, each time when changes are merged back into main, this is a new production release.

The **experimental** branch is a special branch for an upcoming release that is unclear in scope and functionality. Releases from this branch should be considered unstable and might never reach production. No hotfixes or minor updates will be first-pushed to this branch. Instead, only (experimental) new features are (potentially exclusively) added to this branch.

The **documentation** branch is used for updates and fixes to the currently live (i.e., `main`-build) documentation.

The following table gives an overview:

| Branch Name   | Builds Documentation | NPM Release/Tag | Version Suffix |
| ------------- | -------------------- | --------------- | -------------- |
| main          | yes (indirectly)     | latest          | (none)         |
| develop       | no                   | next            | beta           |
| experimental  | no                   | canary          | alpha          |
| documentation | yes                  | (none)          | (none)         |

If you don't know what to do - use `develop` as a target for pull requests.

### Supporting Branches

Next to the main branches `main` and `develop`, our development model uses a few supporting branches to aid parallel development between team members, ease tracking of features, and assist in quickly fixing live production problems. Unlike the main branches, these branches always have a limited lifetime, since they will be removed eventually.

The two main different types of branches we may use are:

- **Feature branches**, i.e., `feature/*`
- **Hotfix branches**, i.e., `hotfix/*`

#### Creating a Feature Branch

Create a branch **from** `develop` which must merge back **into** `develop`.

Naming convention:

- anything except `main`, `develop`, `release/*`, or `hotfix/*`
- preferred `feature/{issue-id}-{issue-description}`, e.g., `feature/#123-add-foo`

#### Creating a Hotfix Branch

Create a branch **from** `main` which must merge back **into** either `main` and/or `develop`. While a *real* hotfix will apply to both immediately, a simple fix will just be applied to `develop`.

Naming convention:

- `hotfix/{new-patch-version}`, e.g., `hotfix/1.2.1`
- `hotfix/{issue-id}-{issue-description}`, e.g., `hotfix/#123-fixed-foo-undefined`

Hotfix branches are normally created from the `main` branch (especially if they are applied to both `main` and `develop`, otherwise creating the branch from `develop` may be okay as well). For example, say version 1.2 is the current production release running live and causing troubles due to a severe bug, while changes on develop are yet unstable.

## Pull Request Process

Following is a short guide on how to make a valid Pull Request.

1. Firstly you need a local fork of the project, so go ahead and press the `fork` button in
   GitHub. This will create a copy of the repository in your own GitHub account and you'll see a
   note that it's been forked underneath the project name: `Forked from smapiot/piral`.
   Clone the newly forked repository locally and set up a new remote that points to the original
   project so that you can grab any changes and bring them into your local copy.

   ```sh
   git remote add upstream git@github.com:smapiot/piral.git
   ```

   You now have two remotes for this project on disk:

   1. `origin` which points to your GitHub fork of the project.
      You can read and write on this remote.
   2. `upstream` which points to the main project's GitHub repository.
      You can only read from this remote.

2. Create the branch, following or [Branching Model](#branching-model).

3. Do some work :) This is the fun part where you get to contribute to Piral :rocket:.

4. Before pushing your code, there are a few more tasks that need to be performed:

   - Make sure that the test and build scripts run successfully

     ```sh
     npm test
     lerna run build
     ```

   - Update the *CHANGELOG.md* following our convention

5. Commit and push the code to the origin.

   ```sh
   git commit -m "Description of my awesome new feature"
   git push origin HEAD
   ```

6. After the code is successfully pushed to the origin repository, navigate to
   [Piral repository](https://github.com/smapiot/piral/pulls) and issue a new pull
   request.

You may merge the Pull Request once you have the sign-off of at least one other (core) developer, or if you do not have permission to do that, you may request the reviewer to merge it for you.

## Quick Code Structure Overview

```mermaid
flowchart TB
    subgraph Core["Core Framework Layer"]
        Base["Base Infrastructure"]
        Core_["Core Framework"]
        Main["Main Framework"]
        Base --> Core_
        Core_ --> Main
    end

    subgraph Plugins["Plugin Architecture"]
        subgraph Auth["Authentication"]
            ADAL["ADAL Plugin"]
            OAuth["OAuth2 Plugin"]
            OIDC["OIDC Plugin"]
        end

        subgraph UI["UI Components"]
            Dashboard["Dashboard"]
            Menu["Menu"]
            Modals["Modals"]
        end

        subgraph State["State Management"]
            Containers["Containers"]
            Feeds["Feeds"]
        end

        subgraph Utils["Utilities"]
            Translate["Translation"]
            Tracking["Tracking"]
        end
    end

    subgraph Converters["Converter System"]
        React["React"]
        Angular["Angular"]
        Vue["Vue"]
        Vue3["Vue 3"]
        Svelte["Svelte"]
        Solid["Solid"]
    end

    subgraph DevTools["Development Tooling"]
        CLI["CLI Tools"]
        Build["Build System"]
        Debug["Debug Utilities"]
    end

    Core --> Plugins
    Core --> Converters
    Core --> DevTools

    %% Click events for Core Layer
    click Base "https://github.com/smapiot/piral/tree/develop/src/framework/piral-base"
    click Core_ "https://github.com/smapiot/piral/tree/develop/src/framework/piral-core"
    click Main "https://github.com/smapiot/piral/tree/develop/src/framework/piral"

    %% Click events for Plugins
    click ADAL "https://github.com/smapiot/piral/tree/develop/src/plugins/piral-adal"
    click OAuth "https://github.com/smapiot/piral/tree/develop/src/plugins/piral-oauth2"
    click OIDC "https://github.com/smapiot/piral/tree/develop/src/plugins/piral-oidc"
    click Dashboard "https://github.com/smapiot/piral/tree/develop/src/plugins/piral-dashboard"
    click Menu "https://github.com/smapiot/piral/tree/develop/src/plugins/piral-menu"
    click Modals "https://github.com/smapiot/piral/tree/develop/src/plugins/piral-modals"
    click Containers "https://github.com/smapiot/piral/tree/develop/src/plugins/piral-containers"
    click Feeds "https://github.com/smapiot/piral/tree/develop/src/plugins/piral-feeds"
    click Translate "https://github.com/smapiot/piral/tree/develop/src/plugins/piral-translate"
    click Tracking "https://github.com/smapiot/piral/tree/develop/src/plugins/piral-tracking"

    %% Click events for Converters
    click React "https://github.com/smapiot/piral/tree/develop/src/converters/piral-react"
    click Angular "https://github.com/smapiot/piral/tree/develop/src/converters/piral-ng"
    click Vue "https://github.com/smapiot/piral/tree/develop/src/converters/piral-vue"
    click Vue3 "https://github.com/smapiot/piral/tree/develop/src/converters/piral-vue-3"
    click Svelte "https://github.com/smapiot/piral/tree/develop/src/converters/piral-svelte"
    click Solid "https://github.com/smapiot/piral/tree/develop/src/converters/piral-solid"

    %% Click events for DevTools
    click CLI "https://github.com/smapiot/piral/tree/develop/src/tooling/piral-cli"
    click Build "https://github.com/smapiot/piral/tree/develop/src/tooling/piral-cli-webpack5"
    click Debug "https://github.com/smapiot/piral/tree/develop/src/utilities/piral-debug-utils"

    %% Styling
    classDef core fill:#blue,stroke:#333,stroke-width:2px
    classDef plugin fill:#green,stroke:#333,stroke-width:2px
    classDef converter fill:#purple,stroke:#333,stroke-width:2px
    classDef devtool fill:#orange,stroke:#333,stroke-width:2px

    class Base,Core_,Main core
    class ADAL,OAuth,OIDC,Dashboard,Menu,Modals,Containers,Feeds,Translate,Tracking plugin
    class React,Angular,Vue,Vue3,Svelte,Solid converter
    class CLI,Build,Debug devtool
```
