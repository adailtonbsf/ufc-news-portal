import { NextResponse } from 'next/server';
import { uploadToDrive } from '@/lib/drive';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json(
                { error: 'No file received.' },
                { status: 400 }
            );
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        // Sanitize filename but keep extension
        const filename = Date.now() + '_' + file.name.replace(/[^a-zA-Z0-9.]/g, '_');
        const mimeType = file.type || 'application/octet-stream';

        console.log(`Uploading ${filename} to Google Drive...`);
        const result = await uploadToDrive(buffer, filename, mimeType);

        return NextResponse.json({
            url: result.publicUrl,
            success: true,
            details: result
        });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Error uploading file to Drive.' },
            { status: 500 }
        );
    }
}
