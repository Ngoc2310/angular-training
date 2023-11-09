import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { LocalStorageService } from "../services/local-storage.service";
import { AppService, Income } from "../../app.service";


interface DataDialog {
    modifyExpense: boolean,
    dataEdit: Income
}

@Component({
    selector: "app-form",
    templateUrl: "./form.component.html",
    styleUrls: ["./form.component.css"]
})

export class FormComponent {
    keyLocalStorage = "income";
    keyLocalStorage2 = "expense";

    months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
    dynamicForm!: FormGroup;
    name = new FormControl("");

    constructor(
        public dialogRef: MatDialogRef<FormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DataDialog,
        private formBuilder: FormBuilder,
        private localStorageService: LocalStorageService,
        private appService: AppService
    ) {
        if (data.dataEdit) {
            this.buildForm(data.dataEdit);
        } else {
            this.buildForm();
        }
    }

    ngOnInit() {
    }

    buildForm(dataEdit?: any) {
        const formControls = this.months.map(month => this.formBuilder.control(""));

        this.dynamicForm = this.formBuilder.group({
            months: this.formBuilder.array(formControls),
            name: this.name
        });

        if (dataEdit) {
            dataEdit.value.forEach((val: any, index: number) => {
                formControls[index].setValue(val);
            });
            this.dynamicForm.patchValue({
                name: dataEdit.title
            });
        } else {
            const defaultValue = "";
            formControls.forEach(control => control.setValue(defaultValue));
        }
    }

    getMonthControl(index: number): FormControl {
        return (this.dynamicForm.get("months") as FormArray).at(index) as FormControl;
    }

    onSave() {
        const key = this.data.modifyExpense ? this.keyLocalStorage2 : this.keyLocalStorage;
        let res: any = JSON.parse(this.localStorageService.get(key)) || [];
        const val = this.dynamicForm.value;

        const data: Income = {
            title: this.name.value || "",
            value: val.months,
            id: new Date().getTime(),
        };

        if (this.data.dataEdit) {
            res.forEach((value: any) => {
                if (value.id === this.data.dataEdit.id) {
                    value.title = this.name.value;
                    value.value = val.months;
                }
            });
        } else {
            res.push(data);
        }

        this.data.modifyExpense ? this.appService.setExpense(res) : this.appService.set(res);
        this.localStorageService.setObject(key, res);
        this.dialogRef.close();
    }
}
