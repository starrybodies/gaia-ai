"use client";

import { useState, useEffect, useRef } from "react";

interface ConsoleMessage {
  type: "input" | "output" | "error" | "success";
  text: string;
  timestamp?: Date;
}

const COMMANDS: Record<string, { response: string; type: "success" | "output" | "error" }> = {
  help: {
    response: `AVAILABLE_COMMANDS:
> status     - Show system status
> data       - List available data sources
> modules    - Show active modules
> about      - Learn about GAIA.AI
> demo       - Launch demo dashboard
> clear      - Clear console
> hack       - ???`,
    type: "output",
  },
  status: {
    response: `SYSTEM_STATUS:
> CPU: 23% | MEM: 1.2GB/8GB | UPTIME: 99.9%
> DATA_SOURCES: 5 CONNECTED, 0 OFFLINE
> AI_ENGINE: OPERATIONAL
> CACHE: 156MB | API_CALLS: 2,341 TODAY
> LAST_UPDATE: ${new Date().toLocaleTimeString()}`,
    type: "success",
  },
  data: {
    response: `DATA_SOURCES:
[✓] OPENWEATHERMAP - Weather & Climate
[✓] NOAA - Historical Climate Data
[✓] NASA_EOSDIS - Satellite Imagery
[✓] OPENAQ - Air Quality Monitoring
[✓] GLOBAL_FOREST_WATCH - Deforestation Tracking
[⧗] COPERNICUS - Atmosphere & Marine (PENDING)
[⧗] PLANET_LABS - Daily Satellite (PENDING)`,
    type: "output",
  },
  modules: {
    response: `ACTIVE_MODULES:
[MODULE_01] AI_QUERY_ENGINE ........... [OPERATIONAL]
[MODULE_02] DASHBOARD_BUILDER ......... [DEVELOPMENT]
[MODULE_03] EARTH_VITALS .............. [PLANNED]
[MODULE_04] VIZ_ENGINE ................ [OPERATIONAL]
[MODULE_05] DATA_INTEGRATION ........... [OPERATIONAL]
[MODULE_06] KNOWLEDGE_BASE ............ [PLANNED]`,
    type: "output",
  },
  about: {
    response: `GAIA.AI v0.1.0-alpha
Environmental Intelligence Platform
Open Source | MIT License
https://gaia.ai/about`,
    type: "output",
  },
  demo: {
    response: `Launching demo dashboard...
> Redirecting to /demo`,
    type: "success",
  },
  hack: {
    response: `ACCESS_DENIED: Nice try, but we're cypherpunks, not blackhats.
Try 'help' for actual commands. 💚`,
    type: "error",
  },
};

export default function InteractiveConsole() {
  const [messages, setMessages] = useState<ConsoleMessage[]>([
    { type: "output", text: "GAIA.AI ENVIRONMENTAL INTELLIGENCE SYSTEM v0.1.0" },
    { type: "output", text: "Type 'help' for available commands" },
    { type: "output", text: "" },
  ]);
  const [input, setInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [messages]);

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();

    if (!trimmedCmd) return;

    // Add input to messages
    setMessages((prev) => [...prev, { type: "input", text: cmd, timestamp: new Date() }]);

    if (trimmedCmd === "clear") {
      setMessages([]);
      return;
    }

    if (trimmedCmd === "demo") {
      setTimeout(() => {
        window.location.href = "/demo";
      }, 500);
    }

    // Get command response
    const commandData = COMMANDS[trimmedCmd];

    if (commandData) {
      setMessages((prev) => [
        ...prev,
        {
          type: commandData.type,
          text: commandData.response,
          timestamp: new Date(),
        },
        { type: "output", text: "" }, // Empty line
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          type: "error",
          text: `ERROR: Unknown command '${trimmedCmd}'. Type 'help' for available commands.`,
          timestamp: new Date(),
        },
        { type: "output", text: "" },
      ]);
    }

    // Add to history
    setCommandHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex =
          historyIndex === -1
            ? commandHistory.length - 1
            : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput("");
        } else {
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      }
    }
  };

  return (
    <div className="terminal-window h-[500px] flex flex-col">
      <div className="window-header">
        <span className="text-matrix-green">[INTERACTIVE_CONSOLE]</span>
        <div className="window-controls">
          <div className="window-control"></div>
          <div className="window-control"></div>
          <div className="window-control"></div>
        </div>
      </div>

      {/* Console output */}
      <div
        ref={consoleRef}
        className="flex-1 overflow-y-auto p-4 bg-terminal-dark font-mono text-sm"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-1 ${
              msg.type === "input"
                ? "text-matrix-green"
                : msg.type === "error"
                ? "text-neon-red"
                : msg.type === "success"
                ? "text-neon-cyan"
                : "text-terminal-gray"
            }`}
          >
            {msg.type === "input" && (
              <span className="text-matrix-green">&gt; </span>
            )}
            {msg.text.split("\n").map((line, j) => (
              <div key={j}>{line || "\u00A0"}</div>
            ))}
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t border-matrix-green/30 bg-black">
        <div className="flex items-center p-2">
          <span className="text-matrix-green mr-2 font-mono">&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-matrix-green font-mono text-sm"
            placeholder="Type 'help' for commands..."
            autoFocus
          />
          <span className="cursor ml-1"></span>
        </div>
      </form>
    </div>
  );
}
