import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FireTaskViewComponent, FireCheckProjectInfoComponent, FireCheckDocumentComponent, FireTaskCompletedComponent } from './task-view.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { ConfirmDialogModule } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { OcticonModule } from 'src/app/tools/octicon/octicon.directive';
import { SharedDataModule } from 'src/app/shared/schemas/data.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { FireCheckSchemasModule } from '../schemas';
import { BusinessDocumentModule } from 'src/app/business/document/document-files.component';
import { BusinessKeyTasksResolver } from 'src/app/business/tasks/business-key-tasks.resolver';
import { FireCheckResolver } from '../fire-check.resolver';
import { FireCheckInfoModule } from '../info.module';


const routes: Routes =[
  {path : 'completed/:id' , component: FireTaskCompletedComponent, resolve:{tasks: BusinessKeyTasksResolver, check: FireCheckResolver}},
  {path: ':tid' , component: FireTaskViewComponent, children:[
    {path:'', component: FireCheckProjectInfoComponent},
    {path:'document', component: FireCheckDocumentComponent}
  ]},
]


@NgModule({
  declarations:[
    FireTaskViewComponent, 
    FireCheckProjectInfoComponent,
    FireCheckDocumentComponent,
    FireTaskCompletedComponent
  ],
  imports:[
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatMenuModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatPaginatorModule,
    MatChipsModule,
    MatTabsModule,
    MatTooltipModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    NgxUiLoaderModule,
    ConfirmDialogModule,
    MatSlideToggleModule,
    OcticonModule,
    MatExpansionModule,
    SharedDataModule,
    FireCheckSchemasModule,
    BusinessDocumentModule,
    FireCheckInfoModule
  ]
})
export class FireTaskModule {}
