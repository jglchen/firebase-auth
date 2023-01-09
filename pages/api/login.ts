import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '@/lib/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { User } from '@/lib/types';

async function loginRoute(req: NextApiRequest, res: NextApiResponse< User | Error>) {
    if (req.method === 'POST'){
        try {
            const user = { isLoggedIn: true, ...req.body };
            req.session.user = user;
            await req.session.save();
            res.status(200).json(user);
        }catch(error){
            res.status(500).json(error as Error);
        }

    }else{
        res.status(200).end();
    }
}

export default withIronSessionApiRoute(loginRoute, sessionOptions);
