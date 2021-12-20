import { basename, join } from 'path';
import { existsSync } from 'fs';

export default async function moveFileTo(fromFilePath: string, toDirectory: string): Promise<string> {
    let baseName = basename(fromFilePath);
    let newPath = join(toDirectory, baseName);
    if ( existsSync(newPath) ) {
        const {name, num, ext} = baseName.match(/(?<name>[^.]+?)(?:\((?<num>\d+)\))?(?<ext>\.[^.]+)$/).groups;
        let counter = num ? +num : 1;
        do {
            baseName = `${name}(${counter})${ext}`;
            newPath = join(toDirectory, baseName);
            counter++;
        } while (existsSync(join(toDirectory, baseName)));
    }
    await fs.rename(fromFilePath, newPath);
    return newPath;
}
