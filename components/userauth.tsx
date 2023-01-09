import { useState, useEffect, HTMLAttributes, CSSProperties } from 'react';
import { useWindowSize } from '@react-hook/window-size'
import UserLogIn from './userlogin';
import UserSignUp from './signup';
import ForgotPasswd from './forgotpasswd';

function UserAuth(props: any){
   const [width, height] = useWindowSize();
   const designWidth = 600;
   const paddingWidth = 20;
   const [signAct, setSignAct] = useState(0);
   const [email, setEmail] = useState('');
   const [styleOption, setStyleOption] = useState<CSSProperties>({
      backgroundColor: '#f8f8f8',
      padding: `0 ${paddingWidth}px ${paddingWidth}px ${paddingWidth}px`,
      zIndex: 100,
      position: 'fixed', 
      top: 0,
      overflow: 'auto'
   });

   useEffect(() => {
       const panelWidth = width > designWidth ? designWidth: width;
       const left = width > designWidth ? (width - designWidth)/2: 0;
         setStyleOption(prevState => ({...prevState, width: panelWidth, left: left, maxHeight: height}));     
   },[width, height]);
    
   function signActSelect(act: number, em?: string){
      if (typeof em !== 'undefined'){
         setEmail(em);
      }
      setSignAct(act);
   }

   let actionEl;
   switch (signAct){
      case 2:
         actionEl = <ForgotPasswd signUpIn={signActSelect} email={email} />;
         break;
      case 1:
         actionEl = <UserSignUp signUpIn={signActSelect} />;
         break;
      default:
         actionEl = <UserLogIn signUpIn={signActSelect} />; 
         break; 
   }
   
   return (<div style={styleOption}>
             {actionEl}
       </div>
   );
}

export default UserAuth;
