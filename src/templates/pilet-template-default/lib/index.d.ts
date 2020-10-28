import { TemplateFile } from './utils';
export interface TemplateArgs {
    language?: string;
    sourceName: string;
    src?: string;
}
export default function (root: string, args: TemplateArgs): Promise<TemplateFile[]>;
