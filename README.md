# generate-index-webpack-plugin

This plugin brings VSCode extension [Generate Index](https://marketplace.visualstudio.com/items?itemName=JayFong.generate-index) to [webpack](https://webpack.js.org/).

## Install

```bash
npm i generate-index-webpack-plugin -D
```

## Usage

```js
// webpack.config.js
const GenerateIndexPlugin = require('generate-index-webpack-plugin')

module.exports = {
  plugins: [
    new GenerateIndexPlugin({
      // index file paths
      patterns: [
        'src/assets/all.js',
        'src/**/index.{js,ts}',
        '!src/**/ignore/index.js',
      ],
    }),
  ],
}
```

## License

Jay Fong (c) MIT
