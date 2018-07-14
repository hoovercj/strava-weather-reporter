import {
    ILinkProps,
    Link,
} from 'office-ui-fabric-react';
import * as React from 'react';

export interface IImageButtonProps extends ILinkProps {
    'aria-label': string;
    src: string;
    imageClassName?: string;
    imageId?: string;
}

import './index.css';

export class ImageButton extends React.Component<IImageButtonProps> {
    public render() {
        return (
            <Link
                id={this.props.id}
                className={`image-button_link ${this.props.className || ''}`}
                key={this.props.key}
                aria-label={this.props['aria-label']}
                onClick={this.props.onClick}
            >
                <img
                    className={this.props.imageId}
                    role={'presentation'}
                    src={this.props.src}
                />
            </Link>
        )
    }
}