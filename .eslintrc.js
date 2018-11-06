
module.exports = {

  "extends": ["eslint:recommended"],//使用ESLint的推荐配置 下面的内容是覆盖推荐配置
  "rules":{
    "no-console": ["error",{
      "allow": ["warn","error","info"]
    }]
  },
  "parser":"babel-eslint",//解析器
  "parserOptions": {
    "ecmaversion": 6,
    "sourceType": "script"
  },
  "globals": {
    // "window":true
  },
  "env": {
    "browser":false,
    "node":true,
    "es6":true,
    "mocha":true
  }
};
