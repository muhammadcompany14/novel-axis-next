export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

const ACCEPTED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/svg+xml",
]);

const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
  "image/svg+xml": "svg",
};

export type UploadOutcome = { url: string } | { error: string };

function decodeImageData(data: string): { buffer: Buffer; mime: string } | { error: string } {
  const match = /^data:([^;,]+);base64,([^]*)$/.exec(data);
  if (!match) return { error: "Expected a base64 data URL (data:image/...;base64,...)" };
  const mime = match[1].toLowerCase();
  if (!ACCEPTED_TYPES.has(mime)) return { error: `Unsupported image type: ${mime}` };
  const buffer = Buffer.from(match[2], "base64");
  if (buffer.byteLength > MAX_UPLOAD_BYTES) {
    return { error: `Image exceeds the ${MAX_UPLOAD_BYTES / (1024 * 1024)} MB limit` };
  }
  return { buffer, mime };
}

/**
 * Stores a pasted/uploaded image. With `BLOB_READ_WRITE_TOKEN` (Vercel) the
 * bytes go to Blob storage and we keep a small URL; otherwise (local file
 * store) the data URL itself is the persisted value.
 */
export async function storeImage(data: string): Promise<UploadOutcome> {
  const decoded = decodeImageData(data);
  if ("error" in decoded) return decoded;

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (token) {
    try {
      const { put } = await import("@vercel/blob");
      const extension = EXT_BY_TYPE[decoded.mime] ?? "bin";
      const blob = await put(`nas-admin/${Date.now()}.${extension}`, decoded.buffer, {
        access: "public",
        contentType: decoded.mime,
        token,
      });
      return { url: blob.url };
    } catch (error) {
      return {
        error: error instanceof Error ? `Blob upload failed: ${error.message}` : "Blob upload failed",
      };
    }
  }

  return { url: data };
}