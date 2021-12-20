const onclipboardchange = require('.');
let result = onclipboardchange.writeBuffers({
	'CF_HDROP': Buffer.from('Hello', 'utf-8'),
	'FileNameW': Buffer.from('World', 'utf-8')
});

// onclipboardchange.writeBuffers({
// 	"CF_HDROP": Buffer.from('Hello2', 'utf-8'),
// 	'FileNameW': Buffer.from('World2', 'utf-8')
// });
console.log('result=', result);