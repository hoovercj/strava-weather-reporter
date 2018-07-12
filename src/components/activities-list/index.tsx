import {
    List,
    PrimaryButton,
    Spinner,
} from 'office-ui-fabric-react';
import * as React from 'react';
import  { ActivitiesItem } from 'src/components/activities-item';
import  { ActivityDialog } from 'src/components/activity-dialog';
import  { Card } from 'src/components/card';
import {
    IStrava,
    ISummaryActivity,
} from 'src/services/strava/strava';

import './index.css';

export interface IActivitiesListProps {
    strava: IStrava
    itemsPerPage?: number;
}

export interface IActivitiesListState {
    activeActivity?: ISummaryActivity;
    activities: ISummaryActivity[];
    loadingComplete: boolean;
    nextPageToLoad: number;
    loadingError: any;
}

export class ActivitiesList extends React.Component<IActivitiesListProps, IActivitiesListState> {
    private readonly now = Date.now();

    private loading = false;

    constructor(props: IActivitiesListProps) {
        super(props);

        this.state = {
            activities: [], // this.props.strava.cachedUserActivities()
                            // TODO: How should caching and paging work together?
                            // I can't just restore the cache because when new data is loaded,
                            // I would have to merge/de-dupe with what I already have.
                            // For now I will take the simpler approach and simply not cache it
            loadingComplete: false,
            loadingError: undefined,
            nextPageToLoad: 1,
        };
    }

    public componentDidMount() {
        this.fetchNextActivities();
    }

    public render() {
        const items = this.state.loadingComplete
            ? this.state.activities
            : [...this.state.activities, null];
        return (
            <div>
                <List
                    items={items}
                    className={'activities-list_detailsListContainer'}
                    onRenderCell={this.renderRow}
                />
                <ActivityDialog
                    visible={!!this.state.activeActivity}
                    onDismiss={this.onDialogDismiss}
                    activity={this.state.activeActivity}
                />
            </div>
        );
    }

    private onDialogDismiss = () => {
        this.setState({ activeActivity: undefined });
    }

    private onActivityClicked = (activity: ISummaryActivity): void => {
        this.setState({ activeActivity: activity });
    }

    private renderRow = (item: any, index: number, isScrolling: boolean): JSX.Element | null => {
        if (item) {
            return this.renderActivitiesItem(item);
        } else if (this.loading){
            return this.renderLoadingSpinner();
        } else if (this.state.loadingError) {
            return this.renderErrorLoadingRowsButton();
        } else if (!this.state.loadingComplete) {
            return this.renderLoadMoreButton();
        } else {
            return null;
        }
    }

    private renderActivitiesItem = (item: ISummaryActivity) => {
        return <ActivitiesItem activity={item} onInvoked={this.onActivityClicked} />
    }

    private renderLoadingSpinner = () => {
        return <Card><Spinner label={"Fetching activities..."} /></Card>;
    }

    private renderErrorLoadingRowsButton = () => {
        const errorButtonOnClick = () => {
            this.setState({
                loadingError: null
            }, this.fetchNextActivities);
        };

        return (
            <Card>
                <p>An error occurred fetching activities.</p>
                <PrimaryButton onClick={errorButtonOnClick}>Try Again</PrimaryButton>
            </Card>
        )
    }

    private renderLoadMoreButton = () => {
        return <PrimaryButton className={'activities-list_load-more-button'} onClick={this.fetchNextActivities}>Load More</PrimaryButton>
    }

    private fetchNextActivities = (): Promise<void> => {
        if (this.loading || this.state.loadingError) {
            // tslint:disable-next-line
            console.log('NOT fetching activities');
            return Promise.resolve();
        }

        this.loading = true;

        // tslint:disable-next-line
        console.log('Fetching activities');
        return this.props.strava.activitiesApi.getLoggedInAthleteActivities(
            this.now, /* before */
            undefined, /* after */
            this.state.nextPageToLoad, /* page */
            this.props.itemsPerPage, /* perPage */
            undefined, /* options: none */
        ).then(activities => {
            let state: IActivitiesListState = this.state;
            if (activities.length > 0) {
                // tslint:disable-next-line
                console.log('Loaded activities')
                state = {
                    ...state,
                    activities: this.state.activities.concat(activities),
                    nextPageToLoad: this.state.nextPageToLoad + 1,
                };
            } else {
                // tslint:disable-next-line
                console.log('Loading complete')
                state = {
                    ...state,
                    loadingComplete: true,
                };
            }

            this.setState(state, () => { this.loading = false });
        }).catch(error => {
            this.setState({
                loadingError: error,
            }, () => this.loading = false );
        });
    }
}