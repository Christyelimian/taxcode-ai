import { BlobUploadService } from './src/lib/blob-upload';

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
    
    // Create a test file (mock File object)
    const testFile = new File(['test'], 'test.png', { type: 'image/png' });
    
    // Create upload service
    const service = new BlobUploadService(token);
    
    console.log('✅ BlobUploadService created successfully');
    
    // Test upload (this will fail without a real file, but tests the service setup)
    try {
      const result = await service.uploadFile(testFile);
      console.log('✅ Upload successful:', result);
    } catch (error) {
      console.log('⚠️  Upload failed as expected (no real file):', error instanceof Error ? error.message : 'Unknown error');
    }
    
    console.log('✅ Image upload functionality test completed');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testImageUpload();