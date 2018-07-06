export const getQueryStringValue = (key: string): string => {
    return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}

export const clearQueryString = (): void => {
    window.history.replaceState({}, document.title, '/');
}