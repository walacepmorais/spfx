'use strict';

const build = require('@microsoft/sp-build-web');

build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);
build.addSuppression(`Warning - [sass] The local CSS class 'play-button' is not camelCase and will not be type-safe.`);
build.addSuppression(`Warning - [sass] The local CSS class 'close-video' is not camelCase and will not be type-safe.`);
build.addSuppression(`Warning - [sass] The local CSS class 'video-wrapper' is not camelCase and will not be type-safe.`);
build.addSuppression(`Warning - [sass] The local CSS class 'image-gallery' is not camelCase and will not be type-safe.`);
build.addSuppression(`Warning - [sass] The local CSS class 'app-sandbox' is not camelCase and will not be type-safe.`);
build.addSuppression(`Warning - [sass] The local CSS class 'app-sandbox-content' is not camelCase and will not be type-safe.`);
build.addSuppression(`Warning - [sass] The local CSS class 'app-buttons' is not camelCase and will not be type-safe.`);
build.addSuppression(`Warning - [sass] The local CSS class 'app-header' is not camelCase and will not be type-safe.`);
build.addSuppression(`Warning - [sass] The local CSS class 'app-interval-input-group' is not camelCase and will not be type-safe.`);
build.addSuppression(`Warning - [sass] The local CSS class 'app-interval-label' is not camelCase and will not be type-safe.`);
build.addSuppression(`Warning - [sass] The local CSS class 'app-interval-input' is not camelCase and will not be type-safe.`);
build.addSuppression(`Warning - [sass] The local CSS class 'app-checkboxes' is not camelCase and will not be type-safe.`);

// Font loader configuration for webfonts
const fontLoaderConfig = {
    test: /\.(woff(2)?|ttf|eot|svg|otf)(\?v=\d+\.\d+\.\d+)?$/,
    use: [{
      loader: 'file-loader',
      options: {
        name: '[name].[ext]',
        outputPath: 'fonts/'
      }
    }]
  };
  
  // Merge custom loader to web pack configuration
  build.configureWebpack.mergeConfig({
    additionalConfiguration: (generatedConfiguration) => {
  
      generatedConfiguration.module.rules.push(fontLoaderConfig);
  
      return generatedConfiguration;
  
    }
  
  });

build.initialize(require('gulp'));
