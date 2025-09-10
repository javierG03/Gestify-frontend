// utils/getFinalImageFile.js
export const getFinalImageFile = async (evento) => {
  // 1. Si es un File (usuario subió nueva), usarla
  if (evento?.image instanceof File) return evento.image;

  // 2. Si es base64
  if (typeof evento?.image === "string" && evento.image.startsWith("data:image/")) {
    const response = await fetch(evento.image);
    const blob = await response.blob();
    return new File([blob], evento.imageFileName || "imagen-base64.jpg", { type: blob.type });
  }

  // 3. Si es una URL (usuario no tocó la imagen, pero queremos conservarla)
  if (typeof evento?.imagePreview === "string" && evento.imagePreview.startsWith("http")) {
    const response = await fetch(evento.imagePreview);
    const blob = await response.blob();
    return new File([blob], "imagen-original.jpg", { type: blob.type });
  }

  // 4. Si fue eliminada manualmente
  return null;
};
