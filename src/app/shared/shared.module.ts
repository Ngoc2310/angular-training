import { ReactiveFormsModule, FormsModule } from "@angular/forms";

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormComponent } from './form/form.component';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatMenuModule } from "@angular/material/menu";
import { MatSelectModule } from "@angular/material/select";


const MODULES: any[] = [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule, FormsModule,
    MatButtonModule, MatDialogModule,
    MatSlideToggleModule,
    MatButtonModule, MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule
];

const COMPONENTS: any[] = [FormComponent];
const COMPONENTS_DYNAMIC: any[] = [];
const DIRECTIVES: any[] = [];
const PIPES: any[] = [];

@NgModule({
    declarations: [
        ...COMPONENTS,
        ...COMPONENTS_DYNAMIC,
        ...DIRECTIVES,
        ...PIPES,
    ],
    exports: [...MODULES, ...COMPONENTS, ...DIRECTIVES, ...PIPES],
    imports: [...MODULES],
})
export class SharedModule {
}
