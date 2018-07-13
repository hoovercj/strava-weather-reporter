import {
    Fabric,
    getTheme,
    ITheme,
    loadTheme,
} from 'office-ui-fabric-react';
import * as React from 'react';
import { ActivitiesList } from 'src/components/activities-list';
import { IStrava, IUserInfo } from 'src/services/strava/strava';
import './App.css';
import {
    Header,
    IHeaderMenuItemProps,
    IHeaderProps
} from './components/header/header';

import {
    clearQueryString,
    getQueryStringValue,
} from './utils/query-string';

interface IAppProps {
    strava: IStrava,
}

interface IAppState {
    userInfo?: IUserInfo;
    error?: any;
}

class App extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);

        this.state = {
            userInfo: this.props.strava.cachedUserInformation(),
        };
    }

    public componentDidMount(): void {
        loadTheme(this.getCustomTheme());

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
            <Fabric>
                <div className="App">
                    <Header {...this.getHeaderProps()} />
                    { this.state.userInfo &&
                        <ActivitiesList strava={this.props.strava} />
                    }
                </div>
            </Fabric>
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
                    onClick: this.signOut,
                    text: `Sign Out, ${this.state.userInfo.firstname}`,
                }
            ]
        } else {
            // TODO: Replace this with a "Connect to strava" button
            return [
                {
                    key: 'page-sign-in',
                    onClick: this.props.strava.redirectToStravaAuthorizationPage,
                    text: 'Sign In',
                }
            ]
        }
    }

    private signOut = () => {
        this.props.strava.clearCachedInformation();
        this.setState({
            ...this.state,
            userInfo: undefined,
        });
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
        clearQueryString();
    }

    private getCustomTheme = (): ITheme => {
        const currentTheme = getTheme();
        return {
            disableGlobalClassNames: currentTheme.disableGlobalClassNames,
            fonts: currentTheme.fonts,
            isInverted: currentTheme.isInverted,
            palette: {
                ...currentTheme.palette,
                neutralPrimary: '#2d2d32',
                neutralPrimaryAlt: '#606065',
                themeDark: '#e34402',
                themeDarkAlt: '#c93d02',
                themeDarker: '#a63201',
                themePrimary: '#fc4c02',
            },
            semanticColors: {
                ...currentTheme.semanticColors,
                link: 'currentColor',
            },
        };
    }
}

export default App;
