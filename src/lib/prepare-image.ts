const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
]);
export async function prepareImage(file: File): Promise<File> {
  if (!IMAGE_TYPES.has(file.type))
    throw new Error("Upload a JPEG, PNG, WebP, AVIF, or GIF image.");
  if (file.size > 20 * 1024 * 1024)
    throw new Error("Choose a photo smaller than 20 MB.");
  if (file.type === "image/gif") {
    if (file.size > 4 * 1024 * 1024)
      throw new Error("Each GIF must be 4 MB or smaller.");
    return file;
  }
  const url = URL.createObjectURL(file);
  try {
    const image = new window.Image();
    image.src = url;
    await image.decode();
    const scale = Math.min(
      1,
      2000 / Math.max(image.naturalWidth, image.naturalHeight),
    );
    if (scale === 1 && file.size <= 1024 * 1024) return file;
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Could not prepare this photo.");
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob(
        (value) =>
          value
            ? resolve(value)
            : reject(new Error("Could not prepare this photo.")),
        "image/webp",
        0.85,
      ),
    );
    if (blob.size > 4 * 1024 * 1024)
      throw new Error("Each image must be 4 MB or smaller.");
    const extension = blob.type === "image/webp" ? "webp" : "png";
    return new File(
      [blob],
      `${file.name.replace(/\.[^.]+$/, "")}.${extension}`,
      { type: blob.type },
    );
  } finally {
    URL.revokeObjectURL(url);
  }
}
