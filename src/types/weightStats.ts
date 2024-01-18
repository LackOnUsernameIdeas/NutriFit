export interface Recipe {
  id: string;
  title: string;
  isForBreakfast: boolean;
  photo: string;
  ingredients: Array<{
    ingredient: string;
    quantity: number;
  }>;
  instructions: Array<{
    number: number;
    step: string;
  }>;
  nutrientsForTheRecipe: {
    main: {
      [nutrientName: string]: {
        value: number;
        unit: string;
      };
    };
    otherNutrients: {
      [nutrientName: string]: {
        value: number;
        unit: string;
      };
    };
  };
  weightPerServing: {
    amount: number;
    unit: string;
  };
  suggestedMaxServing: number;
}

export type UserData = {
  height: number;
  age: number;
  weight: number;
  neck: number;
  waist: number;
  hip: number;
  goal?: Goal;
};

export type BMIInfo = {
  bmi: number;
  health: string;
  healthy_bmi_range: string;
};

export type BodyMass = {
  "Body Fat (U.S. Navy Method)": number;
  "Body Fat Mass": number;
  "Lean Body Mass": number;
};

export type DailyCaloryRequirements = {
  level: number;
  BMR: number;
  goals: {
    "maintain weight": number;
    "Mild weight loss": {
      "loss weight": string;
      calory: number;
    };
    "Weight loss": {
      "loss weight": string;
      calory: number;
    };
    "Extreme weight loss": {
      "loss weight": string;
      calory: number;
    };
    "Mild weight gain": {
      "gain weight": string;
      calory: number;
    };
    "Weight gain": {
      "gain weight": string;
      calory: number;
    };
    "Extreme weight gain": {
      "gain weight": string;
      calory: number;
    };
  };
};

export type MacroNutrientsData = [
  {
    name: string;
    protein: number;
    fat: number;
    carbs: number;
  },
  {
    name: string;
    protein: number;
    fat: number;
    carbs: number;
  },
  {
    name: string;
    protein: number;
    fat: number;
    carbs: number;
  },
  {
    name: string;
    protein: number;
    fat: number;
    carbs: number;
  }
];

export type Goal =
  | "maintain"
  | "mildlose"
  | "weightlose"
  | "extremelose"
  | "mildgain"
  | "weightgain"
  | "extremegain";

export interface UserPreferencesForMealPlan {
  Calories: number;
  Protein: number;
  Fat: number;
  Carbohydrates: number;
}

export interface CustomServingInputProps {
  mealType: string;
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  minValue?: 1;
}

export type MealPlan = {
  breakfast: Recipe | null;
  lunch: Recipe | null;
  dinner: Recipe | null;
};

export type WeightPerServing = {
  breakfast: {
    amount: number;
    unit: string;
  };
  lunch: {
    amount: number;
    unit: string;
  };
  dinner: {
    amount: number;
    unit: string;
  };
};

export type Calories = {
  summed: number;
  breakfast: number;
  lunch: number;
  dinner: number;
};

export type Protein = {
  summed: number;
  breakfast: number;
  lunch: number;
  dinner: number;
};

export type Carbs = {
  summed: number;
  breakfast: number;
  lunch: number;
  dinner: number;
};

export type Fat = {
  summed: number;
  breakfast: number;
  lunch: number;
  dinner: number;
};

export type NutrientState = Partial<{
  summed: number;
  breakfast: number;
  lunch: number;
  dinner: number;
}>;

export interface Nutrient {
  type: "Calories" | "Protein" | "Carbohydrates" | "Fat";
  label: string;
  setter?: React.Dispatch<React.SetStateAction<NutrientState>>;
}

export type SuggestedMaxServings = {
  breakfast: number;
  lunch: number;
  dinner: number;
};

export type CustomServings = {
  breakfast: number;
  lunch: number;
  dinner: number;
};
