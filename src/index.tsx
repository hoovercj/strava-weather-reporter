declare module 'prop-types';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from 'src/App';
import { ICopyrightInfo } from 'src/models/copyright-info';
import registerServiceWorker from 'src/registerServiceWorker';
import { Storage } from 'src/services/storage';
import { Strava } from 'src/services/strava/strava';

import './index.css';

const storage = new Storage();
const stravaConfig = {
    backendUri: 'http://localhost:7071/api',
    clientId: 25119,
    stravaCodeRedirectUri: 'http://localhost:3000/',
}
const strava = new Strava(stravaConfig, storage);

const copyrightInfo: ICopyrightInfo = {
    name: 'Cody Hoover',
    url: 'https://www.codyhoover.com',
}

ReactDOM.render(
    <App
        strava={strava}
        name={'Weatherman for Strava'}
        copyrightInfo={copyrightInfo}
    />,
    document.getElementById('root') as HTMLElement
);
registerServiceWorker();
