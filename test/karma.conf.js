module.exports = function(config){
  config.set({

    files : [
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'src/**/*.js',
      'test/**/*.spec.js'
    ],

    autoWatch : false,
    singleRun: true,
		basePath:"../",

    reporters: ['spec'],
    frameworks: ['jasmine'],

    browsers : ['PhantomJS'],

    plugins : [
            'karma-phantomjs-launcher',
            'karma-jasmine',
            'karma-spec-reporter'
            ]

  });
};