"use client";

import { useState, useEffect, useCallback } from "react";
import { Responsive, WidthProvider, Layout, Layouts } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface DashboardLayoutProps {
  children: React.ReactNode[];
  widgetIds: string[];
  onLayoutChange?: (layouts: Layouts) => void;
}

// Default layouts for different breakpoints - increased heights for better spacing
const generateDefaultLayouts = (widgetIds: string[]): Layouts => {
  const lgLayout: Layout[] = [
    { i: "weather", x: 0, y: 0, w: 6, h: 14, minW: 4, minH: 10 },
    { i: "airquality", x: 6, y: 0, w: 6, h: 14, minW: 4, minH: 10 },
    { i: "climate", x: 0, y: 14, w: 12, h: 16, minW: 6, minH: 12 },
    { i: "satellite", x: 0, y: 30, w: 6, h: 16, minW: 4, minH: 12 },
    { i: "carbon", x: 6, y: 30, w: 6, h: 18, minW: 4, minH: 12 },
    { i: "soil", x: 0, y: 46, w: 6, h: 18, minW: 4, minH: 12 },
    { i: "deforestation", x: 6, y: 46, w: 6, h: 20, minW: 4, minH: 12 },
    { i: "biodiversity", x: 0, y: 66, w: 12, h: 22, minW: 6, minH: 14 },
    { i: "ocean", x: 0, y: 88, w: 12, h: 18, minW: 6, minH: 12 },
  ].filter(l => widgetIds.includes(l.i));

  const mdLayout: Layout[] = lgLayout.map(l => ({
    ...l,
    w: l.w === 12 ? 10 : 5,
    x: l.x === 6 ? 5 : 0,
  }));

  const smLayout: Layout[] = lgLayout.map((l, idx) => ({
    ...l,
    w: 6,
    x: 0,
    y: idx * 10,
  }));

  return { lg: lgLayout, md: mdLayout, sm: smLayout };
};

const STORAGE_KEY = "gaia-dashboard-layouts";

export default function DashboardLayout({
  children,
  widgetIds,
  onLayoutChange,
}: DashboardLayoutProps) {
  const [layouts, setLayouts] = useState<Layouts>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return generateDefaultLayouts(widgetIds);
        }
      }
    }
    return generateDefaultLayouts(widgetIds);
  });

  const [isEditing, setIsEditing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLayoutChange = useCallback(
    (_currentLayout: Layout[], allLayouts: Layouts) => {
      setLayouts(allLayouts);
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allLayouts));
      }
      onLayoutChange?.(allLayouts);
    },
    [onLayoutChange]
  );

  const resetLayout = () => {
    const defaultLayouts = generateDefaultLayouts(widgetIds);
    setLayouts(defaultLayouts);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultLayouts));
    }
  };

  if (!mounted) {
    return (
      <div className="space-y-8">
        {children.map((child, idx) => (
          <div key={widgetIds[idx]}>{child}</div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Edit mode toggle */}
      <div className="mb-4 flex items-center justify-between">
        <div className="text-xs text-white-dim font-mono uppercase tracking-wider">
          {isEditing ? (
            <span className="text-blue animate-pulse">
              [EDIT_MODE] DRAG_TO_REARRANGE • RESIZE_FROM_CORNERS
            </span>
          ) : (
            <span>[DASHBOARD_LAYOUT]</span>
          )}
        </div>
        <div className="flex gap-2">
          {isEditing && (
            <button
              onClick={resetLayout}
              className="px-3 py-1 border border-white text-white hover:bg-white hover:text-terminal transition-all font-mono text-xs uppercase tracking-wider"
            >
              RESET
            </button>
          )}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-3 py-1 border-2 transition-all font-mono text-xs uppercase tracking-wider ${
              isEditing
                ? "border-blue bg-blue text-white"
                : "border-white text-white hover:border-blue hover:text-blue"
            }`}
          >
            {isEditing ? "DONE" : "EDIT_LAYOUT"}
          </button>
        </div>
      </div>

      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768 }}
        cols={{ lg: 12, md: 10, sm: 6 }}
        rowHeight={28}
        onLayoutChange={handleLayoutChange}
        isDraggable={isEditing}
        isResizable={isEditing}
        draggableHandle=".widget-drag-handle"
        containerPadding={[0, 0]}
        margin={[24, 24]}
      >
        {children.map((child, idx) => (
          <div
            key={widgetIds[idx]}
            className={`${isEditing ? "ring-2 ring-blue ring-opacity-50" : ""}`}
          >
            {isEditing && (
              <div className="widget-drag-handle absolute top-0 left-0 right-0 h-8 bg-blue bg-opacity-20 cursor-move z-10 flex items-center justify-center">
                <span className="text-[10px] text-blue font-mono uppercase tracking-widest">
                  DRAG_HERE
                </span>
              </div>
            )}
            <div className={`h-full ${isEditing ? "pt-8" : ""} overflow-auto`}>
              {child}
            </div>
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
}
