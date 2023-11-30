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
               this.current = this.current.charAt(0) === '-' ? this.current.slice(1) : `-${this.current}`;
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
          subtract() {
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