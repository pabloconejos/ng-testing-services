import { Calcular } from "./calculator";

describe('Test for Calculator', () => {

    describe('Test for multiply', () => {
        it('#multiply should return nime', () => {
            // AAA
            // ARRANGE
            const calculator = new Calcular()
            // ACT
            const rta = calculator.multiply(3,3);
            // ASSERT
            expect(rta).toEqual(9);
        })

        it('#multiply should return four', () => {
            // AAA
            // ARRANGE
            const calculator = new Calcular()
            // ACT
            const rta = calculator.multiply(1,4);
            // ASSERT
            expect(rta).toEqual(4);
        })
    })


    describe('Test for divide', () => {
        it('#divide should return some numbers', () => {
            // AAA
            // ARRANGE
            const calculator = new Calcular()
            // ACT
            // ASSERT
            expect(calculator.divide(6,3)).toEqual(2);
            expect(calculator.divide(5,2)).toEqual(2.5);
            expect(calculator.divide(5,0)).toBeNull()
    
        })
    })

    describe('Test for matcher', () => {
        it('tests matchers', () => {
            const name = 'nicolas'
            let name2;
     
            expect(name).toBeDefined();
            expect(name2).toBeUndefined();
     
            expect(1 + 3 === 4).toBeTruthy(); // 4
            expect(1 + 1 === 3).toBeFalsy();
     
            expect(5).toBeLessThan(10);
     
            expect('123456').toMatch(/123/);
            expect(['apples', 'oranges', 'pears']).toContain('oranges')
     
         })
    })

})