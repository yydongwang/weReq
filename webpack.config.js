let path = require('path')
module.exports = [
  {
    mode: 'production',
    entry: './src/index.ts',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js']
    },
    output: {
      path: path.join(__dirname, 'build'),
      filename: 'weReq.min.js',
      libraryTarget: 'commonjs-module',
      libraryExport: 'default'
    },
    plugins: []
  }
]
