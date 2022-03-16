import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MainScreenComponent } from './main-screen/main-screen.component';
import { Authorization } from './services/authorization.service';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'home', component: MainScreenComponent, canActivate: [Authorization] },
  { path: '**', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
