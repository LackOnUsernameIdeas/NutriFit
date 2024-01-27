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

export const fetchBMIData = async (
  age: number,
  height: number,
  weight: number,
) => {
  try {
    fetch(
      `https://fitness-calculator.p.rapidapi.com/bmi?age=21&weight=${weight}&height=${height}`,
      {
        method: "GET",
        headers: headers
      }
    )
      .then((res) => res.json())
      .then((data) => {
        const BMIInfo: BMIInfo = {
          bmi: data.data.bmi,
          health: translateBMIHealthToBulgarian(data.data.health),
          healthy_bmi_range: "18.5 - 25"
        };
        const uid = getAuth().currentUser.uid;
        saveBMI(uid, BMIInfo.bmi, BMIInfo.health, BMIInfo.healthy_bmi_range);
      })
      .catch((err) => {
        console.log(err.message);
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

export const fetchPerfectWeightData = async (
  height: number,
  gender: string,
  weight: number
) => {
  try {
    fetch(
      `https://fitness-calculator.p.rapidapi.com/idealweight?gender=${gender}&height=${height}`,
      {
        method: "GET",
        headers: headers
      }
    )
      .then((res) => res.json())
      .then((data) => {
        const perfectWeight: number = data.data.Devine;
        const diff = perfectWeight - weight;
        const differenceFromPerfectWeight: WeightDifference = {
          difference: Math.abs(diff),
          isUnderOrAbove: weight > perfectWeight ? "above" : "under"
        };
        const uid = getAuth().currentUser.uid; 
        savePerfectWeight(uid, perfectWeight, differenceFromPerfectWeight);
      })
      .catch((err) => {
        console.log(err.message);
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
  hip: number,
) => {
  try {
    fetch(
      `https://fitness-calculator.p.rapidapi.com/bodyfat?age=${age}&gender=${gender}&weight=${weight}&height=${height}&neck=${neck}&waist=${waist}&hip=${hip}`,
      {
        method: "GET",
        headers: headers
      }
    )
      .then((res) => res.json())
      .then((data) => {
        const bodyMassInfo: BodyMass = {
          "Body Fat (U.S. Navy Method)":
            data.data["Body Fat (U.S. Navy Method)"],
          "Body Fat Mass": data.data["Body Fat Mass"],
          "Lean Body Mass": data.data["Lean Body Mass"]
        };
        const uid = getAuth().currentUser.uid;
        saveBodyMass(uid, bodyMassInfo["Body Fat (U.S. Navy Method)"], bodyMassInfo["Body Fat Mass"], bodyMassInfo["Lean Body Mass"]);
      })
      .catch((err) => {
        console.log(err.message);
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
          headers: headers
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
    for (const goal of goals) {
      for (let i = 1; i <= 6; i++) {
        const url = `https://fitness-calculator.p.rapidapi.com/macrocalculator?age=${age}&gender=${gender}&activitylevel=${i}&goal=${goal}&weight=${weight}&height=${height}`;

        requests.push(
          fetch(url, {
            method: "GET",
            headers: headers
          })
        );
      }
    }

    const responses = await Promise.all(requests);

    const data = await Promise.all(responses.map((res) => res.json()));
    console.log(data);
    const tableData: MacroNutrientsData = [
      {
        name: "Балансирана",
        protein: +data[0].data.balanced.protein.toFixed(2),
        fat: +data[0].data.balanced.fat.toFixed(2),
        carbs: +data[0].data.balanced.carbs.toFixed(2)
      },
      {
        name: "Ниско съдържание на мазнини",
        protein: +data[1].data.lowfat.protein.toFixed(2),
        fat: +data[1].data.lowfat.fat.toFixed(2),
        carbs: +data[1].data.lowfat.carbs.toFixed(2)
      },
      {
        name: "Ниско съдържание на въглехидрати",
        protein: +data[2].data.lowcarbs.protein.toFixed(2),
        fat: +data[2].data.lowcarbs.fat.toFixed(2),
        carbs: +data[2].data.lowcarbs.carbs.toFixed(2)
      },
      {
        name: "Високо съдържание на Протеин",
        protein: +data[3].data.highprotein.protein.toFixed(2),
        fat: +data[3].data.highprotein.fat.toFixed(2),
        carbs: +data[3].data.highprotein.carbs.toFixed(2)
      }
    ];

    // const uid = getAuth().currentUser.uid;
    // saveMacroNutrients(uid, tableData);
  } catch (err: any) {
    console.error(err.message);
  }
};