import {
  BMIInfo,
  BodyMass,
  WeightDifference,
  DailyCaloryRequirements,
  MacroNutrientsData,
  Goal
} from "../../../types/weightStats";

import {
  saveBMI,
  savePerfectWeight,
  saveBodyMass,
  saveDailyCaloryRequirements,
  saveMacroNutrients
} from "../../../database/setWeightStatsData";
import { getAuth } from "firebase/auth";

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

export const sendBeaconWithData = (url: string, data: any) => {
  navigator.sendBeacon(url, JSON.stringify(data));
};

export const fetchBMIData = async (
  age: number,
  height: number,
  weight: number
) => {
  try {
    const url = `https://fitness-calculator.p.rapidapi.com/bmi?age=21&weight=${weight}&height=${height}`;
    const response = await fetch(url, {
      method: "GET",
      headers: headers,
      keepalive: true
    });

    const data = await response.json();
    const BMIInfo: BMIInfo = {
      bmi: data.data.bmi,
      health: translateBMIHealthToBulgarian(data.data.health),
      healthy_bmi_range: "18.5 - 25"
    };

    const uid = getAuth().currentUser.uid;
    saveBMI(uid, BMIInfo.bmi, BMIInfo.health, BMIInfo.healthy_bmi_range);
    sendBeaconWithData(`/saveBMI/${uid}`, BMIInfo);
  } catch (err: any) {
    if (err instanceof TypeError && err.message.includes("failed to fetch")) {
      console.error(
        "Error fetching data. Please check your internet connection."
      );
    } else {
      console.error("An error occurred while fetching data:", err.message);
    }
  }
};

export const fetchPerfectWeightData = async (
  height: number,
  gender: string,
  weight: number
) => {
  try {
    const url = `https://fitness-calculator.p.rapidapi.com/idealweight?gender=${gender}&height=${height}`;
    const response = await fetch(url, {
      method: "GET",
      headers: headers,
      keepalive: true
    });

    const data = await response.json();
    const perfectWeight: number = data.data.Devine;
    const diff = perfectWeight - weight;
    const differenceFromPerfectWeight: WeightDifference = {
      difference: Math.abs(diff),
      isUnderOrAbove: weight > perfectWeight ? "above" : "under"
    };

    const uid = getAuth().currentUser.uid;
    savePerfectWeight(uid, perfectWeight, differenceFromPerfectWeight);
    sendBeaconWithData(`/savePerfectWeight/${uid}`, {
      perfectWeight,
      differenceFromPerfectWeight
    });
  } catch (err: any) {
    if (err instanceof TypeError && err.message.includes("failed to fetch")) {
      console.error(
        "Error fetching data. Please check your internet connection."
      );
    } else {
      console.error("An error occurred while fetching data:", err.message);
    }
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
) => {
  try {
    const url = `https://fitness-calculator.p.rapidapi.com/bodyfat?age=${age}&gender=${gender}&weight=${weight}&height=${height}&neck=${neck}&waist=${waist}&hip=${hip}`;
    const response = await fetch(url, {
      method: "GET",
      headers: headers,
      keepalive: true
    });

    const data = await response.json();
    const bodyMassInfo: BodyMass = {
      "Body Fat (U.S. Navy Method)": data.data["Body Fat (U.S. Navy Method)"],
      "Body Fat Mass": data.data["Body Fat Mass"],
      "Lean Body Mass": data.data["Lean Body Mass"]
    };

    const uid = getAuth().currentUser.uid;
    saveBodyMass(
      uid,
      bodyMassInfo["Body Fat (U.S. Navy Method)"],
      bodyMassInfo["Body Fat Mass"],
      bodyMassInfo["Lean Body Mass"]
    );
    sendBeaconWithData(`/saveBodyMass/${uid}`, bodyMassInfo);
  } catch (err: any) {
    if (err instanceof TypeError && err.message.includes("failed to fetch")) {
      console.error(
        "Error fetching data. Please check your internet connection."
      );
    } else {
      console.error("An error occurred while fetching data:", err.message);
    }
  }
};

export const fetchCaloriesForActivityLevels = async (
  age: number,
  gender: string,
  height: number,
  weight: number
) => {
  try {
    const requests = [];

    for (let i = 1; i <= 6; i++) {
      const url = `https://fitness-calculator.p.rapidapi.com/dailycalorie?age=${age}&gender=${gender}&weight=${weight}&height=${height}&activitylevel=level_${i}`;

      requests.push(
        fetch(url, {
          method: "GET",
          headers: headers,
          keepalive: true
        })
      );
    }

    const responses = await Promise.all(requests);
    const data = await Promise.all(responses.map((res) => res.json()));

    const dailyCaloryRequirementsData = data.map(
      (levelData, index): DailyCaloryRequirements => {
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
      }
    );

    const uid = getAuth().currentUser.uid;
    saveDailyCaloryRequirements(uid, dailyCaloryRequirementsData);
    sendBeaconWithData(
      `/saveDailyCalories/${uid}`,
      dailyCaloryRequirementsData
    );
  } catch (err: any) {
    if (err instanceof TypeError && err.message.includes("failed to fetch")) {
      console.error(
        "Error fetching data. Please check your internet connection."
      );
    } else {
      console.error("An error occurred while fetching data:", err.message);
    }
  }
};

export const fetchMacroNutrients = async (
  age: number,
  gender: string,
  height: number,
  weight: number,
  goals: Goal[] = [] // Allow passing an array of goals
) => {
  try {
    const requests = [];
    const dataFromResponse = [];

    for (let i = 1; i <= 6; i++) {
      const levelData = [];
      for (const goal of goals) {
        const url = `https://fitness-calculator.p.rapidapi.com/macrocalculator?age=${age}&gender=${gender}&activitylevel=${i}&goal=${goal}&weight=${weight}&height=${height}`;

        const response = await fetch(url, {
          method: "GET",
          headers: headers,
          keepalive: true
        });

        const data = await response.json();
        // Attach additional properties for goal and level
        levelData.push({
          goal,
          ...data.data
        });
      }
      dataFromResponse.push({
        level: i,
        goals: levelData
      });
    }

    const uid = getAuth().currentUser.uid;
    saveMacroNutrients(uid, dataFromResponse);
    sendBeaconWithData(`/saveMacroNutrients/${uid}`, dataFromResponse);
  } catch (err: any) {
    console.error(err.message);
  }
};
