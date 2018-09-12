import {
    IconButton,
    Link,
} from 'office-ui-fabric-react';
import * as React from 'react';


import { ActivitiesList } from 'src/components/activities-list';
import { PageHeader } from 'src/components/page-header';
import { AutoUpdateActivitiesToggle } from 'src/pages/auto-update-activities';
import { IPageProps, Page } from 'src/pages/page';
import {
    SettingsPage
} from 'src/pages/settings';
import {
    IUserSettings,
} from 'src/services/strava/strava';

interface IActivitiesPageState {
    settingsOpened?: boolean;
}

export interface IActivitiesPageProps extends IPageProps {
    activitiesPerPage: number;
    onSignOut: () => void;
    userSettings: IUserSettings;
    updateUserSettings: (userSettings: Partial<IUserSettings>) => Promise<boolean>;
    deleteAccount: () => void;
}

export class ActivitiesPage extends Page<IActivitiesPageProps, IActivitiesPageState> {

    protected constructor(props: IActivitiesPageProps) {
        super(props);
        this.state = {
            settingsOpened: false,
        }
    }

    protected renderHeader() {
        return (
            <PageHeader pageTitle={this.props.applicationInfo.applicationName}>
                <AutoUpdateActivitiesToggle
                    checked={this.props.userSettings.autoUpdate}
                    onChanged={this.onAutoUpdateChanged}
                />
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
                userSettings={this.props.userSettings}
            />
        );
    }

    protected renderSettings = () => {
        if (!this.state.settingsOpened) {
            return;
        }

        return (
            <SettingsPage
                userSettings={this.props.userSettings}
                onSave={this.onSettingsSaved}
                onDismiss={this.onSettingsDismissed}
                onDeleteAccount={this.onDeleteAccount}
            />
        );
    }

    private onSettingsDismissed = () => {
        this.setState({
            settingsOpened: false,
        });
        return Promise.resolve();
    }

    private onSettingsClicked = () => {
        this.setState({
            settingsOpened: true,
        });
    }

    private onSettingsSaved = async (userSettings: IUserSettings) => {
        // TODO: do something based on success or failure
        await this.props.updateUserSettings(userSettings)
        this.setState({
            settingsOpened: false,
        });
    }

    private onDeleteAccount = async () => {
        await this.props.deleteAccount();
    }

    private onAutoUpdateChanged = async (autoUpdate: boolean) => {
        return this.props.updateUserSettings({ autoUpdate });
    }
}
