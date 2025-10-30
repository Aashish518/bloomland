import axios from "axios";
import { paymentEndpoints } from "../apis";
import { toast } from "react-toastify";
import { fetchUser } from "../../store/slices/userSlice";

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}


// add payment amount to user account details
export const addUserAllTickets = async ({
	token,
	email,
	amount,
	eventId,
	userAllTickets,
}) => {
	try {
		const response = await axios.post(
			paymentEndpoints.ADD_USER_TICKETS_API,
			{ email, amount, eventId, userAllTickets },
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		toast.success(response.data.message);
		console.log(response.data);
	} catch (error) {
		toast.error(error.response ? error.response.data.message : error.message);
	}
};

// Buy the Course
export async function PayEvent({
  token,
  eventId,
  user_details,
  dispatch,
  setLoading,
}) {
  try {
    // Loading the script of Razorpay SDK
    // setLoading({
    //   element: "payment",
    //   value: true,
    // });
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      console.log("error while loading the script");
      return;
    }

    // Initiating the Order in Backend
    const orderResponse = await axios.post(
      paymentEndpoints.COURSE_PAYMENT_API,
      {
        eventId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!orderResponse.data.success) {
      throw new Error(orderResponse.data.message);
    }
    console.log(
      "PAYMENT RESPONSE FROM BACKEND............",
      orderResponse.data
    );

    // Opening the Razorpay SDK
    // console.log("KEY ----------->", import.meta.env.VITE_RAZORPAY_KEY);
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      currency: orderResponse.data.data.currency,
      amount: `${orderResponse.data.data.amount}`,
      order_id: orderResponse.data.data.id,
      name: "BloomLand",
      description: "Thank you for Purchasing the Course.",
      //   image: rzpLogo,
      prefill: {
        name: `${user_details.name}`,
        email: user_details.email,
      },
      handler: function (response) {
        sendPaymentSuccessEmail(
          response,
          orderResponse.data.data.amount,
          token,
          eventId
        );
        verifyPayment(
          { ...response, eventId, amount: orderResponse.data.data.amount },
          token,
          dispatch
        );
      },
    };
    const paymentObject = new window.Razorpay(options);

    paymentObject.open();
    paymentObject.on("payment.failed", function (response) {
      console.log(response.error);
    });
  } catch (error) {
    console.log("PAYMENT API ERROR............", error);
    toast.error(error.response ? error.response.data.message : error.message);
  } finally {
    setLoading({
      element: null,
      value: false,
    });
  }
}

async function verifyPayment(bodyData, token, dispatch) {
  try {
    const response = await axios.post(
      paymentEndpoints.COURSE_VERIFY_API,
      bodyData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response) {
      toast.error("error verifying payment");
      throw new Error("Error verifying payment");
    }

    toast.success("Transaction completed successfully");
    dispatch(fetchUser({ token: token }));
  } catch (error) {
    console.log("PAYMENT VERIFY ERROR............", error);
    toast.error("Error processing your payment");
  }
}

// Send the Payment Success Email
const sendPaymentSuccessEmail = async (response, amount, token, eventId) => {
  try {
    // console.log("response", response, "amount", amount, "token", token);
    await axios.post(
      paymentEndpoints.SEND_PAYMENT_SUCCESS_EMAIL_API,
      {
        orderId: response.razorpay_order_id,
        paymentId: response.razorpay_payment_id,
        amount: amount,
        eventId: eventId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.log("PAYMENT SUCCESS EMAIL ERROR............", error);
  }
};
