import { addCommand } from './commands';
import { ToolCommand } from './types';

export function withCommand<T>(command: ToolCommand<T>) {
  addCommand(command);
  return this;
}
