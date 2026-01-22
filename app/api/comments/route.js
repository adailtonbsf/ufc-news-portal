import dbConnect from '@/lib/mongodb';
import Comment from '@/models/Comment';
import { NextResponse } from 'next/server';

export async function GET(request) {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const newsId = searchParams.get('newsId');

    if (!newsId) {
        return NextResponse.json({ error: 'News ID is required' }, { status: 400 });
    }

    try {
        const comments = await Comment.find({ newsId }).sort({ createdAt: -1 });
        return NextResponse.json(comments);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
    }
}

export async function POST(request) {
    await dbConnect();

    try {
        const body = await request.json();
        const { newsId, userId, userName, content } = body;

        if (!newsId || !userId || !userName || !content) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newComment = await Comment.create({
            newsId,
            userId,
            userName,
            content
        });

        return NextResponse.json(newComment, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
    }
}
