/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { 
  Search, Filter, ChevronDown, ChevronUp, 
  Clock, Flame, Apple, Beef, Carrot, Wheat, 
  Milk, Droplets, Package, Scale, Leaf, Heart
} from "lucide-react";
import Image from "next/image";

type FoodCategory = "all" | "protein" | "vegetable" | "fruit" | "grain" | "dairy" | "snack";
type NutrientType = "calories" | "protein" | "carbs" | "fat" | "fiber";

interface FoodItem {
  id: string;
  name: string;
  category: FoodCategory;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  servingSize: string;
  imageUrl?: string;
  benefits: string[];
  prepTips?: string;
  glycemicIndex?: number;
}

export default function FoodDatabasePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [foods, setFoods] = useState<FoodItem[]>([
    {
      id: "1",
      name: "Chicken Breast",
      category: "protein",
      description: "Lean protein source, low in fat",
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      fiber: 0,
      servingSize: "100g cooked",
      imageUrl: "/api/placeholder/200/150",
      benefits: ["High protein", "Low fat", "Rich in B vitamins"],
      prepTips: "Grill or bake with herbs for best results",
      glycemicIndex: 0
    },
    {
      id: "2",
      name: "Broccoli",
      category: "vegetable",
      description: "Nutrient-dense cruciferous vegetable",
      calories: 34,
      protein: 2.8,
      carbs: 7,
      fat: 0.4,
      fiber: 2.6,
      servingSize: "1 cup raw",
      imageUrl: "/api/placeholder/200/150",
      benefits: ["High in vitamin C", "Rich in fiber", "Antioxidants"],
      prepTips: "Steam lightly to preserve nutrients",
      glycemicIndex: 15
    },
    {
      id: "3",
      name: "Quinoa",
      category: "grain",
      description: "Complete protein grain, gluten-free",
      calories: 120,
      protein: 4.4,
      carbs: 21.3,
      fat: 1.9,
      fiber: 2.8,
      servingSize: "1/2 cup cooked",
      imageUrl: "/api/placeholder/200/150",
      benefits: ["Complete protein", "High fiber", "Gluten-free"],
      prepTips: "Rinse before cooking to remove bitterness",
      glycemicIndex: 53
    },
    {
      id: "4",
      name: "Greek Yogurt",
      category: "dairy",
      description: "Protein-rich fermented dairy",
      calories: 59,
      protein: 10,
      carbs: 3.6,
      fat: 0.4,
      fiber: 0,
      servingSize: "100g",
      imageUrl: "/api/placeholder/200/150",
      benefits: ["High protein", "Probiotics", "Calcium source"],
      prepTips: "Choose plain to avoid added sugar",
      glycemicIndex: 35
    },
    {
      id: "5",
      name: "Avocado",
      category: "fruit",
      description: "Healthy fat source, nutrient-dense",
      calories: 160,
      protein: 2,
      carbs: 9,
      fat: 15,
      fiber: 7,
      servingSize: "1/2 medium",
      imageUrl: "/api/placeholder/200/150",
      benefits: ["Healthy fats", "High fiber", "Rich in potassium"],
      prepTips: "Use lemon juice to prevent browning",
      glycemicIndex: 10
    },
    {
      id: "6",
      name: "Salmon",
      category: "protein",
      description: "Fatty fish rich in omega-3",
      calories: 208,
      protein: 20,
      carbs: 0,
      fat: 13,
      fiber: 0,
      servingSize: "100g cooked",
      imageUrl: "/api/placeholder/200/150",
      benefits: ["Omega-3 fatty acids", "Vitamin D", "High protein"],
      prepTips: "Bake at 400°F for 12-15 minutes",
      glycemicIndex: 0
    },
    {
      id: "7",
      name: "Sweet Potato",
      category: "vegetable",
      description: "Nutrient-rich complex carb",
      calories: 86,
      protein: 1.6,
      carbs: 20,
      fat: 0.1,
      fiber: 3,
      servingSize: "1 medium",
      imageUrl: "/api/placeholder/200/150",
      benefits: ["High in vitamin A", "Fiber-rich", "Complex carbs"],
      prepTips: "Bake or roast with skin for extra nutrients",
      glycemicIndex: 70
    },
    {
      id: "8",
      name: "Almonds",
      category: "snack",
      description: "Nutrient-dense healthy snack",
      calories: 164,
      protein: 6,
      carbs: 6,
      fat: 14,
      fiber: 3.5,
      servingSize: "1 oz (28g)",
      imageUrl: "/api/placeholder/200/150",
      benefits: ["Healthy fats", "Vitamin E", "Magnesium"],
      prepTips: "Soak overnight for easier digestion",
      glycemicIndex: 15
    },
  ]);

  const categories = [
    { id: "all", label: "All", icon: Apple },
    { id: "protein", label: "Protein", icon: Beef },
    { id: "vegetable", label: "Vegetables", icon: Carrot },
    { id: "fruit", label: "Fruits", icon: Apple },
    { id: "grain", label: "Grains", icon: Wheat },
    { id: "dairy", label: "Dairy", icon: Milk },
    { id: "snack", label: "Snacks", icon: Package },
  ];

  const filteredFoods = foods.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         food.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || food.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getCategoryIcon = (category: FoodCategory) => {
    const categoryInfo = categories.find(c => c.id === category);
    return categoryInfo?.icon || Apple;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-gray-900 mb-2">Food Database</h1>
          <p className="text-gray-500">Nutrition information for common foods</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search foods..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
            />
          </div>

          {/* Category Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id as FoodCategory)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
                    isActive
                      ? "bg-gray-900 text-white"
                      : "border border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="border border-gray-100 rounded-lg p-3 text-center">
            <div className="text-lg font-medium text-gray-900">{filteredFoods.length}</div>
            <div className="text-xs text-gray-500">Foods</div>
          </div>
          <div className="border border-gray-100 rounded-lg p-3 text-center">
            <div className="text-lg font-medium text-gray-900">
              {foods.filter(f => f.category === "protein").length}
            </div>
            <div className="text-xs text-gray-500">Proteins</div>
          </div>
          <div className="border border-gray-100 rounded-lg p-3 text-center">
            <div className="text-lg font-medium text-gray-900">
              {foods.filter(f => f.category === "vegetable" || f.category === "fruit").length}
            </div>
            <div className="text-xs text-gray-500">Fruits & Veg</div>
          </div>
          <div className="border border-gray-100 rounded-lg p-3 text-center">
            <div className="text-lg font-medium text-gray-900">
              {foods.filter(f => f.category === "dairy" || f.category === "snack").length}
            </div>
            <div className="text-xs text-gray-500">Dairy & Snacks</div>
          </div>
        </div>

        {/* Food Cards */}
        <div className="space-y-3">
          {filteredFoods.length === 0 ? (
            <div className="text-center py-12 border border-gray-200 rounded-lg">
              <Search className="w-8 h-8 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No foods found</p>
              <p className="text-sm text-gray-400 mt-1">Try a different search or filter</p>
            </div>
          ) : (
            filteredFoods.map((food) => {
              const isExpanded = expandedId === food.id;
              const CategoryIcon = getCategoryIcon(food.category);
              
              return (
                <div key={food.id} className="border border-gray-100 rounded-lg overflow-hidden">
                  {/* Header - Always Visible */}
                  <button
                    onClick={() => toggleExpand(food.id)}
                    className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        {/* Food Icon/Image */}
                        <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center">
                          <CategoryIcon className="w-6 h-6 text-gray-700" />
                        </div>
                        
                        {/* Food Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-gray-900 truncate">{food.name}</h3>
                            <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                              {food.category}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{food.description}</p>
                          
                          {/* Quick Stats */}
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Flame className="w-3 h-3" />
                              <span>{food.calories} cal</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Scale className="w-3 h-3" />
                              <span>{food.protein}g protein</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Leaf className="w-3 h-3" />
                              <span>{food.servingSize}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Expand Button */}
                      <div className="ml-3">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </button>
                  
                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 p-4 bg-gray-50">
                      <div className="space-y-4">
                        {/* Nutrition Grid */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Nutrition per {food.servingSize}</h4>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                            <div className="border border-gray-200 rounded p-2 text-center">
                              <div className="text-lg font-medium text-gray-900">{food.calories}</div>
                              <div className="text-xs text-gray-500">Calories</div>
                            </div>
                            <div className="border border-gray-200 rounded p-2 text-center">
                              <div className="text-lg font-medium text-gray-900">{food.protein}g</div>
                              <div className="text-xs text-gray-500">Protein</div>
                            </div>
                            <div className="border border-gray-200 rounded p-2 text-center">
                              <div className="text-lg font-medium text-gray-900">{food.carbs}g</div>
                              <div className="text-xs text-gray-500">Carbs</div>
                            </div>
                            <div className="border border-gray-200 rounded p-2 text-center">
                              <div className="text-lg font-medium text-gray-900">{food.fat}g</div>
                              <div className="text-xs text-gray-500">Fat</div>
                            </div>
                            <div className="border border-gray-200 rounded p-2 text-center">
                              <div className="text-lg font-medium text-gray-900">{food.fiber}g</div>
                              <div className="text-xs text-gray-500">Fiber</div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Benefits & Tips */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Health Benefits</h4>
                            <ul className="space-y-1">
                              {food.benefits.map((benefit, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                                  <Heart className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                                  {benefit}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Preparation Tips</h4>
                            <div className="flex items-start gap-2 text-sm text-gray-600">
                              <Clock className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                              {food.prepTips}
                            </div>
                          </div>
                        </div>
                        
                        {/* Glycemic Index */}
                        {food.glycemicIndex !== undefined && (
                          <div className="border-t border-gray-200 pt-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-1">Glycemic Index</h4>
                                <p className="text-sm text-gray-600">
                                  {food.glycemicIndex < 55 ? "Low GI" : 
                                   food.glycemicIndex < 70 ? "Medium GI" : "High GI"}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-medium text-gray-900">{food.glycemicIndex}</div>
                                <div className="text-xs text-gray-500">Score</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Showing {filteredFoods.length} of {foods.length} foods
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Data based on USDA Food Database
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}