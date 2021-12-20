// const MathJax = {
//     tex: {
//         packages: ['base'],        // extensions to use
//         inlineMath: [              // start/end delimiter pairs for in-line math
//             ['\\(', '\\)']
//         ],
//         displayMath: [             // start/end delimiter pairs for display math
//             ['$$', '$$'],
//             ['\\[', '\\]']
//         ],
//         processEscapes: true,      // use \$ to produce a literal dollar sign
//         processEnvironments: true, // process \begin{xxx}...\end{xxx} outside math mode
//         processRefs: true,         // process \ref{...} outside of math mode
//         digits: /^(?:[0-9]+(?:\{,\}[0-9]{3})*(?:\.[0-9]*)?|\.[0-9]+)/,
//         // pattern for recognizing numbers
//         tags: 'none',              // or 'ams' or 'all'
//         tagSide: 'right',          // side for \tag macros
//         tagIndent: '0.8em',        // amount to indent tags
//         useLabelIds: true,         // use label name rather than tag for ids
//         multlineWidth: '85%',      // width of multline environment
//         maxMacros: 1000,           // maximum number of macro substitutions per expression
//         maxBuffer: 5 * 1024,       // maximum size for the internal TeX string (5K)
//         baseURL: null,                  // URL for use with links to tags (when there is a <base> tag in effect)
//         formatError:               // function called when TeX syntax errors occur
//             (jax, err) => jax.formatError(err),
//     },
//     mml: {
//         parseAs: 'html',                     // or 'xml'
//         forceReparse: false,                 // true to serialize and re-parse all MathML
//         parseError: function (node) {        // function to process parsing errors
//             this.error(this.adaptor.textContent(node).replace(/\n.*/g, ''));
//         },
//         verify: {                            // parameters controling verification of MathML
//             checkArity: true,                  //   check if number of children is correct
//             checkAttributes: false,            //   check if attribute names are valid
//             fullErrors: false,                 //   display full error messages or just error node
//             fixMmultiscripts: true,            //   fix unbalanced mmultiscripts
//             fixMtables: true                   //   fix incorrect nesting in mtables
//         }
//     },
//     asciimath: {
//         fixphi: true,              // true for TeX mapping, false for unicode mapping
//         displaystyle: true,        // true for displaystyle typesetting, false for in-line
//         decimalsign: '.'           // character to use for decimal separator
//     },
//     chtml: {
//         scale: 1,                      // global scaling factor for all expressions
//         minScale: .5,                  // smallest scaling factor to use
//         matchFontHeight: true,         // true to match ex-height of surrounding font
//         mtextInheritFont: false,       // true to make mtext elements use surrounding font
//         merrorInheritFont: true,       // true to make merror text use surrounding font
//         mathmlSpacing: false,          // true for MathML spacing rules, false for TeX rules
//         skipAttributes: {},            // RFDa and other attributes NOT to copy to the output
//         exFactor: .5,                  // default size of ex in em units
//         displayAlign: 'center',        // default for indentalign when set to 'auto'
//         displayIndent: '0',            // default for indentshift when set to 'auto'
//         fontURL: '[mathjax]/components/output/chtml/fonts/woff-v2',   // The URL where the fonts are found
//         adaptiveCSS: true              // true means only produce CSS that is used in the processed equations
//     },
//     svg: {
//         scale: 1,                      // global scaling factor for all expressions
//         minScale: .5,                  // smallest scaling factor to use
//         mtextInheritFont: false,       // true to make mtext elements use surrounding font
//         merrorInheritFont: true,       // true to make merror text use surrounding font
//         mathmlSpacing: false,          // true for MathML spacing rules, false for TeX rules
//         skipAttributes: {},            // RFDa and other attributes NOT to copy to the output
//         exFactor: .5,                  // default size of ex in em units
//         displayAlign: 'center',        // default for indentalign when set to 'auto'
//         displayIndent: '0',            // default for indentshift when set to 'auto'
//         fontCache: 'local',            // or 'global' or 'none'
//         localID: null,                 // ID to use for local font cache (for single equation processing)
//         internalSpeechTitles: true,    // insert <title> tags with speech content
//         titleID: 0                     // initial id number to use for aria-labeledby titles
//     },
//     options: {
//         skipHtmlTags: [            //  HTML tags that won't be searched for math
//             'script', 'noscript', 'style', 'textarea', 'pre',
//             'code', 'annotation', 'annotation-xml'
//         ],
//         includeHtmlTags: {         //  HTML tags that can appear within math
//             br: '\n', wbr: '', '#comment': ''
//         },
//         ignoreHtmlClass: 'tex2jax_ignore',    //  class that marks tags not to search
//         processHtmlClass: 'tex2jax_process',  //  class that marks tags that should be searched
//         compileError: function (doc, math, err) {
//             doc.compileError(math, err);
//         },
//         typesetError: function (doc, math, err) {
//             doc.typesetError(math, err);
//         },
//         renderActions: {},
//         enableEnrichment: true,  // false to disable enrichment
//         enrichSpeech: 'none',    // or 'shallow', or 'deep'
//         enableMenu: true,          // set to false to disable the menu
//         menuOptions: {
//             settings: {
//                 texHints: true,        // put TeX-related attributes on MathML
//                 semantics: false,      // put original format in <semantic> tag in MathML
//                 zoom: 'NoZoom',        // or 'Click' or 'DoubleClick' as zoom trigger
//                 zscale: '200%',        // zoom scaling factor
//                 renderer: 'CHTML',     // or 'SVG'
//                 alt: false,            // true if ALT required for zooming
//                 cmd: false,            // true if CMD required for zooming
//                 ctrl: false,           // true if CTRL required for zooming
//                 shift: false,          // true if SHIFT required for zooming
//                 scale: 1,              // scaling factor for all math
//                 collapsible: false,    // true if complex math should be collapsible
//                 inTabOrder: true,      // true if tabbing includes math
//             },
//             annotationTypes: {
//                 TeX: ['TeX', 'LaTeX', 'application/x-tex'],
//                 StarMath: ['StarMath 5.0'],
//                 Maple: ['Maple'],
//                 ContentMathML: ['MathML-Content', 'application/mathml-content+xml'],
//                 OpenMath: ['OpenMath']
//             }
//         },
//         safeOptions: {
//             allow: {
//                 //
//                 //  Values can be "all", "safe", or "none"
//                 //
//                 URLs: 'safe',   // safe are in safeProtocols below
//                 classes: 'safe',   // safe start with mjx- (can be set by pattern below)
//                 cssIDs: 'safe',   // safe start with mjx- (can be set by pattern below)
//                 styles: 'safe'    // safe are in safeStyles below
//             },
//             //
//             //  Which URL protocols are allowed
//             //
//             safeProtocols: {
//                 http: true,
//                 https: true,
//                 file: true,
//                 javascript: false,
//                 data: false
//             },
//             //
//             //  Which styles are allowed
//             //
//             safeStyles: {
//                 color: true,
//                 backgroundColor: true,
//                 border: true,
//                 cursor: true,
//                 margin: true,
//                 padding: true,
//                 textShadow: true,
//                 fontFamily: true,
//                 fontSize: true,
//                 fontStyle: true,
//                 fontWeight: true,
//                 opacity: true,
//                 outline: true
//             },
//             lengthMax: 3,                           // Largest padding/border/margin, etc. in em's
//             scriptsizemultiplierRange: [.6, 1],     // Valid range for scriptsizemultiplier
//             scriptlevelRange: [-2, 2],              // Valid range for scriptlevel
//             classPattern: /^mjx-[-a-zA-Z0-9_.]+$/,  // Pattern for allowed class names
//             idPattern: /^mjx-[-a-zA-Z0-9_.]+$/,     // Pattern for allowed ids
//             dataPattern: /^data-mjx-/               // Pattern for data attributes
//         }
//     },
//     loader: {
//         // paths: {mathjax: Loader.getRoot()},          // the path prefixes for use in specifying components
//         source: {},                                  // the URLs for components, when defaults aren't right
//         dependencies: {},                            // arrays of dependencies for each component
//         provides: {},                                // components provided by each component
//         load: [],                                    // array of components to load
//         // ready: Loader.defaultReady.bind(Loader),     // function to call when everything is loaded
//         failed: function (error) {                   // function to call if a component fails to load
//             console.log(`MathJax(${error.package || '?'}): ${error.message}`);
//         },
//         require: null                                // function to use for loading components
//     },
//     startup: {
//         elements: null,          // The elements to typeset (default is document body)
//         typeset: true,           // Perform initial typeset?
//         // ready: Startup.defaultReady.bind(Startup),          // Called when components are loaded
//         // pageReady: Startup.defaultPageReady.bind(Startup),  // Called when MathJax and page are ready
//         document: document,      // The document (or fragment or string) to work in
//         input: [],               // The names of the input jax to use from among those loaded
//         output: null,            // The name for the output jax to use from among those loaded
//         handler: null,           // The name of the handler to register from among those loaded
//         adaptor: null            // The name for the DOM adaptor to use from among those loaded
//     }
// };
