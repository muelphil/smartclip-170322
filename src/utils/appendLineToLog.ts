const fs = require('fs').promises;
const logPath = 'C:\\Users\\Philip\\Desktop\\log.txt'; // TODO cannot be in log path because it then isnt accessible from background.ts

export async function appendLineToLog(message: string) {
    await fs.appendFile(logPath, message + '\n', 'utf-8');
}
