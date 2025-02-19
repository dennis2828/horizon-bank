import { PlaidLinkOnSuccess, PlaidLinkOptions, usePlaidLink } from "react-plaid-link"
import { Button } from "./ui/button"
import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createLinkToken, exchangePublicToken } from "@/lib/actions/user.actions"
import Image from "next/image"

const PlaidLink = ({user, variant}: PlaidLinkProps) => {
    
    const router = useRouter();

    const [token, setToken] = useState('');


    useEffect(()=>{
        const getLinkToken = async () =>{
            const data = await createLinkToken(user);

            setToken(data?.linkToken);
        }
        getLinkToken();
    }, []);
    
    const onSuccess = useCallback<PlaidLinkOnSuccess>(async (public_token: string) =>{
        await exchangePublicToken({publicToken: public_token, user});
        router.push('/');
    }, [user]);

    const config: PlaidLinkOptions = {
        token,
        onSuccess,
    }

    const {open, ready} = usePlaidLink(config);

  return (
    <>
        {variant === 'primary' ? (
            <Button onClick={()=>open()} disabled={!ready} className="plaidlink-primary">Connect bank</Button>
        ): variant === 'ghost' ? (
            <Button variant="ghost" className="plaidlink-ghost" onClick={()=>open()}><Image src="/icons/connect-bank.svg" alt="bank" width={24} height={24} /> <p className="hidden xl:block text-[16px] font-semibold text-black-2">Connect Bank</p></Button>
        ): (
            <Button onClick={()=>open()} className="plaidlink-default"><Image src="/icons/connect-bank.svg" alt="bank" width={24} height={24} /> <p className="text-[16px] font-semibold text-black-2">Connect Bank</p></Button>
        )}
    </>
  )
}

export default PlaidLink
