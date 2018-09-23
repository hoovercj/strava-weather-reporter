import {
    getTheme,
    ITheme,
    loadTheme,
} from 'office-ui-fabric-react';
// This is necessary for icons to appear in dialogs
// TODO: Is it possible to only initialize some icons?
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import * as React from 'react';


import 'src/styles/colors.css';
import 'src/styles/fonts.css';

import { Dialog } from 'src/components/dialog';
import { LoadingOverlay } from 'src/components/loading-overlay';
import { IAppInfo } from 'src/models/copyright-info';
import { ActivitiesPage } from 'src/pages/activities';
import { LandingPage } from 'src/pages/landing';
import {
    IStrava,
    IUserInfo,
    IUserSettings,
} from 'src/services/strava/strava';
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
    userSettings: IUserSettings;
    error?: string;
    deleteAccount: boolean;
}

class App extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);

        this.state = {
            authenticating: false,
            deleteAccount: false,
            error: undefined,
            userInfo: this.props.strava.cachedUserInformation(),
            userSettings: this.props.strava.cachedSettings(),
        };
    }

    public componentDidUpdate(prevProps: IAppProps, prevState: IAppState): void {
        if (!prevState.userInfo && this.state.userInfo) {
            this.getSettings();
        }
    }

    public componentDidMount(): void {
        loadTheme(this.getCustomTheme());
        initializeIcons();

        if (this.state.userInfo) {
            clearQueryString();
            this.getSettings();
            return;
        }

        // If we have a code in the query parameters, exchange it for user info
        const code = getQueryStringValue('code');
        if (code) {
            this.authenticate(code);
        }
    }

    public render() {
        const deleteAccountDialog = this.renderDeleteAccountDialog();
        const errorDialog = this.renderErrorDialog();
        const authPage = this.renderAuthenticatingPage();
        const mainContent = this.state.userInfo ?
            this.renderActivitiesPage() :
            this.renderLandingPage();

            return (
                <React.Fragment>
                    {errorDialog}
                    {authPage}
                    {mainContent}
                    {deleteAccountDialog}
                </React.Fragment>
            );
    }

    private getSettings = (): Promise<void> => {
        return this.props.strava.getSettings()
            .then(this.handleGetUserSettings)
            .catch(this.handleGetUserSettingsError);
    }

    private handleGetUserSettings = (settings: IUserSettings): void => {
        this.setState({
            userSettings: settings,
        });
    }

    private handleGetUserSettingsError = (): void => {
        // Do nothing
    }

    private authenticate = (code: string): Promise<void> => {
        this.setState({authenticating: true});
        return this.props.strava.exchangeCodeForUserInformation(code)
            .then(this.handleUserInformation)
            .catch(this.handleAuthError);
    }

    private renderDeleteAccountDialog = () => {
        if (!this.state.deleteAccount) {
            return null;
        }

        const onDismiss = () => {
            this.setState({deleteAccount: false});
            return Promise.resolve();
        }

        return (
            <Dialog
                onDismiss={onDismiss}
                onApprove={this.deleteAccount}
                approveButtonText='Delete account'
                dismissButtonText='Cancel'
                title='Are you sure?'
                renderContent={this.renderDeleteAccountDialogContent}
            />
        );
    }

    private renderDeleteAccountDialogContent = (): JSX.Element => {
        return (
            <React.Fragment>
                <p>Deleting your account will prevent this application from accessing your Strava data and will delete any stored information.</p>
                <br/>
                <p>This action will <b>not</b> touch your Strava activities or modify any descriptions that have already been added.</p>
            </React.Fragment>
        );
    }

    private renderErrorDialog = () => {
        if (!this.state.error) {
            return null;
        }

        const onDismiss = () => {
            this.setState({error: undefined});
            return Promise.resolve();
        }

        const renderErrorContent = () => (<p>{this.state.error}</p>);

        return (
            <Dialog
                title='Something went wrong'
                onDismiss={onDismiss}
                renderContent={renderErrorContent}
                dismissButtonText='Ok'
            />
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
                userSettings={this.state.userSettings}
                updateUserSettings={this.updateUserSettings}
                strava={this.props.strava}
                deleteAccount={this.showDeleteAccountDialog}
            />
        )
    }

    private signOut = () => {
        this.props.strava.clearCachedInformation();
        this.setState({
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

    private updateUserSettings = (userSettings: Partial<IUserSettings>): Promise<boolean> => {
        return this.props.strava.updateSettings(userSettings)
            .then(() => {
                const mergedSettings = Object.assign({}, this.state.userSettings, userSettings);
                this.setState({
                    userSettings: mergedSettings,
                });
                return true;
            })
            .catch(() => false);
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

    private showDeleteAccountDialog = () => {
        this.setState({ deleteAccount: true });
    }

    private deleteAccount = async () => {
        try {
            await this.props.strava.deleteAccount();
            this.signOut();
        } catch {
            this.setState({
                error: 'There was a problem deleting your account. Please try again later.'
            });
        } finally {
            this.setState({ deleteAccount: false });
        }
    }
}

export default App;
