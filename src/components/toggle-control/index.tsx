import {
    Toggle,
    TooltipHost,
} from 'office-ui-fabric-react';
import * as React from 'react';

export interface IToggleControlProps {
    checked: boolean;
    onChanged: (value: boolean) => Promise<any>;
    renderTooltip?: boolean;
    onText: string;
    offText: string;
    tooltipProps: {
        headingText: string,
        bodyText: string,
    }
}

export interface IToggleControlState {
    enabled: boolean;
}

export class ToggleControl extends React.Component<IToggleControlProps, IToggleControlState> {

    constructor(props: IToggleControlProps) {
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
                onText={this.props.onText}
                offText={this.props.offText}
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
                <p role='heading' aria-level={1}><b>{this.props.tooltipProps.headingText}</b></p>
                <p>{this.props.tooltipProps.bodyText}</p>
            </React.Fragment>
        );
    }
}
