# 🧪 Cloudinary Upload Testing Guide

## ✅ Server Status
The backend server is **running successfully** on port 8001!

## 📋 Available Test Methods

### 1. 🌐 HTML Web Interface (Recommended)
Open `test_upload.html` in your browser to test uploads with a user-friendly interface.

```bash
# Open the test page
start test_upload.html
```

### 2. 🐍 Python Test Script
Run the automated test script:

```bash
python backend/test_upload.py
```

### 3. 📡 API Endpoints
Test directly with API calls:

#### Health Check
```powershell
Invoke-RestMethod -Uri "http://localhost:8001/health"
```

#### Upload Endpoints
- **Image Upload**: `POST /api/v1/media/upload/image`
- **Video Upload**: `POST /api/v1/media/upload/video`
- **File Upload**: `POST /api/v1/media/upload/file`
- **Multiple Files**: `POST /api/v1/media/upload/multiple`
- **Delete Resource**: `DELETE /api/v1/media/delete/{public_id}`
- **Get Info**: `GET /api/v1/media/info/{public_id}`

## ⚙️ Configuration Required

### Current Status: ⚠️ Needs Cloudinary Credentials

The API is working but uploads will fail until you configure actual Cloudinary credentials.

### Steps to Configure:

1. **Get Cloudinary Account**
   - Sign up at [cloudinary.com](https://cloudinary.com)
   - Get your credentials from the dashboard

2. **Update .env File**
   Edit `c:\Users\Vincent\Documents\ukoni\.env`:
   ```env
   CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
   CLOUDINARY_API_KEY=your_actual_api_key
   CLOUDINARY_API_SECRET=your_actual_api_secret
   ```

3. **Restart Server**
   ```bash
   # Stop current server (Ctrl+C) and restart
   cd backend
   python -c "import uvicorn; uvicorn.run('main:app', host='0.0.0.0', port=8001, reload=True)"
   ```

## 📁 Supported File Types

### 🎥 Videos (Max 100MB)
- MP4, AVI, MOV, WMV, FLV, WebM, MKV, 3GP

### 📸 Images (Max 10MB)
- JPEG, PNG, GIF, WebP, BMP, TIFF, SVG

### 📄 Files (Max 20MB)
- PDF, TXT, DOC, DOCX, XLS, XLSX

## 🧪 Quick Test Example

### Using PowerShell (Windows)
```powershell
# Test image upload
$fileContent = "Test image content" | Out-File -FilePath "test.txt" -Encoding UTF8
$form = @{
    file = Get-Item "test.txt"
    folder = "test_images"
    title = "Test Image"
    description = "Test upload"
}

$response = Invoke-RestMethod -Uri "http://localhost:8001/api/v1/media/upload/image" -Method POST -Form $form
$response | ConvertTo-Json -Depth 10
```

## 🔍 Expected Response Format

### Successful Upload
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "public_id": "test_images/sample_image",
    "url": "http://res.cloudinary.com/...",
    "secure_url": "https://res.cloudinary.com/...",
    "format": "jpg",
    "size": 12345,
    "width": 800,
    "height": 600,
    "folder": "test_images",
    "title": "Test Image",
    "description": "Test upload",
    "created_at": "2024-01-01T12:00:00Z"
  }
}
```

### Error Response (Missing Credentials)
```json
{
  "detail": "Failed to upload image to Cloudinary"
}
```

## 🚀 Next Steps

1. ✅ **Server is running** - Ready for testing
2. ⏳ **Configure Cloudinary** - Add your credentials
3. 🧪 **Test uploads** - Use the HTML interface or API calls
4. 🎉 **Deploy** - Ready for production use

## 📞 Support

If you encounter any issues:
1. Check server logs for error messages
2. Verify Cloudinary credentials are correct
3. Ensure file formats and sizes are within limits
4. Check network connectivity to Cloudinary

---

**🎉 Your Cloudinary upload system is ready to test!**
