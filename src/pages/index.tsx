import BasicContainer from "@/components/BasicContainer";
import { Box, Card, CardContent, CardMedia, Container, Typography, useMediaQuery } from "@mui/material";
import { Post } from "@prisma/client";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { useUser } from "@/context/UserContext";

interface PostWithUser extends Post {
    User: {
        first_name: string;
        username: string;
        image_url?: string;
    };
}

export default function Page() {
    const [posts, setPosts] = useState<PostWithUser[]>([]);
    const isMobile = useMediaQuery('(max-width:600px)');
    const { user } = useUser();

    useEffect(() => {
        const getPosts = async () => {
            const storedPosts = localStorage.getItem('posts');
            if (storedPosts) {
                setPosts(JSON.parse(storedPosts));
            }

            const response = await fetch('/api/post');
            const posts = await response.json();
            // Ordenarlos por fecha
            posts.sort((a: PostWithUser, b: PostWithUser) => {
                return new Date(b.publication_date).getTime() - new Date(a.publication_date).getTime();
            });
            console.log(posts);

            // Only update if posts have changed or not already in localStorage
            if (!storedPosts || JSON.stringify(posts) !== storedPosts) {
                setPosts(posts);
                localStorage.setItem('posts', JSON.stringify(posts));
            }
        };

        if (user) {
            getPosts();
            window.addEventListener('postusercreated', getPosts);
        }
    }, [user]);

    return (
        <BasicContainer titlePage='Home'>
            {
                user ? (
                    <>
                        <Typography variant="h2" gutterBottom>Your community posts</Typography>
                        <Container maxWidth={isMobile ? 'lg' : 'sm'}
                            sx={{
                                padding: isMobile ? 0 : 4,
                                flexGrow: 1, // Asegurarse de que crezca para llenar el espacio disponible
                            }}
                        >
                            {posts.map(post => (
                                <Card key={post.post_id} sx={{ my: 2, backgroundColor: '#2a2f3a', color: '#ffffff' }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <CardMedia
                                                component="img"
                                                sx={{ width: 64, height: 64, borderRadius: '50%', mr: 2 }}
                                                image={post.User.image_url || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}
                                                alt={post.User.username}
                                            />
                                            <Box>
                                                <Typography variant="h6">{post.User.first_name}</Typography>
                                                <Typography variant="subtitle1">@{post.User.username}</Typography>
                                                <Typography variant="caption" color="textSecondary">
                                                    {formatDistanceToNow(new Date(post.publication_date))} ago
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Typography variant="h4" sx={{ mt: 2 }}>{post.title}</Typography>
                                        <Typography>{post.content}</Typography>
                                    </CardContent>
                                </Card>
                            ))}
                        </Container>
                    </>
                ) : (
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexGrow: 0.6,
                    }}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h2" gutterBottom>Welcome to the community</Typography>
                            <Typography variant="body1" gutterBottom>
                                Sign in to see the latest posts from your community
                            </Typography>
                        </Box>
                    </Box>
                )
            }
        </BasicContainer>
    );
}