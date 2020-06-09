export type ValuesOf<T> = T extends { [_ in keyof T]: infer U } ? U : never;

export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

export type RemainingArgs<T> = T extends (_: any, ...args: infer U) => any ? U : never;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U> ? Array<DeepPartial<U>> : T[P] extends {} ? DeepPartial<T[P]> : T[P];
};

export type NestedPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U> ? Array<Partial<U>> : T[P] extends {} ? Partial<T[P]> : T[P];
};

export type Dict<T> = Record<string, T>;

export type Without<T, K> = Pick<T, Exclude<keyof T, K>>;

export type FirstParameter<T extends (arg: any) => any> = T extends (arg: infer P) => any ? P : never;

export type FirstParametersOf<T> = {
  [K in keyof T]: T[K] extends (arg: any) => any ? FirstParameter<T[K]> : never;
}[keyof T];

export type UnionOf<T> = { [K in keyof T]: T[K] }[keyof T];

export type MaybeAsync<T> = T | (() => Promise<T>);
