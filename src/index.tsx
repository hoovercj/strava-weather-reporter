declare module 'prop-types';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { Storage } from './services/storage';
import { Strava } from './services/strava/strava';

const storage = new Storage();
const stravaConfig = {
    backendUri: 'http://localhost:7071/api',
    clientId: 25119,
    stravaCodeRedirectUri: 'http://localhost:3000/',
}
const strava = new Strava(stravaConfig, storage);

ReactDOM.render(
    <App
        strava={strava}
    />,
    document.getElementById('root') as HTMLElement
);
registerServiceWorker();
