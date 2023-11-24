//////    Response message    //////
export const MSG_LOGIN_SUCCESSFUL = "Logged in successfully";
export const MSG_LOGOUT_SUCCESSFUL = "Successful logout";
export const MSG_REFRESH_TOKEN_SUCCESSFUL = "Refresh token successful";
export const MSG_SENT_MAIL_FORGOT_PASSWORD =
  "Check your email for a link to reset your password. If it doesn’t appear within a few minutes, check your spam folder.";
export const MSG_UPDATE_SUCCESSFUL = "Successful update";
export const MSG_DELETE_SUCCESSFUL = "Successful deletion";
export const MSG_CREATED_SUCCESSFUL = (table) => `"Successfully added ${table}"`;

export const MSG_ADDED_WAGE_SUCCESSFUL = "Added wage for successful a employee";
//////    Error message    //////
export const MSG_TOKEN_DOES_NOT_MATCH = "Token does not match";
export const MSG_INVALID_TOKEN = "Invalid token";
export const MSG_NOT_TOKEN_FOR_AUTH = "You don't have a token for authentication";
export const MSG_REFRESH_TOKEN_DOES_NOT_MATCH = "Refresh Token does not match";
export const MSG_ERROR_CREATE_TOKEN = "Token generation error";
export const MSG_ERROR_NOT_HAVE_PERMISSION = "You do not have permission"

export const MSG_ERROR_DELETE = (obj) => `This ${obj} cannot be deleted`;
export const MSG_ERROR_NOT_FOUND = (obj) => `${obj} not found`;
export const MSG_ERROR_EXISTED = (obj) => `${obj} already exists`;
export const MSG_ERROR_ID_EMPTY = (obj) => `${obj} cannot be empty`;
// AUTH API
export const MSG_ERROR_WRONG_LOGIN_INFORMATION = "Your username/password is incorrect";
export const MSG_EMAIL_ALREADY_EXISTS = "Email is already registered";
export const MSG_ERROR_WRONG_FORGOT_PASS_INFORMATION = "Your username/email is incorrect";
// Leave API
export const MSG_LEAVE_STATUS_NOT_PENDING = "Leave status is not Pending";
// Attendance API
export const MSG_ATTENDANCE_STATUS_NOT_PENDING = "Attendance status is not Pending";

