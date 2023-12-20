export type HealthInfo = {
    "Hamwi": number,
    "Devine": number,
    "Miller": number,
    "Robinson": number
};
  
export type BodyMass = {
    "Body Fat (U.S. Navy Method)": number,
    "Body Fat Mass": number,
    "Lean Body Mass": number
};
  
export type DailyCaloryRequirement = {
    "BMR": number,
    "goals": {
        "maintain weight": number,
        "Mild weight loss": {
            "loss weight": string,
            "calory": number
        },
        "Weight loss": {
            "loss weight": string,
            "calory": number
        },
        "Extreme weight loss": {
            "loss weight": string,
            "calory": number
        },
        "Mild weight gain": {
            "gain weight": string,
            "calory": number
        },
        "Weight gain": {
            "gain weight": string,
            "calory": number
        },
        "Extreme weight gain": {
            "gain weight": string,
            "calory": number
        }
    }
};

export type ActivityLevel = 'level_1' | 'level_2' | 'level_3' | 'level_4' | 'level_5' | 'level_6';