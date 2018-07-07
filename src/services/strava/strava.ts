import { IStorage } from 'src/services/storage';

type primitive = string | number | boolean;

export interface IStravaConfiguration {
    clientId: number;
    stravaCodeRedirectUri: string;
    backendUri: string;
}

export interface IStrava {
    exchangeCodeForUserInformation(code: string): Promise<IUserInfo>;
    redirectToStravaAuthorizationPage(): void;
    cachedUserInformation(): IUserInfo | undefined;
    clearCachedUserInformation(): void;
}

export interface IStravaAuthenticationResponse {
    access_token: string;
    athlete: IUserInfo;
}

export interface IUserInfo {
    id: number;
    username: string;
    firstname: string;
    lastname: string;
    profile_medium: string;
    profile: string;
    email: string;
}

export class Strava implements IStrava {

    private readonly STRAVA_AUTH_INFO_STORAGE_KEY = 'STRAVA_AUTH_INFO';

    private stravaResponse: IStravaAuthenticationResponse | undefined;

    constructor(private config: IStravaConfiguration, private storage: IStorage) {
    }

    public cachedUserInformation = (): IUserInfo | undefined => {
        if (!this.stravaResponse) {
            const storedStravaAuthInfoString = this.storage.getItem(this.STRAVA_AUTH_INFO_STORAGE_KEY);
            if (storedStravaAuthInfoString) {
                try {
                    this.stravaResponse = JSON.parse(storedStravaAuthInfoString);
                } catch (e) {
                    this.storage.removeItem(this.STRAVA_AUTH_INFO_STORAGE_KEY);
                }
            }
        }

        return this.stravaResponse
            && this.stravaResponse.athlete;
    }

    public clearCachedUserInformation = (): void => {
        this.stravaResponse = undefined;
        this.storage.clear();
    }

    public exchangeCodeForUserInformation = (code: string): Promise<IUserInfo> => {
        const authUrl = `${this.config.backendUri}/auth`;
        const params = {
            code,
        };
        const url = this.getUrlWithParams(authUrl, params);
        // TODO: Do I need a fetch polyfill?
        return fetch(url, { method: 'POST' })
            .then(response => response.json())
            .then((stravaResponse: IStravaAuthenticationResponse) => {
                this.stravaResponse = stravaResponse;
                this.storage.setItem(this.STRAVA_AUTH_INFO_STORAGE_KEY, JSON.stringify(stravaResponse));
                return stravaResponse.athlete;
            });
    }

    public redirectToStravaAuthorizationPage = () => {
        const stravaBaseUrl = 'https://www.strava.com/oauth/authorize';
        const params = {
            client_id: this.config.clientId,
            redirect_uri: this.config.stravaCodeRedirectUri,
            response_type: 'code',
            scope: 'write',
        }

        const url = this.getUrlWithParams(stravaBaseUrl, params);

        (window.location as any) = url;
    }

    private getUrlWithParams = (url: string, params: {[key: string]: primitive }) => {
        const paramsString = Object.keys(params).map(key => {
            return `&${key}=${params[key]}`
        }).join('&');

        return `${url}?${paramsString}`;
    }
}