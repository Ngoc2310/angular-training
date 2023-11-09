import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { LocalStorageService } from "./shared/services/local-storage.service";

export interface Income {
    title: string,
    id: number
    value: number[]
}

export interface Expense extends Income {
}

@Injectable({
    providedIn: "root"
})
export class AppService {

    constructor(private storageService: LocalStorageService) {
    }

    private incomeSubject: BehaviorSubject<Income[]> = new BehaviorSubject<Income[]>([]);
    public income$: Observable<Income[]> = this.incomeSubject.asObservable();

    private expenseSubject: BehaviorSubject<Expense[]> = new BehaviorSubject<Expense[]>([]);
    public expense$: Observable<Expense[]> = this.expenseSubject.asObservable();

    fetchFromLocalStorage() {
        const income = this.storageService.getValue<Income[]>("income") || [];
        this.set(income);

        const expense = this.storageService.getValue<Expense[]>("expense") || [];
        this.setExpense(expense);
    }

    set(income: Income[]) {
        this.incomeSubject.next(income);
    }

    setExpense(expenses: Expense[]) {
        this.expenseSubject.next(expenses);
    }

    get(): Observable<Income[]> {
        return this.income$;
    }

    getExpense(): Observable<Expense[]> {
        return this.expense$;
    }
}
