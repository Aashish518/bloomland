import axios from "axios";
import { blogEndpoints } from "./apis";
import { getBlogs } from "@/store/slices/adminSlice";
import { toast } from "react-toastify";

export const addBlog = ({ token, title, subtitle, content, image }) => {
  return async (dispatch) => {
    try {
      const data = new FormData();
      data.append("title", title);
      data.append("subtitle", subtitle);
      data.append("content", content);
      if (image) {
        data.append("image", image);
      }

      const response = await axios.post(blogEndpoints.create, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(getBlogs());
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response ? error.response.data.message : error.message);

      console.log(error);
    }
  };
};

export const deleteBlog = ({ token, blogId }) => {
  return async (dispatch) => {
    try {
      const response = await axios.delete(`${blogEndpoints.delete}/${blogId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(getBlogs());
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response ? error.response.data.message : error.message);

      console.log(error);
    }
  };
};

export const getBlogById = async ({ token, blogId }) => {
  try {
    const response = await axios.get(`${blogEndpoints.fetchOne}/${blogId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.blog;
  } catch (error) {
    toast.error(error.response ? error.response.data.message : error.message);

    console.log(error);
  }
};
