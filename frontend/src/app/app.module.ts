import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MainScreenComponent } from './main-screen/main-screen.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CanvasComponent } from './main-screen/canvas/canvas.component';
import { ChatComponent } from './main-screen/chat/chat.component';
import { InfoBarComponent } from './main-screen/info-bar/info-bar.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { AdminComponent } from './admin/admin.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RegistrationComponent } from './registration/registration.component';
import { MatTableModule } from '@angular/material/table';
import { UsersComponent } from './admin/users/users.component';
import { ScoresComponent } from './admin/scores/scores.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminChatComponent } from './admin/admin-chat/admin-chat.component';
import { TokenInterceptor } from './services/token-interceptor';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainScreenComponent,
    CanvasComponent,
    ChatComponent,
    InfoBarComponent,
    AdminComponent,
    RegistrationComponent,
    UsersComponent,
    ScoresComponent,
    AdminChatComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatTabsModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatCardModule,
    MatButtonModule,
    HttpClientModule,
    MatTableModule,
    MatSnackBarModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true,
  }],
  bootstrap: [AppComponent],
})
export class AppModule { }
