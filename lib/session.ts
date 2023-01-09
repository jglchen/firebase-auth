// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions
import type { IronSessionOptions } from 'iron-session';
import { User } from './types';
import getConfig from "next/config";
const { serverRuntimeConfig } = getConfig();

export const sessionOptions: IronSessionOptions = {
  password: serverRuntimeConfig.SECRET_COOKIE_PASSWORD as string,
  cookieName: 'iron-session/examples/next.js',
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    secure: serverRuntimeConfig.NODE_ENV === 'production',
  },
}

// This is where we specify the typings of req.session.*
declare module 'iron-session' {
  interface IronSessionData {
    user?: User
  }
}
