import * as React from 'react';
import './index.css';

import {
    ActivityStatistic,
    IActivityStatistic
} from 'src/components/activity-statistic';

export interface IStatisticGroupProps {
    statistics: IActivityStatistic[];
}

export class StatisticGroup extends React.Component<IStatisticGroupProps> {

    public render() {
        return (
            <div className={'statistic-group_container'}>
                {this.renderStatistics()}
            </div>
        );
    }

    private renderStatistics = () => {
        const statCount = this.props.statistics.length;
        const showBorder = (index: number) => index < (statCount - 1);
        return this.props.statistics.map((stat, index) => this.renderStatistic(stat, showBorder(index)));
    }

    private renderStatistic = (stat: IActivityStatistic, showBorder: boolean = true) => {
        return (
            <div key={stat.name} className={'statistic-group_stat-wrapper'}>
                <div className={'statistic-group_stat'}>
                    <ActivityStatistic stat={stat} />
                </div>
                {showBorder && <div className={'statistic-group_separator'}>{/*nothing*/}</div>}
            </div>
        )
    }
}