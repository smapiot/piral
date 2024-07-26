import { fail } from './log';

export function ensure(name: string, value: any, expectedType: string | Array<string>) {
  const actualType = typeof value;
  const expectedTypes = Array.isArray(expectedType) ? expectedType : [expectedType];

  if (!expectedTypes.includes(actualType)) {
    const type = expectedTypes.length === 1 ? `"${expectedTypes[0]}"` : `one of "${expectedTypes.join('", "')}"`;
    fail('generalError_0002', `The type for "${name}" is invalid - it should be ${type}, but was "${actualType}".`);
  }
}
