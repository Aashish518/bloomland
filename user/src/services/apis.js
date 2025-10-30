const API_URL = import.meta.env.VITE_API_URL;

export const authEndpoints = {
	LOGIN: `${API_URL}/auth/login`,
	REGISTER: `${API_URL}/auth/register`,
	SEND_OTP: `${API_URL}/auth/send-otp`,
	UPDATE: `${API_URL}/auth/update`,
	FORGOT_PASS: `${API_URL}/auth/forgot-password`,
	RESET_PASS: `${API_URL}/auth/reset-password`,
	FETCH_USER: `${API_URL}/auth/me`,
	SUBMIT_DETAILS: `${API_URL}/auth/submit-details`,
};

export const eventEndpoints = {
	GET_SINGLE_EVENT: `${API_URL}/event/getSingle/`,
	FETCH_EVENTS: `${API_URL}/event/events`,
	JOIN_EVENT: `${API_URL}/event_requests/join`,
	SEND_REQUEST: `${API_URL}/event_requests/send`,
	WITHDRAW: `${API_URL}/event_requests/withdraw`,
	CHECK_USER_JOIN_STATUS: `${API_URL}/event_requests/check-join-status`,
};

export const ticketEndpoints = {
	create: `${API_URL}/ticket/create`,
};

export const paymentEndpoints = {
	ADD_USER_TICKETS_API: API_URL + "/payment/addUserAllTickets",
	COURSE_PAYMENT_API: API_URL + "/payment/capturePayment",
	COURSE_VERIFY_API: API_URL + "/payment/verifyPayment",
	SEND_PAYMENT_SUCCESS_EMAIL_API: API_URL + "/payment/sendPaymentSuccessEmail",
};

export const blogEndpoints = {
	FETCH_ALL: API_URL + "/blog/all",
	FETCH_ONE: API_URL + "/blog/fetchById",
};

export const newsletterEndpoints = {
	ADD: API_URL + "/newsletter/add",
};

export const communityEndpoints = {
	JOIN: API_URL + "/community/join",
};
