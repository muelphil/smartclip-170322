export default function isCode(plainText: string, html: string): boolean { // TODO put this into utils
    return html
        // todo docparse this instead?
        // TODO this only works for intellij [and now chrome} right now - Eclipse, Notepad++, Sublime, ... => test them!
        && /<\/(?:pre|code|span)>(?:\s|<!--[^>-]*-->)*<\/body>\s?<\/html>$/.test(html)
        && /<body>(?:\s|<!--[^>-]*-->)*<(?:pre|code|span[^>]*[mM]ono[^>]*>)/.test(html);
}
