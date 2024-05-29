# Firebase Authentication

This example creates an authentication system that uses a **signed and encrypted cookie to store session data**. It uses current best practices as for authentication in the Next.js ecosystem, we use **`useUser` custom hook**  together with [swr](https://swr.vercel.app/) for data fetching.
   
- Firebase Authentication with Email/Password, Google Sign In, GitHub Sign In, and Email Sign In available to authenticate users.
- The emails registered in Firebase Authentication are saved in a separate database for future data development of individual users, for this illustration Firestore Database.
- Session data is signed and encrypted in a cookie.
      
**iOS** and **Android** mobile apps are also delivered. The apps are developed with **React Native**, anyone who is interested can test the development builds with [iOS Simulator Build](https://expo.dev/accounts/jglchen/projects/firebase-auth/builds/da8ba431-1739-4dd2-8735-2a2a65836d18) and [Android Internal Distribution Build](https://expo.dev/accounts/jglchen/projects/firebase-auth/builds/987f6f8c-d8bd-41f0-95d0-43be634e3bf2). If the build storage link has expired, please go to [https://projects-jglchen.vercel.app/en/contact](https://projects-jglchen.vercel.app/en/contact) to request build files.


### [View the App](https://firebase-auth-rust.vercel.app)
### [App GitHub](https://github.com/jglchen/firebase-auth)
### Docker: docker run -p 3000:3000 jglchen/firebase-auth
### [iOS Simulator Build](https://expo.dev/accounts/jglchen/projects/firebase-auth/builds/da8ba431-1739-4dd2-8735-2a2a65836d18)
### [Android Internal Distribution Build](https://expo.dev/accounts/jglchen/projects/firebase-auth/builds/987f6f8c-d8bd-41f0-95d0-43be634e3bf2)
### [React Native GitHub](https://github.com/jglchen/react-native-firebase-auth)
