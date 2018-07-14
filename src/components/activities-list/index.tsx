import {
    List,
    Spinner,
} from 'office-ui-fabric-react';
import * as React from 'react';
import  { ActivitiesItem } from 'src/components/activities-item';
import  { ActivityDialog } from 'src/components/activity-dialog';
import  { Card } from 'src/components/card';
import { ThemedButton } from 'src/components/themed-button';
import {
    IStrava,
    ISummaryActivity,
} from 'src/services/strava/strava';

import './index.css';

enum LoadingState {
    Ready,
    Complete,
    Loading,
    Error,
}

export interface IActivitiesListProps {
    strava: IStrava;
    itemsPerPage?: number;
}

export interface IActivitiesListState {
    activeActivity?: ISummaryActivity;
    activities: ISummaryActivity[];
    nextPageToLoad: number;
    loadingState: LoadingState;
}

export class ActivitiesList extends React.Component<IActivitiesListProps, IActivitiesListState> {
    private readonly now = Date.now();

    constructor(props: IActivitiesListProps) {
        super(props);
        this.state = {
            activities: [],
            loadingState: LoadingState.Ready,
            nextPageToLoad: 1,
        };
    }

    public componentDidMount() {
        this.fetchNextActivities();
    }

    public render() {
        const items = this.state.loadingState === LoadingState.Complete
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

    // private isLoadingComplete = () => {
    //     return this.state.loadingState === LoadingState.Complete;
    // }

    // private isLoadingError = () => {
    //     return this.state.loadingState === LoadingState.Error;
    // }

    // private isLoadingReady = () => {
    //     return this.state.loadingState === LoadingState.Ready;
    // }

    private isLoading = () => {
        return this.state.loadingState === LoadingState.Loading;
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
        }

        switch (this.state.loadingState) {
            case LoadingState.Complete:
                return null;
            case LoadingState.Error:
                return this.renderErrorLoadingRowsButton();
            case LoadingState.Ready:
                return this.renderLoadMoreButton();
            case LoadingState.Loading:
                return this.renderLoadingSpinner();
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
                loadingState: LoadingState.Ready
            }, this.fetchNextActivities);
        };

        return (
            <Card>
                <p>An error occurred fetching activities.</p>
                <ThemedButton primary={true} onClick={errorButtonOnClick}>Try Again</ThemedButton>
            </Card>
        )
    }

    private renderLoadMoreButton = () => {
        return <ThemedButton  primary={true} className={'activities-list_load-more-button'} onClick={this.fetchNextActivities}>Load More</ThemedButton>
    }

    private fetchNextActivities = (): void => {
        if (this.isLoading()) {
            return;
        }

        this.setState({
            loadingState: LoadingState.Loading
        }, this.fetchActivitiesCore)
    }

    private fetchActivitiesCore = () => {
        return this.props.strava.activitiesApi.getLoggedInAthleteActivities(
            this.now, /* before */
            undefined, /* after */
            this.state.nextPageToLoad, /* page */
            2, // this.props.itemsPerPage, /* perPage */
            undefined, /* options: none */
        ).then(activities => {
            let state: IActivitiesListState = this.state;
            if (activities.length > 0) {
                state = {
                    ...state,
                    activities: this.state.activities.concat(activities),
                    loadingState: LoadingState.Ready,
                    nextPageToLoad: this.state.nextPageToLoad + 1,
                };
            } else {
                state = {
                    ...state,
                    loadingState: LoadingState.Complete,
                };
            }

            this.setState(state);
        }).catch(error => {
            this.setState({
                loadingState: LoadingState.Error,
            });
        });
    }
}