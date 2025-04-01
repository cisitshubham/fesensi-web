import { Toaster, toast } from 'react-hot-toast';

export const Toast = () => <Toaster position="top-center" />;

export const showToast = (message: string, type: "success" | "error" | "info") => {
	if (type === "success") {
		toast.success(message);
	} else if (type === "error") {
		toast.error(message);
	} else {
		toast(message);
	}
};

export default Toast;
