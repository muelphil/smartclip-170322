import { Action, ActionInstance, allPlugins } from '@/plugins/plugins';
import { ClipboardEntry } from '@/classes/ClipboardEntry';


export class ActionService {

    actions: Action[] = allPlugins.map(p => {
        const actions = p.actions || [];
        return actions.map(action => ({...action, pluginId: p.id}));
    }).flat();

    getActionsForEntry(entry: ClipboardEntry): ActionInstance[] {
        return this.actions.filter(action => {
            if ( typeof action.validator === 'function' ) {
                return action.validator(entry);
            } else {
                return entry.type === action.validator;
            }
        }).map(action => ({
            description: typeof action.description === 'function' ? action.description(entry) : action.description,
            performAction: action.performAction
        }));
    }

    getActionDescription(action: Action, entry: ClipboardEntry): string {
        return typeof action.description === 'function' ? action.description(entry) : action.description;
    }

}
