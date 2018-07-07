import { List } from 'office-ui-fabric-react';
import * as React from 'react';
import { IStrava, ISummaryActivity } from 'src/services/strava/strava';

export interface IActivitiesListProps {
    strava: IStrava
}

export interface IActivitiesListState {
    activities: ISummaryActivity[];
}

export class ActivitiesList extends React.Component<IActivitiesListProps, IActivitiesListState> {
    constructor(props: IActivitiesListProps) {
        super(props);

        this.state = {
            activities: this.props.strava.cachedUserActivities()
        };
    }

    public componentDidMount() {
        this.props.strava.fetchUserActivities()
            .then(activities => this.setState({
                ...this.state,
                activities
            }));
    }

    public render() {
        return (
            <List
                items={this.state.activities}
                onRenderCell={this.renderActivity}
            />
        );
    }

    private renderActivity = (activity: ISummaryActivity): JSX.Element => {
        return (
            <div>
                { activity.startDateLocal &&
                    <p>
                        <span>Date: {activity.startDateLocal}</span>
                    </p>
                }
                <p>
                    <span>Name: {activity.name}</span>
                </p>
                <p>
                    <span>Distance: {activity.distance}</span>
                </p>
                { activity.averageSpeed &&
                    <p>
                        <span>Speed: {activity.averageSpeed}</span>
                    </p>
                }
                { activity.movingTime &&
                    <p>
                        <span>Time: {activity.movingTime}</span>
                    </p>
                }
                <hr/>
            </div>
        )
    }
}