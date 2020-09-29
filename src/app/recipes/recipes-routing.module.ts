import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecipeDetailsComponent } from './recipe-details/recipe-details.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RecipesResolverService } from './recipes-resolver.service';
import { RecipesComponent } from './recipes.component';
import { AuthGuardService } from '../auth/auth-guard.service';

const recipeRoutes: Routes = [
  {
    path: '',
    component: RecipesComponent,
    canActivate: [AuthGuardService],
    // Order of definition of children matters!
    children: [
      { path: '', component: RecipeDetailsComponent, resolve: [RecipesResolverService] },
      { path: 'edit', redirectTo: '-1/edit' },
      { path: 'new', component: RecipeEditComponent },
      { path: ':id', component: RecipeDetailsComponent, resolve: [RecipesResolverService] },
      { path: ':id/edit', component: RecipeEditComponent, resolve: [RecipesResolverService] },
      { path: '**', redirectTo: '/recipes' }
    ]
  }
]
@NgModule({
  imports: [ RouterModule.forChild(recipeRoutes) ],
  exports: [ RouterModule ]
})

export class RecipesRoutingModule {

}