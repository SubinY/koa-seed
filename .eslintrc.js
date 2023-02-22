module.exports = {
  extends: 'standard',
  rules: {
    semi: ['warn', 'always'],
    quotes: ['warn', 'single'],
    camelcase: 0,
    'eol-last': 0,
    'no-unreachable': 0,
    'space-before-function-paren': 0,
    'no-unused-vars': 1,
    'handle-callback-err': 0,
    'one-var': 0,
    'spaced-comment': 0
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
  // env: {
  //   jest: true
  // }
};
