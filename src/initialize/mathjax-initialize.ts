import {settings} from '@/plugins/settings';

(global as any).MathJax = {
    showProcessingMessages: false,
    tex: {
        // inlineMath: [['$', '$'], ['\\(', '\\)']],
        packages: {'[+]': ['configmacros']},
        macros: settings?.math?.mathjaxTexMacros || ''
    },
    svg: {
        fontCache: 'global',
        scale: 2,
        exFactor: 1
    },
    startup: {
        typeset: false
    }
};

// require('mathjax-full/es5/input/asciimath');
// require('mathjax-full/es5/input/asciimath');


// import {mathjax} from 'mathjax-full/ts/mathjax';
// console.log('mathjax(?)=', mathjax)


require('mathjax-full/components/src/startup/lib/startup.js');
require('mathjax-full/components/src/core/core.js');
// require('mathjax-full/components/src/adaptors/liteDOM/liteDOM.js');
require('mathjax-full/components/src/input/tex-base/tex-base.js');
require('mathjax-full/components/src/input/tex/extensions/all-packages/all-packages.js');
// require('mathjax-full/components/src/input/asciimath/asciimath.js');
require('mathjax-full/components/src/output/svg/svg.js');
require('mathjax-full/components/src/output/svg/fonts/tex/tex.js');
require('mathjax-full/components/src/startup/startup.js');

const {liteAdaptor} = require('mathjax-full/js/adaptors/liteAdaptor.js');
const {RegisterHTMLHandler} = require('mathjax-full/js/handlers/html.js');
const adaptor = liteAdaptor();
const handler = RegisterHTMLHandler(adaptor);

(global as any).MathJax.loader.preLoad(
    'core',
    // 'adaptors/liteDOM',
    'adaptors/lite',
    'input/tex-base',
    // 'input/asciimath',
    '[tex]/all-packages',
    'output/svg',
    'output/svg/fonts/tex',
    'a11y/assistive-mml'
);
(global as any).MathJax.config.startup.ready();
// require('mathjax-full/es5/input/asciimath');
