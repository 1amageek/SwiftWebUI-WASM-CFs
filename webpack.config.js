const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'app/index.js'),
  mode: 'development',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'functions/lib/scripts'),
  },
  devServer: {
    inline: true,
    watchContentBase: true,
    contentBase: [
      path.join(__dirname, 'public'),
      path.join(__dirname, 'dist'),
    ],
  },
};
