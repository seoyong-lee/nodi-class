import noRawColor from './rules/no-raw-color.js';
import noShadow from './rules/no-shadow.js';

/** @type {import('eslint').ESLint.Plugin} */
const plugin = {
  meta: {
    name: 'eslint-plugin-nodi',
    version: '0.0.0',
  },
  rules: {
    'no-raw-color': noRawColor,
    'no-shadow': noShadow,
  },
};

export default plugin;
