export function delay(ms: number) {
    return new Promise<void>((resolve) => {
        setTimeout(resolve, ms);
    });
}

/**
 * wraps a jasmine assertion callback and manage properly the exceptions that occurs
 */
export function on(test: () => Promise<void>) {
    return async (done: () => void) => {
        test().then(() => {
            done();
        }, (error) => {
            fail(error);
        });
    };
}