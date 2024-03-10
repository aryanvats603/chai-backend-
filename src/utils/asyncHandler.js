const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}


export { asyncHandler }
// asyncHandler is a higher-order function that takes a requestHandler function as an argument.
// It returns another function that takes req, res, and next as arguments (typical Express.js middleware signature).
// Inside this function, requestHandler is invoked asynchronously with req, res, and next arguments. The result is wrapped in a Promise using Promise.resolve.
// If the Promise resolves successfully, nothing happens.
// If the Promise rejects (i.e., an error occurs), the error is passed to the next middleware using next(err).



// const asyncHandler = () => {}
// const asyncHandler = (func) => () => {}
// const asyncHandler = (func) => async () => {}


// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }

?