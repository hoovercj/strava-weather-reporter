import {
    getTheme,
    ITheme,
    Link,
    loadTheme,
} from 'office-ui-fabric-react';
// This is necessary for icons to appear in dialogs
// TODO: Is it possible to only initialize some icons?
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import * as React from 'react';

import connectWithStravaImage from 'src/assets/connect_with_strava_orange.svg';
import { ActivitiesList } from 'src/components/activities-list';
import { ImageButton } from 'src/components/image-button'
import { PageFooter } from 'src/components/page-footer';
import { ICopyrightInfo } from 'src/models/copyright-info';
import { IStrava, IUserInfo } from 'src/services/strava/strava';

import 'src/styles/colors.css';
import 'src/styles/fonts.css';
import './App.css';

import {
    PageHeader,
} from './components/page-header';

import {
    clearQueryString,
    getQueryStringValue,
} from './utils/query-string';

interface IAppProps {
    copyrightInfo: ICopyrightInfo;
    name: string,
    strava: IStrava,
    activitiesPerPage: number,
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
        initializeIcons();

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
            <div className="app_container">
                {this.renderHeader()}
                {this.renderContent()}
                {this.renderFooter()}
            </div>
        );
    }

    private renderHeader = () => {
        return (
            <div className="app_header">
                <PageHeader pageTitle={this.props.name}>
                    {this.getHeaderMenuItems()}
                </PageHeader>
            </div>
        );
    }

    private renderContent = () => {
        return (
            <div className="app_content">
                { this.state.userInfo &&
                    <ActivitiesList
                        itemsPerPage={this.props.activitiesPerPage}
                        strava={this.props.strava}
                    />
                }
            </div>
        );
    }

    private renderFooter = () => {
        return (
            <div className="app_footer">
                <PageFooter copyrightInfo={this.props.copyrightInfo}/>
            </div>
        );
    }

    private getHeaderMenuItems = (): JSX.Element[] => {
        if (this.state.userInfo) {
            return [(
                <Link
                    className={'color_neutral-primary-alt'}
                    key={'page-sign-out'}
                    onClick={this.signOut}
                >
                    {`Log Out`}
                </Link>
            )]
        } else {
            return [
                <ImageButton
                    className={'app_header_sign-in-link'}
                    key={'page-sign-in'}
                    aria-label={'Connect with Strava'}
                    onClick={this.props.strava.redirectToStravaAuthorizationPage}
                    src={connectWithStravaImage}
                />
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
        });
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
            semanticColors: currentTheme.semanticColors,
        };
    }
}

export default App;
