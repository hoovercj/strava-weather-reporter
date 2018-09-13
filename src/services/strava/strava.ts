import {
    ActivitiesApi,
    Configuration,
    SummaryActivity,
} from 'src/lib/strava';
import { IStorage } from 'src/services/storage';
import { getUrlWithParams } from 'src/utils/query-string';

export type IActivitiesApi = ActivitiesApi;
export type ISummaryActivity = SummaryActivity;

export interface ISummaryActivityWithDescription extends ISummaryActivity {
    description: string;
}

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
    cachedSettings(): IUserSettings | undefined;
    updateSettings(userSettings: Partial<IUserSettings>): Promise<void>;
    getSettings(): Promise<IUserSettings>;
    deleteAccount(): Promise<void>;
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

export interface IUserSettings {
    distanceUnits: DistanceUnits;
    weatherUnits: WeatherUnits;
    autoUpdate: boolean;
}

export enum DistanceUnits {
    Miles = 'Miles',
    Kilometers = 'Kilometers',
}

export enum WeatherUnits {
    Metric = 'Metric',
    Imperial = 'Imperial',
    Both = 'Both',
}

export const DEFAULT_USER_SETTINGS: IUserSettings = {
    autoUpdate: false,
    distanceUnits: DistanceUnits.Miles,
    weatherUnits: WeatherUnits.Both,
};

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
    private readonly STRAVA_USER_SETTINGS_STORAGE_KEY = 'STRAVA_USER_SETTINGS';

    constructor(private config: IStravaConfiguration, private storage: IStorage) {
        const apiConfig: Configuration = { accessToken: this.getAuthToken };
        this._activitiesApi = new ActivitiesApi(apiConfig);
    }

    public deleteAccount = (): Promise<void> => {
        const userId = this.cachedUserInformation().id;
        if (!userId) {
            return Promise.resolve();
        }

        const apiUrl = `${this.config.backendUrl}/deleteaccount/${userId}`;
        const params = {
            code: this.config.backendCode,
            token: this.getAuthToken(),
        }
        const url = getUrlWithParams(apiUrl, params);

        return fetch(url, { method: 'DELETE' })
            .then(() => {/* void */});
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
        const userId = this.cachedUserInformation().id;
        if (!userId) {
            return Promise.resolve([]);
        }

        const apiUrl = `${this.config.backendUrl}/processedactivities/${userId}`;
        const params = {
            code: this.config.backendCode,
            token: this.getAuthToken(),
        }
        const url = getUrlWithParams(apiUrl, params);

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
        const url = getUrlWithParams(authUrl, params);

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
        const url = getUrlWithParams(descriptionUrl, params);

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

        const url = getUrlWithParams(stravaBaseUrl, params);

        (window.location as any) = url;
    }

    public updateSettings = (settings: IUserSettings): Promise<void> => {
        const userId = this.cachedUserInformation()
                    && this.cachedUserInformation().id;

        if (!userId) {
            return Promise.reject();
        }

        this.storage.setItem(this.STRAVA_USER_SETTINGS_STORAGE_KEY, settings);


        const apiUrl = `${this.config.backendUrl}/settings/${userId}`;
        const params = {
            code: this.config.backendCode,
            token: this.getAuthToken(),
        }
        const url = getUrlWithParams(apiUrl, params);

        return fetch(url, {
            body: JSON.stringify(settings),
            method: 'POST',
        })
        .then(() => {/* Do nothing */});
    }

    public getSettings = (): Promise<IUserSettings> => {
        const userId = this.cachedUserInformation()
                    && this.cachedUserInformation().id;

        if (!userId) {
            return Promise.reject();
        }

        const apiUrl = `${this.config.backendUrl}/settings/${userId}`;
        const params = {
            code: this.config.backendCode,
            token: this.getAuthToken(),
        }
        const url = getUrlWithParams(apiUrl, params);

        return fetch(url)
            .then(response => response.json())
            .then((userSettings: IUserSettings) => {
                this.setCachedValue<IUserSettings>(this.STRAVA_USER_SETTINGS_STORAGE_KEY, userSettings);
                return userSettings;
            });
    }

    public cachedSettings = (): IUserSettings | undefined => {
        return this.getCachedValue<IUserSettings>(this.STRAVA_USER_SETTINGS_STORAGE_KEY);
    }

    private getAuthToken = (): string => {
        const authInfo = this.cachedStravaAuthInfo();
        return authInfo && authInfo.access_token;
    }

    private cachedStravaAuthInfo = (): IStravaAuthenticationResponse => {
        return this.getCachedValue<IStravaAuthenticationResponse>(this.STRAVA_AUTH_INFO_STORAGE_KEY);
    }

    private setCachedValue = <T>(key: string, value: T): void => {
        this.cache[key] = value;
        this.storage.setItem<T>(key, value);
    }

    private getCachedValue = <T>(key: string): T => {
        if (!this.cache[key]) {
            const cachedValue = this.storage.getItem<T>(key);
            if (cachedValue) {
                try {
                    this.cache[key] = cachedValue;
                } catch (e) {
                    this.storage.removeItem(key);
                }
            }
        }
        return this.cache[key];
    }
}
