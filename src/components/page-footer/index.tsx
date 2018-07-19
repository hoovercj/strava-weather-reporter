import { Dialog, Link } from 'office-ui-fabric-react';
import * as React from 'react';

import poweredByDarkSky from 'src/assets/powered_by_dark_sky_light.png';
import poweredByStrava from 'src/assets/powered_by_strava_stacked_light.svg';
import { ImageButton } from 'src/components/image-button';
import { IAppInfo } from 'src/models/copyright-info'

import './index.css';

export interface IPageFooterProps {
    applicationInfo: IAppInfo;
}

export class PageFooter extends React.Component<IPageFooterProps> {
    public render() {
        const {
            applicationName,
            contactEmail,
            copyrightName,
            copyrightUrl,
            githubUrl
        } = this.props.applicationInfo;
        return (
            <div className={'page-footer_container'}>
                <div className={'page-footer_column page-footer_column_left'}>
                    <p>{'©\u00a02018 '}<Link href={copyrightUrl}>{copyrightName.replace(' ', '\u00a0')}</Link></p>
                </div>
                <div className={'page-footer_column page-footer_column_center'}>
                    <Link className={'page-footer_link'} href={`mailto:${contactEmail}?subject=About ${applicationName}`}>Contact</Link>
                    <span className={'page-footer_separator'}>|</span>
                    {/* <Link className={'page-footer_link'} onClick={this.renderPrivacyPolicy}>Privacy Policy</Link>
                    <span className={'page-footer_separator'}>|</span> */}
                    <Link className={'page-footer_link'} href={githubUrl}>Github</Link>
                </div>
                <div className={'page-footer_column page-footer_column_right'}>
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

    public renderPrivacyPolicy = () => {
        return <Dialog
            dialogContentProps={{
                title: 'Privacy Policy',
            }}
        />
    }
}