import useUser from '@/lib/useUser';
import Head from 'next/head';
import Header from './header';
import UserDisplay from './userdisplay';

export default function Layout({ children}: {children: JSX.Element}) {
    const { user, mutateUser } = useUser();
    
    return (
        <>
           <Head>
             <title>Welcome to Firebase Authentication Illustration!</title>
             <link rel="icon" href="/favicon.ico" />
           </Head>
           <Header 
              user={user}
              mutateUser={mutateUser} 
             />
           <main>
              <div className="small-container">{children}</div>
           </main>
           <UserDisplay user={user} />
        </>
    );
}
