import pluginNodeResolve from "@rollup/plugin-node-resolve";
import pluginCommonjs from "@rollup/plugin-commonjs";
import pluginTypescript from "@rollup/plugin-typescript";
import { babel as pluginBabel } from "@rollup/plugin-babel";
import { terser as pluginTerser } from "rollup-plugin-terser";
import dayjs from 'dayjs';

import * as path from "path";

import camelCase from "lodash.camelcase";
import upperFirst from "lodash.upperfirst";

import pkg from "./package.json";

const moduleName = upperFirst(camelCase(pkg.name.replace(/^\@.*\//, "")));

const banner = `/*!
 * ${moduleName} JavaScript Library v${pkg.version}
 * ${pkg.homepage}
 * Released under the ${pkg.license} license
 *
 * Date: ${ dayjs().format("YYYY-MM-DDTHH:mm") + "Z" }
 */`;

export default [
    // For Command
    {
      input: "src/bin/index.ts",
      output: [
        {
          file: "dist/bin/index.js",
          format: "cjs",
          sourcemap: "inline",
          banner: "#!/usr/bin/env node\n\n" + banner,
          exports: "default",
        },
      ],
      external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.devDependencies || {})],
      plugins: [
        pluginTypescript(),
        pluginBabel({
          babelHelpers: "bundled",
          configFile: path.resolve(__dirname, ".babelrc.js"),
        }),
      ],
    },
  {
    input: "src/index.ts",
    output: [
      {
        name: moduleName,
        file: pkg.browser,
        format: "iife",
        sourcemap: "inline",
        banner,
      },
      {
        name: moduleName,
        file: pkg.browser.replace(".js", ".min.js"),
        format: "iife",
        banner,
        plugins: [pluginTerser()],
      },
    ],
    plugins: [
      pluginTypescript(),
      pluginCommonjs({
        extensions: [".js", ".ts"],
      }),
      pluginBabel({
        babelHelpers: "bundled",
        configFile: path.resolve(__dirname, ".babelrc.js"),
      }),
      pluginNodeResolve({
        browser: true,
      }),
    ],
  },
  // For NPM
  {
    input: `src/index.ts`,
    output: [
      {
        file: pkg.module,
        format: "es",
        sourcemap: "inline",
        banner,
        exports: "named",
      },
    ],
    external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.devDependencies || {})],
    plugins: [
      pluginTypescript(),
      pluginBabel({
        babelHelpers: "bundled",
        configFile: path.resolve(__dirname, ".babelrc.js"),
      }),
    ],
  },
  // For NPM
  {
    input: "src/index.ts",
    output: [
      {
        file: pkg.main,
        format: "cjs",
        sourcemap: "inline",
        banner,
        exports: "default",
      },
    ],
    external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.devDependencies || {})],
    plugins: [
      pluginTypescript(),
      pluginBabel({
        babelHelpers: "bundled",
        configFile: path.resolve(__dirname, ".babelrc.js"),
      }),
    ],
  },
];
