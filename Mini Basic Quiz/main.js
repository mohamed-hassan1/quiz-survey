(function() {
  'use strict';
  // The Right Answers and Attempts
  const answers = ['c', 'b', 'b', 'd'],
        attempts = 3;

  // Quiz Slides
  const quizContainer = document.querySelector('.quiz-container'),
        quizSlides = quizContainer.querySelector('.slides'),
        quizSlidesMargin = 14;

  // Popup
  const quizPopup = quizContainer.querySelector('.popup-container'),
        quizPopupAttempts = quizPopup.querySelector('.attempt-num'),
        quizPopupBtn = quizPopup.querySelector('.popup-btn');
  
  // Final Slide
  const quizFinal = quizContainer.querySelector('.slide.final'),
        quizAnsRes = quizFinal.querySelector('.ans-results'),
        quizQuesTotal = quizFinal.querySelector('.total-questions');

  let globalObj = {
    // Counters
    quizCounter: 0,
    attemptCounter: attempts,
    oldSlideSpace: 0,

    // Add Right Symbol
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

    // Add Wrong Symbol
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
    },

    // Check Final Slide and Results
    quizFinalResults: () => {
      if (quizSlides.children[globalObj.quizCounter].classList.contains('final')) {
        quizAnsRes.textContent = Math.abs((attempts - globalObj.attemptCounter) - (quizSlides.children.length - 1));
        quizQuesTotal.textContent = quizSlides.children.length - 1;
      }
    },

    // Quiz Slide Move Animation
    quizMoveAnim: () => {
      if (document.head.querySelector('#quizanim')) {
        quizSlides.style.transform = `translateX(-${globalObj.oldSlideSpace}px)`;
        document.head.querySelector('#quizanim').remove();
      }
      let anim = document.createElement('style'),
          slideSpace = (quizSlides.offsetWidth + quizSlidesMargin) * globalObj.quizCounter;
      globalObj.oldSlideSpace = slideSpace;
      anim.id = 'quizanim';
      anim.innerHTML = `.${quizContainer.className} .${quizSlides.className} {transform:translateX(-${slideSpace}px)}`;
      setTimeout(() => {
        quizSlides.removeAttribute('style');
        document.head.appendChild(anim);
        // Check Final Results
        globalObj.quizFinalResults();
      },125);
    }
  }

  // Quiz Global Click
  quizContainer.addEventListener('click', function(e) {
    let answerBtn = e.target.closest('.slide-answer'),
        popupBtn = e.target.closest('.popup-btn');
    if (answerBtn) {
      // Get Answer
      let answer = answerBtn.querySelector('.answer-num').getAttribute('data-answernum');
      // Check for right answer
      if ((answers[globalObj.quizCounter].toLowerCase() === answer.trim().toLowerCase()) && (!answerBtn.classList.contains('ready') && !answerBtn.classList.contains('correct'))) { // Right
        answerBtn.classList.add('ready');
        globalObj.rightSymbol(answerBtn.children[0]);
        setTimeout(() => {
          answerBtn.classList.add('correct');
          answerBtn.classList.remove('ready');
          // Increase Quiz Counter (move to next slide)
          globalObj.quizCounter += 1;
          // Call Slide Move Animation
          globalObj.quizMoveAnim();
        }, 500);
      } else if ((answers[globalObj.quizCounter].toLowerCase() !== answer.trim().toLowerCase()) && (!answerBtn.classList.contains('ready') && !answerBtn.classList.contains('wrong'))) { // Wrong
        answerBtn.classList.add('ready');
        globalObj.wrongSymbol(answerBtn.children[0]);
        setTimeout(() => {
          answerBtn.classList.add('wrong');
          answerBtn.classList.remove('ready');
          setTimeout(() => {
            quizPopup.classList.add('ready');
            setTimeout(() => {
              quizPopup.classList.add('active');
              globalObj.attemptCounter -= 1;
              quizPopupAttempts.textContent = globalObj.attemptCounter;
              if (globalObj.attemptCounter <= 0) {
                quizPopupBtn.setAttribute('disabled', true);
              }
            }, 200);
          }, 125);
        }, 500);
      }
    } else if (popupBtn) { // Close Popup
      quizPopup.classList.remove('active');
      // Increase Quiz Counter (move to next slide)
      globalObj.quizCounter += 1;
      setTimeout(() => {
        quizPopup.classList.remove('ready');
        // Call Slide Move Animation
        globalObj.quizMoveAnim();
      },190);
    }
  })


}());