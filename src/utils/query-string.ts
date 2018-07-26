type primitive = string | number | boolean;

export const getQueryStringValue = (key: string): string => {
    return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}

export const clearQueryString = (): void => {
    window.history.replaceState({}, document.title, document.location.pathname);
}

export const getUrlWithParams = (url: string, params: { [key: string]: primitive }) => {
    const paramsString = Object.keys(params).map(key => {
        return `&${key}=${params[key]}`
    }).join('&');

    return `${url}?${paramsString}`;
}