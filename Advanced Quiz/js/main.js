(function() {
  "usestrict";

  let quizWrapper = document.querySelector('.quiz-wrapper'),
      frontSection = quizWrapper.querySelector('.front-section'),
      questionSection = quizWrapper.querySelector('.questions-section');

  let globalFun = {
    questionsList: {},
    fadeOut: function(ele) { // Fade Out Animation
      ele.classList.add('fade-out');
      setTimeout(function() {
        ele.classList.add('hide');
        ele.classList.remove('fade-out');
      }, 250);
    },
    heightAnimation: function(max, min, dir, ele, count, speed, callback) { // Slide movement animation
      let animation = setInterval(frame, speed),
          num = min;
      if (dir === 'up') {
        num = max;
      }
      function frame() {
        if (dir === 'up') { // Slide up movement animation
          if (num <= min) {
            ele.style.height = min + 'px';
            clearInterval(animation);
            if (callback !== null) {
              callback();
            }
          } else {
            num -= count;
            ele.style.height = num + 'px';
          }
        } else { // Slide down movement animation
          if (num >= max) {
            ele.style.height = max + 'px';
            clearInterval(animation);
            if (callback !== null) {
              callback();
            }
          } else {
            ele.style.height = num + 'px';
            num += count;
          }
        }
      }
    },
    clearFilter: function(dropdown) {
      let input = dropdown.querySelector('input'),
          lbl = dropdown.querySelector('label'),
          items = dropdown.querySelectorAll('.item');
      input.value = "";
      lbl.style.display = "block";
      for (let i = 0; i < items.length; i++) {
        if (!items[i].classList.contains('hide-item')) {
          items[i].style.display = "block";
        } else {
          items[i].style.display = "none";
        }
      }
    },
    animationSpeed: function(counter, speed) {
      if (counter !== null) {
        if (window.innerHeight > 1001) {
          return counter[0];
        } else if (window.innerHeight <= 1000 && window.innerHeight > 801) {
          return counter[1];
        } else if (window.innerHeight <= 800 && window.innerHeight > 600) {
          return counter[2];
        } else {
          return counter[3];
        } 
      }
      if (speed !== null) {
        if (window.innerHeight > 1001) {
          return speed[0];
        } else if (window.innerHeight <= 1000 && window.innerHeight > 801) {
          return speed[1];
        } else if (window.innerHeight <= 800 && window.innerHeight > 600) {
          return speed[2];
        } else {
          return speed[3];
        } 
      }
    }
  };

  // Call initial function
  initial();


  // Initial
  function initial() {
    // Call all functions
    frontSection.classList.add('active');
    fullHeight();
    questionsList();
    startBtn();
  }

  // ON Reisze
  window.addEventListener('resize', function() {
    fullHeight();
    questionAnimation(questionSection.querySelector('.question.active'), 'resize');
  });

  // Questions List
  function questionsList() {
    let questions = questionSection.querySelectorAll('.question'),
        questionList = {
          questions: [],
          static: {
            currentIndex: 0,
            groupTargets: {}
          }
        };

    questions.forEach(item => {
      if (item.hasAttribute('question-group')) {
        questionList.questions.push({
          type: 'group',
          ele: item,
          group: item.getAttribute('question-group'),
          target: item.getAttribute('question-target')
        });
        // Add group target questions
        questionList.static.groupTargets[item.getAttribute("question-group")] = item.getAttribute('question-target');
      } else if (item.hasAttribute('question-parent')) {
        questionList.questions.push({
          type: 'parent',
          ele: item,
          parent: item.getAttribute('question-parent'),
          target: item.getAttribute('question-target')
        });
      } else {
        questionList.questions.push({
          type: 'general',
          ele: item,
        });
      }
    });
    // Asign
    globalFun.questionsList = questionList;
  }

  // Window click event
  window.addEventListener('click', function(e) {
    // Hide dropdown menu on click
    if ((!e.target.closest('.drop-menu') && !e.target.closest('.dropdown')) && quizWrapper.querySelector('.drop-menu.active')) {
      let menuContainer = quizWrapper.querySelector('.drop-menu.active'),
          menu          = menuContainer.querySelector('.dropdown'),
          count = globalFun.animationSpeed([5,5,5,5], null),
          speed = globalFun.animationSpeed(null, [5,5,5,5]),
          currQuestion = questionSection.querySelector('.question.active').getBoundingClientRect().bottom,
          menuHeight = (window.innerHeight - currQuestion) - 25;

      globalFun.heightAnimation(menuHeight, 0, 'up', menu, count, speed, function() {
        menuContainer.classList.remove('active');
        globalFun.clearFilter(menu);
        if (quizWrapper.querySelector('.accept-btn-container.active')) {
          quizWrapper.querySelector('.accept-btn-container.active').style.zIndex = '0';
        }
      });
      menuContainer.classList.remove('arrow-active');
    }
  });

  // Set element height to full window height
  function fullHeight() {
    let elements = quizWrapper.querySelectorAll('section.active .set-h'),
        innerInput = questionSection.querySelector('drop-menu'),
        winHeight = window.innerHeight;
    if (winHeight <= 690 && winHeight > 550) {
      winHeight += 70;
    } else if (winHeight <= 550) {
      winHeight += 150;
    }
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].classList.contains('full-h')) {
        elements[i].style.minHeight = winHeight + 'px';
      } else {
        elements[i].style.minHeight = (winHeight - 87) + 'px';
      }
    }
    // add space below questions
    if (innerInput && window.innerHeight > 660) {
      innerInput.style.marginBottom = globalFun.animationSpeed([80,100,130,180], null) + "px";
    } else if (innerInput && window.innerHeight < 660) {
      innerInput.style.marginBottom = globalFun.animationSpeed([80,100,180,180], null) + "px";
    }
  }

  //Input functions on type
  questionSection.addEventListener('input', function (e) {
    if (this.classList.contains('active')) {
      if (e.target.classList.contains('txtholder')) {
        // remove valid class
        if (e.target.closest('.question').classList.contains('valid')) {
          e.target.closest('.question').classList.remove('valid');
        }
        // Hide place holder on type
        if (e.target.parentElement.classList.contains('placeholder')) {
          if (e.target.value !== "") {
            e.target.parentElement.querySelector('label').style.display = 'none';
          } else {
            e.target.parentElement.querySelector('label').style.display = 'inline-block';
          }
        }
        // input numbers maxlength
        if (e.target.getAttribute('type') === "number" && e.target.hasAttribute('maxlength')) {
          if (e.target.value.length > Number(e.target.getAttribute('maxlength'))) {
            e.target.value = e.target.value.slice(0, Number(e.target.getAttribute('maxlength')));
          }
        }
        // Dropdown search filter
        if (e.target.parentElement.classList.contains('filter')) {
          let items = e.target.parentElement.nextElementSibling.children,
              reg = new RegExp('^' + e.target.value, 'i'),
              num = 0;
          for (let a = 0; a < items.length; a++) {
            if (e.target.value !== "") {
              if (items[a].textContent.match(reg) !== null) {
                num = 0;
                items[a].style.display = 'block';
                items[items.length - 1].style.display = 'none';
              } else {
                items[a].style.display = 'none';
                num++;
                if (num === (items.length)) {
                  items[items.length - 1].style.display = 'block';
                }
              }
            } else {
              items[a].style.display = 'block';
              items[items.length - 1].style.display = 'none';
            }
          }
        }
        // check inputs
        if (e.target.classList.contains('answer-input') && e.target.closest('.question:not(.optional)')) {
          let inputs = e.target.closest('.input-container').querySelectorAll('.answer-input'),
              num = 0;
          if (e.target.value !== "") {
            for (let a = 0; a < inputs.length; a++) {
              if (inputs[a].value !== "") {
                if (inputs[a].hasAttribute('data-length')) {
                  if (Number(inputs[a].getAttribute('data-length')) <= inputs[a].value.length) {
                    num++;
                    if (num === inputs.length) {
                      quesValidation(true);
                    }
                  } else {
                    quesValidation(false);
                  }
                } else {
                  if (inputs[a].getAttribute('type') === "range") {
                    let txt = e.target.nextElementSibling;
                    txt.textContent = e.target.value;
                  }
                  num++;
                  if (num === inputs.length) {
                    quesValidation(true);
                  }
                }
              } else {
                quesValidation(false);
              }
            }
          } else {
            quesValidation(false);
          }
        }
      }
    }
  });

  // Enter press
  window.addEventListener('keypress', function(e) {
    if (e.code === "Enter" || e.code == 13) {
      if (!questionSection.querySelector('.accept-btn-container .accept-btn.inactive') && questionSection.querySelector('.progress-container.active .arrow-control.next.active')) {
        questionSection.querySelector('.accept-btn-container .accept-btn').classList.add('inactive');
        quesValidation(false);
        setTimeout(function() {
          startQuestions();
        },250);
      }
    }
  });

  // progress arrow click
  let progressArrows = quizWrapper.querySelector('.progress-container .control');
  progressArrows.addEventListener('click', function(e) {
    if (e.target.closest('.arrow-control')) {
      let arrow = e.target.closest('.arrow-control');
      if (arrow.classList.contains('active')) {
        if (arrow.classList.contains('next')) { // next arrow

          if (quizWrapper.querySelector('.accept-btn-container.active')) {
            acceptBtnFun(e);
          } else {
            if (quizWrapper.querySelector('.question.active .question-content.choose') && quizWrapper.querySelector('.question.active .question-content.choose .choose-lbl.active')) {
              acceptBtnFun(e);
            }
          }
        } else if ((arrow.classList.contains('back') && !arrow.classList.contains('inactive')) && e.pointerType !== "") { // back arrow
          arrow.classList.add('inactive');
          let activeQues = globalFun.questionsList.questions[globalFun.questionsList.static.currentIndex].ele,
              prevQues = activeQues.previousElementSibling;
          globalFun.questionsList.static.currentIndex -= 1

          if (quizWrapper.querySelector('.accept-btn-container.active')) {
            quesValidation(false);
            setTimeout(function() {
              questionAnimation(activeQues, 'back');
            },250);
          } else {
            if (prevQues && (prevQues.querySelector('.question-content.choose') && prevQues.querySelector('.input-container.done'))) {
              let nextBtn = arrow.parentElement.querySelector('.arrow-control.next');
              nextBtn.classList.remove('inactive');
              nextBtn.classList.add('active');
            }
            questionAnimation(activeQues, 'back');
          }
          if (!activeQues.previousElementSibling.previousElementSibling) {
            arrow.classList.add('inactive');
            arrow.classList.remove('active');
          }

          if (prevQues.querySelector('.question-content.choose') && prevQues.querySelector('.input-container.done')) {
            arrow.parentElement.querySelector('.arrow-control.next').classList.add('active');
            arrow.parentElement.querySelector('.arrow-control.next').classList.remove('inactive');
          }
        }
      }
    }
  });

  // Dropdown menu
  let dropInputs = quizWrapper.querySelectorAll('.drop-menu');
  for (let i = 0; i < dropInputs.length; i++) {
    dropInputs[i].addEventListener('click', function(e) {
      if (!e.target.closest('.dropdown')) {
        let menu = this.querySelector('.dropdown'),
            count = globalFun.animationSpeed([5,5,5,5], null),
            speed = globalFun.animationSpeed(null, [5,5,5,5]),
            currQuestion = questionSection.querySelector('.question.active').getBoundingClientRect().bottom,
            menuHeight = (window.innerHeight - currQuestion) - 25;

        if (!this.classList.contains('active')) {
          this.classList.add('active');
          this.classList.add('arrow-active');
          if (quizWrapper.querySelector('.accept-btn-container.active')) {
            quizWrapper.querySelector('.accept-btn-container.active').style.zIndex = '-1';
          }
          globalFun.heightAnimation(menuHeight, 0, 'down', menu, count, speed, null);
        } else {
          let self = this;
          globalFun.heightAnimation(menuHeight, 0, 'up', menu, count, speed, function() {
            self.classList.remove('active');
            globalFun.clearFilter(menu);
            if (quizWrapper.querySelector('.accept-btn-container.active')) {
              quizWrapper.querySelector('.accept-btn-container.active').style.zIndex = '0';
            }
          });
          this.classList.remove('arrow-active');
        }
      }
    });
  }

  // Select item from dropdown
  let dropdownItems = quizWrapper.querySelectorAll('.drop-menu .item');
  for (let i = 0; i < dropdownItems.length; i++) {
    dropdownItems[i].addEventListener('click', function() {
      if (!this.classList.contains('hide-item')) {
        let menuContainer = this.closest('.drop-menu'),
            menu = menuContainer.querySelector('.dropdown'),
            input = menuContainer.querySelector('.input-inner input'),
            lbl = menuContainer.querySelector('.input-inner label'),
            count = globalFun.animationSpeed([5,5,5,5], null),
            speed = globalFun.animationSpeed(null, [5,5,5,5]),
            currQuestion = questionSection.querySelector('.question.active').getBoundingClientRect().bottom,
            menuHeight = (window.innerHeight - currQuestion) - 25;

        input.value = this.textContent;
        lbl.style.display = 'none';
        globalFun.heightAnimation(menuHeight, 0, 'up', menu, count, speed, function() {
          menuContainer.classList.remove('active');
          globalFun.clearFilter(menu);
          quesValidation(true);
          if (quizWrapper.querySelector('.accept-btn-container.active')) {
            quizWrapper.querySelector('.accept-btn-container.active').style.zIndex = '0';
          }
        });
        menuContainer.classList.remove('arrow-active');
      }
    });
  }

  // Select item from multi choices
  let multiChoices = quizWrapper.querySelectorAll('.question-content.choose .input-container');
  if (multiChoices[0]) {
    for(let i = 0; i < multiChoices.length; i++) {
      multiChoices[i].addEventListener('click', function(e) {
        if (e.target.closest('.choose-lbl')) {
          let lbl = e.target.closest('.choose-lbl'),
              inputContainer = e.target.closest('.input-container');
          if (this.classList.contains('done')) {
            inputContainer.querySelector('.choose-lbl.active').classList.remove('active');
          }
          lbl.classList.add('active');
          lbl.querySelector('input').checked = true;
          this.classList.add('done');
          setTimeout(function() {
            startQuestions();
          }, 500);
        }
      });
    }
  }

  // validation function
  function quesValidation(status) {
    let acceptBtn = quizWrapper.querySelector('.accept-btn-container'),
        currQues = questionSection.querySelector('.question.active'),
        currQuestionWidth = currQues.querySelector('.question-order').offsetWidth,
        nxtBtnArrow = quizWrapper.querySelector('.progress-container .arrow-control.next');
    if (status) { // true valid
      acceptBtn.style.left = currQuestionWidth + 'px';
      acceptBtn.classList.add('active');
      if (acceptBtn.querySelector('button.inactive')) {
        acceptBtn.querySelector('button.inactive').classList.remove('inactive');
      }
      nxtBtnArrow.classList.remove('inactive');
      nxtBtnArrow.classList.add('active');
    } else { // false unvalid
      acceptBtn.classList.add('fade');
      setTimeout(function() {
        acceptBtn.classList.remove('active');
        acceptBtn.classList.remove('fade');
        if (!((currQues.previousElementSibling && currQues.previousElementSibling.querySelector('.question-content.choose')) && currQues.previousElementSibling.querySelector('.input-container.done'))) {
          nxtBtnArrow.classList.remove('active');
          nxtBtnArrow.classList.add('inactive');
        }
      }, 250);
    }
  }

  // Question animation
  function questionAnimation(ques, status) {
    let frontSectionHeight = frontSection.offsetHeight,
        quesTop = ques.getBoundingClientRect().top,
        quesHeight = ques.offsetHeight,
        quesNum = (quesHeight + quesTop) - frontSectionHeight,
        inputContainer = quizWrapper.querySelector('.question.ready .input-container'),
        accTopBtn = (quesHeight * 0.5) + 10,
        nxtArrowBtn = questionSection.querySelector('.arrow-control.next'),
        backArrowBtn = questionSection.querySelector('.arrow-control.back');

      if (inputContainer && inputContainer.classList.contains('drop-menu')) {
        accTopBtn = accTopBtn - Number(inputContainer.style.marginBottom.replace("px", ""));
      }
    if (document.head.querySelector('#currStyle')) {
      document.head.querySelector('#currStyle').remove();
    }
    if (document.head.querySelector('#currStyle2')) {
      document.head.querySelector('#currStyle2').remove();
    }
    if (document.head.querySelector('#currStyle3')) {
      document.head.querySelector('#currStyle3').remove();
    }
    let curStyle = document.createElement('style');
    curStyle.id = 'currStyle';
    if (status === 'next' || status === 'resize') {
      if (status === 'next') {
        
        progressBarFun(true);
      }
      curStyle.innerHTML = '.questions-section .accept-btn-container.fade {opacity: 0;top: calc(50% + ' + (accTopBtn + 30) + 'px); animation: acceptBtnFade .25s ease-in-out;} .questions-section .accept-btn-container.active {top:calc(50% + ' + accTopBtn + 'px)}.questions-section .question.active {animation: questionAnimation .4s ease-in-out;} @keyframes questionAnimation {0% {top:' + quesNum + 'px; opacity: 0} 100% {top: 50%; opacity: 1;}} @keyframes acceptBtn {0% {top: calc(50% + ' + (accTopBtn + 30) + 'px); opacity: 0;} 100% {top: calc(50% + ' + accTopBtn + 'px); opacity: 1;}} @keyframes acceptBtnFade {0% {top: calc(50% + ' + accTopBtn + 'px); opacity: 1;} 100% {top: calc(50% + ' + (accTopBtn + 30) + 'px); opacity: 0;}}';
      document.head.appendChild(curStyle);
      ques.classList.remove('ready');
      ques.classList.add('active');
      if (status === 'next' && ques.classList.contains('optional')) {
        setTimeout(function() {
          quesValidation(true);
        }, 400);
      } else if (status === 'next' && (!ques.classList.contains('optional') && ques.classList.contains('final'))) {
        setTimeout(function() {
          let progress = quizWrapper.querySelector('.progress-container');
          progress.classList.add('done');
          setTimeout(function() {
            progress.classList.remove('active');
            progress.classList.remove('done');
          },250);
        }, 800);
      }
    } else if (status === 'next2') {
      let curStyle2 = document.createElement('style');
      curStyle2.id = 'currStyle2';
      curStyle2.innerHTML = '.questions-section .question.done {animation: questionAnimation2 .75s ease-in-out;} @keyframes questionAnimation2 {0% {top: 50%; opacity: 1} 100% {top:-' + quesNum + 'px; opacity: 0;}}';
      document.head.appendChild(curStyle2);
    } else if (status === 'back') {
      progressBarFun(false);
      let prevQues = ques.previousElementSibling;
      prevQues.classList.add('active2');
      let quesNum2 = prevQues.offsetHeight * 0.5,
          contentHeight = questionSection.querySelector('.content').offsetHeight * 0.5;
      accTopBtn = quesNum2 + 20;
      inputContainer = prevQues.querySelector('.input-container.drop-menu');
      if (inputContainer) {
        accTopBtn = accTopBtn - Number(inputContainer.style.marginBottom.replace("px", ""));
      }
      ques.classList.add('ready2');
      ques.classList.remove('active');
      quesNum = (contentHeight * 2) + quesHeight;
      let curStyle3 = document.createElement('style');
      curStyle3.id = 'currStyle3';
      curStyle3.innerHTML = '.questions-section .accept-btn-container.fade {opacity: 0;top: calc(50% + ' + (accTopBtn + 30) + 'px); animation: acceptBtnFade .25s ease-in-out;} .questions-section .accept-btn-container.active {top:calc(50% + ' + accTopBtn + 'px)}  .questions-section .question.ready2 {animation: questionAnimation4 .75s ease-in-out;} .questions-section .question.active2 {animation: questionAnimation3 .5s ease-in-out;} @keyframes questionAnimation3 {0% {top:-' + quesNum2 + 'px; opacity: 0;} 100% {top: 50%; opacity: 1;}} @keyframes questionAnimation4 {0% {top: 50%; opacity: 1;} 100% {top:' + quesNum + 'px; opacity: 0;}} @keyframes acceptBtn {0% {top: calc(50% + ' + (accTopBtn + 30) + 'px); opacity: 0;} 100% {top: calc(50% + ' + accTopBtn + 'px); opacity: 1;}} @keyframes acceptBtnFade {0% {top: calc(50% + ' + accTopBtn + 'px); opacity: 1;} 100% {top: calc(50% + ' + (accTopBtn + 30) + 'px); opacity: 0;}}';
      prevQues.classList.remove('active2');
      document.head.appendChild(curStyle3);
      backArrowBtn.classList.remove('active');
      backArrowBtn.classList.add('inactive')
      setTimeout(function() {
        ques.classList.remove('ready2');
        prevQues.classList.remove('done');
        prevQues.classList.add('active2');
        setTimeout(function() {
          prevQues.classList.add('active');
          prevQues.classList.remove('active2');
          if (!prevQues.querySelector('.question-content.choose')) {
            quesValidation(true);
          }
          if (globalFun.questionsList.static.currentIndex > 0) {
            backArrowBtn.classList.remove('inactive');
            backArrowBtn.classList.add('active');
          }
        }, 500);
      }, 420);
    }
  }
  // Start button
  function startBtn() {
    let btn = frontSection.querySelector('.start-btn button');

    // Click event
    btn.addEventListener('click', startBtnClick);
  }
  // Start button function on click
  function startBtnClick() {
    let content = frontSection.querySelector('.content'),
        heading = frontSection.querySelector('.heading'),
        startBtn = frontSection.querySelector('.start-btn'),
        count = globalFun.animationSpeed([5,8,8,8], null),
        speed = globalFun.animationSpeed(null, [7,10,10,9]);
    // Hide heading & start button
    globalFun.fadeOut(heading);
    globalFun.fadeOut(startBtn);
    // Start heading, start button and front-section slide up movement animation
    globalFun.heightAnimation(startBtn.offsetHeight, 0, 'up', startBtn, count, speed, null);
    globalFun.heightAnimation(heading.offsetHeight, 0, 'up', heading, count, speed, function() {
      content.style.height = window.innerHeight + 'px';
      content.style.minHeight = 'inherit';
      count = globalFun.animationSpeed([20,15,13,10], null);
      speed = globalFun.animationSpeed(null, [5,5,5,4]);
      globalFun.heightAnimation(content.offsetHeight, 67, 'up', content, count, speed, function() {
        setTimeout(function() {
          startQuestions();
        }, 100);
      });
    });
        
  }
  // Start Questions
  function startQuestions() {
    let progressContainer = quizWrapper.querySelector('.progress-container'),
        arrows = progressContainer.querySelectorAll('.arrow-control');
    if (!questionSection.classList.contains('active')) {
      questionSection.classList.add('active');
      frontSection.classList.remove('active');
      fullHeight();
      globalFun.questionsList.questions[0].ele.classList.add('ready');
      arrows[0].classList.add('inactive');
      arrows[1].classList.add('inactive');
      questionAnimation(globalFun.questionsList.questions[0].ele, 'next');
      setTimeout(function() {
        progressContainer.classList.add('active');
      }, 400);
    } else {
      let currQuestion = globalFun.questionsList.questions[globalFun.questionsList.static.currentIndex].ele,
          nxtQues = globalFun.questionsList.questions[globalFun.questionsList.static.currentIndex + 1].ele;

      if (currQuestion.hasAttribute('question-group')) {
        checkParentQuestions('next');
        nxtQues = globalFun.questionsList.questions[globalFun.questionsList.static.currentIndex].ele;
      } else if (nxtQues) {
        globalFun.questionsList.static.currentIndex += 1;
      }

      if (nxtQues) {
        //globalFun.questionsList.static.currentIndex += 1;
        arrows[0].classList.remove('inactive');
        arrows[0].classList.add('active');
        arrows[1].classList.remove('active');
        arrows[1].classList.add('inactive');
        currQuestion.classList.add('done');

        if (!currQuestion.querySelector('.question-content.choose')) {
          currQuestion.classList.add('valid');
        }
        questionAnimation(currQuestion, 'next2');

        setTimeout(function() {
          currQuestion.classList.remove('active');
          nxtQues.classList.add('ready');
          questionAnimation(nxtQues, 'next');
        setTimeout(() => {
          if ((nxtQues.classList.contains('done') || nxtQues.classList.contains('optional')) || (nxtQues.querySelector('.question-content.choose') && nxtQues.querySelector('.input-container.done'))) {
            arrows[1].classList.add('active');
            arrows[1].classList.remove('inactive');
          } else if (arrows[1].classList.contains('active')) {
            arrows[1].classList.remove('active');
            arrows[1].classList.add('inactive');
          }
        }, 300);
          if (nxtQues.classList.contains('valid')) {
            setTimeout(function() {
              quesValidation(true);
            }, 500);
          }
        }, 450);

      }


    }
  }

  // Check for parent questions
  function checkParentQuestions(ques) {
    console.log(ques)
  }

  // Accept Button
  let acceptBtn = quizWrapper.querySelector('.accept-btn');
  acceptBtn.addEventListener('click', acceptBtnFun);
  function acceptBtnFun(e) {
    let btn = e instanceof PointerEvent ? (e.target.closest('button') || this.target.closest('button')) : e;
    if (!btn.classList.contains('inactive') && !quizWrapper.querySelector('.question.active .question-content.choose')) { // Ok Button
      btn.classList.add('inactive');
      // Hide approve button
      quesValidation(false);
      setTimeout(function() {
        startQuestions();
      },250);
    } else if (!btn.classList.contains('inactive') && quizWrapper.querySelector('.question.active .question-content.choose')) { // Arrow Button
      startQuestions();
    }
  }

  // Progress Bar
  function progressBarFun(status) {
    let progressBar = quizWrapper.querySelector('.progress-container');
    if (progressBar.classList.contains('active')) {
      let bar = progressBar.querySelector('.bar'),
          barWidth = bar.offsetWidth,
          innerBar = bar.querySelector('.inner-bar'),
          innerBarWidth = innerBar.offsetWidth,
          allQues = quizWrapper.querySelectorAll('.question'),
          num = barWidth / (allQues.length - 1),
          percent = Math.ceil(100 / (allQues.length - 1)),
          percentageNum = progressBar.querySelector('.percentage');

      if (innerBarWidth === 0 && !innerBar.hasAttribute('data-progress')) {
        innerBar.setAttribute('data-progress', 0);
      }

      innerBar.style.width = Number(innerBar.getAttribute('data-progress')) + 'px';

      if (document.head.querySelector('#bar')) {
        document.head.querySelector('#bar').remove();
      }

      let style = document.createElement('style');
      style.id = "bar";

      if (status) { // next
        num = innerBarWidth + num;
        if ((percent + Number(percentageNum.textContent)) > 100) {
          percentageNum.textContent = 100;
        } else {
          percentageNum.textContent = Number(percentageNum.textContent) + percent;
        }
      } else { // back
        num = innerBarWidth - num;
        if ((Number(percentageNum.textContent) - percent) < 0) {
          percentageNum.textContent = 0;
        } else {
          percentageNum.textContent = Number(percentageNum.textContent) - percent;
        }
      }
      innerBar.setAttribute('data-progress', num);
      style.innerHTML = '.questions-section .bar .inner-bar {width: ' + num + 'px; animation: progressBarAnim .25s ease-in-out;} @keyframes progressBarAnim {0% {width: ' + innerBarWidth +'px;} 100% {width: ' + num + 'px;}}';
      setTimeout(function() {
        document.head.appendChild(style);
        innerBar.removeAttribute('style');
      }, 30);
    }
  }

  // Get Quiz Results
  function getFullResults() {
    let allQuestions = questionSection.querySelectorAll('.question.done'),
        results = [];

    allQuestions.forEach(ques => {
      let questionTitle = ques.querySelector('.title').textContent,
          questionImage = ques.querySelector('.question-icon img').src,
          answerContainer = ques.querySelector('.question-answer'),
          questionAnswer = null;

      if (answerContainer.querySelector('.txtholder')) {
        questionAnswer = [];
        answerContainer.querySelectorAll('.txtholder').forEach((ans) => {
          let inputSymobl = ans.closest('.input-inner').querySelector('.input-note');
          if (inputSymobl) {
            // Check for Input Symbol (minute, hours... etc)
            questionAnswer.push([ans.value, inputSymobl.textContent]);
          } else {
            questionAnswer.push(ans.value);
          }
        });
      } else if (answerContainer.querySelector('.choose-lbl') && answerContainer.querySelector('input[type=radio]')) {
        questionAnswer = answerContainer.querySelector('input[type=radio]:checked').value;
      }

      results.push({
        'question_number:': questionNum,
        'question_title': questionTitle,
        'question_image': questionImage

      })

    })
  }

}());