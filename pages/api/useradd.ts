import {db, auth} from '@/lib/fireadmin';
import {getAuthorizationToken} from '@/lib/utils';
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST' && getAuthorizationToken(req) === process.env.NEXT_PUBLIC_API_SECRECY){
        try {
            let {uid, email, displayName, photoURL} = req.body;
            const docRef = db.collection('userFBEM').doc(uid);
            const doc = await docRef.get();
            let authuserReq = false;
            if (doc.exists){
                if (!doc.data()?.email && !email){
                    authuserReq = true; 
                }
            }else{
                if (!email){
                    authuserReq = true;
                }
            }
            if (authuserReq){
                const userRecord = await auth.getUser(uid);
                const userData = userRecord.providerData[0];
                email =  email || userData.email;
                displayName = displayName || userData.displayName;
                photoURL = photoURL || userData.photoURL;
            }
            if (!doc.exists){
                await docRef.set({email, displayName, photoURL, created: new Date().toISOString()});
            }else{
                const obj: {email?: string, displayName?: string, photoURL?: string} = {};
                if (!doc.data()?.email && email){
                    obj.email = email;
                }else if(doc.data()?.email && !email){
                    email = doc.data()?.email;
                }
                if (doc.data()?.displayName !== displayName){
                    obj.displayName = displayName;
                }
                if (doc.data()?.photoURL !== photoURL){
                    obj.photoURL = photoURL;
                }
                if (Object.keys(obj).length > 0){
                    await docRef.update(obj);
                }
            }
            res.status(200).json({uid, email, displayName, photoURL});
        }catch(error){
            res.status(400).end();
        }
    }else{
        res.status(200).end();
    }
}    
