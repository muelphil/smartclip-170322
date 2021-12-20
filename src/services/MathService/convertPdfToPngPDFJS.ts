// @ts-ignore
import * as pdfJs from 'pdfjs-dist/es5/build/pdf';
// @ts-ignore
import { pdfjsworker } from 'pdfjs-dist/es5/build/pdf.worker.entry';
import { generateFilename } from '@/utils/generateFileName';

const fs = require('fs').promises;
pdfJs.GlobalWorkerOptions.workerSrc = pdfjsworker;
const {join} = require('path');

function pixelsPerEmToScale(pixelsPerEm: number) {
    // scale =  60 -> 1em = 538
    // scale = 100 -> 1em = 896
    // => scale 1 -> 1em = 8.967 px
    return pixelsPerEm / 8.967;
}

export async function convertPdfToPngData(pdfPath: string, pixelsPerEm: number = 100): Promise<string> {
    const doc = await pdfJs.getDocument({
        url: pdfPath,
        fontExtraProperties: false,
        disableFontFace: true
    }).promise;
    const page = await doc.getPage(1);
    const scale: number = pixelsPerEmToScale(pixelsPerEm);
    const viewport = page.getViewport({scale: scale});
    let canvas = document.createElement('canvas');

    // Prepare canvas using PDF page dimensions
    let context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    let renderContext = {
        canvasContext: context,
        background: 'rgba(0,0,0,0)',
        viewport: viewport, transparency: true
    };
    await page.render(renderContext).promise;
    const png = canvas.toDataURL('image/png');
    return png;
}


export async function convertPdfToPngPDFJS(pdfPath: string, pngPath: string, pixelsPerEm: number = 100): Promise<string> {
    if ( !pngPath ) {
        pdfPath = join(this.tempPath, generateFilename() + '.png');
    }
    if ( !pngPath.endsWith('.png') )
        throw(`Specified path (\'${pngPath}\') does not end with .png`);

    const png = await convertPdfToPngData(pdfPath, pixelsPerEm);
    const data = png.slice(22); // "data:image/png;base64,".length === 22
    await fs.writeFile(pngPath, data, 'base64');
    return pngPath;
}
