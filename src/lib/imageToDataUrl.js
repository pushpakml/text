const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const MAX_SIZE = 3 * 1024 * 1024;

export async function fileToDataUrl(file) {
  if (!file || !(file instanceof File) || file.size === 0) {
    return { skip: true };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: "Only JPG, PNG and WEBP images are allowed" };
  }

  if (file.size > MAX_SIZE) {
    return { error: "Image must be smaller than 3MB" };
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return {
    dataUrl: `data:${file.type};base64,${buffer.toString("base64")}`,
  };
}
