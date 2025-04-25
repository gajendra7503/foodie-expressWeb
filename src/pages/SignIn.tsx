import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';


const AuthModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const [mode, setMode] = useState<'login' | 'signup' | 'forgot' | 'otp' | 'resetPassword'>('login');
    const [form, setForm] = useState({
        name: '', email: '', phone: '', password: '', confirmPassword: '', address: '', otp: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [otpTimer, setOtpTimer] = useState(60);
    const [verifiedEmail, setVerifiedEmail] = useState('');

    const timerRef = useRef(null);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        if (mode === 'otp' && otpTimer > 0) {
            timeoutId = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
            timerRef.current = timeoutId as any;
        }
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [otpTimer, mode]);
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [e.target.name]: e.target.value });

    const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isValidPhone = (phone: string) => /^[6789]\d{9}$/.test(phone);
    const isValidPassword = (password: string) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/.test(password);

    //   const handleSubmit = (e: React.FormEvent) => {
    //     e.preventDefault();
    //     if (mode === 'login') {
    //       // login logic
    //       if (!isValidEmail(form.email)) return toast.error('Invalid email');
    //       if (form.password.length < 6) return toast.error('Password too short');
    //       toast.success('Login successful!');
    //       onClose();
    //     } else if (mode === 'signup') {
    //       if (!form.name || !isValidEmail(form.email) || !isValidPhone(form.phone)) return toast.error('Invalid signup details');
    //       if (!isValidPassword(form.password) || form.password !== form.confirmPassword) return toast.error('Check password');
    //       toast.success('Signup successful!');
    //       setMode('otp');
    //     } else if (mode === 'forgot') {
    //       if (!isValidEmail(form.email)) return toast.error('Invalid email');
    //       toast.success('OTP sent to email');
    //       setMode('otp');
    //       setOtpTimer(60);
    //     } else if (mode === 'otp') {
    //       if (form.otp.length !== 6) return toast.error('Enter valid 6-digit OTP');
    //       toast.success('OTP verified');
    //       onClose();
    //     }
    //   };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        try {
            if (mode === 'login') {
                if (!isValidEmail(form.email)) return toast.error('Invalid email');
                if (form.password.length < 6) return toast.error('Password too short');
    
                const loginRes = await fetch('http://localhost:5000/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: form.email, password: form.password }),
                });
    
                const loginData = await loginRes.json();
                if (!loginRes.ok) throw new Error(loginData.message || 'Login failed');
    
                // Store token
                localStorage.setItem('token', loginData.token);
    
                // Decode token and get user ID
                const decoded: any = JSON.parse(atob(loginData.token.split('.')[1]));
                const userId = decoded.id;
    
                // Fetch user details
                const userRes = await fetch(`http://localhost:5000/api/auth/user/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${loginData.token}`,
                    },
                });
    
                const userData = await userRes.json();
                localStorage.setItem('user', JSON.stringify(userData));
    
                toast.success('Login successful! Redirecting...');
    
                setTimeout(() => {
                    navigate('/');
                }, 2000);
    
                onClose();
            }
    
            else if (mode === 'signup') {
                if (!form.name || !isValidEmail(form.email) || !isValidPhone(form.phone)) {
                    return toast.error('Invalid signup details');
                }
                if (!isValidPassword(form.password) || form.password !== form.confirmPassword) {
                    return toast.error('Check password');
                }
    
                const response = await fetch('http://localhost:5000/api/auth/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: form.name,
                        email: form.email,
                        phone: form.phone,
                        password: form.password,
                        address: form.address,
                    }),
                });
                const data = await response.json();
    
                if (!response.ok) throw new Error(data.message || 'Signup failed');
                toast.success('Signup successful!');
                setMode('login');
            }
    
            else if (mode === 'forgot') {
                if (!isValidEmail(form.email)) return toast.error('Invalid email');
    
                const response = await fetch('http://localhost:5000/api/auth/send-otp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: form.email }),
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.message || 'OTP failed');
    
                toast.success('OTP sent to your email');
                setVerifiedEmail(form.email);
                setMode('otp');
                setOtpTimer(60);
            }
    
            else if (mode === 'otp') {
                if (form.otp.length !== 6) return toast.error('Enter 6-digit OTP');
    
                const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: verifiedEmail, otp: form.otp }),
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.message || 'OTP verification failed');
    
                toast.success('OTP verified!');
                setMode('resetPassword');
            }
    
            else if (mode === 'resetPassword') {
                if (!isValidPassword(form.password) || form.password !== form.confirmPassword) {
                    return toast.error('Passwords must match and be valid');
                }
    
                const response = await fetch('http://localhost:5000/api/auth/reset-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: verifiedEmail,
                        password: form.password,
                    }),
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.message || 'Password reset failed');
    
                toast.success('Password updated! Please login');
                setMode('login');
                setForm({ email: '', password: '', confirmPassword: '', name: '', phone: '', address: '', otp: '' });
            }
        } catch (err: any) {
            toast.error(err.message || 'Something went wrong');
        }
    };
    


    const handleResend = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: form.email }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Resend failed');

            setOtpTimer(60);
            toast.info('OTP resent');
        } catch (error: any) {
            toast.error(error.message || 'Resend failed');
        }
    };


    if (!isOpen) return null;

    return createPortal(

        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-purple-200 to-blue-200 px-4">
            <h1 className="text-5xl font-extrabold text-gray-800 mb-4 drop-shadow-lg">
                Welcome to Foodie Express! 🍔🍕🍣
            </h1>
            <AnimatePresence>
                <motion.div
                    key="modal"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl p-6 w-full max-w-md"
                >
                    <button onClick={onClose} className="absolute top-3 right-4 text-gray-500">&times;</button>
                    <h2 className="text-2xl font-bold mb-4 text-center">
                        {mode === 'login' ? 'Login' :
                            mode === 'signup' ? 'Sign Up' :
                                mode === 'forgot' ? 'Forgot Password' :
                                    mode === 'otp' ? 'Verify OTP' :
                                        mode === 'resetPassword' ? 'Reset Password' : ''}
                    </h2>


                    <form onSubmit={handleSubmit} className="space-y-3">
                        {mode === 'signup' && (
                            <input name="name" placeholder="Name" value={form.name} onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" required />
                        )}
                        {(mode === 'login' || mode === 'signup' || mode === 'forgot') && (
                            <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" required />
                        )}
                        {mode === 'signup' && (
                            <input name="phone" placeholder="Phone" value={form.phone} maxLength={10} onChange={(e) => handleChange(e)}
                                className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" required />
                        )}
                        {(mode === 'login' || mode === 'signup') && (
                            <div className="relative">
                                <input
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    value={form.password}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 pr-10 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    required
                                />
                                <span
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
                                >
                                    👁️
                                </span>
                            </div>

                        )}
                        {mode === 'signup' && (

                            <div className="relative">
                                <input
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Confirm Password"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 pr-10 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    required
                                />
                                <span
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
                                >
                                    👁️
                                </span>
                            </div>

                        )}
                        {mode === 'signup' && (
                            <textarea
                                name="address"
                                placeholder="Address"
                                value={form.address}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                required
                            />

                        )}
                        {mode === 'otp' && (
                            <>
                                <input name="otp" placeholder="Enter OTP" value={form.otp} onChange={handleChange}
                                    className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" required />
                                <br />
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    disabled={otpTimer > 0}
                                    className={`text-sm mt-1 ${otpTimer > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-500 hover:underline'}`}
                                >
                                    {otpTimer > 0 ? `Resend OTP in ${otpTimer}s` : 'Resend OTP'}
                                </button>
                            </>
                        )}

                        {mode === 'resetPassword' && (
                            <><div className="relative">
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="New Password"
                                    value={form.password}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    required />
                                <span
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
                                >
                                    👁️
                                </span>
                            </div><div className="relative">
                                    <input
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm Password"
                                        value={form.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        required />
                                    <span
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
                                    >
                                        👁️
                                    </span>
                                </div></>
                        )}



                        <button
                            type="submit"
                            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            {mode === 'login'
                                ? 'Login'
                                : mode === 'signup'
                                    ? 'Sign Up'
                                    : mode === 'forgot'
                                        ? 'Send OTP'
                                        : mode === 'otp'
                                            ? 'Verify OTP'
                                            : 'Reset Password'}
                        </button>

                    </form>

                    <div className="mt-4 text-sm text-center">
                        {mode === 'login' && <span onClick={() => setMode('forgot')} className="cursor-pointer text-blue-500">Forgot Password?</span>}
                        {mode === 'login' ? (
                            <p>Don't have an account? <span onClick={() => setMode('signup')} className="text-blue-500 cursor-pointer">Sign Up</span></p>
                        ) : mode === 'signup' ? (
                            <p>Already have an account? <span onClick={() => setMode('login')} className="text-blue-500 cursor-pointer">Login</span></p>
                        ) : null}
                    </div>
                </motion.div>
            </AnimatePresence>
            <ToastContainer />
        </div>,
        document.body
    );
};

export default AuthModal;

// import React, { useState, useEffect, useRef } from 'react';
// import { createPortal } from 'react-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { useNavigate } from 'react-router-dom';

// const AuthModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
//     const [mode, setMode] = useState<'login' | 'signup' | 'forgot' | 'otp' | 'resetPassword'>('login');
//     const [form, setForm] = useState({
//         name: '', email: '', phone: '', password: '', confirmPassword: '', address: '', otp: ''
//     });
//     const [showPassword, setShowPassword] = useState(false);
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//     const [otpTimer, setOtpTimer] = useState(60);
//     const [verifiedEmail, setVerifiedEmail] = useState('');

//     const navigate = useNavigate();
//     const timerRef = useRef<NodeJS.Timeout | null>(null);

//     useEffect(() => {
//         if (mode === 'otp' && otpTimer > 0) {
//             const timeoutId = setTimeout(() => setOtpTimer(prev => prev - 1), 1000);
//             timerRef.current = timeoutId;
//         }
//         return () => {
//             if (timerRef.current) {
//                 clearTimeout(timerRef.current);
//             }
//         };
//     }, [otpTimer, mode]);

//     useEffect(() => {
//         const handleEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
//         window.addEventListener('keydown', handleEsc);
//         return () => window.removeEventListener('keydown', handleEsc);
//     }, [onClose]);

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [e.target.name]: e.target.value });

//     const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
//     const isValidPhone = (phone: string) => /^[6789]\d{9}$/.test(phone);
//     const isValidPassword = (password: string) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/.test(password);

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();

//         try {
//             if (mode === 'login') {
//                 if (!isValidEmail(form.email)) return toast.error('Invalid email');
//                 if (form.password.length < 6) return toast.error('Password too short');

//                 const loginRes = await fetch('http://localhost:5000/api/auth/login', {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({ email: form.email, password: form.password }),
//                 });

//                 const loginData = await loginRes.json();
//                 if (!loginRes.ok) throw new Error(loginData.message || 'Login failed');

//                 localStorage.setItem('token', loginData.token);

//                 const decoded: any = JSON.parse(atob(loginData.token.split('.')[1]));
//                 const userId = decoded.id;

//                 const userRes = await fetch(`http://localhost:5000/api/auth/user/${userId}`, {
//                     headers: {
//                         'Authorization': `Bearer ${loginData.token}`,
//                     },
//                 });

//                 const userData = await userRes.json();
//                 localStorage.setItem('user', JSON.stringify(userData));

//                 toast.success('Login successful! Redirecting...');

//                 setTimeout(() => {
//                     navigate('/');
//                 }, 2000);

//                 onClose();
//             } else if (mode === 'signup') {
//                 if (!form.name || !isValidEmail(form.email) || !isValidPhone(form.phone)) {
//                     return toast.error('Invalid signup details');
//                 }
//                 if (!isValidPassword(form.password) || form.password !== form.confirmPassword) {
//                     return toast.error('Check password');
//                 }

//                 const response = await fetch('http://localhost:5000/api/auth/signup', {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({
//                         name: form.name,
//                         email: form.email,
//                         phone: form.phone,
//                         password: form.password,
//                         address: form.address,
//                     }),
//                 });
//                 const data = await response.json();

//                 if (!response.ok) throw new Error(data.message || 'Signup failed');
//                 toast.success('Signup successful!');
//                 setMode('login');
//             } else if (mode === 'forgot') {
//                 if (!isValidEmail(form.email)) return toast.error('Invalid email');

//                 const response = await fetch('http://localhost:5000/api/auth/send-otp', {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({ email: form.email }),
//                 });
//                 const data = await response.json();
//                 if (!response.ok) throw new Error(data.message || 'OTP failed');

//                 toast.success('OTP sent to your email');
//                 setVerifiedEmail(form.email);
//                 setMode('otp');
//                 setOtpTimer(60);
//             } else if (mode === 'otp') {
//                 if (form.otp.length !== 6) return toast.error('Enter 6-digit OTP');

//                 const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({ email: verifiedEmail, otp: form.otp }),
//                 });
//                 const data = await response.json();
//                 if (!response.ok) throw new Error(data.message || 'OTP verification failed');

//                 toast.success('OTP verified!');
//                 setMode('resetPassword');
//             } else if (mode === 'resetPassword') {
//                 if (!isValidPassword(form.password) || form.password !== form.confirmPassword) {
//                     return toast.error('Passwords must match and be valid');
//                 }

//                 const response = await fetch('http://localhost:5000/api/auth/reset-password', {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({
//                         email: verifiedEmail,
//                         password: form.password,
//                     }),
//                 });
//                 const data = await response.json();
//                 if (!response.ok) throw new Error(data.message || 'Password reset failed');

//                 toast.success('Password updated! Please login');
//                 setMode('login');
//                 setForm({ email: '', password: '', confirmPassword: '', name: '', phone: '', address: '', otp: '' });
//             }
//         } catch (err: any) {
//             toast.error(err.message || 'Something went wrong');
//         }
//     };

//     const handleResend = async () => {
//         try {
//             const response = await fetch('http://localhost:5000/api/auth/send-otp', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ email: form.email }),
//             });

//             const data = await response.json();
//             if (!response.ok) throw new Error(data.message || 'Resend failed');

//             setOtpTimer(60);
//             toast.info('OTP resent');
//         } catch (error: any) {
//             toast.error(error.message || 'Resend failed');
//         }
//     };

//     if (!isOpen) return null;

//     return createPortal(
//         <>
//             <ToastContainer />
//             <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-purple-200 to-blue-200 px-4">
//                 <h1 className="text-5xl font-extrabold text-gray-800 mb-4 drop-shadow-lg">
//                     Welcome to Foodie Express! 🍔🍕🍣
//                 </h1>
//                 <AnimatePresence>
//                     <motion.div
//                         key="modal"
//                         initial={{ scale: 0.8, opacity: 0 }}
//                         animate={{ scale: 1, opacity: 1 }}
//                         exit={{ scale: 0.8, opacity: 0 }}
//                         transition={{ duration: 0.3 }}
//                         className="bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl p-6 w-full max-w-md"
//                     >
//                         <button onClick={onClose} className="absolute top-3 right-4 text-gray-500">&times;</button>
//                         <h2 className="text-2xl font-bold mb-4 text-center">
//                             {mode === 'login' ? 'Login' :
//                                 mode === 'signup' ? 'Sign Up' :
//                                     mode === 'forgot' ? 'Forgot Password' :
//                                         mode === 'otp' ? 'Verify OTP' :
//                                             mode === 'resetPassword' ? 'Reset Password' : ''}
//                         </h2>
//                         <form onSubmit={handleSubmit} className="space-y-3">
//                         {mode === 'signup' && (
//                             <input name="name" placeholder="Name" value={form.name} onChange={handleChange}
//                                 className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" required />
//                         )}
//                         {(mode === 'login' || mode === 'signup' || mode === 'forgot') && (
//                             <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange}
//                                 className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" required />
//                         )}
//                         {mode === 'signup' && (
//                             <input name="phone" placeholder="Phone" value={form.phone} maxLength={10} onChange={(e) => handleChange(e)}
//                                 className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" required />
//                         )}
//                         {(mode === 'login' || mode === 'signup') && (
//                             <div className="relative">
//                                 <input
//                                     name="password"
//                                     type={showPassword ? 'text' : 'password'}
//                                     placeholder="Password"
//                                     value={form.password}
//                                     onChange={handleChange}
//                                     className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 pr-10 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
//                                     required
//                                 />
//                                 <span
//                                     onClick={() => setShowPassword(!showPassword)}
//                                     className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
//                                 >
//                                     👁️
//                                 </span>
//                             </div>

//                         )}
//                         {mode === 'signup' && (

//                             <div className="relative">
//                                 <input
//                                     name="confirmPassword"
//                                     type={showConfirmPassword ? 'text' : 'password'}
//                                     placeholder="Confirm Password"
//                                     value={form.confirmPassword}
//                                     onChange={handleChange}
//                                     className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 pr-10 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
//                                     required
//                                 />
//                                 <span
//                                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                                     className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
//                                 >
//                                     👁️
//                                 </span>
//                             </div>

//                         )}
//                         {mode === 'signup' && (
//                             <textarea
//                                 name="address"
//                                 placeholder="Address"
//                                 value={form.address}
//                                 onChange={handleChange}
//                                 className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
//                                 required
//                             />

//                         )}
//                         {mode === 'otp' && (
//                             <>
//                                 <input name="otp" placeholder="Enter OTP" value={form.otp} onChange={handleChange}
//                                     className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" required />
//                                 <br />
//                                 <button
//                                     type="button"
//                                     onClick={handleResend}
//                                     disabled={otpTimer > 0}
//                                     className={`text-sm mt-1 ${otpTimer > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-500 hover:underline'}`}
//                                 >
//                                     {otpTimer > 0 ? `Resend OTP in ${otpTimer}s` : 'Resend OTP'}
//                                 </button>
//                             </>
//                         )}

//                         {mode === 'resetPassword' && (
//                             <><div className="relative">
//                                 <input
//                                     name="password"
//                                     type={showPassword ? "text" : "password"}
//                                     placeholder="New Password"
//                                     value={form.password}
//                                     onChange={handleChange}
//                                     className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
//                                     required />
//                                 <span
//                                     onClick={() => setShowPassword(!showPassword)}
//                                     className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
//                                 >
//                                     👁️
//                                 </span>
//                             </div><div className="relative">
//                                     <input
//                                         name="confirmPassword"
//                                         type={showConfirmPassword ? "text" : "password"}
//                                         placeholder="Confirm Password"
//                                         value={form.confirmPassword}
//                                         onChange={handleChange}
//                                         className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
//                                         required />
//                                     <span
//                                         onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                                         className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
//                                     >
//                                         👁️
//                                     </span>
//                                 </div></>
//                         )}



//                         <button
//                             type="submit"
//                             className="w-full rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
//                         >
//                             {mode === 'login'
//                                 ? 'Login'
//                                 : mode === 'signup'
//                                     ? 'Sign Up'
//                                     : mode === 'forgot'
//                                         ? 'Send OTP'
//                                         : mode === 'otp'
//                                             ? 'Verify OTP'
//                                             : 'Reset Password'}
//                         </button>

//                     </form>

//                     <div className="mt-4 text-sm text-center">
//                         {mode === 'login' && <span onClick={() => setMode('forgot')} className="cursor-pointer text-blue-500">Forgot Password?</span>}
//                         {mode === 'login' ? (
//                             <p>Don't have an account? <span onClick={() => setMode('signup')} className="text-blue-500 cursor-pointer">Sign Up</span></p>
//                         ) : mode === 'signup' ? (
//                             <p>Already have an account? <span onClick={() => setMode('login')} className="text-blue-500 cursor-pointer">Login</span></p>
//                         ) : null}
//                     </div>
//                     </motion.div>
//                 </AnimatePresence>
//             </div>
//         </>,
//         document.body
//     );
// };

// export default AuthModal;
