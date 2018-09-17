import {
    Toggle,
    TooltipHost,
} from 'office-ui-fabric-react';
import * as React from 'react';

export interface IAutoUpdateActivitiesToggleProps {
    checked: boolean;
    onChanged: (value: boolean) => Promise<any>;
    renderTooltip?: boolean;
}

export interface IAutoUpdateActivitiesToggleState {
    enabled: boolean;
}

export class AutoUpdateActivitiesToggle extends React.Component<IAutoUpdateActivitiesToggleProps, IAutoUpdateActivitiesToggleState> {

    constructor(props: IAutoUpdateActivitiesToggleProps) {
        super(props);

        this.state = {
            enabled: true,
        }
    }

    public render(): JSX.Element  {
        return this.props.renderTooltip ? (
            <TooltipHost
                tooltipProps={{
                    onRenderContent: this.renderAutoUpdateTooltip,
                }}
            >
                {this.renderToggle()}
            </TooltipHost>
        ) : this.renderToggle();
    }

    private renderToggle = (): JSX.Element => {
        return (
            <Toggle
                checked={this.props.checked}
                onChanged={this.onChanged}
                onText='Auto Update Enabled'
                offText='Auto Update Disabled'
            />
        );
    }

    private onChanged = async (value: boolean) => {
        this.setState({ enabled: false });
        await this.props.onChanged(value);
        this.setState({ enabled: true });
    }

    private renderAutoUpdateTooltip = (): JSX.Element => {
        return (
            <React.Fragment>
                <p role='heading' aria-level={1}><b>Auto Update Activities</b></p>
                <p>When turned on, new activities will automatically have weather information added to the description.</p>
            </React.Fragment>
        );
    }
}
