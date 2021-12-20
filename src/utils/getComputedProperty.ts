export default function getComputedProperty(tagName, className, consumer: (styles: CSSStyleDeclaration) => void) {
    // if ( ['position', 'width', 'height', 'visibility'].includes(property) ) {
    //     throw 'properties \'position\', \'width\', \'height\', \'visibility\' are not allowed!';
    // }
    let tempEl = document.createElement(tagName);
    tempEl.className = className;
    tempEl.setAttribute('style', 'position:absolute; visibility:hidden; width:0; height:0');
    document.body.appendChild(tempEl);
    // info: if the provided property value does not exists getPropertyValue will return "" - no error handling needed;
    consumer(getComputedStyle(tempEl));
    document.body.removeChild(tempEl);
}
