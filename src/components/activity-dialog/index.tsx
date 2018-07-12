import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogType
} from 'office-ui-fabric-react';
import * as React from 'react';

import { SummaryActivity } from 'src/lib/strava';

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
                type={DialogType.normal}
                hidden={!this.props.visible}
                onDismiss={this.props.onDismiss}
                title={`Edit Activity Description`}
                >
                <DialogContent>
                    <h1>{this.props.activity.name}</h1>
                </DialogContent>
                <DialogFooter/>
            </Dialog>
        )
    }
}
