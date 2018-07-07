import { List } from 'office-ui-fabric-react';
import * as React from 'react';
import { ActivitiesItem } from 'src/components/activities-item';
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
            <ActivitiesItem
                activity={activity}
                strava={this.props.strava}
            />
            // <div>
            //     { activity.start_date_local &&
            //         <p>
            //             <span>Date: {activity.start_date_local}</span>
            //         </p>
            //     }
            //     <p>
            //         <span>Name: {activity.name}</span>
            //     </p>
            //     <p>
            //         <span>Distance: {activity.distance}</span>
            //     </p>
            //     { activity.average_speed &&
            //         <p>
            //             <span>Speed: {activity.average_speed}</span>
            //         </p>
            //     }
            //     { activity.moving_time &&
            //         <p>
            //             <span>Time: {activity.moving_time}</span>
            //         </p>
            //     }
            //     <hr/>
            // </div>
        )
    }
}