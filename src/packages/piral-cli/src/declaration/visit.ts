import {
  TypeChecker,
  Type,
  TypeFlags,
  SymbolFlags,
  ObjectFlags,
  TypeReference,
  Symbol,
  InterfaceTypeWithDeclaredMembers,
} from 'typescript';
import {
  getLib,
  getRefName,
  isBaseLib,
  isTypeParameter,
  isAnonymousObject,
  isObjectType,
  isReferenceType,
  isBigIntLiteral,
  getKeyName,
  isIndexType,
  isGlobal,
  getGlobalName,
} from './helpers';
import {
  TypeModel,
  TypeModelIndex,
  TypeModelProp,
  TypeModelFunction,
  DeclVisitorContext,
  TypeModelRef,
  TypeMemberModel,
} from './types';

function getTypeParameters(context: DeclVisitorContext, type: Type) {
  const typeRef = type as TypeReference;
  return typeRef.typeArguments?.map(t => includeType(context, t)) ?? [];
}

function getComment(checker: TypeChecker, symbol: Symbol) {
  const doc = symbol.getDocumentationComment(checker);

  if (doc) {
    return doc.map(item => item.text).join('\n');
  }

  return undefined;
}

function includeExternal(context: DeclVisitorContext, type: Type) {
  const name = type.symbol.name;

  if (isGlobal(type.symbol)) {
    const name = getGlobalName(type.symbol);
    return includeRef(context, type, name);
  }

  const fn = type.symbol.declarations?.[0]?.parent?.getSourceFile()?.fileName;

  if (isBaseLib(fn)) {
    // Include items from the ts core lib (no need to ref. them)
    return includeRef(context, type, name, type);
  }

  const lib = getLib(fn, context.availableImports);

  if (lib) {
    // if we did not use the given lib yet, add it to the used libs
    if (!context.usedImports.includes(lib)) {
      context.usedImports.push(lib);
    }

    if (name === '__type') {
      // Right now this catches the JSXElementConstructor; but
      // I guess this code should be made "more robust" and also
      // more generic.
      const parent: any = type.symbol?.declarations?.[0]?.parent;
      const hiddenType = parent?.type?.parent?.parent?.parent;
      const hiddenTypeName = hiddenType?.symbol?.name;

      if (hiddenTypeName) {
        return includeRef(
          context,
          {
            ...hiddenType,
            typeArguments:
              hiddenType.typeParameters?.map(() => ({
                flags: TypeFlags.Any,
              })) || [],
          },
          `${getRefName(lib)}.${hiddenTypeName}`,
        );
      }
    }

    return includeRef(context, type, `${getRefName(lib)}.${name}`, type);
  }
}

export function includeExportedType(context: DeclVisitorContext, type: Type) {
  const name = type.symbol.name;
  const node = includeType(context, type);

  // okay we got a non-ref back, hence it was not yet added to the refs
  if (node.kind !== 'ref') {
    context.refs[name] = node;
  }
}

function includeType(context: DeclVisitorContext, type: Type): TypeModel {
  const alias = type.aliasSymbol?.name;

  if (alias) {
    // special case: enums are also "alias" types, but we do
    // actually want only the alias if its a "real" alias!
    if (!type.symbol || type.aliasSymbol.id !== type.symbol.id) {
      return makeAliasRef(context, type, alias);
    }
  }

  const name = type.symbol?.name;

  if (name) {
    const ext = includeExternal(context, type);

    if (ext) {
      return ext;
    } else if (name !== '__type' && !isAnonymousObject(type)) {
      return makeRef(context, type, name, includeNamed);
    }
  }

  return includeAnonymous(context, type);
}

function makeAliasRef(context: DeclVisitorContext, type: Type, name: string): TypeModel {
  const decl: any = type.aliasSymbol.declarations[0];
  const ext = includeExternal(context, decl);

  if (ext && ext.kind === 'ref') {
    name = ext.refName;
  } else if (!(name in context.refs)) {
    context.refs[name] = {
      kind: 'ref',
      types: [],
      refName: name,
    };

    context.refs[name] = {
      kind: 'alias',
      comment: getComment(context.checker, decl.symbol),
      types: decl.typeParameters?.map(t => includeType(context, t)) ?? [],
      child: includeAnonymous(context, context.checker.getTypeAtLocation(decl)),
    };
  }

  return {
    kind: 'ref',
    types: type.aliasTypeArguments?.map(t => includeType(context, t)) ?? [],
    refName: name,
  };
}

function makeRef(
  context: DeclVisitorContext,
  type: Type,
  name: string,
  cb: (context: DeclVisitorContext, type: Type) => TypeModel,
) {
  const refType = type;

  if (!(name in context.refs)) {
    context.refs[name] = {
      kind: 'ref',
      types: [],
      refName: name,
    };

    if (isObjectType(type) && isReferenceType(type)) {
      type = type.target;
    }

    context.refs[name] = cb(context, type);
  }

  return includeRef(context, refType, name);
}

function includeRef(context: DeclVisitorContext, type: Type, refName: string, external?: Type): TypeModel {
  return {
    kind: 'ref',
    types: getTypeParameters(context, type),
    refName,
    external,
  };
}

function includeMember(context: DeclVisitorContext, type: Type): TypeMemberModel {
  return {
    kind: 'member',
    name: type.symbol.name,
    value: includeAnonymous(context, type),
    comment: getComment(context.checker, type.symbol),
  };
}

function includeBasic(context: DeclVisitorContext, type: Type): TypeModel {
  // We're not handling things SomethingLike cause there're unions of flags
  // and would be handled anyway into more specific types
  // VoidLike is Undefined or Void,
  // StringLike is String or StringLiteral
  // NumberLike is Number or NumberLiteral or Enum
  // BigIntLike is BigInt or BigIntLiteral
  // ESSymbolLike is ESSymbol or ESUniqueSymbol
  // Don't take those ^ definitions too seriously, they're subject to change

  if (type.flags & TypeFlags.Any) {
    return {
      kind: 'any',
    };
  }

  if (type.flags & TypeFlags.Unknown) {
    return {
      kind: 'unknown',
    };
  }

  if (typeof type.isStringLiteral === 'function' && type.isStringLiteral()) {
    return {
      kind: 'stringLiteral',
      value: type.value,
    };
  }

  if (typeof type.isNumberLiteral === 'function' && type.isNumberLiteral()) {
    return {
      kind: 'numberLiteral',
      value: type.value,
    };
  }

  if (type.flags & TypeFlags.BooleanLiteral) {
    return {
      kind: 'booleanLiteral',
      // FIXME It's a dirty hack but i can't seem to find any other way to get a value of BooleanLiteral
      value: (type as any).intrinsicName === 'true',
    };
  }

  if (type.flags & TypeFlags.EnumLiteral && type.isUnion()) {
    return {
      kind: 'enumLiteral',
      const: type.symbol.flags === SymbolFlags.ConstEnum,
      comment: getComment(context.checker, type.symbol),
      values: type.types.map(t => includeMember(context, t)),
    };
  }

  if (type.flags & TypeFlags.Enum && type.isUnion()) {
    return {
      kind: 'enum',
      comment: getComment(context.checker, type.symbol),
      values: type.types.map(t => includeMember(context, t)),
    };
  }

  if (isBigIntLiteral(type)) {
    return {
      kind: 'bigintLiteral',
      value: type.value,
    };
  }

  if (type.flags & TypeFlags.String) {
    return {
      kind: 'string',
    };
  }

  if (type.flags & TypeFlags.Boolean) {
    return {
      kind: 'boolean',
    };
  }

  if (type.flags & TypeFlags.Number) {
    return {
      kind: 'number',
    };
  }

  if (type.flags & TypeFlags.BigInt) {
    return {
      kind: 'bigint',
    };
  }

  if (type.flags & TypeFlags.ESSymbol) {
    return {
      kind: 'esSymbol',
    };
  }

  if (type.flags & TypeFlags.UniqueESSymbol) {
    return {
      kind: 'uniqueEsSymbol',
    };
  }

  if (type.flags & TypeFlags.Void) {
    return {
      kind: 'void',
    };
  }

  if (type.flags & TypeFlags.Undefined) {
    return {
      kind: 'undefined',
    };
  }

  if (type.flags & TypeFlags.Null) {
    return {
      kind: 'null',
    };
  }

  if (type.flags & TypeFlags.Never) {
    return {
      kind: 'never',
    };
  }

  if (type.flags & TypeFlags.Conditional) {
    return {
      kind: 'conditional',
    };
  }

  if (type.flags & TypeFlags.Substitution) {
    return {
      kind: 'substitution',
    };
  }

  if (type.flags & TypeFlags.NonPrimitive) {
    return {
      kind: 'nonPrimitive',
    };
  }
}

function includeInheritedTypes(context: DeclVisitorContext, type: Type) {
  const decl: any = type?.symbol?.declarations?.[0];
  const types = decl?.heritageClauses?.[0]?.types || [];
  return types.map(t => {
    const type = context.checker.getTypeAtLocation(t);
    return includeType(context, type);
  });
}

function includeTypeParameter(context: DeclVisitorContext, type: Type): TypeModel {
  if (isTypeParameter(type)) {
    const symbol = type.getSymbol();
    const decl: any = symbol.declarations?.[0];
    const constraint = decl?.constraint?.type ?? type.getConstraint();
    const name = constraint?.typeName?.text;
    return {
      kind: 'typeParameter',
      typeName: symbol.name,
      constraint: name
        ? {
            kind: 'ref',
            refName: `keyof ${name}`,
            types: [],
          }
        : constraint && includeType(context, constraint),
    };
  }
}

function getAllPropIds(context: DeclVisitorContext, types: Array<TypeModelRef>) {
  const propIds: Array<number> = [];

  for (const type of types) {
    const baseType = context.refs[type.refName];

    if (baseType && baseType.kind === 'object') {
      for (const prop of baseType.props) {
        if (prop.id) {
          propIds.push(prop.id);
        }
      }

      propIds.push(...getAllPropIds(context, baseType.extends));
    } else if (type.external) {
      const props = type.external.getProperties() || [];

      for (const prop of props) {
        propIds.push(prop.id || prop.target?.id);
      }
    }
  }

  return propIds;
}

function includeObject(context: DeclVisitorContext, type: Type): TypeModel {
  if (isObjectType(type)) {
    const inherited = includeInheritedTypes(context, type);
    const targets = getAllPropIds(context, inherited);
    const props = type.getProperties();
    const propsDescriptor: Array<TypeModelProp> = props
      .filter(prop => !targets.includes(prop.id || prop.target?.id))
      .map(prop => {
        const propType = context.checker.getTypeOfSymbolAtLocation(prop, prop.valueDeclaration);

        return {
          kind: 'prop',
          name: prop.name,
          id: prop.id || prop.target?.id,
          optional: !!(prop.flags & SymbolFlags.Optional),
          comment: getComment(context.checker, prop),
          valueType: includeType(context, propType),
        };
      });

    // index types
    const stringIndexType = type.getStringIndexType();
    const numberIndexType = type.getNumberIndexType();
    const indicesDescriptor: Array<TypeModelIndex> = [];

    if (numberIndexType) {
      const info = (<InterfaceTypeWithDeclaredMembers>type).declaredNumberIndexInfo;
      indicesDescriptor.push({
        kind: 'index',
        keyType: { kind: 'number' },
        keyName: getKeyName(info),
        valueType: includeType(context, numberIndexType),
      });
    }

    if (stringIndexType) {
      const info = (<InterfaceTypeWithDeclaredMembers>type).declaredStringIndexInfo;
      indicesDescriptor.push({
        kind: 'index',
        keyType: { kind: 'string' },
        keyName: getKeyName(info),
        valueType: includeType(context, stringIndexType),
      });
    }

    const callSignatures = type.getCallSignatures();
    const callsDescriptor: Array<TypeModelFunction> =
      callSignatures?.map(sign => ({
        kind: 'function',
        types: sign.typeParameters?.map(t => includeTypeParameter(context, t)) ?? [],
        parameters: sign.getParameters().map(param => ({
          kind: 'parameter',
          param: param.name,
          optional: param.valueDeclaration.questionToken !== undefined,
          type: includeType(context, context.checker.getTypeAtLocation(param.valueDeclaration)),
        })),
        returnType: includeType(context, sign.getReturnType()),
      })) ?? [];

    return {
      kind: 'object',
      extends: inherited,
      comment: getComment(context.checker, type.symbol),
      props: propsDescriptor,
      calls: callsDescriptor,
      types: getTypeParameters(context, type),
      indices: indicesDescriptor,
    };
  }
}

function includeCombinator(context: DeclVisitorContext, type: Type): TypeModel {
  // Tuple special handling
  if (
    isObjectType(type) &&
    isReferenceType(type) &&
    type.target.objectFlags & ObjectFlags.Tuple &&
    !!type.typeArguments &&
    type.typeArguments.length > 0
  ) {
    return {
      kind: 'tuple',
      types: type.typeArguments.map(t => includeType(context, t)),
    };
  }

  if (type.isUnion()) {
    return {
      kind: 'union',
      types: type.types.map(t => includeType(context, t)),
    };
  }

  if (type.isIntersection()) {
    return {
      kind: 'intersection',
      types: type.types.map(t => includeType(context, t)),
    };
  }

  if (isIndexType(type)) {
    return {
      kind: 'indexedAccess',
      index: includeType(context, type.indexType),
      object: includeType(context, type.objectType),
    };
  }
}

function includeNamed(context: DeclVisitorContext, type: Type): TypeModel {
  return includeObject(context, type) ?? includeBasic(context, type);
}

function includeAnonymous(context: DeclVisitorContext, type: Type): TypeModel {
  return (
    includeNamed(context, type) ??
    includeTypeParameter(context, type) ??
    includeCombinator(context, type) ?? {
      kind: 'unidentified',
    }
  );
}
