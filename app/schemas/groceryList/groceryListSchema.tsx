import { z } from 'zod';

const groceryListIngredientQuantitySchema = z.object({
  quantity: z.string(),
  unit: z.string().optional(),
});

const groceryListIngredientSchema = z.object({
  ingredientName: z.string(),
  recipeQuantity: groceryListIngredientQuantitySchema,
  smallestPurchaseQuantity: groceryListIngredientQuantitySchema,
  category: z.string(),
});


export const groceryListSchema = z.object({
  recipeName: z.string(),
  ingredients: z.array(
    groceryListIngredientSchema,
  ),
});

export type GroceryList = z.infer<typeof groceryListSchema>;

export function parseGroceryList( data: any ): GroceryList | undefined {
  try {
    const groceryList = groceryListSchema.parse(data);
    return groceryList;
  } catch (error: any) {
    console.error('Error parsing grocery list: ', error);
    return undefined;
  }
}