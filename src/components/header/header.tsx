import { CommandBar, ICommandBarItemProps } from 'office-ui-fabric-react';
import * as React from 'react';
import './header.css';

// tslint:disable-next-line:no-empty-interface
export interface IHeaderMenuItemProps extends ICommandBarItemProps {};

export interface IHeaderProps {
    pageTitle: string;
    menuItems?: IHeaderMenuItemProps[];
}

export class Header extends React.Component<IHeaderProps, {}> {
    public render() {
        return (
            <CommandBar
                items={[{
                    key: 'page-title',
                    text: this.props.pageTitle,
                }]}
                farItems={this.props.menuItems}
            />
        );
    }
}