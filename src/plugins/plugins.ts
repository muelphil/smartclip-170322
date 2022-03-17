import {clip} from '@/plugins/clip';
import {leo} from '@/plugins/leo';
import {echo} from '@/plugins/echo';
import {test} from '@/plugins/test';
import {tex} from '@/plugins/unicodetex'
import {math} from '@/plugins/math';
import {funcs} from '@/plugins/funcs';
import {start} from '@/plugins/start';
import {Plugin} from '@/plugins/types'
import {createPluginSettings} from "@/plugins/settings";
import {computed, shallowReactive} from "vue";
import {getPluginCachePath} from "@/initialize/paths";

const pluginServices = shallowReactive({});
global.pluginServices = pluginServices;

const basePlugin = start;

// const prefixPlugins: Plugin[] = [

// ];

// fs.readdirSync(pluginsPath, 'utf-8')
//     .filter(p => p.endsWith('.js'))
//     .map(p => {
//         const pluginPath = join(pluginsPath, p);
//         return __non_webpack_require__(pluginPath);
//     })
//     .forEach(p => prefixPlugins.push(p));

// const myPlugin = __non_webpack_require__('C:\\Users\\Philip\\.smartclipdev\\plugins\\main.js');
// prefixPlugins.push(myPlugin);

const plugins: Plugin[] = shallowReactive([]);

function registerPlugin(plugin: Plugin) {
    const pluginSettings = createPluginSettings(plugin);
    if (plugin.service) {
        console.log(`Plugin ${plugin.id} has service`)
        const service = new plugin.service(pluginSettings, getPluginCachePath);
        global.pluginServices[plugin.id] = service
    }
    plugins.push(plugin);
}

[clip, math, start,
    echo,
    leo,
    test,
    tex,
    funcs,
].forEach(registerPlugin);

// TODO remove this after reviewing the component registration
// setTimeout(() => {
//     prefixPlugins.forEach(plugin => {
//         console.debug(`registering component ${plugin.id} with name ${plugin.component.name}`)
//         vueApp.component(plugin.component.id, plugin.component);
//     });
// });

const prefixPlugins = computed(() => {
    return plugins.filter(p => p.id !== basePlugin.id);
})

export {
    prefixPlugins,
    plugins,
    basePlugin,
    pluginServices
};
