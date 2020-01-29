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
} from './helpers';
import { TypeModel, TypeModelIndex, TypeModelProp, TypeModelFunction, DeclVisitorContext } from './types';

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

export function includeType(context: DeclVisitorContext, type: Type): TypeModel {
  const name = type.symbol?.name;

  if (name) {
    const fn = type.symbol?.declarations?.[0]?.parent?.getSourceFile()?.fileName;

    if (!isBaseLib(fn)) {
      const parent = type.symbol.parent?.valueDeclaration?.parent;
      const fileName = parent?.getSourceFile()?.fileName;
      const lib = getLib(fileName, context.imports);

      if (lib) {
        return includeRef(context, type, `${getRefName(lib)}.${name}`);
      } else if (isTypeParameter(type)) {
        return {
          kind: 'ref',
          types: [],
          refName: name,
        };
      } else if (!isAnonymousObject(type)) {
        const id = (<any>type).id;
        const n = name === '__type' ? `Anonymous_${id}` : name;

        if (!(n in context.refs)) {
          context.refs[n] = {
            kind: 'ref',
            types: [],
            refName: n,
          };

          if (isObjectType(type) && isReferenceType(type)) {
            type = type.target;
          }

          context.refs[n] = includeAnonymous(context, type);
        }

        return includeRef(context, type, n);
      } else if (name === '__type') {
        return {
          kind: 'ref',
          types: [],
          refName: 'any',
        };
      }

      return includeAnonymous(context, type);
    }

    return includeRef(context, type, name);
  }

  return includeAnonymous(context, type);
}

function includeRef(context: DeclVisitorContext, type: Type, refName: string): TypeModel {
  return {
    kind: 'ref',
    types: getTypeParameters(context, type),
    refName,
  };
}

function includeAnonymous(context: DeclVisitorContext, type: Type): TypeModel {
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

  if (type.isStringLiteral()) {
    return {
      kind: 'stringLiteral',
      value: type.value,
    };
  }

  if (type.isNumberLiteral()) {
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
      values: type.types.map(t => includeType(context, t)),
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

  if (type.flags & TypeFlags.Enum && type.isUnion()) {
    return {
      kind: 'enum',
      values: type.types.map(t => includeType(context, t)),
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

  if (isObjectType(type)) {
    const props = type.getProperties();
    const propsDescriptor: Array<TypeModelProp> = props.map(prop => {
      const propType = context.checker.getTypeOfSymbolAtLocation(prop, prop.valueDeclaration);

      return {
        kind: 'prop',
        name: prop.name,
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
      indicesDescriptor.push({
        kind: 'index',
        keyType: { kind: 'number' },
        keyName: getKeyName((<InterfaceTypeWithDeclaredMembers>type).declaredNumberIndexInfo),
        valueType: includeType(context, numberIndexType),
      });
    }

    if (stringIndexType) {
      indicesDescriptor.push({
        kind: 'index',
        keyType: { kind: 'string' },
        keyName: getKeyName((<InterfaceTypeWithDeclaredMembers>type).declaredStringIndexInfo),
        valueType: includeType(context, stringIndexType),
      });
    }

    const callSignatures = type.getCallSignatures();
    const callsDescriptor: Array<TypeModelFunction> =
      callSignatures?.map(sign => ({
        kind: 'function',
        types:
          sign.typeParameters?.map(t => {
            return includeAnonymous(context, t);
          }) ?? [],
        parameters: sign.getParameters().map(param => {
          const type = context.checker.getTypeAtLocation(param.valueDeclaration);
          return {
            kind: 'parameter',
            param: param.name,
            type: includeType(context, type),
          };
        }),
        returnType: includeType(context, sign.getReturnType()),
      })) ?? [];

    return {
      kind: 'object',
      comment: getComment(context.checker, type.symbol),
      props: propsDescriptor,
      calls: callsDescriptor,
      types: getTypeParameters(context, type),
      indices: indicesDescriptor,
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

  return {
    kind: 'unidentified',
  };
}
