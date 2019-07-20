export type ValuesOf<T> = T extends { [_ in keyof T]: infer U } ? U : never;

export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void)
  ? I
  : never;
