import './index.css';

import {
    DefaultButton,
    IButtonProps,
    PrimaryButton,
} from 'office-ui-fabric-react';
import * as React from 'react';

export class ThemedButton extends React.Component<IButtonProps> {
    public render() {
        const className = this.props.className || '';
        const Tag = this.props.primary ? PrimaryButton : DefaultButton
        return (
            <Tag
                {...this.props}
                className={`${className} themed-button`.trim()}
            />
        )
    }
}