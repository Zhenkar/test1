import React from "react";

const ArtworkCard = ({id,image, title, price, onRemove }) => {
  return (
    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden dark:bg-gray-800 dark:border-gray-700">
      {/* Image Section */}
      <div>
      {/* <img className="w-full h-48 object-cover" src={image} alt={title} /> */}
      </div>

      {/* Content Section */}
      <div className="p-3">
        <h1 className="mb-1 text-black dark:text-gray-400 text-2xl font-extrabold">Id : {id}</h1>
        <h2 className="mb- text-black dark:text-gray-400 text-2xl font-semibold">{title}</h2>
        <p className="mb-2 text-black dark:text-gray-400"></p>

        <div className="flex space-x-2">
          <button
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-8 rounded-3xl transition"
            onClick={onRemove}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};



export default ArtworkCard;
