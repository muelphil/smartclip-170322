export const clipboardEntrySchema = {
    type: 'object',
    properties: {
        id: {type: 'string'},
        plainText: {type: 'string'},
        alternative: {type: 'string'},
        html: {type: 'string'},
        type: {type: 'string'},
        timesCopied: {type: 'number'},
        timesPasted: {type: 'number'},
        timesSmartPasted: {type: 'number'},
        createdAt: {type: 'date'},
        lastUsed: {type: 'date'},
        // uris: {type: 'array'},
        data: {
            type: 'object',
            properties: {
                src: {type: 'string'},
                uris: {type: 'array'},
                language: {type: 'string'}
            }
        }
    }
};
