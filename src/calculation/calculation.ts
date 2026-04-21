import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-calculation',
  imports: [],
  templateUrl: './calculation.html',
  styleUrl: './calculation.css',
})
export class Calculation implements OnInit, AfterViewInit {
  @Input("data") data: any;
  @ViewChild("container") container!: ElementRef;
  @Output() close = new EventEmitter<void>;

  public showFullCalc: boolean = false;

  @HostListener("window:keydown", ['$event'])
  onEscape(event: KeyboardEvent) {
    if (event.key == "Escape") {
      this.close.emit();
    }

  }

  onClose() {
    this.close.emit();
  }
  constructor() { }

  ngOnInit(): void {}
  ngAfterViewInit() {}
}
