"use client"

import { View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { Map as OlMap } from "ol";
import React, { useEffect, useRef, useState } from "react";
import "ol/ol.css";
import { fromLonLat, toLonLat } from "ol/proj";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Circle as CircleGeom } from "ol/geom";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";
import Circle from "ol/style/Circle";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import { Select as OlSelect } from "ol/interaction";
import { click } from "ol/events/condition";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'


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
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import { Button } from '@/components/ui/button'
import FullScreen from "ol/control/FullScreen";
import { API_CONSTANTS } from "@/constants/ApiConstants";


type MarkerType = "NoSelection" | "markSafeZones" | "RemoveMarker";

const markerStyles: Record<MarkerType, Style> = {
    RemoveMarker: new Style({
        image: new Icon({
            src: "https://upload.wikimedia.org/wikipedia/commons/e/ec/RedDot.svg",
            scale: 0.05,
        }),
    }),
    NoSelection: new Style({
        image: new Icon({
            src: "https://upload.wikimedia.org/wikipedia/commons/e/ec/RedDot.svg",
            scale: 0.05,
        }),
    }),
    markSafeZones: new Style({
        image: new Circle({
            radius: 8,
            fill: new Fill({ color: "green" }),
            stroke: new Stroke({ color: "white", width: 2 }),
        }),
    })

};

const incidentTypeLookup: any = {
    '1': "Fire",
    '2': "Flood",
    '3': "Earthquake",
    '4': "Accident",
    '5': "Chemical Leak"
}

interface IncidentLocation {
    incident_type: string;
    incident_type_id: number;
    longitude: number;
    latitude: number;
    radius: number; // Radius in kilometers

}

function Map() {
    const mapRef = useRef(null);
    const [selectedMarker, setSelectedMarker] = useState<MarkerType>("NoSelection");
    const [vectorSource] = useState(new VectorSource());
    const [routeSource] = useState(new VectorSource());
    const [popupVisible, setPopupVisible] = useState(false);
    const [safeZones, setSafeZones] = useState<any[]>([]);
    const [selectedZone, setSelectedZone] = useState<any[]>([]);
    const [zonepopoverCoords, setZonePopoverCoords] = useState<[number, number] | null>(null);
    const [zonepopupVisible, setZonePopupVisible] = useState(false);
    const [zoneName, setZoneName] = useState("");

    const [markedIncidentVectorSource, setMarkedIncidentVectorSource] = useState<number[]>([]);
    const [incidentType, setIncidentType] = useState('');



    const [incidentlocations, setIncidentLocations] = useState<IncidentLocation[]>([]);
    const [selectedIncident, setSelectedIncident] = useState<IncidentLocation | null>(null);
    const [popoverCoords, setPopoverCoords] = useState<[number, number] | null>(null);
    const router = useRouter();



    useEffect(() => {
        getIncidentZones();
        getSafeZones();
    }, []);


    useEffect(() => {
        if (!mapRef.current) return;

        const osmLayer = new TileLayer({
            source: new OSM(),
        });

        const vectorLayer = new VectorLayer({
            source: vectorSource,
        });

        const incidentmarkerSource = new VectorSource();

        const circleSource = new VectorSource();

        const incidentmarkerLayer = new VectorLayer({
            source: incidentmarkerSource,
            declutter: true
        });

        const safeZoneSource = new VectorSource();
        const safeZoneLayer = new VectorLayer({
            source: safeZoneSource,
        });



        const circleLayer = new VectorLayer({
            source: circleSource,
            style: new Style({
                stroke: new Stroke({ color: "red", width: 2 }),
                fill: new Fill({ color: "rgba(255,0,0,0.2)" }),
            }),
        });

        const routeLayer = new VectorLayer({
            source: routeSource,
            style: new Style({
                stroke: new Stroke({
                    color: "blue", // Route color
                    width: 3,
                }),
            }),
        });

        const map = new OlMap({
            target: mapRef.current,
            layers: [osmLayer, circleLayer, routeLayer, incidentmarkerLayer, safeZoneLayer, vectorLayer],
            view: new View({
                center: [0, 0],
                zoom: 5,
            }),
        });

        if (safeZones && safeZones.length > 0) {
            safeZones.forEach((zone: any) => {
                const coords = fromLonLat([zone.zone_lon, zone.zone_lat]);
                const feature = new Feature(new Point(coords));
                feature.setStyle(markerStyles.markSafeZones);
                feature.set("zoneData", zone); // store data for click
                safeZoneSource.addFeature(feature);
            });
        }





        if (incidentlocations && incidentlocations.length > 0) {
            incidentlocations.forEach(loc => {
                const pointCoords = fromLonLat([loc.longitude, loc.latitude]);


                // Create a marker
                const markerFeature = new Feature({ geometry: new Point(pointCoords) });
                markerFeature.setStyle(
                    new Style({
                        image: new Circle({
                            radius: 8,
                            fill: new Fill({ color: "black" }),
                            stroke: new Stroke({ color: "white", width: 2 }),
                        }),
                    })
                );

                incidentmarkerSource.addFeature(markerFeature);

                const circleFeature = new Feature(new CircleGeom(pointCoords, loc.radius));

                circleSource.addFeature(circleFeature);

            });
        }


        // Get user location - remove this and zoom in on ireland
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLon = position.coords.longitude;
                    const userLat = position.coords.latitude;

                    // Create a Point Marker
                    const marker = new Feature({
                        geometry: new Point(fromLonLat([userLon, userLat])),
                    });

                    // Style the marker with an icon
                    marker.setStyle(
                        new Style({
                            image: new Circle({
                                radius: 0,
                                fill: new Fill({ color: "green" }),
                                stroke: new Stroke({ color: "white", width: 2 }),
                            }),
                        })
                    );

                    // Clear old markers and add new one
                    vectorSource.addFeature(marker);

                    // Center and zoom the map
                    map.getView().setCenter(fromLonLat([userLon, userLat]));
                    map.getView().setZoom(11);
                },
                (error) => {
                    console.error("Error getting geolocation:", error.message);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }



        map.on("singleclick", (event) => {
            let featureFound = false;
            map.forEachFeatureAtPixel(event.pixel, (feature) => {
                // Check if this is a Safe Zone
                const zoneData = feature.get("zoneData");
                if (zoneData) {
                    setZonePopoverCoords(event.pixel as [number, number]);
                    setSelectedZone(zoneData);
                    setZonePopupVisible(true);
                    featureFound = true;
                    return true;
                }
                const geometry = feature.getGeometry();
                if (geometry instanceof Point) {
                    const clickedCoord = geometry.getCoordinates();
                    const clickedLonLat = toLonLat(clickedCoord);

                    const roundTo4 = (num: number) => Math.round(num * 10000) / 10000;

                    const clickedIncident: any = incidentlocations.find(
                        (incident) =>
                            roundTo4(incident.longitude) === roundTo4(clickedLonLat[0]) &&
                            roundTo4(incident.latitude) === roundTo4(clickedLonLat[1])
                    );

                    if (clickedIncident) {
                        setSelectedIncident(clickedIncident);
                        setPopoverCoords(event.pixel as [number, number]);
                        setPopupVisible(true);
                        featureFound = true;
                        return true;
                    } else {
                        toast.error("No matching incident found.");
                    }
                }
                return false;
            });
            if (featureFound) return;

            if (selectedMarker === "markSafeZones") {
                const coordinates = event.coordinate;
                const newMarker = new Feature({
                    geometry: new Point(coordinates),
                });
                let coord = toLonLat(coordinates);
                if (markedIncidentVectorSource.length == 0) {
                    newMarker.setStyle(markerStyles[selectedMarker]);
                    setMarkedIncidentVectorSource(coord);
                    vectorSource.addFeature(newMarker);
                } else {
                    toast.error("Cannot select more than one incident on the map")
                }
            }

        });



        // **Remove markers on click**
        const selectInteraction = new OlSelect({
            condition: click, // Detect click event
        });

        selectInteraction.on("select", (event) => {
            event.selected.forEach((feature) => {
                vectorSource.removeFeature(feature);
                setMarkedIncidentVectorSource([]);
            });
        });



        map.addInteraction(selectInteraction);
        map.addControl(new FullScreen({}));

        return () => map.setTarget(null!);
    }, [vectorSource, incidentlocations, safeZones, selectedMarker]);

    const getSafeZones = async () => {
        try {
            const res = await fetch(API_CONSTANTS.SAFEZONES, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + getCookie('Token')
                }
            })
            let response = await res.json()
            if (res.ok) {
                setSafeZones(response);
            } else {
                toast.error(response.error);
            }
        } catch (error: any) {
            toast.error(error?.message)
        }
    }

    const getIncidentZones = async () => {
        try {

            const res = await fetch(API_CONSTANTS.INCIDENTS, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + getCookie('Token')
                }
            })
            let response = await res.json()

            if (res.ok) {
                setIncidentLocations(response);
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

    const checkIncidentReportSubmission = () => {
        return incidentType === '' || markedIncidentVectorSource.length == 0 || zoneName === '';
    }

    const addSafeZone = async (e: React.FormEvent) => {
        e.preventDefault()
        if (incidentType === '') {
            toast.error('Please select an incident type');
        } else {
            try {
                let latitude = markedIncidentVectorSource[1];
                let longitude = markedIncidentVectorSource[0];
                const res = await fetch(API_CONSTANTS.SAFEZONES, {
                    method: 'POST',
                    body: JSON.stringify({
                        zone_lat: latitude,
                        zone_lon: longitude,
                        incident_type_id: parseInt(incidentType),
                        zone_name: zoneName,
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + getCookie('Token')
                    }
                })
                let response = await res.json();
                if (res.ok) {
                    toast.success('Safezone added Successfully');
                    getSafeZones();
                    setMarkedIncidentVectorSource([]);
                } else {
                    toast.error((await res.json()).error)
                }
            } catch (error: any) {
                toast.error(error?.message)
            }
        }
    }

    return (<>
        {selectedZone && zonepopoverCoords && (
            <div
                style={{
                    position: "absolute",
                    left: zonepopoverCoords[0],
                    top: zonepopoverCoords[1],
                    zIndex: 999,
                }}
            >
                <Popover open={zonepopupVisible} onOpenChange={setZonePopupVisible}>
                    <PopoverTrigger asChild>
                        <div />
                    </PopoverTrigger>
                    <PopoverContent side="right" align="start" className="w-96">
                        <Card>
                            <CardHeader>
                                <CardTitle>Safe Zone</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-1">
                                <p><strong>Name:</strong> {selectedZone.zone_name}</p>
                                <p><strong>Shelter For: </strong>{incidentTypeLookup[selectedZone.incident_type_id]}</p>
                                <p><strong>Latitude:</strong> {selectedZone.zone_lat}</p>
                                <p><strong>Longitude:</strong> {selectedZone.zone_lon}</p>
                            </CardContent>
                        </Card>
                    </PopoverContent></Popover>
            </div>
        )}
        {selectedIncident && popoverCoords && (
            <div
                style={{
                    position: "absolute",
                    left: popoverCoords[0],
                    top: popoverCoords[1],
                    zIndex: 9999,
                }}
            >
                <Popover open={popupVisible} onOpenChange={setPopupVisible}>
                    <PopoverTrigger asChild>
                        <div />
                    </PopoverTrigger>
                    <PopoverContent side="right" align="start" className="w-96">
                        <Card>
                            <CardHeader>
                                <CardTitle>Incident Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p><strong>Incident Type: </strong> {selectedIncident.incidentType}</p>
                                <p><strong>Incident Status: </strong> {selectedIncident.incidentStatus}</p>
                                <p><strong>Location Address: </strong> {selectedIncident.geoName}</p>
                                <p><strong>Severity Level: </strong> {selectedIncident.severityLevel}</p>
                                <p><strong>No. of People Injured: </strong> {selectedIncident.injuredCount}</p>
                                <p><strong>No. of People Affected: </strong> {selectedIncident.affectedCount}</p>
                            </CardContent>
                            <CardFooter className="justify-end">
                                <Button onClick={() => router.push("/incidents")}>
                                    View All Incidents
                                </Button>
                            </CardFooter>
                        </Card>
                    </PopoverContent>
                </Popover>
            </div>
        )}
        <div className="flex flex-row gap-4">
            <div ref={mapRef} style={{ width: "60vw", height: "90vh", marginTop: "10px" }} />
            <div className="flex flex-col gap-4">
                <Card className="w-[360px] h-[170px]">
                    <CardHeader>
                        <CardTitle>Interact with Map</CardTitle>
                        <CardDescription>Please select the interaction type with the Map</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Select onValueChange={(value) => setSelectedMarker(value as MarkerType)} defaultValue="NoSelection">
                            <SelectTrigger className="w-[320px]">
                                <SelectValue placeholder="Select marker type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="NoSelection">No Selection</SelectItem>
                                <SelectItem value="markSafeZones">Mark Safe Zones</SelectItem>
                                <SelectItem value="RemoveMarker">Remove Markers</SelectItem>
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>
                <Card className="w-[360px]">
                    <CardHeader>
                        <CardTitle>Add Safe Zone</CardTitle>
                        <CardDescription>Add a new safe zone for a type of incident</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={addSafeZone} className="w-full flex flex-col gap-8 items-center justify-center">
                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="zoneName">Zone Name</Label>
                                <Input
                                    className="w-full"
                                    required
                                    value={zoneName}
                                    onChange={(e) => setZoneName(e.target.value)}
                                    id="zoneName"
                                    type="zoneName"
                                />
                            </div>
                            <div>
                                <Label htmlFor="incidenType">Select Incident Type</Label>
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
                            </div>

                            <Button disabled={checkIncidentReportSubmission()}>Add</Button>
                        </form>
                    </CardContent>
                </Card>

            </div>
        </div>
    </>
    );
}

export default Map;