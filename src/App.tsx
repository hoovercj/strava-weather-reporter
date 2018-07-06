import * as React from 'react';
import './App.css';
import {
    Header,
    IHeaderMenuItemProps,
    IHeaderProps
} from './components/header/header';

import { IStorage } from './services/storage';

import { IStrava, IUserInfo } from './services/strava/strava';

import {
    clearQueryString,
    getQueryStringValue,
} from './utils/query-string';

interface IAppProps {
    storage: IStorage,
    strava: IStrava,
}

interface IAppState {
    userInfo?: IUserInfo;
    error?: any;
}

class App extends React.Component<IAppProps, IAppState> {

    private readonly USER_INFORMATION_STORAGE_KEY = 'USER_INFORMATION';

    constructor(props: IAppProps) {
        super(props);

        const initialState: IAppState = {};

        const storedUserInfoString = this.props.storage.getItem(this.USER_INFORMATION_STORAGE_KEY);
        if (storedUserInfoString) {
            try {
                initialState.userInfo = JSON.parse(storedUserInfoString);
            } catch (e) {
                this.props.storage.removeItem(this.USER_INFORMATION_STORAGE_KEY);
            }
        }

        this.state = initialState;
    }

    public componentDidMount(): void {
        // If we already have user info, then great!
        // Clear any query string info though, as we don't need it
        if (this.state.userInfo) {
            clearQueryString();
            return;
        }

        // If we have a code in the query parameters, exchange it for user info
        const code = getQueryStringValue('code');
        if (code) {
            this.props.strava.exchangeCodeForUserInformation(code)
                .then(this.handleUserInformation)
                .catch(this.handleError);
            return;
        }
    }

    public render() {
        return (
            <div className="App">
                <Header {...this.getHeaderProps()} />
                <p className="App-intro">
                    To get started, edit <code>src/App.tsx</code> and save to reload.
                </p>
            </div>
        );
    }

    private getHeaderProps = (): IHeaderProps => {
        return {
            menuItems: this.getHeaderMenuItems(),
            pageTitle: 'Strava Weather',
        }
    }

    private getHeaderMenuItems = (): IHeaderMenuItemProps[] => {
        if (this.state.userInfo) {
            return [
                {
                    key: 'page-sign-out',
                    onClick: () => {
                        this.props.storage.clear();
                        this.setState({
                            ...this.state,
                            userInfo: undefined,
                        });
                    },
                    text: `Sign Out, ${this.state.userInfo.athlete.firstname}`,
                }
            ]
        } else {
            return [
                {
                    key: 'page-sign-in',
                    onClick: () => this.props.strava.redirectToStravaAuthorizationPage(),
                    text: 'Sign In',
                }
            ]
        }
    }

    private handleError = (error: any) => {
        this.setState({
            ...this.state,
            error,
        })
    }

    private handleUserInformation = (info: IUserInfo): void => {
        this.setState({
            ...this.state,
            userInfo: info
        });
        this.props.storage.setItem(this.USER_INFORMATION_STORAGE_KEY, JSON.stringify(info));
        clearQueryString();
    }
}

export default App;
