(function() {
  'use strict';
  // The Right Answers for the 3 Questions Attempts
  const answers = ['a', 'c', 'd'];

  const quizContainer = document.querySelector('.quiz-container'),
        quizPopup = quizContainer.querySelector('.popup-container');

  let globalObj = {
    attempt: 0,
    rightSymbol: (container) => {
      if (!container.classList.contains('symbol-added')) {
        let rightEle = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="14" height="18" x="0" y="0" viewBox="0 0 511.985 511.985" xml:space="preserve" class=""><path d="M500.088 83.681c-15.841-15.862-41.564-15.852-57.426 0L184.205 342.148 69.332 227.276c-15.862-15.862-41.574-15.862-57.436 0-15.862 15.862-15.862 41.574 0 57.436l143.585 143.585c7.926 7.926 18.319 11.899 28.713 11.899 10.394 0 20.797-3.963 28.723-11.899l287.171-287.181c15.862-15.851 15.862-41.574 0-57.435z" fill="currentColor"/></svg>`,
        classEle = 'symbol correct-symbol',
        div = document.createElement('div');
        div.className = classEle;
        div.innerHTML = rightEle;
        container.appendChild(div);
        container.classList.add('symbol-added');
      }
    },
    wrongSymbol: (container) => {
      if (!container.classList.contains('symbol-added')) {
        let wrongEle = `<div></div>`,
        classEle = 'symbol wrong-symbol',
        div = document.createElement('div');
        div.className = classEle;
        div.innerHTML = wrongEle;
        container.appendChild(div);
        container.classList.add('symbol-added');
      }
    }
  }

  // Quiz Global Click
  quizContainer.addEventListener('click', function(e) {
    let answerBtn = e.target.closest('.slide-answer');
    if (answerBtn) {
      // Get Answer
      let answer = answerBtn.querySelector('.answer-num').getAttribute('data-answernum');
      // Check for right answer
      if (answers[globalObj.attempt].toLowerCase() === answer.trim().toLowerCase()) { // Right
        answerBtn.classList.add('ready');
        globalObj.rightSymbol(answerBtn.children[0]);
        setTimeout(() => {
          answerBtn.classList.add('correct');
          answerBtn.classList.remove('ready');
        }, 500);
      } else { // Wrong
        answerBtn.classList.add('ready');
        globalObj.wrongSymbol(answerBtn.children[0]);
        setTimeout(() => {
          answerBtn.classList.add('wrong');
          answerBtn.classList.remove('ready');
          setTimeout(() => {
            quizPopup.classList.add('ready');
            setTimeout(() => {
              quizPopup.classList.add('active');
            }, 200);
          }, 125);
        }, 500);
      }
    }
  })


}());