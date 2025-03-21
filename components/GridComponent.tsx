// components/GridComponent.tsx
"use client";

import { AgGridReact } from "ag-grid-react";
import { useEffect, useState, useCallback } from "react";
import type { ColDef } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"; // adjust the path as needed

ModuleRegistry.registerModules([AllCommunityModule]);

const GridComponent = () => {
  const [rowData, setRowData] = useState<any[]>([]);
  const [popupData, setPopupData] = useState<any>(null);
  const [popupVisible, setPopupVisible] = useState(false);

  useEffect(() => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((result) => result.json())
      .then((data) => setRowData(data));
  }, []);

  // When a row is double-clicked, save its data and open the popover.
  const onRowDoubleClicked = useCallback((params: any) => {
    setPopupData(params.data);
    setPopupVisible(true);
  }, []);

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

  return (
    <div style={{ width: "80vw", height: "90vh", position: "relative" }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={{ sortable: true, filter: true }}
        onRowDoubleClicked={onRowDoubleClicked}
      />

      <Popover open={popupVisible} onOpenChange={setPopupVisible}>
        {/* Dummy trigger positioned at the center */}
        <PopoverTrigger asChild>
          <div
            style={{
              width: 0,
              height: 0,
              position: "fixed",
              top: "50%",
              left: "50%",
            }}
          />
        </PopoverTrigger>
        <PopoverContent
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "20vw",
            maxWidth: "1200px",
            backgroundColor: "white",
            border: "2px solid #333",
            boxShadow: "0 0 10px rgba(0,0,0,0.5)",
            padding: "16px",
            zIndex: 1000,
            overflow: "auto",
            fontSize: "1rem",
          }}
        >
          <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1rem" }}>
            Detail Information
          </h2>
          <p>
            <strong>Athlete:</strong> {popupData?.athlete}
          </p>
          <p>
            <strong>Age:</strong> {popupData?.age}
          </p>
          <p>
            <strong>Date:</strong> {popupData?.date}
          </p>
          <p>
            <strong>Country:</strong> {popupData?.country}
          </p>
          <p>
            <strong>Sport:</strong> {popupData?.sport}
          </p>
          <p>
            <strong>Gold:</strong> {popupData?.gold}
          </p>
          <p>
            <strong>Silver:</strong> {popupData?.silver}
          </p>
          <p>
            <strong>Bronze:</strong> {popupData?.bronze}
          </p>
          <p>
            <strong>Total:</strong> {popupData?.total}
          </p>
          <button
            onClick={() => setPopupVisible(false)}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default GridComponent;

    );
};

export default GridComponent;
