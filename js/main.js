(function() {
  "usestrict";
  let globalFun = {
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
    closest: function(ele, name) {
      let div = ele;
      if (!ele.classList.contains(name)) {
        if (div.parentElement) {
          div = div.parentElement;
          while (!div.classList.contains(name)) {
            if (div.tagName !== "BODY") {
              div = div.parentElement;
            } else {
              return false;
            }
          }
          return div;
        } else {
          return false;
        }
      } else {
        return div;
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
    fullHeight();
    startBtn();
  }

  // Window click event
  window.addEventListener('click', function(e) {
    // Hide dropdown menu on click
    if ((!globalFun.closest(e.target, 'drop-menu') && !globalFun.closest(e.target, 'dropdown')) && document.querySelector('.drop-menu.active')) {
      let menuContainer = document.querySelector('.drop-menu.active'),
          menu          = menuContainer.querySelector('.dropdown'),
          count = globalFun.animationSpeed([5,5,5,5], null),
          speed = globalFun.animationSpeed(null, [5,5,5,5]),
          menuHeight = 218;
      if (window.innerWidth <= 500) {
        menuHeight = 168;
      }
      globalFun.heightAnimation(menuHeight, 0, 'up', menu, count, speed, function() {
        menuContainer.classList.remove('active');
        globalFun.clearFilter(menu);
        if (document.querySelector('.accept-btn-container.active')) {
          document.querySelector('.accept-btn-container.active').style.zIndex = '0';
        }
      });
      menuContainer.classList.remove('arrow-active');
    }
  });

  // Set element height to full window height
  function fullHeight() {
    let elements = document.querySelectorAll('.set-h'),
        innerInput = document.querySelector('.questions-section .drop-menu'),
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
    if (window.innerHeight > 660) {
      innerInput.style.marginBottom = globalFun.animationSpeed([80,100,130,180], null) + "px";
    } else {
      innerInput.style.marginBottom = globalFun.animationSpeed([80,100,180,180], null) + "px";
    }
  }

  //Input functions on type
  let questionSection = document.querySelector('.questions-section');
  questionSection.addEventListener('input', function (e) {
    if (this.classList.contains('active')) {
      if (e.target.classList.contains('txtholder')) {
        // remove valid class
        if (globalFun.closest(e.target, 'question').classList.contains('valid')) {
          globalFun.closest(e.target, 'question').classList.remove('valid');
        }
        // Hide place holder on type
        if (e.target.parentElement.classList.contains('placeholder')) {
          if (e.target.value !== "") {
            e.target.parentElement.querySelector('label').style.display = 'none';
          } else {
            e.target.parentElement.querySelector('label').style.display = 'block';
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
        if (e.target.classList.contains('answer-input')) {
          let inputs = globalFun.closest(e.target, 'input-container').querySelectorAll('.answer-input'),
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
      if (document.querySelector('.questions-section.active') && document.querySelector('.accept-btn-container.active')) {
        acceptBtnFun();
      }
    }
  });

  // progress arrow click
  let progressArrows = document.querySelector('.progress-container .control');
  progressArrows.addEventListener('click', function(e) {
    if (globalFun.closest(e.target, 'arrow-control')) {
      let arrow = globalFun.closest(e.target, 'arrow-control');
      if (arrow.classList.contains('active')) {
        if (arrow.classList.contains('next')) { // next arrow
          if (document.querySelector('.accept-btn-container.active')) {
            acceptBtnFun();
          } else {
            if (document.querySelector('.question.active .question-content.choose') && document.querySelector('.question.active .question-content.choose .choose-lbl.active')) {
              acceptBtnFun();
            }
          }
        } else if (arrow.classList.contains('back')) { // back arrow
          let activeQues = document.querySelector('.question.active');
          if (document.querySelector('.accept-btn-container.active')) {
            quesValidation(false);
            setTimeout(function() {
              questionAnimation(activeQues, 'back');
            },250);
          } else {
            questionAnimation(activeQues, 'back');
          }
          if (!activeQues.previousElementSibling.previousElementSibling) {
            arrow.classList.add('inactive');
            arrow.classList.remove('active');
          }
        }
      }
    }
  });

  // Dropdown menu
  let dropInputs = document.querySelectorAll('.drop-menu');
  for (let i = 0; i < dropInputs.length; i++) {
    dropInputs[i].addEventListener('click', function(e) {
      if (!globalFun.closest(e.target, 'dropdown')) {
        let menu = this.querySelector('.dropdown'),
            count = globalFun.animationSpeed([5,5,5,5], null),
            speed = globalFun.animationSpeed(null, [5,5,5,5]),
            menuHeight = 218;
        if (window.innerWidth <= 500) {
          menuHeight = 168;
        }
        if (!this.classList.contains('active')) {
          this.classList.add('active');
          this.classList.add('arrow-active');
          if (document.querySelector('.accept-btn-container.active')) {
            document.querySelector('.accept-btn-container.active').style.zIndex = '-1';
          }
          globalFun.heightAnimation(menuHeight, 0, 'down', menu, count, speed, null);
        } else {
          let self = this;
          globalFun.heightAnimation(menuHeight, 0, 'up', menu, count, speed, function() {
            self.classList.remove('active');
            globalFun.clearFilter(menu);
            if (document.querySelector('.accept-btn-container.active')) {
              document.querySelector('.accept-btn-container.active').style.zIndex = '0';
            }
          });
          this.classList.remove('arrow-active');
        }
      }
    });
  }

  // Select item from dropdown
  let dropdownItems = document.querySelectorAll('.drop-menu .item');
  for (let i = 0; i < dropdownItems.length; i++) {
    dropdownItems[i].addEventListener('click', function() {
      if (!this.classList.contains('hide-item')) {
        let menuContainer = globalFun.closest(this, 'drop-menu'),
            menu = menuContainer.querySelector('.dropdown'),
            input = menuContainer.querySelector('.input-inner input'),
            lbl = menuContainer.querySelector('.input-inner label'),
            count = globalFun.animationSpeed([5,5,5,5], null),
            speed = globalFun.animationSpeed(null, [5,5,5,5]),
            menuHeight = 218;
        if (window.innerWidth <= 500) {
          menuHeight = 168;
        }
        input.value = this.textContent;
        lbl.style.display = 'none';
        globalFun.heightAnimation(menuHeight, 0, 'up', menu, count, speed, function() {
          menuContainer.classList.remove('active');
          globalFun.clearFilter(menu);
          quesValidation(true);
          if (document.querySelector('.accept-btn-container.active')) {
            document.querySelector('.accept-btn-container.active').style.zIndex = '0';
          }
        });
        menuContainer.classList.remove('arrow-active');
      }
    });
  }

  // Select item from multi choices
  let multiChoices = document.querySelectorAll('.question-content.choose .input-container');
  if (multiChoices[0]) {
    for(let i = 0; i < multiChoices.length; i++) {
      multiChoices[i].addEventListener('click', function(e) {
        if (globalFun.closest(e.target, 'choose-lbl')) {
          let lbl = globalFun.closest(e.target, 'choose-lbl'),
              inputContainer = globalFun.closest(e.target, 'input-container'),
              allLbl = inputContainer.querySelectorAll('.choose-lbl');
          if (!this.classList.contains('done')) {
            this.classList.add('done');
          } else {
            this.classList.remove('done');
            for (let a = 0; a < allLbl.length; a++) {
              if (allLbl[a].classList.contains('active')) {
                allLbl[a].classList.remove('active');
              }
            }
          }
          lbl.classList.add('active');
          lbl.querySelector('input').checked = true;
          setTimeout(function() {
            startQuestions();
          }, 500);
        }
      });
    }
  }

  // validation function
  function quesValidation(status) {
    let acceptBtn = document.querySelector('.accept-btn-container');
    if (status) { // true valid
      acceptBtn.classList.add('active');
    } else { // false unvalid
      acceptBtn.classList.add('fade');
      setTimeout(function() {
        acceptBtn.classList.remove('active');
        acceptBtn.classList.remove('fade');
      }, 250);
    }
  }

  // Question animation
  function questionAnimation(ques, status) {
    let frontSectionHeight = document.querySelector('.front-section').offsetHeight,
        quesTop = ques.getBoundingClientRect().top,
        quesHeight = ques.offsetHeight,
        quesNum = (quesHeight + quesTop) - frontSectionHeight,
        inputContainer = document.querySelector('.question.ready .input-container'),
        accTopBtn = (quesHeight * 0.5) + 20;
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
    if (status === 'next') {
      progressBarFun(true);
      curStyle.innerHTML = '.questions-section .accept-btn-container.fade {opacity: 0;top: calc(50% + ' + (accTopBtn + 30) + 'px); animation: acceptBtnFade .25s ease-in-out;} .questions-section .accept-btn-container.active {top:calc(50% + ' + accTopBtn + 'px)}.questions-section .question.active {animation: questionAnimation .4s ease-in-out;} @keyframes questionAnimation {0% {top:' + quesNum + 'px; opacity: 0} 100% {top: 50%; opacity: 1;}} @keyframes acceptBtn {0% {top: calc(50% + ' + (accTopBtn + 30) + 'px); opacity: 0;} 100% {top: calc(50% + ' + accTopBtn + 'px); opacity: 1;}} @keyframes acceptBtnFade {0% {top: calc(50% + ' + accTopBtn + 'px); opacity: 1;} 100% {top: calc(50% + ' + (accTopBtn + 30) + 'px); opacity: 0;}}';
      document.head.appendChild(curStyle);
      ques.classList.remove('ready');
      ques.classList.add('active');
      if (ques.classList.contains('optional')) {
        setTimeout(function() {
          quesValidation(true);
        }, 400);
      } else if (ques.classList.contains('final')) {
        setTimeout(function() {
          let progress = document.querySelector('.progress-container');
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
          contentHeight = document.querySelector('.questions-section .content').offsetHeight * 0.5;
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
        }, 500);
      }, 420);
    }
  }
  // Start button
  function startBtn() {
    let btn = document.querySelector('.start-btn button');
    // Click event
    btn.addEventListener('click', startBtnClick);
  }
  // Start button function on click
  function startBtnClick() {
    let frontSection = document.querySelector('section.front-section'),
        content = frontSection.querySelector('.content'),
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
        frontSection.classList.add('active');
        setTimeout(function() {
          startQuestions();
        }, 100);
      });
    });
        
  }
  // Start Questions
  function startQuestions() {
    let questionsSection = document.querySelector('.questions-section'),
        progressContainer = questionsSection.querySelector('.progress-container'),
        arrows = progressContainer.querySelectorAll('.arrow-control');
    if (!questionsSection.classList.contains('active')) {
      questionsSection.classList.add('active');
      questionsSection.querySelector('.question').classList.add('ready');
      arrows[0].classList.add('inactive');
      arrows[1].classList.add('active');
      questionAnimation(questionsSection.querySelector('.question'), 'next');
      setTimeout(function() {
        progressContainer.classList.add('active');
      }, 400);
    } else {
      let currQuestion = questionsSection.querySelector('.question.active');
      if (currQuestion.nextElementSibling && currQuestion.nextElementSibling.classList.contains('question')) {
        arrows[0].classList.remove('inactive');
        arrows[0].classList.add('active');
        currQuestion.classList.add('done');
        if (!currQuestion.querySelector('.question-content.choose')) {
          currQuestion.classList.add('valid');
        }
        questionAnimation(currQuestion, 'next2');
        setTimeout(function() {
          currQuestion.classList.remove('active');
          currQuestion.nextElementSibling.classList.add('ready');
          questionAnimation(currQuestion.nextElementSibling, 'next');
          if (currQuestion.nextElementSibling.classList.contains('valid')) {
            setTimeout(function() {
              quesValidation(true);
            }, 500);
          }
        }, 450);
      }
    }
  }

  // Accept Button
  let acceptBtn = document.querySelector('.questions-section .accept-btn');
  acceptBtn.addEventListener('click', acceptBtnFun);
  function acceptBtnFun() {
    if (!document.querySelector('.question.active .question-content.choose')) {
      quesValidation(false);
      setTimeout(function() {
        startQuestions();
      },250);
    } else {
      startQuestions();
    }
  }

  // Progress Bar
  function progressBarFun(status) {
    let progressBar = document.querySelector('.progress-container');
    if (progressBar.classList.contains('active')) {
      let bar = progressBar.querySelector('.bar'),
          barWidth = bar.offsetWidth,
          innerBar = bar.querySelector('.inner-bar'),
          innerBarWidth = innerBar.offsetWidth,
          allQues = document.querySelectorAll('.question'),
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
}());