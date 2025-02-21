import SideNav from "@/components/side-nav";
import Header from "../header";
import GridComponent from "@/components/GridComponent";

export default function Dashboard() {
  return (
    <div>
      <Header />
      <div className="flex">
        <SideNav />
        <div className="w-full overflow-x-auto">
          <div className="sm:h-[calc(99vh-60px)] overflow-auto ">
            <div className="w-full flex justify-center mx-auto pt-3 overflow-auto h-[calc(100vh - 120px)] overflow-y-auto relative">
                <GridComponent />
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}