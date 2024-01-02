import React from 'react';
import { CustomServingInput } from "./CustomServingInput";
import { MealPlan, NutrientState, SuggestedMaxServings, CustomServings } from "../variables/mealPlaner";


interface MealPlanDetailsProps {
  customServings: CustomServings;
  suggestedMaxServings: SuggestedMaxServings;
  mealPlan: MealPlan;
  calories: NutrientState;
  protein: NutrientState;
  carbs: NutrientState;
  fat: NutrientState;
  handleIncrement: (mealType: keyof CustomServings) => void;
  handleDecrement: (mealType: keyof CustomServings) => void;
}

const MealPlanDetails: React.FC<MealPlanDetailsProps> = ({ customServings, suggestedMaxServings, mealPlan, calories, protein, carbs, fat, handleIncrement, handleDecrement }) => {
  return (
    <>
      {Object.keys(customServings).map((mealType) => (
        <React.Fragment key={mealType}>
          <CustomServingInput
            mealType={mealType}
            value={(customServings as any)[mealType] !== 0 ? (customServings as any)[mealType] : (suggestedMaxServings as any)[mealType]}
            onIncrement={() => handleIncrement((mealType as keyof typeof customServings))}
            onDecrement={() => handleDecrement((mealType as keyof typeof customServings))}
          />
          <h1>
            {mealType.charAt(0).toUpperCase() + mealType.slice(1)}: {(mealPlan as any)[mealType]?.title || 'No recipe available'}
          </h1>
          <ul>
            <li>Serving: {(customServings as any)[mealType] !== 0 ? (customServings as any)[mealType] : (suggestedMaxServings as any)[mealType]}</li>
            <li>Calories: {(calories as any)[`${mealType}`]?.toFixed(2) || 'N/A'}</li>
            <li>Protein: {(protein as any)[`${mealType}`]?.toFixed(2) || 'N/A'}</li>
            <li>Carbs: {(carbs as any)[`${mealType}`]?.toFixed(2) || 'N/A'}</li>
            <li>Fat: {(fat as any)[`${mealType}`]?.toFixed(2) || 'N/A'}</li>
          </ul>
        </React.Fragment>
      ))}
      <h1>Summed Calories: {calories.summed?.toFixed(2) || 'N/A'}</h1>
      <h1>Summed Protein: {protein.summed?.toFixed(2) || 'N/A'}</h1>
      <h1>Summed Carbs: {carbs.summed?.toFixed(2) || 'N/A'}</h1>
      <h1>Summed Fat: {fat.summed?.toFixed(2) || 'N/A'}</h1>
    </>
  );
};

export default MealPlanDetails;