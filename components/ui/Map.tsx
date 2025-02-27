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
import { Button } from '@/components/ui/button'
import FullScreen from "ol/control/FullScreen";
import { useMap } from "../../mapContext/gpsdContext";
import { API_CONSTANTS } from "@/constants/ApiConstants";
import { LineString } from "ol/geom";


type MarkerType = "markIncident" | "markRoute" | "RemoveMarker";

const markerStyles: Record<MarkerType, Style> = {
    markIncident: new Style({
        image: new Circle({
            radius: 8,
            fill: new Fill({ color: "red" }),
            stroke: new Stroke({ color: "white", width: 2 }),
        }),
    }),
    markRoute: new Style({
        image: new Circle({
            radius: 8,
            fill: new Fill({ color: "blue" }),
            stroke: new Stroke({ color: "white", width: 2 }),
        }),
    }),
    RemoveMarker: new Style({
        image: new Icon({
            src: "https://upload.wikimedia.org/wikipedia/commons/e/ec/RedDot.svg",
            scale: 0.05,
        }),
    }),
};

interface IncidentLocation {
    incident_type: string;
    incident_type_id: number;
    longitude: number;
    latitude: number;
    radius: number; // Radius in kilometers
    
  }

function Map() {
    const mapRef = useRef(null);
    const [vectorSource] = useState(new VectorSource());
    const [routeSource] = useState(new VectorSource());
    const [routeLine, setRouteLine] = useState([]);
    const [incidentlocations, setIncidentLocations] = useState<IncidentLocation[]>([]);



    useEffect(() => {
        getIncidentZones();
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
            layers: [osmLayer, vectorLayer, routeLayer, incidentmarkerLayer, circleLayer],
            view: new View({
                center: [0, 0],
                zoom: 5,
            }),
        });

    
   
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
    
        //   const radiusInMeters = loc.radius * 1000; // Convert km to meters
          const circleFeature = new Feature(new CircleGeom(pointCoords, loc.radius));
    
          circleSource.addFeature(circleFeature);
    
        });
    
        // Get user location
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

        // Add click event to place markers
        map.on("singleclick", (event) => {
            const coordinates = event.coordinate;
            const newMarker = new Feature({
                geometry: new Point(coordinates),
            });
            let coord = toLonLat(coordinates);


        });

        // **Remove markers on click**
        const selectInteraction = new OlSelect({
            condition: click, // Detect click event
        });

        selectInteraction.on("select", (event) => {
            event.selected.forEach((feature) => {
                vectorSource.removeFeature(feature);
            });
        });

        if (routeLine.length > 0) {
            const routeCoordinates = routeLine.map((coord: any) => fromLonLat(coord));
            const routeFeature = new Feature({
                geometry: new LineString(routeCoordinates),
            });
            routeSource.clear();
            routeSource.addFeature(routeFeature);
            // let extent: Extent = routeFeature.getGeometry()?.getExtent() || [0, 0, 0, 0];
            // extent = extend(extent, userMarker.getGeometry()?.getExtent() || []);

        }

        map.addInteraction(selectInteraction);
        map.addControl(new FullScreen({}));

        return () => map.setTarget(null!);
    }, [vectorSource, routeLine, incidentlocations]);

    const reorderCoordinates = (originalArray: any, indexesArray: any = [1, 0]) => {
        return indexesArray.map((index: any) => originalArray[index]);
    }

    function addParamsToUrl(url: string, params: Record<string, string | number>): string {
        const urlObj = new URL(url);
        const searchParams = new URLSearchParams(urlObj.search);

        Object.entries(params).forEach(([key, value]) => {
            searchParams.set(key, String(value));
        });

        urlObj.search = searchParams.toString();
        return urlObj.toString();
    }

    const getIncidentZones = async () => {
        try {
        
            const res = await fetch(API_CONSTANTS.GET_ZONES, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
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

    return (<>
        <div className="flex flex-row gap-4">
            {/* <Card className="w-[360px] h-[170px]">
                <CardHeader>
                    <CardTitle>Interact with Map</CardTitle>
                    <CardDescription>Please select the interaction type with the Map</CardDescription>
                </CardHeader>
                <CardContent>
                    <Select onValueChange={(value) => setSelectedMarker(value as MarkerType)} defaultValue="markIncident">
                        <SelectTrigger className="w-[320px]">
                            <SelectValue placeholder="Select marker type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="markIncident">Mark Incident</SelectItem>
                            <SelectItem value="markRoute">Select Routes</SelectItem>
                            <SelectItem value="RemoveMarker">Remove Markers</SelectItem>
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>
            <Card className="w-[360px]">
                <CardHeader>
                    <CardTitle>Get Route</CardTitle>
                    <CardDescription>Please click the button below if you need a route</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button disabled={markedRoutesVectorSource.length < 2} onClick={getRoute}>Get Route</Button>
                </CardContent>
            </Card>
            <Card className="w-[360px]">
                <CardHeader>
                    <CardTitle>Get Evacuation Plan</CardTitle>
                    <CardDescription>Please click the button below if you need an evacuation plan</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button disabled={markedIncidentVectorSource.length == 0 || incidentType === ''} onClick={getEvacuationRoute}>Get Evacuation Plan</Button>
                </CardContent>
            </Card> */}

        </div>
        <div ref={mapRef} style={{ width: "70vw", height: "90vh", marginTop: "10px" }} />
    </>
    );
}

export default Map;