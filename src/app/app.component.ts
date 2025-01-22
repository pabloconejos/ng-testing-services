import { Component } from '@angular/core';
import { Calcular } from './calculator'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ng-testing-services';


  ngOnInit(): void {
    const calculator = new Calcular();
    const rta1 = calculator.multiply(1,4);
    console.log(rta1)
    const rta2 = calculator.multiply(1,4);
    console.log(rta2)
  }
}
