import * as ts from 'typescript';

/**
 * Expose some internal TypeScript APIs
 */
declare module 'typescript' {
  interface Symbol {
    id?: number;
    parent?: ts.Symbol;
    target?: any;
  }

  interface Type {
    id?: number;
  }

  interface Node {
    symbol?: ts.Symbol;
    localSymbol?: ts.Symbol;
  }

  interface Declaration {
    questionToken?: ts.Token<ts.SyntaxKind.QuestionToken>;
  }

  interface Expression {
    text?: string;
  }

  interface SourceFile {
    resolvedModules: Map<ts.ResolvedModule>;
  }
}

export interface DeclVisitorContext {
  modules: Record<string, TypeRefs>;
  checker: ts.TypeChecker;
  refs: TypeRefs;
  ids: Array<number>;
  usedImports: Array<string>;
  availableImports: Array<string>;
}

export type TypeRefs = Record<string, TypeModel>;

export interface WithTypeArgs {
  readonly types: Array<TypeModel>;
}

export interface WithTypeComments {
  readonly comment?: string;
}

export type TypeModel =
  | TypeModelString
  | TypeMemberModel
  | TypeModelProp
  | TypeModelBoolean
  | TypeModelNumber
  | TypeModelObject
  | TypeModelUnidentified
  | TypeModelAny
  | TypeModelUnknown
  | TypeModelEnum
  | TypeModelBigInt
  | TypeModelStringLiteral
  | TypeModelNumberLiteral
  | TypeModelBooleanLiteral
  | TypeModelEnumLiteral
  | TypeModelBigIntLiteral
  | TypeModelESSymbol
  | TypeModelUniqueESSymbol
  | TypeModelVoid
  | TypeModelUndefined
  | TypeModelNull
  | TypeModelNever
  | TypeModelTypeParameter
  | TypeModelFunctionParameter
  | TypeModelUnion
  | TypeModelIntersection
  | TypeModelIndex
  | TypeModelIndexedAccess
  | TypeModelConditional
  | TypeModelSubstitution
  | TypeModelNonPrimitive
  | TypeModelTuple
  | TypeModelFunction
  | TypeModelRef
  | TypeModelAlias;

export interface TypeModelProp extends WithTypeComments {
  readonly name: string;
  readonly optional: boolean;
  readonly kind: 'prop';
  readonly valueType: TypeModel;
  readonly id: number;
}

export interface TypeModelRef extends WithTypeArgs {
  readonly kind: 'ref';
  readonly refName: string;
  readonly external?: ts.Type;
}

export interface TypeModelAny {
  readonly kind: 'any';
}

export interface TypeModelUnknown {
  readonly kind: 'unknown';
}

export interface TypeModelString {
  readonly kind: 'string';
}

export interface TypeModelNumber {
  readonly kind: 'number';
}

export interface TypeModelBoolean {
  readonly kind: 'boolean';
}

export interface TypeModelFunction extends WithTypeArgs {
  readonly kind: 'function';
  readonly comment?: string;
  readonly parameters: Array<TypeModelFunctionParameter>;
  readonly returnType: TypeModel;
}

export interface TypeModelFunctionParameter {
  readonly kind: 'parameter';
  readonly param: string;
  readonly type: TypeModel;
  readonly optional: boolean;
}

export interface TypeModelEnum extends WithTypeComments {
  readonly kind: 'enum';
  readonly comment?: string;
  readonly values: Array<TypeMemberModel>;
}

export interface TypeModelBigInt {
  readonly kind: 'bigint';
}

export interface TypeModelStringLiteral {
  readonly kind: 'stringLiteral';
  readonly value: string;
}

export interface TypeModelNumberLiteral {
  readonly kind: 'numberLiteral';
  readonly value: number;
}

export interface TypeModelBooleanLiteral {
  readonly kind: 'booleanLiteral';
  readonly value: boolean;
}

export interface TypeModelEnumLiteral extends WithTypeComments {
  readonly kind: 'enumLiteral';
  readonly const: boolean;
  readonly values: Array<TypeMemberModel>;
}

export interface TypeMemberModel extends WithTypeComments {
  readonly kind: 'member';
  readonly name: string;
  readonly value: TypeModel;
}

export interface TypeModelBigIntLiteral {
  readonly kind: 'bigintLiteral';
  readonly value: ts.PseudoBigInt;
}

export interface TypeModelESSymbol {
  readonly kind: 'esSymbol';
}

export interface TypeModelUniqueESSymbol {
  readonly kind: 'uniqueEsSymbol';
}

export interface TypeModelVoid {
  readonly kind: 'void';
}

export interface TypeModelUndefined {
  readonly kind: 'undefined';
}

export interface TypeModelNull {
  readonly kind: 'null';
}

export interface TypeModelNever {
  readonly kind: 'never';
}

export interface TypeModelTypeParameter {
  readonly kind: 'typeParameter';
  readonly typeName: string;
  readonly constraint?: TypeModel;
}

export interface TypeModelUnion extends WithTypeArgs {
  readonly kind: 'union';
}

export interface TypeModelIntersection extends WithTypeArgs {
  readonly kind: 'intersection';
}

export interface TypeModelIndex {
  readonly kind: 'index';
  readonly keyName: string;
  readonly keyType: TypeModelUnion | TypeModelString | TypeModelNumber;
  readonly valueType: TypeModel;
}

export interface TypeModelIndexedAccess {
  readonly kind: 'indexedAccess';
  readonly index: TypeModel;
  readonly object: TypeModel;
}

export interface TypeModelConditional {
  readonly kind: 'conditional';
}

export interface TypeModelSubstitution {
  readonly kind: 'substitution';
}

export interface TypeModelNonPrimitive {
  readonly kind: 'nonPrimitive';
}

export interface TypeModelUnidentified {
  readonly kind: 'unidentified';
}

export interface TypeModelObject extends WithTypeArgs, WithTypeComments {
  readonly kind: 'object';
  readonly props: Array<TypeModelProp>;
  readonly calls: Array<TypeModelFunction>;
  readonly indices: Array<TypeModelIndex>;
  readonly extends: Array<TypeModelRef>;
}

export interface TypeModelTuple extends WithTypeArgs {
  readonly kind: 'tuple';
}

export interface TypeModelAlias extends WithTypeArgs, WithTypeComments {
  readonly kind: 'alias';
  readonly child: TypeModel;
}

export type TypeModelKinds = TypeModel['kind'];
