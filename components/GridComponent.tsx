// components/GridComponent.tsx
"use client";

import { AgGridReact } from 'ag-grid-react';
import { useEffect, useState } from "react";
import type { ColDef } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

const GridComponent = () => {
    const [rowData, setRowData] = useState<any[]>([]);

    const [columnDefs, setColumnDefs] = useState<ColDef[]>([
        { field: "athlete" },
        { field: "age" },
        { field: "date" },
        { field: "country" },
        { field: "sport" },
        { field: "gold" },
        { field: "silver" },
        { field: "bronze" },
        { field: "total" },
    ]);

    useEffect(() => {
        fetch("https://www.ag-grid.com/example-assets/olympic-winners.json") // Fetch data from server
            .then((result) => result.json()) // Convert to JSON
            .then((rowData) => setRowData(rowData)); // Update state of `rowData`
    }, []);

    return (
        <div>
            <div style={{ width: "80vw", height: "90vh" }}>
                <AgGridReact rowData={rowData} columnDefs={columnDefs} />
            </div>
        </div>
    );
};

export default GridComponent;
