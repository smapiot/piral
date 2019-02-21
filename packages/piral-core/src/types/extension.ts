export interface ExtensionSlotProps {
  empty?(): React.ReactNode;
  render?(nodes: Array<React.ReactNode>): React.ReactElement<any> | null;
  params?: any;
}
