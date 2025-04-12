// components/GridComponent.tsx
"use client";

import { AgGridReact } from "ag-grid-react";
import { useEffect, useState, useCallback } from "react";
import type { ColDef } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"; // adjust the path as needed
import { API_CONSTANTS } from "@/constants/ApiConstants";
import { toast } from "sonner";
import { Button } from '@/components/ui/button'

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

ModuleRegistry.registerModules([AllCommunityModule]);

const GridComponent = () => {
  const [rowData, setRowData] = useState<any[]>([]);
  const [popupData, setPopupData] = useState<any>(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [incidentStatus, setIncidentStatus] = useState<String>("");

  useEffect(() => {
    populateGrid();
  }, []);

  const fetchData = async (userId: any) => {

    let url = API_CONSTANTS.GET_USER + userId;
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + getCookie('Token')
      }
    })
    let response = await res.json();
    if (response.id == userId) {
      return response.username;
    }
  }

  const incidentStatusLookup: any = {
    '1': "Open",
    '2': "In Progress",
    '3': "Verified",
    '4': "Resolved",
    '5': "Cancelled"
  }

  const formatDateTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const populateGrid = async () => {
    try {
      const res = await fetch(API_CONSTANTS.INCIDENTS, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + getCookie('Token')
        }
      })
      let response = await res.json();
      if (res.ok) {
        let userData = response;
        const updatedUsers = await Promise.all(
          userData.map(async (user: any) => {
            const username = await fetchData(user.userId);
            return {
              ...user,
              username,
              createdAt: formatDateTime(user.createdAt),
              updatedAt: formatDateTime(user.updatedAt),

            };
          })
        );
        setRowData(updatedUsers)
      } else {
        toast.error(response.error);
      }
    } catch (error: any) {
      toast.error(error?.message)
    }
  }

  const getCookie = (name: any) => {
    const value = `; ${document.cookie}`;
    const parts: any = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  // When a row is double-clicked, save its data and open the popover.
  const onRowDoubleClicked = useCallback((params: any) => {
    setPopupData(params.data);
    setIncidentStatus(params.data.incidentStatus);
    setPopupVisible(true);
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (incidentStatusLookup[incidentStatus.toString()]) {
      let url = API_CONSTANTS.PATCH_INCIDENT(popupData.incidentId) + incidentStatusLookup[incidentStatus.toString()];
      try {
        const res = await fetch(url, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getCookie('Token')
          }
        })
        let response = await res.json();
        if (res.ok) {
          toast.success("Incident Status updated successfully");
          setPopupData(null);
          setPopupVisible(false);
          setIncidentStatus("");
          populateGrid();
        } else {
          toast.error(response.message);
          setPopupData(null);
          setPopupVisible(false);
          setIncidentStatus("");
        }
      } catch (error: any) {
        console.log(error)
      }
    } else {
      setPopupData(null);
      setPopupVisible(false);
      setIncidentStatus("");
    }

  }

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "incidentId", hide: true },
    { field: "incidentType", headerName: "Incident Type" },
    { field: "severityLevel", headerName: "Severity Level" },
    { field: "incidentStatus", headerName: "Incident Status" },
    { field: "injuredCount", headerName: "Injured Count" },
    { field: "affectedCount", headerName: "Affected Count" },
    { field: "radius", headerName: "Radius of the Incident" },
    { field: "geoName", headerName: "Location Address" },
    { field: "username", headerName: "Reported User" },
    { field: "createdAt", headerName: "Created Date" },
    { field: "updatedAt", headerName: "Updated Date" },
    { field: "notes", headerName: "Notes" },

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
            width: "30vw",
            maxWidth: "60vw",
            backgroundColor: "white",
            border: "2px solid #333",
            padding: "1rem",
            zIndex: 1000,
            overflow: "auto",
            fontSize: "1rem",
          }}
        >
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Modify Incident</CardTitle>
              <CardDescription>Modify the Status of the Incident</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="w-full flex flex-col gap-8 items-center justify-center">
                <Select onValueChange={setIncidentStatus}>
                  <SelectTrigger className="w-[300px]">
                    <SelectValue placeholder="Select Type of Incident" />
                  </SelectTrigger>
                  <SelectContent className="z-[9999]">
                    <SelectItem value="1">Open</SelectItem>
                    <SelectItem value="2">In Progress</SelectItem>
                    <SelectItem value="3">Verified</SelectItem>
                    <SelectItem value="4">Resolved</SelectItem>
                    <SelectItem value="5">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex flex-row gap-4">
                  <Button value="submit">Report</Button>
                </div>

              </form>
            </CardContent>
          </Card>


        </PopoverContent>
      </Popover>
    </div>
  );
};


export default GridComponent;
