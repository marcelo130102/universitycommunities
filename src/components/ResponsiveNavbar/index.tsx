import React, { useContext, useState } from 'react';
import {
    AppBar,
    Toolbar,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    useMediaQuery,
    styled,
    Fab,
    Box,
    Avatar,
} from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PersonIcon from '@mui/icons-material/Person';
import styles from '../../styles/ResponsiveNavbar.module.css';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { headers_names } from '@/utils/headers_names';
import { useUser } from '@/context/UserContext';
import Image from 'next/image';
import AddPostDialog from '../AddPostDialog';
import Link from 'next/link';

const drawerWidth = 240;

const StyledFab = styled(Fab)({
    position: 'absolute',
    zIndex: 1,
    top: -30,
    left: 0,
    right: 0,
    margin: '0 auto',
});

function ResponsiveNavbar({ children }: React.PropsWithChildren<{}>) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [openAddPostDialog, setOpenAddPostDialog] = useState(false);
    const isMobile = useMediaQuery('(max-width:600px)');
    const router = useRouter();
    const { user, status, signIn, signOut } = useUser();

    const handleOpenAddPostDialog = () => {
        setOpenAddPostDialog(true);
    }

    const handleCloseAddPostDialog = () => {
        setOpenAddPostDialog(false);
    }
    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const drawerContent = (
        <div>
            {
                isMobile && (
                    <Toolbar />
                )
            }
            <List>
                <Link href="/" style={{
                    textDecoration: 'none',
                    color: 'inherit',
                }}
                onClick={() => setDrawerOpen(false)}
                >
                    <ListItem button key="Home">
                        <ListItemIcon>
                            <HomeIcon />
                        </ListItemIcon>
                        <ListItemText primary="Home" />
                    </ListItem>
                </Link>
                {
                    status !== 'unauthenticated' ? (
                        <>
                            <Link href="/settings" style={{
                                textDecoration: 'none',
                                color: 'inherit',
                            }}
                            onClick={() => setDrawerOpen(false)}
                            >
                                <ListItem button key="Settings">
                                    <ListItemIcon>
                                        <SettingsIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Settings" />
                                </ListItem>
                            </Link>
                        </>
                    )
                        : (
                            <ListItem button key="About us">
                                <ListItemIcon>
                                    <InfoIcon />
                                </ListItemIcon>
                                <ListItemText primary="About us" />
                            </ListItem>
                        )
                }
            </List>
        </div>
    );

    return (
        <div className={styles.root}>
            {/* AppBar */}
            <Head>
                <title>{
                    headers_names.find(header => header.url === router.pathname)?.name
                }</title>
            </Head>
            <AppBar position="fixed" className={styles.appBar}>
                <Toolbar>
                    <Box sx={{ flexGrow: 1 }}>
                        <IconButton
                            edge="start"
                            className={styles.menuButton}
                            color="inherit"
                            aria-label="menu"
                            onClick={toggleDrawer}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Box>

                    {
                        status === 'authenticated' ? (
                            <IconButton
                                edge="end"
                                color="inherit"
                                aria-label="menu"
                                onClick={signOut}
                            >
                                <Avatar alt={user?.first_name || 'User'} sx={{
                                    width: 34,
                                    height: 34,
                                }}>
                                    <Image alt={user?.first_name || 'User'} src={user?.image_url || '/default-profile.jpg'} width={34} height={34} />
                                </Avatar>
                            </IconButton>
                        ) : (
                            <IconButton
                                edge="end"
                                color="inherit"
                                aria-label="menu"
                                onClick={signIn}
                            >
                                <PersonIcon />
                            </IconButton>
                        )
                    }
                </Toolbar>
            </AppBar>

            {/* Drawer */}
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                    },
                    ...(isMobile && {
                        display: 'block',
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            position: 'fixed',
                            top: 0,
                        },
                    }),
                    ...(!isMobile && {
                        display: 'block',
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            position: 'fixed',
                            top: 64, // Adjust top position for desktop view
                        },
                    }),
                }}
                variant="temporary"
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer}
            >
                {drawerContent}
            </Drawer>

            {/* Main Content */}
            <main className={styles.content}>
                <Toolbar />
                {children}
            </main>

            {/* Bottom Navigation (for mobile) */}
            {isMobile && (
                <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
                    <Toolbar>
                        {
                            status === 'authenticated' && (
                                <StyledFab color="secondary" aria-label="add" onClick={handleOpenAddPostDialog}>
                                    <AddIcon />
                                </StyledFab>
                            )
                        }
                        <Box sx={{ flexGrow: 1 }} />
                        <IconButton color="inherit">
                            <SearchIcon />
                        </IconButton>
                        <IconButton color="inherit">
                            <MoreVertIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
            )}
            <AddPostDialog open={openAddPostDialog} handleClose={handleCloseAddPostDialog} fullScreen={isMobile} user_id={user?.user_id as number} />
        </div>
    );
}

export default ResponsiveNavbar;