import { ClipService } from '@/services/ClipService';
import { ActionService } from '@/services/ActionService';
import { GlobalService } from '@/services/GlobalService';
import MathService from '@/services/MathService';
import { clipboard } from '@/clipboard-extended/clipboard-extended';

window.clipboard = clipboard;
// todo review if this is okay or whether i should use provide/inject instead
window.services = {
    clipboard: new ClipService(),
    actions: new ActionService(),
    global: GlobalService.constructReactive(),
    math: new MathService()
};
