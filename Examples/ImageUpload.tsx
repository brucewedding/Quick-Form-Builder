import React, { useState, useRef } from 'react';

const ImageUpload = ({
  prompt = "Upload an image",
  buttonText = "Choose File",
  width = "w-96",
  height = "h-64",
  maxDimension = 800,
  onImageSelect = (file) => console.log('Image selected:', file)
}) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileName, setFileName] = useState("No file chosen");
  const fileInputRef = useRef(null);

  const resizeImage = (originalFile) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(originalFile);
      
      img.onload = () => {
        // Calculate new dimensions
        let newWidth = img.width;
        let newHeight = img.height;
        
        if (img.width > maxDimension || img.height > maxDimension) {
          if (img.width > img.height) {
            newWidth = maxDimension;
            newHeight = (img.height / img.width) * maxDimension;
          } else {
            newHeight = maxDimension;
            newWidth = (img.width / img.height) * maxDimension;
          }
        }

        // Create canvas and resize
        const canvas = document.createElement('canvas');
        canvas.width = newWidth;
        canvas.height = newHeight;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
        
        // Convert to file
        canvas.toBlob((blob) => {
          // Create new file with original name
          const resizedFile = new File([blob], originalFile.name, {
            type: originalFile.type,
            lastModified: Date.now(),
          });
          
          resolve(resizedFile);
        }, originalFile.type);

        // Clean up
        URL.revokeObjectURL(img.src);
      };
    });
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setFileName(file.name);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Process and resize image if needed
      const img = new Image();
      img.src = URL.createObjectURL(file);
      
      img.onload = async () => {
        let finalFile = file;
        
        // Only resize if image exceeds max dimensions
        if (img.width > maxDimension || img.height > maxDimension) {
          finalFile = await resizeImage(file);
          console.log(`Image resized from ${img.width}x${img.height} to ${finalFile.width}x${finalFile.height}`);
        }
        
        URL.revokeObjectURL(img.src);
        onImageSelect(finalFile);
      };
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Image Preview Area */}
      <div 
        className={`${width} ${height} border-2 border-dashed border-gray-300 rounded-lg 
          flex items-center justify-center overflow-hidden bg-gray-50`}
      >
        {previewUrl ? (
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <div className="text-gray-400">
            <svg 
              className="w-12 h-12 mx-auto mb-2"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
              />
            </svg>
          </div>
        )}
      </div>

      {/* Prompt Text */}
      <div className="text-sm text-gray-600 max-w-prose text-center px-4 whitespace-normal">
        {prompt}
      </div>

      {/* DaisyUI-style File Input */}
      <div className="flex w-full max-w-xs">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*"
          className="hidden"
        />
        <div 
          className="flex w-full cursor-pointer"
          onClick={handleButtonClick}
        >
          <div className="bg-blue-500 text-white px-4 py-2 rounded-l-lg hover:bg-blue-600 transition-colors duration-200">
            {buttonText}
          </div>
          <div className="flex-1 px-4 py-2 bg-gray-100 text-gray-600 truncate rounded-r-lg border-y border-r border-gray-200">
            {fileName}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;