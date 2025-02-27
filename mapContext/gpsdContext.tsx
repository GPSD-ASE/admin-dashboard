'use client'
import { createContext, useContext, useState, ReactNode, SetStateAction, Dispatch } from "react";

interface MapContextType {
    markedIncidentVectorSource: number[],
    markedRoutesVectorSource: any[],
    incidentType: string,
    setMarkedIncidentVectorSource: Dispatch<SetStateAction<number[]>>,
    setMarkedRoutesVectorSource: Dispatch<SetStateAction<any[]>>
    setIncidentType: Dispatch<SetStateAction<string>>
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export const MapProvider = ({ children }: { children: ReactNode }) => {
    const [markedIncidentVectorSource, setMarkedIncidentVectorSource] = useState<number[]>([]);
    const [markedRoutesVectorSource, setMarkedRoutesVectorSource] = useState<any[]>([]);
    const [incidentType, setIncidentType] = useState('');


    return (
        <MapContext.Provider value={{ markedIncidentVectorSource, markedRoutesVectorSource,incidentType, setMarkedIncidentVectorSource, setMarkedRoutesVectorSource, setIncidentType }}>
            {children}
        </MapContext.Provider>
    );
};

export const useMap = () => {
    const context = useContext(MapContext);
    if (!context) throw new Error("useMap must be used within an MapProvider");
    return context;
};