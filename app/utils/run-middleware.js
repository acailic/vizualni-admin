// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
// See https://nextjs.org/docs/api-routes/api-middlewares#connectexpress-middleware-support
export const runMiddleware = (req, res, fn) => {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
};
