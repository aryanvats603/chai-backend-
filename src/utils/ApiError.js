class ApiError extends Error {
    constructor(
        statusCode,
        message= "Something went wrong",
        errors = [],
        stack = ""
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false;
        this.errors = errors

        if (stack) {
            this.stack = stack
        } else{
            Error.captureStackTrace(this, this.constructor)
        }

    }
}

export {ApiError}





// This code defines a class ApiError that extends the built-in Error class in JavaScript. The ApiError class is designed to represent errors that occur in an API context, providing additional properties to handle error responses more effectively.

// Let's break down the code and its functionality:


// Class Definition:

// ApiError is defined as a class that extends the built-in Error class in JavaScript. This means ApiError inherits properties and methods from Error.
// Constructor Method:

// The constructor method is called when an instance of ApiError is created.
// It accepts four parameters: statusCode, message, errors, and stack. All of these parameters have default values.
// Inside the constructor:
// super(message) calls the constructor of the Error class and passes the message parameter to it, setting the error message.
// this.statusCode assigns the provided statusCode to the statusCode property of the ApiError instance.
// this.data, this.message, this.success, and this.errors are additional properties specific to ApiError. These properties are set to provide more context about the error.
// Error.captureStackTrace(this, this.constructor) captures the stack trace of the error. If a stack parameter is provided, it sets the stack property of the instance; otherwise, it captures the stack trace.
// Export Statement:

// The ApiError class is exported to make it accessible outside of this module.
// In summary, ApiError is a custom error class tailored for API error handling. It allows developers to create error instances with specific properties such as status code, message, and errors array, which can be useful for generating consistent and informative error responses in an API environment. This class inherits behavior from the standard Error class and adds additional properties and customization options.



