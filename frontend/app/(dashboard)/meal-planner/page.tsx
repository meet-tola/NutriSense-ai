/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChefHat,
  Apple,
  Leaf,
  Clock,
  ChevronLeft,
  CheckCircle,
  Save,
  Plus,
  X,
  DollarSign,
  BarChart,
  ShoppingBag,
  Scale,
  Heart,
  Target,
  UtensilsCrossed,
  Package,
  Droplets,
  Carrot,
  Beef,
  Milk,
  Wheat,
  Thermometer,
  AlertCircle,
  CalendarDays,
  ArrowLeft,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Badge } from "@/components/ui/badge";

type MealMode = "daily" | "weekly";
type DietaryPreference =
  | "vegetarian"
  | "vegan"
  | "halal"
  | "kosher"
  | "gluten-free"
  | "dairy-free"
  | "low-carb"
  | "diabetic-friendly";
type FoodCategory =
  | "protein"
  | "vegetable"
  | "fruit"
  | "grain"
  | "dairy"
  | "snack"
  | "beverage"
  | "condiment";
type PriorityLevel = "use-first" | "regular" | "can-wait";

interface Ingredient {
  id: string;
  name: string;
  quantity: string;
  category: FoodCategory;
  expiryDate?: Date;
  priority: PriorityLevel;
  estimatedCost?: number;
}

interface NutritionReport {
  totalItems: number;
  estimatedValue: number;
  categories: { [key in FoodCategory]: number };
  expiryAlerts: number;
  nutritionScore: number;
  wasteRisk: number;
  suggestions: string[];
}

interface Meal {
  title: string;
  ingredients: string[];
  prepMinutes: number;
  instructions: string;
  diabeticFriendly?: boolean;
  costPerServing?: number;
}

interface DayPlan {
  day: number;
  meals: Meal[];
}

interface MealPlan {
  id: string;
  planName: string;
  createdAt: Date;
  days: DayPlan[];
  budget?: number;
}

// Typing Effect Component - Simplified
function TypingEffect({
  text,
  speed = 2,
  onComplete,
  className = "",
}: {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
}) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else if (!isComplete) {
      setIsComplete(true);
      onComplete?.();
    }
  }, [currentIndex, text, speed, isComplete, onComplete]);

  return (
    <p className={`text-gray-600 ${className}`}>
      {displayedText}
      {!isComplete && (
        <span className="inline-block w-1 h-4 bg-gray-400 ml-1 animate-pulse"></span>
      )}
    </p>
  );
}

// Welcome Step - Simplified
function WelcomeStep({
  onSelectMealPlanning,
  onSelectBudgeting,
}: {
  onSelectMealPlanning: () => void;
  onSelectBudgeting: () => void;
}) {
  const [welcomeTextComplete, setWelcomeTextComplete] = useState(false);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-serif text-gray-900">Meal Planner & Budgeting</h1>

        <div className="space-y-3">
          <TypingEffect
            text="Create meal plans or manage your food budget."
            speed={3}
            onComplete={() => setWelcomeTextComplete(true)}
            className="text-base"
          />
        </div>
      </div>

      {welcomeTextComplete && (
        <div className="space-y-4">
          <p className="text-sm text-gray-700">
            Choose what you&apos;d like to do:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Meal Planning Option */}
            <button
              onClick={onSelectMealPlanning}
              className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-left transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center">
                  <ChefHat className="w-5 h-5 text-gray-700" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Meal Planning</div>
                  <div className="text-sm text-gray-500">
                    Create personalized meal plans
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-400">Click to start →</div>
            </button>

            {/* Budgeting Option */}
            <button
              onClick={onSelectBudgeting}
              className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-left transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-gray-700" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    Food Management
                  </div>
                  <div className="text-sm text-gray-500">
                    Track pantry and nutrition
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-400">Click to start →</div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Food Inventory Step - Simplified
function FoodInventoryStep({
  ingredients,
  onAddIngredient,
  onRemoveIngredient,
  onNext,
}: {
  ingredients: Ingredient[];
  onAddIngredient: (ing: Omit<Ingredient, "id">) => void;
  onRemoveIngredient: (id: string) => void;
  onNext: () => void;
}) {
  const [inputValue, setInputValue] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState<FoodCategory>("protein");
  const [expiryDate, setExpiryDate] = useState("");
  const [priority, setPriority] = useState<PriorityLevel>("regular");
  const inputRef = useRef<HTMLInputElement>(null);

  const foodCategories = [
    { value: "protein", label: "Protein", icon: Beef },
    { value: "vegetable", label: "Vegetables", icon: Carrot },
    { value: "fruit", label: "Fruits", icon: Apple },
    { value: "grain", label: "Grains", icon: Wheat },
    { value: "dairy", label: "Dairy", icon: Milk },
    { value: "snack", label: "Snacks", icon: Package },
    { value: "beverage", label: "Beverages", icon: Droplets },
    { value: "condiment", label: "Condiments", icon: UtensilsCrossed },
  ];

  const handleAdd = () => {
    const name = inputValue.trim();
    if (name) {
      onAddIngredient({
        name,
        quantity: quantity || "1 unit",
        category,
        expiryDate: expiryDate ? new Date(expiryDate) : undefined,
        priority,
        estimatedCost: 0,
      });
      setInputValue("");
      setQuantity("");
      setCategory("protein");
      setExpiryDate("");
      setPriority("regular");
      inputRef.current?.focus();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-medium text-gray-900 mb-2">
          Food Inventory
        </h2>
        <p className="text-gray-500">List your available food items</p>
      </div>

      {/* Add Item Form */}
      <div className="border border-gray-100 rounded-lg p-4 bg-white">
        <div className="space-y-3">
          <div>
            <Label className="text-sm text-gray-700 mb-1">Food Name</Label>
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder="e.g., Chicken, Rice, Apples"
              className="border-gray-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm text-gray-700 mb-1">Quantity</Label>
              <Input
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g., 500g"
                className="border-gray-200"
              />
            </div>

            <div>
              <Label className="text-sm text-gray-700 mb-1">Category</Label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as FoodCategory)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none"
              >
                {foodCategories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-gray-700">Priority</Label>
            <div className="flex gap-1">
              {(["use-first", "regular", "can-wait"] as PriorityLevel[]).map(
                (level) => (
                  <button
                    key={level}
                    onClick={() => setPriority(level)}
                    className={`flex-1 py-1.5 text-xs rounded border transition-colors ${
                      priority === level
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {level.replace("-", " ")}
                  </button>
                )
              )}
            </div>
          </div>

          <button
            onClick={handleAdd}
            className="w-full py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Add Item
          </button>
        </div>
      </div>

      {/* Current Inventory */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900">Current Items</h3>
          <span className="text-xs text-gray-500">
            {ingredients.length} items
          </span>
        </div>

        {ingredients.length === 0 ? (
          <div className="text-center py-8 border border-gray-200 rounded-lg">
            <ShoppingBag className="w-8 h-8 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">No items added yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {ingredients.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-white"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center">
                    {(() => {
                      const CatIcon =
                        foodCategories.find((c) => c.value === item.category)
                          ?.icon || Package;
                      return <CatIcon className="w-4 h-4 text-gray-600" />;
                    })()}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">
                      {item.name}
                    </div>
                    <div className="text-xs text-gray-500">{item.quantity}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      item.priority === "use-first"
                        ? "bg-red-50 text-red-700"
                        : item.priority === "regular"
                        ? "bg-gray-100 text-gray-700"
                        : "bg-gray-50 text-gray-500"
                    }`}
                  >
                    {item.priority.replace("-", " ")}
                  </span>
                  <button
                    onClick={() => onRemoveIngredient(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {ingredients.length > 0 && (
          <button
            onClick={onNext}
            disabled={ingredients.length < 2}
            className={`w-full py-2.5 rounded-lg text-sm transition-colors ${
              ingredients.length < 2
                ? "bg-gray-100 text-gray-400"
                : "bg-gray-900 text-white hover:bg-gray-800"
            }`}
          >
            Analyze Nutrition
          </button>
        )}
      </div>
    </div>
  );
}

// Nutrition Report Step - Simplified
function NutritionReportStep({
  ingredients,
  onBack,
  onNext,
}: {
  ingredients: Ingredient[];
  onBack: () => void;
  onNext: () => void;
}) {
  const [report, setReport] = useState<NutritionReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const categories = {} as { [key in FoodCategory]: number };
      ingredients.forEach((ing) => {
        categories[ing.category] = (categories[ing.category] || 0) + 1;
      });

      const expiryAlerts = ingredients.filter(
        (ing) =>
          ing.expiryDate &&
          new Date(ing.expiryDate) <
            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      ).length;

      const estimatedValue = ingredients.length * 5; // Simplified estimate

      const nutritionScore = Math.min(
        100,
        Math.floor((ingredients.length / 15) * 100) +
          Object.keys(categories).length * 10 +
          (expiryAlerts > 0 ? -10 : 10)
      );

      const wasteRisk = Math.min(
        100,
        Math.floor((expiryAlerts / ingredients.length) * 100) * 2
      );

      setReport({
        totalItems: ingredients.length,
        estimatedValue,
        categories,
        expiryAlerts,
        nutritionScore,
        wasteRisk,
        suggestions: [
          "Use proteins and fresh vegetables first",
          "Freeze items approaching expiry",
          "Plan meals around perishable items",
        ],
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [ingredients]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <div className="flex justify-center gap-1 mb-4">
            {[0, 0.2, 0.4].map((delay) => (
              <div key={delay} className="w-2 h-2 rounded-full bg-gray-400" />
            ))}
          </div>
          <p className="text-sm text-gray-600">Analyzing inventory...</p>
        </div>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-medium text-gray-900 mb-2">
          Nutrition Report
        </h2>
        <p className="text-gray-500">Analysis of your food inventory</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="border border-gray-100 rounded-lg p-3 text-center">
          <div className="text-lg font-medium text-gray-900">
            {report.totalItems}
          </div>
          <div className="text-xs text-gray-500">Items</div>
        </div>
        <div className="border border-gray-100 rounded-lg p-3 text-center">
          <div className="text-lg font-medium text-gray-900">
            {report.expiryAlerts}
          </div>
          <div className="text-xs text-gray-500">Expiring</div>
        </div>
        <div className="border border-gray-100 rounded-lg p-3 text-center">
          <div className="text-lg font-medium text-gray-900">
            {report.nutritionScore}
          </div>
          <div className="text-xs text-gray-500">Score</div>
        </div>
      </div>

      {/* Score Bars */}
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-700">Nutrition Balance</span>
            <span className="text-gray-900">{report.nutritionScore}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gray-900 rounded-full"
              style={{ width: `${report.nutritionScore}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-700">Waste Risk</span>
            <span className="text-gray-900">{report.wasteRisk}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                report.wasteRisk > 70
                  ? "bg-red-500"
                  : report.wasteRisk > 40
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
              style={{ width: `${report.wasteRisk}%` }}
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-2">
          Food Categories
        </h3>
        <div className="space-y-2">
          {Object.entries(report.categories).map(([category, count]) => (
            <div
              key={category}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-gray-700 capitalize">{category}</span>
              <span className="text-gray-900">{count} items</span>
            </div>
          ))}
        </div>
      </div>

      {/* Suggestions */}
      <div className="border-t border-gray-100 pt-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Suggestions</h3>
        <ul className="space-y-2">
          {report.suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-sm text-gray-600"
            >
              <CheckCircle className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
              {suggestion}
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <button
          onClick={onNext}
          className="w-full py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
        >
          Get Meal Ideas
        </button>
        <button
          onClick={onBack}
          className="w-full py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm"
        >
          Back
        </button>
      </div>
    </div>
  );
}

// Meal Suggestions Step - Simplified
function MealSuggestionsStep({
  ingredients,
  onBack,
  onComplete,
}: {
  ingredients: Ingredient[];
  onBack: () => void;
  onComplete: () => void;
}) {
  const [suggestions, setSuggestions] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const proteinItems = ingredients
        .filter((i) => i.category === "protein")
        .slice(0, 2);
      const veggieItems = ingredients
        .filter((i) => i.category === "vegetable")
        .slice(0, 3);

      const mealIdeas: Meal[] = [
        {
          title: "Protein & Veggie Bowl",
          ingredients: [
            proteinItems[0]?.name || "Chicken",
            veggieItems[0]?.name || "Broccoli",
            veggieItems[1]?.name || "Bell peppers",
            "Rice",
          ],
          prepMinutes: 25,
          instructions: "Stir-fry protein and vegetables. Serve with rice.",
          costPerServing: 3.5,
        },
        {
          title: "Hearty Soup",
          ingredients: [
            proteinItems[1]?.name || "Beans",
            veggieItems[2]?.name || "Carrots",
            "Onion",
            "Broth",
          ],
          prepMinutes: 40,
          instructions: "Sauté vegetables, add broth and protein, simmer.",
          diabeticFriendly: true,
          costPerServing: 2.75,
        },
      ];

      setSuggestions(mealIdeas);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [ingredients]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-medium text-gray-900 mb-2">Meal Ideas</h2>
        <p className="text-gray-500">Based on your ingredients</p>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="flex justify-center gap-1 mb-4">
            {[0, 0.2, 0.4].map((delay) => (
              <div key={delay} className="w-2 h-2 rounded-full bg-gray-400" />
            ))}
          </div>
          <p className="text-sm text-gray-600">Finding meal ideas...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {suggestions.map((meal, index) => (
            <div key={index} className="border border-gray-100 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">
                    {meal.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    {meal.prepMinutes} min
                  </div>
                </div>
                {meal.diabeticFriendly && (
                  <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                    Diabetic-friendly
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Ingredients</div>
                  <div className="text-sm text-gray-700">
                    {meal.ingredients.join(", ")}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">How to make</div>
                  <div className="text-sm text-gray-700">
                    {meal.instructions}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Tips */}
          <div className="border-t border-gray-100 pt-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Tips</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <Target className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                Use perishable items first
              </li>
              <li className="flex items-start gap-2">
                <Scale className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                Balance protein, vegetables, and grains
              </li>
              <li className="flex items-start gap-2">
                <Leaf className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                Steam or roast to preserve nutrients
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <button
              onClick={onComplete}
              className="w-full py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
            >
              Save Analysis
            </button>
            <button
              onClick={onBack}
              className="w-full py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              Back to Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Meal Planner Step - Keep as is (already minimalist)
function MealPlannerStep() {
  const [step, setStep] = useState<"menu" | "dietary-setup" | "plan-results">(
    "menu"
  );
  const [dietaryPreferences, setDietaryPreferences] = useState<
    DietaryPreference[]
  >(["vegetarian"]);
  const [mealsPerDay, setMealsPerDay] = useState<number>(3);
  const [planDuration, setPlanDuration] = useState<number>(7);
  const [generatedPlan, setGeneratedPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(false);

  const dietaryOptions = [
    {
      id: "vegetarian",
      label: "Vegetarian",
      icon: Leaf,
      description: "No meat, fish, or poultry",
    },
    {
      id: "vegan",
      label: "Vegan",
      icon: Apple,
      description: "No animal products",
    },
    {
      id: "gluten-free",
      label: "Gluten-Free",
      icon: Wheat,
      description: "Avoids gluten",
    },
    {
      id: "dairy-free",
      label: "Dairy-Free",
      icon: Milk,
      description: "No dairy products",
    },
    {
      id: "low-carb",
      label: "Low-Carb",
      icon: Scale,
      description: "Reduced carbs",
    },
    {
      id: "diabetic-friendly",
      label: "Diabetic-Friendly",
      icon: Heart,
      description: "Blood sugar friendly",
    },
  ];

  const handleGeneratePlan = () => {
    setLoading(true);
    setTimeout(() => {
      const mockPlan: MealPlan = {
        id: `plan_${Date.now()}`,
        planName: `${planDuration}-Day ${
          dietaryPreferences[0]?.charAt(0).toUpperCase() +
          dietaryPreferences[0]?.slice(1)
        } Meal Plan`,
        createdAt: new Date(),
        days: Array.from({ length: planDuration }, (_, dayIndex) => ({
          day: dayIndex + 1,
          meals: [
            {
              title: "Protein Breakfast Bowl",
              ingredients: [
                "Greek yogurt",
                "Mixed berries",
                "Chia seeds",
                "Almonds",
              ],
              prepMinutes: 10,
              instructions:
                "Mix yogurt with berries, top with chia seeds and almonds.",
              costPerServing: 2.5,
            },
            {
              title: "Mediterranean Wrap",
              ingredients: [
                "Whole wheat wrap",
                "Hummus",
                "Cucumber",
                "Tomato",
                "Feta",
              ],
              prepMinutes: 15,
              instructions:
                "Spread hummus on wrap, add vegetables and feta, roll and serve.",
              costPerServing: 3.25,
            },
            {
              title: "Buddha Bowl",
              ingredients: [
                "Quinoa",
                "Roasted vegetables",
                "Chickpeas",
                "Tahini",
              ],
              prepMinutes: 30,
              instructions:
                "Cook quinoa, roast vegetables, combine in bowl with chickpeas and dressing.",
              costPerServing: 4.0,
            },
          ],
        })),
        budget: planDuration * 20,
      };
      setGeneratedPlan(mockPlan);
      setLoading(false);
      setStep("plan-results");
    }, 2000);
  };

  const toggleDietaryPreference = (preference: DietaryPreference) => {
    setDietaryPreferences((prev) =>
      prev.includes(preference)
        ? prev.filter((p) => p !== preference)
        : [...prev, preference]
    );
  };

  if (step === "menu") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-medium text-gray-900 mb-2">
            Meal Planner
          </h1>
          <p className="text-gray-500">Create personalized meal plans</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            onClick={() => {
              setDietaryPreferences(["vegetarian"]);
              setMealsPerDay(3);
              setPlanDuration(7);
              handleGeneratePlan();
            }}
            className="border border-gray-200 rounded-xl p-5 hover:border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Quick Plan</h3>
                <p className="text-sm text-gray-500">Generate in seconds</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              7-day vegetarian plan with 3 meals per day
            </p>
            <div className="text-sm text-gray-500">Click to generate →</div>
          </div>

          <div
            onClick={() => setStep("dietary-setup")}
            className="border border-gray-200 rounded-xl p-5 hover:border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <Target className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Custom Plan</h3>
                <p className="text-sm text-gray-500">Tailor to your needs</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Choose dietary preferences, duration, and meal frequency
            </p>
            <div className="text-sm text-gray-500">Click to customize →</div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6 mt-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">
            How it works
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2">
                <span className="text-sm font-medium text-gray-700">1</span>
              </div>
              <p className="text-xs text-gray-600">Choose plan type</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2">
                <span className="text-sm font-medium text-gray-700">2</span>
              </div>
              <p className="text-xs text-gray-600">Set preferences</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2">
                <span className="text-sm font-medium text-gray-700">3</span>
              </div>
              <p className="text-xs text-gray-600">Get plan</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === "dietary-setup") {
    return (
      <div className="space-y-6">
        <div>
          <button
            onClick={() => setStep("menu")}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-2xl font-medium text-gray-900 mb-2">
            Customize Plan
          </h1>
          <p className="text-gray-500">Set your preferences</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Dietary Preferences
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {dietaryOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = dietaryPreferences.includes(
                option.id as DietaryPreference
              );
              return (
                <button
                  key={option.id}
                  onClick={() =>
                    toggleDietaryPreference(option.id as DietaryPreference)
                  }
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    isSelected
                      ? "border-gray-900 bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon
                      className={`w-4 h-4 ${
                        isSelected ? "text-gray-900" : "text-gray-500"
                      }`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        isSelected ? "text-gray-900" : "text-gray-700"
                      }`}
                    >
                      {option.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{option.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Meals per day
            </h3>
            <div className="flex gap-1">
              {[2, 3, 4].map((num) => (
                <button
                  key={num}
                  onClick={() => setMealsPerDay(num)}
                  className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${
                    mealsPerDay === num
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Duration</h3>
            <div className="flex gap-1">
              {[3, 7, 14].map((num) => (
                <button
                  key={num}
                  onClick={() => setPlanDuration(num)}
                  className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${
                    planDuration === num
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {num}d
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="border border-gray-100 rounded-xl p-4 bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-700">Plan summary</span>
            <span className="text-sm font-medium text-gray-900">
              {planDuration} days • {mealsPerDay} meals/day
            </span>
          </div>
          <div className="text-xs text-gray-500">
            {dietaryPreferences
              .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
              .join(", ")}
          </div>
        </div>

        <button
          onClick={handleGeneratePlan}
          disabled={loading}
          className="w-full py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Generating...
            </span>
          ) : (
            "Generate Plan"
          )}
        </button>
      </div>
    );
  }

  if (step === "plan-results" && generatedPlan) {
    return (
      <div className="space-y-6">
        <div>
          <button
            onClick={() => setStep("dietary-setup")}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-2xl font-medium text-gray-900 mb-2">
            {generatedPlan.planName}
          </h1>
          <p className="text-gray-500">Your meal plan is ready</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="border border-gray-100 rounded-lg p-3 text-center">
            <div className="text-lg font-medium text-gray-900">
              {generatedPlan.days.length}
            </div>
            <div className="text-xs text-gray-500">Days</div>
          </div>
          <div className="border border-gray-100 rounded-lg p-3 text-center">
            <div className="text-lg font-medium text-gray-900">
              ${generatedPlan.budget?.toFixed(0)}
            </div>
            <div className="text-xs text-gray-500">Budget</div>
          </div>
          <div className="border border-gray-100 rounded-lg p-3 text-center">
            <div className="text-lg font-medium text-gray-900">
              {generatedPlan.days.length * mealsPerDay}
            </div>
            <div className="text-xs text-gray-500">Meals</div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Day 1 preview
          </h3>
          <div className="space-y-3">
            {generatedPlan.days[0].meals.map((meal, index) => (
              <div
                key={index}
                className="border border-gray-100 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-gray-500">
                        {index === 0
                          ? "Breakfast"
                          : index === 1
                          ? "Lunch"
                          : "Dinner"}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">
                        {meal.prepMinutes} min
                      </span>
                    </div>
                    <h4 className="font-medium text-gray-900">{meal.title}</h4>
                  </div>
                  <span className="text-sm text-gray-700">
                    ${meal.costPerServing?.toFixed(2)}
                  </span>
                </div>

                <details className="group">
                  <summary className="text-sm text-gray-600 cursor-pointer hover:text-gray-900">
                    <span className="inline-flex items-center gap-1">
                      View details
                      <ChevronDown className="w-3 h-3 group-open:rotate-180 transition-transform" />
                    </span>
                  </summary>
                  <div className="mt-2 space-y-2">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">
                        Ingredients
                      </div>
                      <div className="text-sm text-gray-700">
                        {meal.ingredients.join(", ")}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">
                        Instructions
                      </div>
                      <div className="text-sm text-gray-700">
                        {meal.instructions}
                      </div>
                    </div>
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <button className="w-full py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm">
            Download Plan
          </button>
          <button className="w-full py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm">
            Shopping List
          </button>
          <button
            onClick={() => {
              setStep("menu");
              setGeneratedPlan(null);
            }}
            className="w-full py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
          >
            Create New Plan
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default function SmartKitchenPage() {
  const { toast } = useToast();
  const [step, setStep] = useState<
    "welcome" | "budgeting" | "report" | "suggestions" | "meal-planner"
  >("welcome");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  const handleSelectMealPlanning = () => {
    setStep("meal-planner");
  };

  const handleSelectBudgeting = () => {
    setStep("budgeting");
  };

  const handleAddIngredient = (ing: Omit<Ingredient, "id">) => {
    const newIngredient: Ingredient = {
      ...ing,
      id: `ing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    setIngredients((prev) => [...prev, newIngredient]);
  };

  const handleRemoveIngredient = (id: string) => {
    setIngredients((prev) => prev.filter((ing) => ing.id !== id));
  };

  const handleCompleteBudgeting = () => {
    toast({
      title: "Analysis Complete",
      description: "Nutrition report saved.",
    });
    setStep("welcome");
    setIngredients([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg">
        <Toaster />

        {/* Back Button */}
        {step !== "welcome" && (
          <button
            onClick={() =>
              step === "meal-planner"
                ? setStep("welcome")
                : step === "budgeting"
                ? setStep("welcome")
                : step === "report"
                ? setStep("budgeting")
                : step === "suggestions"
                ? setStep("report")
                : () => {}
            }
            className="flex items-center gap-1 text-gray-500 hover:text-gray-700 mb-6 text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        )}

        <AnimatePresence mode="wait">
          {step === "welcome" && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <WelcomeStep
                onSelectMealPlanning={handleSelectMealPlanning}
                onSelectBudgeting={handleSelectBudgeting}
              />
            </motion.div>
          )}

          {step === "meal-planner" && (
            <motion.div
              key="meal-planner"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <MealPlannerStep />
            </motion.div>
          )}

          {step === "budgeting" && (
            <motion.div
              key="budgeting"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <FoodInventoryStep
                ingredients={ingredients}
                onAddIngredient={handleAddIngredient}
                onRemoveIngredient={handleRemoveIngredient}
                onNext={() => setStep("report")}
              />
            </motion.div>
          )}

          {step === "report" && (
            <motion.div
              key="report"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <NutritionReportStep
                ingredients={ingredients}
                onBack={() => setStep("budgeting")}
                onNext={() => setStep("suggestions")}
              />
            </motion.div>
          )}

          {step === "suggestions" && (
            <motion.div
              key="suggestions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <MealSuggestionsStep
                ingredients={ingredients}
                onBack={() => setStep("report")}
                onComplete={handleCompleteBudgeting}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
