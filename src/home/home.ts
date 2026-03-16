import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
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

  public hexIsFirst: boolean = true;

  constructor() { }

  ngOnInit() {
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
    } else {
      this.fromOption = "hex";
      this.toOption = "dezimal";
    }
  }

  calculateHexToDecimal() {
    let hex = this.hexValue.split("");

    // Zuerst schauen ob wir Buchstaben im hex haben wenn ja umwandeln
    const result = hex.map(c => {
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
      finalResult += Number(hex[i]) * p; // hex ziffer mit ergebniss der potenz berechnen
    }
    this.decimalValue = finalResult.toString();
    if (this.decimalValue == "NaN") {
      alert("Ungültiger wert für hex: " + this.hexValue);
      return;
    }


  }

  calculateDecimalToHex() {
    let decimal = this.decimalValue;
    if (!Number(this.decimalValue)) {
      alert("Ungültiger wert für Dezimalzahl: " + decimal);
      this.decimalValue = "";
      return;
    }

    // Alle potenz ergebnisse
    let potenzResults = [];
    for (let i = 0; i < decimal.length; i++) {
      let p = 16 ** i;
      potenzResults.push(p);
    }

    potenzResults.reverse();


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
    if (result[0] == 0) {
      result[0] = "";
    }
    this.hexValue = result.join("");


  }

  calculate() {
    if (this.fromOption == "hex" && this.toOption == "dezimal") {
      this.calculateHexToDecimal();
    } else if (this.fromOption == "dezimal" && this.toOption == "hex") {
      this.calculateDecimalToHex();
    } else {
      alert("Das ergibt keinen Sinn!");
    }


  }

}
