var fs = require('fs'),
    path = require('path'),
    glob = require('glob'),
    idify = require('html4-id'),
    merge = require('webpack-merge'),
    xmldom = require('xmldom')


function SvgToJsonPlugin(options) {
    this.options = merge({
        src: '**/*.svg',
        glob: {},
        prefix: 'sprite-',
        filename: 'spritemap.json',
        outputPath: '/'
    }, options)
}

SvgToJsonPlugin.prototype.apply = function(compiler) {
    var options = this.options
    
    compiler.plugin('this-compilation', function(compilation) {
        var files = glob.sync(options.src)

        var generateSVG = function() {
            // No point in generating when there are no files
            if ( !files.length ) {
                return ''
            }

            // Initialize DOM/XML classes
            var DOMParser = new xmldom.DOMParser(),
                XMLSerializer = new xmldom.XMLSerializer(),
                XMLDoc = new xmldom.DOMImplementation().createDocument(null, null, null) // `document` alternative for NodeJS environments
            
            // Create object to store data 
            var spritemap = {}
            
            // Add data for each file
            files.forEach(function(file) {
                var id = options.prefix + path.basename(file, path.extname(file)),
                    validId = idify(id)

                // Parse source SVG
                var contents = fs.readFileSync(file, 'utf8'),
                    svg = DOMParser.parseFromString(contents).documentElement,
                    viewbox = (svg.getAttribute('viewBox') || svg.getAttribute('viewbox')).split(' ').map(function(a) { return parseFloat(a) }),
                    width = parseFloat(svg.getAttribute('width')),
                    height = parseFloat(svg.getAttribute('height'))

                if ( viewbox.length !== 4 && ( isNaN(width) || isNaN(height) ) ) {
                    console.error('Skipping sprite \'%s\' since it\'s lacking both a viewBox and width/height attributes...', id.replace(options.prefix, ''))
                    return
                }
                if ( viewbox.length !== 4 ) {
                    viewbox = [0, 0, width, height]
                }

                // Add the original contents of the SVG file to the content string
                var content = ''

                for( var i = 0; i < svg.childNodes.length; i++ ) {
                    var node = svg.childNodes[i]

                    // Skip title tags
                    if ( node.tagName && node.tagName.toLowerCase() === 'title' ) {
                        continue
                    }

                    content += XMLSerializer.serializeToString(node).replace( /xmlns=".+"/, '').trim()
                }

                // Add svg viewbox and content to spritemap object under id
                spritemap[ validId ] = {
                    title: id,
                    viewbox: viewbox.join(' '),
                    content: content.replace(/[\r\n\t]/g, '').replace(/>  +</g, '><')
                }
            })

            // Return JSON string of spritemap
            return JSON.stringify(spritemap)
        }

        // Write SVG JSON file to filesystem
        var svg = generateSVG()
        fs.writeFileSync(path.resolve(options.outputPath, options.filename), svg)
    })
}

module.exports = SvgToJsonPlugin
