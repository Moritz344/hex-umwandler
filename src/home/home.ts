import { Component, OnInit,ElementRef,ViewChild, AfterViewInit,ChangeDetectorRef,inject,signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Calculation } from '../calculation/calculation';

// Hex Umwandler für mein Fachbericht über das Hexadezimalsystem
// TODO: Rechenweg

interface Log{
  title: string,
  description: string,
}

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule,Calculation],
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

  public showCalculationWay: boolean = false;
  public logs: Log = { title: "",description: ""};

  constructor() { }

  ngOnInit() {}

  ngAfterViewInit(): void {
    if (this.hexInput) {
      this.hexInput.nativeElement.focus();
    }
  }

  reset() {
    this.decimalValue = "";
    this.hexValue = "";
    this.onCloseCalculation();
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

    this.logs = {
      title: "Rechenweg:",
      description: ""
    }

    this.logs.description +="\n";
    // Zuerst schauen ob wir Buchstaben im hex haben wenn ja umwandeln
    const result = hex.map((c: any) => {
      const found = this.hexValues.find(h => h.symbol === c.toUpperCase());
      if (found) {
        this.logs.description += "Buchstabe: " + found.symbol  + " im Hex gefunden wird nun durch seinen Wert: " + found.value.toString() + " ersetzt \n"
        return found.value.toString();
      } else {
        return c;
      }
    });

    hex = result;
    
    this.logs.description += "Werte: " + result + "\n";
    this.logs.description +="\n";


    let potenzResultsForLogs: { result: string,a: string }[] = [];
    let finalResultForLogs: { result: string,a: string}[] = [];

    let finalResult = 0;
    hex.reverse(); // wir rechnen von rechts nach links
    for (let i = 0; i < hex.length; i++) {
      let p = 16 ** i; // Ergebnis der Potenz
      potenzResultsForLogs.push({result: p.toString(),a: "16 ** " + i});
      finalResult += Number(hex[i]) * p; // hex ziffer mit Ergebnis der Potenz berechnen
      finalResultForLogs.push({result: Number(hex[i] * p).toString(),a: hex[i] + " * " + p});
    }

    this.logs.description += "Potenz Ergebnisse: \n";
    for (let i=0;i<potenzResultsForLogs.length;i++) {
      this.logs.description += i + ": " + potenzResultsForLogs[i].a + " = " + potenzResultsForLogs[i].result + "\n";
    }

    this.logs.description +="\n";
    this.logs.description += "Hex Ziffer mit Ergebnis der Potenz multiplizieren \n";
    let sumResults: any = [];
    finalResultForLogs.forEach( (x: any,index: number) => {
      this.logs.description += index + ": " + x.a + " = " + x.result + "\n";
      sumResults.push(x.result);
    });

    this.decimalValue = finalResult.toString();
    this.logs.description +="\n" + sumResults.join(" + ") + " = " + this.decimalValue;

    this.logs.description +="\n";


    this.logs.description +="\n";
    this.logs.description += "FINALES ERGEBNIS: " + this.decimalValue;

    if (this.decimalValue == "NaN") {
      alert("Ungültiger wert für hex: " + this.hexValue);
      this.decimalValue = "";
      this.hexValue = ""; 					
      return;
    }

    console.log(this.logs);

  }

  onCloseCalculation() {
    this.showCalculationWay = false;
  }

  calculateDecimalToHex() {
    this.logs = {
      title: "Rechenweg:",
      description: "\n"
    }
    let decimal = this.decimalValue;
    if (!decimal || !Number(decimal) || decimal.startsWith("0x")) {
      alert("Ungültiger wert für Dezimalzahl: " + decimal);
      this.decimalValue = "";
      this.hexValue = "";
      this.logs.description = "Ungültiger wer für Dezimalzahl: " + decimal;
      return;
    }

    // Alle Potenz Ergebnisse
    let potenzResults = [];
    let potenzResultsForLogs: {result: string,a: string}[] = [];
    for (let i = decimal.length; i >= 0; i--) {
      let p = 16 ** i;
      potenzResultsForLogs.push({result:p.toString(),a: "16 ** " + i});
      potenzResults.push(p);
    }

    this.logs.description += "Potenz Ergebnisse:\n";
    potenzResultsForLogs.forEach( (p: any) => {
        this.logs.description += p.a.toString() + " = " + p.result + "\n"; 
    });

    this.logs.description += "\n";
    this.logs.description += "Einzelne Ergebnisse berechnen: \n\n";
    // Einzelne Ergebnisse ausrechnen und in array pushen
    let remaining = Number(decimal);
    let resultsArray = [];
    let resultsArrayForLogs: string[] = []
    for (let x = 0; x < potenzResults.length; x++) {
      let result = Math.floor(remaining / potenzResults[x]);
      let result_2 = result * potenzResults[x];
      let result_3 = remaining - result_2;

      resultsArrayForLogs.push("Iteration: " + x  + "\n\n" + remaining + " / " + potenzResults[x] + " = " + result + "\n" + result + " * " + potenzResults[x] + " = "  + result_2 + "\n" + remaining + " - " + result_2 + " = " + result_3 + "\n\n");
      remaining = result_3;
      resultsArray.push(result);
    }

    this.logs.description += resultsArrayForLogs;
    this.logs.description += "\n";


    // Dezimal Zahlen in ihre hex Zahlen umwandeln
    let result = resultsArray.map(c => {
      const found = this.hexValues.find(h => h.value === c);
      if (found) {
        this.logs.description += found.value +  " in Buchstaben umwandeln: " + found.symbol + "\n";
        return found.symbol.toString();
      } else {
        return c;
      }
    });


    while (result[0] === 0) {
      result.shift();
    }

    this.hexValue = "0x" + result.join("");
    this.logs.description += "\n";
    this.logs.description += "FINALES ERGEBNIS: " + this.hexValue;


  }

  calculate() {
    this.showCalculationWay = true;
    if (this.fromOption == "hex" && this.toOption == "dezimal") {
      this.calculateHexToDecimal();
    } else if (this.fromOption == "dezimal" && this.toOption == "hex") {
      this.calculateDecimalToHex();
    } else {
      alert("Du kannst " + this.fromOption + " nicht in " + this.toOption + " umwandeln.");
    }


  }

}
