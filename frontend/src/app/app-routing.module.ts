import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { MainScreenComponent } from './main-screen/main-screen.component';

const routes: Routes = [
  {
    path: '',
    component: MainScreenComponent
  },
  {
    path:'admin',
    component:AdminComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
