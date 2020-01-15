import {
  TypeChecker,
  Type,
  TypeFlags,
  SymbolFlags,
  BigIntLiteralType,
  ObjectType,
  ObjectFlags,
  TypeReference,
  Symbol,
  IndexedAccessType,
  InterfaceTypeWithDeclaredMembers,
  Identifier,
  IndexInfo,
} from 'typescript';
import { TypeModel, TypeRefs, TypeModelIndex, TypeModelProp, TypeModelFunction } from './types';

function getKeyName(info: IndexInfo) {
  return (<Identifier>info?.declaration?.parameters?.[0].name)?.text ?? 'index';
}

function isBigIntLiteral(type: Type): type is BigIntLiteralType {
  return !!(type.flags & TypeFlags.BigIntLiteral);
}

function isObjectType(type: Type): type is ObjectType {
  return !!(type.flags & TypeFlags.Object);
}

function isAnonymousObject(type: Type) {
  return isObjectType(type) && !!(type.objectFlags & ObjectFlags.Anonymous);
}

function isReferenceType(type: ObjectType): type is TypeReference {
  return !!(type.objectFlags & ObjectFlags.Reference);
}

function isTypeParameter(type: Type) {
  return !!(type.flags & TypeFlags.TypeParameter);
}

function isIndexType(type: Type): type is IndexedAccessType {
  return !!(type.flags & TypeFlags.IndexedAccess);
}

function isBaseLib(path: string) {
  if (path) {
    const parts = path.split('/');
    parts.pop();
    const newPath = parts.join('/');
    return newPath.endsWith('/node_modules/typescript/lib');
  }

  return false;
}

function getTypeParameters(checker: TypeChecker, type: Type, refs: TypeRefs, imports: Array<string>) {
  const typeRef = type as TypeReference;
  return typeRef.typeArguments?.map(t => includeType(checker, t, refs, imports)) ?? [];
}

function getComment(checker: TypeChecker, symbol: Symbol) {
  const doc = symbol.getDocumentationComment(checker);

  if (doc) {
    return doc.map(item => item.text).join('\n');
  }

  return undefined;
}

export function includeType(checker: TypeChecker, type: Type, refs: TypeRefs, imports: Array<string>): TypeModel {
  const name = type.symbol?.name;
  const fn = type.symbol?.declarations?.[0]?.parent?.getSourceFile()?.fileName;

  if (name) {
    const parent = type.symbol.parent?.valueDeclaration?.parent;
    const fileName = parent?.getSourceFile()?.fileName;

    if (isBaseLib(fn)) {
      return {
        kind: 'ref',
        types: getTypeParameters(checker, type, refs, imports),
        refName: name,
      };
    } else if (fileName && imports.some(fn => fileName.startsWith(fn))) {
      const lib = 'React';
      return {
        kind: 'ref',
        types: [], //getTypeParameters(checker, type, refs),
        refName: `${lib}.${name}`,
      };
    } else if (isTypeParameter(type)) {
      return {
        kind: 'ref',
        types: [],
        refName: name,
      };
    } else if (!isAnonymousObject(type)) {
      const id = (<any>type).id;
      const n = name === '__type' ? `Anonymous_${id}` : name;

      if (!(n in refs)) {
        refs[n] = {
          kind: 'ref',
          types: [],
          refName: n,
        };

        if (isObjectType(type) && isReferenceType(type)) {
          refs[n] = typeVisitor(checker, type.target, refs, imports);
        } else {
          refs[n] = typeVisitor(checker, type, refs, imports);
        }
      }

      return {
        kind: 'ref',
        types: getTypeParameters(checker, type, refs, imports),
        refName: n,
      };
    }
  }

  return typeVisitor(checker, type, refs, imports);
}

export function typeVisitor(checker: TypeChecker, type: Type, refs: TypeRefs, imports: Array<string>): TypeModel {
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
      values: type.types.map(t => includeType(checker, t, refs, imports)),
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
      values: type.types.map(t => includeType(checker, t, refs, imports)),
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
    const constraint = type.getConstraint();
    return {
      kind: 'typeParameter',
      typeName: type.getSymbol().name,
      constraint: constraint && includeType(checker, constraint, refs, imports),
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
      types: type.typeArguments.map(t => includeType(checker, t, refs, imports)),
    };
  }

  if (isObjectType(type)) {
    const props = type.getProperties();
    const propsDescriptor: Array<TypeModelProp> = props.map(prop => {
      const propType = checker.getTypeOfSymbolAtLocation(prop, prop.valueDeclaration);

      return {
        kind: 'prop',
        name: prop.name,
        optional: !!(prop.flags & SymbolFlags.Optional),
        comment: getComment(checker, prop),
        valueType: includeType(checker, propType, refs, imports),
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
        valueType: includeType(checker, numberIndexType, refs, imports),
      });
    }

    if (stringIndexType) {
      indicesDescriptor.push({
        kind: 'index',
        keyType: { kind: 'string' },
        keyName: getKeyName((<InterfaceTypeWithDeclaredMembers>type).declaredStringIndexInfo),
        valueType: includeType(checker, stringIndexType, refs, imports),
      });
    }

    const callSignatures = type.getCallSignatures();
    const callsDescriptor: Array<TypeModelFunction> =
      callSignatures?.map(sign => ({
        kind: 'function',
        types: sign.typeParameters?.map(t => typeVisitor(checker, t, refs, imports)) ?? [],
        parameters: sign.getParameters().map(param => {
          const type = checker.getTypeAtLocation(param.valueDeclaration);
          return {
            kind: 'parameter',
            param: param.name,
            type: includeType(checker, type, refs, imports),
          };
        }),
        returnType: includeType(checker, sign.getReturnType(), refs, imports),
      })) ?? [];

    return {
      kind: 'object',
      comment: getComment(checker, type.symbol),
      props: propsDescriptor,
      calls: callsDescriptor,
      types: getTypeParameters(checker, type, refs, imports),
      indices: indicesDescriptor,
    };
  }

  if (type.isUnion()) {
    return {
      kind: 'union',
      types: type.types.map(t => includeType(checker, t, refs, imports)),
    };
  }

  if (type.isIntersection()) {
    return {
      kind: 'intersection',
      types: type.types.map(t => includeType(checker, t, refs, imports)),
    };
  }

  if (isIndexType(type)) {
    return {
      kind: 'indexedAccess',
      index: includeType(checker, type.indexType, refs, imports),
      object: includeType(checker, type.objectType, refs, imports),
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
