"use client";

interface Tab {
  id: string;
  label: string;
  shortcut?: string;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function TabNavigation({ tabs, activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="border-b-2 border-white mb-6">
      <div className="flex items-center gap-0">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              relative px-6 py-3 font-mono text-sm uppercase tracking-wider transition-all
              border-t-2 border-l-2 border-r-2
              ${activeTab === tab.id
                ? "bg-terminal border-white text-white -mb-[2px] z-10"
                : "bg-code border-transparent text-white-dim hover:text-blue hover:border-blue"
              }
              ${index === 0 ? "" : "-ml-[2px]"}
            `}
          >
            <span className="flex items-center gap-2">
              {tab.shortcut && (
                <span className={`text-[10px] px-1 border ${activeTab === tab.id ? "border-blue text-blue" : "border-white-dim"}`}>
                  {tab.shortcut}
                </span>
              )}
              {tab.label}
            </span>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-terminal" />
            )}
          </button>
        ))}

        {/* Status indicator */}
        <div className="ml-auto flex items-center gap-3 px-4 text-[10px] text-white-dim font-mono uppercase">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-blue rounded-full animate-pulse" />
            LIVE_DATA
          </span>
          <span>|</span>
          <span>10_MODULES</span>
        </div>
      </div>
    </div>
  );
}
