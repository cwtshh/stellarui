import { createContext, useContext, useEffect, useState } from "react";
import { ReactNode } from "react";
import { UserType } from "../utils/types/UserType";
import axios from "axios";
import { BASE_API_URL } from "../utils/constants";
import { NotifyToast } from "../components/Toast/Toast";



interface AuthContextType {
    user: UserType | null;
    login: (login_data: LoginData) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

interface LoginData {
    email: string;
    password: string;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [ user, setUser ] = useState<UserType | null>(null);
    const [ ready, setReady] = useState(false);

    const login = async(login_data: LoginData ) => {
        let success = false;
        await axios.post(`${BASE_API_URL}/user/login`, login_data, { withCredentials: true }).then( res => {
            localStorage.setItem('stellar@auth_user', JSON.stringify(res.data.user));
            setUser(res.data.user);
            success = true;
            NotifyToast({ message: res.data.message, type: 'success' });
        }).catch(err => {
            console.log(err);
            NotifyToast({ message: err.response.data.errors[0], type: 'error' });
            success = false;
        })
        return success;
    };

    const logout = async() => {
        await axios.post(`${BASE_API_URL}/user/logout`, { withCredentials: true }).then( res => {
            localStorage.removeItem('stellar@auth_user');
            setUser(null);
            NotifyToast({ message: res.data.message, type: 'success' });
            window.location.href = '/login';
        }).catch(err => {
            console.log(err);
            NotifyToast({ message: 'Erro interno do servidor, verifique sua conexão tente novamente mais tarde', type: 'error' });
        })
    }

    useEffect(() => {
        const user = localStorage.getItem('stellar@auth_user');
        if(user) {
            setUser(JSON.parse(user));
        }
        setReady(true);
    }, [])
    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout
        }}>
            { ready ? children : null }
        </AuthContext.Provider>
    )
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
};

export default AuthContext;