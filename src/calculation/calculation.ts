import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

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

  onToggleCalculation() {
    this.close.emit();
  }
  constructor() { }

  ngOnInit(): void {
    console.log(this.data);

  }
  ngAfterViewInit() {

  }
}
