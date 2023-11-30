const app = Vue.createApp({

     data() {
          return {
               current: '',
               operator: '',
               
          }
     },

     methods: {
          clear() {
               this.current = '0';
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
          percent () {
               this.current = `${parseFloat(this.current) / 100}`;
          },
          divide() {
               this.operator = '/';
               this.current += this.operator;
          },
          multiply() {
               this.operator = '*';
               this.current += this.operator;
          },
          substract() {
               this.operator = '-';
               this.current += this.operator;
          },
          add() {
               this.operator = '+';
               this.current += this.operator;
          },
          dot() {
               this.current += '.';
          },
          equal() {
               this.current = eval(this.current);
          },
          zero() {
               this.current += '0';


          },
          number(value) {
               if (this.current === '0') {
                    this.current = '';
               }
               this.current += value;
          },
     },
});

app.mount('#app');