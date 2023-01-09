import UserAuth from '@/components/userauth';
import fetchJson from '@/lib/fetchJson';
import styles from '@/styles/header.module.css';

export default function Header({user, mutateUser}: any) {
    return (
      <div className="small-container">
         {!user?.isLoggedIn && 
          <>
            <UserAuth />
            <hr />
          </>
         }
         {user?.isLoggedIn && 
            <div className={styles.signedInStatus}>
                <div className={styles.msg}>
                   Hi! <b>{user?.displayName || user.email}</b>
                </div>
                <button className="float-right" onClick={async () => {mutateUser(await fetchJson('/api/logout'), false);}}>Sign Out</button>
            </div>
         }
         <h1 className="text-center">
           Welcome to Firebase Authentication Illustration!
         </h1>
         <h5 className="text-right">
           React Native Expo Publish: <a href="https://exp.host/@jglchen/firebase-auth" target="_blank" rel="noreferrer">https://exp.host/@jglchen/firebase-auth</a>
         </h5>
      </div>
   );
}
