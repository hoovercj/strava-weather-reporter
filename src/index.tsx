declare module 'prop-types';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from 'src/App';
import { ICopyrightInfo } from 'src/models/copyright-info';
import registerServiceWorker from 'src/registerServiceWorker';
import { Storage } from 'src/services/storage';
import {
    IStravaConfiguration,
    Strava
} from 'src/services/strava/strava';

import './index.css';

const storage = new Storage();
const stravaConfig: IStravaConfiguration = {
    backendCode: process.env.REACT_APP_BACKEND_URL || '',
    backendUrl: process.env.REACT_APP_BACKEND_CODE || '',
    clientId: Number(process.env.REACT_APP_STRAVA_CLIENT_ID || ''),
    stravaCodeRedirectUri: process.env.REACT_APP_STRAVA_CODE_REDIRECT_URL || '',
}
const strava = new Strava(stravaConfig, storage);

const copyrightInfo: ICopyrightInfo = {
    name: process.env.REACT_APP_COPYRIGHT_NAME || '',
    url: process.env.REACT_APP_COPYRIGHT_URL || '',
}

// TODO: Convert promises to async/await
// TODO: Create a logger which is enabled in dev and disabled in prod
// process.env.NODE_ENV === 'development'
ReactDOM.render(
    <App
        strava={strava}
        name={process.env.REACT_APP_APPLICATION_NAME || ''}
        copyrightInfo={copyrightInfo}
    />,
    document.getElementById('root') as HTMLElement
);
registerServiceWorker();
