import {
    Dialog,
    DialogFooter,
    getTheme,
    ITheme,
    loadTheme,
    PrimaryButton,
} from 'office-ui-fabric-react';
// This is necessary for icons to appear in dialogs
// TODO: Is it possible to only initialize some icons?
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import * as React from 'react';


import 'src/styles/colors.css';
import 'src/styles/fonts.css';

import { LoadingOverlay } from 'src/components/loading-overlay';
import { IAppInfo } from 'src/models/copyright-info';
import { ActivitiesPage } from 'src/pages/activities';
import { LandingPage } from 'src/pages/landing';
import { IStrava, IUserInfo } from 'src/services/strava/strava';
import {
    clearQueryString,
    getQueryStringValue,
} from 'src/utils/query-string';

interface IAppProps {
    applicationInfo: IAppInfo;
    strava: IStrava,
    activitiesPerPage: number,
}

interface IAppState {
    authenticating?: boolean;
    userInfo?: IUserInfo;
    error?: string;
}

class App extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);

        this.state = {
            authenticating: false,
            error: undefined,
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
            this.setState({authenticating: true});
            this.props.strava.exchangeCodeForUserInformation(code)
                .then(this.handleUserInformation)
                .catch(this.handleAuthError);
        }
    }

    public render() {
        const errorDialog = this.renderErrorDialog();
        const authPage = this.renderAuthenticatingPage();
        const mainContent = this.state.userInfo ?
            this.renderActivitiesPage() :
            this.renderLandingPage();

            return [
                errorDialog,
                authPage,
                mainContent,
            ];
    }

    private renderErrorDialog = () => {
        const onDismiss = () => { this.setState({error: undefined}); }

        return (
            <Dialog
                key='error-dialog'
                hidden={!this.state.error}
                dialogContentProps={{
                    onDismiss,
                    subText: this.state.error,
                    title: 'Something went wrong',
                }}
            >
                <DialogFooter>
                    <PrimaryButton onClick={onDismiss} text='Ok' />
                </DialogFooter>
            </Dialog>
        );
    }

    private renderAuthenticatingPage = () => {
        if (this.state.userInfo || !this.state.authenticating) {
            return;
        }
        
        return (
            <LoadingOverlay
                key='authenticating'
                onClick={this.cancelAuthentication}
            />
        )
    }

    private cancelAuthentication = () => {
        this.setState({authenticating: false});
    }

    private renderLandingPage = () => {
        return (
            <LandingPage
                key='landing'
                applicationInfo={this.props.applicationInfo}
                strava={this.props.strava}
            />
        )
    }

    private renderActivitiesPage = () => {
        return (
            <ActivitiesPage
                key='activities'
                activitiesPerPage={this.props.activitiesPerPage}
                applicationInfo={this.props.applicationInfo}
                onSignOut={this.signOut}
                strava={this.props.strava}
            />
        )
    }

    private signOut = () => {
        this.props.strava.clearCachedInformation();
        this.setState({
            ...this.state,
            userInfo: undefined,
        });
    }

    private handleAuthError = (error: any) => {
        clearQueryString();
        this.setState({
            authenticating: false,
            error: 'We were unable to sign you in at this time.',
        });
    }

    private handleUserInformation = (info: IUserInfo): void => {
        clearQueryString();
        this.setState({
            authenticating: false,
            userInfo: info,
        });
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
    };
}

export default App;
