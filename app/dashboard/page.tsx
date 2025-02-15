import Map from '@/components/ui/Map';

export default function Dashboard() {
  return (
    <div className='flex gap-2 pt-3'>
    <Map></Map>
    <div className="flex gap-4">
    <button className="w-40 h-16 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
        Report Incident</button>
        <button className="w-40 h-16 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
        
        Get Evacuation Plan</button>
    </div>
    </div>
  );
}