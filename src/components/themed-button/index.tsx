import './index.css';

import { Button } from 'office-ui-fabric-react';
import * as React from 'react';

export class ThemedButton extends Button {
    public render() {
        const className = this.props.className || '';
        return (
            <Button
                {...this.props}
                className={`${className} themed-button`.trim()}
            />
        )
    }
}