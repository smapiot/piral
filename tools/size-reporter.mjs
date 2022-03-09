import { reportFileSizeImpact, readGitHubWorkflowEnv } from '@jsenv/file-size-impact';

await reportFileSizeImpact({
  ...readGitHubWorkflowEnv(),
  buildCommand: 'npx lerna run build:release',
  installCommand: 'yarn setup',
  fileSizeReportModulePath: './tools/size-generator.mjs#fileSizeReport',
});
