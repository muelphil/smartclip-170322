export const bulkCopy = {
    name: 'bulkcopy',
    activate: function (onDeactivate: () => void) {

        const clipService = window.services.clipboard;
        const clipboard = window.clipboard;
        const queue = [];

        clipService.pause();

        function copyListener() {
            queue.unshift(clipboard.readText());
            console.log('another el copied, queue=', queue.toString());
        }

        function pasteListener() {
            clipboard.writeText(queue.pop());
            if ( queue.length === 0 ) {
                deactivate();
            }
        }

        const deactivate = () => {
            clipboard.stopListeningForPasteAndEscape();
            clipboard.removeListener('copy', copyListener);
            clipService.resume();
            onDeactivate();
        };

        clipboard.on('copy', copyListener);
        clipboard.startListeningForPasteAndEscape(pasteListener, () => deactivate());

        return {deactivate};
    }
};
