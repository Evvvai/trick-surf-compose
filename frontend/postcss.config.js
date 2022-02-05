module.exports = {
  plugins: {
    'postcss-import': {},
    autoprefixer: {},
    'postcss-flexbugs-fixes': {},
    'postcss-preset-env': {
      autoprefixer: {
        flexbox: 'no-2009',
        grid: 'autoplace'
      },
      stage: 3,
      features: {
        'custom-properties': false
      }
    },
    'postcss-calc': {
      precision: 10,
      selectors: true,
      mediaQueries: true,
      preserve: true
    },
    cssnano: {
      preset: 'default'
    }
  }
}
