import {
    IconButton,
    Link,
} from 'office-ui-fabric-react';
import * as React from 'react';


import { ActivitiesList } from 'src/components/activities-list';
import { PageHeader } from 'src/components/page-header';
import { IPageProps, Page } from 'src/pages/page';
import {
    SettingsPage
} from 'src/pages/settings';
import {
    IUserSettings,
    Strava,
} from 'src/services/strava/strava';

interface IActivitiesPageState {
    settingsOpened?: boolean;
    userSettings: IUserSettings;
}

export interface IActivitiesPageProps extends IPageProps {
    activitiesPerPage: number;
    onSignOut: () => void;
}

export class ActivitiesPage extends Page<IActivitiesPageProps, IActivitiesPageState> {

    protected constructor(props: IActivitiesPageProps) {
        super(props);
        this.state = {
            settingsOpened: false,
            userSettings: this.props.strava.cachedSettings() || Strava.defaultUserSettings,
        }
    }

    public async componentDidMount() {
        try {
            const settings = await this.props.strava.getSettings();
            if (settings) {
                this.setState({ userSettings: settings });
            }
        } catch {
            // Use default settings
        }
    }

    protected renderHeader() {
        return (
            <PageHeader pageTitle={this.props.applicationInfo.applicationName}>
                <IconButton
                    ariaLabel={'Settings'}
                    iconProps={{
                        iconName: 'Settings'
                    }}
                    onClick={this.onSettingsClicked}
                />
                <Link
                    className={'color_neutral-primary-alt'}
                    key={'page-sign-out'}
                    onClick={this.props.onSignOut}
                >
                    {`Log Out`}
                </Link>
                {this.renderSettings()}
            </PageHeader>
        );
    }

    protected renderContent() {
        return (
            <ActivitiesList
                itemsPerPage={this.props.activitiesPerPage}
                strava={this.props.strava}
            />
        );
    }

    protected renderSettings = () => {
        if (!this.state.settingsOpened) {
            return;
        }

        return (
            <SettingsPage
                userSettings={this.state.userSettings}
                onSave={this.onSettingsSaved}
                onDismiss={this.onSettingsDismissed}
            />
        )
    }

    private onSettingsDismissed = () => {
        this.setState({
            settingsOpened: false,
        })
    }

    private onSettingsClicked = () => {
        this.setState({
            settingsOpened: true,
        })
    }

    private onSettingsSaved = async (userSettings: IUserSettings) => {
        await this.props.strava.updateSettings(userSettings)
        this.setState({
            settingsOpened: false,
            userSettings,
        });
    }
}
