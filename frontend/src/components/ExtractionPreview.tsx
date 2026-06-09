"use client";
import { useState } from "react";

export function ExtractionPreview({ data, onSave }: { data: any; onSave: (data: any) => void }) {
  const [formData, setFormData] = useState({
    influencer_handle: data.influencer_handle || "",
    platform: data.platform || "",
    agreed_deliverables: data.agreed_deliverables || "",
    deadline: data.deadline || "",
    cost: data.cost || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6 border rounded-xl shadow-sm bg-white dark:bg-gray-950 dark:border-gray-800 mt-6">
      <h2 className="text-xl font-bold mb-4">Review Extracted Data</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Influencer Handle</label>
          <input name="influencer_handle" value={formData.influencer_handle} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-gray-900 dark:border-gray-700" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Platform</label>
          <input name="platform" value={formData.platform} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-gray-900 dark:border-gray-700" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Deliverables</label>
          <input name="agreed_deliverables" value={formData.agreed_deliverables} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-gray-900 dark:border-gray-700" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Deadline</label>
          <input name="deadline" value={formData.deadline} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-gray-900 dark:border-gray-700" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Cost</label>
          <input name="cost" value={formData.cost} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-gray-900 dark:border-gray-700" />
        </div>
        
        <button onClick={() => onSave(formData)} className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition-colors">
          Verify & Save
        </button>
      </div>
    </div>
  );
}
