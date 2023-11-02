import { describe, it, expect } from 'vitest';
import { satisfies, validate } from './version';

describe('semver check module', () => {
  it('specific publish version is valid', () => {
    const result = validate('1.2.3');
    expect(result).toBeTruthy();
  });

  it('satisfies works with x notation', () => {
    const result = satisfies('13.0.1', '13.x');
    expect(result).toBeTruthy();
  });

  it('satisfies works with caret notation', () => {
    const result = satisfies('13.0.1', '^13.0.0');
    expect(result).toBeTruthy();
  });

  it('shortened publish version is valid', () => {
    const result = validate('1.2');
    expect(result).toBeTruthy();
  });

  it('some hash is invalid', () => {
    const result = validate('fabcde');
    expect(result).toBeFalsy();
  });

  it('some longer hash is invalid', () => {
    const result = validate('123fabdef0012');
    expect(result).toBeFalsy();
  });

  it('major publish version is valid', () => {
    const result = validate('1');
    expect(result).toBeTruthy();
  });

  it('any publish version is valid', () => {
    const result = validate('1.2.x');
    expect(result).toBeTruthy();
  });

  it('specific preview version is valid', () => {
    const result = validate('1.2.3-pre.123');
    expect(result).toBeTruthy();
  });

  it('caret version is specifier valid', () => {
    const result = validate('^1.2.3');
    expect(result).toBeTruthy();
  });

  it('tilde version is specifier valid', () => {
    const result = validate('~1.2.3');
    expect(result).toBeTruthy();
  });

  it('greater version is specifier valid', () => {
    const result = validate('>1.2.3');
    expect(result).toBeTruthy();
  });

  it('greater equals version is specifier valid', () => {
    const result = validate('>=1.2.3');
    expect(result).toBeTruthy();
  });

  it('greater equals with x version is specifier valid', () => {
    const result = validate('>=1.x');
    expect(result).toBeTruthy();
  });

  it('satisfies exact version match', () => {
    const result = satisfies('1.2.3', '1.2.3');
    expect(result).toBeTruthy();
  });

  it('does not satisfy exact version mismatch greater', () => {
    const result = satisfies('1.2.3', '1.2.4');
    expect(result).toBeFalsy();
  });

  it('does not satisfy exact version mismatch smaller', () => {
    const result = satisfies('1.2.3', '1.2.2');
    expect(result).toBeFalsy();
  });

  it('satisfies constraint with caret patch', () => {
    const result = satisfies('1.2.3', '^1.2.0');
    expect(result).toBeTruthy();
  });

  it('satisfies constraint with caret minor', () => {
    const result = satisfies('1.3.0', '^1.2.0');
    expect(result).toBeTruthy();
  });

  it('satisfies constraint with caret exact', () => {
    const result = satisfies('1.3.0', '^1.3.0');
    expect(result).toBeTruthy();
  });

  it('satisfies constraint with caret exact with dropped number', () => {
    const result = satisfies('1.3.0', '^1.3');
    expect(result).toBeTruthy();
  });

  it('satisfies constraint with caret exact with dropped numbers', () => {
    const result = satisfies('1', '^1');
    expect(result).toBeTruthy();
  });

  it('does not satisfy constraint with caret major', () => {
    const result = satisfies('2.0.0', '^1.2.0');
    expect(result).toBeFalsy();
  });

  it('satisfies constraint with tilde patch', () => {
    const result = satisfies('1.2.3', '~1.2.0');
    expect(result).toBeTruthy();
  });

  it('does not satisfy constraint with tilde minor', () => {
    const result = satisfies('1.3.0', '~1.2.0');
    expect(result).toBeFalsy();
  });

  it('does not satisfy constraint with tilde patch greater', () => {
    const result = satisfies('1.3.0', '~1.3.2');
    expect(result).toBeFalsy();
  });

  it('satisfies constraint with tilde patch lighter', () => {
    const result = satisfies('1.3.3', '~1.3.2');
    expect(result).toBeTruthy();
  });

  it('satisfies constraint with x patch', () => {
    const result = satisfies('1.2.3', '1.x.3');
    expect(result).toBeTruthy();
  });

  it('does not satisfy constraint x minor', () => {
    const result = satisfies('1.3.0', '1.2.x');
    expect(result).toBeFalsy();
  });

  it('satsfies greater than matching', () => {
    const result = satisfies('1.3.0', '>=1.2.0');
    expect(result).toBeTruthy();
  });

  it('satsfies less than matching', () => {
    const result = satisfies('1.3.0', '<=1.3.0');
    expect(result).toBeTruthy();
  });

  it('does not satisfy only greater than non-matching', () => {
    const result = satisfies('1.3.0', '>1.3.0');
    expect(result).toBeFalsy();
  });

  it('does not satisfy greater than non-matching', () => {
    const result = satisfies('1.3.0', '>=1.3.1');
    expect(result).toBeFalsy();
  });

  it('does not satisfy less than non-matching', () => {
    const result = satisfies('1.3.0', '<=1.2.0');
    expect(result).toBeFalsy();
  });

  it('does not satisfy less than non-matching', () => {
    const result = satisfies('1.3.0', '<1.3.0');
    expect(result).toBeFalsy();
  });

  it('does not satisfy less than non-matching', () => {
    const result = satisfies('1.3.0', '<=1.2.0');
    expect(result).toBeFalsy();
  });

  it('satisfies exact version match with previews', () => {
    const result = satisfies('1.2.3-pre.5', '1.2.3-pre.5');
    expect(result).toBeTruthy();
  });

  it('satisfies exact version match with dropped number', () => {
    const result = satisfies('1.0', '1');
    expect(result).toBeTruthy();
  });

  it('satisfies exact version match with dropped numbers', () => {
    const result = satisfies('1', '1.0.0');
    expect(result).toBeTruthy();
  });

  it('does not satisfy exact version mismatch preview', () => {
    const result = satisfies('1.2.4-pre.5', '1.2.4-pre.6');
    expect(result).toBeFalsy();
  });

  it('does not satisfy exact version mismatch preview version offered', () => {
    const result = satisfies('1.2.4-beta', '1.2.4-beta.5');
    expect(result).toBeFalsy();
  });

  it('does not satisfy exact version mismatch preview version demanded', () => {
    const result = satisfies('1.2.4-beta.5', '1.2.4-beta');
    expect(result).toBeFalsy();
  });

  it('does not satisfy exact version mismatch preview higher', () => {
    const result = satisfies('1.2.4-gamma', '1.2.4-beta');
    expect(result).toBeFalsy();
  });

  it('does not satisfy exact version mismatch preview smaller', () => {
    const result = satisfies('1.2.4-alpha', '1.2.4-beta');
    expect(result).toBeFalsy();
  });

  it('does not satisfy exact and preview mismatch', () => {
    const result = satisfies('1.2.4-pre.5', '1.2.4');
    expect(result).toBeFalsy();
  });

  it('satisfies just an x', () => {
    const result = satisfies('1.2.3', 'x');
    expect(result).toBeTruthy();
  });

  it('satisfies just a *', () => {
    const result = satisfies('1.2.3', '*');
    expect(result).toBeTruthy();
  });

  it('satisfies just a >=0', () => {
    const result = satisfies('1.2.3', '>=0');
    expect(result).toBeTruthy();
  });
});
