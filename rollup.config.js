import typescript2 from 'rollup-plugin-typescript2';
import pkg from './package.json';

module.exports = {
    plugins: [
        typescript2({
            typescript: require('typescript'),
        }),
    ],
    external: Object.keys(pkg.dependencies),
    input: "src/index.ts",
    output: [
        {
            file: pkg.module,
            format: 'es'
        },
        {
            file: pkg.main,
            format: 'cjs'
        }
    ]
};