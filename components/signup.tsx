import { useState, useRef, FormEvent } from 'react';
import validator from 'email-validator';
import passwordValidator from 'password-validator';
import axios from 'axios';
import apiconfig from '@/lib/apiconfig';
import firebase from '@/lib/firebase';
import loaderStyles from '@/styles/loader.module.css';

interface PropsType {
    signUpIn?: (act: number) => void;
}

function UserSignUp(props: PropsType){
    const initialState = {
        email: '',
        password: ''
    }
    const [user, setUser] = useState(initialState);
    const [password2, setPassWd2] = useState('');
    const [emailerr, setEmailErr] = useState('');
    const emailEl = useRef<HTMLInputElement | null>(null);
    const [passwderr, setPassWdErr] = useState('');
    const passwdEl = useRef<HTMLInputElement | null>(null);
    const passwd2El = useRef<HTMLInputElement | null>(null);
    const [inPost, setInPost] = useState(false);
     
    function resetForm(){
        setUser(initialState);
        setPassWd2('');
        resetErrMsg();
    }
      
    function handleChange(e: FormEvent<HTMLInputElement>){
        let { value, name } = e.currentTarget;
        //Remove all the markups to prevent Cross-site Scripting attacks
        value = value.replace(/<\/?[^>]*>/g, "");
        setUser(prevState => ({ ...prevState, [name]: value }));
        resetErrMsg();
    }
 
    function handlePassWd2Change(e: FormEvent<HTMLInputElement>){
        let passwd2 = e.currentTarget.value;
        //Remove all the markups to prevent Cross-site Scripting attacks
        passwd2 = passwd2.replace(/<\/?[^>]*>/g, "");
        setPassWd2(passwd2);
        resetErrMsg();
    }
 
    function resetErrMsg(){
       setEmailErr('');
       setPassWdErr('');
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
         setEmailErr("This email is not validated OK, please enter a legal email.");
         emailEl.current?.focus();
         return;
      }
      //Check if Passwd is filled
      if (!user.password || !password2){
         setPassWdErr("Please type your password, this field is required!");
         if (!user.password){
            passwdEl.current?.focus();
         }else{
            passwd2El.current?.focus();
         }
         return;
      }
      //Check the passwords typed in the two fields are matched
      if (user.password != password2){
         setPassWdErr("Please retype your passwords, the passwords you typed in the two fields are not matched!");
         passwdEl.current?.focus();
         return;
      }

      //Check the validity of password
      let schema = new passwordValidator();
      schema
      .is().min(8)                                    // Minimum length 8
      .is().max(100)                                  // Maximum length 100
      .has().uppercase()                              // Must have uppercase letters
      .has().lowercase()                              // Must have lowercase letters
      .has().digits(2)                                // Must have at least 2 digits
      .has().not().spaces();                          // Should not have spaces
      if (!schema.validate(user.password)){
         setPassWdErr("The password you typed is not enough secured, please retype a new one. The password must have both uppercase and lowercase letters as well as minimum 2 digits.");
         passwdEl.current?.focus();
         return;
      }
      
      setInPost(true);
      try {
         const authUser = await firebase.auth().createUserWithEmailAndPassword(user.email , user.password);
         const uid = authUser.user?.uid;
         const email = authUser.user?.email;
         const displayName = authUser.user?.displayName;
         const photoURL = authUser.user?.photoURL;

         //Prepare actionCodeSettings
         const actionCodeSettings = {
            url: window.location.href,
            handleCodeInApp: true
         }
         //Send EmailVerification Mail
         firebase.auth().currentUser?.sendEmailVerification(actionCodeSettings);
         if (uid){
            await axios.post('/api/useradd', {uid, email, displayName, photoURL}, apiconfig);
         }
         const instructInf = 'Congratulation! You have successfully registered this account. We are sending you an email to verify the email address. If you do not receive the email, just log in to the account, we will lead you to ask to resend the email.';
         setEmailErr(instructInf);
         setTimeout(() => {
           if (props.signUpIn){
               toSignIn();
           }else{
               resetForm();
           }}, 5000);   
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
    
    return (
        <div className={loaderStyles.container}>
            <h3 className="text-center">Please Sign Up</h3>
            <form>
                <div className="mark" style={{color: 'red'}}>{emailerr}</div>
                <input
                    type="text"
                    name="email"
                    value={user.email}
                    placeholder="Email"
                    ref={emailEl}
                    onChange={handleChange}    
                />

                <div className="mark" style={{color: 'red'}}>{passwderr}</div>
                <input
                    type="password"
                    name="password"
                    value={user.password}
                    placeholder="Password"
                    ref={passwdEl}
                    onChange={handleChange}    
                />
                <input
                    type="password"
                    name="password2"
                    value={password2}
                    placeholder="Please type password again"
                    ref={passwd2El}
                    onChange={handlePassWd2Change}    
                />
            </form>   
            <input type="button" value="Sign Up" onClick={submitForm} /> 
            <input type="reset" value="Reset" onClick={resetForm} />
            {props.signUpIn &&<button className="muted-button" onClick={toSignIn}>Log In</button>}
            {inPost &&
                  <div className={loaderStyles.loadermodal}>
                      <div className={`${loaderStyles.loader} ${loaderStyles.div_on_center}`} />
                  </div>
            }
        </div>
   );

}  

export default UserSignUp;