import {
    List,
    MessageBar,
    MessageBarType,
    Spinner,
} from 'office-ui-fabric-react';
import * as React from 'react';
import  { ActivitiesItem } from 'src/components/activities-item';
import  { ActivityDialog } from 'src/components/activity-dialog';
import  { Card } from 'src/components/card';
import { LoadingOverlay } from 'src/components/loading-overlay';
import { ThemedButton } from 'src/components/themed-button';
import { SummaryActivity } from 'src/lib/strava';
import {
    IStrava,
    ISummaryActivity,
    ISummaryActivityWithDescription,
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
    itemsPerPage: number;
}

export interface ISummaryActivityWithDescription extends ISummaryActivity {
    description: string;
}

export interface IActivitiesListState {
    loadingActivity?: ISummaryActivity;
    activeActivity?: ISummaryActivityWithDescription;
    activities: ISummaryActivity[];
    nextPageToLoad: number;
    loadingState: LoadingState;
    error?: string;
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
        return (
            <div>
                {this.renderPageError()}
                {this.renderActivitiesList()}
                {this.renderLoadingActivityOverlay()}
                {this.renderActivityDialog()}
            </div>
        );
    }

    private renderPageError = () => {
        const onDismiss = () => {
            this.setState({ error: undefined });
        }

        return !this.state.error ? null : (
            <MessageBar
                messageBarType={MessageBarType.error}
                className={'activities-list_message-bar'}
                onDismiss={onDismiss}
            >
                {this.state.error}
            </MessageBar>
        )
    }

    private renderActivitiesList = () => {
        const items = this.state.loadingState === LoadingState.Complete
            ? this.state.activities
            : [...this.state.activities, null];

        return (
            <List
                items={items}
                className={'activities-list_detailsListContainer'}
                onRenderCell={this.renderRow}
            />
        );
    }

    private isLoadingActivityDescription = (): boolean => {
        return !!this.state.loadingActivity;
    }

    private isLoadingActivities = (): boolean => {
        return this.state.loadingState === LoadingState.Loading;
    }

    private onDialogDismiss = () => {
        return Promise.resolve(this.setState({ activeActivity: undefined }));
    }

    private onDialogApprove = async (activity: ISummaryActivityWithDescription) => {
        // No activity to update. Easy!
        if (!activity || !activity.id) {
            return;
        }

        // Don't update the activity if it has changed
        // to avoid updating the wrong one
        if (this.state.activeActivity !== activity) {
            return;
        }

        try {
            await this.props.strava.updateDescriptionForActivity(String(activity.id));
        } catch {
            // TODO: logging
            this.setState({ error: 'Unable to update the activity.'})
        }
        return Promise.resolve(this.setState({ activeActivity: undefined }));
    }

    private onActivityClicked = (activity: ISummaryActivity) => {
        // Don't try to load multiple activities
        if (this.isLoadingActivityDescription()) {
            return;
        }

        // Can't load an activity if it doesn't have the right information
        if (!activity.id) {
            return;
        }

        this.setState({ loadingActivity: activity }, () => this.fetchActivityDescription(activity))
    }

    private fetchActivityDescription = async (activity: SummaryActivity) => {
        try {
            const description = await this.props.strava.getDescriptionForActivity(String(activity.id));

            // Somehow the loading activity is not the one that this function
            // was asked to load, so abandon this request
            if (this.state.loadingActivity !== activity) {
                return;
            }

            const activeActivity: ISummaryActivityWithDescription | undefined = description
            ? { ...activity, description }
            : undefined;

            this.setState({
                activeActivity,
                loadingActivity: undefined,
            });
        } catch {
            // TODO: logging
            this.setState({
                error: 'Unable to load activity information.',
                loadingActivity: undefined,
            });
        }
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

    private renderLoadingActivityOverlay = () => {
        if (!this.state.loadingActivity) {
            return;
        }

        return (
            <LoadingOverlay
                onClick={this.onCancelLoadingActivity}
            />
        )
    }

    private onCancelLoadingActivity = () => {
        if (this.state.loadingActivity) {
            this.setState({ loadingActivity: undefined });
        }
    }

    private renderActivityDialog = () => {
        const activity = this.state.activeActivity;

        if (!activity) {
            return null;
        }

        return (
            <ActivityDialog
                visible={!!activity}
                onDismiss={this.onDialogDismiss}
                onApprove={this.onDialogApprove}
                activity={activity}
            />
        )
    }

    private fetchNextActivities = (): void => {
        if (this.isLoadingActivities()) {
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
            this.props.itemsPerPage, /* perPage */
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