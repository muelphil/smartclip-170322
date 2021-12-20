import { allPlugins } from '@/plugins/plugins';
import { settings } from '@/plugins/settings';

const _pluginServices = allPlugins.filter(plugin => plugin.service)
    .reduce((services, plugin) => {
        const pluginSettings = settings[plugin.id];
        services[plugin.id] = new plugin.service({test: pluginSettings});
        return services;
    }, {});

console.debug('[Initialization] Plugin services generated: ', _pluginServices);
export const pluginServices = _pluginServices;
