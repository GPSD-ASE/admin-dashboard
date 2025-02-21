'use client'

import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { useRouter } from 'next/navigation'


export const LoginForm = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)

    const router = useRouter();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        router.push('/dashboard');
        

        // try {
        //     const res = await fetch('/api/register', {
        //         method: 'POST',
        //         body: JSON.stringify({
        //             username,
        //             password,
        //             paymentPlan,
        //             profileURL
        //         }),
        //         headers: {
        //             'Content-Type': 'application/json'
        //         }
        //     })
        //     if (res.ok) {
        //         redirect('/login');
        //     } else {
        //         setError((await res.json()).error)
        //     }
        // } catch (error: any) {
        //     setError(error?.message)
        // }
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
