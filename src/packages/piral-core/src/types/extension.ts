export interface ExtensionSlotProps<T = any> {
  empty?(): React.ReactNode;
  render?(nodes: Array<React.ReactNode>): React.ReactElement<any> | null;
  params?: T;
}
