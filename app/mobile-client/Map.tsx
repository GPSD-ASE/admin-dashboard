"use client";

import { View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { Map as OlMap } from "ol";
import React, { useEffect, useRef, useState } from "react";
import "ol/ol.css";
import { fromLonLat } from "ol/proj";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";
import Circle from "ol/style/Circle";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import { Select } from "ol/interaction";
import { click } from "ol/events/condition";

type MarkerType = "redCircle" | "greenCircle" | "blueIcon";

const markerStyles: Record<MarkerType, Style> = {
    redCircle: new Style({
        image: new Circle({
            radius: 8,
            fill: new Fill({ color: "red" }),
            stroke: new Stroke({ color: "white", width: 2 }),
        }),
    }),
    greenCircle: new Style({
        image: new Circle({
            radius: 8,
            fill: new Fill({ color: "green" }),
            stroke: new Stroke({ color: "white", width: 2 }),
        }),
    }),
    blueIcon: new Style({
        image: new Icon({
            src: "https://upload.wikimedia.org/wikipedia/commons/e/ec/RedDot.svg",
            scale: 0.05,
        }),
    }),
};


function Map() {
    const mapRef = useRef(null);
    const [selectedMarker, setSelectedMarker] = useState<MarkerType>("redCircle");
    const [vectorSource] = useState(new VectorSource());

    useEffect(() => {
        if (!mapRef.current) return;

        const osmLayer = new TileLayer({
            source: new OSM(),
        });

        const vectorLayer = new VectorLayer({
            source: vectorSource,
        });

        const map = new OlMap({
            target: mapRef.current,
            layers: [osmLayer, vectorLayer],
            view: new View({
                center: [0, 0],
                zoom: 0,
            }),
        });

        // Add click event to place markers
        map.on("singleclick", (event) => {
            const coordinates = event.coordinate;
            const newMarker = new Feature({
                geometry: new Point(coordinates),
            });

            // Apply selected marker style
            newMarker.setStyle(markerStyles[selectedMarker]);
            vectorSource.addFeature(newMarker);
        });

        // **Remove markers on click**
        const selectInteraction = new Select({
            condition: click, // Detect click event
        });

        selectInteraction.on("select", (event) => {
            event.selected.forEach((feature) => {
                vectorSource.removeFeature(feature);
            });
        });

        map.addInteraction(selectInteraction);

        return () => map.setTarget(null!);
    }, [vectorSource, selectedMarker]);

    return (<>
        <h2>Select Marker Type:</h2>
        <select value={selectedMarker} onChange={(e) => setSelectedMarker(e.target.value as MarkerType)}>
            <option value="redCircle">Red Circle</option>
            <option value="greenCircle">Green Circle</option>
            <option value="blueIcon">Blue Icon</option>
        </select>
        <div ref={mapRef} style={{ width: "60vw", height: "70vh", marginTop: "10px" }} />
    </>
    );
}

export default Map;