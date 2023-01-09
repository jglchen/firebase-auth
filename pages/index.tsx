import Layout from '@/components/layout';

export default function Home() {
  
  return (
    <Layout>
    
       <div>
          <p>
              This example creates an authentication system that uses a{' '}
              <b>signed and encrypted cookie to store session data</b>. It uses current best practices as for authentication in the Next.js ecosystem, 
              we use <b>`useUser` custom hook</b>  together with `<a href="https://swr.vercel.app/">swr</a>` for data fetching.
          </p>

          <ul>
              <li>Firebase Authentication with Email/Password, Google Sign In, Facebook Sign In, GitHub Sign In, and Email Sign In available to authenticate users.</li>
              <li>The emails registered in Firebase Authentication are saved in a separate database for future data development of individual users, for this illustration Firestore Database.</li>
              <li>Session data is signed and encrypted in a cookie.</li>
          </ul>

       </div>
    </Layout>
    
  )
}
