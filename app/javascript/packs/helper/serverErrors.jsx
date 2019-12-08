const serverErrors = {
  400: 'Bad request!',
  404: 'Not found!',
  500: 'Something went wrong!'
}

export default function getErrorText(error) {
  return error.response
    ? serverErrors[error.response.headers['x-code-error']] ||
        serverErrors[error.response.status] ||
        error.message
    : 'Server error'
}
