import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';
import { RecipesResolverService } from './recipes-resolver.service';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  public recipesChanged = new Subject<Recipe[]>(); // Creating an Observable to watch out for changed Recipes

  // private recipes: Recipe[] = [
  //   new Recipe(
  //     'Chopped Salad',
  //     'Healthy vegetarian chopped salad that goes with almost every dish',
  //     '../../../assets/media/quick-chopped-salad-recipe-photos-tablefortwoblog-3-400x400.jpg',
  //     [
  //       new Ingredient('Mix Vegetables Chopped', 1, 'Kg'),
  //       new Ingredient('Feta Cheese', 0.5, 'Lb'),
  //       new Ingredient('Olive Oil', 12, 'Oz'),
  //     ]
  //   ),
  //   new Recipe(
  //     'Pulled Pork Salsa Taco',
  //     'Delicious Pulled Pork Salsa with slow cooked Tacos',
  //     '../../../assets/media/salsa-verde-pulled-pork-tacos-slow-cooker-recipes-400x400.jpg',
  //     [
  //       new Ingredient('Pork Loin Shredded', 1, 'Lb'),
  //       new Ingredient('Taco Breads', 5, 'Pcs'),
  //     ]
  //   ),
  //   new Recipe(
  //     'Spatchcock Turkey',
  //     'Celebrate Christmas with everyone with this traditional Turkey meal',
  //     '../../../assets/media/grilled-spatchcock-turkey-400x400.jpg',
  //     [
  //       new Ingredient('Turkey', 1, 'Whole'),
  //       new Ingredient('Onion', 0.5, 'Kg'),
  //       new Ingredient('Olive Oil', 16, 'Oz'),
  //       new Ingredient('Garlic', 0.25, 'Kg'),
  //     ]
  //   ),
  //   new Recipe(
  //     'Honey Garlic Shrimp Stir Fry',
  //     'Sweet and Tangy stir fried tiger shrimps',
  //     '../../../assets/media/honey-garlic-shrimp-stir-fry-3-400x400.jpg',
  //     [
  //       new Ingredient('Shrimps', 1, 'Lb'),
  //       new Ingredient('Onion', 1, 'Kg'),
  //       new Ingredient('Garlic', 0.25, 'Kg'),
  //     ]
  //   ),
  //   new Recipe(
  //     'Roasted Chicken',
  //     'How can we miss this popular ubiquitous dish',
  //     '../../../assets/media/roasted-chicken-400x400.jpg',
  //     [
  //       new Ingredient('Chicken', 1, 'Whole'),
  //       new Ingredient('Olive Oil', 14, 'Oz'),
  //     ]
  //   )
  // ];
  
  private recipes: Recipe[] = [];
  constructor(private shoppingListService: ShoppingListService) { }

  public setRecipes(recipes: Recipe[]): void {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  public getRecipes(): Recipe[] {
    return this.recipes.slice(); // Return a copy of the array
  }

  public getNthRecipe(n: number = -1): Recipe {
    if(this.recipes.length == 0) return new Recipe('', '', '', []);
    if (n >=0 && n < this.recipes.length)
      return this.recipes[n];
    else if(isNaN(n))
      return null;
    else
      return this.recipes[this.recipes.length - 1];
  }

  public addIngredientsToShoppingList(ingredients: Ingredient[]): void {
    this.shoppingListService.onIngredientsAdd(ingredients);
  }

  public addRecipe(recipe: Recipe): void {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  public updateRecipe(index: number, newRecipe: Recipe): void {
    // console.log(newRecipe);
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  public deleteRecipe(index: number): void {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }
}
