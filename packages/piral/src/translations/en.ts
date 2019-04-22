import { FluentBundle, ftl } from 'fluent';

export const en = new FluentBundle('en-US');

en.addMessages(ftl`
  loading = Loading ...
  pageError =
    .title = The page crashed.
    .description =
  notFoundError =
    .title = Page not found.
    .description =
  loadingError =
    .title = Something went wrong.
    .description =
  feedError =
    .title = Data unavailable.
    .description =
  formError =
    .title = Form submission failed.
    .description =
  unknownError =
    .title = An unknown error occured.
    .description =
`);
