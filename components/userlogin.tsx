import { useState, useEffect, useRef, FormEvent } from 'react';
import validator from 'email-validator';
import firebase from '@/lib/firebase';
import "firebase/compat/auth";
import 'firebaseui/dist/firebaseui.css';
import useUser from '@/lib/useUser';
import fetcher from '@/lib/fetchJson';
import axios from 'axios';
import apiconfig from '@/lib/apiconfig';
import loaderStyles from '@/styles/loader.module.css';
import headerStyles from '@/styles/header.module.css';

interface PropsType {
    signUpIn?: (act: number, em?: string) => void;
}

function UserLogIn(props: PropsType){
    const { mutateUser } = useUser();
    const initialState = {
        email: '',
        password: ''
    };
    const [user, setUser] = useState(initialState);
    const [emailerr, setEmailErr] = useState('');
    const emailEl = useRef<HTMLInputElement | null>(null);
    const [passwderr, setPassWdErr] = useState('');
    const passwdEl = useRef<HTMLInputElement | null>(null);
    const [inPost, setInPost] = useState(false);
    const [mailVerify, setMailVerify] = useState(false);
    const firebaseUIRef = useRef(null);
 
    useEffect(() => {
        async function loadFirebaseui(){
            try {
                const firebaseui = await import("firebaseui");
                const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth());
                const uiConfig = {
                    callbacks: {
                      signInSuccessWithAuthResult: function (authResult: any, redirectUrl: any) {
                        // Handle the result
                        const user = authResult.user; 
                        const uid = user.uid;
                        const email = user.email;
                        const displayName = user.displayName;
                        const photoURL = user.photoURL;
                        //mutateUser(fetcher('/api/login', {uid, email, displayName, photoURL}), false);
                        //Login user data
                        fetcher('/api/login', {uid, email, displayName, photoURL})
                        .then((data) => {
                            mutateUser(data, false);
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                        //Login user data with database saved data
                        axios.post('/api/useradd', {uid, email, displayName, photoURL}, apiconfig)
                        .then((userData) => {
                            fetcher('/api/login', userData.data)
                            .then((data) => {
                                mutateUser(data, false);
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                        })
                        .catch((error) => {
                            console.error(error);
                        })
          
                        loadFirebaseui();
                        return false;
                      },
                    },
                    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
                    signInFlow: 'popup',    
                    signInSuccessUrl: '/',
                    signInOptions: [
                      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
                      //firebase.auth.TwitterAuthProvider.PROVIDER_ID,
                      firebase.auth.GithubAuthProvider.PROVIDER_ID,
                      {
                         provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
                         signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD
                      },
                    ],
                    // Other config options...
                    tosUrl: 'https://www.google.com',
                    privacyPolicyUrl: 'https://www.google.com'
                }  
                ui.start(firebaseUIRef.current as any, uiConfig);
            }catch(error){
                //----
            }
        }
          
        loadFirebaseui();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);
    
    function handleChange(e: FormEvent<HTMLInputElement>){
        let { value, name } = e.currentTarget;
        //Remove all the markups to prevent Cross-site Scripting attacks
        value = value.replace(/<\/?[^>]*>/g, "");
        setUser(prevState => ({ ...prevState, [name]: value }));
        resetErrMsg();
    }
    
    function resetErrMsg(){
        setEmailErr('');
        setPassWdErr('');
        setMailVerify(false);
    }

    function resetForm(){
        setUser(initialState);
        resetErrMsg();
    }

    async function submitForm(){
        //Reset all the err messages
        resetErrMsg();
        //Check if Email is filled
        if (!user.email){
            setEmailErr("Please type your email, this field is required!");
            emailEl.current?.focus();
            return;
         }
         //Validate the email
         if (!validator.validate(user.email)){
             setEmailErr("This email is not a legal email.");
             emailEl.current?.focus();
             return;
         }
         //Check if Passwd is filled
         if (!user.password){
             setPassWdErr("Please type your password, this field is required!");
             passwdEl.current?.focus();
             return;
         }

         setInPost(true);
         try {
            const authUser = await firebase.auth().signInWithEmailAndPassword(user.email , user.password)
            if (authUser.user?.emailVerified){
                const uid = authUser.user.uid;
                const email = authUser.user.email;
                const displayName = authUser.user.displayName;
                const photoURL = authUser.user.photoURL;
                //Login user data
                mutateUser(await fetcher('/api/login', {uid, email, displayName, photoURL}), false);
                //Login user data with database saved data
                const {data} = await axios.post('/api/useradd', {uid, email, displayName, photoURL}, apiconfig);
                mutateUser(await fetcher('/api/login', data), false);
            }else{
                const recommendinf = 'You have not verified your email. Please click the link on the mail we sent for the verification. If you have not received our email, please click the button below to resend the mail.';
                setEmailErr(recommendinf);
                setMailVerify(true);
            }
         }catch(error: any){
            setEmailErr('Error: ' + error.message);
         }
         setInPost(false);
        
    }

    function toSignUp(){
        if (props.signUpIn){
            props.signUpIn(1);
        }
    } 

    function toForgotPasswd(){
        if (props.signUpIn){
            props.signUpIn(2, user.email);
        }
    } 

    function sendEmailVerification(){
         //Prepare actionCodeSettings
         const actionCodeSettings = {
            url: window.location.href,
            handleCodeInApp: true
         }
         //Send EmailVerification Mail
         firebase.auth().currentUser?.sendEmailVerification(actionCodeSettings);
    }
    
    return (
        <div className={loaderStyles.container}>
            <h3 className="text-center">Please Log In</h3>
            <form>
             <div className="mark" style={{color: 'red'}}>{emailerr}</div>
             <input
                type="text"
                name="email"
                id="email"
                value={user.email}
                placeholder="Email"
                ref={emailEl}
                onChange={handleChange}    
              />
             <div className="mark" style={{color: 'red'}}>{passwderr}</div>
             <input
                type="password"
                name="password"
                id="password"
                value={user.password}
                placeholder="Password"
                ref={passwdEl}
                onChange={handleChange}    
              />
            </form>
            <div className="text-center" style={{padding: '0.2rem 0'}}>
                <a onClick={toForgotPasswd} style={{cursor: 'pointer'}}>Forgot Password?</a>
            </div>
            <div>
               <input type="button" value="Log In" onClick={submitForm} />
               <input type="reset" value="Reset" onClick={resetForm} />
               {mailVerify && <button className="muted-button" onClick={() => sendEmailVerification()}>Send Verifying Email</button>}
               {props.signUpIn && !mailVerify && <button className="muted-button" onClick={toSignUp}>Sign Up</button>}
            </div>
            <h5 className={headerStyles.centermark}><span>Or</span></h5>
            <div ref={firebaseUIRef}></div>
            {inPost &&
                <div className={loaderStyles.loadermodal}>
                    <div className={`${loaderStyles.loader} ${loaderStyles.div_on_center}`} />
                </div>
            }
        </div>
    );    
}

export default UserLogIn;