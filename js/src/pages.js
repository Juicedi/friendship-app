// 'use strict';
const PageController = function (mainCtrl) {
  const self = this;

  const initPageBtns = (page) => {
    console.log('Initializing ' + page + ' buttons.');

    // Common buttons
    $('.go-to-page').on('click', (event) => {
      const nextPage = event.currentTarget.dataset.page;
      console.log('going to page: ' + nextPage);
      mainCtrl.changePage(nextPage);
    });

    $('.btnBack').on('click', () => {
      const prevPage = mainCtrl.getPrevPage();;

      if (prevPage === '' || typeof prevPage !== 'string') {
        console.log('There is no previous page stored');
      } else {
        console.log('Going to previous page: ' + prevPage);
        mainCtrl.changePage(prevPage);
      }
    });

    // Page specific buttons
    switch (page) {
      case 'event_search': {
        break;
      }
      default: {
        break;
      }
    }
  }

  return {
    initPageBtns(page) {
      initPageBtns(page);
    },
  };
};
