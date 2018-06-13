module.exports = {
  parserOptions: {
    // Required for certain syntax usages
    ecmaVersion: 8
  },
  env: {
    jest: true
  },
  rules: {
    "import/no-extraneous-dependencies": "off",
    "no-console": "off"
  }
};
