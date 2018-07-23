import {
    ActivitiesApi,
    Configuration,
    SummaryActivity,
} from 'src/lib/strava';
import { IStorage } from 'src/services/storage';

export type IActivitiesApi = ActivitiesApi;
export type ISummaryActivity = SummaryActivity;

export interface ISummaryActivityWithDescription extends ISummaryActivity {
    description: string;
}

type primitive = string | number | boolean;

export interface IStravaConfiguration {
    backendCode: string;
    backendUrl: string;
    clientId: number;
    stravaCodeRedirectUri: string;
}

export interface IStrava {
    activitiesApi: ActivitiesApi;
    cachedProcessedActivities(): string[];
    processedActivities(): Promise<string[]>;
    getDescriptionForActivity(id: string): Promise<string>;
    updateDescriptionForActivity(id: string): Promise<string>;
    exchangeCodeForUserInformation(code: string): Promise<IUserInfo>;
    redirectToStravaAuthorizationPage(): void;
    cachedUserInformation(): IUserInfo | undefined;
    clearCachedInformation(): void;
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

    public static getStravaUrl = () => {
        return 'https://www.strava.com';
    }

    public static getUrlForActivity = (id: string | number) => {
        return `${Strava.getStravaUrl()}/activities/${id}`;
    }

    public get activitiesApi(): ActivitiesApi {
        return this._activitiesApi;
    }
    private _activitiesApi: ActivitiesApi;

    private cache: { [key: string]: any } = {};

    private readonly STRAVA_AUTH_INFO_STORAGE_KEY = 'STRAVA_AUTH_INFO';
    private readonly STRAVA_PROCESSED_ACTIVITIES_STORAGE_KEY = 'STRAVA_PROCESSED_ACTIVITIES';

    constructor(private config: IStravaConfiguration, private storage: IStorage) {
        const apiConfig: Configuration = { accessToken: this.getAuthToken };
        this._activitiesApi = new ActivitiesApi(apiConfig);
    }

    public getActivitiesApi = (): ActivitiesApi => this.activitiesApi;

    public cachedUserInformation = (): IUserInfo => {
        const stravaResponse = this.cachedStravaAuthInfo();

        return stravaResponse
            && stravaResponse.athlete;
    }

    public cachedProcessedActivities = (): string[] => {
        return this.getCachedValue<string[]>(this.STRAVA_PROCESSED_ACTIVITIES_STORAGE_KEY);
    }

    public clearCachedInformation = (): void => {
        this.cache = {};
        this.storage.clear();
    }

    public processedActivities = (): Promise<string[]> => {
        const apiUrl = `${this.config.backendUrl}/processedactivities/${this.cachedUserInformation().id}`;
        const params = {
            code: this.config.backendCode,
            token: this.getAuthToken(),
        }
        const url = this.getUrlWithParams(apiUrl, params);

        return fetch(url)
            .then(response => response.json())
            .then((processedActivities: string[]) => {
                this.setCachedValue(this.STRAVA_PROCESSED_ACTIVITIES_STORAGE_KEY, processedActivities);
                return processedActivities;
            });
    }

    public exchangeCodeForUserInformation = async (stravaCode: string): Promise<IUserInfo> => {
        const authUrl = `${this.config.backendUrl}/auth`;
        const params = {
            code: this.config.backendCode,
            stravacode: stravaCode,
        };
        const url = this.getUrlWithParams(authUrl, params);

        return fetch(url, { method: 'POST' })
            .then(response => response.json())
            .then((stravaResponse: IStravaAuthenticationResponse) => {
                this.setCachedValue(this.STRAVA_AUTH_INFO_STORAGE_KEY, stravaResponse);
                return stravaResponse.athlete;
            });
    }

    public getDescriptionForActivity = async (id: string): Promise<string> => {
        return this.descriptionForActivityCore(id, 'get');
    }

    public updateDescriptionForActivity = async (id: string): Promise<string> => {
        return this.descriptionForActivityCore(id, 'post');
    }

    public descriptionForActivityCore = async (id: string, method: string): Promise<string> => {
        const descriptionUrl = `${this.config.backendUrl}/description/${id}`;
        const params = {
            code: this.config.backendCode,
            token: this.getAuthToken(),
        }
        const url = this.getUrlWithParams(descriptionUrl, params);

        const response = await fetch(url, { method });
        return response.status === 200
            ? response.text()
            : '';
    }

    public redirectToStravaAuthorizationPage = () => {
        const stravaBaseUrl = 'https://www.strava.com/oauth/authorize';
        const params = {
            client_id: this.config.clientId,
            redirect_uri: encodeURI(this.config.stravaCodeRedirectUri),
            response_type: 'code',
            scope: 'write',
        }

        const url = this.getUrlWithParams(stravaBaseUrl, params);

        (window.location as any) = url;
    }

    private getAuthToken = (): string => {
        const authInfo = this.cachedStravaAuthInfo();
        return authInfo && authInfo.access_token;
    }

    private cachedStravaAuthInfo = (): IStravaAuthenticationResponse => {
        return this.getCachedValue<IStravaAuthenticationResponse>(this.STRAVA_AUTH_INFO_STORAGE_KEY);
    }

    private setCachedValue = (key: string, value: any): void => {
        this.cache[key] = value;
        this.storage.setItem(key, JSON.stringify(value));
    }

    private getCachedValue = <T>(key: string): T => {
        if (!this.cache[key]) {
            const storedStravaAuthInfoString = this.storage.getItem(key);
            if (storedStravaAuthInfoString) {
                try {
                    this.cache[key] = JSON.parse(storedStravaAuthInfoString);
                } catch (e) {
                    this.storage.removeItem(key);
                }
            }
        }
        return this.cache[key];
    }

    private getUrlWithParams = (url: string, params: { [key: string]: primitive }) => {
        const paramsString = Object.keys(params).map(key => {
            return `&${key}=${params[key]}`
        }).join('&');

        return `${url}?${paramsString}`;
    }
}
