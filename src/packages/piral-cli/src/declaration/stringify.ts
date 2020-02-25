import { getRefName, makeIdentifier } from './helpers';
import {
  TypeRefs,
  TypeModel,
  TypeModelObject,
  TypeModelProp,
  TypeModelFunction,
  TypeModelIndex,
  TypeModelFunctionParameter,
  WithTypeArgs,
  TypeModelIndexedAccess,
  TypeModelTypeParameter,
  WithTypeComments,
  DeclVisitorContext,
  TypeModelConditional,
  TypeModelMapped,
} from './types';

function stringifyComment(type: WithTypeComments) {
  if (type.comment) {
    const lines = type.comment
      .split('\n')
      .map(line => ` * ${line}\n`)
      .join('');
    return `/**\n${lines} */\n`;
  }

  return '';
}

function stringifyProp(type: TypeModelProp) {
  const target = type.valueType;
  const comment = stringifyComment(type);
  const isOpt = type.optional ? '?' : '';
  const name = makeIdentifier(type.name);

  if (
    target.kind === 'object' &&
    target.calls.length === 1 &&
    target.indices.length === 0 &&
    target.props.length === 0
  ) {
    return `${comment}${name}${isOpt}${stringifySignature(target.calls[0])}`;
  } else {
    return `${comment}${name}${isOpt}: ${stringifyNode(type.valueType)}`;
  }
}

function stringifyParameter(param: TypeModelFunctionParameter) {
  const isOpt = param.optional ? '?' : '';
  const spread = param.spread ? '...' : '';
  return `${spread}${param.param}${isOpt}: ${stringifyNode(param.value)}`;
}

function stringifyParameters(params: Array<TypeModelFunctionParameter>) {
  return params.map(stringifyParameter).join(', ');
}

function stringifySignature(type: TypeModelFunction) {
  const parameters = stringifyParameters(type.parameters);
  const ta = stringifyTypeArgs(type);
  const rt = stringifyNode(type.returnType);
  return `${ta}(${parameters}): ${rt}`;
}

function stringifyIndex(type: TypeModelIndex) {
  const isOpt = type.optional ? '?' : '';
  const index = `${type.keyName}: ${stringifyNode(type.keyType)}`;
  return `[${index}]${isOpt}: ${stringifyNode(type.valueType)}`;
}

function stringifyMapped(type: TypeModelMapped) {
  const isOpt = type.optional ? '?' : '';
  const index = `${type.name} in ${stringifyNode(type.constraint)}`;
  return `[${index}]${isOpt}: ${stringifyNode(type.value)}`;
}

function stringifyIndexedAccess(type: TypeModelIndexedAccess) {
  const front = stringifyNode(type.index);
  const back = stringifyNode(type.object);
  return `${back}[${front}]`;
}

function toContent(lines: Array<string>, terminator: string) {
  return lines
    .map(line => `${line}${terminator}`)
    .join('\n')
    .split('\n')
    .map(line => `  ${line}\n`)
    .join('');
}

function toBlock(lines: Array<string>, terminator: string) {
  if (lines.length > 0) {
    return `{\n${toContent(lines, terminator)}}`;
  }

  return '{}';
}

function stringifyInterface(type: TypeModelObject) {
  const lines: Array<string> = [
    ...type.props.map(p => stringifyProp(p)),
    ...type.calls.map(c => stringifySignature(c)),
    ...type.indices.map(i => stringifyIndex(i)),
  ];

  if (type.mapped) {
    lines.push(stringifyMapped(type.mapped));
  }

  return toBlock(lines, ';');
}

function stringifyEnum(values: Array<TypeModel>) {
  const lines: Array<string> = values.map(p => stringifyNode(p));
  return toBlock(lines, ',');
}

function stringifyTypeArgs(type: WithTypeArgs) {
  if (type.types?.length > 0) {
    const args = type.types.map(stringifyNode).join(', ');
    return `<${args}>`;
  }

  return '';
}

function stringifyTypeParameter(type: TypeModelTypeParameter) {
  const name = stringifyNode(type.parameter);
  const constraint = stringifyNode(type.constraint);
  const defaults = stringifyNode(type.default);
  const constraintClause = constraint ? ` extends ${constraint}` : '';
  const defaultsClause = defaults ? ` = ${defaults}` : '';
  return `${name}${constraintClause}${defaultsClause}`;
}

function stringifyTernary(type: TypeModelConditional) {
  const cond = stringifyNode(type.condition);
  const primary = stringifyNode(type.primary);
  const alt = stringifyNode(type.alternate);
  return `${cond} ? ${primary} : ${alt}`;
}

function stringifyNode(type: TypeModel) {
  switch (type?.kind) {
    case 'object':
      return stringifyInterface(type);
    case 'ref':
      return `${type.refName}${stringifyTypeArgs(type)}`;
    case 'typeParameter':
      return stringifyTypeParameter(type);
    case 'union':
      return type.types.map(stringifyNode).join(' | ');
    case 'intersection':
      return type.types.map(stringifyNode).join(' & ');
    case 'member':
      return `${stringifyComment(type)}${type.name} = ${stringifyNode(type.value)}`;
    case 'conditional':
      return stringifyTernary(type);
    case 'keyof':
      return `keyof ${stringifyNode(type.value)}`;
    case 'infer':
      return `infer ${stringifyNode(type.parameter)}`;
    case 'any':
    case 'null':
    case 'void':
    case 'undefined':
    case 'boolean':
    case 'unknown':
    case 'bigint':
    case 'number':
    case 'never':
    case 'string':
      return type.kind;
    case 'nonPrimitive':
      return type.name || 'object';
    case 'esSymbol':
      return 'symbol';
    case 'unidentified':
      return 'any';
    case 'stringLiteral':
    case 'booleanLiteral':
    case 'numberLiteral':
      return JSON.stringify(type.value);
    case 'indexedAccess':
      return stringifyIndexedAccess(type);
    case 'mapped':
      return stringifyMapped(type);
    case 'substitution':
      return stringifyNode(type.variable);
  }

  return '';
}

export function stringifyExport(name: string, type: TypeModel) {
  switch (type?.kind) {
    case 'object':
      const x = type.extends.length > 0 ? ` extends ${type.extends.map(stringifyNode).join(', ')}` : '';
      return `${stringifyComment(type)}export interface ${name}${stringifyTypeArgs(type)}${x} ${stringifyInterface(
        type,
      )}`;
    case 'alias':
      return `${stringifyComment(type)}export type ${name}${stringifyTypeArgs(type)} = ${stringifyNode(type.child)};`;
    case 'enumLiteral':
      const e = type.const ? 'const enum' : 'enum';
      return `${stringifyComment(type)}export ${e} ${name} ${stringifyEnum(type.values)}`;
    case 'default':
      return `${stringifyComment(type)}export default ${stringifyNode(type.value)};`;
    case 'const':
      return `${stringifyComment(type)}export const ${name}: ${stringifyNode(type.value)};`;
    case 'function':
      return `${stringifyComment(type)}export function ${name}${stringifySignature(type)};`;
    case 'default':
      return `${stringifyComment(type)}export default ${stringifyNode(type.value)};`;
  }

  return '';
}

export function stringifyExports(refs: TypeRefs) {
  return Object.keys(refs)
    .map(r => stringifyExport(r, refs[r]))
    .filter(m => !!m)
    .join('\n\n');
}

export function stringifyModule(name: string, refs: TypeRefs) {
  const content = stringifyExports(refs);
  const formattedContent = content
    .split('\n')
    .map(line => `  ${line}\n`)
    .join('');
  return `declare module "${name}" {\n${formattedContent}}`;
}

export function stringifyDeclaration(context: DeclVisitorContext) {
  const modules = Object.keys(context.modules)
    .filter(moduleName => Object.keys(context.modules[moduleName]).length > 0)
    .map(moduleName => stringifyModule(moduleName, context.modules[moduleName]))
    .join('\n\n');

  const preamble = context.usedImports.map(lib => `import * as ${getRefName(lib)} from '${lib}';`).join('\n');
  return `${preamble}\n\n${modules}`;
}
