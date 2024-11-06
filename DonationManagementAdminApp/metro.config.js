// metro.config.js
module.exports = {
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: true,
          inlineRequires: true,
        },
      }),
    },
    resolver: {
      assetExts: ['png', 'jpg', 'jpeg', 'svg', 'gif', 'webp'],
    },
  };
  