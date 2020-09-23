import { Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ShoppingListService {
  private ingredients: Ingredient[] = [
    new Ingredient('Chicken', 0.5, 'Kg'),
    new Ingredient('Parsley', 10, 'g')
  ];
  
  public ingredientsChanged: Subject<Ingredient[]> = new Subject<Ingredient[]>();
  public ingredientSelected: Subject<number> = new Subject<number>();

  constructor() { }

  public getShoppingList(): Ingredient[] {
    return this.ingredients.slice();
  }

  public getIngredient(index: number): Ingredient {
    return this.ingredients[index];
  }

  public onIngredientsAdd(ingredients: Ingredient[]): void {
    // console.log(this.ingredients);
    this.ingredients.push(...ingredients);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  public updateIngredient(index: number, newIngredient: Ingredient): void {
    this.ingredients[index] = newIngredient;
    this.ingredientsChanged.next(this.ingredients.slice());
  }
  
  public deleteIngredient(index: number): void {
    this.ingredients.splice(index, 1);
    this.ingredientsChanged.next(this.ingredients.slice());
  }
}
