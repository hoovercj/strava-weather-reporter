import {
    Button,
    ConstrainMode,
    DetailsList,
    DetailsListLayoutMode,
    IDetailsRowProps,
    SelectionMode,
    Spinner,
} from 'office-ui-fabric-react';
import * as React from 'react';
import  { ActivitiesItem } from 'src/components/activities-item';
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
            <DetailsList
                isHeaderVisible={false}
                enableShimmer={true}
                selectionMode={SelectionMode.none}
                constrainMode={ConstrainMode.horizontalConstrained}
                layoutMode={DetailsListLayoutMode.justified}
                items={items}
                className={'activities-list_detailsListContainer'}
                onRenderRow={this.renderRow}
                onRenderMissingItem={this.onRenderMissingItem}
            />
        );
    }

    private onRenderMissingItem = (index?: number | undefined, rowProps?: IDetailsRowProps | undefined) => {
        // TODO: Fetch more rows
        this.fetchNextActivities();

        const errorButtonOnClick = () => {
            this.setState({
                loadingError: null
            });
        };

        if (this.state.loadingError) {
            return (
                <Card>
                    <p>An error occurred loading more rows.</p>
                    <Button onClick={errorButtonOnClick}>Try Again</Button>
                </Card>
            )
        } else {
            return <Card><Spinner label={"Loading more activities..."} /></Card>;
        }

    }

    private renderRow = (props: IDetailsRowProps): JSX.Element => {
        return <ActivitiesItem
            activity={props.item}
        />
    }



    private fetchNextActivities = (): Promise<void> => {
        if (this.loading || this.state.loadingError) {
            // tslint:disable-next-line
            console.log('NOT fetching activities');
            return Promise.resolve();
        }

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