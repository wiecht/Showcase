import {Component, Input, Output, EventEmitter, OnDestroy, OnInit} from "@angular/core";
import {CustomerResource} from "../../api/resources/customer.resource";
import {TranslateService} from "ng2-translate";
import {LazyLoadEvent} from "primeng/components/common/api";
import {Store} from "@ngrx/store";
import {State} from "../../../app.reducers";
import {ChangeCustomersPageAction} from "../store/customer-list-page.actions";
import {Subscription} from "rxjs/Subscription";
import {Router} from "@angular/router";
import {CustomerListSlice} from "../store/customer-list-page.slice";

@Component({
    selector: "educama-customer-list",
    templateUrl: "./customer-list.component.html"
})
export class CustomerListComponent implements OnInit, OnDestroy {

    public customerList: CustomerResource[];
    public pageNumber: number;
    public pageSize: number;
    public totalPages: number;
    public customersLoading:boolean;

    // relevant slice of store and subscription for this slice
    public customerListSliceSubscription: Subscription;

    public emptyListMessage: string;

    public selectedCustomer: CustomerResource;

    constructor(private _router: Router,
                private _store: Store<State>,
                private _translateService: TranslateService) {

        this._translateService
            .get("GENERIC_NO-RECORDS-FOUND")
            .subscribe(value => this.emptyListMessage = value);
    }

    public ngOnInit() {
        this.customerListSliceSubscription = this._store
            .select(state => state.customerListSlice)
            .distinctUntilChanged()
            .subscribe(customerListSlice => this._updateModel(customerListSlice));
    }

    public ngOnDestroy() {
        this.customerListSliceSubscription.unsubscribe();
    }

    public loadCustomersLazy(event: LazyLoadEvent) {
        this._store.dispatch(new ChangeCustomersPageAction(
            {pageNumber: event.first / event.rows, pageSize: event.rows}
        ));
    }

    public onRowSelect(event: any) {
        this._router.navigate(["/customers/edit/" + event.data.uuid]);
    }

    private _updateModel(customerListSlice: CustomerListSlice) {
        this.customerList = customerListSlice.customerList;
        this.pageNumber = customerListSlice.pageNumber;
        this.pageSize = customerListSlice.pageSize;
        this.totalPages = customerListSlice.totalPages;
        this.customersLoading = customerListSlice.loading;
    }
}
