const app = Vue.createApp({

     data() {
          return {
               // previous: null,
               current: '',
               operator: null,
               operatorClicked: false,
          }
     },
   // Not sure why co-pilot used setPrevious() method, but it's not needed. I commented it out.Going to dig it more
     methods: {
          clear() {
               this.current = '';
          },
          sign() {
              if(this.current > 0){
               this.current = `-${this.current}`;
                 } else if(this.current < 0){
               this.current = `${Math.abs(this.current)}`;
                 } else {
               this.current = '0';
                 }


          },
          setPrevious() {
               this.previous = this.current;
               this.operatorClicked = true;
          },
          percent () {
               this.current = `${parseFloat(this.current) / 100}`;
               // this.setPrevious();
          },
          divide() {
               this.operator = '/';
               this.current += this.operator;
               // this.setPrevious();
          },
          multiply() {
               this.operator = '*';
               this.current += this.operator;
               // this.setPrevious();
          },
          substract() {
               this.operator = '-';
               this.current += this.operator;
               // this.setPrevious();
          },
          add() {
               this.operator = '+';
               this.current += this.operator;
               // this.setPrevious();
          },
          dot() {
               this.current += '.';
              
          },
         
          equal() {
               this.current = eval(this.current);
               // this.previous = null;
              
         
          },
          zero() {
               this.current += '0';


          },
          number(value) {
               if (this.current === '0') {
                    this.current = '';
                    this.operatorClicked = false;
               }
               this.current += value;
          },
     },
});

app.mount('#app');