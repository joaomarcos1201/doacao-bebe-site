import { anuncioImage } from './anuncioImage';

test('preserves Base64 payload and declares JPEG/PNG correctly', () => {
  expect(anuncioImage('/9j/abc')).toBe('data:image/jpeg;base64,/9j/abc');
  expect(anuncioImage('iVBORw0KGgoAAA')).toBe('data:image/png;base64,iVBORw0KGgoAAA');
  expect(anuncioImage(null)).toBeNull();
});
