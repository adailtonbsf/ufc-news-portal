import dbConnect from '@/lib/mongodb';
import News from '@/models/News';
import { NextResponse } from 'next/server';

export async function GET() {
    await dbConnect();
    try {
        const news = await News.find({}).sort({ publishDate: -1 });
        return NextResponse.json(news);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
    }
}

export async function DELETE(request) {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    try {
        await News.findByIdAndDelete(id);
        return NextResponse.json({ message: 'News deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete news' }, { status: 500 });
    }
}
