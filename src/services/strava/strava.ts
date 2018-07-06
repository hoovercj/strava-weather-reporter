type primitive = string | number | boolean;

export interface IStravaConfiguration {
    clientId: number;
    stravaCodeRedirectUri: string;
    backendUri: string;
}

export interface IStrava {
    exchangeCodeForUserInformation(code: string): Promise<IUserInfo>;
    redirectToStravaAuthorizationPage(): void;
}

export interface IUserInfo {
    access_token: string;
    athlete: {
        id: number;
        username: string;
        firstname: string;
        lastname: string;
        profile_medium: string;
        profile: string;
        email: string;
    }
}

export class Strava implements IStrava {
    constructor(private config: IStravaConfiguration) {
    }

    public exchangeCodeForUserInformation = (code: string): Promise<IUserInfo> => {
        const authUrl = `${this.config.backendUri}/auth`;
        const params = {
            code,
        };
        const url = this.getUrlWithParams(authUrl, params);
        // TODO: Do I need a fetch polyfill?
        return fetch(url).then(response => response.json());
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
    }}