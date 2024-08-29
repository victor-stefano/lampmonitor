import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LampService } from './core/lamp.service';
import { LampMonitorComponent } from './pages/lamp-monitor/lamp-monitor.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';

@NgModule({
  declarations: [
    AppComponent,
    LampMonitorComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    BaseChartDirective
  ],
  providers: [
    provideCharts(withDefaultRegisterables()),
    LampService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
