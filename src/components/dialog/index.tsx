import {
    Dialog as FabricDialog,
    DialogFooter,
    DialogType,
} from 'office-ui-fabric-react';
import * as React from 'react';

import { ThemedButton } from 'src/components/themed-button';
import { ICancelablePromise, makeCancelable } from 'src/utils/promise-utils';

export interface IDialogProps {
    onApprove?: () => Promise<void>
    onDismiss: () => Promise<void>;
    renderContent: () => JSX.Element;
    approveButtonText?: string;
    dismissButtonText: string;
}

export interface IDialogState {
    busy: boolean;
}

export abstract class Dialog extends React.Component<IDialogProps, IDialogState> {
    private cancelables: ICancelablePromise[] = [];

    constructor(props: IDialogProps) {
        super(props);
        this.state = {
            busy: false,
        }
    }

    public componentWillUnmount() {
        this.cancelables.forEach(cancelable => cancelable.cancel())
    }

    public render() {
        return (
            <FabricDialog
                closeButtonAriaLabel={'Cancel and close'}
                hidden={false}
                dialogContentProps={{
                    type: DialogType.normal,
                }}
                onDismiss={this.props.onDismiss}
                modalProps={{
                    isDarkOverlay: true,
                }}
            >
                {this.props.renderContent()}
                <DialogFooter>
                    { this.props.onApprove &&
                        <ThemedButton disabled={this.state.busy} primary={true} onClick={this.onApproveButtonClicked} text={this.props.approveButtonText} />
                    }
                    <ThemedButton disabled={this.state.busy} onClick={this.onDismissButtonClicked} text={this.props.dismissButtonText} />
                </DialogFooter>
            </FabricDialog>
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

    private onApproveButtonClickedCore = async () => {
        const promise = (this.props.onApprove && this.props.onApprove()) || Promise.resolve()
        this.onDialogButtonClickedCore(promise);
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
}