import { dirname, resolve } from 'path';
import { readFileSync } from 'fs';
import * as stripJsonComments from 'strip-json-comments';

/*
"baseUrl": ".",
"outDir": "lib",
"paths": {
  "src/*": ["src/*"]
},
*/

export interface IRawTSConfig {
  extends?: string;
  compilerOptions?: {
    baseUrl?: string;
    outDir?: string;
    rootDir?: string;
    paths?: { [key: string]: string[] };
  };
}

export interface ITSConfig {
  baseUrl?: string;
  outDir?: string;
  rootDir?: string;
  compilerOptions?: object;
  paths?: { [key: string]: string[] };
}

export const mapPaths = (
  paths: { [key: string]: string[] },
  mapper: (x: string) => string
): { [key: string]: string[] } => {
  const dest = {} as { [key: string]: string[] };
  Object.keys(paths).forEach((key) => {
    dest[key] = paths[key].map(mapper);
  });
  return dest;
};

export const loadConfig = (file: string): ITSConfig => {
  const {
    extends: ext,
    compilerOptions: { baseUrl, outDir, rootDir, paths } = {
      baseUrl: undefined,
      outDir: undefined,
      rootDir: undefined,
      paths: undefined,
    },
  } = JSON.parse(
    stripJsonComments(readFileSync(file).toString('utf8'))
  ) as IRawTSConfig;

  const config: ITSConfig = {};
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

    return {
      ...parentConfig,
      ...config,
    };
  }

  return config;
};
