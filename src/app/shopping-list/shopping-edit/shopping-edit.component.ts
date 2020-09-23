import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})

export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('ingredientForm') ingredientForm: NgForm;

  selectedIngredientSubscription: Subscription;
  indexOfingredientToEdit: number = -1;
  ingredientToEdit: Ingredient;
  editMode: boolean = false;
  
  constructor(private shoppingListService: ShoppingListService) { }
  
  ngOnInit(): void {
    this.selectedIngredientSubscription = this.shoppingListService.ingredientSelected.subscribe(
      (index: number) => {
        this.editMode = true;
        this.indexOfingredientToEdit = index;
        this.ingredientToEdit = this.shoppingListService.getIngredient(index);
        this.ingredientForm.setValue({
          ingredientName: this.ingredientToEdit.name,
          ingredientAmount: this.ingredientToEdit.amount,
          ingredientUnit: this.ingredientToEdit.unit
        });
      }
    );
  }

  onAddOrEditIngredient(ingredientForm: NgForm): void {
    const {ingredientName, ingredientAmount, ingredientUnit} = ingredientForm.value;
    
    if(ingredientName !== '' && ingredientAmount !== '' && ingredientUnit !== '') {
      const newIngredient = new Ingredient(ingredientName, ingredientAmount, ingredientUnit);
      if(this.editMode) {
        this.shoppingListService.updateIngredient(this.indexOfingredientToEdit, newIngredient);
        this.editMode = false;
      } else {
        this.shoppingListService.onIngredientsAdd([newIngredient]);
      }
      this.ingredientForm.reset({
        ingredientName: '', ingredientAmount: '', ingredientUnit: ''
      });

     } else alert("Invalid Value");
  }

  onDeleteIngredient(): void {
    if(this.indexOfingredientToEdit < 0) {
      alert('Select an item to Delete!');
      return;
    }

    this.shoppingListService.deleteIngredient(this.indexOfingredientToEdit);
    this.onClearForm();
  }

  onClearForm(): void {
    this.editMode = false;
    this.ingredientForm.reset();
    this.indexOfingredientToEdit = -1;
  }

  ngOnDestroy():void {
    this.selectedIngredientSubscription.unsubscribe();
  }
}
