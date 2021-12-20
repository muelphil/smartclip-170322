// import 'mathjax'; INFO dont import this alongside mathjax/es5/tex-svg.js etc, this will cause a circular dependency
import { AMTparseAMtoTeX } from './ASCIIMathTexImg';
import { generateFilename } from '@/utils/generateFileName';
import { serviceCache } from '@/initialize/paths';
import { generateMathPng, MathPngOptions } from '@/services/MathService/mathToPng';

const {promises: fs, rmdirSync, mkdirSync} = require('fs');
const {join} = require('path');

export default class MathService {

    get MathJax() {
        return (global as any).MathJax;
    }

    // Mathml2latex = require('mathml-to-latex'); // TODO

    tempPath = join(serviceCache, 'mathtopng');

    constructor() {
        // console.log('[Plugin] Math Service loaded');
        // this.initialize();
    }


    initialize() {
        // ensures that all temporary files are deleted
        try {
            rmdirSync(this.tempPath, {recursive: true});
            mkdirSync(this.tempPath);
        } catch (err) {
            global.logger.error({
                originator: 'MathService::initialize',
                description: 'Could not reset the cached files for service mathtopng.',
                additionalInformation: 'This might happen if the directory with the cached files is opened in another window.Will retry on next startup.',
                stacktrace: err
            });
        }
    }


    // =============================================================================================================
    //                                                  MathJax
    // =============================================================================================================

    /**
     * Renders the given math as an svg element
     * @param {string} math - math to render as svg
     * @param {'tex' | 'ascii'} method - the type of the provided math
     * @param {boolean} displayStyle - whether to render in displaystyle
     * @returns {SVGElement} the rendered svg element
     */
    async renderMathJaxToSvg(math: string, method: 'tex' | 'ascii', displayStyle = true): Promise<SVGElement> {
        // const functionName = method === 'tex' ? 'tex2svg' : 'asciimath2svg';
        // console.log('method=', method, 'functionName=', functionName);
        const tex = method === 'tex' ? math : this.asciiToLatex(math);
        const svgNode: SVGElement = this.MathJax.tex2svg(tex, {display: displayStyle}).childNodes[0];
        this.extractError(svgNode);
        svgNode.removeAttribute('style');
        svgNode.removeAttribute('width');
        // const heightInEm = svgNode.getAttribute('height').slice(0, -2);
        const emBlockHeightInEx = 2.0339999198913574; // measured by computing the ex-height of the string 'gh'
        const heightInEx = (svgNode as any).height.baseVal.valueInSpecifiedUnits;
        svgNode.setAttribute('height', (+heightInEx / emBlockHeightInEx) + 'em');
        this.MathJax.startup.document.updateDocument();
        return svgNode;
    }

    /**
     * Saves a provided svg (as is) in a svg file
     * @param {SVGElement} svgNode - The svg node which is to be saved.
     * @param {string} [path] - The path where the svg file should be stored.
     * @return {string} - The path under which the svg is stored.
     * @example
     * saveSvgToFile(svgNode, 'C:\\Users\\JohnDoe\\filename.svg');
     */
    async saveSvgToFile(svgNode: SVGElement, path?: string): Promise<string> {
        if ( !path ) {
            path = join(this.tempPath, generateFilename() + '.svg');
        }
        const serializedSvg = new XMLSerializer().serializeToString(svgNode);
        fs.writeFile(path, serializedSvg, 'utf-8');
        return path;
    }

    /**
     * Clones and fixes a provided MathJax svg, then saving it in a svg file
     * @param {SVGElement} svg - The MathJax svg.
     * @param {string} [color] - The fill color the saved svg should have.
     * @param {string} [path] - The path where the svg file should be stored.
     * @returns - The path under which the svg is stored.
     * @example
     * saveMathJaxSvgToFile(svgNode)
     * @example
     * saveMathJaxSvgToFile(svgNode, '#FFFFFF', 'C:\\Users\\JohnDoe\\filename.svg')
     */
    async saveMathJaxSvgToFile(svg: SVGElement, color?: string, path?: string): Promise<string> {
        svg = this.cloneAndResolveUseTags(svg);
        this.fixMathJaxSvgHeight(svg);
        if ( color )
            this.setColorOfSvg(svg, color);
        return await this.saveSvgToFile(svg, path);
    }

    /**
     * Extracts error messages out of MathJax svg nodes.
     * This is used because MathJax will not throw an error, but instead renders it and returns and svg anyway.
     * @param svgNode - The svg node that potentially contains an error.
     * @throws the error embedded in the provided svg, if any is present.
     */
    extractError(svgNode: { querySelector: (string) => HTMLElement | null, textContent: string }) {
        const errorEl = svgNode.querySelector('g[data-mml-node="merror"]');
        if ( errorEl )
            throw errorEl.textContent;
    }

    /**
     * Saves a given svg-Element as png-Image to the given location
     * Code partially taken from http://bl.ocks.org/biovisualize/8187844.
     * @param {SVGElement} svgNode - the svg node from which to produce the image.
     * The method will slightly alter the appearance.
     * @param {PathLike} path - the path at which to store the image.
     * Needs to end with '.png' (case-sensitive)
     * @param {number} heightInPixels - the height of the resulting png per em in pixels.
     * The width will be deduced automatically.
     * @return {Promise<string>} path under which the image is saved
     */
    private async saveSvgToPng(svgNode: SVGElement, path: string, heightInPixels: number = 500): Promise<string> {
        return new Promise(((resolve, reject) => {
            if ( !path.endsWith('.png') )
                reject('Specified path does not end with .png');

            const {width: bbWidth, height: bbHeight} = this.getBBoxHidden(svgNode);
            const widthToHeightRatio = bbWidth / (bbHeight);
            const svgString = new XMLSerializer().serializeToString(svgNode);

            const canvas = document.createElement('canvas');
            canvas.height = heightInPixels;
            canvas.width = heightInPixels * widthToHeightRatio;
            const ctx = canvas.getContext('2d');
            const img = new Image();
            const svg = new Blob([svgString], {type: 'image/svg+xml;charset=utf-8'});
            const url = window.URL.createObjectURL(svg);
            img.onload = function () {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                const png = canvas.toDataURL('image/png');
                const data = png.slice(22); // "data:image/png;base64,".length === 22
                fs.writeFile(path, data, 'base64').then(() => {
                    window.URL.revokeObjectURL(png);
                });
                resolve(path);
            };
            img.src = url; // this triggers img.onload
        }));
    }


    /**
     * Saves the provided MathJax svg as a png file.
     * This internally uses @see{saveSvgToPng}.
     * @param svg
     * @param options - The options.
     * @param [options.path] - The path under which the png should be saved.
     * @param [options.pixelsPerEm=100] - The height of the resulting png per em in pixels.
     * The width will be deduced automatically.
     * @param [options.color] - The fill color the saved png should have.
     * @returns the path to the saved png
     */
    async saveMathjaxSvgToPng(svg: SVGElement, options: { path?, pixelsPerEm?, color? } = {pixelsPerEm: 100}): Promise<string> {
        if ( options.color && !/#[0-9a-fA-F]{6}/.test(options.color) )
            throw 'invalid color option! please supply color so that it matches /#[0-9a-fA-F]{6}/!';
        const opts = {pixelsPerEm: 100, ...options};
        if ( !opts.path ) {
            opts.path = join(this.tempPath, generateFilename() + '.png');
        }
        svg = this.cloneAndResolveUseTags(svg);
        this.fixMathJaxSvgHeight(svg);
        const heightInPixels = this.calculatePixelHeight(svg, opts.pixelsPerEm);
        if ( opts.color ) { // otherwise black will be the default color
            this.setColorOfSvg(svg, opts.color);
        }
        svg.removeAttribute('height');
        svg.removeAttribute('width');
        return this.saveSvgToPng(svg, opts.path, heightInPixels);
    }

    /**
     * Calculates the pixel height for a given svg node and pixels per em
     * @param {SVGElement} svg - The svg node for which the height is to be calculated
     * @param {number} pixelsPerEm - The height in pixels per em the resulting png should have
     * @returns - The height in pixels the svg should have when rendering it to png to satisfy the given pixelsPerEm height
     */
    calculatePixelHeight(svg: SVGElement, pixelsPerEm: number) {
        if ( !svg.hasAttribute('height') ) {
            console.info('height attribute on svg was not found (usually set by mathjax) - fallback: assuming svg has 1em height!');
            return pixelsPerEm; // fallback: assumes that given svg has 1em height
        }
        const heightInEm = ((svg as any).height as SVGAnimatedLength).baseVal.valueInSpecifiedUnits;
        return heightInEm * pixelsPerEm;
    }

    /**
     * Clones a given svg and resolves the <use> tags used by the svg by copying the referenced path from the svg definition object to the svg
     * @param {SVGElement} svg - The svg node that is to be cloned.
     * @returns {SVGElement} - The cloned svg, with resolved <use> tags.
     */
    cloneAndResolveUseTags(svg: SVGElement) {
        let normalizedSvg: SVGElement = svg.cloneNode(true) as SVGElement;
        const useTags = Array.from(normalizedSvg.querySelectorAll('use'));
        const defs = document.querySelector('defs');
        useTags.forEach(tag => {
            const id = tag.getAttribute('xlink:href');
            const def = defs.querySelector(id);
            const clonedDef = def.cloneNode(true) as SVGPathElement;
            clonedDef.removeAttribute('id');
            const transformAttribute = tag.getAttribute('transform');
            if ( transformAttribute ) {
                clonedDef.setAttribute('transform', transformAttribute);
            }
            tag.replaceWith(clonedDef);
        });
        return normalizedSvg;
    }

    /**
     * "Fixes" the provided svg height by changing the width and viewBox attributes, such that there is no unnecessary
     * padding and the svg does not overflow the viewBox. This will mutate the provided svg.
     * @param {SVGElement} svg - The svg node for which the height is to be fixed; is mutated.
     */
    fixMathJaxSvgHeight(svg: SVGElement) {
        const {x, y, width: bbWidth, height: bbHeight} = this.getBBoxHidden(svg);
        const newViewBox = [x, y, bbWidth, bbHeight].map(e => e.toFixed(3)).join(' '); // +20 / *1.05 because width will get cropped otherwise - "test" will get cropped vertically, "hyena" horizontally
        svg.removeAttribute('width');
        svg.removeAttribute('style');
        svg.setAttribute('viewBox', newViewBox);
    }

    /**
     * Sets the fill color of `svgNode` to the `color`. This does mutate the svgNode.
     * @param {SVGElement} svgNode - The svg node for which the color should be changed; is mutated.
     * @param {string} color - The color the fill of the svg should have
     */
    setColorOfSvg(svgNode: SVGElement, color: string) {
        const svgGroup = svgNode.querySelector('g[fill]');
        svgGroup.setAttribute('fill', color);
    }

    /**
     * Acquires the bounding box information of a svg element, even if it is not contained in the document
     * @param {SVGElement} svgNode - The svg for which the bbox is the be determined.
     * @returns {SVGRect} - The bbox.
     */
    getBBoxHidden(svgNode) {
        let tempDiv = document.createElement('div');
        tempDiv.setAttribute('style', 'position:absolute; visibility:hidden; width:0; height:0');
        if ( document.contains(svgNode) )
            return svgNode.getBBox();
        tempDiv.appendChild(svgNode);
        document.body.appendChild(tempDiv);
        let bbox = svgNode.getBBox();
        document.body.removeChild(tempDiv);
        return bbox;
    }

    // =============================================================================================================
    //                                                  Latex Png
    // =============================================================================================================

    async texToPngLatex(math, options: Partial<MathPngOptions> = {}): Promise<string> {
        const filename = generateFilename();
        if ( !options.directory ) {
            options.directory = this.tempPath;
        }
        if ( !options.filename ) {
            options.filename = filename;
        }
        return generateMathPng(math, options as MathPngOptions);
    };


    // =============================================================================================================
    //                                                  Ascii
    // =============================================================================================================

    // ascii to latex
    asciiToLatex(math: string, simplify: boolean = false) {
        // fixme: abcde{f}{g}hijklmnopqrstuvwxyz
        return AMTparseAMtoTeX(math, simplify);
    }

    // async asciiToLatex(asciiMath:string){
    //     const mml = this.MathJax.asciimath2mml(asciiMath);
    //     return this.Mathml2latex.convert(mml);
    // }

    // =============================================================================================================
    //                                                  Unicode
    // =============================================================================================================

    // // Unicode
    // texToUnicode(texMath: string): string {
    //     return replace(texMath);
    // }

}

