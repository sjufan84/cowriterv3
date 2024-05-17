// Mapping for tool output values
import GroceryListDisplayComponent from "@/components/ui/GroceryListDisplayComponent";
import CookmodeCarousel from "@/components/ui/cookmodeCarousel/CookmodeCarouselComponent";
import GeneratedRecipeDisplay from "@/components/ui/GeneratedRecipeDisplay";
import { ReactNode } from "react";
import { GeneratedRecipe, parseGeneratedRecipe } from "../recipeSchemas/generatedRecipe";
import { GroceryList, parseGroceryList } from "../groceryList/groceryListSchema";
import { CookmodeRecipe, parseCookmodeRecipe } from "../recipeSchemas/cookmodeRecipe";

interface ToolOutputMap {
  [key: string]: (value: any) => JSX.Element;
}

export  function returnGeneratedRecipeDisplay(recipe: GeneratedRecipe) {
  const parsedRecipe =  parseGeneratedRecipe(recipe);
  if (!parsedRecipe) {
    return <div>Invalid recipe</div>;
  }
  return <div><GeneratedRecipeDisplay recipe={recipe} /></div>;
}

export  function returnGroceryListDisplayComponent(groceryList: GroceryList) {
  const finalList =  parseGroceryList(groceryList);
  if (!finalList) {
    return <div>Invalid grocery list</div>;
  }
  return <div><GroceryListDisplayComponent {...finalList}/></div>;
}

export  function returnCookmodeRecipeComponent(steps: Array<string>) {
  if (!steps) {
    return <div>Invalid steps list.</div>;
  }

  return <div><CookmodeCarousel steps={steps} /></div>;
}

export type ToolOutputList = {
  outputList: ReactNode[];
}