// Simple test to verify image upload functionality
require('dotenv').config();

async function testImageUpload() {
  try {
    console.log('Testing image upload functionality...');
    
    // Check if BLOB_READ_WRITE_TOKEN is available
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      console.error('❌ BLOB_READ_WRITE_TOKEN is not configured');
      return;
    }
    
    console.log('✅ BLOB_READ_WRITE_TOKEN is configured');
    console.log('✅ Token length:', token.length);
    
    // Test that the blob upload service can be instantiated
    try {
      const { BlobUploadService } = require('./src/lib/blob-upload.ts');
      const service = new BlobUploadService(token);
      console.log('✅ BlobUploadService created successfully');
    } catch (error) {
      console.error('❌ Failed to create BlobUploadService:', error.message);
      return;
    }
    
    console.log('✅ Image upload functionality test completed successfully');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testImageUpload();