import React from 'react';

const truncateText = (text, wordLimit) => {
  const words = text.split(' ');
  return words.length > wordLimit ? `${words.slice(0, wordLimit).join(' ')}...` : text;
};

const Foodcard = ({ image, title, price, size, about }) => {
  const truncatedAbout = truncateText(about, 50);

  return (
    <div className="max-w-sm w-full sm:w-[300px] md:w-[350px] lg:w-[400px] h-[420px] bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden dark:bg-gray-800 dark:border-gray-700">
      {/* Image Section */}
      <div>
        <img 
          className="w-full h-[200px] object-cover" 
          src={image} 
          alt={title} 
        />
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col justify-between h-[220px]">
        <h5 className="text-lg md:text-xl font-bold text-gray-900 truncate">{title}</h5>
        <p className="text-sm md:text-base text-gray-500 line-clamp-3 overflow-hidden">
          {truncatedAbout}
        </p>
      </div>
    </div>
  );
};

export default Foodcard;
