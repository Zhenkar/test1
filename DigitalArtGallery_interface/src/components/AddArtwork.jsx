import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Navb from './Navb';
import AdminNav from './AdminNav';

const schema = z.object({
    artwork_name: z.string().nonempty('Artwork Name is required'),
    artwork_image: z
      .any()
      .refine((files) => files && files.length > 0 && files[0] instanceof File, {
        message: 'Artwork Image is required',
      }),
    // price: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Enter a valid price'),
    about_artwork: z.string().nonempty('About Artwork is required'),
  });
  

export const AddArtwork = () => {
  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });


 

  const onSubmit = async (data) => {
    try {
      
        const email = localStorage.getItem('email');
        console.log(email)
        const formData = new FormData();
        formData.append('artwork_name', data.artwork_name);
        formData.append('artwork_image', data.artwork_image[0]);
        formData.append('price', 20);
        formData.append('about_artwork', data.about_artwork);
        formData.append('artist_email', email);
      

      console.log(formData)
      // Make API call
      const response = await fetch('/api/add-artwork', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Failed to save artwork');
      }
  
      const result = await response.json();
      alert('Artwork added successfully!');
      console.log('Response:', result);
    } catch (error) {
      console.error('Error:', error);
      alert('Error saving artwork!');
    }
  };

  return (
    <>
      <AdminNav/>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-6 shadow-lg rounded-lg max-w-[500px] w-full"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">Add New Artwork</h2>

          {/* Artwork Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Artwork Name
            </label>
            <input
              type="text"
              className={`border ${
                errors.artwork_name ? 'border-red-500' : 'border-gray-300'
              } rounded-md w-full p-2 focus:outline-none`}
              {...register('artwork_name')}
            />
            {errors.artwork_name && (
              <p className="text-red-500 text-sm">{errors.artwork_name.message}</p>
            )}
          </div>

          {/* Artwork Image */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Artwork Image
            </label>
            <input
              type="file"
              className={`border ${
                errors.artwork_image ? 'border-red-500' : 'border-gray-300'
              } rounded-md w-full p-2 focus:outline-none`}
              accept="image/*"
              {...register('artwork_image')}
            />
            {errors.artwork_image && (
              <p className="text-red-500 text-sm">{errors.artwork_image.message}</p>
            )}
          </div>

          {/* Price
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price
            </label>
            <input
              type="number"
              step="0.01"
              className={`border ${
                errors.price ? 'border-red-500' : 'border-gray-300'
              } rounded-md w-full p-2 focus:outline-none`}
              {...register('price')}
            />
            {errors.price && (
              <p className="text-red-500 text-sm">{errors.price.message}</p>
            )}
          </div> */}

          {/* About Artwork */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              About Artwork
            </label>
            <textarea
              className={`border ${
                errors.about_artwork ? 'border-red-500' : 'border-gray-300'
              } rounded-md w-full p-2 focus:outline-none`}
              rows="4"
              {...register('about_artwork')}
            />
            {errors.about_artwork && (
              <p className="text-red-500 text-sm">
                {errors.about_artwork.message}
              </p>
            )}
          </div>

 

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none"
            >
              Add Artwork
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddArtwork;
