import { Calendar, User, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchBlogById } from "../services/operations/event";
import { useNavigate, useParams } from "react-router";
import Navbar from "../components/home/Navbar";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import Newsletter from "../components/common/Newsletter";
import Footer from "../components/home/Footer";

export default function BlogDetails() {
  // Dummy blog data
  const [blog, setBlog] = useState({
    id: 1,
    title: "Getting Started with React",
    subtitle: "A beginner's guide to React development",
    content: `
# Getting Started with React

React is a powerful JavaScript library for building user interfaces. It's declarative, efficient, and flexible, making it a popular choice among developers.

## Why React?

React was created to solve one problem: building large applications with data that changes over time. Here's why it's so effective:

- **Component-Based Architecture**: Build encapsulated components that manage their own state, then compose them to make complex UIs.
- **Declarative Views**: React makes it painless to create interactive UIs. Design simple views for each state in your application, and React will efficiently update and render just the right components when your data changes.
- **Learn Once, Write Anywhere**: You can develop new features in React without rewriting existing code. React can also render on the server using Node and power mobile apps using React Native.

## Setting Up Your First React App

Getting started with React is easier than you might think. With tools like Create React App, you can set up a new project with zero configuration:

\`\`\`bash
npx create-react-app my-first-app
cd my-first-app
npm start
\`\`\`

And just like that, you have a fully functional React application running locally!

## Core Concepts

Understanding these core concepts will help you build better React applications:

1. **Components**: The building blocks of any React app
2. **Props**: How data flows downward through your component tree
3. **State**: How components maintain and update their data
4. **Lifecycle Methods**: How to run code at specific points in a component's life

## Final Thoughts

React has transformed how developers build web applications. Its component-based approach and efficient rendering make it an excellent choice for modern web development. As you continue your journey with React, you'll discover even more powerful features and patterns.

Happy coding!
    `,
    image: "/api/placeholder/1200/800",
    author: "Jane Doe",
    publishedDate: "April 25, 2025",
    readTime: "5 min read",
    views: 1234,
  });

  const [related, setRelated] = useState([]);
  const { blogs } = useSelector((state) => state.event);
  const navigate = useNavigate();

  const { id } = useParams();
  useEffect(() => {
    const fetchBlog = async () => {
      const res = await fetchBlogById({ blogId: id });
      setBlog(res);
    };
    fetchBlog();
  }, [id, setBlog]);
  useEffect(() => {
    const getTwoRandomElements = (arr) => {
      if (arr.length < 2) {
        return arr;
      }

      const shuffled = [...arr].sort(() => 0.5 - Math.random());
      return [shuffled[0], shuffled[1]];
    };
    const res = getTwoRandomElements(blogs);
    setRelated(res);
  }, [blogs]);

  // Format the content with Markdown
  //   const formatContent = (content) => {
  //     // Basic markdown formatting for demonstration
  //     // In a real app, you'd use a markdown library like marked or remark

  //     // Format headings
  //     let formatted = content.replace(
  //       /^# (.*$)/gm,
  //       '<h1 class="text-3xl font-bold my-4">$1</h1>'
  //     );
  //     formatted = formatted.replace(
  //       /^## (.*$)/gm,
  //       '<h2 class="text-2xl font-semibold my-3">$1</h2>'
  //     );

  //     // Format paragraphs (simple approach)
  //     formatted = formatted.replace(/^(?!<h1|<h2|```)(.*$)/gm, function (match) {
  //       if (match.trim() === "") return "<br>";
  //       return '<p class="my-2">' + match + "</p>";
  //     });

  //     // Format code blocks (simple approach)
  //     formatted = formatted.replace(/```(.*?)```/gs, function (match, code) {
  //       return (
  //         '<div class="bg-gray-100 p-4 rounded-md my-4 font-mono text-sm overflow-x-auto">' +
  //         code +
  //         "</div>"
  //       );
  //     });

  //     // Format lists (simple approach)
  //     formatted = formatted.replace(
  //       /^- (.*$)/gm,
  //       '<li class="ml-6 list-disc">$1</li>'
  //     );
  //     formatted = formatted.replace(
  //       /^(\d+)\. (.*$)/gm,
  //       '<li class="ml-6 list-decimal">$2</li>'
  //     );

  //     // Group list items
  //     const listPattern = /(<li.*?>.*?<\/li>)\s*(<li.*?>.*?<\/li>)/gs;
  //     while (listPattern.test(formatted)) {
  //       formatted = formatted.replace(listPattern, '<ul class="my-2">$1$2</ul>');
  //     }

  //     return formatted;
  //   };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EFFFFC] to-white">
      {/* Blog Content */}
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white pt-20">
        {/* Featured Image */}
        {blog.image && (
          <div className="rounded-lg overflow-hidden mb-8 shadow-md">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-100 aspect-auto object-cover"
            />
          </div>
        )}

        {/* Blog Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {blog.title}
          </h1>
          <h2 className="text-2xl font-medium text-gray-600 mb-6">
            {blog.subtitle}
          </h2>

          <div className="flex flex-wrap items-center text-gray-500 text-sm gap-4">
            {/* <div className="flex items-center">
              <User size={16} className="mr-2" />
              {blog.author}
            </div> */}
            <div className="flex items-center">
              <Calendar size={16} className="mr-2 text-[#E16B33]" />
              {blog?.created_at &&
                format(new Date(blog.created_at), "d MMMM, yyyy")}
            </div>
            <div>{blog.readTime}</div>
            {/* <div className="flex items-center">
              <Eye size={16} className="mr-2" />
              {blog.views.toLocaleString()} views
            </div> */}
          </div>
        </div>

        {/* Blog Content */}
        <div className="prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </div>

        {/* Related Posts Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-2xl font-semibold mb-6 text-[#E16B33]">
            Related Posts
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {related &&
              related.length > 0 &&
              related.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt="React Components Deep Dive"
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h4 className="text-xl font-semibold mb-2">{item.title}</h4>
                    <p className="text-gray-600 mb-3">{item.subtitle}</p>
                    <span
                      onClick={() => navigate(`/blogs/${item._id}`)}
                      className="text-[#E16B33] font-medium cursor-pointer"
                    >
                      Read more →
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 bg-orange-100 p-6 rounded-lg">
          <Newsletter />
        </div>
      </div>
      <Footer />
    </div>
  );
}
