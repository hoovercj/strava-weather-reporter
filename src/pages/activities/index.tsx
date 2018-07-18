import { Link } from 'office-ui-fabric-react';
import * as React from 'react';

import { ActivitiesList } from "src/components/activities-list";
import { PageHeader } from "src/components/page-header";
import { IPageProps, Page } from "src/pages/page";

export interface IActivitiesPageProps extends IPageProps {
    activitiesPerPage: number;
    onSignOut: () => void;
}

export class ActivitiesPage extends Page<IActivitiesPageProps> {

    protected renderHeader() {
        return (
            <PageHeader pageTitle={this.props.name}>
                <Link
                    className={'color_neutral-primary-alt'}
                    key={'page-sign-out'}
                    onClick={this.props.onSignOut}
                >
                    {`Log Out`}
                </Link>
            </PageHeader>
        );
    }

    protected renderContent() {
        return (
            <ActivitiesList
                itemsPerPage={this.props.activitiesPerPage}
                strava={this.props.strava}
            />
        );
    }
}
