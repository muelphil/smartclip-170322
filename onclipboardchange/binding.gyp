{
  'targets': [{
    'target_name': 'onclipboardchange',
    "include_dirs": [
      "<!@(node -p \"require('node-addon-api').include\")",
      "<!@(node -p \"require('napi-thread-safe-callback').include\")"
    ],
    "cflags!": [ "-fno-exceptions" ],
    'libraries': ['Dwmapi.lib'],
    'sources': [
        "./src/index.cpp",
        "./src/onpaste.cpp",
        "./src/oncopy.cpp",
        "./src/disableanimations.cpp",
        "./src/writebuffers.cpp"
    ],
    'cflags!': [ '-fno-exceptions' ],
    'cflags_cc!': [ '-fno-exceptions' ],
    'xcode_settings': {
      'GCC_ENABLE_CPP_EXCEPTIONS': 'YES',
      'CLANG_CXX_LIBRARY': 'libc++',
      'MACOSX_DEPLOYMENT_TARGET': '10.7',
    },
    'msvs_settings': {
      'VCCLCompilerTool': { 'ExceptionHandling': 1 },
    },
    'conditions': [
      ['OS=="win"', { 'defines': [ '_HAS_EXCEPTIONS=1' ] }]
    ]
  }]
}