import { writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const extension = file.name.split('.').pop();
    const filename = `${uuidv4()}.${extension}`;
    const path = join(process.cwd(), 'public', 'uploads', filename);

    // Write file to uploads directory
    await writeFile(path, buffer);

    // Return the file path relative to the public directory
    const publicPath = `/uploads/${filename}`;
    
    return NextResponse.json({ 
      success: true, 
      filePath: publicPath,
      fileName: file.name
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Error uploading file' },
      { status: 500 }
    );
  }
}
 