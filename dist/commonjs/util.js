"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadConfig = exports.mapPaths = void 0;
const path_1 = require("path");
const fs_1 = require("fs");
const stripJsonComments = require("strip-json-comments");
exports.mapPaths = (paths, mapper) => {
    const dest = {};
    Object.keys(paths).forEach((key) => {
        dest[key] = paths[key].map(mapper);
    });
    return dest;
};
exports.loadConfig = (file) => {
    const { extends: ext, compilerOptions: { baseUrl, outDir, rootDir, paths } = {
        baseUrl: undefined,
        outDir: undefined,
        rootDir: undefined,
        paths: undefined,
    }, } = JSON.parse(stripJsonComments(fs_1.readFileSync(file).toString('utf8')));
    const config = {};
    if (baseUrl) {
        config.baseUrl = baseUrl;
    }
    if (outDir) {
        config.outDir = outDir;
    }
    if (rootDir) {
        config.rootDir = rootDir;
    }
    if (paths) {
        config.paths = paths;
    }
    if (ext) {
        const childConfigDirPath = path_1.dirname(file);
        const parentConfigPath = path_1.resolve(childConfigDirPath, ext);
        const parentConfigDirPath = path_1.dirname(parentConfigPath);
        const parentConfig = exports.loadConfig(parentConfigPath);
        if (parentConfig.baseUrl) {
            parentConfig.baseUrl = path_1.resolve(parentConfigDirPath, parentConfig.baseUrl);
        }
        return Object.assign(Object.assign({}, parentConfig), config);
    }
    return config;
};
//# sourceMappingURL=util.js.map