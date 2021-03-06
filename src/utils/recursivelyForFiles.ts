import {Dirent, promises as fs, readdirSync} from "fs";
import {join} from "path";


export async function recursivelyForFiles(path: string, consumer: (dir: Dirent & { path: string }) => void, ignoreDirByNames = []) {
    let files: any[] = readdirSync(path, {withFileTypes: true});
    for (let file of files) {
        if (file.isDirectory() && !(file.name in ignoreDirByNames)) {
            recursivelyForFiles(join(path, file.name), consumer);
        } else {
            file.path = join(path, file.name);
            consumer(file);
        }
    }
}