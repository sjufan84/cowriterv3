import { z } from 'zod';

export const cookmodeRecipeSchema = z.object({
  recipeName: z.string(),
  ingredients: z.array(
    z.object({
      name: z.string(),
      quantity: z.string(),
    }),
  ),
  directions: z.array(z.string()),
});


export function parseCookmodeRecipe( data: any ): CookmodeRecipe | undefined {
  try {
    const parsedCookmodeRecipe = cookmodeRecipeSchema.parse(data);
    return parsedCookmodeRecipe;
  } catch (error: any) {
    console.error('Error parsing cookmode recipe: ', error);
    return undefined;
  }
}

export type CookmodeRecipe = z.infer<typeof cookmodeRecipeSchema>;