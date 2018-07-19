import * as React from 'react';

export class PrivacyPolicyPage extends React.Component {
    public render() {
        return (
            <div>
                <h1>Privacy Policy</h1>
                <p>It is important to us that you fully understand what information we collect and how it is used by us.</p>

                <h2>What personal information do we collect from you?</h2>
                <p>We don't collect personal information.</p>

                <p>We leave Strava data on Strava servers and only store the additional information needed to operate the service:</p>
                <li>Non-personal information necessary to communicate with Strava on your behalf</li>
                <li>Weather reports generated for your activities</li>
                <li>User settings</li>

                <h2>Cookies</h2>
                <p>We do not use cookies.</p>

                <h2>Third-party disclosure</h2>
                <p>We do not sell, trade, or otherwise transfer to outside parties any information about you.</p>

                <h2>Contacting Us</h2>
                <p>If there are any questions regarding this privacy policy, you may contact us at stravaweather@codyhoover.com</p>
                <br/>
                <p>Last Edited on 19-07-2018</p>
            </div>
        )
    }
}