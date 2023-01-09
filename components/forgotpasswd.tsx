import { useState, useEffect, useRef, FormEvent } from 'react';
import validator from 'email-validator';
import firebase from '@/lib/firebase';
import loaderStyles from '@/styles/loader.module.css';

interface PropsType {
    signUpIn?: (act: number) => void;
    email?: string;
}

function ForgotPasswd(props: PropsType){
    const [email, setEmail] = useState('');
    const [emailerr, setEmailErr] = useState('');
    const [inPost, setInPost] = useState(false);
    const emailEl = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
       if (props.email){
           setEmail(props.email);
       }
    },[props.email]);

    function handleEmailChange(e: FormEvent<HTMLInputElement>){
        let { value } = e.currentTarget;
        //Remove all the markups to prevent Cross-site Scripting attacks
        value = value.replace(/<\/?[^>]*>/g, "");
        setEmail(value);
        setEmailErr('');
    }
    
    async function submitForm(){
        //Reset all the err messages
        setEmailErr('');
        //Check if Email is filled
        if (!email){
            setEmailErr("Please type your email, this field is required!");
            emailEl.current?.focus();
            return;
         }
         //Validate the email
         if (!validator.validate(email)){
             setEmailErr("This email is not a legal email.");
             emailEl.current?.focus();
             return;
         }
    
         const actionCodeSettings = {
            url: window.location.href,
            handleCodeInApp: true
         }
         
         setInPost(true);
         try {
            await firebase.auth().sendPasswordResetEmail(email, actionCodeSettings);
            toSignIn();
         }catch(error: any){
            setEmailErr('Error: ' + error.message);
         }
         setInPost(false);
    }

    function toSignIn(){
        if (props.signUpIn){
            props.signUpIn(0);
        }
    }
    
    function backFalse(){
        return false;
    }

    return (
        <div className={loaderStyles.container}>
            <h3 className="text-center">Forgot Password</h3>
            <form>
            <div className="mark" style={{color: 'red'}}>{emailerr}</div>
             <input
                type="text"
                name="email"
                id="email"
                value={email}
                placeholder="Email"
                ref={emailEl}
                onChange={handleEmailChange}    
              />
            </form>
            <div className="text-center" style={{padding: '0.2rem 0'}}>
                <a href="#" onClick={toSignIn} style={{cursor: 'pointer'}}>Back to Log In</a>
            </div>
            <div>
            <input type="button" style={{width: '100%'}} value="Send Password Reset Email" onClick={submitForm} />
            </div>
            {inPost &&
                  <div className={loaderStyles.loadermodal}>
                      <div className={`${loaderStyles.loader} ${loaderStyles.div_on_center}`} />
                  </div>
            }
        </div>
    );    

}

export default ForgotPasswd;