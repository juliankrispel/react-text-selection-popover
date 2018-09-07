import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import external from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import resolve from "rollup-plugin-node-resolve";
import url from "rollup-plugin-url";

import pkg from "./package.json";

export default {
  input: 'src/index.js',
  external: [
    'react-measure',
    'lodash.debounce',
    'react',
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
    postcss({
      modules: true
    }),
    url(),
    babel({
      exclude: 'node_modules/**'
    }),
    resolve(),
    commonjs()
  ]
};
