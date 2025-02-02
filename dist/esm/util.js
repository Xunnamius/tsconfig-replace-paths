import { dirname, resolve } from 'path';
import { readFileSync } from 'fs';
import * as stripJsonComments from 'strip-json-comments';
export const mapPaths = (paths, mapper) => {
    const dest = {};
    Object.keys(paths).forEach((key) => {
        dest[key] = paths[key].map(mapper);
    });
    return dest;
};
export const loadConfig = (file) => {
    const { extends: ext, compilerOptions: { baseUrl, outDir, rootDir, paths } = {
        baseUrl: undefined,
        outDir: undefined,
        rootDir: undefined,
        paths: undefined,
    }, } = JSON.parse(stripJsonComments(readFileSync(file).toString('utf8')));
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
        const childConfigDirPath = dirname(file);
        const parentConfigPath = resolve(childConfigDirPath, ext);
        const parentConfigDirPath = dirname(parentConfigPath);
        const parentConfig = loadConfig(parentConfigPath);
        if (parentConfig.baseUrl) {
            parentConfig.baseUrl = resolve(parentConfigDirPath, parentConfig.baseUrl);
        }
        return Object.assign(Object.assign({}, parentConfig), config);
    }
    return config;
};
//# sourceMappingURL=util.js.map