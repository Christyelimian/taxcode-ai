import { getFirebaseAdmin } from './src/lib/firebase-server';

async function updateTransferProtocol() {
  const { db } = getFirebaseAdmin();
  if (!db) {
    console.log('Firestore not available');
    return;
  }
  
  try {
    // Find the insight
    const insights = await db.collection('insights').get();
    const transferProtocol = insights.docs.find(doc => 
      doc.data().title && doc.data().title.includes('2026 Transfer Protocol')
    );
    
    if (!transferProtocol) {
      console.log('Transfer Protocol insight not found');
      return;
    }
    
    console.log('Found Transfer Protocol:', {
      id: transferProtocol.id,
      title: transferProtocol.data().title,
      currentAuthorId: transferProtocol.data().authorId,
      currentAuthorName: transferProtocol.data().authorName
    });
    
    // Find Oracle in faculty
    const faculty = await db.collection('faculty').get();
    const oracle = faculty.docs.find(doc => 
      doc.data().name && doc.data().name.toLowerCase().includes('oracle')
    );
    
    if (!oracle) {
      console.log('Oracle not found in faculty');
      return;
    }
    
    console.log('Found Oracle:', {
      id: oracle.id,
      name: oracle.data().name,
      title: oracle.data().title,
      email: oracle.data().email
    });
    
    // Update the insight with Oracle as author
    await db.collection('insights').doc(transferProtocol.id).update({
      authorId: oracle.id,
      authorName: oracle.data().name,
      authorImage: oracle.data().image,
      authorTitle: oracle.data().title,
      updatedAt: new Date()
    });
    
    console.log('Successfully updated Transfer Protocol insight with Oracle as author');
    
  } catch (error) {
    console.error('Error updating Transfer Protocol:', error);
  }
}

updateTransferProtocol().then(() => {
  console.log('Script completed');
  process.exit(0);
}).catch((error) => {
  console.error('Script failed:', error);
  process.exit(1);
});