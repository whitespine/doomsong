
// Function will be only called once
export function once(fn) {
    return function (event) {
        if (fn) fn.call(this, event);
        fn = null;
    };
}

// Function will prevent default
export function preventDefault(fn) {
    return function (event) {
        event.preventDefault();
        fn.call(this, event);
    };
}


// Stop events dead in their tracks
export function prevent(evt) {
    evt.preventDefault();
    evt.stopPropagation();
}