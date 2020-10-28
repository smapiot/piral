"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const utils_1 = require("./utils");
function default_1(root, args) {
    return __awaiter(this, void 0, void 0, function* () {
        const { language = 'ts', packageName = 'piral', mocks = 'mocks', src = 'src' } = args;
        const srcDir = path_1.relative(root, path_1.resolve(root, src));
        const mocksDir = path_1.relative(root, path_1.resolve(root, src, mocks));
        const files = [];
        const data = {
            extension: utils_1.getLanguageExtension(language),
            src: srcDir,
        };
        switch (packageName) {
            case 'piral-core': {
                files.push(utils_1.getFileFromTemplate('.', 'piral-core', 'index.html', data), utils_1.getFileFromTemplate(mocksDir, 'piral', 'backend.js', data));
                switch (language) {
                    case 'js':
                        files.push(utils_1.getFileFromTemplate(srcDir, 'piral-core', 'index.jsx', data));
                        break;
                    case 'ts':
                    default:
                        files.push(utils_1.getFileFromTemplate('.', 'piral', 'tsconfig.json', data), utils_1.getFileFromTemplate(srcDir, 'piral-core', 'index.tsx', data));
                        break;
                }
                break;
            }
            case 'piral-base':
                files.push(utils_1.getFileFromTemplate(mocksDir, 'piral', 'backend.js', data));
                switch (language) {
                    case 'js':
                        files.push(utils_1.getFileFromTemplate(srcDir, 'piral-base', 'index.js', data));
                        break;
                    case 'ts':
                    default:
                        files.push(utils_1.getFileFromTemplate('.', 'piral', 'tsconfig.json', data), utils_1.getFileFromTemplate(srcDir, 'piral-base', 'index.ts', data));
                        break;
                }
                break;
            case 'piral':
            default: {
                files.push(utils_1.getFileFromTemplate(srcDir, 'piral', 'index.html', data), utils_1.getFileFromTemplate(mocksDir, 'piral', 'backend.js', data), utils_1.getFileFromTemplate(srcDir, 'piral', 'style.scss', data));
                switch (language) {
                    case 'js':
                        files.push(utils_1.getFileFromTemplate(srcDir, 'piral', 'layout.jsx', data), utils_1.getFileFromTemplate(srcDir, 'piral', 'index.jsx', data));
                        break;
                    case 'ts':
                    default:
                        files.push(utils_1.getFileFromTemplate(srcDir, 'piral', 'tsconfig.json', data), utils_1.getFileFromTemplate(srcDir, 'piral', 'layout.tsx', data), utils_1.getFileFromTemplate(srcDir, 'piral', 'index.tsx', data));
                        break;
                }
                break;
            }
        }
        return yield Promise.all(files);
    });
}
exports.default = default_1;
//# sourceMappingURL=index.js.map