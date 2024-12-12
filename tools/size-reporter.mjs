import { reportFileSizeImpactInGitHubPullRequest, readGitHubWorkflowEnv } from '@jsenv/file-size-impact';

await reportFileSizeImpactInGitHubPullRequest({
  ...readGitHubWorkflowEnv(),
  buildCommand: 'npx lerna run build:release',
  installCommand: 'yarn setup',
  fileSizeReportUrl: new URL("./size-generator.mjs#fileSizeReport", import.meta.url),
});
