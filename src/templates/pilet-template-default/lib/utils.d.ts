/// <reference types="node" />
export interface TemplateFile {
    path: string;
    content: Buffer;
}
export declare function getFileFromTemplate(targetDir: string, fileName: string, data?: any): Promise<TemplateFile>;
