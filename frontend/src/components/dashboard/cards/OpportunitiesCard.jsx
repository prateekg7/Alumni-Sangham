function OpportunitiesCard() {
  return <div className="bg-white rounded-lg p-4">
      <h3 className="text-sm font-medium text-black mb-3">Featured Opportunities</h3>

      <div className="border-b border-gray-300 mb-3" />

      <div className="mb-4">
        <div className="w-5 h-5 bg-gray-300 rounded mb-2" />
        <h4 className="text-xs font-medium text-black mb-1">Senior product manager</h4>
        <p className="text-xs text-gray-600">Lead your strategy for AI lrem infrastructure. Sarah blah lore blah blah blah lorem ipsum o.</p>
      </div>

      <div className="flex gap-2">
        <button className="flex-1 px-2 py-1.5 text-xs text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">
          View full role
        </button>
        <button className="flex-1 px-2 py-1.5 text-xs text-white bg-[#232428] rounded hover:bg-[#2a2e34]">
          Apply Now
        </button>
      </div>
    </div>;
}
export {
  OpportunitiesCard as default
};
