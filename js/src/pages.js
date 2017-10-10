// 'use strict';

/**
 * Mainly initializes page event listeners and other page functionalities.
 * @param {Object} mainCtrl - The applications main controller
 * @return {Object} - All of the controllers functions that are shared with other controllers
 */
const PageController = function (mainCtrl) {
  const self = this;

  function populateOwnEvents(events) {
    let eventTemplate;
    console.log('populating own events');
    for(let i = 0, len = events.length; i < len; i += 1) {
      const own = events[i].own === true ? '' : 'hide';
      eventTemplate = `
        <article class="event white-bg">
          <div class="event-image">
            <img src="build/img/content/sting.jpg" alt="event-thumbnail">
          </div>
          <div class="event-texts">
            <h4 class="event-title darkestGreen-text">${events[i].title}</h4>
            <p class="event-location darkGreen-text">${events[i].location}</p>
            <p class="event-date darkGreen-text">${events[i].date}</p>
            <h4 class="owner green-text ${own}">Own</h4>
          </div>
        </article>
      `
      $('#page-content').append(eventTemplate);

    }
  }

  function initPageBtns(page) {
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
      case 'own_events': {
        mainCtrl.getUserEvents();
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
    populateOwnEvents(events) {
      populateOwnEvents(events);
    }
  };
};
