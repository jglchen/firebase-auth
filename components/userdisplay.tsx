import {useState} from 'react';
import utilStyle from '@/styles/utils.module.css';
import { User } from '@/lib/types';

export default function UserDisplay({user}: {user: User}) {
    const [imgerr, setImgerr] = useState(false);
    
    return (
     <div className="text-center">
        <h4>{user?.isLoggedIn ? 'You are logged in!': 'You are not logged in!'}</h4>
        {user?.isLoggedIn && (
            <div>
            {user?.photoURL && !imgerr &&
                 // eslint-disable-next-line @next/next/no-img-element
                 <img
                   src={user?.photoURL}
                   className={utilStyle.borderCircle}
                   width={250}
                   height={250}
                   onError={(e) => {setImgerr(true)}}
                   alt=""
                 />
            }
            {user?.displayName &&
                <div>{user?.displayName}</div>
            }
            {user?.email &&
                <div>{user?.email}</div>
            }
            </div>
        )}
     </div>
    );
} 
