import { Component, OnInit,ElementRef,ViewChild, AfterViewInit,ChangeDetectorRef,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Hex Umwandler für mein Fachbericht über das Hexadezimalsystem
// TODO: Rechenweg

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit,AfterViewInit {

  private cdr = inject(ChangeDetectorRef);

  @ViewChild("hexInput", { static: false }) hexInput: ElementRef<HTMLInputElement> | undefined;
  @ViewChild("decimalInput", { static: false }) decimalInput: ElementRef<HTMLInputElement> | undefined;

  public fromOption: string = "hex"
  public toOption: string = "dezimal";

  public hexValue: string = "";
  public hexValues: { symbol: string, value: number }[] = [
    { symbol: "A", value: 10 },
    { symbol: "B", value: 11 },
    { symbol: "C", value: 12 },
    { symbol: "D", value: 13 },
    { symbol: "E", value: 14 },
    { symbol: "F", value: 15 },
  ];

  public decimalValue: string = "";


  constructor() { }

  ngOnInit() {}

  ngAfterViewInit(): void {
    if (this.hexInput) {
      this.hexInput.nativeElement.focus();
    }
  }

  reset() {
    this.fromOption = "hex";
    this.toOption = "dezimal";
    this.decimalValue = "";
    this.hexValue = "";
  }

  trade() {
    if (this.fromOption == "hex" && this.toOption == "dezimal") {
      this.fromOption = "dezimal";
      this.toOption = "hex";
      this.cdr.detectChanges();
      if (this.decimalInput) {
        this.decimalInput.nativeElement.focus();
      }
    } else {
      this.fromOption = "hex";
      this.toOption = "dezimal";
      this.cdr.detectChanges();
      if (this.hexInput) {
        this.hexInput.nativeElement.focus();
      }
    }
  }

  calculateHexToDecimal() {
    let hex: any = "";

    // Kennzeichnungen 0x kann vor dem hex eingegeben werden
    if (this.hexValue.startsWith("0x")) {
      let splittedHex = this.hexValue.split("0x");
      hex = splittedHex[1].split("");
    } else {
      hex = this.hexValue.split("");
    }


    // Zuerst schauen ob wir Buchstaben im hex haben wenn ja umwandeln
    const result = hex.map((c: any) => {
      const found = this.hexValues.find(h => h.symbol === c.toUpperCase());
      if (found) {
        return found.value.toString();
      } else {
        return c;
      }
    });

    hex = result;

    let finalResult = 0;
    hex.reverse(); // wir rechnen von rechts nach links
    for (let i = 0; i < hex.length; i++) {
      let p = 16 ** i; // Ergebnis der Potenz
      finalResult += Number(hex[i]) * p; // hex ziffer mit Ergebnis der Potenz berechnen
    }
    this.decimalValue = finalResult.toString();
    if (this.decimalValue == "NaN") {
      alert("Ungültiger wert für hex: " + this.hexValue);
      this.decimalValue = "";
      this.hexValue = ""; 					
      return;
    }


  }

  calculateDecimalToHex() {
    let decimal = this.decimalValue;
    if (!decimal || !Number(decimal) || decimal.startsWith("0x")) {
      alert("Ungültiger wert für Dezimalzahl: " + decimal);
      this.decimalValue = "";
      this.hexValue = "";
      return;
    }

    // Alle Potenz Ergebnisse
    let potenzResults = [];
    for (let i = decimal.length; i >= 0; i--) {
      let p = 16 ** i;
      potenzResults.push(p);
    }


    // Einzelne Ergebnisse ausrechnen und in array pushen
    let remaining = Number(decimal);
    let resultsArray = [];
    for (let x = 0; x < potenzResults.length; x++) {
      let result = Math.floor(remaining / potenzResults[x]);
      let result_2 = result * potenzResults[x];
      let result_3 = remaining - result_2;


      remaining = result_3;
      resultsArray.push(result);
    }

    // dezimal zahlen in ihre hex zahlen umwandeln
    let result = resultsArray.map(c => {
      const found = this.hexValues.find(h => h.value === c);
      if (found) {
        return found.symbol.toString();
      } else {
        return c;
      }
    });

    while (result[0] === 0) {
      result.shift();
    }

    this.hexValue = "0x" + result.join("");


  }

  calculate() {
    if (this.fromOption == "hex" && this.toOption == "dezimal") {
      this.calculateHexToDecimal();
    } else if (this.fromOption == "dezimal" && this.toOption == "hex") {
      this.calculateDecimalToHex();
    } else {
      alert("Du kannst " + this.fromOption + " nicht in " + this.toOption + " umwandeln.");
    }


  }

}
