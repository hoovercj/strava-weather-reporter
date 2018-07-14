import * as React from 'react';
import './index.css';

export interface IPageHeaderProps {
    pageTitle: string;
}

export class PageHeader extends React.Component<IPageHeaderProps, {}> {
    public render() {
        return (
            <div className={'page-header_container'}>
                <h1 className={'page-header_page-title color_theme-primary'}>{this.props.pageTitle}</h1>
                <div className={'page-header_actions-container'}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}
