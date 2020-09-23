import { Component, OnDestroy, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipesService } from '../recipes.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  recipesChangedSubscription: Subscription;
  constructor(private recipesSerive: RecipesService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.recipesChangedSubscription = this.recipesSerive.recipesChanged.subscribe((recipes: Recipe[]): void => {
      this.recipes = recipes;
    });
    this.recipes = this.recipesSerive.getRecipes();
  }

  ngOnDestroy():void {
    this.recipesChangedSubscription.unsubscribe();
  }

  onNewRecipe(): void {
    this.router.navigate(['new'], {relativeTo: this.route});
  }
}
