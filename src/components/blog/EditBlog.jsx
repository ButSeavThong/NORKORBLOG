import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchBlogById,
  updateBlog,
  uploadBlogImage,
  fetchCategories,
  clearError,
  clearUpdateSuccess,
} from "../../features/blog/blogSlice";
import { X, Upload, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";

const EditBlog = () => {
  const [form, setForm] = useState({
    title: "",
    content: "",
    category_ids: [],
  });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    currentBlog,
    categories,
    updating,
    uploadLoading,
    updateSuccess,
    error,
    loading,
  } = useSelector((state) => state.blog);

  const { token, user } = useSelector((state) => state.auth);

  // Debug logging
  useEffect(() => {
    console.log("🔍 EditBlog Debug:", {
      blogId: id,
      currentBlog,
      user,
      token: token ? "Exists" : "Missing",
      isAuthor:
        user &&
        currentBlog &&
        (user.id === currentBlog.author_id ||
          user.profile?.id === currentBlog.author_id),
    });
  }, [id, currentBlog, user, token]);

  // Redirect if not logged in
  useEffect(() => {
    if (!token) {
      toast.error("Please login to edit blog");
      navigate("/login");
      return;
    }
  }, [token, navigate]);

  // Check authorization after blog is loaded
  useEffect(() => {
    if (currentBlog && user) {
      const userId = user.id || user.profile?.id;
      const authorId = currentBlog.author_id || currentBlog.author?.id;

      console.log("🔐 Authorization check:", { userId, authorId });

      if (userId !== authorId) {
        toast.error("You can only edit your own blogs");
        navigate("/");
      }
    }
  }, [currentBlog, user, navigate]);

  // Fetch blog data and categories
  useEffect(() => {
    if (id && token) {
      console.log("📥 Fetching blog data for:", id);
      dispatch(fetchBlogById(id));
      dispatch(fetchCategories());
    }
  }, [id, dispatch, token]);

  // Populate form when currentBlog is loaded
  useEffect(() => {
    if (currentBlog) {
      console.log("📝 Populating form with:", currentBlog);
      setForm({
        title: currentBlog.title || "",
        content: currentBlog.content || "",
        category_ids: currentBlog.categories?.map((cat) => cat.id) || [],
      });
      setThumbnailUrl(currentBlog.thumbnail || "");
    }
  }, [currentBlog]);

  // Handle success and errors
  useEffect(() => {
    if (updateSuccess && isSubmitted) {
      toast.success("Blog updated successfully!");
      setIsSubmitted(false);
      navigate(`/blog/${id}`);
    }

    if (error) {
      console.error("❌ EditBlog error:", error);
      toast.error(error);
      dispatch(clearError());
    }

    return () => {
      dispatch(clearUpdateSuccess());
    };
  }, [updateSuccess, error, isSubmitted, dispatch, navigate, id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryToggle = (categoryId) => {
    setForm((prev) => {
      const isSelected = prev.category_ids.includes(categoryId);
      if (isSelected) {
        return {
          ...prev,
          category_ids: prev.category_ids.filter((id) => id !== categoryId),
        };
      } else {
        return {
          ...prev,
          category_ids: [...prev.category_ids, categoryId],
        };
      }
    });
  };

  const handleThumbnailChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
      if (!validTypes.includes(file.type)) {
        toast.error("Please select a valid image file (PNG, JPG, JPEG, WebP)");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setThumbnailFile(file);

      try {
        console.log("🖼️ Uploading thumbnail...");
        const url = await dispatch(uploadBlogImage(file)).unwrap();
        if (!url) {
          throw new Error("No URL returned from upload");
        }
        setThumbnailUrl(url);
        toast.success("Image uploaded successfully!");
      } catch (err) {
        console.error("❌ Thumbnail upload failed:", err);
        toast.error("Failed to upload image: " + (err.message || err));
        setThumbnailFile(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    console.log("🚀 Submitting form:", form);

    // Validation
    if (!form.title.trim()) {
      toast.error("Please enter a title");
      setIsSubmitted(false);
      return;
    }

    if (!form.content.trim()) {
      toast.error("Please enter content");
      setIsSubmitted(false);
      return;
    }

    if (form.category_ids.length === 0) {
      toast.error("Please select at least one category");
      setIsSubmitted(false);
      return;
    }

    // Prepare blog data - ensure category_ids is always an array
    const blogData = {
      title: form.title.trim(),
      content: form.content.trim(),
      category_ids: form.category_ids,
      ...(thumbnailUrl && { thumbnail: thumbnailUrl }),
    };

    console.log("📤 Sending update request:", { blogId: id, blogData });

    try {
      await dispatch(updateBlog({ blogId: id, blogData })).unwrap();
      // Success is handled in useEffect
    } catch (err) {
      console.error("❌ Update blog failed:", err);
      setIsSubmitted(false);
    }
  };

  const getSelectedCategoryNames = () => {
    return categories
      .filter((cat) => form.category_ids.includes(cat.id))
      .map((cat) => cat.name)
      .join(", ");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showCategoryDropdown && !event.target.closest(".category-dropdown")) {
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCategoryDropdown]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!currentBlog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">
          Blog not found or you don't have permission to edit it.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-gray-600 hover:text-teal-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Edit Story</h1>
          </div>
          <p className="text-gray-600">
            Update your blog post with new content or images.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleInputChange}
              placeholder="Enter a compelling title..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg font-medium"
              maxLength={200}
            />
            <p className="text-xs text-gray-500 mt-1">
              {form.title.length}/200 characters
            </p>
          </div>

          {/* Categories */}
          <div className="relative category-dropdown">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categories *
            </label>
            <div
              className="w-full px-4 py-3 border border-gray-300 rounded-lg cursor-pointer bg-white hover:border-gray-400 transition-colors"
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            >
              {form.category_ids.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  <span className="text-gray-600">
                    {getSelectedCategoryNames()}
                  </span>
                </div>
              ) : (
                <span className="text-gray-400">Select categories...</span>
              )}
            </div>

            {showCategoryDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                <div className="p-2 space-y-1">
                  {categories.map((category) => (
                    <label
                      key={category.id}
                      className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={form.category_ids.includes(category.id)}
                        onChange={() => handleCategoryToggle(category.id)}
                        className="rounded text-teal-600 focus:ring-teal-500"
                      />
                      <span className="text-gray-700">{category.name}</span>
                    </label>
                  ))}
                </div>
                {categories.length === 0 && !loading && (
                  <div className="p-4 text-center text-gray-500">
                    No categories available
                  </div>
                )}
                {loading && (
                  <div className="p-4 text-center text-gray-500">
                    Loading categories...
                  </div>
                )}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {form.category_ids.length} category selected
            </p>
          </div>

          {/* Thumbnail Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thumbnail Image {!thumbnailUrl && "*"}
            </label>
            <div className="space-y-4">
              {thumbnailUrl ? (
                <div className="relative">
                  <img
                    src={thumbnailUrl}
                    alt="Thumbnail preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setThumbnailUrl("");
                      setThumbnailFile(null);
                    }}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-teal-400 transition-colors bg-gray-50">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, JPEG, WebP (Max 5MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    disabled={uploadLoading}
                  />
                </label>
              )}
              {uploadLoading && (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-600"></div>
                  <span className="ml-2 text-sm text-gray-600">
                    Uploading image...
                  </span>
                </div>
              )}
              <p className="text-xs text-gray-500">
                Leave empty to keep current thumbnail
              </p>
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleInputChange}
              placeholder="Write your story here... You can use markdown formatting."
              rows={15}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              {form.content.length} characters
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              disabled={updating || uploadLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updating || uploadLoading}
              className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {updating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                "Update Story"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBlog;
