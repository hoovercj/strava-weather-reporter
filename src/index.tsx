declare module 'prop-types';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

// tslint:disable-next-line
const axe = require('react-axe');

import App from 'src/App';
import { IAppInfo } from 'src/models/copyright-info';
import { Storage } from 'src/services/storage';
import {
    IStravaConfiguration,
    Strava
} from 'src/services/strava/strava';
// import registerServiceWorker from 'src/registerServiceWorker';

import './index.css';

const env = process.env;

const storage = new Storage();
const stravaConfig: IStravaConfiguration = {
    backendCode: env.REACT_APP_BACKEND_CODE || '',
    backendUrl: env.REACT_APP_BACKEND_URL || '',
    clientId: Number(env.REACT_APP_STRAVA_CLIENT_ID || ''),
    stravaCodeRedirectUri: env.REACT_APP_STRAVA_CODE_REDIRECT_URL || '',
}

// Override config if in test mode
const testMode = location.search && location.search.toLowerCase().indexOf('test') >= 0;
if (testMode) {
    // tslint:disable-next-line
    debugger
    if (env.REACT_APP_BACKEND_CODE_TEST) {
        stravaConfig.backendCode = env.REACT_APP_BACKEND_CODE_TEST;
    }

    if (env.REACT_APP_BACKEND_URL_TEST) {
        stravaConfig.backendUrl = env.REACT_APP_BACKEND_URL_TEST;
    }
}

const strava = new Strava(stravaConfig, storage);

const activitiesPerPage = env.REACT_APP_ACTIVITIES_PER_PAGE;
const applicationInfo: IAppInfo = {
    applicationName: env.REACT_APP_APPLICATION_NAME || '',
    contactEmail: env.REACT_APP_CONTACT_EMAIL || '',
    copyrightName: env.REACT_APP_COPYRIGHT_NAME || '',
    copyrightUrl: env.REACT_APP_COPYRIGHT_URL || '',
    githubUrl: env.REACT_APP_GITHUB_URL || '',
}

// TODO: Enable after fixing all the issues to avoid
// polluting logs while working on other features
if (false && env.NODE_ENV !== 'production') {
    axe(React, ReactDOM);
}

// TODO: Convert promises to async/await
// TODO: Create a logger which is enabled in dev and disabled in prod
// env.NODE_ENV === 'development'
ReactDOM.render(
    <App
        strava={strava}
        applicationInfo={applicationInfo}
        activitiesPerPage={Number(activitiesPerPage)}
    />,
    document.getElementById('root') as HTMLElement
);
// registerServiceWorker();
