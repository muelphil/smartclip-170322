import { resourcesPath } from '@/initialize/paths';

const fs = require('fs');
const {join} = require('path');

const emojis_path = join(resourcesPath, 'emojis.json');
const fileBuffer: Buffer = fs.readFileSync(emojis_path);
const fileContent = fileBuffer.toString('utf16le', 2); // TODO Check for BOM

export type Emoji = {
    name: string,
    aliases: string,
    description: string[],
    shortcodes: string[],
    codepoints: string[],
    seeAlso: string,
    hasGenderVariants: boolean,
    hasVariants: boolean
}

const emojis: { [key: string]: Emoji } = JSON.parse(fileContent);

export { emojis };
