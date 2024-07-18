import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/utils/MyPrismaClient';// Asegúrate de importar Prisma de la manera correcta según tu estructura de proyecto

export default async function post(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { title, content, commentsAllowed, user_id } = req.body;
            const parsedId = parseInt(user_id, 10);
            const post = await prisma.post.create({
                data: {
                    User: { connect: { user_id: parsedId } },
                    title: title,
                    content: content,
                    comments_allowed: commentsAllowed,
                },
            });
            console.log(post)
            res.status(200).json(post);
        } catch (error) {
            console.error('Error creating post:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        } finally {
            await prisma.$disconnect();
        }
    }
    else if (req.method === 'GET') {
        try {
            const posts = await prisma.post.findMany({
                include: {
                    User: true, // Incluir los datos del usuario relacionados con cada post
                },
            });
            console.log(posts)
            res.status(200).json(posts);
        } catch (error) {
            console.error('Error retrieving posts:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        } finally {
            await prisma.$disconnect();
        }
    }
}