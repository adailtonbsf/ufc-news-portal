import dbConnect from '@/lib/mongodb';
import News from '@/models/News';
import { NextResponse } from 'next/server';

export async function PATCH(request) {
    await dbConnect();
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const action = searchParams.get('action'); // 'add' or 'remove'

        if (!id) {
            return NextResponse.json({ error: 'ID required' }, { status: 400 });
        }

        const increment = action === 'remove' ? -1 : 1;

        // Atomically update the likes counter
        const updatedNews = await News.findByIdAndUpdate(
            id,
            { $inc: { likes: increment } },
            { new: true } // Return updated document
        );

        if (!updatedNews) {
            return NextResponse.json({ error: 'News not found' }, { status: 404 });
        }

        return NextResponse.json({ likes: updatedNews.likes });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update like' }, { status: 500 });
    }
}
