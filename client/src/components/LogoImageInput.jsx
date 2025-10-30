import React, { useState, useRef } from "react";
import { Upload, X, Image } from "lucide-react";

const LogoImageInput = ({ value, id, onChange, className = "" }) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(value || null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        setPreview(imageUrl);
        onChange(id, file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange(id, "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Logo
      </label>

      {preview ? (
        <div className="relative">
          <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center space-x-4">
              <img
                src={preview}
                alt="Logo preview"
                className="w-16 h-16 object-contain rounded-md border border-gray-200 bg-white"
              />
              <div className="flex-1">
                <p className="text-sm text-gray-600">
                  Logo uploaded successfully
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Click to replace or drag a new image
                </p>
              </div>
              <button
                onClick={handleRemove}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                type="button"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* <div
            className={`absolute inset-0 border-2 border-dashed rounded-lg transition-all ${
              dragActive
                ? "border-green-400 bg-green-50/50"
                : "border-transparent hover:border-gray-300 hover:bg-gray-50/50"
            } cursor-pointer`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={openFileDialog}
          /> */}
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
            dragActive
              ? "border-green-400 bg-green-50"
              : "border-gray-300 hover:border-green-400 hover:bg-gray-50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <div className="flex flex-col items-center space-y-3">
            <div
              className={`p-3 rounded-full ${
                dragActive ? "bg-green-100" : "bg-gray-100"
              }`}
            >
              {dragActive ? (
                <Upload className="w-6 h-6 text-green-600" />
              ) : (
                <Image className="w-6 h-6 text-gray-500" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                {dragActive ? "Drop your logo here" : "Upload logo image"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Drag and drop or click to browse • PNG, JPG, GIF up to 10MB
              </p>
            </div>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />
    </div>
  );
};

export default LogoImageInput;
