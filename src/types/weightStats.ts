export type HealthInfo = {
    "Hamwi": number,
    "Devine": number,
    "Miller": number,
    "Robinson": number
};

export type BMIInfo = {
  "bmi": number,
  "health": string,
  "healthy_bmi_range": string
};
  
export type BodyMass = {
    "Body Fat (U.S. Navy Method)": number,
    "Body Fat Mass": number,
    "Lean Body Mass": number
};

export type UserData = {
  gender: 'male' | 'female',
  height: number,
  age: number,
  weight: number,
  neck: number,
  waist: number,
  hip: number,
  goal: Goal
}

export type DailyCaloryRequirements = {
    'level': number;
    'BMR': number;
    'goals': {
      'maintain weight': number;
      'Mild weight loss': {
        'loss weight': string;
        'calory': number;
      };
      'Weight loss': {
        'loss weight': string;
        'calory': number;
      };
      'Extreme weight loss': {
        'loss weight': string;
        'calory': number;
      };
      'Mild weight gain': {
        'gain weight': string;
        'calory': number;
      };
      'Weight gain': {
        'gain weight': string;
        'calory': number;
      };
      'Extreme weight gain': {
        'gain weight': string;
        'calory': number;
      };
    };
};

export type MacroNutrientsData = [
    {
      name: string,
      protein: number,
      fat: number,
      carbs: number
    },
    {
      name: string,
      protein: number,
      fat: number,
      carbs: number
    },
    {
      name: string,
      protein: number,
      fat: number,
      carbs: number
    },
    {
      name: string,
      protein: number,
      fat: number,
      carbs: number
    }
];

export type Goal = "maintain" | "mildlose" | "weightlose" | "extremelose" | "mildgain" | "weightgain" | "extremegain";