import * as React from 'react';
import './index.css';

export interface IActivityStatistic {
    name: string;
    value: string;
}

export interface IActivityStatisticProps {
    stat: IActivityStatistic;
}

export class ActivityStatistic extends React.Component<IActivityStatisticProps, {}> {

    public render() {
        return (
            <div className={'activity-statistic_container'}>
                <div className={'activity-statistic_name'}>
                    {this.props.stat.name}
                </div>
                <b className={'activity-statistic_value'}>
                    {this.props.stat.value}
                </b>
            </div>
        );
    }
}