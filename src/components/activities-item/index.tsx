import * as React from 'react';
import { IStrava, ISummaryActivity } from 'src/services/strava/strava';
import {
    distanceInMetersToMileString,
    durationInSecondsToString,
    metersPerSecondToMinutesPerMileString
} from 'src/utils/string-utils';
import './index.css';

export interface IActivitiesItemProps {
    strava: IStrava;
    activity: ISummaryActivity;
}

export interface IActivitiesItemState {
    activities: ISummaryActivity[];
}

export class ActivitiesItem extends React.Component<IActivitiesItemProps, IActivitiesItemState> {
    public render() {
        const classnameBase = 'activity-item_';
        const nameClassname = `${classnameBase}name`;
        const timeClassname = `${classnameBase}time`;
        const statClassname = `${classnameBase}stat`;

        const activity = this.props.activity;

        const date = activity.start_date_local && new Date(activity.start_date_local).toDateString();
        const distance = activity.distance && distanceInMetersToMileString(activity.distance);
        const pace = activity.average_speed && metersPerSecondToMinutesPerMileString(activity.average_speed);
        const time = activity.elapsed_time && durationInSecondsToString(activity.elapsed_time);

        return (
            <div>
                { date &&
                    <p>
                        <span className={timeClassname}>Date: {date}</span>
                    </p>
                }
                <p>
                    <span className={nameClassname}>Name: {activity.name}</span>
                </p>
                <p>
                    { distance &&
                        <span className={statClassname}>Distance: {distance}</span>
                    }
                    { pace &&
                        <span className={statClassname}>Speed: {pace}</span>
                    }
                    { time &&
                        <span className={statClassname}>Time: {time}</span>
                    }
                </p>

                <hr/>
            </div>
        )
    }
}