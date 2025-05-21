(() => {
      const display = document.getElementById('display');
      const buttons = document.querySelectorAll('.btn');
      let currentInput = '';
      let lastInput = '';
      const operators = ['+', '-', '*', '/'];

      function updateDisplay() {
        display.value = currentInput;
      }

      function appendValue(value) {
        if (value === '.') {
          // prevent multiple decimals in the last number segment
          const parts = currentInput.split(/[\+\-\*\/]/);
          if (parts[parts.length -1].includes('.')) return;
        }

        // prevent two operators consecutively except minus if start or after another operator
        if (operators.includes(value)) {
          if(currentInput === '' && value !== '-') {
            // do nothing if starting with operator except minus
            return;
          }
          if(operators.includes(lastInput) && value !== '-') {
            // replace the last operator with new operator (except minus insertion)
            currentInput = currentInput.slice(0, -1);
          }
        }
        currentInput += value;
        lastInput = value;
        updateDisplay();
      }

      function clearDisplay() {
        currentInput = '';
        lastInput = '';
        updateDisplay();
      }

      function calculateResult() {
        try {
          if(currentInput === '') return;
          // Remove trailing operator if any before evaluation
          let expression = currentInput;
          while (operators.includes(expression.slice(-1))) {
            expression = expression.slice(0, -1);
          }
          let result = Function('"use strict";return (' + expression + ')')();
          result = +result.toFixed(10); // limit decimals
          currentInput = result.toString();
          lastInput = '';
          updateDisplay();
        } catch (e) {
          currentInput = 'Error';
          updateDisplay();
          currentInput = '';
          lastInput = '';
        }
      }

      buttons.forEach(button => {
        button.addEventListener('click', () => {
          const value = button.getAttribute('data-value');

          if(button.id === 'clear') {
            clearDisplay();
          } else if(button.id === 'equals') {
            calculateResult();
          } else {
            appendValue(value);
          }
        });
      });

      // Keyboard support
      window.addEventListener('keydown', (e) => {
        if((e.key >= '0' && e.key <= '9') || e.key === '.') {
          appendValue(e.key);
        } else if(operators.includes(e.key)) {
          appendValue(e.key);
          e.preventDefault();
        } else if(e.key === 'Enter' || e.key === '=') {
          calculateResult();
          e.preventDefault();
        } else if(e.key === 'Backspace') {
          currentInput = currentInput.slice(0, -1);
          updateDisplay();
          e.preventDefault();
        } else if(e.key.toLowerCase() === 'c') {
          clearDisplay();
          e.preventDefault();
        }
      });
    })();
    