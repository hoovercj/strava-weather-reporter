// tslint:disable-next-line:no-namespace
declare namespace NodeJS {
    // tslint:disable-next-line:interface-name
    export interface ProcessEnv {
        REACT_APP_BACKEND_CODE: string;
        REACT_APP_BACKEND_TEST_CODE: string;
        REACT_APP_BACKEND_URL: string;
        REACT_APP_BACKEND_TEST_URL: string;
        REACT_APP_STRAVA_CLIENT_ID: string;
        REACT_APP_STRAVA_CODE_REDIRECT_URL: string;
        REACT_APP_CONTACT_EMAIL: string;
        REACT_APP_COPYRIGHT_NAME: string;
        REACT_APP_COPYRIGHT_URL: string;
        REACT_APP_APPLICATION_NAME: string;
        REACT_APP_GITHUB_URL: string;
        REACT_APP_GOOGLE_MAPS_API_KEY: string;
        REACT_APP_ACTIVITIES_PER_PAGE: string;
    }
}