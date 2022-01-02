import {start} from "@/plugins/start/index";
import {highlight} from "fuzzysort";

const fileSeparators = ['\\', '/'];

export function customHighlight(result, hOpen = '<b>', hClose = '</b>') {
    if (result === null) return null
    const target = result.target
    const matchesBest = result.indexes

    let matchesIndex = 0

    let highlightArr = target.split(/[/\\]/);
    let highlightArrLengths = highlightArr.map(s => s.length + 1); // +1 for the file separator

    function getIndexAndAccumulated(index: number) {
        let resIndex = 0;
        let accumulated = highlightArrLengths[0];
        while (index >= accumulated) {
            resIndex++;
            accumulated += highlightArrLengths[resIndex];
        }
        accumulated -= highlightArrLengths[resIndex];
        return [resIndex, accumulated];
    }

    function highlightIt(startingIndex) {
        let opened = false;
        const [arrIndex, accumulated] = getIndexAndAccumulated(startingIndex);
        let highlightResult = '';
        for (let i = accumulated; i < accumulated + highlightArrLengths[arrIndex] - 1; i++) { // -1 wegen file separator
            const char = target[i];
            if (char === ' ' && (!opened || matchesBest[matchesIndex] === i + 1)) {
                highlightResult += char;
                continue;
            }
            if (matchesBest[matchesIndex] === i) {
                ++matchesIndex
                if (!opened) {
                    opened = true
                    highlightResult += hOpen
                }

                if (matchesIndex === matchesBest.length && i + 1 < accumulated + highlightArrLengths[arrIndex] - 1) { // + 1 to check if there is anything remaining
                    const remaining = highlightArr[arrIndex].slice(i + 1 - accumulated);
                    highlightResult += char + hClose + remaining
                    opened = false;
                    break
                }
            } else {
                if (opened) {
                    opened = false
                    highlightResult += hClose
                }
            }
            highlightResult += char
        }
        if (opened)
            highlightResult += hClose
        // falls file sep ein match ist muss dieser noch übersprungen werden - NOTE: fileseps wurden vorher rausgenommen
        // if (matchesBest[matchesIndex] === accumulated + highlightArrLengths[arrIndex] -1 ) {
        //     matchesIndex++;
        // }
        highlightArr[arrIndex] = highlightResult;
    }

    while (matchesIndex < matchesBest.length) {
        highlightIt(matchesBest[matchesIndex]);
    }

    return highlightArr;
}