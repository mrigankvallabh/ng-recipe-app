import { Component, OnInit, OnDestroy } from '@angular/core';
import { Recipe } from '../recipe.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RecipesService } from '../recipes.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.css']
})
export class RecipeDetailsComponent implements OnInit, OnDestroy {
  private id: number = -1; // Get last index
  private paramsSubscription: Subscription;
  public recipeItemDetails: Recipe;

  constructor(private recipesService: RecipesService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.paramsSubscription = this.route.params.subscribe(
      (params: Params) => {
        this.id = +(params['id'] || -1);
        this.recipeItemDetails = this.recipesService.getNthRecipe(this.id);
      }
    );
  }

  onAddToShoppingList(): void {
    this.recipesService.addIngredientsToShoppingList(this.recipeItemDetails.ingredients)
  }

  onEditRecipe(): void {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  onDeleteRecipe(): void {
    this.recipesService.deleteRecipe(this.id);
    this.router.navigate(['/recipes']);
  }

  ngOnDestroy(): void {
    this.paramsSubscription.unsubscribe();
  }
}
