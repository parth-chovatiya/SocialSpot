// send the custom responce
exports.sendResponce = ({
  ctx,
  statusCode,
  message,
  error,
  token,
  ...data
}) => {
  ctx.status = statusCode;
  ctx.body = {
    statusCode,
    message,
    error,
    ...data,
    token,
  };
};
