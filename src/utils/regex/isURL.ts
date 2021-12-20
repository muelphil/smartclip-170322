const urlRegex = /^(https?:\/\/)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,4}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)$/;
const httpUrlRegex = /^(https?:\/\/)[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,4}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)$/;

export default function isURL(url: string, httpPrefix: boolean = true): boolean {
    if ( httpPrefix )
        return httpUrlRegex.test(url);
    return urlRegex.test(url);
}
