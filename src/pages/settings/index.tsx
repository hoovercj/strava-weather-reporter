import {
    ChoiceGroup,
    ComboBox,
    IChoiceGroupOption,
    IComboBoxOption,
    Link,
    TooltipHost,
} from 'office-ui-fabric-react';
import * as React from 'react';

import { Dialog } from 'src/components/dialog';
import {
    DistanceUnits,
    IUserSettings,
    WeatherFieldSettings,
    WeatherInformation,
    WeatherUnits,
} from 'src/services/strava/strava';
import { AutoUpdateActivitiesToggle } from '../auto-update-activities';

export interface ISettingsPageProps {
    userSettings: IUserSettings;
    onSave: (settings: IUserSettings) => Promise<void>;
    onDismiss: () => Promise<void>;
    onDeleteAccount: () => void;
}

interface ISettingsPageState {
    autoUpdate: boolean,
    distanceUnits: DistanceUnits,
    weatherUnits: WeatherUnits,
    weatherFields: WeatherFieldSettings,
}

export class SettingsPage extends React.Component<ISettingsPageProps, ISettingsPageState> {
    constructor(props: ISettingsPageProps) {
        super(props);

        this.state = {
            autoUpdate: this.props.userSettings.autoUpdate,
            distanceUnits: this.props.userSettings.distanceUnits,
            weatherFields: this.props.userSettings.weatherFields,
            weatherUnits: this.props.userSettings.weatherUnits,
        }
    }

    public render() {
        return (
            <Dialog
                title={'Settings'}
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
                <h2>Auto Update Activities</h2>
                <AutoUpdateActivitiesToggle
                    renderTooltip={true}
                    checked={this.state.autoUpdate}
                    onChanged={this.onAutoUpdateChanged}
                />
                <h2>Information</h2>
                <ComboBox
                    label={'Choose which information to add to descriptions.\nItems with a * will only be shown when the weather dictates.'}
                    multiSelect={true}
                    defaultSelectedKey={this.defaultWeatherFieldSelectedKeys}
                    options={this.weatherFieldOptions}
                    selectedKey={this.currentWeatherFieldSelectedKeys}
                    onChanged={this.onChangeWeatherFields}
                />
                <h2>Units</h2>
                <TooltipHost
                    tooltipProps={{
                        onRenderContent: this.renderDistanceTooltip,
                    }}
                >
                    <ChoiceGroup
                        defaultSelectedKey={this.state.distanceUnits}
                        options={[
                            {
                                key: DistanceUnits.Miles,
                                text: DistanceUnits.Miles,
                                title: 'min/mile, mph, etc.'
                            },
                            {
                                key: DistanceUnits.Kilometers,
                                text: DistanceUnits.Kilometers,
                                title: 'min/km, km/h, etc.'
                            },
                        ]}
                        label='Distance'
                        onChange={this.onDistanceUnitsChanged}
                        styles={{
                            label: {
                                fontWeight: 'bold'
                            }
                        }}
                    />
                </TooltipHost>
                <TooltipHost
                    tooltipProps={{
                        onRenderContent: this.renderWeatherTooltip,
                    }}
                >
                    <ChoiceGroup
                        defaultSelectedKey={this.state.weatherUnits}
                        options={[
                            {
                                key: WeatherUnits.Both,
                                text: WeatherUnits.Both,
                                title: 'Use both imperial and metric units for each measurement.'
                            },
                            {
                                key: WeatherUnits.Imperial,
                                text: WeatherUnits.Imperial,
                                title: 'Degrees farenheit, wind speed in mph, etc.'
                            },
                            {
                                key: WeatherUnits.Metric,
                                text: WeatherUnits.Metric,
                                title: 'Degrees celcius, wind speed in m/s, etc.'
                            },
                        ]}
                        label='Weather'
                        onChange={this.onWeatherUnitsChanged}
                        styles={{
                            label: {
                                fontWeight: 'bold'
                            }
                        }}
                    />
                </TooltipHost>
                <h2>Account</h2>
                <Link onClick={this.props.onDeleteAccount}>Delete account</Link>
            </React.Fragment>
        )
    }

    private onChangeWeatherFields = (option: IComboBoxOption): void => {
        // User selected/de-selected an existing option
        this.setState({
            weatherFields: {
                ...this.state.weatherFields,
                [option.key]: option.selected,
            },
        });
    };

    private onSave = (): Promise<void> => {
        return this.props.onSave({
            autoUpdate: this.state.autoUpdate,
            distanceUnits: this.state.distanceUnits,
            weatherFields: this.state.weatherFields,
            weatherUnits: this.state.weatherUnits,
        });
    }

    private onDistanceUnitsChanged = (ev: React.FormEvent<HTMLElement>, options: IChoiceGroupOption): void => {
        this.setState({
            distanceUnits: options.key as DistanceUnits,
        });
    }

    private onWeatherUnitsChanged = (ev: React.FormEvent<HTMLElement>, options: IChoiceGroupOption): void => {
        this.setState({
            weatherUnits: options.key as WeatherUnits,
        });
    }

    private onAutoUpdateChanged = (checked: boolean): Promise<void> => {
        this.setState({
            autoUpdate: checked,
        });
        return Promise.resolve();
    }

    private renderDistanceTooltip = (): JSX.Element => {
        return (
            <React.Fragment>
                <p role='heading' aria-level={1}><b>Distance units</b></p>
                <p>Choose which units are shown in the activities list.</p>
                <p><b>Miles: </b>min/mile, mph, etc.</p>
                <p><b>Kilometers: </b>min/km, km/h, etc.</p>
            </React.Fragment>
        )
    }

    private renderWeatherTooltip = (): JSX.Element => {
        return (
            <React.Fragment>
                <p role='heading' aria-level={1}><b>Weather units</b></p>
                <p>Choose which units are used when adding weather information to activity descriptions.</p>
                <p><b>Both: </b> Use both imperial and metric units for each measurement.</p>
                <p><b>Imperial: </b>Degrees farenheit, wind speed in mph, etc.</p>
                <p><b>Metric: </b>Degrees celcius, wind speed in m/s, etc.</p>
            </React.Fragment>
        )
    }

    private get weatherFieldOptions(): IComboBoxOption[] {
        return Object.keys(WeatherInformation).map(value => {
            const comboBoxOption = {
                key: value,
                // selected: this.state.weatherFields[value],
                text: WeatherInformation[value],
            } as IComboBoxOption;

            return comboBoxOption;
        })
    }

    private get defaultWeatherFieldSelectedKeys(): string[] {
        return Object.keys(WeatherInformation).filter(value => this.props.userSettings.weatherFields[value]);
    }

    private get currentWeatherFieldSelectedKeys(): string[] {
        return Object.keys(WeatherInformation).filter(value => this.state.weatherFields[value]);
    }
}