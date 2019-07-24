import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import external from "rollup-plugin-peer-deps-external";
import resolve from "rollup-plugin-node-resolve";
import url from "rollup-plugin-url";
import globby from "globby";

import pkg from "./package.json";

const defaultConf = {
  input: 'src/index.js',
  external: [
    'resize-observer-polyfill',
    'get-node-dimensions',
    'react-measure/lib/with-content-rect',
    'react-measure',
    'lodash.debounce',
    'react',
    'invariant',
    'react-dom',
    'prop-types',
    'draft-js/lib/getVisibleSelectionRect',
    'react-event-listener',
    'react-window-dimensions',
  ],
  output: [
    {
      file: pkg.main,
      format: 'cjs'
    },
    {
      file: pkg.module,
      format: 'es'
    }
  ],
  plugins: [
    external(),
    url(),
    babel({
      exclude: 'node_modules/**'
    }),
    resolve(),
    commonjs()
  ]
};

export default [
  defaultConf,
  ...globby.sync('./src/lib/*.js')
  .map(filePath => ({
    ...defaultConf,
    input: filePath,
    output: [
      {
        file: filePath.replace('src\/', ''),
        format: 'cjs'
      }
    ],
  }))
];
