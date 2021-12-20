const fs = require('fs').promises;

fs.readFile('./ltxcrib.txt', 'utf-8').then(text => {
    const fullCommands: string[] = Array.from(new Set(text.match(/\\([A-Za-z]+)/g)) as Set<string>)
        .map(e => e.slice(1))
        .filter(e => e.length !== 1)
        .sort();
    // const escapedChars: string[] = Array.from(new Set(text.match(/\\([^a-zA-Z])/g)) as Set<string>).map(e => e.slice(1)).sort();
    fs.writeFile('./commands.txt', buildRegex({fullCommands}), 'utf-8');
});


function buildRegex({fullCommands}): string {
    return '/\\\\(?:(?:' + fullCommands.join('|') + ')([^A-Za-z|$]))/g';
}
