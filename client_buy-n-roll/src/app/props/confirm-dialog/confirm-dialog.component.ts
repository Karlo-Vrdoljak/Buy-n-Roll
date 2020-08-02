import { Component, OnInit, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-confirm-dialog",
  templateUrl: "./confirm-dialog.component.html",
  styleUrls: ["./confirm-dialog.component.scss"],
})
export class ConfirmDialogComponent implements OnInit {
  displayConfirm: boolean = false;
  @Output() onConfirm = new EventEmitter<boolean>();
  @Output() onCustomConfirm = new EventEmitter<boolean>();
  type: string;
  message: string;
  operation: any;
  value:boolean = false;
  constructor() {}

  ngOnInit(): void {}

  confirmationResolve(choice = false) {
    if (choice == true) {
      this.value = true;
    } else {
      this.value = false;
    }
    this.displayConfirm = false;
  }
  emitValue() {
    if (this.operation) {
      this.onCustomConfirm.emit(this.value);
    } else {
      this.onConfirm.emit(this.value);
    }
  }
  open(message: string = null, type = "danger", operation = null) {
    this.type = type;
    this.message = message;
    this.displayConfirm = true;
    this.operation = operation;
  }
}
