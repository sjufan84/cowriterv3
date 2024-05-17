import { z } from 'zod'

// Schemas related to function calls

// GenerateRecipeParameters is a schema that describes the parameters for the generateRecipe function
export const GenerateRecipeParameters = z.object({
  specifications: z
    .string(),
  servingSize: z
    .string(),
  difficultyLevel: z
    .string()
})