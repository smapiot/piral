export function runPilet<T>(apiMock: T, setup: (api: T) => void) {
  setup(apiMock);
}
