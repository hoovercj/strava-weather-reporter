// tslint:disable
import { Link } from 'office-ui-fabric-react';
import * as React from 'react';
import { IActivityStatistic } from 'src/components/activity-statistic';
import { StatisticGroup } from 'src/components/statistic-group';
import { ISummaryActivity } from 'src/services/strava/strava';
import {
    distanceInMetersToMileString,
    durationInSecondsToString,
    metersPerSecondToMinutesPerMileString
} from 'src/utils/string-utils';
import './index.css';

import { Card } from 'src/components/card';

export interface IActivitiesItemProps {
    activity: ISummaryActivity;
    onInvoked?: (activity: ISummaryActivity) => void;
}

// TODO: Get key at build time, swap keys for dev and production mode
// See: https://medium.com/@benjiekibblewhite/dirt-simple-environment-variables-with-create-react-app-and-github-pages-1d9297df820d
const GOOGLE_MAPS_API_KEY = 'AIzaSyAHXg5j04AT63ZKCYHeJVp1yrF3CoiiZ2I';

export class ActivitiesItem extends React.Component<IActivitiesItemProps> {
    public render() {
        const activity = this.props.activity;

        const date = activity.start_date_local && new Date(activity.start_date_local).toDateString();
        const name = this.props.activity.name;

        const stats: IActivityStatistic[] = [{
            name: 'Distance',
            value: activity.distance && distanceInMetersToMileString(activity.distance) || '',
        },{
            name: 'Pace',
            value: activity.average_speed && metersPerSecondToMinutesPerMileString(activity.average_speed) || '',
        },{
            name: 'Time',
            value: activity.elapsed_time && durationInSecondsToString(activity.elapsed_time) || '',
        }]

        const map = activity.map && activity.map.summary_polyline;

        return (
            <Card>
                <div className={'activity-item_container'}>
                    <div className={'activity-item_header-wrapper'}>
                        { /* Use color: #007FB6; for hover, otherwise normal color */ }
                        <Link onClick={this.onInvoked} className={'activity-item_name'}>{name}</Link>
                        <div className={'activity-item_date'}>{date}</div>
                        <StatisticGroup statistics={stats} />
                    </div>
                    <div className={'activity-item_map-wrapper'}>
                        { map &&
                            <img className={'activity-item_map'} src={`http://maps.googleapis.com/maps/api/staticmap?sensor=false&size=300x200&path=weight:3%7Ccolor:red%7Cenc:${map}&key=${GOOGLE_MAPS_API_KEY}`} />
                        }
                    </div>
                </div>
            </Card>
        );
    }

    private onInvoked = () => {
        this.props.onInvoked && this.props.onInvoked(this.props.activity);
    }
}