module.exports = {
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": [
    "eslint:recommended",
    "@react-native-community/eslint-config",
    "plugin:react-hooks/recommended"
  ],
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "plugins": [
    "react"
  ],
  "rules": {
    "no-unused-vars": "warn",
    'prettier/prettier': 0,
  }
};


/**
 *

yarn add --dev eslint prettier @react-native-community/eslint-config eslint-plugin-react eslint-plugin-react-hooks

 */
