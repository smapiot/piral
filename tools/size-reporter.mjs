import { reportFileSizeImpact, readGitHubWorkflowEnv } from '@jsenv/file-size-impact';

await reportFileSizeImpact({
  ...readGitHubWorkflowEnv(),
  buildCommand: 'npx lerna run build:release',
  installCommand: 'npx lerna bootstrap',
  fileSizeReportModulePath: './tools/size-generator.mjs#fileSizeReport',
});
