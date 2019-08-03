import * as React from 'react';
import { ToggleControl } from 'src/components/toggle-control';

export interface IAutoUpdateActivitiesToggleProps {
    checked: boolean;
    onChanged: (value: boolean) => Promise<any>;
    renderTooltip?: boolean;
}

export class AutoUpdateActivitiesToggle extends React.Component<IAutoUpdateActivitiesToggleProps, {}> {
    public render(): JSX.Element  {
        return <ToggleControl
            renderTooltip={this.props.renderTooltip}
            checked={this.props.checked}
            onChanged={this.props.onChanged}
            offText='Auto Update Disabled'
            onText='Auto Update Enabled'
            tooltipProps={{
                bodyText: 'When turned on, new activities will automatically have weather information added to the description.',
                headingText: 'Auto Update Activities',
            }}
        />
    }
}
