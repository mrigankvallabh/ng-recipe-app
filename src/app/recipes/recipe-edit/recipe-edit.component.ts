import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RecipesService } from '../recipes.service';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  private id: number;
  private editMode: boolean = false;
  private paramsSubscription: Subscription;
  recipeForm: FormGroup;

  constructor(private route: ActivatedRoute, private recipesService: RecipesService, private router: Router) { }

  ngOnInit(): void {
    this.paramsSubscription = this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.editMode = params['id'] != undefined;
        this.initForm();
      }
    );
  }

  ngOnDestroy(): void {
    this.paramsSubscription.unsubscribe();
  }

  onSubmit(): void {
    console.log(this.recipeForm.value);
    if(this.editMode) {
      this.recipesService.updateRecipe(this.id, <Recipe>this.recipeForm.value);
    }
    else {
      this.recipesService.addRecipe(<Recipe>this.recipeForm.value);
    }
    this.onGoBack();
  }

  onGoBack(): void {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  onAddIngredient(): void {
    console.log(this.recipeForm.get('ingredients'));
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(null, [Validators.required, Validators.pattern(/^(\d*\.\d+|\d+\.?)$/)]),
        unit: new FormControl(null, Validators.required)
      })
    );
  }

  onDeleteIngredient(index: number): void {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index); // .clear() to remove all
  }

  private initForm(): void {
    let name: string = '', imagePath:string = '', description:string = '';
    let ingredients = new FormArray([]);

    if(this.editMode) {
      const recipe = this.recipesService.getNthRecipe(this.id);
      name = recipe.name;
      imagePath = recipe.imagePath;
      description = recipe.description;
      if (recipe.ingredients) {
        recipe.ingredients.forEach(ingredient => ingredients.push(new FormGroup({
            name: new FormControl(ingredient.name, Validators.required),
            amount: new FormControl(ingredient.amount, [Validators.required, Validators.pattern(/^(\d*\.\d+|\d+\.?)$/)]),
            unit: new FormControl(ingredient.unit, Validators.required)
        })));
      }
    }

    this.recipeForm = new FormGroup({
      name: new FormControl(name, Validators.required),
      imagePath: new FormControl(imagePath, Validators.required),
      description: new FormControl(description, Validators.required),
      ingredients
    });
  }

  get ingredientControls() {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }
}
