import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

export const runtime = 'nodejs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const MAX_SIZE = 8 * 1024 * 1024; // 8MB por archivo
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/avif'];

async function uploadBuffer(buffer: Buffer, folder?: string, filename?: string) {
  return new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
    const options: Record<string, any> = {
      folder: folder || undefined,
      resource_type: 'image',
      use_filename: true,
      unique_filename: true,
      overwrite: false,
      // Si quieres normalizar formatos, puedes agregar: format: 'webp'
    };

    const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err) return reject(err);
      if (!result) return reject(new Error('No upload result'));
      resolve({ secure_url: result.secure_url, public_id: result.public_id });
    });
    stream.end(buffer);
  });
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const files = form.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ message: 'No files received' }, { status: 400 });
    }

    const folder = process.env.CLOUDINARY_UPLOAD_FOLDER || 'uploads';

    const uploads = await Promise.all(
      files.map(async (file) => {
        if (!ALLOWED.includes(file.type)) {
          throw new Error(`Tipo no permitido: ${file.type}`);
        }
        if (file.size > MAX_SIZE) {
          throw new Error(`Archivo demasiado grande: ${file.name}`);
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const result = await uploadBuffer(buffer, folder, file.name);
        return { url: result.secure_url, public_id: result.public_id, name: file.name };
      })
    );

    return NextResponse.json({ assets: uploads }, { status: 200 });
  } catch (err: any) {
    console.error('Cloudinary upload error:', err);
    return NextResponse.json({ message: 'Upload failed', error: err?.message }, { status: 500 });
  }
}