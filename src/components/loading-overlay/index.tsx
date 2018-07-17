import {
    Overlay,
    Spinner,
} from 'office-ui-fabric-react';
import * as React from 'react';

import './index.css';

export interface ILoadingOverlayProps {
    onClick: () => void;
}

export class LoadingOverlay extends React.Component<ILoadingOverlayProps> {
    public render() {
        return (
            <div className={'loading-overlay_container'}>
                <Overlay
                    isDarkThemed={true}
                    onClick={this.props.onClick}
                    className={'loading-overlay_overlay'}
                >
                    <Spinner
                        ariaLabel={'Loading'}
                    />
                </Overlay>
            </div>
        )
    }
}