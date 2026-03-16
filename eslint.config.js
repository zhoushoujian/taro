//@ts-ignore
const config = require('@szhou/eslint-config');
const { defineConfig, globalIgnores } = require('eslint/config');

module.exports = defineConfig([
  ...config,
  globalIgnores(['fe/src/dist/*', 'fe/public/echarts-5.3.2.min.js']),
  {
    rules: {
      'no-restricted-imports': 0,
      '@typescript-eslint/no-unused-vars': 2,
      indent: 0,
      'no-await-in-loop': 0,
      'import/no-named-as-default': 0,
      'no-console': 0,
      'react/destructuring-assignment': 0,
      'react/react-in-jsx-scope': 0,
    },
    languageOptions: {
      globals: {
        wx: 'readonly',
        defineAppConfig: 'readonly',
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
]);
