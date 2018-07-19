import * as React from 'react';

import 'src/styles/colors.css';
import './index.css';

import connectWithStravaImage from 'src/assets/connect_with_strava_orange.svg';
import { ImageButton } from 'src/components/image-button';
import { IPageProps, Page } from 'src/pages/page';
import { IStrava } from 'src/services/strava/strava';

export interface ILandingProps extends IPageProps {
    strava: IStrava;
}

export class LandingPage extends Page<ILandingProps> { 
    protected renderHeader() {
        return ([
            <h1 key='title' className='landing_header_title'>{this.props.applicationInfo.applicationName}</h1>,
            <sub key='sub' className='landing_header_sub'>Quickly and easily add weather information to activity descriptions.</sub>
        ])
    }
    
    protected renderContent() {
        return ([
            <p key='big' className='landing_body_text landing_body_text-big'>Rain or shine, hot or cold, you're out there.</p>,
            <p key='small' className='landing_body_text landing_body_text-small'>Click the button below to get started.</p>,
            <ImageButton
                className={'app_header_sign-in-link'}
                key={'page-sign-in'}
                aria-label={'Connect with Strava'}
                onClick={this.props.strava.redirectToStravaAuthorizationPage}
                src={connectWithStravaImage}
            />
        ]);
    }

    protected headerClass() {
        return `${super.headerClass()} landing_header background-color_theme-primary`;
    }

    protected contentClass() {
        return `${super.contentClass()} landing_body`;
    }
}