import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { NotifyToast } from '../../components/Toast/Toast';
import axios from 'axios';
import { BASE_API_URL } from '../../utils/constants';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import logo from '../../assets/DPDF_Branca 1.png';
import { BsStars } from 'react-icons/bs';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState(false);
    const [errorText, setErrorText] = useState('');

    // Criação de referências para os campos de entrada
    const nameInput = useRef<HTMLInputElement>(null);
    const emailInput = useRef<HTMLInputElement>(null);
    const passwordInput = useRef<HTMLInputElement>(null);
    const confirmPasswordInput = useRef<HTMLInputElement>(null);

    const [debouncedPassword, setDebouncedPassword] = useState('');
    const [debouncedConfirmPassword, setDebouncedConfirmPassword] = useState('');

    // Efeito para focar no campo de Nome ao carregar o componente
    useEffect(() => {
        nameInput.current?.focus();
    }, []);

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            NotifyToast({ message: 'Preencha todos os campos', type: 'error' });
            return;
        }
        await axios.post(`${BASE_API_URL}/user/create`, {
            name,
            email,
            password,
            role: 'user'
        }).then((res: any) => {
            NotifyToast({ message: res.data.message, type: 'success' });
            window.location.href = '/login';
        }).catch(err => {
            err.response.data.errors.forEach((ind_error: string) => {
                NotifyToast({ message: ind_error, type: 'error' });
            });
        });
    };

    const handleShowPass = () => {
        setShowPass(!showPass);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleRegister();
        }
    };

    const debounce = (callback: () => void, delay: number) => {
        let timer: NodeJS.Timeout;
        return (...args: any) => {
            clearTimeout(timer);
            timer = setTimeout(() => callback(...args), delay);
        };
    };
    

    const validatePassword = () => {
        if (debouncedPassword.length < 6) {
            setError(true);
            setErrorText('A senha deve ter no mínimo 6 caracteres.');
            return;
        }
        if (debouncedConfirmPassword !== '' && debouncedPassword !== debouncedConfirmPassword) {
            setError(true);
            setErrorText('As senhas não coincidem!');
            return;
        }
        setError(false);
        setErrorText('');
    };
    
    useEffect(() => {
        validatePassword();
    }, [debouncedPassword, debouncedConfirmPassword]);
    
    const handlePasswordChange = debounce((value: string) => {
        setPassword(value);
        setDebouncedPassword(value);
    }, 500);
    
    const handleConfirmPasswordChange = debounce((value: string) => {
        setConfirmPassword(value);
        setDebouncedConfirmPassword(value);
    }, 500);

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
                            <input
                                ref={nameInput}
                                onKeyDown={handleKeyDown}
                                onChange={e => setName(e.target.value)}
                                type="text"
                                className="input input-bordered w-full max-w-xs"
                            />
                        </label>

                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text">Email:</span>
                            </div>
                            <input
                                ref={emailInput}
                                onKeyDown={handleKeyDown}
                                onChange={e => setEmail(e.target.value)}
                                type="text"
                                className="input input-bordered w-full max-w-xs"
                            />
                        </label>

                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                            {error && confirmPassword.length > 0 ? ( 
                                    <span className="label-text text-red-500">* Senha:</span>
                                ) :(
                                    <span className="label-text">Senha:</span>
                                )
                            }
                            </div>
                            <label
                                className={`input input-bordered flex items-center gap-2 ${
                                    error && password.length > 0 ? 'border-red-500 border-2' : ''
                                }`}
                            >
                                <input
                                    ref={passwordInput}
                                    onKeyDown={handleKeyDown}
                                    onChange={(e) => handlePasswordChange(e.target.value)}
                                    type={showPass ? 'text' : 'password'}
                                    className="grow"
                                />
                                <button onClick={handleShowPass} className="text-lg">
                                    {showPass ? <IoMdEye /> : <IoMdEyeOff />}
                                </button>
                            </label>
                        </label>

                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                {error && confirmPassword.length > 0 ? ( 
                                    <span className="label-text text-red-500">* Confirmar Senha:</span>
                                ) :(
                                    <span className="label-text">Confirmar Senha:</span>
                                )
                            }
                            </div>
                            <label
                                className={`input input-bordered flex items-center gap-2 ${
                                    error && confirmPassword.length > 0 ? 'border-red-500 border-2' : ''
                                }`}
                            >
                                <input
                                    ref={confirmPasswordInput}
                                    onKeyDown={handleKeyDown}
                                    onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                                    type={showPass ? 'text' : 'password'}
                                    className="grow"
                                />
                                <button onClick={handleShowPass} className="text-lg">
                                    {showPass ? <IoMdEye /> : <IoMdEyeOff />}
                                </button>
                            </label>
                        </label>

                        <div className='h-[25px] text-center'>
                            {error && (
                                <p className='font-bold text-red-600'>{errorText}</p>
                            )}
                        </div>

                        <button onClick={handleRegister} className='btn btn-primary'>Criar Conta</button>
                    </div>
                </div>
            </div>

            <Link to={'/login'} className='text-white flex gap-1 hover:underline'>Já tem conta? <p className='font-bold text-[#1384e3]'> Entrar!</p></Link>
        </div>
    );
}

export default Register;
