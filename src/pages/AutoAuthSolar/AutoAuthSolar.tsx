import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { BASE_API_URL } from '../../utils/constants';
import axios from 'axios';

const AutoAuthSolar = () => {
    const { nome, email } = useParams();
    console.log(nome, email);

    const HandleAutoRegister = async() => {
        console.log('Cadastrando....')
        try {
            const response = await axios.post(`${BASE_API_URL}/user/login/solar`, {
                nome: nome,
                email: email
            });
            console.log(response.data);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        HandleAutoRegister()
    });

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