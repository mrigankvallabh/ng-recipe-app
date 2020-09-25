import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RecipesService } from '../recipes/recipes.service';
import { Recipe } from '../recipes/recipe.model';
import { exhaustMap, map, take, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(private http: HttpClient, private recipesService: RecipesService, private authService: AuthService) { }

  public storeRecipes(): void {
    const recipes = this.recipesService.getRecipes();
    this.http.put('https://ng-recipe-app-8f555.firebaseio.com/recipes.json', recipes).subscribe(response => {
      console.log(response);
    });
  }

  public fetchRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>('https://ng-recipe-app-8f555.firebaseio.com/recipes.json').pipe(
      map((recipes: Recipe[]) => {
        return recipes.map((recipe: Recipe) => {
          return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
        })
      }),
      tap((recipes: Recipe[]) => {
        this.recipesService.setRecipes(recipes);
      })
    );
  }
}
