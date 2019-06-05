import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {TextComponent} from './text/text.component';
import {CommonModule} from '@angular/common';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatMenuModule,
  MatSelectModule,
  MatTableModule,
  MatToolbarModule
} from '@angular/material';
import {FormsModule} from '@angular/forms';
import {ButtonModule, DropdownModule, FieldModule, LoadingModule, SelectModule} from '@sbb-esta/angular-public';
import {IconArrowRightModule, IconCollectionModule} from '@sbb-esta/angular-icons';
import {NavComponent} from './nav/nav.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { TextBoxComponent } from './text-box/text-box.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    TextComponent,
    NavComponent,
    TextBoxComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    CommonModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    MatMenuModule,
    MatButtonModule,
    MatToolbarModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    MatTableModule,
    IconArrowRightModule,
    ButtonModule,
    SelectModule,
    FieldModule,
    IconCollectionModule,
    DropdownModule,
    LoadingModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
