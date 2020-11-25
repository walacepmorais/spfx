'use strict';

const gulp = require('gulp');
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

gulp.task('version-sync', function () {

  // import gulp utilits to write error messages
  const gutil = require('gulp-util');

  // import file system utilities form nodeJS
  const fs = require('fs');

  // read package.json
  var pkgConfig = require('./package.json');

  // read configuration of web part solution file
  var pkgSolution = require('./config/package-solution.json');

  // log old version
  gutil.log('Old Version:\t' + pkgSolution.solution.version);

  // Generate new MS compliant version number
  var newVersionNumber = pkgConfig.version.split('-')[0] + '.0';

  // assign newly generated version number to web part version
  pkgSolution.solution.version = newVersionNumber;

  // log new version
  gutil.log('New Version:\t' + pkgSolution.solution.version);

  // write changed package-solution file
  //fs.writeFile('./config/package-solution.json', JSON.stringify(pkgSolution, null, 4));

  fs.writeFile('./config/package-solution.json', JSON.stringify(pkgSolution, null, 4), function(err, result) {

    if (err) console.log('error', err);

});

});
