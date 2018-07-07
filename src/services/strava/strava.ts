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
    clearCachedInformation(): void;
    cachedUserActivities(): ISummaryActivity[];
    fetchUserActivities(): Promise<ISummaryActivity[]>
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

    private cache: { [key: string]: any } = {};

    private readonly STRAVA_AUTH_INFO_STORAGE_KEY = 'STRAVA_AUTH_INFO';
    private readonly STRAVA_USER_ACTIVITIES_STORAGE_KEY = 'STRAVA_USER_ACTIVITIES';

    constructor(private config: IStravaConfiguration, private storage: IStorage) {
    }

    public fetchUserActivities = (): Promise<ISummaryActivity[]> => {
        const authInfo = this.cachedStravaAuthInfo();
        const token = authInfo && authInfo.access_token;

        if (!token) {
            return Promise.resolve([]);
        }

        const authUrl = `${this.config.backendUri}/activities`;
        const params = {
            token,
        };
        const url = this.getUrlWithParams(authUrl, params);
        // TODO: Do I need a fetch polyfill?
        return fetch(url)
            .then(response => response.json())
            .then(JSON.parse)
            .then((stravaResponse: ISummaryActivity[]) => {
                this.setCachedValue(this.STRAVA_USER_ACTIVITIES_STORAGE_KEY, stravaResponse);
                return stravaResponse;
            });
    }

    public cachedUserActivities = (): ISummaryActivity[] => {
        return this.getCachedValue<ISummaryActivity[]>(this.STRAVA_USER_ACTIVITIES_STORAGE_KEY);
    }

    public cachedUserInformation = (): IUserInfo => {
        const stravaResponse = this.cachedStravaAuthInfo();

        return stravaResponse
            && stravaResponse.athlete;
    }

    public clearCachedInformation = (): void => {
        this.cache = {};
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
                this.setCachedValue(this.STRAVA_AUTH_INFO_STORAGE_KEY, stravaResponse);
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

export type LatLng = [number, number];

export interface IPolylineMap {
    'id'?: string;
    'polyline'?: string;
    'summaryPolyline'?: string;
}

export interface ISummaryActivity {
    'id'?: number;
    'externalId'?: string;
    'uploadId'?: number;
    'athlete'?: { id?: number };
    'name'?: string;
    'distance'?: number;
    'movingTime'?: number;
    'elapsedTime'?: number;
    'totalElevationGain'?: number;
    'elevHigh'?: number;
    'elevLow'?: number;
    'type'?: string;
    'startDate'?: Date;
    'startDateLocal'?: Date;
    'timezone'?: string;
    'startLatlng'?: LatLng;
    'endLatlng'?: LatLng;
    'achievementCount'?: number;
    'kudosCount'?: number;
    'commentCount'?: number;
    'athleteCount'?: number;
    'photoCount'?: number;
    'totalPhotoCount'?: number;
    'map'?: IPolylineMap;
    'trainer'?: boolean;
    'commute'?: boolean;
    'manual'?: boolean;
    '_private'?: boolean;
    'flagged'?: boolean;
    'workoutType'?: number;
    'averageSpeed'?: number;
    'maxSpeed'?: number;
    'hasKudoed'?: boolean;
}
