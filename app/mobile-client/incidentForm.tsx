'use client'

import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { toast } from "sonner"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { API_CONSTANTS } from '@/constants/ApiConstants'

export const IncidentForm = () => {
    const [incidentType, setIncidentType] = useState('')


    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Incident type:', incidentType)
        let incidentStatus = 1;
        let severityLevel = 3;
        let userId = 141235;
        let latitude = 53.344250;
        let longitude = -6.262410;

        if(incidentType === ''){
            toast.error('Please select an incident type');
        } else {
            try {
                const res = await fetch(API_CONSTANTS.INCIDENTS, {
                    method: 'POST',
                    body: JSON.stringify({
                        userId: userId,
                        latitude: latitude,
                        longitude: longitude,
                        incidentTypeId: incidentType,
                        severityLevelId: severityLevel,
                        incidentStatusId: incidentStatus,
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                if (res.ok) {
                    toast.success('Incident Reported Successfully');
                } else {
                    toast.error((await res.json()).error)
                }
            } catch (error: any) {
                toast.error(error?.message)
            }
        }
        
    }

    return (

        <Card className="w-full">
            <CardHeader>
                <CardTitle>Report Incident</CardTitle>
                <CardDescription>Report an incident to the authorities</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={onSubmit} className="w-full flex flex-col gap-8 items-center justify-center">
                    <Select onValueChange={setIncidentType}>
                        <SelectTrigger className="w-[300px]">
                            <SelectValue placeholder="Select Type of Incident" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">Fire</SelectItem>
                            <SelectItem value="2">Flood</SelectItem>
                            <SelectItem value="3">Earthquake</SelectItem>
                            <SelectItem value="4">Accident</SelectItem>
                            <SelectItem value="5">Chemical Leak</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button disabled={incidentType === ''}>Report</Button>
                </form>
            </CardContent>
        </Card>
    )
}
