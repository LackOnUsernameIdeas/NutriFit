import {
  BMIInfo,
  BodyMass,
  UserData,
  DailyCaloryRequirements,
  MacroNutrientsData,
  Goal
} from "../../../types/weightStats";

const headers = {
  "X-RapidAPI-Host": "fitness-calculator.p.rapidapi.com",
  "X-RapidAPI-Key": "9f28f7d48amsh2d3e88bff5dc3e3p128d8ajsn8d2c53ac54e5",
  "Content-Type": "application/json"
};

function translateBMIHealthToBulgarian(englishHealth: string) {
  const bulgarianTranslations = {
    "Severe Thinness": "Сериозно недохранване",
    "Moderate Thinness": "Средно недохранване",
    "Mild Thinness": "Леко недохранване",
    Normal: "Нормално",
    Overweight: "Наднормено тегло",
    "Obese Class I": "Затлъстяване I Клас",
    "Obese Class II": "Затлъстяване II Клас",
    "Obese Class III": "Затлъстяване III Клас"
  };

  return (bulgarianTranslations as any)[englishHealth] || englishHealth;
}

export const fetchBMIData = async (
  age: number,
  height: number,
  weight: number
): Promise<BMIInfo> => {
  try {
    const response = await fetch(
      `https://fitness-calculator.p.rapidapi.com/bmi?age=21&weight=${weight}&height=${height}`,
      {
        method: "GET",
        headers: headers
      }
    );
    const data = await response.json();

    return {
      bmi: data.data.bmi,
      health: translateBMIHealthToBulgarian(data.data.health),
      healthy_bmi_range: "18.5 - 25"
    };
  } catch (error) {
    console.error("Error fetching BMI data:", error);
    throw error; // Re-throw the error so that the caller can handle it
  }
};

export const fetchPerfectWeightData = async (
  height: number,
  gender: string
): Promise<number> => {
  try {
    const response = await fetch(
      `https://fitness-calculator.p.rapidapi.com/idealweight?gender=${gender}&height=${height}`,
      {
        method: "GET",
        headers: headers
      }
    );
    const data = await response.json();

    return data.data.Devine;
  } catch (error) {
    console.error("Error fetching perfect weight data:", error);
    throw error;
  }
};

export const fetchBodyFatAndLeanMassData = async (
  age: number,
  gender: string,
  height: number,
  weight: number,
  neck: number,
  waist: number,
  hip: number
): Promise<BodyMass> => {
  try {
    const response = await fetch(
      `https://fitness-calculator.p.rapidapi.com/bodyfat?age=${age}&gender=${gender}&weight=${weight}&height=${height}&neck=${neck}&waist=${waist}&hip=${hip}`,
      {
        method: "GET",
        headers: headers
      }
    );
    const data = await response.json();

    return {
      "Body Fat (U.S. Navy Method)": data.data["Body Fat (U.S. Navy Method)"],
      "Body Fat Mass": data.data["Body Fat Mass"],
      "Lean Body Mass": data.data["Lean Body Mass"]
    };
  } catch (error) {
    console.error("Error fetching body fat and lean mass data:", error);
    throw error;
  }
};

export const fetchCaloriesForActivityLevels = async (
  age: number,
  gender: string,
  height: number,
  weight: number
): Promise<DailyCaloryRequirements[]> => {
  try {
    const requests = [];

    for (let i = 1; i <= 6; i++) {
      const url = `https://fitness-calculator.p.rapidapi.com/dailycalorie?age=${age}&gender=${gender}&weight=${weight}&height=${height}&activitylevel=level_${i}`;

      requests.push(fetch(url, { method: "GET", headers: headers }));
    }

    const responses = await Promise.all(requests);
    const data = await Promise.all(responses.map((res) => res.json()));

    return data.map((levelData, index): DailyCaloryRequirements => {
      return {
        level: index + 1,
        BMR: levelData.data.BMR,
        goals: {
          "maintain weight": levelData.data.goals["maintain weight"],
          "Mild weight loss": {
            "loss weight":
              levelData.data.goals["Mild weight loss"]["loss weight"],
            calory: levelData.data.goals["Mild weight loss"].calory
          },
          "Weight loss": {
            "loss weight": levelData.data.goals["Weight loss"]["loss weight"],
            calory: levelData.data.goals["Weight loss"].calory
          },
          "Extreme weight loss": {
            "loss weight":
              levelData.data.goals["Extreme weight loss"]["loss weight"],
            calory: levelData.data.goals["Extreme weight loss"].calory
          },
          "Mild weight gain": {
            "gain weight":
              levelData.data.goals["Mild weight gain"]["gain weight"],
            calory: levelData.data.goals["Mild weight gain"].calory
          },
          "Weight gain": {
            "gain weight": levelData.data.goals["Weight gain"]["gain weight"],
            calory: levelData.data.goals["Weight gain"].calory
          },
          "Extreme weight gain": {
            "gain weight":
              levelData.data.goals["Extreme weight gain"]["gain weight"],
            calory: levelData.data.goals["Extreme weight gain"].calory
          }
        }
      };
    });
  } catch (error) {
    console.error("Error fetching calories for activity levels:", error);
    throw error;
  }
};

export const fetchMacroNutrients = async (
  age: number,
  gender: string,
  height: number,
  weight: number,
  goal: Goal | ""
): Promise<MacroNutrientsData[]> => {
  try {
    const requests = [];

    for (let i = 1; i <= 6; i++) {
      const url = `https://fitness-calculator.p.rapidapi.com/macrocalculator?age=${age}&gender=${gender}&activitylevel=${i}&goal=${goal}&weight=${weight}&height=${height}`;

      requests.push(fetch(url, { method: "GET", headers: headers }));
    }

    const responses = await Promise.all(requests);
    const data = await Promise.all(responses.map((res) => res.json()));

    return data.map((item) => [
      {
        name: "Балансирана",
        protein: item.data.balanced.protein.toFixed(2),
        fat: item.data.balanced.fat.toFixed(2),
        carbs: item.data.balanced.carbs.toFixed(2)
      },
      {
        name: "Ниско съдържание на мазнини",
        protein: item.data.lowfat.protein.toFixed(2),
        fat: item.data.lowfat.fat.toFixed(2),
        carbs: item.data.lowfat.carbs.toFixed(2)
      },
      {
        name: "Ниско съдържание на въглехидрати",
        protein: item.data.lowcarbs.protein.toFixed(2),
        fat: item.data.lowcarbs.fat.toFixed(2),
        carbs: item.data.lowcarbs.carbs.toFixed(2)
      },
      {
        name: "Високо съдържание на Протеин",
        protein: item.data.highprotein.protein.toFixed(2),
        fat: item.data.highprotein.fat.toFixed(2),
        carbs: item.data.highprotein.carbs.toFixed(2)
      }
    ]);
  } catch (error) {
    console.error("Error fetching macro nutrients data:", error);
    throw error;
  }
};
