import dbConnect from '@/lib/mongodb';
import News from '@/models/News';
import { NextResponse } from 'next/server';

// Note: We need to parse body, so this might need to change to POST if GET parameters are mixed, but let's try reading body in PATCH
export async function PATCH(request) {
    await dbConnect();
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const body = await request.json().catch(() => ({})); // Handle if body is empty
        const userEmail = body.userEmail;

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
        if (!userEmail) return NextResponse.json({ error: 'User not logged in' }, { status: 401 });

        const newsItem = await News.findOne({
            _id: id,
            $or: [{ status: 'published' }, { status: { $exists: false } }]
        });

        if (!newsItem) return NextResponse.json({ error: 'Notícia não encontrada' }, { status: 404 });

        // Check if user already liked
        const isLiked = newsItem.likedBy && newsItem.likedBy.includes(userEmail);

        let updateQuery;
        if (isLiked) {
            // Unlike
            updateQuery = {
                $pull: { likedBy: userEmail },
                $inc: { likes: -1 }
            };
        } else {
            // Like
            updateQuery = {
                $addToSet: { likedBy: userEmail },
                $inc: { likes: 1 }
            };
        }

        const updatedNews = await News.findByIdAndUpdate(id, updateQuery, { new: true });

        return NextResponse.json({
            likes: updatedNews.likes,
            hasLiked: !isLiked
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Falha ao atualizar curtida' }, { status: 500 });
    }
}

export async function GET(request) {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userEmail = searchParams.get('userEmail');

    if (!id || !userEmail) {
        return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 });
    }

    try {
        const news = await News.findById(id).select('likedBy');
        if (!news) return NextResponse.json({ error: 'Notícia não encontrada' }, { status: 404 });

        const hasLiked = news.likedBy && news.likedBy.includes(userEmail);
        return NextResponse.json({ hasLiked });
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao verificar status' }, { status: 500 });
    }
}
