import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext';

const AutoAuthSolar = () => {
    const { nome, email } = useParams();
    const { auto_login_solar } = useAuth();
    console.log(nome, email);

    const HandleAutoRegister = async() => {
        if (nome && email) {
            auto_login_solar(nome, email);
            
        }
    }

    useEffect(() => {
        if(nome === undefined || email === undefined) {
            window.location.href = '/login';
        }
        HandleAutoRegister()
    }, []);

    return (
        <div className='bg-primary h-full w-full text-white flex flex-col items-center justify-center'>
            <div className='flex flex-col items-center gap-5'>
                <h1 className='font-bold text-3xl'>Aguarde...</h1>
                <p>O sistema está realizando seu cadastro automaticamente.</p>
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        </div>
    )
}

export default AutoAuthSolar