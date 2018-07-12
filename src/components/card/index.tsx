import * as React from 'react';
import './index.css';

export class Card extends React.Component {
    public render() {
        return <div className={'card_container'}>{this.props.children}</div>;
    }
}