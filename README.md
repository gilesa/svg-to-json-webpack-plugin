# SVG to JSON Webpack Plugin
This [webpack](https://webpack.github.io/) plugin generates a collection of SVGs in JSON format from all `.svg` files in a directory. This strips out the svg and title tags for manually addition when loading the SVG data. In addition to the SVG data, it also returns each SVG's title and viewbox. This code is heavily based on the [SVG Spritemap Webpack Plugin](https://github.com/freshheads/svg-spritemap-webpack-plugin) by [Freshheads](https://www.freshheads.com/).

NPM: [`svg-to-json-webpack-plugin`](https://npmjs.com/package/svg-to-json-webpack-plugin)

## Installation
```shell
npm install svg-to-json-webpack-plugin --save-dev
```

## Usage
```js
// webpack.config.js
var SvgToJsonPlugin = require('svg-to-json-webpack-plugin');

module.exports = {
    // ...
    plugins: [
        new SvgToJsonPlugin({
            // Optional options object
        })
    ]
}
```

## Options

| Option          | Default           | Description                                                                                                                                         |
| --------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src`           | `'**/*.svg'`      | [`glob`](http://npmjs.com/package/glob) used for finding the SVGs that should be in the spritemap                                                   |
| `glob`          | `{}`              | Options object for [`glob`](http://npmjs.com/package/glob#options)
| `prefix`        | `'sprite-'`       | Prefix added to sprite identifier in the spritemap                                                                                                  |
| `filename`      | `'spritemap.json'` | Name for the generated file (located at the webpack `output.path`), `[hash]` and `[contenthash]` are supported                                      |
| `chunk`         | `'spritemap'`     | Name of the generated chunk                                                                                                                         |
| `deleteChunk`   | `true`            | Deletes the chunked file `chunk` after packing is complete                                                                                          |


## License
This project is [licensed](LICENSE.md) under the [MIT](https://opensource.org/licenses/MIT) license.
