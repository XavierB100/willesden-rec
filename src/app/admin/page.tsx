"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Plus, Upload, Save } from "lucide-react";

export default function AdminPage() {
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        price: "",
        category: "Fireplaces",
        description: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        alert("Item 'uploaded' successfully! (This is a demo, data won't persist)");
        setIsLoading(false);
        setFormData({ title: "", price: "", category: "Fireplaces", description: "" });
    };

    return (
        <div className="min-h-screen bg-vintage-cream py-12 px-4 md:px-8">
            <div className="max-w-2xl mx-auto space-y-8 bg-white p-8 rounded-sm shadow-sm border border-vintage-charcoal/5">
                <div className="space-y-2 border-b border-vintage-charcoal/10 pb-4">
                    <h1 className="text-3xl font-serif font-bold text-vintage-charcoal">
                        Stock Management
                    </h1>
                    <p className="text-sm text-vintage-charcoal/60 font-sans">
                        Add new items to the inventory quickly.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Image Upload - mocked visual */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-vintage-charcoal">Photo</label>
                        <div className="border-2 border-dashed border-vintage-charcoal/20 rounded-lg p-8 flex flex-col items-center justify-center text-vintage-charcoal/40 hover:bg-vintage-cream/50 transition-colors cursor-pointer">
                            <Upload className="w-8 h-8 mb-2" />
                            <span className="text-sm">Click to upload or take photo</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-vintage-charcoal">Title</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full p-3 border border-vintage-charcoal/20 rounded-sm focus:outline-none focus:border-forest-green"
                            placeholder="e.g. Victorian Cast Iron Fireplace"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-vintage-charcoal">Price (£)</label>
                            <input
                                type="number"
                                required
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="w-full p-3 border border-vintage-charcoal/20 rounded-sm focus:outline-none focus:border-forest-green"
                                placeholder="0.00"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-vintage-charcoal">Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full p-3 border border-vintage-charcoal/20 rounded-sm focus:outline-none focus:border-forest-green bg-white"
                            >
                                <option>Fireplaces</option>
                                <option>Doors</option>
                                <option>Lighting</option>
                                <option>Garden</option>
                                <option>Furniture</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-vintage-charcoal">Description</label>
                        <textarea
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full p-3 border border-vintage-charcoal/20 rounded-sm focus:outline-none focus:border-forest-green"
                            placeholder="Dimensions, condition, history..."
                        />
                    </div>

                    <Button
                        type="submit"
                        size="lg"
                        className="w-full bg-forest-green hover:bg-forest-green/90"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Publishing...' : 'Publish Item'}
                    </Button>
                </form>
            </div>
        </div>
    );
}
