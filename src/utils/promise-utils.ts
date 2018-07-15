export interface ICancelablePromise {
    promise: Promise<any>,
    cancel: () => void;
}

// Defined by @istarkov here (as of 7.15.2018):
// https://github.com/facebook/react/issues/5465#issuecomment-157888325
export const makeCancelable = (promise: Promise<any>) => {
    let hasCanceled_ = false;

    const wrappedPromise = new Promise((resolve, reject) => {
        promise.then((val) =>
            hasCanceled_ ? reject({ isCanceled: true }) : resolve(val)
        );
        promise.catch((error) =>
            hasCanceled_ ? reject({ isCanceled: true }) : reject(error)
        );
    });

    return {
        promise: wrappedPromise,
        cancel() {
            hasCanceled_ = true;
        },
    };
};
