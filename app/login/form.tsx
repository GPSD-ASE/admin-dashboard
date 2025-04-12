'use client'

import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { API_CONSTANTS } from '@/constants/ApiConstants'
import { setCookie } from "cookies-next";
import { useAuth } from '@/authContext/authContext'
import { toast } from 'sonner'

export const LoginForm = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const { login } = useAuth();


    const router = useRouter();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        

        try {
            const res = await fetch(API_CONSTANTS.LOGIN, {
                method: 'POST',
                body: JSON.stringify({
                    username: username,
                    password: password
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            let response = await res.json();
            if (res.ok) {
                login(response.user.username);
                setCookie('Token', response.token);
                localStorage.setItem("userId", response.user.id);
                toast.success(response.message);
                router.push('/home');
            } else {
                setError(response.error)
            }
        } catch (error: any) {
            setError(error?.error)
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-12 w-full sm:w-[400px]">
            <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="username">Username</Label>
                <Input
                    className="w-full"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    id="username"
                    type="username"
                    maxLength={20}
                />
            </div>
            <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                    className="w-full"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    id="password"
                    type="password"
                />
            </div>
            {error && <Alert>{error}</Alert>}
            <div className="w-full">
                <Button className="w-full" size="lg">
                    Login 
                </Button>
            </div>
        </form>
    )
}
