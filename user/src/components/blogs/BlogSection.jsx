import React, { useEffect } from "react";
import BigBlogCard from "./BigBlogCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs } from "../../store/slices/eventSlice";

// const articles = [
//   {
//     id: 1,
//     title: "Guardians of the Pride: The Urgency of Lion Conservation Efforts",
//     category: "Species",
//     image: "https://picsum.photos/200/300",
//     alt: "Side profile of a male lion with a majestic mane",
//   },
//   {
//     id: 2,
//     title: "Ocean Mysteries: Exploring the Deep Sea Ecosystem",
//     category: "Marine Biology",
//     image: "https://picsum.photos/200/300",
//     alt: "Deep sea coral reef with colorful marine life",
//   },
//   {
//     id: 3,
//     title: "Rainforest Canopies: Earth's Most Diverse Habitats",
//     category: "Ecosystems",
//     image: "https://picsum.photos/200/300",
//     alt: "Aerial view of lush rainforest canopy",
//   },
//   {
//     id: 4,
//     title: "Rainforest Canopies: Earth's Most Diverse Habitats",
//     category: "Ecosystems",
//     image: "https://picsum.photos/200/300",
//     alt: "Aerial view of lush rainforest canopy",
//   },
//   {
//     id: 5,
//     title: "Rainforest Canopies: Earth's Most Diverse Habitats",
//     category: "Ecosystems",
//     image: "https://picsum.photos/200/300",
//     alt: "Aerial view of lush rainforest canopy",
//   },
//   {
//     id: 6,
//     title: "Rainforest Canopies: Earth's Most Diverse Habitats",
//     category: "Ecosystems",
//     image: "https://picsum.photos/200/300",
//     alt: "Aerial view of lush rainforest canopy",
//   },
//   {
//     id: 7,
//     title: "Rainforest Canopies: Earth's Most Diverse Habitats",
//     category: "Ecosystems",
//     image: "https://picsum.photos/200/300",
//     alt: "Aerial view of lush rainforest canopy",
//   },
//   {
//     id: 8,
//     title: "Rainforest Canopies: Earth's Most Diverse Habitats",
//     category: "Ecosystems",
//     image: "https://picsum.photos/200/300",
//     alt: "Aerial view of lush rainforest canopy",
//   },
//   {
//     id: 9,
//     title: "Rainforest Canopies: Earth's Most Diverse Habitats",
//     category: "Ecosystems",
//     image: "https://picsum.photos/200/300",
//     alt: "Aerial view of lush rainforest canopy",
//   },
// ];

const BlogSection = () => {
  //   const [articles, setArticles] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);
  const { blogs } = useSelector((state) => state.event);
  return (
    <div className="container mx-auto py-10 w-full flex ">
      <div className="w-full">
        {blogs && blogs.length > 0 && <BigBlogCard articles={blogs} />}
      </div>
    </div>
  );
};

export default BlogSection;
