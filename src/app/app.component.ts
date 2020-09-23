import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ng-recipe-app';
  featureToLoad: string = 'recipes';

  onNavigate(feature: string): void {
    this.featureToLoad = feature;
  }
}
