import { NotFoundException } from '@nestjs/common'
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql'
import { PubSub } from 'graphql-subscriptions'
import { NewRecipeInput } from './dto/new-recipe.input'
import { RecipesArgs } from './dto/recipes.args'
import { Recipe } from './models/recipe.model'
import { RecipesService } from './recipes.service'
import { Public } from '@/auth/decorators'

const pubSub = new PubSub()

@Resolver(() => Recipe)
export class RecipesResolver {
  constructor(private readonly recipesService: RecipesService) {}

  @Public()
  @Query(() => Recipe)
  async recipe(@Args('id') id: string): Promise<Recipe> {
    const recipe = await this.recipesService.findOneById(id)
    if (!recipe) throw new NotFoundException(id)

    return recipe
  }

  @Query(() => [Recipe])
  recipes(@Args() recipesArgs: RecipesArgs): Promise<Recipe[]> {
    return this.recipesService.findAll(recipesArgs)
  }

  @Mutation(() => Recipe)
  async addRecipe(@Args('newRecipeData') newRecipeData: NewRecipeInput): Promise<Recipe> {
    const recipe = await this.recipesService.create(newRecipeData)
    pubSub.publish('recipeAdded', { recipeAdded: recipe }).catch(console.error)
    return recipe
  }

  @Mutation(() => Boolean)
  async removeRecipe(@Args('id') id: string) {
    return this.recipesService.remove(id)
  }

  @Subscription(() => Recipe)
  recipeAdded() {
    return pubSub.asyncIterator('recipeAdded')
  }
}
