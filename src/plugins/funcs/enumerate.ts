export const enumerate = {
    name: 'enumerate',
    activate: function (onDeactivate: () => void) {

        const clipService = window.services.clipboard;
        const clipboard = window.clipboard;

        // const queue = [];

        let count = 0;

        clipService.pause();

        // function copyListener() {
        //     queue.push(clipboard.readText());
        // }

        function pasteListener() {
            // if ( queue.length === 0 ) {
            //     deactivate();
            //     return;
            // }
            clipboard.writeText('counting' + count);
            count ++;
        }

        // clipboard.on('copy', copyListener);
        // TODO
        // clipboard.on('paste', pasteListener);

        const deactivate = () => {
            // clipboard.removeListener('copy', copyListener);
            clipboard.removeListener('paste', pasteListener);
            clipService.resume();
            onDeactivate();
        };


        return {deactivate};

    }

};
