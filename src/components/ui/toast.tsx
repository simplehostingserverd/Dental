"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

interface Toast {
	id: string;
	type: "success" | "error" | "warning" | "info";
	title: string;
	message?: string;
	duration?: number;
}

interface ToastContextType {
	showToast: (toast: Omit<Toast, "id">) => void;
	removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const showToast = (toast: Omit<Toast, "id">) => {
		const id = Math.random().toString(36).substr(2, 9);
		const newToast: Toast = {
			...toast,
			id,
			duration: toast.duration || 5000,
		};

		setToasts(prev => [...prev, newToast]);

		// Auto remove after duration
		setTimeout(() => {
			removeToast(id);
		}, newToast.duration);
	};

	const removeToast = (id: string) => {
		setToasts(prev => prev.filter(toast => toast.id !== id));
	};

	return (
		<ToastContext.Provider value={{ showToast, removeToast }}>
			{children}
			<ToastContainer toasts={toasts} onRemove={removeToast} />
		</ToastContext.Provider>
	);
}

export function useToast() {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error("useToast must be used within a ToastProvider");
	}
	return context;
}

function ToastContainer({ 
	toasts, 
	onRemove 
}: { 
	toasts: Toast[]; 
	onRemove: (id: string) => void;
}) {
	if (toasts.length === 0) return null;

	return (
		<div className="fixed top-4 right-4 z-50 space-y-2">
			{toasts.map(toast => (
				<ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
			))}
		</div>
	);
}

function ToastItem({ 
	toast, 
	onRemove 
}: { 
	toast: Toast; 
	onRemove: (id: string) => void;
}) {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		// Trigger animation
		setTimeout(() => setIsVisible(true), 10);
	}, []);

	const handleRemove = () => {
		setIsVisible(false);
		setTimeout(() => onRemove(toast.id), 300);
	};

	const getIcon = () => {
		switch (toast.type) {
			case "success":
				return <CheckCircle className="h-5 w-5 text-green-600" />;
			case "error":
				return <XCircle className="h-5 w-5 text-red-600" />;
			case "warning":
				return <AlertCircle className="h-5 w-5 text-yellow-600" />;
			case "info":
				return <Info className="h-5 w-5 text-blue-600" />;
		}
	};

	const getBackgroundColor = () => {
		switch (toast.type) {
			case "success":
				return "bg-green-50 border-green-200";
			case "error":
				return "bg-red-50 border-red-200";
			case "warning":
				return "bg-yellow-50 border-yellow-200";
			case "info":
				return "bg-blue-50 border-blue-200";
		}
	};

	const getTitleColor = () => {
		switch (toast.type) {
			case "success":
				return "text-green-800";
			case "error":
				return "text-red-800";
			case "warning":
				return "text-yellow-800";
			case "info":
				return "text-blue-800";
		}
	};

	const getMessageColor = () => {
		switch (toast.type) {
			case "success":
				return "text-green-700";
			case "error":
				return "text-red-700";
			case "warning":
				return "text-yellow-700";
			case "info":
				return "text-blue-700";
		}
	};

	return (
		<div
			className={`
				transform transition-all duration-300 ease-in-out
				${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
				max-w-sm w-full shadow-lg rounded-lg border p-4
				${getBackgroundColor()}
			`}
		>
			<div className="flex items-start">
				<div className="flex-shrink-0">
					{getIcon()}
				</div>
				<div className="ml-3 w-0 flex-1">
					<p className={`text-sm font-medium ${getTitleColor()}`}>
						{toast.title}
					</p>
					{toast.message && (
						<p className={`mt-1 text-sm ${getMessageColor()}`}>
							{toast.message}
						</p>
					)}
				</div>
				<div className="ml-4 flex-shrink-0 flex">
					<button
						type="button"
						className={`
							inline-flex rounded-md p-1.5 transition-colors
							${toast.type === 'success' ? 'text-green-500 hover:bg-green-100' : ''}
							${toast.type === 'error' ? 'text-red-500 hover:bg-red-100' : ''}
							${toast.type === 'warning' ? 'text-yellow-500 hover:bg-yellow-100' : ''}
							${toast.type === 'info' ? 'text-blue-500 hover:bg-blue-100' : ''}
						`}
						onClick={handleRemove}
					>
						<span className="sr-only">Dismiss</span>
						<X className="h-4 w-4" />
					</button>
				</div>
			</div>
		</div>
	);
}

// Helper functions for common toast types
export const toast = {
	success: (title: string, message?: string, duration?: number) => {
		const context = useContext(ToastContext);
		if (context) {
			context.showToast({ type: "success", title, message, duration });
		}
	},
	error: (title: string, message?: string, duration?: number) => {
		const context = useContext(ToastContext);
		if (context) {
			context.showToast({ type: "error", title, message, duration });
		}
	},
	warning: (title: string, message?: string, duration?: number) => {
		const context = useContext(ToastContext);
		if (context) {
			context.showToast({ type: "warning", title, message, duration });
		}
	},
	info: (title: string, message?: string, duration?: number) => {
		const context = useContext(ToastContext);
		if (context) {
			context.showToast({ type: "info", title, message, duration });
		}
	},
};
