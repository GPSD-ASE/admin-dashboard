import "@/styles/globals.css"
import Link from 'next/link';
import { LoginForm } from "./form"
import gpsd_logo from '../../public/gpsd_logo.png';

export default function LoginPage() {
    return (
        <div>
            <header className="flex items-center h-16 px-4 border-b shrink-0 md:px-6">
                <div
                    className="flex items-center gap-2 text-lg font-semibold md:text-base">
                    <img alt="gpsd" src={gpsd_logo.src} className="h-12 w-12"></img>
                    <span>GPSD</span>
                </div>
            </header>
            <div className="login-form-height w-screen flex justify-center items-center">
                <div className="sm:shadow-xl px-8 pb-8 pt-12 sm:bg-white rounded-xl space-y-12">
                    <h1 className="font-semibold text-2xl">Sign in to your Account </h1>
                    <LoginForm />
                    <p className="text-center">
                        New User?{' '}
                        <Link className="text-indigo-500 hover:underline" href="/register">
                            Sign up
                        </Link>{' '}
                    </p>
                </div>
            </div>
        </div>
    )
}
