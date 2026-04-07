function OnboardingCard() {
  return <div className="bg-white rounded-lg p-4">
      <div className="mb-4">
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-sm font-medium text-black">Onboarding</span>
          <span className="text-lg font-medium text-black">18%</span>
        </div>

        {
    /* Progress bars */
  }
        <div className="flex gap-1.5 mb-2">
          <div className="flex-1 h-3 bg-alumni-yellow rounded" />
          <div className="flex-1 h-3 bg-black rounded" />
          <div className="flex-1 h-3 bg-gray-500 rounded" />
        </div>
        <p className="text-xs text-gray-600 text-center">Task</p>
      </div>

      {
    /* Onboarding Task Box */
  }
      <div className="relative">
        {
    /* Overlay bars for depth effect */
  }
        <div className="absolute -inset-1.5 bg-gray-500 rounded opacity-20" />
        <div className="bg-[#232428] rounded p-3 relative">
          <div className="text-white text-xs font-light mb-2">Onboarding Task</div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex gap-2">
              <div className="w-2.5 h-2.5 bg-gray-300 rounded-full" />
              <div className="w-2.5 h-2.5 bg-gray-300 rounded-full" />
              <div className="w-2.5 h-2.5 bg-gray-300 rounded-full" />
            </div>
            <div className="text-white text-xs font-medium">2/8</div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-white text-xs">Lorem Ipsum</span>
              <div className="w-1.5 h-1.5 bg-alumni-yellow rounded-full" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white text-xs">Lorem Ipsum</span>
              <div className="w-1.5 h-1.5 bg-alumni-yellow rounded-full" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white text-xs">Lorem Ipsum</span>
              <div className="w-1.5 h-1.5 bg-gray-500 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>;
}
export {
  OnboardingCard as default
};
