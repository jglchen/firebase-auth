import { useRouter } from 'next/router';
import { isMobile } from 'react-device-detect';

const FirebaseAuthRedirect = () => {
    const router = useRouter()
    let redirectUrl;
    const queryParams = [];
    for (let [name, value] of Object.entries(router.query)) {
        if (name === 'redirectUrl'){
            redirectUrl = value;
        }else{
            queryParams.push(`${name}=${encodeURIComponent(value as string)}`);
        }
    }
    let queryStr = '';
    if (queryParams.length > 0){
        queryStr = '?' + queryParams.join('&');
    }

    const url = new URL(redirectUrl as string, 'https://localhost');
    if (redirectUrl){
        if (!isMobile && !(url.protocol == 'https:' || url.protocol == 'http:')){
            router.push('/'+queryStr);
        }else{
            router.push(redirectUrl+queryStr);
        }
    }

    return <div></div>;
}   

export default FirebaseAuthRedirect;
