import SideNav from "@/components/side-nav";
import Header from "../header";
import Map from './Map';
import { IncidentForm } from "./incidentForm";
import "@/styles/mobileClient.css"
import { MapProvider } from "@/mapContext/gpsdContext";

export default function MobileClient() {
 
  return (
    <MapProvider>
      <div>
        <Header />
        <div className="flex">
          <SideNav />
          <div className="w-full overflow-x-auto">
            <div className="sm:h-[calc(99vh-60px)] overflow-auto ">
              <div className="w-full flex justify-center mx-auto   overflow-auto h-[calc(100vh - 120px)] overflow-y-auto relative">
                <div className='flex gap-2 pt-3'>
                  <div className="flex gap-4">
                    <div className="map">
                      <Map></Map>
                    </div>
                    <div className="incident-form">
                      <IncidentForm />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MapProvider>

  );
}