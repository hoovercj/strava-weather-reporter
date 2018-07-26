declare module 'prop-types';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from 'src/App';
import { IAppInfo } from 'src/models/copyright-info';
import { Storage } from 'src/services/storage';
import {
    IStravaConfiguration,
    Strava
} from 'src/services/strava/strava';
// import registerServiceWorker from 'src/registerServiceWorker';

import './index.css';

const storage = new Storage();
const stravaConfig: IStravaConfiguration = {
    backendCode: process.env.REACT_APP_BACKEND_URL || '',
    backendUrl: process.env.REACT_APP_BACKEND_CODE || '',
    clientId: Number(process.env.REACT_APP_STRAVA_CLIENT_ID || ''),
    stravaCodeRedirectUri: process.env.REACT_APP_STRAVA_CODE_REDIRECT_URL || '',
}
const strava = new Strava(stravaConfig, storage);

const activitiesPerPage = process.env.REACT_APP_ACTIVITIES_PER_PAGE;
const applicationInfo: IAppInfo = {
    applicationName: process.env.REACT_APP_APPLICATION_NAME || '',
    contactEmail: process.env.REACT_APP_CONTACT_EMAIL || '',
    copyrightName: process.env.REACT_APP_COPYRIGHT_NAME || '',
    copyrightUrl: process.env.REACT_APP_COPYRIGHT_URL || '',
    githubUrl: process.env.REACT_APP_GITHUB_URL || '',
}

// TODO: Convert promises to async/await
// TODO: Create a logger which is enabled in dev and disabled in prod
// process.env.NODE_ENV === 'development'
ReactDOM.render(
    <App
        strava={strava}
        applicationInfo={applicationInfo}
        activitiesPerPage={Number(activitiesPerPage)}
    />,
    document.getElementById('root') as HTMLElement
);
// registerServiceWorker();
