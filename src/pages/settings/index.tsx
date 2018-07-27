import {
    ChoiceGroup,
    IChoiceGroupOption,
    TooltipHost,
} from 'office-ui-fabric-react';
import * as React from 'react';

import { Dialog } from 'src/components/dialog';
import { DisplayUnits, IUserSettings } from 'src/services/strava/strava';

export interface ISettingsPageProps {
    userSettings: IUserSettings;
    onSave: (settings: IUserSettings) => Promise<void>;
    onDismiss: () => Promise<void>;
}

interface ISettingsPageState {
    displayUnits: DisplayUnits,
}

export class SettingsPage extends React.Component<ISettingsPageProps, ISettingsPageState> {
    constructor(props: ISettingsPageProps) {
        super(props);

        this.state = {
            displayUnits: this.props.userSettings.displaySettings.units || DisplayUnits.Miles,
        }

    }

    public render() {
        return (
            <Dialog
                renderContent={this.renderContent}
                approveButtonText={'Save settings'}
                dismissButtonText={'Cancel'}
                onApprove={this.onSave}
                onDismiss={this.props.onDismiss}
            />
        )
    }

    private renderContent = (): JSX.Element => {
        return (
            <React.Fragment>
                <h1>Settings</h1>
                <TooltipHost
                    calloutProps={{
                        gapSpace: -20,
                    }}
                    content='These settings apply only to how activities are displayed on this site.'
                >
                    <h2>Display Settings</h2>
                </TooltipHost>
                {/* TODO: handle these values when saving the dialog. */}
                <ChoiceGroup
                    defaultSelectedKey={this.state.displayUnits}
                    options={[
                        {
                            key: DisplayUnits.Miles,
                            text: DisplayUnits.Miles,
                        },
                        {
                            key: DisplayUnits.Kilometers,
                            text: DisplayUnits.Kilometers,
                        },
                    ]}
                    label='Units'
                    onChange={this.onDisplayUnitsChanged}
                />
                {/* TODO: Add additional settings below */}
                {/* <TooltipHost
                    content='These settings apply apply to the descriptions added to Strava activities.'
                    calloutProps={{
                        gapSpace: -20,
                    }}
                >
                    <h2>Description Settings</h2>
                </TooltipHost> */}
            </React.Fragment>
        )
    }

    private onSave = (): Promise<void> => {
        return this.props.onSave({
            displaySettings: {
                units: this.state.displayUnits,
            }
        });
    }

    private onDisplayUnitsChanged = (ev: React.FormEvent<HTMLElement>, options: IChoiceGroupOption): void => {
        this.setState({
            displayUnits: options.key as DisplayUnits,
        });
    }
}