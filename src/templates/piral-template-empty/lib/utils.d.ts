/// <reference types="node" />
export interface TemplateFile {
    path: string;
    content: Buffer;
}
export declare function getFileFromTemplate(targetDir: string, prefix: string, fileName: string, data?: any): Promise<TemplateFile>;
export declare function getLanguageExtension(language: string): ".jsx" | ".tsx";
