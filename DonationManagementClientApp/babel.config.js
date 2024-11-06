module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['@babel/plugin-transform-class-properties', { loose: true }],
    ['@babel/plugin-transform-private-methods', { loose: true }],
    ['@babel/plugin-transform-private-property-in-object', { loose: true }],
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        blocklist: null, // or an array of regexes if you want to exclude some variables
        allowlist: null, // or an array of variable names to include
        safe: false, // set to true if you want to ensure all variables are defined in .env
        allowUndefined: true, // allow undefined variables in .env
      },
    ],
  ],
};
