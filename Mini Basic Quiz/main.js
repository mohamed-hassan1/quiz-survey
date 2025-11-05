(function() {
  'use strict';
  // The Right Answers for the 3 Questions Attempts
  const answers = ['A', 'C', 'D'];

  let globalObj = {
    attempt: 1,
    rightSymbol: (container) => {
      let rightEle = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="14" height="18" x="0" y="0" viewBox="0 0 511.985 511.985" xml:space="preserve" class=""><path d="M500.088 83.681c-15.841-15.862-41.564-15.852-57.426 0L184.205 342.148 69.332 227.276c-15.862-15.862-41.574-15.862-57.436 0-15.862 15.862-15.862 41.574 0 57.436l143.585 143.585c7.926 7.926 18.319 11.899 28.713 11.899 10.394 0 20.797-3.963 28.723-11.899l287.171-287.181c15.862-15.851 15.862-41.574 0-57.435z" fill="currentColor"/></svg>`,
      classEle = 'symbol correct-symbol',
      div = document.createElement('div');
      div.className = classEle;
      div.innerHTML = rightEle;
      container.appendChild(div);
    },
    wrongSymbol: (container) => {
      let wrongEle = `<div></div>`,
      classEle = 'symbol wrong-symbol',
      div = document.createElement('div');
      div.className = classEle;
      div.innerHTML = wrongEle;
      container.appendChild(div);
    }
  }
}());