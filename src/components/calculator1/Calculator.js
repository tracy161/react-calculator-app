import React, { useRef, useEffect, useState } from 'react';
import './calculator.css';
import { btns, BTN_ACTIONS } from './Buttons';

const Calculator = () => {
  const btnsRef = useRef(null);
  const expRef = useRef(null);

  const [expression, setExpression] = useState('');

  useEffect(() => {
    const btns = Array.from(btnsRef.current.querySelectorAll('button'));
    //console.log(btns)
    btns.forEach(e => (e.style.height = e.offsetWidth + 'px'));
    initialSpan();
  }, []);

  const btnClick = item => {
    //console.log(item);

    const expDiv = expRef.current;
    //console.log(expDiv);

    if (item.action === BTN_ACTIONS.THEME) {
      document.body.classList.toggle('dark');
    }

    if (item.action === BTN_ACTIONS.ADD) {
      //expDiv.innerHTML = '';
      if (expression.length <= 0) expDiv.innerHTML = '';
      //console.log(expression.length);
      addAnimSpan(item.display);

      const operation = item.display;
      setExpression(expression + operation);
      //console.log(expression + operation);
    }

    if (item.action === BTN_ACTIONS.DELETE) {
      expDiv.parentNode.querySelector('div:last-child').innerHTML = '';
      expDiv.innerHTML = '';

      setExpression('');
      addAnimSpan(0);
    }

    if (item.action === BTN_ACTIONS.CALC) {
      if (expression.trim().length > 0) {
        expDiv.parentNode.querySelector('div:last-child').remove();

        const cloneNode = expDiv.cloneNode(true);
        expDiv.parentNode.appendChild(cloneNode);

        const transform = `translateY(${
          -(expDiv.offsetHeight + 10) + 'px'
        }) scale(0.4)`;

        try {
          let res = eval(expression);
          //console.log(expression);
          setExpression(res.toString());
          setTimeout(() => {
            cloneNode.style.transform = transform;
            expDiv.innerHTML = '';
            addAnimSpan(Math.floor(res * 10000000) / 10000000);
          }, 20);
        } catch (err) {
          setTimeout(() => {
            cloneNode.style.transform = transform;
            cloneNode.innerHTML = 'Syntax Err';
            console.log(err);
          }, 20);
        } finally {
          console.log('calc completed');
        }
      }
    }
  };

  // initial Span
  const initialSpan = () => {
    const expDiv = expRef.current;

    const span = document.createElement('span');

    span.innerHTML = 0;

    span.style.opacity = '1';

    expDiv.appendChild(span);
  };

  // create Span tag under cal result when starting cal
  const addAnimSpan = content => {
    const expDiv = expRef.current;

    const span = document.createElement('span');

    span.innerHTML = content;
    span.style.opacity = '0';

    expDiv.appendChild(span);

    const width = span.offsetWidth + 'px';
    span.style.width = '0';

    setTimeout(() => {
      span.style.opacity = '1';
      span.style.width = width;
    }, 10);
  };

  return (
    <div className='calculator'>
      <div className='calculator__result'>
        <div ref={expRef} className='calculator__result__exp'></div>
        <div className='calculator__result__exp'></div>
      </div>
      <div ref={btnsRef} className='calculator__btns'>
        {btns.map((item, index) => (
          <button
            key={index}
            className={item.class}
            onClick={() => btnClick(item)}
          >
            {item.display}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Calculator;
