import { Injectable } from '@nestjs/common'
import { uuid } from '@liutsing/utils'
import { NewRecipeInput } from './dto/new-recipe.input'
import { RecipesArgs } from './dto/recipes.args'
import { Recipe } from './models/recipe.model'

@Injectable()
export class RecipesService {
  /**
   * MOCK
   * Put some real business logic here
   * Left for demonstration purposes
   */

  async create(data: NewRecipeInput): Promise<Recipe> {
    console.log(data)
    return {} as AnyToFix
  }

  async findOneById(id: string): Promise<Recipe> {
    const recipe: Recipe = {
      id,
      title: uuid(),
      creationDate: new Date(),
      ingredients: [],
    }
    return recipe
  }

  async findAll(recipesArgs: RecipesArgs): Promise<Recipe[]> {
    console.log(recipesArgs)
    return [] as Recipe[]
  }

  async remove(id: string): Promise<boolean> {
    console.log(id)
    return true
  }
}
