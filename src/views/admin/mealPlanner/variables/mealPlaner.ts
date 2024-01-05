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
};

export interface UserPreferences {
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

export type MealPlan = { breakfast: Recipe | null; lunch: Recipe | null; dinner: Recipe | null };

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

export type NutrientState = Partial<{ summed: number; breakfast: number; lunch: number; dinner: number; }>;

export interface Nutrient {
  type: 'Calories' | 'Protein' | 'Carbohydrates' | 'Fat';
  label: string;
  setter?: React.Dispatch<React.SetStateAction<NutrientState>>;
};

export type SuggestedMaxServings = { breakfast: number; lunch: number; dinner: number; };

export type CustomServings = { breakfast: number; lunch: number; dinner: number; };