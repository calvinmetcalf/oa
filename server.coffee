express = require 'express'
coffee=require 'coffee-script'
fs=require 'fs'
uglify = require 'uglify-js'
app = express()
recompile=()->
    scripts = ["jquery.1.8.3.js","jquery-ui.1.9.2.js","leaflet-src.js","jquery.placeholder.js","leaflet-hash.js","leaflet-providers.js","leaflet.ajax.js","map.js","more.coffee"].map (v)->
        if v.slice(-2)=="js"
            fs.readFileSync "./assets/"+v
        else if v.slice(-6)=="coffee"
            coffee.compile("#{fs.readFileSync('./assets/'+v) }")

    fs.writeFileSync "./public/leaflet-bundle.js",scripts.join("\n")
    ast = uglify.parse scripts.join("\n") 
    ast.figure_out_scope()
    ast.compute_char_frequency()
    ast.mangle_names()
    fs.writeFileSync "./public/leaflet-bundle.min.js",ast.print_to_string()
    true
recompile()
fs.watch "./assets",recompile
app.use express.static('./public')
app.use express.logger('dev') 
app.get '/scripts.js', (req, res)->
    
int = require './internals.coffee'
int.run(app)