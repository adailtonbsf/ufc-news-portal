
import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return new NextResponse('Missing File ID', { status: 400 });
    }

    try {
        // We use the 'uc' export link which redirects to the actual content
        // backend fetch follows redirects automatically
        const driveUrl = `https://drive.google.com/uc?export=view&id=${id}`;

        const response = await fetch(driveUrl);

        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
        }

        const buffer = await response.arrayBuffer();
        const contentType = response.headers.get('content-type') || 'image/jpeg';

        return new NextResponse(Buffer.from(buffer), {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });

    } catch (error) {
        console.error('Proxy Error:', error);
        return new NextResponse('Error fetching image', { status: 500 });
    }
}
