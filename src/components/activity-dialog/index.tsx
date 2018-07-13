import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogType,
    Link,
} from 'office-ui-fabric-react';
import * as React from 'react';

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

        return (
            <Dialog
                type={DialogType.close}
                hidden={!this.props.visible}
                onDismiss={this.props.onDismiss}
                title={`Edit Activity Description`}
                >
                <DialogContent>
                    Update description to the content below for activity <Link href={Strava.getUrlForActivity(this.props.activity.id || '')} >{this.props.activity.name}</Link>
                </DialogContent>
                <DialogContent>
                    New description here.
                </DialogContent>
                <DialogFooter>
                    <ThemedButton primary={true} onClick={this.props.onDismiss} text="Update description" />
                    <ThemedButton onClick={this.props.onDismiss} text="Cancel" />
                </DialogFooter>
            </Dialog>
        )
    }
}
