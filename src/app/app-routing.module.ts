import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PersonFinderComponent } from './person-finder/person-finder.component';


const routes: Routes = [
  { path: '', component: PersonFinderComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
