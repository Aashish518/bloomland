import React from "react";
import { useSelector } from "react-redux";
import { PayEvent } from "../../services/operations/payment";

const PaymentCard = ({ event }) => {
  const { token } = useSelector((state) => state.auth);
  const { name, email } = useSelector((state) => state.user);

  const handlePayment = async () => {
    const details = {
      name: name,
      email: email,
    };
    await PayEvent({ token, eventId: event._id, user_details: details });
  };

  return (
    <div className="p-5 flex flex-col items-center justify-center bg-slate-700">
      <h1 className="my-4 text-4xl text-yellow-500 font-bold">{event.title}</h1>
      <img
        src={event.images[0]}
        alt={event.title}
        className="h-52 w-52 object-cover"
      />
      <p
        className="my-3 text-white"
        dangerouslySetInnerHTML={{ __html: event.description }}
      ></p>
      <p className="text-2xl text-yellow-500 font-semibold">{event.price}</p>
      <button
        onClick={handlePayment}
        className="px-3 py-2 bg-white text-black cursor-pointer"
      >
        Pay Now{" "}
      </button>
    </div>
  );
};

export default PaymentCard;
