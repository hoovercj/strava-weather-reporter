import {
    ChoiceGroup,
    IChoiceGroupOption,
    TooltipHost,
    // TooltipHost,
} from 'office-ui-fabric-react';
import * as React from 'react';

import { Dialog } from 'src/components/dialog';
import { DistanceUnits, IUserSettings, WeatherUnits } from 'src/services/strava/strava';

export interface ISettingsPageProps {
    userSettings: IUserSettings;
    onSave: (settings: IUserSettings) => Promise<void>;
    onDismiss: () => Promise<void>;
}

interface ISettingsPageState {
    distanceUnits: DistanceUnits,
    weatherUnits: WeatherUnits,
}

export class SettingsPage extends React.Component<ISettingsPageProps, ISettingsPageState> {
    constructor(props: ISettingsPageProps) {
        super(props);

        this.state = {
            distanceUnits: this.props.userSettings.distanceUnits,
            weatherUnits: this.props.userSettings.weatherUnits,
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

                        label='Distance Units'
                        onChange={this.onDistanceUnitsChanged}
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
                        label='Weather Units'
                        onChange={this.onWeatherUnitsChanged}
                    />
                </TooltipHost>
            </React.Fragment>
        )
    }

    private onSave = (): Promise<void> => {
        return this.props.onSave({
            distanceUnits: this.state.distanceUnits,
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
}