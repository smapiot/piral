import { TemplateFile } from './utils';
export interface TemplateArgs {
    language?: string;
    packageName?: string;
    mocks?: string;
    src?: string;
}
export default function (root: string, args: TemplateArgs): Promise<TemplateFile[]>;
