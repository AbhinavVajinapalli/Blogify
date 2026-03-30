export const createApiResponse = (statusCode, data, message = 'Success') => ({
  statusCode,
  data,
  message,
  success: statusCode < 400,
});

export const successResponse = (res, statusCode, data, message = 'Success') => {
  return res.status(statusCode).json(createApiResponse(statusCode, data, message));
};
