import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { BsStars } from 'react-icons/bs';
import logo from '../../assets/DPDF_Branca 1.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const { login, user } = useAuth();

    const emailInput = useRef<HTMLInputElement>(null);
    const passwordInput = useRef<HTMLInputElement>(null);

    const handleShowPass = () => {
        setShowPass(!showPass);
    }

    const handleLogin = async () => {
        if (!email || !password) {
            toast.error('Preencha todos os campos');
            return;
        }
        const success = await login({ email, password });
        if (success) {
            window.location.href = '/';
            return;
        }
    }

    useEffect(() => {
        emailInput.current?.focus();
    }, []); 

    useEffect(() => {
        if (user) {
            window.location.href = '/chat';
        }
    }, [user]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleLogin();
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        passwordInput.current?.focus(); 
    };

    return (
        <div className='flex flex-col gap-5 justify-center items-center h-screen w-full bg-primary'>
            <img className='w-56' src={logo} alt="" />
            <div className="card bg-base-100 w-96 shadow-xl">
                <div className="card-body">
                    <div className='flex flex-col gap-6'>
                        <div className='flex items-center gap-2'>
                            <h1 className='font-bold text-2xl'>Stellar</h1>
                            <BsStars className='text-3xl' />
                        </div>
                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text">Email:</span>
                            </div>
                            <input
                                ref={emailInput}
                                onChange={e => setEmail(e.target.value)}
                                type="text"
                                className="input input-bordered w-full max-w-xs"
                                onKeyDown={handleKeyDown}
                            />
                        </label>

                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text">Senha:</span>
                            </div>
                            <label className="input input-bordered flex items-center gap-2">
                                <input
                                    ref={passwordInput}
                                    onChange={handlePasswordChange}
                                    type={showPass ? 'text' : 'password'}
                                    className="grow"
                                    onKeyDown={handleKeyDown}
                                />
                                <button onClick={handleShowPass} className='text-lg'>
                                    {showPass ? <IoMdEye /> : <IoMdEyeOff />}
                                </button>
                            </label>
                        </label>
                        <button onClick={handleLogin} className='btn btn-primary'>Logar</button>
                    </div>
                </div>
            </div>

            <Link className='text-white hover:underline flex gap-1' to={'/register'}>Não tem conta? <p className='font-bold text-[#1384e3]' >Crie uma!</p></Link>
        </div>
    )
}

export default Login;
