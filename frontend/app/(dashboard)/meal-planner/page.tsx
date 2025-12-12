/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/purity */
"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Upload, Camera, Search, ShoppingBag, Leaf, AlertTriangle, 
  CheckCircle, DollarSign, Calendar, ChefHat, Apple, Carrot,
  Beef, Fish, Egg, Milk, Coffee, Clock, Users, TrendingUp,
  Download, Share2, Star, Filter, X, Plus, Minus, Heart
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type MealType = "breakfast" | "lunch" | "dinner" | "snack"
type DietPreference = "vegetarian" | "vegan" | "keto" | "paleo" | "mediterranean" | "balanced" | "diabetic"
type DeficiencyType = "iron" | "vitamin-d" | "vitamin-b12" | "calcium" | "protein" | "fiber" | "omega-3"
type BudgetLevel = "low" | "medium" | "high" | "custom"
type HealthGoal = "weight-loss" | "muscle-gain" | "maintenance" | "energy-boost" | "detox"

interface FoodItem {
  id: string
  name: string
  category: string
  quantity: string
  expirationDate?: string
  imageUrl?: string
}

interface MealPlan {
  id: string
  day: string
  meals: {
    type: MealType
    name: string
    calories: number
    protein: number
    carbs: number
    fat: number
    ingredients: string[]
    prepTime: number
    costEstimate: number
  }[]
  totalCalories: number
  nutritionScore: number
}

interface DeficiencyReport {
  type: DeficiencyType
  severity: "low" | "moderate" | "high"
  symptoms: string[]
  recommendedFoods: string[]
  supplementAdvice?: string
  confidence: number
}

interface BudgetPlan {
  budgetLevel: BudgetLevel
  weeklyBudget: number
  shoppingList: {
    item: string
    quantity: string
    estimatedCost: number
    priority: "high" | "medium" | "low"
  }[]
  mealSuggestions: string[]
  costSavingTips: string[]
}

function UploadScanSection() {
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<any>(null)
  const [uploadedItems, setUploadedItems] = useState<FoodItem[]>([
    { id: "1", name: "Chicken Breast", category: "Protein", quantity: "500g" },
    { id: "2", name: "Brown Rice", category: "Grains", quantity: "1kg" },
    { id: "3", name: "Broccoli", category: "Vegetables", quantity: "3 heads" },
    { id: "4", name: "Avocado", category: "Fats", quantity: "2 pieces" },
    { id: "5", name: "Greek Yogurt", category: "Dairy", quantity: "1L" },
  ])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setIsScanning(true)
      // Simulate AI scanning
      setTimeout(() => {
        const newItem: FoodItem = {
          id: Date.now().toString(),
          name: "Scanned Items",
          category: "Mixed",
          quantity: "Various",
          imageUrl: URL.createObjectURL(file)
        }
        setUploadedItems(prev => [...prev, newItem])
        setScanResult({
          detectedItems: [
            { name: "Tomatoes", confidence: 92 },
            { name: "Bell Peppers", confidence: 88 },
            { name: "Onions", confidence: 95 }
          ],
          freshnessScore: 87,
          suggestions: ["Great for making salsa", "Can be used in salads", "Consider meal prep for the week"]
        })
        setIsScanning(false)
      }, 2000)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Area */}
        <Card className="border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-blue-100 flex items-center justify-center">
                <Camera className="w-10 h-10 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">Scan Your Kitchen</h3>
                <p className="text-gray-600 mb-6">Take photos of your fridge, pantry, or grocery receipt</p>
              </div>
              
              <div className="space-y-3">
                <input
                  type="file"
                  id="food-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                  capture="environment"
                />
                <label htmlFor="food-upload">
                  <Button 
                    className="w-full h-12 bg-linear-to-r from-blue-500 to-blue-600"
                    disabled={isScanning}
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    {isScanning ? "Scanning..." : "Take Photo"}
                  </Button>
                </label>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">or</span>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full h-12"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Image
                </Button>
                <input
                  type="file"
                  id="file-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Manual Input */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChefHat className="w-5 h-5" />
              Manual Input
            </CardTitle>
            <CardDescription>Add items you have available</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>Food Item</Label>
              <Input placeholder="e.g., Chicken, Rice, Vegetables..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label>Quantity</Label>
                <Input placeholder="e.g., 500g, 1kg..." />
              </div>
              <div className="space-y-3">
                <Label>Expires</Label>
                <Input type="date" />
              </div>
            </div>
            <Button className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add to Inventory
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Current Inventory */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Current Inventory
            <Badge variant="outline" className="ml-2">{uploadedItems.length} items</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {uploadedItems.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-gray-900">{item.name}</div>
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                    <X className="w-3 h-3" />
                  </Button>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center text-gray-600">
                    <span className="w-20">Category:</span>
                    <Badge variant="secondary" className="ml-2">{item.category}</Badge>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="w-20">Quantity:</span>
                    <span className="font-medium">{item.quantity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add More Items
          </Button>
        </CardFooter>
      </Card>

      {/* Scan Results */}
      {scanResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-linear-to-r from-green-50 to-emerald-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <CheckCircle className="w-5 h-5" />
                AI Scan Results
                <Badge className="bg-green-100 text-green-700 hover:bg-green-200 ml-2">
                  {scanResult.freshnessScore}% Freshness
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Detected Items:</h4>
                  <div className="flex flex-wrap gap-2">
                    {scanResult.detectedItems.map((item: any, index: number) => (
                      <Badge key={index} variant="outline" className="bg-white">
                        {item.name} ({item.confidence}%)
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Suggestions:</h4>
                  <ul className="space-y-2">
                    {scanResult.suggestions.map((suggestion: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <Leaf className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                        <span className="text-gray-700">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

function BudgetPlannerSection() {
  const [budget, setBudget] = useState<number>(100)
  const [budgetLevel, setBudgetLevel] = useState<BudgetLevel>("medium")
  const [familySize, setFamilySize] = useState<number>(2)
  const [preferences, setPreferences] = useState<DietPreference[]>(["balanced"])
  const [generatedPlan, setGeneratedPlan] = useState<BudgetPlan | null>(null)

  const budgetLevels = [
    { id: "low", label: "Budget Friendly", description: "$50-75/week", icon: DollarSign },
    { id: "medium", label: "Balanced", description: "$75-125/week", icon: ShoppingBag },
    { id: "high", label: "Premium", description: "$125+/week", icon: Star },
    { id: "custom", label: "Custom", description: "Set your own budget", icon: Filter },
  ]

  const dietOptions = [
    { id: "vegetarian", label: "Vegetarian", icon: Carrot },
    { id: "vegan", label: "Vegan", icon: Leaf },
    { id: "keto", label: "Keto", icon: Beef },
    { id: "paleo", label: "Paleo", icon: Apple },
    { id: "mediterranean", label: "Mediterranean", icon: Fish },
    { id: "balanced", label: "Balanced", icon: ChefHat },
    { id: "diabetic", label: "Diabetic", icon: AlertTriangle },
  ]

  const generatePlan = () => {
    const plan: BudgetPlan = {
      budgetLevel,
      weeklyBudget: budget,
      shoppingList: [
        { item: "Chicken Breast", quantity: "1kg", estimatedCost: 12, priority: "high" },
        { item: "Brown Rice", quantity: "2kg", estimatedCost: 8, priority: "high" },
        { item: "Mixed Vegetables", quantity: "3kg", estimatedCost: 15, priority: "high" },
        { item: "Eggs", quantity: "30 pieces", estimatedCost: 9, priority: "medium" },
        { item: "Greek Yogurt", quantity: "2L", estimatedCost: 7, priority: "medium" },
        { item: "Avocados", quantity: "6 pieces", estimatedCost: 10, priority: "low" },
        { item: "Nuts & Seeds", quantity: "500g", estimatedCost: 8, priority: "low" },
      ],
      mealSuggestions: [
        "Chicken and vegetable stir-fry with rice",
        "Greek yogurt with nuts and honey",
        "Vegetable omelette with avocado",
        "Grilled chicken salad",
        "Rice and bean bowls with vegetables"
      ],
      costSavingTips: [
        "Buy chicken in bulk and freeze portions",
        "Use seasonal vegetables for better prices",
        "Cook in batches for multiple meals",
        "Plan meals around sales and discounts"
      ]
    }
    setGeneratedPlan(plan)
  }

  return (
    <div className="space-y-6">
      {/* Budget Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Set Your Budget
          </CardTitle>
          <CardDescription>Customize your meal plan based on your budget and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Budget Level */}
          <div className="space-y-4">
            <Label>Budget Level</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {budgetLevels.map((level) => {
                const Icon = level.icon
                return (
                  <button
                    key={level.id}
                    onClick={() => setBudgetLevel(level.id as BudgetLevel)}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                      budgetLevel === level.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                    <div className="font-medium text-gray-900">{level.label}</div>
                    <div className="text-sm text-gray-600">{level.description}</div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Budget Slider */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Weekly Budget: ${budget}</Label>
              <Badge variant="outline" className="bg-blue-50">
                For {familySize} {familySize === 1 ? 'person' : 'people'}
              </Badge>
            </div>
            <Slider
              value={[budget]}
              onValueChange={([value]) => setBudget(value)}
              min={50}
              max={200}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>$50</span>
              <span>$125</span>
              <span>$200</span>
            </div>
          </div>

          {/* Family Size */}
          <div className="space-y-4">
            <Label>Family Size</Label>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setFamilySize(Math.max(1, familySize - 1))}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <div className="flex-1 text-center">
                <div className="text-3xl font-bold text-gray-900">{familySize}</div>
                <div className="text-sm text-gray-600">
                  {familySize === 1 ? 'Person' : 'People'}
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setFamilySize(familySize + 1)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Diet Preferences */}
          <div className="space-y-4">
            <Label>Diet Preferences</Label>
            <div className="flex flex-wrap gap-2">
              {dietOptions.map((diet) => {
                const Icon = diet.icon
                const isSelected = preferences.includes(diet.id as DietPreference)
                return (
                  <button
                    key={diet.id}
                    onClick={() => {
                      if (isSelected) {
                        setPreferences(prev => prev.filter(p => p !== diet.id))
                      } else {
                        setPreferences(prev => [...prev, diet.id as DietPreference])
                      }
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {diet.label}
                  </button>
                )
              })}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full h-12 bg-linear-to-r from-green-500 to-emerald-600"
            onClick={generatePlan}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Generate Smart Meal Plan
          </Button>
        </CardFooter>
      </Card>

      {/* Generated Plan */}
      {generatedPlan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Shopping List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Smart Shopping List
                <Badge variant="outline" className="ml-2">
                  Total: ${generatedPlan.shoppingList.reduce((sum, item) => sum + item.estimatedCost, 0)}
                </Badge>
              </CardTitle>
              <CardDescription>Optimized for your budget and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {generatedPlan.shoppingList.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        item.priority === 'high' ? 'bg-red-100 text-red-600' :
                        item.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        {item.priority === 'high' ? '!' : item.priority === 'medium' ? '?' : '✓'}
                      </div>
                      <div>
                        <div className="font-medium">{item.item}</div>
                        <div className="text-sm text-gray-600">{item.quantity}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">${item.estimatedCost}</div>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          item.priority === 'high' ? 'border-red-200 bg-red-50' :
                          item.priority === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                          'border-green-200 bg-green-50'
                        }`}
                      >
                        {item.priority} priority
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex gap-3">
              <Button variant="outline" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Download List
              </Button>
              <Button variant="outline" className="flex-1">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </CardFooter>
          </Card>

          {/* Meal Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChefHat className="w-5 h-5" />
                Meal Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {generatedPlan.mealSuggestions.map((meal, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-medium text-gray-900">{meal}</div>
                      <Badge variant="outline" className="bg-blue-50">
                        ${Math.floor(Math.random() * 5) + 3}/serving
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        25 min
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        Serves {familySize}
                      </span>
                      <span className="flex items-center gap-1">
                        <Leaf className="w-3 h-3" />
                        Healthy
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cost Saving Tips */}
          <Card className="bg-linear-to-r from-amber-50 to-orange-50 border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-800">
                <TrendingUp className="w-5 h-5" />
                Cost Saving Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {generatedPlan.costSavingTips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                      <DollarSign className="w-3 h-3 text-amber-600" />
                    </div>
                    <p className="text-gray-700">{tip}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

function DeficiencyDetectorSection() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [selectedFoods, setSelectedFoods] = useState<string[]>([])
  const [detectionResult, setDetectionResult] = useState<DeficiencyReport[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const commonSymptoms = [
    { id: "fatigue", label: "Fatigue & Low Energy", deficiency: ["iron", "vitamin-b12", "vitamin-d"] },
    { id: "weakness", label: "Muscle Weakness", deficiency: ["protein", "vitamin-d"] },
    { id: "brain-fog", label: "Brain Fog", deficiency: ["omega-3", "vitamin-b12"] },
    { id: "bone-pain", label: "Bone/Joint Pain", deficiency: ["vitamin-d", "calcium"] },
    { id: "pale-skin", label: "Pale Skin", deficiency: ["iron"] },
    { id: "hair-loss", label: "Hair Loss", deficiency: ["iron", "protein"] },
    { id: "cravings", label: "Food Cravings", deficiency: ["minerals"] },
    { id: "digestive", label: "Digestive Issues", deficiency: ["fiber"] },
  ]

  const commonFoods = [
    { id: "red-meat", label: "Red Meat", nutrients: ["iron", "protein", "vitamin-b12"] },
    { id: "leafy-greens", label: "Leafy Greens", nutrients: ["iron", "calcium", "fiber"] },
    { id: "fish", label: "Fatty Fish", nutrients: ["omega-3", "vitamin-d", "protein"] },
    { id: "dairy", label: "Dairy Products", nutrients: ["calcium", "protein", "vitamin-d"] },
    { id: "nuts-seeds", label: "Nuts & Seeds", nutrients: ["omega-3", "protein", "fiber"] },
    { id: "eggs", label: "Eggs", nutrients: ["protein", "vitamin-b12", "vitamin-d"] },
    { id: "legumes", label: "Legumes", nutrients: ["protein", "iron", "fiber"] },
    { id: "fortified", label: "Fortified Foods", nutrients: ["vitamin-b12", "vitamin-d", "calcium"] },
  ]

  const analyzeDeficiency = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      const deficiencies: DeficiencyReport[] = [
        {
          type: "iron",
          severity: "moderate",
          confidence: 82,
          symptoms: ["Fatigue", "Pale skin", "Weakness"],
          recommendedFoods: ["Spinach", "Red meat", "Lentils", "Fortified cereals"],
          supplementAdvice: "Consider iron supplement with vitamin C for better absorption"
        },
        {
          type: "vitamin-d",
          severity: "low",
          confidence: 75,
          symptoms: ["Fatigue", "Bone pain", "Frequent illness"],
          recommendedFoods: ["Fatty fish", "Egg yolks", "Fortified milk", "Mushrooms"],
          supplementAdvice: "15 minutes of sunlight daily, vitamin D3 supplement"
        }
      ]
      setDetectionResult(deficiencies)
      setIsAnalyzing(false)
    }, 2500)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Symptoms Selector */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              Select Symptoms
            </CardTitle>
            <CardDescription>Choose symptoms you&apos;re experiencing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {commonSymptoms.map((symptom) => (
                <div key={symptom.id} className="flex items-center justify-between p-3 border rounded-lg hover:border-blue-300 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                      selectedSymptoms.includes(symptom.id)
                        ? 'bg-blue-500 border-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedSymptoms.includes(symptom.id) && (
                        <CheckCircle className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <span className="font-medium">{symptom.label}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {symptom.deficiency.length} deficiencies
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Common Foods */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Apple className="w-5 h-5 text-green-600" />
              Common Foods You Eat
            </CardTitle>
            <CardDescription>Select foods you regularly consume</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {commonFoods.map((food) => (
                <button
                  key={food.id}
                  onClick={() => {
                    if (selectedFoods.includes(food.id)) {
                      setSelectedFoods(prev => prev.filter(f => f !== food.id))
                    } else {
                      setSelectedFoods(prev => [...prev, food.id])
                    }
                  }}
                  className={`p-4 border rounded-lg text-center transition-all ${
                    selectedFoods.includes(food.id)
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-gray-900 mb-1">{food.label}</div>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {food.nutrients.map((nutrient) => (
                      <Badge key={nutrient} variant="secondary" className="text-xs">
                        {nutrient}
                      </Badge>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analysis Button */}
      <div className="text-center">
        <Button
          className="h-14 px-8 bg-linear-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
          onClick={analyzeDeficiency}
          disabled={isAnalyzing || (selectedSymptoms.length === 0 && selectedFoods.length === 0)}
        >
          {isAnalyzing ? (
            <>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-100" />
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-200" />
                </div>
                AI Analyzing Patterns...
              </div>
            </>
          ) : (
            <>
              <Search className="w-5 h-5 mr-2" />
              Detect Nutrient Deficiencies
            </>
          )}
        </Button>
        <p className="text-sm text-gray-600 mt-2">
          Based on symptoms and dietary patterns
        </p>
      </div>

      {/* Results */}
      {detectionResult.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {detectionResult.map((deficiency, index) => (
            <Card key={index} className={
              deficiency.severity === 'high' ? 'border-red-200 bg-linear-to-r from-red-50 to-pink-50' :
              deficiency.severity === 'moderate' ? 'border-amber-200 bg-linear-to-r from-amber-50 to-orange-50' :
              'border-green-200 bg-linear-to-r from-green-50 to-emerald-50'
            }>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {deficiency.severity === 'high' ? '🔴' :
                     deficiency.severity === 'moderate' ? '🟡' : '🟢'}
                    {deficiency.type.toUpperCase()} Deficiency
                    <Badge className={
                      deficiency.severity === 'high' ? 'bg-red-100 text-red-700 hover:bg-red-200' :
                      deficiency.severity === 'moderate' ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' :
                      'bg-green-100 text-green-700 hover:bg-green-200'
                    }>
                      {deficiency.severity} severity
                    </Badge>
                  </CardTitle>
                  <div className="text-sm font-medium text-gray-600">
                    {deficiency.confidence}% confidence
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Common Symptoms:</h4>
                  <div className="flex flex-wrap gap-2">
                    {deficiency.symptoms.map((symptom, idx) => (
                      <Badge key={idx} variant="outline" className="bg-white/50">
                        {symptom}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Recommended Foods:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {deficiency.recommendedFoods.map((food, idx) => (
                      <div key={idx} className="bg-white rounded-lg p-3 border text-center">
                        <div className="font-medium">{food}</div>
                        <div className="text-sm text-gray-600">Rich in {deficiency.type}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {deficiency.supplementAdvice && (
                  <div className="bg-white/50 rounded-lg p-4 border">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <h4 className="font-medium text-gray-900">Supplement Advice:</h4>
                    </div>
                    <p className="text-gray-700">{deficiency.supplementAdvice}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <Heart className="w-4 h-4 mr-2" />
                  Create Meal Plan to Address This
                </Button>
              </CardFooter>
            </Card>
          ))}

          {/* Overall Recommendations */}
          <Card className="bg-linear-to-r from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="w-5 h-5" />
                Overall Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-4 border">
                  <div className="font-semibold text-gray-900 mb-2">Dietary Focus</div>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Increase iron-rich foods</li>
                    <li>• Include vitamin C with meals</li>
                    <li>• Regular sunlight exposure</li>
                  </ul>
                </div>
                <div className="bg-white rounded-xl p-4 border">
                  <div className="font-semibold text-gray-900 mb-2">Monitor</div>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Energy levels weekly</li>
                    <li>• Sleep quality</li>
                    <li>• Digestive health</li>
                  </ul>
                </div>
                <div className="bg-white rounded-xl p-4 border">
                  <div className="font-semibold text-gray-900 mb-2">Next Steps</div>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Blood test recommended</li>
                    <li>• Follow-up in 4 weeks</li>
                    <li>• Track improvements</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

function GeneratedMealPlanSection() {
  const [mealPlan, setMealPlan] = useState<MealPlan[]>([
    {
      id: "1",
      day: "Monday",
      totalCalories: 1850,
      nutritionScore: 87,
      meals: [
        {
          type: "breakfast",
          name: "Greek Yogurt with Berries & Nuts",
          calories: 320,
          protein: 22,
          carbs: 28,
          fat: 15,
          ingredients: ["Greek yogurt", "Mixed berries", "Almonds", "Honey"],
          prepTime: 5,
          costEstimate: 3.50
        },
        {
          type: "lunch",
          name: "Grilled Chicken Salad",
          calories: 450,
          protein: 35,
          carbs: 22,
          fat: 18,
          ingredients: ["Chicken breast", "Mixed greens", "Avocado", "Cherry tomatoes", "Olive oil"],
          prepTime: 20,
          costEstimate: 6.00
        },
        {
          type: "dinner",
          name: "Salmon with Roasted Vegetables",
          calories: 580,
          protein: 40,
          carbs: 35,
          fat: 22,
          ingredients: ["Salmon fillet", "Broccoli", "Sweet potato", "Asparagus", "Lemon"],
          prepTime: 30,
          costEstimate: 8.50
        },
        {
          type: "snack",
          name: "Apple with Peanut Butter",
          calories: 200,
          protein: 8,
          carbs: 25,
          fat: 12,
          ingredients: ["Apple", "Natural peanut butter"],
          prepTime: 2,
          costEstimate: 1.50
        }
      ]
    }
  ])

  const [selectedDay, setSelectedDay] = useState("Monday")

  const currentPlan = mealPlan.find(plan => plan.day === selectedDay)

  return (
    <div className="space-y-6">
      {/* Plan Overview */}
      <Card className="bg-linear-to-r from-emerald-50 to-green-50 border-emerald-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-800">
            <Calendar className="w-5 h-5" />
            Your AI-Generated Meal Plan
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
              Nutrition Score: {currentPlan?.nutritionScore || 87}/100
            </Badge>
          </CardTitle>
          <CardDescription>Personalized plan based on your inventory, budget, and health goals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 border text-center">
              <div className="text-2xl font-bold text-gray-900">{currentPlan?.totalCalories}</div>
              <div className="text-sm text-gray-600">Total Calories</div>
            </div>
            <div className="bg-white rounded-xl p-4 border text-center">
              <div className="text-2xl font-bold text-gray-900">{currentPlan?.meals.length}</div>
              <div className="text-sm text-gray-600">Meals</div>
            </div>
            <div className="bg-white rounded-xl p-4 border text-center">
              <div className="text-2xl font-bold text-gray-900">
                ${currentPlan?.meals.reduce((sum, meal) => sum + meal.costEstimate, 0).toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Daily Cost</div>
            </div>
            <div className="bg-white rounded-xl p-4 border text-center">
              <div className="text-2xl font-bold text-gray-90">28g</div>
              <div className="text-sm text-gray-600">Protein/meal avg</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Day Selector */}
      <div className="flex overflow-x-auto pb-2 space-x-2">
        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-6 py-3 rounded-lg whitespace-nowrap transition-all ${
              selectedDay === day
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Meal Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {currentPlan?.meals.map((meal, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <Badge className={
                    meal.type === 'breakfast' ? 'bg-amber-100 text-amber-700' :
                    meal.type === 'lunch' ? 'bg-blue-100 text-blue-700' :
                    meal.type === 'dinner' ? 'bg-purple-100 text-purple-700' :
                    'bg-green-100 text-green-700'
                  }>
                    {meal.type}
                  </Badge>
                  <CardTitle className="mt-2">{meal.name}</CardTitle>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{meal.calories}</div>
                  <div className="text-sm text-gray-600">calories</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Nutrition Info */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <div className="font-bold text-blue-700">{meal.protein}g</div>
                  <div className="text-xs text-blue-600">Protein</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <div className="font-bold text-green-700">{meal.carbs}g</div>
                  <div className="text-xs text-green-600">Carbs</div>
                </div>
                <div className="bg-amber-50 rounded-lg p-3 text-center">
                  <div className="font-bold text-amber-700">{meal.fat}g</div>
                  <div className="text-xs text-amber-600">Fat</div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {meal.prepTime} min prep
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    ${meal.costEstimate}
                  </span>
                </div>

                <div>
                  <div className="font-medium text-gray-900 mb-1">Ingredients:</div>
                  <div className="flex flex-wrap gap-2">
                    {meal.ingredients.map((ingredient, idx) => (
                      <Badge key={idx} variant="outline" className="bg-gray-50">
                        {ingredient}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <ChefHat className="w-4 h-4 mr-2" />
                View Recipe & Instructions
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button className="h-12">
          <Download className="w-4 h-4 mr-2" />
          Download Full Week Plan
        </Button>
        <Button variant="outline" className="h-12">
          <Share2 className="w-4 h-4 mr-2" />
          Share with Family
        </Button>
        <Button variant="outline" className="h-12">
          <ShoppingBag className="w-4 h-4 mr-2" />
          Generate Shopping List
        </Button>
      </div>
    </div>
  )
}

// Helper component for Sparkles icon
function Sparkles(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.287 1.288L3 12l5.8 1.9a2 2 0 0 1 1.288 1.287L12 21l1.9-5.8a2 2 0 0 1 1.287-1.288L21 12l-5.8-1.9a2 2 0 0 1-1.288-1.287Z" />
    </svg>
  )
}

export default function MealPlannerPage() {
  const [activeTab, setActiveTab] = useState("scan")

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Smart Meal Planner</h1>
              <p className="text-gray-600">AI-powered meal planning with nutrition analysis and budget optimization</p>
            </div>
            <Badge className="bg-linear-to-r from-green-500 to-emerald-600 text-white">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Powered
            </Badge>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 border shadow-sm">
              <div className="text-sm text-gray-600 mb-1">Weekly Budget</div>
              <div className="text-2xl font-bold text-gray-900">$95</div>
            </div>
            <div className="bg-white rounded-xl p-4 border shadow-sm">
              <div className="text-sm text-gray-600 mb-1">Nutrition Score</div>
              <div className="text-2xl font-bold text-gray-900">87/100</div>
            </div>
            <div className="bg-white rounded-xl p-4 border shadow-sm">
              <div className="text-sm text-gray-600 mb-1">Items in Inventory</div>
              <div className="text-2xl font-bold text-gray-900">14</div>
            </div>
            <div className="bg-white rounded-xl p-4 border shadow-sm">
              <div className="text-sm text-gray-600 mb-1">Meals Generated</div>
              <div className="text-2xl font-bold text-gray-900">7</div>
            </div>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 h-12">
            <TabsTrigger value="scan" className="flex items-center gap-2">
              <Camera className="w-4 h-4" />
              Scan & Input
            </TabsTrigger>
            <TabsTrigger value="budget" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Budget Planner
            </TabsTrigger>
            <TabsTrigger value="deficiency" className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Deficiency Detector
            </TabsTrigger>
            <TabsTrigger value="plan" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Meal Plan
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scan" className="space-y-6">
            <UploadScanSection />
          </TabsContent>

          <TabsContent value="budget" className="space-y-6">
            <BudgetPlannerSection />
          </TabsContent>

          <TabsContent value="deficiency" className="space-y-6">
            <DeficiencyDetectorSection />
          </TabsContent>

          <TabsContent value="plan" className="space-y-6">
            <GeneratedMealPlanSection />
          </TabsContent>
        </Tabs>

        {/* Quick Tips Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <Card className="bg-linear-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Leaf className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-medium text-gray-900">Pro Tip</div>
                  <div className="text-sm text-gray-600">Scan your groceries as you unpack for automatic inventory</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-linear-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <div>
                  <div className="font-medium text-gray-900">Save 25%</div>
                  <div className="text-sm text-gray-600">Plan meals around sales and seasonal produce</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-linear-to-r from-amber-50 to-orange-50 border-amber-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-amber-600" />
                <div>
                  <div className="font-medium text-gray-900">Health First</div>
                  <div className="text-sm text-gray-600">Address deficiencies before they become health issues</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <Toaster />
    </div>
  )
}