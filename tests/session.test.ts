import { verifySessionCookie } from '@/lib/session';

// This test is a lightweight unit test that ensures the verifySessionCookie function
// returns null when no cookie is provided. Full firebase-admin integration tests
// require service account credentials and are best run in CI with secrets.

test('verifySessionCookie returns null for undefined', async () => {
  const decoded = await verifySessionCookie(undefined as any);
  expect(decoded).toBeNull();
});
