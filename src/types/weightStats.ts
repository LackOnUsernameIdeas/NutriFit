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
  suggestedMaxServing?: number;
}

export interface SuggestedMeal {
  name: string;
  count: number;
  mealData: {
    totals: {
      calories: number;
      carbohydrates: number;
      grams: number;
      fat: number;
      protein: number;
    };
    recipeQuantity: number;
    image: string;
    ingredients: string[];
    name: string;
    instructions: string[];
  };
}
export interface SaveableDeviations {
  calories: {
    deviation: number;
    deviationPercentage: string;
    userLimit: number;
  };
  protein: {
    deviation: number;
    deviationPercentage: string;
    userLimit: number;
  };
  carbohydrates: {
    deviation: number;
    deviationPercentage: string;
    userLimit: number;
  };
  fat: {
    deviation: number;
    deviationPercentage: string;
    userLimit: number;
  };
}

export interface NutrientMeal {
  image: string;
  ingredients: string[];
  instructions: string[];
  name: string;
  recipeQuantity: number;
  totals: {
    calories: number;
    carbohydrates: number;
    grams: number;
    fat: number;
    protein: number;
  };
}

export type UserData = {
  gender?: "male" | "female";
  height: number;
  age: number;
  weight: number;
  neck: number;
  waist: number;
  hip: number;
  goal?: Goal;
  bmi?: number | undefined;
  bodyFat?: number | undefined;
  bodyFatMass?: number | undefined;
  leanBodyMass?: number | undefined;
  differenceFromPerfectWeight?: number | undefined;
  [key: string]: number | string;
};

export type UserIntakes = {
  Calories: number;
  Protein: number;
  Fat: number;
  Carbohydrates: number;
};

export type AllUsersPreferences = {
  date: string;
  calories: number;
  nutrients: {
    protein: number;
    fat: number;
    carbs: number;
    name: string;
  };
};

export type WeightDifference = {
  difference: number;
  isUnderOrAbove: "above" | "under" | "";
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
  Cuisine: string | string[];
  Exclude: string;
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
  totals?: {
    calories: number;
    protein: number;
    fat: number;
    carbohydrates: number;
  };
};

export type MealPlan2 = {
  breakfast: {
    appetizer: any;
    main: any;
    dessert: any;
  } | null;
  lunch: {
    appetizer: any;
    main: any;
    dessert: any;
  } | null;
  dinner: {
    appetizer: any;
    main: any;
    dessert: any;
  } | null;
};

export type MealPlanImages = {
  [mealType: string]: {
    [course: string]: string;
  };
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

export type GenderStatistics = {
  totalUsers: number;
  averageCalories: number;
  averageProtein: number;
  averageCarbs: number;
  averageFat: number;
  averageWeight: number;
  averageBodyFatPercentage: number;
};

export type GenderAverageStats = {
  male: GenderStatistics;
  female: GenderStatistics;
};

export type Deviations = {
  openAI: {
    averageDeviation: number; // Define the type for average deviation
    maxDeviation: number; // Define the type for max deviation
    averageDeviationPercentage: string; // Define the type for average deviation percentage
  };
  bgGPT: {
    averageDeviation: number; // Define the type for average deviation
    maxDeviation: number; // Define the type for max deviation
    averageDeviationPercentage: string; // Define the type for average deviation percentage
  };
};
