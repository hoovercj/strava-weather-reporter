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
import {
    ISummaryActivityWithDescription,
    Strava,
} from 'src/services/strava/strava';
import { ICancelablePromise, makeCancelable } from 'src/utils/promise-utils';

export interface IActivityDialogProps {
    visible: boolean;
    onApprove: (activity: ISummaryActivityWithDescription) => Promise<void>;
    onDismiss: () => Promise<void>;
    activity: ISummaryActivityWithDescription;
}

export interface IActivityDialogState {
    busy: boolean;
}

export class ActivityDialog extends React.Component<IActivityDialogProps, IActivityDialogState> {

    private cancelables: ICancelablePromise[] = [];

    constructor(props: IActivityDialogProps) {
        super(props);
        this.state = { busy: false }
    }

    public componentWillUnmount() {
        this.cancelables.forEach(cancelable => cancelable.cancel());
    }

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
                    value={this.props.activity.description}
                    multiline={true}
                    aria-labelledby={titleId}
                />
                <DialogFooter>
                    <ThemedButton disabled={this.state.busy} primary={true} onClick={this.onApproveButtonClicked} text="Update description" />
                    <ThemedButton disabled={this.state.busy} onClick={this.onDismissButtonClicked} text="Cancel" />
                </DialogFooter>
            </Dialog>
        )
    }

    private onDismissButtonClicked = () => {
        // Nothing to do, great!
        if (!this.props.onDismiss) {
            return;
        }

        // Ignore if dialog is already busy
        if (this.state.busy) {
            return;
        }

        this.setState({ busy: true }, this.onDismissButtonClickedCore);
    }

    private onDialogButtonClickedCore = (promise: Promise<any>) => {
        const cancelablePromise = makeCancelable(promise);
        this.cancelables.push(cancelablePromise);
        cancelablePromise.promise
            .then(() => {
                this.cancelables.splice(this.cancelables.indexOf(cancelablePromise), 1);
                if (this.state.busy) {
                    this.setState({ busy: false });
                }
            }).catch(error => null);
    }

    private onDismissButtonClickedCore = async () => {
        this.onDialogButtonClickedCore(this.props.onDismiss());
    }

    private onApproveButtonClicked = () => {
        // Nothing to do, great!
        if (!this.props.onApprove) {
            return;
        }

        // Ignore if dialog is already busy
        if (this.state.busy) {
            return;
        }

        this.setState({ busy: true }, this.onApproveButtonClickedCore);
    }

    // TODO: Clicking on buttons can occur after component has unmounted
    // React warns about possible memory leaks
    private onApproveButtonClickedCore = async () => {
        this.onDialogButtonClickedCore(this.props.onApprove(this.props.activity));
    }
}
