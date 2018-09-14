// tslint:disable
import { Link, Icon } from 'office-ui-fabric-react';
import * as React from 'react';
import { IActivityStatistic } from 'src/components/activity-statistic';
import { StatisticGroup } from 'src/components/statistic-group';
import { DistanceUnits, ISummaryActivity } from 'src/services/strava/strava';
import {
    distanceInMetersToDisplayString,
    durationInSecondsToString,
    metersPerSecondToDisplayString,
    dateToDateTimeString,
} from 'src/utils/string-utils';
import './index.css';

import { Card } from 'src/components/card';

export interface IActivitiesItemProps {
    units: DistanceUnits;
    activity: ISummaryActivity;
    processed?: boolean;
    onInvoked?: (activity: ISummaryActivity) => void;
}

export class ActivitiesItem extends React.Component<IActivitiesItemProps> {


    public render() {
        const activity = this.props.activity;

        // start_date_local has the local time but doesn't include the time zone (i.e. 17:00)
        // start_date has the UTC time
        // using `new Date(activity.start_date)` will let the browser convert the utc date
        // to a time local to the users browser. If they did an activity in a different time zone
        // than they are currently viewing the site in, the time will be wrong, but that is
        // behavior that I consider acceptable for now.
        const date = activity.start_date && dateToDateTimeString(new Date(activity.start_date));
        const name = this.props.activity.name;

        const stats: IActivityStatistic[] = [{
            name: 'Distance',
            value: activity.distance && distanceInMetersToDisplayString(activity.distance, this.props.units) || '',
        },{
            name: 'Pace',
            value: activity.average_speed && metersPerSecondToDisplayString(activity.average_speed, this.props.units) || '',
        },{
            name: 'Time',
            value: activity.elapsed_time && durationInSecondsToString(activity.elapsed_time) || '',
        }]

        const map = activity.map && activity.map.summary_polyline;

        return (
            <Card>
                <div className={'activity-item_container'}>
                    <div className={'activity-item_header-wrapper'}>
                        <Link
                            onClick={this.onInvoked}
                            className={'activity-item_name'}
                        >
                            {name}{this.props.processed ?
                                 <Icon ariaLabel='Updated' iconName='CompletedSolid' className='activity-item_name_icon color_theme-primary' /> :
                                 <Icon ariaLabel='Update description' iconName='CommentAdd' className='activity-item_name_icon activity-item_name_icon_add'/>}
                        </Link>
                        <div className={'activity-item_date'}>{date}</div>
                        <StatisticGroup statistics={stats} />
                    </div>
                    <div className={'activity-item_map-wrapper'}>
                        { map &&
                            // Consider lifting this key to a prop
                            <img alt={`Map of route for activity "${name}"`} className={'activity-item_map'} src={`http://maps.googleapis.com/maps/api/staticmap?sensor=false&size=300x200&path=weight:3%7Ccolor:red%7Cenc:${map}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`} />
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