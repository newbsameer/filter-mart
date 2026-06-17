"use client";

import React, { useState } from 'react';

// Mock data representing what the Swiggy Instamart MCP tool returns
const mockInstamartInventory = [
  {
    productId: "im_001",
    title: "The Whole Truth Protein Bar - Peanut Butter",
    price: 120,
    imageUrl: "https://images.unsplash.com/photo-1622484211148-716598e04042?w=150",
    ingredients: "Dates, Peanuts, Raw Whey Protein, Cocoa",
    labels: ["No Added Sugar", "Clean Label"]
  },
  {
    productId: "im_002",
    title: "Yoga Bar Chocolate Cranberry Muesli",
    price: 350,
    imageUrl: "https://images.unsplash.com/photo-1517881917430-e70dfb3610aa?w=150",
    ingredients: "Rolled Oats, Whole Grains, Maltodextrin, Sugar, Honey, Dried Cranberries, Sucralose",
    labels: ["High Fiber"]
  },
  {
    productId: "im_003",
    title: "Raw Pressery Cold Pressed Sugarcane Juice",
    price: 80,
    imageUrl: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=150",
    ingredients: "Sugarcane Juice, Lemon, Green Chili",
    labels: ["No Artificial Preservatives"]
  },
  {
    productId: "im_004",
    title: "Diet Coke Can 330ml",
    price: 40,
    imageUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=150",
    ingredients: "Carbonated Water, Caramel Color, Aspartame, Acesulfame Potassium, Phosphoric Acid",
    labels: ["Zero Calories", "Sugar Free"]
  }
];

export default function FilterMartDashboard() {
  const [searchQuery, setSearchQuery] = useState("Bars and Drinks");
  const [bannedLabels, setBannedLabels] = useState<string[]>(["Maltodextrin", "Aspartame", "Sucralose"]);
  const [newLabel, setNewLabel] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);
  const [filteredInventory, setFilteredInventory] = useState(mockInstamartInventory);

  const addBannedLabel = () => {
    if (newLabel.trim() && !bannedLabels.includes(newLabel.trim())) {
      setBannedLabels([...bannedLabels, newLabel.trim()]);
      setNewLabel("");
    }
  };

  const removeBannedLabel = (labelToRemove: string) => {
    setBannedLabels(bannedLabels.filter(label => label !== labelToRemove));
  };

  const handleSimulateFilter = () => {
    setIsSimulating(true);
    
    // Simulate AI parsing through the unstructured text via the Swiggy MCP Server
    setTimeout(() => {
      const remainingItems = mockInstamartInventory.filter(item => {
        const fullText = (item.title + " " + item.ingredients).toLowerCase();
        return !bannedLabels.some(banned => fullText.includes(banned.toLowerCase()));
      });
      setFilteredInventory(remainingItems);
      setIsSimulating(false);
    }, 1200);
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar Controls */}
      <aside className="w-80 border-r border-slate-200 bg-white p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">⚡</span>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">Filter<span className="text-orange-500">Mart</span></h1>
          </div>
          
          <p className="text-xs text-slate-500 mb-6">
            Powered by Swiggy Instamart MCP. Define your negative ingredient constraints below.
          </p>

          <div className="mb-6">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Exclude Ingredients / Labels
            </label>
            
            <div className="flex gap-2 mb-3">
              <input 
                type="text" 
                placeholder="e.g. Palm Oil" 
                className="flex-1 text-sm px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addBannedLabel()}
              />
              <button 
                onClick={addBannedLabel}
                className="bg-slate-900 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-slate-800"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-1 bg-slate-50 rounded-lg border border-slate-100">
              {bannedLabels.map(label => (
                <button 
                  key={label}
                  onClick={() => removeBannedLabel(label)}
                  className="bg-red-50 hover:bg-red-100 text-red-700 text-xs font-medium px-2.5 py-1 rounded-md border border-red-200 flex items-center gap-1.5 transition"
                  title="Click to remove"
                >
                  <span>✕</span> {label}
                </button>
              ))}
              {bannedLabels.length === 0 && (
                <span className="text-xs text-slate-400 p-2">No active exclusions. Showing all products.</span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={handleSimulateFilter}
          disabled={isSimulating}
          className="w-full bg-orange-500 text-white py-2.5 rounded-lg font-semibold text-sm shadow-sm hover:bg-orange-600 transition disabled:bg-orange-300"
        >
          {isSimulating ? "AI Engine Processing..." : "Run AI Label Filter"}
        </button>
      </aside>

      {/* Main Dashboard Area */}
      <main className="flex-1 p-8 flex flex-col overflow-hidden">
        {/* Top Search Bar */}
        <div className="flex gap-4 mb-8 max-w-2xl w-full">
          <input 
            type="text" 
            className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search grocery catalog items..."
          />
        </div>

        {/* Dynamic Product Grid */}
        <div className="flex-1 overflow-y-auto pr-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
            Verified Clean Catalog Items ({filteredInventory.length})
          </h2>

          {isSimulating ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-40 transition-opacity">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white border border-slate-200 rounded-xl p-4 h-64 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInventory.map((item) => (
                <div key={item.productId} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col justify-between hover:border-slate-300 transition">
                  <div>
                    <div className="bg-slate-50 rounded-lg p-4 mb-3 flex items-center justify-center">
                      <img src={item.imageUrl} alt={item.title} className="h-24 w-24 object-contain mix-blend-multiply" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-800 line-clamp-1">{item.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 h-8">Ingredients: {item.ingredients}</p>
                    <p className="text-orange-500 font-bold text-sm mt-2">₹{item.price}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2">
                    <div className="bg-emerald-50 text-emerald-800 text-[11px] font-medium px-2.5 py-1.5 rounded-md border border-emerald-100 flex items-center gap-1.5">
                      <span>🌱</span> AI Verdict: Verified Clean Profile
                    </div>
                    <button className="w-full bg-slate-900 text-white text-xs py-2 rounded-md font-medium hover:bg-slate-800 transition">
                      Quick Add to Instamart Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isSimulating && filteredInventory.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200 max-w-md mx-auto mt-8">
              <span className="text-3xl">🔍</span>
              <h3 className="font-bold text-slate-700 mt-2">All items filtered out</h3>
              <p className="text-xs text-slate-400 mt-1 px-4">Every available item in this view contained ingredients matching your exclusion filters.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}