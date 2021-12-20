// const request = require('got');
const got = require('got');
const ogs = require('open-graph-scraper');
const {URL} = require('url');

function findIcon(str: string, requestUrl: string) {
    let relIconIndex = str.indexOf('rel="icon"')
        || str.indexOf('rel="apple-touch-icon"')
        || str.indexOf('/apple-touch-icon.png"');
    if ( relIconIndex === -1 ) {
        console.warn('couldn\'t find a icon href');
        return null;
    }
    const tagStartIndex = lastIndexOfChar(str, '<', relIconIndex);
    const tagEndIndex = str.indexOf('>', relIconIndex + 10);
    const linkTag = str.substr(tagStartIndex, tagEndIndex + 1).toString();
    const href = linkTag.match(/href="([^"]+)"/)[1];
    return new URL(href, requestUrl).href;
}

function lastIndexOfChar(str: string, character: string, startAt: number) {
    let charCode = character.charCodeAt(0);
    let index: number = startAt;
    while (index >= 0) {
        if ( str.charCodeAt(index) === charCode )
            return index;
        index--;
    }
    return index;
}

export async function loadOGInfo(url): Promise<object> {
    const options = {url};
    const {result, response} = await ogs(options);
    const bodyPeek = response.rawBody.subarray(0, 8192).toString();
    result.iconUrl = findIcon(bodyPeek, url);
    if ( !result.iconUrl ) {
        const origin = new URL(url).origin;
        const {body} = await got(origin);
        result.iconUrl = findIcon(body.substr(0, 8192), origin);
    }
    return result;
}

