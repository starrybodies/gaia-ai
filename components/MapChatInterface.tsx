"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { SelectedLocation } from "./IntegratedMapView";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  data?: any;
}

interface MapChatInterfaceProps {
  location: SelectedLocation | null;
  locationName: string;
  isOpen: boolean;
  onClose: () => void;
  environmentalData?: any;
}

// Predefined queries for quick access
const QUICK_QUERIES = [
  { label: "Natural Capital Value", query: "What is the total natural capital value of this location?" },
  { label: "Carbon Storage", query: "How much carbon is stored here and what is it worth?" },
  { label: "Biodiversity", query: "What species are found in this area?" },
  { label: "Climate Risks", query: "What are the climate risks for this location?" },
  { label: "Forest Health", query: "What is the forest cover and deforestation status?" },
  { label: "Ecosystem Services", query: "What ecosystem services does this area provide?" },
];

export default function MapChatInterface({
  location,
  locationName,
  isOpen,
  onClose,
  environmentalData,
}: MapChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Reset when location changes
  useEffect(() => {
    if (location) {
      setMessages([{
        id: "welcome",
        role: "system",
        content: `Environmental data loaded for ${locationName || `${location.lat.toFixed(4)}°, ${location.lon.toFixed(4)}°`}. Ask me anything about this location's natural capital, biodiversity, carbon storage, or climate data.`,
        timestamp: new Date(),
      }]);
    }
  }, [location, locationName]);

  const processQuery = useCallback(async (query: string) => {
    if (!query.trim() || !location) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: query,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Call our chat API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          location: {
            lat: location.lat,
            lon: location.lon,
            name: locationName,
          },
          environmentalData,
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
        data: data.sourceData,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      // Fallback to local processing if API fails
      const response = generateLocalResponse(query, environmentalData, locationName);

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [location, locationName, environmentalData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processQuery(input);
  };

  const handleQuickQuery = (query: string) => {
    processQuery(query);
  };

  if (!isOpen) return null;

  return (
    <div className="absolute bottom-[40px] left-4 w-[400px] max-h-[500px] bg-terminal border-2 border-blue z-[1003] flex flex-col shadow-2xl">
      {/* Header */}
      <div className="bg-code border-b border-blue px-4 py-3 flex justify-between items-center flex-shrink-0">
        <div>
          <div className="text-blue text-[10px] uppercase tracking-[0.15em]">GAIA AI</div>
          <div className="text-white font-mono text-sm">Environmental Intelligence</div>
        </div>
        <button
          onClick={onClose}
          className="text-white-dim hover:text-blue font-mono text-sm px-2 py-1 border border-white/50 hover:border-blue transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Quick queries */}
      {messages.length <= 1 && (
        <div className="px-4 py-3 border-b border-white/20 flex-shrink-0">
          <div className="text-white-dim text-[10px] uppercase mb-2">Quick Queries</div>
          <div className="flex flex-wrap gap-2">
            {QUICK_QUERIES.slice(0, 4).map((q, i) => (
              <button
                key={i}
                onClick={() => handleQuickQuery(q.query)}
                className="text-[10px] font-mono px-2 py-1 border border-white/30 text-white-dim hover:border-blue hover:text-blue transition-colors"
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-[200px]">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`${
              message.role === "user"
                ? "ml-8"
                : message.role === "system"
                ? "text-center"
                : "mr-8"
            }`}
          >
            {message.role === "system" ? (
              <div className="text-white-dim text-[10px] font-mono py-2 px-3 bg-code/50 border border-white/20">
                {message.content}
              </div>
            ) : message.role === "user" ? (
              <div className="bg-blue/20 border border-blue p-3">
                <div className="text-blue text-[10px] uppercase mb-1">You</div>
                <div className="text-white font-mono text-sm">{message.content}</div>
              </div>
            ) : (
              <div className="bg-code border border-white/30 p-3">
                <div className="text-blue text-[10px] uppercase mb-1">GAIA AI</div>
                <div className="text-white font-mono text-sm whitespace-pre-wrap">{message.content}</div>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="mr-8 bg-code border border-white/30 p-3">
            <div className="text-blue text-[10px] uppercase mb-1">GAIA AI</div>
            <div className="text-blue font-mono text-sm animate-pulse">● ● ●</div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t border-blue p-3 flex-shrink-0">
        <div className="flex gap-2">
          <div className="flex-1 flex items-center border border-white/50 bg-code px-3 focus-within:border-blue transition-colors">
            <span className="text-blue mr-2 font-mono">&gt;</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about this location..."
              disabled={isLoading || !location}
              className="flex-1 bg-transparent border-none outline-none text-white font-mono text-sm py-2 placeholder:text-white-dim/50"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !input.trim() || !location}
            className="px-4 py-2 border-2 border-blue text-blue hover:bg-blue hover:text-white disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-blue transition-all font-mono text-xs uppercase"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

// Local response generation when API is unavailable
function generateLocalResponse(query: string, data: any, locationName: string): string {
  const q = query.toLowerCase();

  // Natural capital / value queries
  if (q.includes("natural capital") || q.includes("value") || q.includes("worth")) {
    const parts: string[] = [];

    if (data?.forest?.valuation?.naturalCapital?.totalFormatted) {
      parts.push(`Forest natural capital: ${data.forest.valuation.naturalCapital.totalFormatted}`);
    }
    if (data?.soil?.valuation?.naturalCapital?.carbonStockFormatted) {
      parts.push(`Soil carbon value: ${data.soil.valuation.naturalCapital.carbonStockFormatted}`);
    }
    if (data?.biodiversity?.valuation?.naturalCapital?.annualTotalFormatted) {
      parts.push(`Biodiversity services: ${data.biodiversity.valuation.naturalCapital.annualTotalFormatted}/year`);
    }
    if (data?.ocean?.valuation?.naturalCapital?.annualTotalFormatted) {
      parts.push(`Marine services: ${data.ocean.valuation.naturalCapital.annualTotalFormatted}/year`);
    }

    if (parts.length > 0) {
      return `Natural Capital Assessment for ${locationName}:\n\n${parts.join("\n")}\n\nThese values are calculated using TEEB methodology and the Natural Capital Protocol.`;
    }
    return "Natural capital data is being calculated for this location. Please check the data panel for details.";
  }

  // Carbon queries
  if (q.includes("carbon")) {
    if (data?.carbon) {
      const c = data.carbon;
      let response = `Carbon Analysis for ${locationName}:\n\n`;
      response += `• Atmospheric CO₂: ${c.atmosphere?.co2ppm || "—"} ppm\n`;
      response += `• Per capita emissions: ${c.emissions?.co2 || "—"} tonnes/year\n`;
      if (c.valuation?.naturalCapital?.totalSequestrationValueFormatted) {
        response += `• Carbon sequestration value: ${c.valuation.naturalCapital.totalSequestrationValueFormatted}\n`;
      }
      return response;
    }
    return "Carbon data is being loaded for this location.";
  }

  // Biodiversity queries
  if (q.includes("species") || q.includes("biodiversity") || q.includes("wildlife")) {
    if (data?.biodiversity) {
      const b = data.biodiversity;
      let response = `Biodiversity Report for ${locationName}:\n\n`;
      response += `• Unique species: ${b.summary?.uniqueSpecies || "—"}\n`;
      response += `• Total observations: ${b.summary?.totalOccurrences || "—"}\n`;
      if (b.occurrences?.length > 0) {
        response += `\nTop species:\n`;
        b.occurrences.slice(0, 5).forEach((s: any) => {
          response += `• ${s.scientificName} (${s.count} obs.)\n`;
        });
      }
      return response;
    }
    return "Biodiversity data is being loaded from GBIF for this location.";
  }

  // Forest queries
  if (q.includes("forest") || q.includes("tree") || q.includes("deforestation")) {
    if (data?.forest) {
      const f = data.forest;
      let response = `Forest Analysis for ${locationName}:\n\n`;
      response += `• Current cover: ${f.forestCover?.current || "—"}%\n`;
      response += `• Forest area: ${f.forestCover?.area || "—"} km²\n`;
      response += `• Change since 2000: ${f.forestCover?.change || "—"}%\n`;
      if (f.valuation?.naturalCapital?.totalFormatted) {
        response += `• Natural capital: ${f.valuation.naturalCapital.totalFormatted}\n`;
      }
      return response;
    }
    return "Forest data is being loaded for this location.";
  }

  // Climate risk queries
  if (q.includes("climate") || q.includes("risk") || q.includes("weather")) {
    if (data?.weather) {
      const w = data.weather;
      let response = `Climate Data for ${locationName}:\n\n`;
      if (w.current) {
        response += `Current conditions:\n`;
        response += `• Temperature: ${w.current.temperature}°C\n`;
        response += `• Conditions: ${w.current.conditions}\n`;
        response += `• Humidity: ${w.current.humidity}%\n`;
      }
      return response;
    }
    return "Climate data is being loaded for this location.";
  }

  // Ecosystem services
  if (q.includes("ecosystem") || q.includes("services")) {
    let response = `Ecosystem Services for ${locationName}:\n\n`;
    response += "This location provides the following ecosystem services:\n\n";
    response += "• Provisioning: Food, freshwater, raw materials\n";
    response += "• Regulating: Carbon sequestration, water purification, climate regulation\n";
    response += "• Cultural: Recreation, aesthetic values, spiritual significance\n";
    response += "• Supporting: Nutrient cycling, soil formation, habitat provision\n\n";
    response += "Check the Natural Capital Summary for monetary valuations.";
    return response;
  }

  // Soil queries
  if (q.includes("soil")) {
    if (data?.soil) {
      const s = data.soil;
      let response = `Soil Analysis for ${locationName}:\n\n`;
      response += `• Health score: ${s.health?.score || "—"}/100\n`;
      response += `• Carbon content: ${s.health?.carbonContent || "—"} tonnes/ha\n`;
      response += `• Soil type: ${s.classification?.type || "—"}\n`;
      if (s.valuation?.naturalCapital?.carbonStockFormatted) {
        response += `• Carbon stock value: ${s.valuation.naturalCapital.carbonStockFormatted}\n`;
      }
      return response;
    }
    return "Soil data is being loaded from SoilGrids for this location.";
  }

  // Default response
  return `I can help you explore environmental data for ${locationName}. Try asking about:\n\n• Natural capital value\n• Carbon storage and emissions\n• Biodiversity and species\n• Forest cover and deforestation\n• Soil health\n• Climate and weather\n• Ecosystem services`;
}
