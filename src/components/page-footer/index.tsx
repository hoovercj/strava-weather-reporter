import { Link } from 'office-ui-fabric-react';
import * as React from 'react';

import poweredByDarkSky from 'src/assets/powered_by_dark_sky_light.png';
import poweredByStrava from 'src/assets/powered_by_strava_stacked_light.svg';
import { ImageButton } from 'src/components/image-button';
import { ICopyrightInfo } from 'src/models/copyright-info'

import './index.css';

export interface IPageFooterProps {
    copyrightInfo: ICopyrightInfo;
}

export class PageFooter extends React.Component<IPageFooterProps> {
    public render() {
        return (
            <div className={'page-footer_container'}>
                <div className={'page-footer_column'}>
                    {'© 2018\u00a0'}<Link href={this.props.copyrightInfo.url}>{this.props.copyrightInfo.name}</Link>
                </div>
                <div className={'page-footer_column'}>
                    <ImageButton
                        className={'page-footer_image-button_powered-by'}
                        href={'https://www.strava.com'}
                        aria-label={'Powered by Strava'}
                        src={poweredByStrava}
                        rel="noopener noreferrer"
                        target="_blank"
                    />
                    <ImageButton
                        className={'page-footer_image-button_powered-by'}
                        href={'https://darksky.net/poweredby/'}
                        aria-label={'Powered by Dark Sky'}
                        src={poweredByDarkSky}
                        rel="noopener noreferrer"
                        target="_blank"
                    />
                </div>
            </div>
        )
    }
}