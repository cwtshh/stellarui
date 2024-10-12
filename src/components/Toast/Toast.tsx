import { toast } from "react-toastify";

interface ToastProps {
    message: string;
    type: "success" | "error" | "info" | "warning";
}

export const NotifyToast = (props: ToastProps) => {
    switch(props.type) {
        case "success": {
            toast.success(props.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
                progress: undefined,
            });
            break;
        }

        case "error": {
            toast.error(props.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
                progress: undefined,
            });
            break;
        }

        case "info": {
            toast.info(props.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
                progress: undefined,
            });
            break;
        }

        case "warning": {
            toast.warn(props.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
                progress: undefined,
            });
        }
    }
}