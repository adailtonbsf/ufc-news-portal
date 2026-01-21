import dbConnect from '@/lib/mongodb';
import News from '@/models/News';
import { NextResponse } from 'next/server';

export async function GET(request) {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    try {
        if (id) {
            const news = await News.findById(id);
            if (!news) return NextResponse.json({ error: 'Notícia não encontrada' }, { status: 404 });
            return NextResponse.json(news);
        }
        const authorEmail = searchParams.get('authorEmail');
        const query = authorEmail ? { authorEmail } : {};

        const news = await News.find(query).sort({ publishDate: -1 });
        return NextResponse.json(news);
    } catch (error) {
        return NextResponse.json({ error: 'Falha ao buscar notícias' }, { status: 500 });
    }
}

export async function POST(request) {
    await dbConnect();
    try {
        const body = await request.json();

        // Basic validation
        if (!body.title || !body.content) {
            return NextResponse.json({ error: 'Título e conteúdo são obrigatórios' }, { status: 400 });
        }

        const news = await News.create({
            ...body,
            likes: 0,
            publishDate: new Date(),
        });

        return NextResponse.json(news, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Falha ao criar notícia' }, { status: 500 });
    }
}

export async function DELETE(request) {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 });
    }

    try {
        await News.findByIdAndDelete(id);
        return NextResponse.json({ message: 'News deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Falha ao excluir notícia' }, { status: 500 });
    }
}

export async function PUT(request) {
    await dbConnect();
    try {
        const body = await request.json();
        const { id, ...updateData } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 });
        }

        // If setting as featured, unset others first (single featured item policy)
        if (updateData.featured === true) {
            await News.updateMany({ _id: { $ne: id } }, { featured: false });
        }

        const news = await News.findByIdAndUpdate(id, updateData, { new: true });

        if (!news) {
            return NextResponse.json({ error: 'Notícia não encontrada' }, { status: 404 });
        }

        return NextResponse.json(news);
    } catch (error) {
        return NextResponse.json({ error: 'Falha ao atualizar notícia' }, { status: 500 });
    }
}
