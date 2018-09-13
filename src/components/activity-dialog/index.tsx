import {
    Link,
    TextField,
} from 'office-ui-fabric-react';
import * as React from 'react';

import { Dialog } from 'src/components/dialog';
import {
    ISummaryActivityWithDescription,
    Strava,
} from 'src/services/strava/strava';

import './index.css';

export interface IActivityDialogProps {
    activity: ISummaryActivityWithDescription;
    onApprove: (activity: ISummaryActivityWithDescription) => Promise<void>;
    onDismiss: () => Promise<void>;
    processed?: boolean;
}

export class ActivityDialog extends React.Component<IActivityDialogProps> {
    constructor(props: IActivityDialogProps) {
        super(props);
    }

    public render() {
        if (this.props.processed) {
            return (
                <Dialog
                    onDismiss={this.props.onDismiss}
                    renderContent={this.renderViewContent}
                    dismissButtonText='Close'
                />
            );
        } else {
            return (
                <Dialog
                    onApprove={this.onApprove}
                    onDismiss={this.props.onDismiss}
                    renderContent={this.renderEditContent}
                    approveButtonText='Update description'
                    dismissButtonText='Cancel'
                />
            );
        }
    }

    private renderViewContent = (): JSX.Element => {
        const titleId = 'edit-activity-description-dialog-title';

        return (
            <React.Fragment>
                {/* TODO: ensure that this is read by a screenreader when opening the dialog */}
                <h1 className={'activity-dialog_title'} id={titleId}>View Activity Description</h1>
                <p>
                    The description was previously set to the content below for activity {this.renderActivityLink()}
                </p>
                <TextField
                    readOnly={true}
                    value={this.props.activity.description}
                    multiline={true}
                    aria-labelledby={titleId}
                    rows={5}
                />
            </React.Fragment>
        );
    }

    private renderEditContent = (): JSX.Element => {
        const titleId = 'edit-activity-description-dialog-title';

        return (
            <React.Fragment>
                {/* TODO: ensure that this is read by a screenreader when opening the dialog */}
                <h1 className={'activity-dialog_title'} id={titleId}>Edit Activity Description</h1>
                <p>
                    Update description to the content below for activity {this.renderActivityLink()}
                </p>
                <TextField
                    readOnly={true}
                    value={this.props.activity.description}
                    multiline={true}
                    aria-labelledby={titleId}
                />
            </React.Fragment>

        )
    }

    private renderActivityLink = () => {
        return (
            <Link
                href={Strava.getUrlForActivity(this.props.activity.id || '') }
                rel="noopener noreferrer"
                target="_blank"
            >
                {this.props.activity.name}
            </Link>
        )
    }

    private onApprove = (): Promise<void> => {
        return this.props.onApprove(this.props.activity);
    }
 }
