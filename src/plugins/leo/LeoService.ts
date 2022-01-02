import {ref} from 'vue';

declare type ColumnResult = { title, tds, results, moreAvailable, loadMore };

async function getTranslations(query: string): Promise<ColumnResult[]> {
    return new Promise((resolve, reject) => {
        if (!query) {
            reject({code: 'emptyquery', message: 'queries that are empty will not be executed'});
            return;
        }
        const url = 'https://dict.leo.org/englisch-deutsch/' + query;
        global.requestPageSource(url).then(({html, status}) => {
            const document: Document = global.htmlToDocument(html);
            if (status === 200) { // HTTPStatus.OK
                resolve(documentToTranslations(document));
            } else if (status === 404) { // HTTPStatus.NOT_FOUND
                const didYouMean = Array.from(document.querySelectorAll('.tf1.tbl-f td a'))
                    .map(e => e.textContent);
                reject({code: 'notfound', additionalInformation: {didYouMean}});
            } else {
                reject({
                    code: 'unknown',
                    message: 'something went wrong, most likely during fetching the page, status=' + status
                });
            }
        }).catch(err => reject({
            code: 'noconnection',
            message: 'could not load leo for query ' + query
        }))
    });
}

function partitionTds(collection) {
    return collection.reduce((result, value, key) => {
        const lang = key % 2 == 0 ? 'en' : 'de';
        result[lang].push(value);
        return result;
    }, {de: [], en: []});
}

function validSection(innerText: string): boolean {
    return /Adje[ck]tive|Substantive|Nouns|Verb(s|en)/.test(innerText);
}

function documentToTranslations(doc: Document, allSections = false): ColumnResult[] {
    let sections = Array.from(doc.querySelectorAll('.tblf1.tblf-alternate'));
    if (!allSections) {
        sections = sections.filter(table => {
            const title = (table.querySelector('thead h2') as HTMLElement).innerText;
            return validSection(title);
        });
    }

    return sections.map(table => {
        const title = (table.querySelector('thead h2') as HTMLElement).innerText;
        const tds = partitionTds(Array.from(table.querySelectorAll('td[lang] samp')));
        tds.toLang = [];
        for (let index in tds.en) {
            const enMarkedCount = tds.en[index].querySelectorAll('mark').length;
            // this assumes that the query was english if atleast 1 marked element is on the english side
            // therefore the toLang[uage] to translate to is set to de
            // might be problematic for words that are the same in en and de like 'test'
            // todo introduce other languages
            tds.toLang.push(enMarkedCount > 0 ? 'de' : 'en');
        }

        const results = ref([]);
        const moreAvailable = ref(true);
        const loading = ref(false);
        let loadedIndex = 0;

        function loadMore(amount: number = 5) {
            loading.value = true;
            const newLoadedIndex = Math.min(loadedIndex + amount, tds.en.length);
            for (let index = loadedIndex; index < newLoadedIndex; index++) {
                const languageToTranslateTo = tds.toLang[index];
                const translationTd = tds[languageToTranslateTo][index];
                results.value.push(buildHtmlFromExtractedData(translationTd));
            }
            loadedIndex = newLoadedIndex;
            moreAvailable.value = newLoadedIndex !== tds.en.length;
            loading.value = false;
        }

        loadMore();
        return {title, tds, results, moreAvailable, loadMore, loading};
    });
}

function buildHtmlFromExtractedData(extractedData: HTMLElement) {
    const htmlBuffer = [];
    const highlightedBuffer = [];
    let startFound = false;
    let endFound = false;
    let endIndex = 0;

    function recursiveBuild(node: Node, ignoreForHighlighted = false) {
        if (isText(node)) {
            const textContent = node.textContent;
            if (!startFound && !ignoreForHighlighted) {
                startFound = checkStart(textContent); // check if this element is the start of what to highlight
                if (startFound)
                    htmlBuffer.push('<span class="highlighted">');
            }
            htmlBuffer.push(node.textContent); // <span> must be pushed first if its the first to get highlighted
            if (startFound && !endFound) {
                endFound = checkEnd(textContent); // check if this element is the end of what to highlight
            }
            if (startFound && !endFound && !ignoreForHighlighted) {
                highlightedBuffer.push(textContent);
                if (!/^\s*$/.test(textContent)) // if its only whitespace don't move the index pointing at the end
                    endIndex = htmlBuffer.length; // no -1, cause the end tag is inserted AFTER this one
            }
        } else {
            const nodeName = node.nodeName;
            const specialElements = ['I', 'SMALL', 'SUP'].indexOf(nodeName) !== -1; // means its <i>, <small> or <sup>
            if (specialElements) {
                const firstChild = node.childNodes[0];
                if (isText(firstChild) && checkEnd(firstChild.textContent))
                    endFound = true;
                htmlBuffer.push(`<${nodeName}>`);
                for (let child of node.childNodes) {
                    recursiveBuild(child, true);
                }
                htmlBuffer.push(`</${nodeName}>`);
            } else {
                for (let child of node.childNodes) {
                    recursiveBuild(child, ignoreForHighlighted);
                }
            }
        }
    }

    function isText(node: Node) {
        return node.nodeType === 3;
    }

    recursiveBuild(extractedData);
    htmlBuffer.splice(endIndex, 0, '</span>');

    return {
        html: htmlBuffer.join(''),
        translation: highlightedBuffer.join('').trim()
    };
}

function checkEnd(str: string): boolean {
    const endPrefixFound = /(Pl\.|auch:|\|\xa0\xa0)|Adj\.|Adv\.|\[/.test(str);
    const endDelimiter = /^\s*[-]\s*$/.test(str);
    return endPrefixFound || endDelimiter;
}

function checkStart(str: string): boolean {
    // TODO optimize by inlining
    const isNotStart = /sth\.|etw\.|jmd[nm]\.|so\.|^\s*(sich|über|mit)\s*$/.test(str);
    const isUnallowedWord = /^\b(auf)\b$/.test(str);
    const isNotStartPrefix = /^(to|d(er|ie|as)|[^a-zA-Z0-9])$/.test(str);
    const onlySymbols = /^[^A-Za-zÀ-ž\u0370-\u03FF\u0400-\u04FF]+$/.test(str);
    return !isNotStart && !isNotStartPrefix && !onlySymbols && !isUnallowedWord;
}


export {getTranslations};
