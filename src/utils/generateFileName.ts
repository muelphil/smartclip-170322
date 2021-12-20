// https://gist.github.com/gordonbrander/2230317
function generateId() {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return Math.random().toString(36).substr(2, 9);
}

function generateFilename() {
    const dt = getDateTime();
    return `${dt.year}-${dt.month}-${dt.day}_${dt.hour}-${dt.minutes}_${generateId()}`;
}

function getDateFormatted() {
    const now: Date = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getDateTime() {
    const now: Date = new Date();
    return {
        year: now.getFullYear(),
        month: (now.getMonth() + 1).toString().padStart(2, '0'),
        day: now.getDate().toString().padStart(2, '0'),
        hour: now.getHours().toString().padStart(2, '0'),
        minutes: now.getMinutes().toString().padStart(2, '0')
    };
}

function getDateTimeFormatted(){
    const dt = getDateTime();
    return `${dt.year}-${dt.month}-${dt.day} ${dt.hour}:${dt.minutes}`;
}

export {
    generateFilename,
    getDateFormatted,
    getDateTime,
    getDateTimeFormatted
};
