import {
    ChoiceGroup,
    DefaultButton,
    Dialog,
    DialogFooter,
    IChoiceGroupOption,
    PrimaryButton,
    TooltipHost,
} from 'office-ui-fabric-react';
import * as React from 'react';

import { DisplayUnits, IUserSettings } from 'src/services/strava/strava';

export interface ISettingsPageProps {
    userSettings: IUserSettings;
    onSave: (settings: IUserSettings) => void;
    onDismiss: () => void;
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
                hidden={false}
                onDismiss={this.props.onDismiss}
            >
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
                {/* <TooltipHost
                    content='These settings apply apply to the descriptions added to Strava activities.'
                    calloutProps={{
                        gapSpace: -20,
                    }}
                >
                    <h2>Description Settings</h2>
                </TooltipHost> */}
                <DialogFooter>
                    <PrimaryButton onClick={this.onSave} text='Save Settings' />
                    <DefaultButton onClick={this.props.onDismiss} text='Cancel' />
                </DialogFooter>
            </Dialog>
        )
    }

    private onSave = () => {
        this.props.onSave({
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