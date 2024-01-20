import {
  BMIInfo,
  BodyMass,
  UserData,
  DailyCaloryRequirements,
  MacroNutrientsData,
  Goal
} from "../../../../types/weightStats";

const headers = {
  "X-RapidAPI-Host": "fitness-calculator.p.rapidapi.com",
  "X-RapidAPI-Key": "e3ed959789msh812fb49d4659a43p1f5983jsnd957c64a5aab",
  "Content-Type": "application/json"
};

export const fetchCaloriesForActivityLevels = async (
  age: number,
  gender: string,
  height: number,
  weight: number,
  setDailyCaloryRequirements: React.Dispatch<
    React.SetStateAction<DailyCaloryRequirements[]>
  >
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

    setDailyCaloryRequirements(dailyCaloryRequirementsData);
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
  goal: Goal,
  setTableData: React.Dispatch<React.SetStateAction<MacroNutrientsData[]>>
) => {
  try {
    const requests = [];

    for (let i = 1; i <= 6; i++) {
      const url = `https://fitness-calculator.p.rapidapi.com/macrocalculator?age=${age}&gender=${gender}&activitylevel=${i}&goal=${goal}&weight=${weight}&height=${height}`;

      requests.push(
        fetch(url, {
          method: "GET",
          headers: headers
        })
      );
    }

    const responses = await Promise.all(requests);

    const data = await Promise.all(responses.map((res) => res.json()));

    const tableData: MacroNutrientsData[] = data.map((item) => [
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

    setTableData(tableData);
  } catch (err: any) {
    console.error(err.message);
  }
};
