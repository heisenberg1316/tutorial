import { FaCloudUploadAlt, FaTimes } from "react-icons/fa";
import type { BlogPost } from "../types/types";

type ImageFieldProps = {
  imagePreview: string | null;
  setImagePreview : React.Dispatch<React.SetStateAction<string | null>>
  setBlogPost : React.Dispatch<React.SetStateAction<BlogPost>>
};

const ImageField = ({
  imagePreview,
  setImagePreview,
  setBlogPost
}: ImageFieldProps) => {
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file && file.size > 3 * 1024 * 1024) {
        alert("Image must be less than 3MB");
        return;
      }
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          setImagePreview(result)
          setBlogPost((prev) => ({ ...prev, image: result }))
        }
        reader.readAsDataURL(file)
      }
    }

    const handleRemoveImage = () => {
      setImagePreview(null)
      setBlogPost((prev) => ({ ...prev, image: null }))
    }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Featured Image</h3>
        <p className="text-sm text-gray-600 mt-1">
          Upload an image to make your post more engaging
        </p>
      </div>

      <div className="p-4 sm:p-6">
        {!imagePreview ? (
          <div
            className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const files = e.dataTransfer.files;
              const fakeEvent = {
                target: { files },
              } as unknown as React.ChangeEvent<HTMLInputElement>;
              handleImageUpload(fakeEvent);
            }}
          >
            <FaCloudUploadAlt className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mb-2 sm:mb-4" />
            <div className="space-y-1 sm:space-y-2">
              <p className="text-xs sm:text-sm text-gray-600">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 1MB</p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        ) : (
          <div className="relative">
            <div className="aspect-video relative overflow-hidden rounded-lg bg-gray-100">
              <img
                src={imagePreview || "/placeholder.svg"}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                title="Remove image"
              >
                <FaTimes className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageField;
