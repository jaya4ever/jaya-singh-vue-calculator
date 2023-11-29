const app = Vue.createApp({

    data() {
        return {
            current: '',
            previous: [],
            operator: [],
            operatorClicked: false,

           
        }
   },

   method: {
         clear() {
              this.current = '';
              this.previous = [];
              this.operator = [];
         },
    
         append(number) {
              if(this.operatorClicked) {
                this.current = '';
                this.operatorClicked = false;
              }
              this.current = `${this.current}${number}`;
         },
    
         addOperator(operator) {
              this.operatorClicked = true;
              this.previous.push(this.current);
              this.operator.push(operator);
         },
    
         calculate() {
              let result;
              const prev = parseFloat(this.previous);
              const current = parseFloat(this.current);
              const operator = this.operator;
    
              if(isNaN(prev) || isNaN(current)) return;
    
              switch(operator) {
                case '+':
                     result = prev + current;
                     break;
                 case '-':
                      result = prev - current;
                      break;
                 case '*':
                      result = prev * current;
                      break;
                 case '/':
                      result = prev / current;
                      break;
                 default:
                      return;
              }
    
              this.current = result;
              this.operator = undefined;
              this.previous = '';
         }
   }

});

app.mount('#calculatorapp');