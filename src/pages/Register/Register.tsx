import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify';
import { NotifyToast } from '../../components/Toast/Toast';
import axios from 'axios';
import { BASE_API_URL } from '../../utils/constants';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import logo from '../../assets/DPDF_Branca 1.png';
import { BsStars } from 'react-icons/bs';

const Register = () => {

    const [ name, setName ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ confirmPassword, setConfirmPassword ] = useState('');
    const [ showPass, setShowPass ] = useState(false);
    const [ error, setError ] = useState(false);
    const [ errorText, setErrorText ] = useState('');

    const handleRegister = async() => {
        if(!name || !email || !password || !confirmPassword) {
            NotifyToast({ message: 'Preencha todos os campos', type: 'error' });
            return;
        }
        await axios.post(`${BASE_API_URL}/user/create`, {
            name,
            email,
            password,
            role: 'user'
        }).then(res => {
            NotifyToast({ message: res.data.message, type: 'success' });
            window.location.href = '/login';
        }).catch(err => {
            err.response.data.errors.forEach((ind_error: string) => {
                NotifyToast({ message: ind_error, type: 'error' });
            })
        });
    };

    const handleShowPass = () => {
        setShowPass(!showPass);
    }

    useEffect(() => {
        if(password !== confirmPassword) {
            setError(true);
            setErrorText('As senhas não coicidem!');
            return;
        }
        setError(false);
    }, [password, confirmPassword])

    return (
        <div className='flex flex-col gap-5 justify-center items-center h-screen w-full bg-primary'>
            <img className='w-56' src={logo} alt="" />
            <div className="card bg-base-100 w-96 shadow-xl">
                <div className="card-body">
                    <div className='flex flex-col gap-5'>
                        <div className='flex items-center gap-2'>
                            <h1 className='font-bold text-2xl'>Stellar</h1>
                            <BsStars className='text-3xl' />
                        </div>

                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text">Nome:</span>
                            </div>
                            <input onChange={e => setName(e.target.value)} type="text" className="input input-bordered w-full max-w-xs" />
                        </label>

                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text">Email:</span>
                            </div>
                            <input onChange={e => setEmail(e.target.value)} type="text" className="input input-bordered w-full max-w-xs" />
                        </label>

                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text">Senha:</span>
                            </div>
                            <label className="input input-bordered flex items-center gap-2">
                                <input onChange={e => setPassword(e.target.value)} type={ showPass ? 'text' : 'password'} className="grow" />
                                <button onClick={() => handleShowPass()} className='text-lg'>
                                    { showPass ? <IoMdEye /> : <IoMdEyeOff /> }
                                </button>
                            </label>
                        </label>

                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text">Confirmar Senha:</span>
                            </div>
                            <label className="input input-bordered flex items-center gap-2">
                                <input onChange={e => setConfirmPassword(e.target.value)} type={ showPass ? 'text' : 'password'} className="grow" />
                                <button onClick={() => handleShowPass()} className='text-lg'>
                                    { showPass ? <IoMdEye /> : <IoMdEyeOff /> }
                                </button>
                            </label>
                        </label>
                        
                        <div className='h-[25px]'>
                            { error ? (
                                <p className='font-bold'>As senhas não coicidem!</p>
                            ) : (<></>)}
                        </div>

                        <button onClick={() => handleRegister()} className='btn btn-primary'>Criar Conta</button>
                    </div>
                </div>
            </div>

            <p className='text-white'>Já tem conta? <Link className='font-bold text-[#1384e3]' to={'/login'}>Entrar!</Link></p>
        </div>
    )
}

export default Register