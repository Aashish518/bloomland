import React, { useEffect, useState } from "react";
import { createTicket } from "../services/operations/ticket";
import { useNavigate } from "react-router";

const Ticket = () => {
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null); // Store single image or a file object
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form default submission behavior

    const data = new FormData();
    data.append("email", email);
    data.append("category", category);
    data.append("description", description);

    if (image) {
      data.append("images", image); // Append the image as a file
    }

    // Call createTicket function here with form data
    await createTicket({ data }, navigate); // Make sure createTicket is called with FormData
  };

  useEffect(() => {
    console.log(image);
  }, [image]);

  const handleImageUpload = (e) => {
    // Set the first selected file (if only one image is allowed)
    const file = e.target.files[0];
    if (file) {
      setImage(file); // Set the selected file
    }
  };

  return (
    <div>
      <h1>Submit your ticket</h1>
      <form onSubmit={handleSubmit} className="flex flex-col justify-center">
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className=""
          />
        </label>

        <label>
          Category:
          <select
            name="category"
            className=""
            value={category} // Use value instead of defaultValue
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value={"inquiry"}>Inquiry</option>
            <option value={"auth"}>Auth</option>
            <option value={"event"}>Event</option>
          </select>
        </label>

        <label>
          Description:
          <input
            type="text"
            className=""
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        <label>
          Image/screenshot:
          <input
            type="file"
            className=""
            onChange={handleImageUpload} // Handle file input change
          />
        </label>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Ticket;
