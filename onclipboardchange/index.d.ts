export function startListeningForCopy(listener) : void
export function stopListeningForCopy() : void
export function startListeningForPasteAndEscape(pasteListener, escListener) : void
export function stopListeningForPasteAndEscape() : void
export function disableAnimations(hwnd) : boolean
export function writeBuffers(buffers : {[key:number] : Buffer}) : boolean