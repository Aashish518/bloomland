import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: "",
  password: "",
  selected: null,
};

const formDataSlice = createSlice({
  name: "formData",
  initialState,
  reducers: {
    setFormData(state, action) {
      state.email = action.payload.email;
      state.password = action.payload.password;
    },
  },
});

export const { setFormData } = formDataSlice.actions;
export default formDataSlice.reducer;
