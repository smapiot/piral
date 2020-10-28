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
exports.getLanguageExtension = exports.getFileFromTemplate = void 0;
const path_1 = require("path");
const ejs_1 = require("ejs");
function fillTemplate(name, data = {}) {
    const path = path_1.resolve(__dirname, '..', 'templates', `${name}.ejs`);
    return new Promise((resolve, reject) => {
        ejs_1.renderFile(path, data, (err, str) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(str);
            }
        });
    });
}
function getFileFromTemplate(targetDir, prefix, fileName, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const content = yield fillTemplate(`${prefix}-${fileName}`, data);
        return {
            content: Buffer.from(content, 'utf8'),
            path: path_1.join(targetDir, fileName),
        };
    });
}
exports.getFileFromTemplate = getFileFromTemplate;
function getLanguageExtension(language) {
    switch (language) {
        case 'js':
            return '.jsx';
        case 'ts':
        default:
            return '.tsx';
    }
}
exports.getLanguageExtension = getLanguageExtension;
//# sourceMappingURL=utils.js.map