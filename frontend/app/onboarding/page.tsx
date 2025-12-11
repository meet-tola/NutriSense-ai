/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { AnimatePresence, motion } from "framer-motion";

const dietaryOptions = [
  "Vegetarian",
  "Vegan",
  "Halal",
  "Kosher",
  "Gluten-Free",
  "Dairy-Free",
  "Pescatarian",
];
const cuisineOptions = [
  "Italian",
  "Chinese",
  "Indian",
  "Mexican",
  "Japanese",
  "Thai",
  "Mediterranean",
  "American",
  "Middle Eastern",
  "Korean",
];
const healthConditions = [
  "Type 2 Diabetes",
  "Type 1 Diabetes",
  "Prediabetes",
  "Hypertension",
  "High Cholesterol",
  "Heart Disease",
  "Celiac Disease",
];

const steps = [
  {
    title: "Basic Information",
    description: "Let's start with some basics about you",
    fields: [
      {
        key: "age",
        label: "How old are you?",
        type: "number",
        placeholder: "25",
        unit: "years",
        description:
          "We use your age to personalize your daily recommendations.",
      },
      {
        key: "gender",
        label: "What is your gender?",
        type: "select",
        options: [
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
          { value: "other", label: "Other" },
          { value: "prefer_not_to_say", label: "Prefer not to say" },
        ],
        description: "This helps tailor advice to your body.",
      },
      {
        key: "weight",
        label: "What is your weight?",
        type: "number",
        placeholder: "70",
        unit: "kg",
        description: "We'll use this for nutritional calculations.",
      },
      {
        key: "height",
        label: "What is your height?",
        type: "number",
        placeholder: "175",
        unit: "cm",
        description: "This helps determine your ideal weight range.",
      },
      {
        key: "activityLevel",
        label: "What is your activity level?",
        type: "select",
        options: [
          { value: "sedentary", label: "Sedentary (little or no exercise)" },
          { value: "light", label: "Light (exercise 1-3 days/week)" },
          { value: "moderate", label: "Moderate (exercise 3-5 days/week)" },
          { value: "active", label: "Active (exercise 6-7 days/week)" },
          {
            value: "very_active",
            label: "Very Active (physical job or 2x training)",
          },
        ],
        description: "Adjusts your calorie needs based on movement.",
      },
    ],
  },
  {
    title: "Dietary Preferences & Health",
    description: "Tell us about your diet and health",
    fields: [
      {
        key: "dietary",
        label: "Any dietary preferences?",
        type: "checkboxes",
        options: dietaryOptions,
        description: "We'll suggest meals that fit your style.",
      },
      {
        key: "allergies",
        label: "Any allergies?",
        type: "text",
        placeholder: "peanuts, shellfish, soy",
        description: "List them comma-separated to avoid them.",
      },
      {
        key: "healthConditions",
        label: "Any health conditions?",
        type: "checkboxes",
        options: healthConditions,
        description: "This ensures safe, targeted recommendations.",
      },
    ],
  },
  {
    title: "Budget & Cuisine Preferences",
    description: "Wrap up with your tastes and budget",
    fields: [
      {
        key: "monthlyBudget",
        label: "What's your monthly food budget?",
        type: "number",
        placeholder: "300",
        unit: "USD",
        description: "Helps find affordable meal ideas.",
      },
      {
        key: "cuisines",
        label: "Preferred cuisines?",
        type: "checkboxes",
        options: cuisineOptions,
        description: "We'll mix in flavors you love.",
      },
    ],
  },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();

  // Form state
  const [formData, setFormData] = useState({
    age: "",
    weight: "",
    height: "",
    gender: "",
    activityLevel: "",
    monthlyBudget: "",
    selectedDietary: [] as string[],
    selectedCuisines: [] as string[],
    allergies: "",
    selectedConditions: [] as string[],
    hasDiabetes: false,
    diabetesType: "",
    targetBSMin: "",
    targetBSMax: "",
  });

  const currentStepData = steps[step - 1];

  const handleInputChange = (key: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleCheckboxToggle = (key: string, option: string) => {
    const current = formData[key as keyof typeof formData] as string[];
    const newSelection = current.includes(option)
      ? current.filter((item) => item !== option)
      : [...current, option];
    handleInputChange(key, newSelection);

    // Handle diabetes logic
    if (key === "selectedConditions") {
      const isDiabetes = option.toLowerCase().includes("diabetes");
      if (isDiabetes && !current.includes(option)) {
        setFormData((prev) => ({
          ...prev,
          hasDiabetes: true,
          diabetesType: getDiabetesType(option),
        }));
      } else if (isDiabetes && current.includes(option)) {
        const hasOtherDiabetes = newSelection.some(
          (c) => c !== option && c.toLowerCase().includes("diabetes")
        );
        if (!hasOtherDiabetes) {
          setFormData((prev) => ({
            ...prev,
            hasDiabetes: false,
            diabetesType: "",
          }));
        }
      }
    }
  };

  const getDiabetesType = (condition: string) => {
    if (condition === "Type 2 Diabetes") return "type2";
    if (condition === "Type 1 Diabetes") return "type1";
    if (condition === "Prediabetes") return "prediabetes";
    return "";
  };

  const handleNext = () => {
    if (step < steps.length) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/auth/signin");
      return;
    }

    const allergiesArray = formData.allergies
      .split(",")
      .map((a) => a.trim())
      .filter((a) => a);

    const { error } = await supabase
      .from("profiles")
      .update({
        age: formData.age ? Number.parseInt(formData.age) : null,
        weight_kg: formData.weight ? Number.parseFloat(formData.weight) : null,
        height_cm: formData.height ? Number.parseFloat(formData.height) : null,
        gender: formData.gender || null,
        activity_level: formData.activityLevel || null,
        dietary_preferences:
          formData.selectedDietary.length > 0 ? formData.selectedDietary : null,
        allergies: allergiesArray.length > 0 ? allergiesArray : null,
        health_conditions:
          formData.selectedConditions.length > 0
            ? formData.selectedConditions
            : null,
        monthly_budget_usd: formData.monthlyBudget
          ? Number.parseFloat(formData.monthlyBudget)
          : null,
        cultural_cuisine_preferences:
          formData.selectedCuisines.length > 0
            ? formData.selectedCuisines
            : null,
        has_diabetes: formData.hasDiabetes,
        diabetes_type: formData.diabetesType || null,
        target_blood_sugar_min: formData.targetBSMin
          ? Number.parseInt(formData.targetBSMin)
          : null,
        target_blood_sugar_max: formData.targetBSMax
          ? Number.parseInt(formData.targetBSMax)
          : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      console.error("Error updating profile:", error);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  const progress = ((step - 1) / (steps.length - 1)) * 100;

  const renderField = (field: any) => {
    const value = formData[field.key as keyof typeof formData];
    switch (field.type) {
      case "number":
      case "text":
        return (
          <div className="space-y-2">
            <Label className="text-base font-medium">{field.label}</Label>
            <div className="relative">
              <Input
                id={field.key}
                type={field.type}
                placeholder={field.placeholder}
                value={typeof value === "string" ? value : ""}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
                className="pl-3 pr-20 py-4 text-lg border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
              />
              {field.unit && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                  {field.unit}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-1">{field.description}</p>
          </div>
        );
      case "select":
        return (
          <div className="space-y-2">
            <Label className="text-base font-medium">{field.label}</Label>
            <Select
              value={typeof value === "string" ? value : ""}
              onValueChange={(v) => handleInputChange(field.key, v)}
            >
              <SelectTrigger className="py-4 text-lg border-2 border-gray-200 rounded-lg focus:border-green-500">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {field.options.map((opt: any) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-600 mt-1">{field.description}</p>
          </div>
        );
      case "checkboxes":
        return (
          <div className="space-y-2">
            <Label className="text-base font-medium">{field.label}</Label>
            <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto">
              {(value as string[]).length === 0 && (
                <p className="text-sm text-gray-500 col-span-2">
                  None selected
                </p>
              )}
              {field.options.map((option: string) => (
                <div
                  key={option}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleCheckboxToggle(field.key, option)}
                >
                  <Checkbox
                    id={option}
                    checked={(value as string[]).includes(option)}
                    onCheckedChange={() =>
                      handleCheckboxToggle(field.key, option)
                    }
                  />
                  <label htmlFor={option} className="text-sm cursor-pointer">
                    {option}
                  </label>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-1">{field.description}</p>
          </div>
        );
      default:
        return null;
    }
  };

  const renderDiabetesSection = () => {
    if (!formData.hasDiabetes) return null;
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 p-4 bg-blue-50 rounded-lg mt-4"
      >
        <h4 className="font-medium text-blue-900 text-base">
          Diabetes Management Settings
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm">Target Blood Sugar Min (mg/dL)</Label>
            <Input
              type="number"
              placeholder="80"
              value={formData.targetBSMin}
              onChange={(e) => handleInputChange("targetBSMin", e.target.value)}
              className="py-3 border-2 border-gray-200 rounded-lg focus:border-green-500"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Target Blood Sugar Max (mg/dL)</Label>
            <Input
              type="number"
              placeholder="130"
              value={formData.targetBSMax}
              onChange={(e) => handleInputChange("targetBSMax", e.target.value)}
              className="py-3 border-2 border-gray-200 rounded-lg focus:border-green-500"
            />
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-teal-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-gray-900 mb-2">NutriSense AI</h1>
          <div className="w-full bg-gray-200 rounded-full h-1">
            <motion.div
              className="bg-green-500 h-1 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Step {step} of {steps.length}
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {currentStepData.title}
              </h2>
              <p className="text-sm text-gray-600">
                {currentStepData.description}
              </p>
            </div>

            <div className="space-y-6">
              {currentStepData.fields.map((field) => (
                <motion.div
                  key={field.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {renderField(field)}
                </motion.div>
              ))}
              {step === 2 && renderDiabetesSection()}
            </div>

            <div className="flex gap-3 pt-4">
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Back
                </Button>
              )}
              <Button
                onClick={step === steps.length ? handleSubmit : handleNext}
                className="flex-1 text-white py-3 rounded-lg font-medium"
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : step === steps.length
                  ? "Complete Setup"
                  : "Continue"}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
