const app = Vue.createApp({

     data() {
          return {
               current: '',
               operator: null,
               operatorClicked: false,
          }
     },

     methods: {
          clear() {
               this.current = '';
          },
          sign() {
              // Toggle sign of the current numeric value (if it's a plain number)
              if (this.current === '') return;

              // If the expression is a single number, toggle its sign
              if (/^[+-]?\d+(?:\.\d+)?$/.test(this.current)) {
                if (this.current.charAt(0) === '-') {
                  this.current = this.current.slice(1);
                } else {
                  this.current = '-' + this.current;
                }
                return;
              }

              // For complex expressions, do nothing to avoid unexpected behavior
          },
          setPrevious() {
               this.previous = this.current;
               this.operatorClicked = true;
          },
          percent () {
               // If the current is a plain number, convert to percentage
               if (/^[+-]?\d+(?:\.\d+)?$/.test(this.current)) {
                 this.current = String(parseFloat(this.current) / 100);
               } else {
                 // For expressions, do not use eval; keep it safe by ignoring
               }
          },
          _appendOperator(op) {
               // Prevent two operators in a row
               if (this.current === '') {
                 // allow negative at start
                 if (op === '-') {
                   this.current = '-';
                 }
                 return;
               }
               if (/[+\-\/*]$/.test(this.current)) {
                 // replace last operator
                 this.current = this.current.slice(0, -1) + op;
               } else {
                 this.current += op;
               }
          },
          divide() {
               this.operator = '/';
               this._appendOperator('/');
          },
          multiply() {
               this.operator = '*';
               this._appendOperator('*');
          },
          substract() {
               this.operator = '-';
               this._appendOperator('-');
          },
          add() {
               this.operator = '+';
               this._appendOperator('+');
          },
          dot() {
               // Prevent multiple dots in the current number token
               // Find the last number token
               const match = this.current.match(/(\d+\.\d*|\d+)$/);
               if (match) {
                 if (match[0].includes('.')) return; // already has dot
                 this.current += '.';
               } else {
                 // start a new number with 0.
                 if (this.current === '' || /[+\-\/*]$/.test(this.current)) {
                   this.current += '0.';
                 }
               }
              
          },
         
          equal() {
               try {
                    const expr = this.current;
                    if (!expr) return;

                    // Remove trailing operator if any
                    const safeExpr = expr.replace(/[+\-\/*]$/, '');

                    // Validate characters: only digits, operators, decimal point and spaces allowed
                    if (!/^[0-9+\-\/*\.()\s]+$/.test(safeExpr)) {
                      throw new Error('Invalid characters in expression');
                    }

                    const result = evaluateExpression(safeExpr);
                    this.current = String(result);
               } catch (e) {
                    // On error, clear or show 0 to avoid leaking or executing code
                    this.current = '0';
                    console.error('Evaluation error:', e);
               }
          },
          zero() {
               // Append zero normally, but avoid leading zeros like 00
               if (this.current === '0') return;
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

// Safe arithmetic evaluator (shunting-yard to RPN, then evaluate).
function evaluateExpression(input) {
  // Tokenize: numbers (including decimals) and operators/parentheses
  const tokens = [];
  const re = /\s*(\d+\.?\d*|\.?\d+|[+\-\/*()])\s*/g;
  let m;
  while ((m = re.exec(input)) !== null) {
    tokens.push(m[1]);
  }

  if (tokens.length === 0) return 0;

  const outputQueue = [];
  const opStack = [];

  const precedence = { '+': 1, '-': 1, '*': 2, '/': 2 };
  const isOperator = (t) => ['+', '-', '*', '/'].includes(t);

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (/^\d|^\.\d/.test(token)) {
      outputQueue.push(parseFloat(token));
    } else if (isOperator(token)) {
      while (opStack.length > 0 && isOperator(opStack[opStack.length - 1]) &&
             precedence[opStack[opStack.length - 1]] >= precedence[token]) {
        outputQueue.push(opStack.pop());
      }
      opStack.push(token);
    } else if (token === '(') {
      opStack.push(token);
    } else if (token === ')') {
      while (opStack.length > 0 && opStack[opStack.length - 1] !== '(') {
        outputQueue.push(opStack.pop());
      }
      if (opStack.length === 0) throw new Error('Mismatched parentheses');
      opStack.pop(); // remove '('\n    } else {
      throw new Error('Unknown token ' + token);
    }
  }

  while (opStack.length > 0) {
    const op = opStack.pop();
    if (op === '(' || op === ')') throw new Error('Mismatched parentheses');
    outputQueue.push(op);
  }

  // Evaluate RPN
  const evalStack = [];
  for (const t of outputQueue) {
    if (typeof t === 'number') {
      evalStack.push(t);
    } else if (isOperator(t)) {
      const b = evalStack.pop();
      const a = evalStack.pop();
      if (a === undefined || b === undefined) throw new Error('Invalid expression');
      let res;
      switch (t) {
        case '+': res = a + b; break;
        case '-': res = a - b; break;
        case '*': res = a * b; break;
        case '/':
          if (b === 0) throw new Error('Division by zero');
          res = a / b; break;
        default: throw new Error('Unsupported operator ' + t);
      }
      evalStack.push(res);
    } else {
      throw new Error('Invalid RPN token ' + t);
    }
  }

  if (evalStack.length !== 1) throw new Error('Invalid expression');
  return evalStack[0];
}

app.mount('#app');
