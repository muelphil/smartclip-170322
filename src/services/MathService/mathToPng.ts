// https://github.com/SublimeText/LaTeXTools/blob/master/st_preview/preview_math.py
// https://github.com/SublimeText/LaTeXTools/blob/master/st_preview/preview_utils.py

import { convertPdfToPngPDFJS } from '@/services/MathService/convertPdfToPngPDFJS';

const {execSync, exec} = require('child_process');
const fs = require('fs');
const _which = require('which'); // won't work with webpack require
const {basename, join, dirname} = require('path');

const env = require('electron').remote.getGlobal('process').env;

function which(cmd: string) {
    return _which.sync(cmd, {
        nothrow: true,
        path: env.Path
    });
}

let cachedPdfLatexExe = null;

function getPdfLatexExe(useCached: boolean = true): string | null {
    if ( useCached && cachedPdfLatexExe )
        return cachedPdfLatexExe;
    const resolved = which('pdflatex.exe');
    if ( resolved !== null )
        cachedPdfLatexExe = basename(resolved);
    return cachedPdfLatexExe;
}

function getErrorMessageForMissingWhich(name: string) {
    return `${name} could not be found. Please ensure that you have ${name} installed and it\'s added to your Path`;
}

let noErrors = false;

function checkSystem(useCached: boolean = true): string[] {
    if ( useCached && noErrors )
        return [];
    const errorMessages = [];
    if ( getPdfLatexExe(useCached) === null )
        errorMessages.push(getErrorMessageForMissingWhich('PdfLatex'));
    if ( errorMessages.length === 0 )
        noErrors = true;
    return errorMessages;
}

function getTexFileContent(equation: string, options: { color: string, preamblePath?: string, displayStyle?: boolean }) {
    const preambleCommand = options.preamblePath ? `\\IfFileExists{${options.preamblePath}{\\input{${options.preamblePath}}}` : '';
    equation = options.displayStyle ? `$\\displaystyle ${equation}$` : `$${equation}$`;
    return `\\documentclass[preview,border=0.3pt]{standalone}
\\IfFileExists{xcolor.sty}{\\usepackage{xcolor}}{}%
\\usepackage{amsmath}
\\usepackage{amssymb}
\\IfFileExists{latexsym.sty}{\\usepackage{latexsym}}{}
\\IfFileExists{mathtools.sty}{\\usepackage{mathtools}}{}
${preambleCommand}
\\begin{document}
\\nopagecolor
\\IfFileExists{xcolor.sty}{\\color[HTML]{${options.color.slice(1)}}}{}%
${equation}
\\end{document}`;
}

type MandatoryMathPngOptions = {
    filename: string,
    directory: string
}
type OptionalMathPngOptions = {
    preamblePath: string,
    color: string,
    cleanup: boolean,
    pixelsPerEm: number,
    displayStyle: boolean
}
type MathPngOptions = MandatoryMathPngOptions & Partial<OptionalMathPngOptions>;
type MathPngOptionsComplete = MandatoryMathPngOptions & OptionalMathPngOptions;
const defaultOptions: OptionalMathPngOptions = {
    color: '#FFFFFF',
    preamblePath: null,
    cleanup: false,
    pixelsPerEm: 100,
    displayStyle: true
};

function generatePdf(equation: string, filename: string, opts: MathPngOptionsComplete): Promise<void> {
    return new Promise(((resolve, reject) => {
        const texContent = getTexFileContent(equation, opts);
        const texFile = filename + '.tex';
        const texFilePath = join(opts.directory, texFile);
        try {
            fs.writeFileSync(texFilePath, texContent);
        } catch (error) {
            reject('[Math->Png] Could not write the .tex file to ' + texFilePath);
        }
        const pdfLatexCommand = `${getPdfLatexExe()} -interaction=nonstopmode -quiet "${texFile}"`;
        console.debug('[Math->Png] executing pdflatex to generate pdf from tex, cmd=', pdfLatexCommand, ', cwd=', opts.directory);
        exec(pdfLatexCommand, {cwd: opts.directory}, (error, stdout) => {
            if ( error ) {
                // Latex uses stdout for both output and errors
                // output is expected to be in the following format (single line):
                // filename.tex:line_number: error
                //                          ^ first space is here, use this
                let errors = stdout.trim().split('\n');
                const firstSpace = errors[0].indexOf(' ', texFile.length); // skip texFilename, no spaces there
                errors = errors.map(e => e.slice(firstSpace + 1).trim());
                reject(errors);
            } else {
                resolve();
            }
        });
    }));
}

function checkOptions(opts: MathPngOptionsComplete) {
    if ( !/^#[0-9A-Fa-f]{6}$/.test(opts.color) )
        opts.color = '#FFFFFF';
}

async function generateMathPng(equation: string, options: MathPngOptions): Promise<string> {
    if ( equation.length === 0 )
        throw 'Equation cannot be empty';
    const errors = checkSystem();
    if ( errors.length !== 0 )
        throw errors.join('\n');
    const opts: MathPngOptionsComplete = {...defaultOptions, ...options};
    checkOptions(opts);
    const filename = options.filename;
    const pngFile = filename + '.png';
    const pngPath = join(opts.directory, pngFile);
    await generatePdf(equation, filename, opts);
    const pdfFile = filename + '.pdf';
    const pdfPath = join(opts.directory, pdfFile);
    const resultPath = convertPdfToPngPDFJS(pdfPath, pngPath, opts.pixelsPerEm);
    if ( opts.cleanup )
        cleanup(options.directory, filename); // dont await, do the cleanup asynchronously
    return resultPath;
}

async function cleanup(directory: string, filename: string) {
    const file = join(directory, filename);
    fs.rm(file + '.pdf');
    fs.rm(file + '.tex');
    fs.rm(file + '.log');
    fs.rm(file + '.aux');
}

export { checkSystem, generateMathPng, MathPngOptions };
