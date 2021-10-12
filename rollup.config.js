import esbuild from 'rollup-plugin-esbuild'
import pkg from './package.json'
import path from 'path'
import alias from '@rollup/plugin-alias';
import resolve from '@rollup/plugin-node-resolve';
// env
const env = process.env.ENV
console.log('ENV', env)
//
const src = path.join(process.cwd(), 'src')
const projectRootDir = path.resolve(__dirname);
const customResolver = resolve({
  extensions: ['.mjs', '.js', '.jsx', '.json', '.sass', '.scss']
});
//
const config = [
  {
    plugins: [
      alias({
        entries: [
          {find: /^~/, replacement: ''},
          // {find: 'src/', replacement: path.join(src, '/').replace(/\\/gi, '/')},
          {
            find: 'src',
            replacement: path.resolve(projectRootDir, 'src')
          }
        ],
        customResolver
      }),
      resolve(),
      esbuild({
        // All options are optional
        include: /\.[jt]sx?$/, // default, inferred from `loaders` option
        exclude: /node_modules/, // default
        sourceMap: !!env === 'dev', // default
        minify: env === 'prod',
        target: 'esnext', // default, or 'es20XX', 'esnext'
        jsx: 'preserve', // default, or 'preserve'
        jsxFactory: 'React.createElement',
        jsxFragment: 'React.Fragment',
        // Like @rollup/plugin-replace
        define: {
          'process.env.ENV': `"${env}"`,
          'process.env.VERSION': `"${pkg.version}"`,
          global: 'window'
        },
        tsconfig: 'tsconfig.json', // default
        // Add extra loaders
        loaders: {
          // Add .json files support
          // require @rollup/plugin-commonjs
          '.json': 'json',
          // Enable JSX in .js files too
          '.js': 'jsx',
          '.tsx': 'tsx',
          '.ts': 'ts',
          '.css': 'css',
          '.svg': 'dataurl',
          '.png': 'dataurl',
        },
        // experimentalBundling: true
      }),
    ],
    input: 'src/index.ts',
    output: [
      {
        // file: 'dist/index.js',
        // format: 'esm',
        dir: './dist',
        format: 'esm',
        entryFileNames: () => '[name].es.js',
        // sourcemap: true
      },
    ],
  },
]
export default config
