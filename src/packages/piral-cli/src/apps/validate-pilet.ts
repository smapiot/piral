export interface ValidatPiletOptions {
  entry?: string;
  app?: string;
  logLevel?: 1 | 2 | 3;
}

export const validatePiletDefaults = {
  entry: './src/index',
  logLevel: 3 as const,
};

export async function validatePilet(baseDir = process.cwd(), options: ValidatPiletOptions = {}) {
  const { entry = validatePiletDefaults.entry, logLevel = validatePiletDefaults.logLevel } = options;
  //TODO
}
