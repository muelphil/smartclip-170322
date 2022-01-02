import {exec} from "child_process";
import {Ref, toRef, watch} from "vue";
import {Dirent, promises as fs, existsSync} from "fs";
import {extname, join, basename, dirname, parse} from "path";
import {remote} from "electron";
import {recursivelyForFiles} from "@/utils/recursivelyForFiles";
import {compareBy} from "@/utils/compareBy";
import child_process from "child_process";

/* TODO
* Recent Locations C:\Users\Familie Müller\AppData\Roaming\Microsoft\Windows\Recent\AutomaticDestinations
* */

const app = require('electron').remote.app;

// const fileIcon = require("extract-file-icon");

// export type Application = { DisplayName, InstallLocation, DisplayVersion, DisplayIcon, Publisher, IconPath? };
export type Application = { name, path, icon, lastAccessed?, exeName };
export type FileIndexEntry = { type, dir, base, ext, name, fullPath };

// chcp 65001 sets output of cmd to utf8, default is 1252
const command = `chcp 65001 > nul && powershell $notfirst=0;Write-Host "[" -NoNewLine; foreach ($UKey in 'HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*','HKLM:\\SOFTWARE\\Wow6432node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*','HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*','HKCU:\\SOFTWARE\\Wow6432node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*'){foreach ($Product in (Get-ItemProperty $UKey -ErrorAction SilentlyContinue)){if($Product.DisplayName -and $Product.SystemComponent -ne 1){if($notfirst){Write-Host \\",\\" -NoNewLine};$notfirst=1;ConvertTo-Json -Compress  -InputObject (Select-Object -InputObject $Product -Property DisplayName, InstallLocation, DisplayVersion, DisplayIcon, Publisher)}}};Write-Host "]" -NoNewLine`;

export default class StartService {

    settings: any = null;
    applications = [];
    missingApplications: Application[] = [];
    index: FileIndexEntry[] = [];
    dirsToIndex: Ref<string[]> = null;
    cachePath: string = null;
    iconPath: string = null;
    timesUsed = {}

    /*
    * TODO on settings window close rebuild index if changed!
    * */

    constructor(settings, getPluginCachePath) {
        this.cachePath = getPluginCachePath('start', ['exeIcons']);
        this.iconPath = join(this.cachePath, 'exeIcons');
        // console.log('[StartService]', fileIcon);
        this.timesUsed = JSON.parse(localStorage.getItem('start.timesUsed')) || {}
        this.initializeAppsAndActions();
        this.settings = settings;
        this.dirsToIndex = toRef(settings, 'dirsToIndex');
        watch(this.dirsToIndex, () => {
            console.log('settings.dirsToIndex have changed!');
        })
        this.rebuildIndex();
    }

    initializeAppsAndActions() {
        this.buildStartMenuApps().then(apps => {
            console.log('apps length=', apps.length);
            const appsSorted = apps
                // TODO write custom sort function - this one makes 250 comparisons - way too many
                .sort((a, b) => (this.timesUsed[b.exeName] || 0) - (this.timesUsed[a.exeName] || 0));
            console.log('appsSorted=', appsSorted);
            this.applications = appsSorted;
        })
        // TODO actions
    }

    openApp(app: Application) {
        child_process.execFile(app.path);
        window.hide();
        this.timesUsed[app.exeName] = (this.timesUsed[app.exeName] || 0) + 1;
        localStorage.setItem('start.timesUsed', JSON.stringify(this.timesUsed));
        const index = this.applications.indexOf(app);
        this.applications.splice(index, 1);
        this.applications.unshift(app);
    }

    rebuildIndex() {
        this.index = [];
        this.buildIndex();
    }

    buildIndex() {
        this.settings.dirsToIndex.forEach(path => this.addDirectoryToIndex(path, this.index, 10, this.settings.ignore));
    }

    async addDirectoryToIndex(pathToDir, index: FileIndexEntry[], maxDepth = 10, ignore: string[] = []) {
        if (maxDepth == 0) return;

        index.push({
            ...parse(pathToDir),
            type: 'dir',
            fullPath: pathToDir
        })

        // index[pathToDir] = {type: 'dir'}
        let files: Dirent[] = await fs.readdir(pathToDir, {withFileTypes: true});
        for (let file of files) {
            if (file.name in ignore)
                continue;
            const completePath = join(pathToDir, file.name);
            if (file.isDirectory()) {
                await this.addDirectoryToIndex(completePath, index, maxDepth - 1, ignore)
            } else if (file.isFile()) {
                index.push({
                    ...parse(completePath),
                    type: 'dir',
                    fullPath: completePath
                })
            }
        }
    }

    // fix(app: Application) {
    //     app.DisplayIcon = app.DisplayIcon.replace(/"/g, '');
    //     app.InstallLocation = app.InstallLocation.replace(/"/g, '');
    // }
    //
    // async loadInstalledApplications(): Promise<void> {
    //     const allApps = (await this.getInstalledApplications());
    //     this.applications = allApps.filter(app => app.InstallLocation && app.DisplayIcon);
    //     this.missingApplications = allApps.filter(app => !(app.InstallLocation && app.DisplayIcon));
    //     this.applications.forEach(this.fix);
    //     console.log('[StartService] apps=', this.applications)
    //     for (let app of this.applications) {
    //         const path = app.DisplayIcon || app.InstallLocation;
    //         console.log('loadingIconForExe path=', path)
    //         app.IconPath = await this.getIconForExe(path);
    //     }
    // }

    // getInstalledApplications(): Promise<Application[]> {
    //     return new Promise(((resolve, reject) => {
    //         exec(command, {encoding: 'utf8'}, (error, stdout, stderr) => {
    //             if (error !== null) {
    //                 reject(`error=${error} stderr=${stderr}`);
    //                 return;
    //             }
    //             resolve(JSON.parse(stdout));
    //         });
    //     }))
    // }

    async getIconForExe(pathToExe: string, name?: string) {
        pathToExe = pathToExe.replace(/\.(exe|bat|dll|ico),0$/, '.$1');
        if (!name) name = basename(pathToExe).replace(/\.(exe|dll|bat|ico|lnk)/, '');
        const resultPath = join(this.iconPath, name + '.png');
        if (!existsSync(resultPath)) {
            const buffer: Electron.NativeImage = await app.getFileIcon(pathToExe, {size: 'large'});
            if (!buffer.isEmpty()) {
                await fs.writeFile(resultPath, buffer.toPNG());
            } else {
                throw 'icon could not be loaded for path ' + pathToExe;
            }
        }
        return resultPath;
    }

    async getLastAccessedDate(pathToFile: string): Promise<Date> {
        return (await fs.stat(pathToFile)).atime;
    }

    async buildStartMenuApps(): Promise<Application[]> {
        const startMenuPaths = [
            join(remote.process.env.ProgramData, '\\Microsoft\\Windows\\Start Menu\\Programs'), // %ProgramData%\Microsoft\Windows\Start Menu\Programs
            join(remote.process.env.APPDATA, '\\Microsoft\\Windows\\Start Menu\\Programs'), // %AppData%\Microsoft\Windows\Start Menu\Programs
        ]
        const applications: Application[] = [];

        for (let startMenuPath of startMenuPaths) {
            await recursivelyForFiles(startMenuPath, async file => {
                if (file.name.endsWith('.lnk')) {
                    try {
                        const name = file.name.slice(0, -4);
                        if (/((de|un)install|entfernen|remove|hilfe|read.?me|lies.?mich|manual|license)/i.test(name)) {
                            return;
                        }
                        const link = file.path;
                        const path = remote.shell.readShortcutLink(link).target;
                        const exeName = basename(path).slice(0, -4);
                        const icon = await this.getIconForExe(path, name);
                        // const lastAccessed: Date = await this.getLastAccessedDate(link);
                        applications.push({name, exeName, path, icon});// lastAccessed});
                    } catch (e) {
                        return;
                    }
                }
            })
        }
        return applications;
    }

}
