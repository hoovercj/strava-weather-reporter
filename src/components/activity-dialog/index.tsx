import {
    Dialog,
    DialogFooter,
    DialogType,
    Link,
    TextField,
} from 'office-ui-fabric-react';
import * as React from 'react';

import './index.css';

import { ThemedButton } from 'src/components/themed-button';
import { SummaryActivity } from 'src/lib/strava';
import { Strava } from 'src/services/strava/strava';

export interface IActivityDialogProps {
    visible: boolean;
    onDismiss: () => void;
    activity?: SummaryActivity;
}

export class ActivityDialog extends React.Component<IActivityDialogProps> {

    public render() {
        if (!this.props.activity) {
            return null;
        }

        const titleId = 'edit-activity-description-dialog-title';

        return (
            <Dialog
                dialogContentProps={{
                    type: DialogType.normal,
                }}
                hidden={!this.props.visible}
                onDismiss={this.props.onDismiss}
                modalProps={{
                    className: 'activity-dialog_classname',
                    containerClassName: 'activity-dialog_container-classname',
                    isDarkOverlay: true,
                }}
            >
                {/* TODO: ensure that this is read by a screenreader when opening the dialog */}
                <h1 className={'activity-dialog_title'} id={titleId}>Edit Activity Description</h1>
                <p>
                    Update description to the content below for activity <Link href={Strava.getUrlForActivity(this.props.activity.id || '') } >{this.props.activity.name}</Link>
                </p>
                <TextField
                    readOnly={true}
                    value={'New description here'}
                    multiline={true}
                    aria-labelledby={titleId}
                />
                <DialogFooter>
                    <ThemedButton primary={true} onClick={this.props.onDismiss} text="Update description" />
                    <ThemedButton onClick={this.props.onDismiss} text="Cancel" />
                </DialogFooter>
            </Dialog>
        )
    }
}
