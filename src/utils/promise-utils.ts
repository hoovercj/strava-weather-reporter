export interface ICancelablePromise {
    promise: Promise<any>,
    cancel: () => void;
}

export const makeCancelable = (promise: Promise<any>): ICancelablePromise => {
    let hasCanceled_ = false;
    const promise_ = promise;

    const wrappedPromise = new Promise((resolve, reject) => {
        promise_.then(
            val => hasCanceled_ ? reject({ isCanceled: true }) : resolve(val),
            error => hasCanceled_ ? reject({ isCanceled: true }) : reject(error)
        );
    });

    return {
        promise: wrappedPromise,
        cancel() {
            hasCanceled_ = true;
        },
    };
};
