import { z } from 'zod';

export const generatedRecipeSchema = z.object({
  recipeName: z.string(),
  ingredients: z.array(
    z.object({
      name: z.string(),
      quantity: z.string(),
    }),
  ),
  directions: z.array(z.string()),
  servingSize: z.string().describe('The serving size of the recipe.'),
  difficultyLevel: z.string().describe('The difficulty level of the recipe.'),
  cookTime: z.string().describe('The time it takes to cook the recipe.  Could be null if the recipe is no-cook.').optional(),
  prepTime: z.string().optional().describe('The time it takes to prepare the recipe.'),
  funFact: z.string().describe(`A fun fact about the recipe.  This should be a fascinating tidbit about the history of the dish,
  it's ingredients, etc.  It should be something unexpected and interesting.`),
  pairing: z.string().describe(`A few quick pairing suggestions for the reicpe.  If the recipe is for a kid's dish, do not recommend
  alcohol.  Otherwise, include one alcoholic pairing and one non-alcoholic pairing.  For example, you could say "A late harvest Riesling or
  a glass of milk.`),
  calories: z.string().optional().describe('The number of calories in the recipe.  Do you best to infer this value if not provided.'),
});


export function parseGeneratedRecipe( data: any ): GeneratedRecipe | undefined {

  try {
    const parsedRecipe = generatedRecipeSchema.parse(data);
    return parsedRecipe;
  } catch (error: any) {
    console.error('Error parsing generated recipe: ', error);
    return undefined;
  }
}

export type GeneratedRecipe = z.infer<typeof generatedRecipeSchema>;