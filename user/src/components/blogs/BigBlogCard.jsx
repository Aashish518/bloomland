import { useNavigate } from "react-router";

export default function BigBlogCard({ articles }) {
  const navigate = useNavigate();

  return (
    <div className="mx-auto px-6">
      <h2 className="text-4xl font-bold mb-6 text-[#E16B33]">
        Popular Articles
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {articles.map((article) => (
          <div
            key={article.id}
            onClick={() => navigate(`/blogs/${article._id}`)}
            className="bg-white rounded-lg  overflow-hidden shadow-lg transition-transform duration-300 group"
          >
            {article.image && (
              <div className="h-64 overflow-hidden">
                <img
                  src={article.image}
                  alt="Blog Image"
                  className="w-full h-full object-cover aspect-square group-hover:scale-110 transition duration-500 ease-in-out"
                />
              </div>
            )}
            <div className="p-4">
              <h3 className="text-md font-semibold mb-2">{article.title}</h3>
              <h4 className="text-md font-light mb-2">{article.subtitle}</h4>
              <span className="inline-block bg-[#E16B33] rounded-full px-3 py-1 text-sm font-semibold text-white">
                {article.category ? article.category : "category"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
