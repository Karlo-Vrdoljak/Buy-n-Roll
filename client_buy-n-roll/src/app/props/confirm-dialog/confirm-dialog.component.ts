import { Component, OnInit, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-confirm-dialog",
  templateUrl: "./confirm-dialog.component.html",
  styleUrls: ["./confirm-dialog.component.scss"],
})
export class ConfirmDialogComponent implements OnInit {
  displayConfirm: boolean = false;
  @Output() onConfirm = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit(): void {}

  confirmationResolve(choice = false) {
    if (choice == true) {
      this.onConfirm.emit(true);
    } else {
      this.onConfirm.emit(false);
    }
    this.displayConfirm = false;
  }
  open() {
    this.displayConfirm = true;
  }
}
