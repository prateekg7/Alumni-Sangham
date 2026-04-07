import { Edit2 } from "lucide-react";
function ProgressCard() {
  return <div className="bg-white rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-black">Progress</h3>
        <button className="p-1 hover:bg-gray-100 rounded">
          <Edit2 className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      <div className="mb-4">
        <h4 className="text-2xl font-light text-black">6.1h</h4>
        <p className="text-xs text-gray-600 mt-0.5">Work timer this week</p>
      </div>

      {
    /* Chart bars */
  }
      <div className="flex items-end gap-1.5 h-24 mb-4">
        <div className="flex-1 bg-gray-300 rounded" style={{ height: "40%" }} />
        <div className="flex-1 bg-black rounded" style={{ height: "60%" }} />
        <div className="flex-1 bg-black rounded" style={{ height: "85%" }} />
        <div className="flex-1 bg-alumni-yellow rounded" style={{ height: "100%" }} />
        <div className="flex-1 bg-gray-400 rounded" style={{ height: "65%" }} />
        <div className="flex-1 bg-black rounded" style={{ height: "50%" }} />
        <div className="flex-1 bg-black rounded" style={{ height: "30%" }} />
      </div>

      {
    /* Legend */
  }
      <div className="flex justify-between text-xs text-gray-600 px-0.5 mb-3">
        <span>M</span>
        <span>T</span>
        <span>W</span>
        <span>T</span>
        <span>F</span>
        <span>S</span>
        <span>S</span>
      </div>

      {
    /* Color indicators and time */
  }
      <div className="pt-2 border-t border-gray-200">
        <p className="text-xs text-gray-600 mb-2">5h 23m</p>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
          <div className="w-1.5 h-1.5 rounded-full bg-alumni-yellow" />
          <div className="w-1.5 h-1.5 rounded-full bg-black" />
          <div className="w-1.5 h-1.5 rounded-full bg-black" />
          <div className="w-1.5 h-1.5 rounded-full bg-black" />
          <div className="w-1.5 h-1.5 rounded-full bg-black" />
        </div>
      </div>
    </div>;
}
export {
  ProgressCard as default
};
