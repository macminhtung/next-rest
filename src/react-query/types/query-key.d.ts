export interface QueryKey {}

declare module '@tanstack/react-query' {
  type MyQueryKey = QueryKey[keyof QueryKey] | Array<unknown>;

  interface Register {
    queryKey: MyQueryKey;
  }
}
