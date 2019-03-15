export const enum TiKind {
  Root = 0,
  ExternalModule = 1,
  Enumeration = 4,
  EnumerationMember = 16,
  Variable = 32,
  Function = 64,
  Interface = 256,
  Property = 1024,
  Method = 2048,
  CallSignature = 4096,
  IndexSignature = 8192,
  Parameter = 32768,
  TypeLiteral = 65536,
  ObjectLiteral = 2097152,
  TypeAlias = 4194304,
}

export type TiId = number;

export interface TiType {
  type: string;
  id?: TiId;
  name?: string;
  types?: Array<TiType>;
  typeArguments?: Array<TiType>;
  declaration?: TiNode;
}

export interface TiNode {
  id: TiId;
  name: string;
  kind: TiKind;
  defaultValue?: string;
  kindString?: string;
  sources?: Array<{
    fileName: string;
    line: number;
    character: number;
  }>;
  children: Array<TiNode>;
  flags: {
    isExported?: boolean;
    isOptional?: boolean;
    isConst?: boolean;
  };
  signatures?: Array<TiNode>;
  typeParameter?: Array<TiNode>;
  type?: TiType;
  parameters?: Array<TiNode>;
  comment?: {
    shortText: string;
    tags?: Array<{
      tag: string;
      text: string;
    }>;
  };
  groups?: Array<{
    title: string;
    kind: TiKind;
    children: Array<TiId>;
  }>;
}
