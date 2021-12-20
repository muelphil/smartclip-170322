// Info: don't change the order of imports - it is really important!
import '@/initialize/paths' // main
import '@/utils/electronHelpers/enable-rightclick'; // renderer
import './vue-initialize' // main
import './globals-initialize' // renderer
import './mathjax-initialize' // renderer - App only
import './settings-initialize' // main?
import './services-initialize' // renderer ??
import './emitter-initialize' // renderer - App only
// allPlugins
