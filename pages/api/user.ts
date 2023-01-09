import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '@/lib/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { User } from '@/lib/types';

async function userRoute(req: NextApiRequest, res: NextApiResponse<User>) {
    if (req.session.user) {
      res.json({
        ...req.session.user,
        isLoggedIn: true,
      });
    } else {
      res.json({
        isLoggedIn: false,
      });
    }
}    

export default withIronSessionApiRoute(userRoute, sessionOptions);