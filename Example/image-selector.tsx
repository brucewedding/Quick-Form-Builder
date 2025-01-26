import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';

const ImageSelector = ({ 
  isDesigner = true,
  defaultImages = []
}) => {
  const [images, setImages] = useState(defaultImages);
  const [selectedImage, setSelectedImage] = useState('');

  const handleImageUpload = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImages = [...images];
        newImages[index] = {
          ...newImages[index],
          src: reader.result
        };
        setImages(newImages);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLabelChange = (index, newLabel) => {
    const newImages = [...images];
    newImages[index] = {
      ...newImages[index],
      label: newLabel
    };
    setImages(newImages);
  };

  const addImage = () => {
    setImages([...images, { 
      src: '/api/placeholder/200/200',
      label: `Option ${images.length + 1}`
    }]);
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isDesigner) {
      console.log('Form configuration:', images);
    } else {
      console.log('Selected label:', selectedImage);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4">
      <div className="grid grid-cols-2 gap-4 mb-6">
        {images.map((image, index) => (
          <div key={index} className="flex flex-col items-center">
            {isDesigner ? (
              <div className="w-full space-y-2">
                <div className="relative">
                  <label className="cursor-pointer p-2 rounded-lg border-2 hover:bg-gray-50 block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, index)}
                      className="sr-only"
                    />
                    <img
                      src={image.src}
                      alt={image.label}
                      className="w-full h-48 object-contain rounded-lg"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                  </label>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <input
                  type="text"
                  value={image.label}
                  onChange={(e) => handleLabelChange(index, e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Enter label"
                />
              </div>
            ) : (
              <label className="cursor-pointer p-2 rounded-lg border-2 hover:bg-gray-50">
                <input
                  type="radio"
                  name="imageChoice"
                  value={image.label}
                  onChange={(e) => setSelectedImage(e.target.value)}
                  className="sr-only"
                />
                <img
                  src={image.src}
                  alt={image.label}
                  className={`w-full h-48 object-cover rounded-lg ${
                    selectedImage === image.label ? 'ring-4 ring-blue-500' : ''
                  }`}
                />
                <p className="mt-2 text-center font-medium">{image.label}</p>
              </label>
            )}
          </div>
        ))}
      </div>
      
      {isDesigner && (
        <button
          type="button"
          onClick={addImage}
          className="w-full mb-4 border-2 border-dashed border-gray-300 p-4 rounded-lg hover:bg-gray-50"
        >
          Add Image Option
        </button>
      )}

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!isDesigner && !selectedImage}
      >
        {isDesigner ? 'Save Configuration' : 'Submit Selection'}
      </button>
    </form>
  );
};

export default ImageSelector;