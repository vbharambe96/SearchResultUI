

import { useState } from "react";
import { FiSearch, FiSettings, FiFile, FiFolder, FiMessageCircle, FiList } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";

import Dropdown from "./components/Dropdown";
import type { DropdownOption } from "./components/Dropdown";
import dummyResults from "./data/dummyResults";


function highlightAll(text: string, query: string) {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <span key={i} className="bg-yellow-100 text-yellow-800 rounded px-1">{part}</span>
        ) : (
          part
        )
      )}
    </>
  );
}

export default function App() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("All");
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownOptions, setDropdownOptions] = useState<DropdownOption[]>([
    {
      key: "files",
      label: "Files",
      icon: <FiFile />,
      enabled: true,
      selected: true,
    },
    {
      key: "people",
      label: "People",
      icon: <FaUserCircle />,
      enabled: true,
      selected: true,
    },
    {
      key: "chats",
      label: "Chats",
      icon: <FiMessageCircle/>,
      enabled: false,
      selected: false,
    },
    {
      key: "lists",
      label: "Lists",
      icon: <FiList/>,
      enabled: false,
      selected: false,
    },
  ]);

  const handleDropdownToggle = (key: string) => {
    setDropdownOptions(opts =>
      opts.map(opt =>
        opt.key === key && opt.enabled
          ? { ...opt, selected: !opt.selected }
          : opt
      )
    );
  };

    // Filter logic: only show items matching selected types and query
    const selectedTypes = dropdownOptions.filter(opt => opt.selected && opt.enabled).map(opt => opt.key);
    const results = dummyResults.filter((r) => {
      // Tab filtering
      if (tab === "Files" && r.type !== "file") return false;
      if (tab === "People" && r.type !== "person") return false;
      // Dropdown filtering
      if (selectedTypes.includes("files") && r.type === "file") {
        return query ? r.name.toLowerCase().includes(query.toLowerCase()) : true;
      }
      if (selectedTypes.includes("people") && r.type === "person") {
        return query ? r.name.toLowerCase().includes(query.toLowerCase()) : true;
      }
      return false;
    });

  return (
    <div className="min-h-screen  bg-gray-200 flex items-center justify-center">
      <div className="w-[420px] rounded-2xl shadow-xl bg-white p-6 relative">
        {/* Search Bar */}
        <div className="flex items-center gap-2 mb-2">
          <FiSearch className="text-gray-400 text-xl" />
          <input
            className="flex-1 bg-transparent outline-none text-xl text-gray-900 placeholder-gray-400"
            placeholder="Search"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {query && (
            <button className="text-sm text-gray-500 font-medium px-2" onClick={() => setQuery("")}>Clear</button>
          )}
          <button className="ml-2" onClick={() => setShowDropdown(v => !v)}>
            <FiSettings className="text-gray-400 text-xl" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-gray-100 mb-2">
          {(() => {
            const allCount = dummyResults.filter(r => {
              if (selectedTypes.includes("files") && r.type === "file") return true;
              if (selectedTypes.includes("people") && r.type === "person") return true;
              return false;
            }).length;
            const filesCount = dummyResults.filter(r => selectedTypes.includes("files") && r.type === "file").length;
            const peopleCount = dummyResults.filter(r => selectedTypes.includes("people") && r.type === "person").length;
            const tabs = [
              { label: "All", count: allCount, icon: null },
              { label: "Files", count: filesCount, icon: <FiFile className="text-base" /> },
              { label: "People", count: peopleCount, icon: <FaUserCircle className="text-base" /> },
            ];
            return tabs.map(t => (
              <button
                key={t.label}
                className={`relative py-2 text-gray-700 font-medium flex items-center gap-1 ${tab === t.label ? "" : "opacity-60"}`}
                onClick={() => setTab(t.label)}
              >
                {t.icon}
                {t.label}
                <span className="ml-1 text-xs bg-gray-100 rounded px-1 text-gray-500 font-semibold">{t.count}</span>
                {tab === t.label && (
                  <span className="absolute left-0 right-0 -bottom-[1px] h-[2px] bg-gray-800 rounded-full" />
                )}
              </button>
            ));
          })()}
        </div>

        {/* Dropdown */}
        {showDropdown && (
          <div className="absolute right-6 top-16 z-20">
            <Dropdown options={dropdownOptions} onToggle={handleDropdownToggle} />
          </div>
        )}

        {/* Results */}
        <div className="mt-4 h-64 overflow-y-auto">
          {results.length === 0 ? (
            <div className="text-gray-400 text-center py-8">No results found.</div>
          ) : (
            <ul>
              {results.map((r, i) => (
                <li key={i} className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-b-0">
                  {/* Icon/Avatar */}
                  {r.type === "person" ? (
                    <span className="relative">
                      <img src={r.avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                      <span className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border-2 border-white ${r.active ? "bg-green-500" : "bg-red-400"}`} />
                    </span>
                  ) : r.type === "file" ? (
                    <FiFile className="text-gray-400 text-2xl" />
                  ) : (
                    <FiFolder className="text-gray-400 text-2xl" />
                  )}
                  {/* Main Info */}
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 text-base">
                      {highlightAll(r.name, query)}
                      {r.files && (
                        <span className="ml-2 text-xs bg-gray-100 rounded px-1 text-gray-500 font-semibold">{r.files} Files</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {r.type === "person" ? r.status : r.location}
                      {r.edited && <span> • {r.edited}</span>}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
