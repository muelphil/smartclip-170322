import Vue, {VNode} from 'vue';
import {BaseSettings} from '@/plugins/basicSettings';
import {ClipboardExtended} from '@/clipboard-extended/clipboard-extended';
import {ActionService} from '@/services/ActionService';
import {GlobalService} from '@/services/GlobalService';
import MathService from '@/services/MathService';
import {ClipService} from '@/services/ClipService';
import SCEventEmitter from '@/services/SCEventEmitter';
import {Error} from '@/classes/Logger';
import {Plugin} from '@/plugins/types'

declare global {
    namespace JSX {
        // tslint:disable no-empty-interface
        interface Element extends VNode {
        }

        // tslint:disable no-empty-interface
        interface ElementClass extends Vue {
        }

        interface IntrinsicElements {
            [elem: string]: any
        }
    }

    type ApplicationServices = {
        global: GlobalService,
        clipboard: ClipService,
        actions: ActionService,
        math: MathService
    }

    interface Window {
        services: Partial<ApplicationServices>, // { [key: string]: any } & ApplicationServices,
        baseSettings: BaseSettings,
        settings: { [key: string]: object },
        clipboard: ClipboardExtended,

        hide()

        initialized: Promise<void>
        emitter: SCEventEmitter
    }

    namespace NodeJS {
        interface Global {
            settings: object
            plugins: Plugin[]
            pluginServices : {}

            requestPageSource(url, timeout?: number): Promise<{ html: string | null, status: number }>

            htmlToDocument(html: string): Document

            openUrl(url: string): void,

            openExternal(url: string): void,

            logger: {
                error(err: Error): void,
                addErrorListener(fn: (Error) => void): void,
                removeErrorListener(fn: (Error) => void): void,
                logFilePath: string
            }

            Vue: any // for plugin support
        }
    }

}
