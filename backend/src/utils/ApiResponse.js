export const apiResponse = ({
  success = true,
  message = "OK",
  data = null,
  meta = undefined,
}) => {
  const payload = { success, message };
  if (data !== null) payload.data = data;
  if (meta !== undefined) payload.meta = meta;
  return payload;
};
