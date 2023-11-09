import { Component, OnInit, ViewChild } from "@angular/core";
import { MatMenuTrigger } from "@angular/material/menu";
import { MatDialog } from "@angular/material/dialog";
import { FormComponent } from "./shared/form/form.component";
import { FormBuilder } from "@angular/forms";
import { LocalStorageService } from "./shared/services/local-storage.service";
import { AppService } from "./app.service";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
    @ViewChild(MatMenuTrigger)
    contextMenu!: MatMenuTrigger;
    contextMenuPosition = { x: "0px", y: "0px" };
    month = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    dataIncome: any[] = [];
    dataExpense: any[] = [];
    keyLocalStorage = "income";
    keyLocalStorage2 = "expense";

    actionDefault = [
        {
            title: "Add",
            onClick: () => this.handleAdd()
        }, {
            title: "Edit",
            onClick: () => this.handleEdit()
        }, {
            title: "Delete",
            onClick: () => this.handleDelete()
        },
    ];

    actions = this.actionDefault;
    totalIncome: any = 0;
    totalExpense: any = 0;
    modifyExpense: boolean = false;

    constructor(
        public dialog: MatDialog,
        private localStorageService: LocalStorageService,
        private appService: AppService
    ) {
    }

    ngOnInit() {
        this.appService.fetchFromLocalStorage();

        this.appService.get().subscribe((response) => {
            this.dataIncome = response;

            this.totalIncome = response.reduce((acc, obj) => {
                const sum = obj.value.reduce((innerAcc, num) => innerAcc + Number(num), 0);
                return acc + sum;
            }, 0);
        });

        this.appService.getExpense().subscribe((response) => {
            this.dataExpense = response;

            this.totalExpense = response.reduce((acc, obj) => {
                const sum = obj.value.reduce((innerAcc, num) => innerAcc + Number(num), 0);
                return acc + sum;
            }, 0);
        });
    }

    openMenu(event: any, item?: number) {
        event.preventDefault();
        this.contextMenuPosition.x = event.clientX + "px";
        this.contextMenuPosition.y = event.clientY + "px";
        this.contextMenu.menuData = item;
        // @ts-ignore
        this.contextMenu.menu.focusFirstItem("mouse");
        this.contextMenu.openMenu();
    }

    add(event: any, isExpense: boolean) {
        this.openMenu(event);
        this.actions = this.actionDefault.filter((val) => val.title === "Add");
        this.modifyExpense = isExpense;
    }

    // Edit -delete
    modify(event: any, item: any, isExpense: boolean) {
        this.openMenu(event, item);
        this.actions = this.actionDefault.filter((val) => val.title !== "Add");
        this.modifyExpense = isExpense;
    }

    handleAdd() {
        this.openDialog();
    }

    handleEdit() {
        const selectData = this.contextMenu.menuData;
        this.openDialog(selectData);
    }

    handleDelete() {
        const key = this.modifyExpense ? this.keyLocalStorage2 : this.keyLocalStorage;
        const selectData = this.contextMenu.menuData;
        const removeData = this.dataIncome.filter((val) => val.id !== selectData.id);

        this.localStorageService.setObject(key, removeData);
        this.modifyExpense ? this.appService.setExpense(removeData) : this.appService.set(removeData);
    }


    openDialog(dataEdit?: any): void {
        const data = {
            modifyExpense: this.modifyExpense,
            dataEdit: dataEdit
        };
        const dialogRef = this.dialog.open(FormComponent, {
            data: data,
            width: "600px",
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log("The dialog was closed");
        });
    }
}
