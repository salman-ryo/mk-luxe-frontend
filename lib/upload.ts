import axios from 'axios';
import { apiClient } from './api-client';

export interface UploadProgressCallback {
  (percent: number): void;
}

/**
 * Uploads a file to Cloudflare R2 by first obtaining a presigned URL
 * from the backend, and then PUTing the file directly to Cloudflare.
 */
export async function uploadToR2(
  file: File,
  onProgress?: UploadProgressCallback,
  objectKey?: string
): Promise<string> {
  onProgress?.(5);

  // 1. Get presigned upload URL from our backend
  const res = await apiClient.post('/admin/uploads/presign', {
    file_name: file.name,
    content_type: file.type,
    object_key: objectKey,
  });

  if (!res.data.success) {
    throw new Error(res.data.message || 'Failed to get presigned upload URL');
  }

  const { upload_url, public_url } = res.data.data;
  onProgress?.(25);

  // 2. Upload file directly to Cloudflare R2 using standard Axios
  await axios.put(upload_url, file, {
    headers: {
      'Content-Type': file.type,
    },
    onUploadProgress: (progressEvent) => {
      const total = progressEvent.total || file.size;
      const loaded = progressEvent.loaded;
      const percent = Math.round((loaded * 100) / total);
      // Map to 25% - 95% range
      onProgress?.(25 + Math.round((percent * 70) / 100));
    },
  });

  onProgress?.(100);
  return public_url;
}
