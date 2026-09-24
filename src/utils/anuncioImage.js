// Keep the API's Base64 string contract and declare the actual media type.
export function anuncioImage(base64) {
  if (!base64) return null;
  const mime = base64.startsWith('iVBORw0KGgo') ? 'image/png' : 'image/jpeg';
  return `data:${mime};base64,${base64}`;
}
