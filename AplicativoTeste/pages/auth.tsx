import Input from "@/components/Input";
import { useCallback, useState } from "react";
import axios from 'axios';
import { signIn } from 'next-auth/react'
import { getSession } from "next-auth/react"
import { NextPageContext } from "next"

export async function getServerSideProps(context: NextPageContext){
  const session = await getSession(context);
  
  if(session){
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  return {
    props: {}
  }

}


const Auth = () => {
  const [usuario, setUsuario] = useState('')
  const [senha, setSenha] = useState('')

  const login = useCallback(async () => {
    try {
      const result = await signIn('credentials', {
        usuario,
        senha,
        callbackUrl: '/'
      });
      if (result?.error) {
        throw new Error(result.error);
      }
    } catch (error) {
      console.log(error);
    }
  }, [usuario, senha]);
  

  const register = useCallback(async () => {
    try {
      await axios.post('/api/register', {
        usuario,
        senha,
      });
    } catch (error) {
        console.log(error);
    }
  }, [usuario, senha]);

  return (
    <div className="relative h-full w-full bg-[url('/images/factory-bg.jpg')] bg-no-repeat bg-center bg-fixed bg-cover">
      <div className="bg-black w-full h-full lg:bg-opacity-50">
        <nav className="px-12 py-5">

        </nav>
        <div className="flex justify-center">
          <div className="bg-black bg-opacity-70 px-16 py-16 self-center mt-2 lg:w-2/5 lg:max-w-md rounded-md w-full">
            <div className="flex flex-col items-center justify-items-center">
              <img src="/images/logo.png" alt="Logo" className="h-22 mb-8" />
            </div>
            <div className="flex flex-col gap-4"> 
              <Input
                label="Usuario"
                onChange={(ev: any) => setUsuario(ev.target.value)}
                id="usuario"
                type="usuario"
                value={usuario}
              />
              <Input
                label="Senha"
                onChange={(ev: any) => setSenha(ev.target.value)}
                id="senha"
                type="password"
                value={senha}
              />

            </div>
            <button onClick={login} className="bg-zinc-500 py-3 text-white rounded-md w-full mt-10 hover:bg-teal-500 hover:text-white transition">
              Entrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;