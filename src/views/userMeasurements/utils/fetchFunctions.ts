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
  weight: number,
  setBMIIndex: React.Dispatch<React.SetStateAction<BMIInfo>>
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
        setBMIIndex(BMIInfo);
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
  setPerfectWeight: React.Dispatch<React.SetStateAction<number>>
) => {
  try {
    fetch(
      `https://fitness-calculator.p.rapidapi.com/idealweight?gender=${"male"}&height=${height}`,
      {
        method: "GET",
        headers: headers
      }
    )
      .then((res) => res.json())
      .then((data) => {
        const bodyMassInfo: number = data.data.Devine;
        setPerfectWeight(bodyMassInfo);
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
  height: number,
  weight: number,
  neck: number,
  waist: number,
  hip: number,
  setBodyFatMassAndLeanMass: React.Dispatch<React.SetStateAction<BodyMass>>
) => {
  try {
    fetch(
      `https://fitness-calculator.p.rapidapi.com/bodyfat?age=${age}&gender=${"male"}&weight=${weight}&height=${height}&neck=${neck}&waist=${waist}&hip=${hip}`,
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
        setBodyFatMassAndLeanMass(bodyMassInfo);
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
  height: number,
  weight: number,
  setDailyCaloryRequirements: React.Dispatch<
    React.SetStateAction<DailyCaloryRequirements[]>
  >
) => {
  try {
    const requests = [];

    for (let i = 1; i <= 6; i++) {
      const url = `https://fitness-calculator.p.rapidapi.com/dailycalorie?age=${age}&gender=${"male"}&weight=${weight}&height=${height}&activitylevel=level_${i}`;

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
  height: number,
  weight: number,
  goal: Goal,
  setTableData: React.Dispatch<React.SetStateAction<MacroNutrientsData[]>>
) => {
  try {
    const requests = [];

    for (let i = 1; i <= 6; i++) {
      const url = `https://fitness-calculator.p.rapidapi.com/macrocalculator?age=${age}&gender=${"male"}&activitylevel=${i}&goal=${goal}&weight=${weight}&height=${height}`;

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
