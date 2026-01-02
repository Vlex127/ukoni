# 🚀 Cloudinary Posts Integration

Your posts system has been successfully integrated with Cloudinary for image management! Instead of using local `public/uploads`, all post images are now uploaded to and served from Cloudinary.

## ✅ **What's Been Updated:**

### 1. **Database Schema**
- Added `featured_image_url` - Stores the secure Cloudinary URL
- Added `featured_image_public_id` - Stores Cloudinary public ID for deletion
- Kept `featured_image` for backward compatibility

### 2. **API Endpoints**
- `POST /api/v1/posts/upload-image` - Upload images directly to Cloudinary
- Updated all post endpoints to return Cloudinary URLs
- Updated delete functionality to remove images from Cloudinary

### 3. **Image Management**
- Automatic Cloudinary upload for post featured images
- Automatic Cloudinary deletion when posts are deleted
- Support for JPEG, PNG, GIF, WebP formats
- 10MB file size limit for images

## 🌐 **New API Endpoints:**

### Upload Post Image
```http
POST /api/v1/posts/upload-image
Content-Type: multipart/form-data

Parameters:
- file: Image file (required)
```

**Response:**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "public_id": "post_images/sample_image",
    "url": "http://res.cloudinary.com/...",
    "secure_url": "https://res.cloudinary.com/...",
    "format": "jpg",
    "size": 12345,
    "width": 800,
    "height": 600,
    "created_at": "2024-01-01T12:00:00Z"
  }
}
```

### Create Post with Cloudinary Image
```http
POST /api/v1/posts/
Content-Type: application/json

{
  "title": "My Post",
  "content": "Post content here",
  "featured_image_public_id": "post_images/sample_image",
  "featured_image_url": "https://res.cloudinary.com/...",
  "category": "technology",
  "is_featured": true
}
```

## 🧪 **Testing:**

### Test Page
Access the comprehensive test interface at:
```
http://localhost:8000/test-post-cloudinary
```

**Features:**
- Upload images to Cloudinary
- Create posts with Cloudinary images
- View posts with Cloudinary images
- Auto-fill post form with uploaded image data

### Manual Testing

1. **Upload Image:**
```bash
curl -X POST "http://localhost:8000/api/v1/posts/upload-image" \
  -F "file=@your_image.jpg"
```

2. **Create Post:**
```bash
curl -X POST "http://localhost:8000/api/v1/posts/" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Post",
    "content": "This is a test post with Cloudinary image",
    "featured_image_public_id": "post_images/test_image",
    "featured_image_url": "https://res.cloudinary.com/...",
    "category": "test"
  }'
```

## 📊 **Post Response Format:**

All post endpoints now include Cloudinary fields:

```json
{
  "id": 1,
  "title": "Post Title",
  "slug": "post-title",
  "content": "Post content...",
  "featured_image": "post_images/sample_image",
  "featured_image_url": "https://res.cloudinary.com/...",
  "featured_image_public_id": "post_images/sample_image",
  "category": "technology",
  "status": "published",
  "is_featured": true,
  "view_count": 42,
  "created_at": "2024-01-01T12:00:00Z",
  "author": {
    "id": 1,
    "username": "author",
    "email": "author@example.com",
    "full_name": "Author Name"
  }
}
```

## 🔧 **Migration Applied:**

Database migration `f1be3b17f539_add_cloudinary_fields_to_posts_table.py` has been applied to add the new Cloudinary fields to your posts table.

## 🎯 **Benefits:**

1. **Cloud Storage** - Images stored securely in Cloudinary
2. **CDN Delivery** - Fast image delivery via Cloudinary CDN
3. **Automatic Optimization** - Images automatically optimized
4. **Transformations** - Can apply image transformations on-the-fly
5. **Backup & Security** - Professional image hosting with backups
6. **Scalability** - No local storage limitations

## 🔄 **Frontend Integration:**

When updating your frontend:

1. **Use the new upload endpoint** for post images
2. **Store both `featured_image_url` and `featured_image_public_id`**
3. **Display images using `featured_image_url`**
4. **Handle the new response format** in all post endpoints

## 📝 **Example Frontend Code:**

```javascript
// Upload image
const formData = new FormData();
formData.append('file', imageFile);

const response = await fetch('/api/v1/posts/upload-image', {
  method: 'POST',
  body: formData
});

const result = await response.json();
const imageUrl = result.data.secure_url;
const imagePublicId = result.data.public_id;

// Create post with image
const postData = {
  title: 'My Post',
  content: 'Post content',
  featured_image_url: imageUrl,
  featured_image_public_id: imagePublicId
};

const postResponse = await fetch('/api/v1/posts/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(postData)
});
```

## ✅ **Ready for Production!**

Your posts system is now fully integrated with Cloudinary and ready for production use. Images are automatically uploaded, optimized, and served via Cloudinary's CDN.
