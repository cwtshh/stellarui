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
    update: (id: string, updateData: Partial<UserType>) => Promise<void>;
    auto_login_solar: (nome: string, email: string) => Promise<void>;
    showSideBar: boolean;
    handleShowSideBar: () => void;
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
    const [ error_count, setErrorCount ] = useState(0);
    const [showSideBar, setShowSideBar] = useState(false)

    const handleShowSideBar = () =>{
        if(showSideBar){
            setShowSideBar(false)
        }else{
            setShowSideBar(true)
        }
    }

    const login = async(login_data: LoginData ) => {
        let success = false;
        await axios.post(`${BASE_API_URL}/user/login`, login_data, { withCredentials: true }).then((res: any) => {
            localStorage.setItem('stellar@auth_user', JSON.stringify(res.data.user));
            setUser(res.data.user);
            success = true;
            NotifyToast({ message: res.data.message, type: 'success' });
        }).catch(err => {
            NotifyToast({ message: err.response.data.errors[0], type: 'error' });
            success = false;
        })
        return success;
    };

    const logout = async() => {
        await axios.post(`${BASE_API_URL}/user/logout`, { withCredentials: true }).then((res: any) => {
            localStorage.removeItem('stellar@auth_user');
            setUser(null);
            NotifyToast({ message: res.data.message, type: 'success' });
            window.location.href = '/login';
        }).catch(() => {
            NotifyToast({ message: 'Erro interno do servidor, verifique sua conexão tente novamente mais tarde', type: 'error' });
        })
    };

    const auto_login_solar = async(nome: string, email: string) => {
        await axios.post(`${BASE_API_URL}/user/login/solar`, {
            nome: nome,
            email: email
        }).then((res: any) => {
            localStorage.setItem('stellar@auth_user', JSON.stringify(res.data.user));
            setUser(res.data.user);
            NotifyToast({ message: res.data.message, type: 'success' });
            window.location.href = '/chat';
        }).catch((error) => {
            if(error_count === 0) {
                NotifyToast({ message: error.response.data.message, type: 'error' });
                setErrorCount(1);
            }
            setTimeout(() => {
                window.location.href = '/login';
            }, 4000); // Redireciona após 3 segundos
        })
    };

    const update = async (id: string, updateData: Partial<UserType>) => {
        return axios.put(`${BASE_API_URL}/user/update/${id}`, updateData, { withCredentials: true })
            .then((res: any) => {
                localStorage.setItem('stellar@auth_user', JSON.stringify(res.data.user));
                setUser(res.data.user); 
                NotifyToast({ message: 'Usuário atualizado com sucesso.', type: 'success' });
            })
            .catch(() => {
                NotifyToast({ message: 'Erro ao atualizar usuário.', type: 'error' });
            });
    };

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
            update, 
            logout,
            auto_login_solar,
            showSideBar,
            handleShowSideBar,
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
