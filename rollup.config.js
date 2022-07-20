import resolve from '@rollup/plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from '@rollup/plugin-babel'
import { terser } from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-typescript2'
export default {
  input: './src/index.ts',
  output: [
    {
      file: './dist/openBcut.umd.js',
      format: 'umd',
      name: 'OpenBcut'
    },
    {
      file: './dist/openBcut.es.js',
      format: 'es'
    }
  ],
  external: ['@bilibili/js-bridge'],
  plugins: [
    resolve(),
    commonjs(),
    terser(),
    typescript({ useTsconfigDeclarationDir: true }),
    babel({
      exclude: 'node_modules/**',
      extensions: ['.js', '.ts'],
      babelHelpers: "runtime"
    })
  ]
}