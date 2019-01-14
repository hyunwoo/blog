module.exports = () => {
  return {
    files: [
      'style/calculator.css',
      {
        pattern: 'lib/jquery.js',
        instrument: false
      },
      'src/*.js',
      'src/**/*.ts',
      'test/helper/template.js'
    ],
    tests: [
      'test/*Spec.js'
    ],
    env: {
      kind: 'chrome'
    },
    debug: true
  };
};