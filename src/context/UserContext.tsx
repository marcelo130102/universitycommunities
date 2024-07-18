import { createContext, useContext, useEffect, useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { ReactNode } from 'react';
import { Session } from 'next-auth';
import { User } from '@prisma/client';

const UserContext = createContext<{ user: User | null; status: string; signIn: () => void; signOut: () => void }>({ user: null, status: '', signIn: () => { }, signOut: () => { } });

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const { data: session, status } = useSession();
    const [user, setUser] = useState<User | null>(null);

    const getUserBackend = async(session: Session) => {
        const backendUser = await fetch(`/api/user?email=${session.user?.email}`);
        const user = await backendUser.json();
        setUser(user);
    }

    useEffect(() => {
        const currentEmail = user?.email;
        const sessionEmail = session?.user?.email;

        if (sessionEmail && sessionEmail !== currentEmail) {
            // Set the user object if the user is authenticated and different from the current user
            getUserBackend(session);
        } else if (!sessionEmail) {
            // Clear the user object if the user is not authenticated
            setUser(null);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session?.user?.email]);

    const handleSignIn = () => {
        signIn('google');
    };

    const handleSignOut = () => {
        signOut();
        //Limpiar local storage
        localStorage.removeItem('posts');
        localStorage.removeItem('user');
    };

    return (
        <UserContext.Provider value={{ user, status, signIn: handleSignIn, signOut: handleSignOut }}>
            {children}
        </UserContext.Provider>
    );
};