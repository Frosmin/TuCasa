export type UploadedAsset = { url: string; public_id: string; name?: string };

export class UploadService {
  static async uploadImages(files: File[]): Promise<UploadedAsset[]> {
    const body = new FormData();
    files.forEach((f) => body.append('files', f));

    const res = await fetch('/api/upload', { method: 'POST', body });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || 'Upload error');
    }
    const data = await res.json();
    return data.assets as UploadedAsset[];
  }
}