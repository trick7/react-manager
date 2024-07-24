module.exports = {
  env: { browser: true, es2020: true, node: true },//browser: 是否允许在浏览器中使用eslint es2020: 是否允许使用es2020语法 node: 是否允许在node中使用eslint
  extends: [
    'eslint:recommended',//eslint推荐规则的一套核心规则
    'plugin:@typescript-eslint/recommended',//eslint推荐规则的一套类型规则
    'plugin:react-hooks/recommended',//eslint推荐规则的一套react-hooks规则
  ],
  parser: '@typescript-eslint/parser',//eslint解析器
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },// ecmaVersion:'latest'设置ESMAScript版本为最新的版本 sourceType:'module'表示代码江被视为模块
  plugins: ['react-refresh'],//eslint插件
  rules: {
    'react-refresh/only-export-components': 'warn',//用于警告只导出组件的规则
    '@typescript-eslint/no-namespace':'off'//允许使用命名空间
  },
}
