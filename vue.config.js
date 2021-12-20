// console.log('======================================================================');
// console.log(...);
// console.log('======================================================================');

// Prevent nedb from substituting browser storage when running from the
// Electron renderer thread.
const fixNedbForElectronRenderer = {
    apply(resolver) {
        resolver
        // Plug in after the description file (package.json) has been
        // identified for the import, because we'll depend on it for some of
        // the logic below.
            .getHook("beforeDescribed-relative")
            .tapAsync(
                "FixNedbForElectronRenderer",
                (request, resolveContext, callback) => {
                    // Detect that the import is from NeDB via the description file
                    // detect for the import. Calling `callback` with no parameters
                    // "bails", which proceeds with the normal resolution process.
                    if ( !request.descriptionFileData.name === "nedb" ) {
                        return callback();
                    }

                    // When a require/import matches the target files from nedb, we
                    // can form the paths to the Node-specific versions of the files
                    // relative to the location of the description file. We can then
                    // short-circuit the Webpack resolution process by calling the
                    // callback with the finalized request object -- meaning that
                    // the `path` is pointing at the file that should be imported.
                    let relativePath;
                    if (
                        request.path.startsWith(
                            resolver.join(request.descriptionFileRoot, "lib/storage")
                        )
                    ) {
                        relativePath = "lib/storage.js";
                    } else if (
                        request.path.startsWith(
                            resolver.join(
                                request.descriptionFileRoot,
                                "lib/customUtils"
                            )
                        )
                    ) {
                        relativePath = "lib/customUtils.js";
                    } else {
                        // Must be a different file from NeDB, so bail.
                        return callback();
                    }

                    const path = resolver.join(
                        request.descriptionFileRoot,
                        relativePath
                    );
                    const newRequest = Object.assign({}, request, {path});
                    callback(null, newRequest);
                }
            );
    }
};

module.exports = {
    chainWebpack: config => {
        config.optimization.minimize(false);
        config.plugin('html')
            .tap(args => {
                args[0].minify = false;
                return args;
            });
    }, // TODO disable uglify
    runtimeCompiler: true, // for runtime Vue components with templates
    configureWebpack: {
        resolve: {
            plugins: [fixNedbForElectronRenderer]
        },
        output: {
            pathinfo: true
        },
        optimization: { // TODO disable uglify
            namedModules: true,
            minimize: false
        },
        // the webpack config just works
        // target: 'node',
        node: {
            __dirname: false
            //     __filename: false
        }
    },
    pluginOptions: {
        electronBuilder: {
            enablePreferredSizeMode: true,
            compression: 'store',
            nodeIntegration: true,
            // new in electron 12 +
            contextIsolation: false,
            enableRemoteModule: true,
            //
            nodeIntegrationInWorker: true,
            webSecurity: false,
            builderOptions: {
                appId: 'smartclip', // needed for notifications
                "extraResources": [ // this copies the specified directory into the extraResources folder of the installation
                    {
                        "from": "./src/extraResources/",
                        "to": "",
                        "filter": [
                            "**/*"
                        ]
                    }
                ],
                icon: 'public/icons/favicon/clipboards.icon',
                nsis: {
                    oneClick: false,
                    allowToChangeInstallationDirectory: true,
                    deleteAppDataOnUninstall: true,
                    installerIcon: 'public/icons/favicon/installerIcon.ico',
                    uninstallerIcon: 'public/icons/favicon/uninstallerIcon.ico'
                },
                win: {
                    asar: false,
                    target: "nsis",
                    icon: 'icons/favicon/clipboards.ico'
                },
                linux: {
                    icon: 'icons/favicon/clipboard.ico',
                    target: 'deb'
                },
                directories: {
                    buildResources: "public", // makes resources in  public folder like icons available for the build process
                    output: "dist_electron"
                }
            }
        }
    }
};
