// 'use strict';

/**
 * Mainly initializes page event listeners and other page functionalities.
 * @param {Object} mainCtrl - The applications main controller
 * @return {Object} - All of the controllers functions that are shared with other controllers
 */
const PageController = function (mainCtrl) {
  const self = this;

  function fillEventInfo(evtInfo) {
    $('#header-image img').attr('src', evtInfo.eventImg);
    $('#event-title').html(evtInfo.title);
    $('#event-location').html(evtInfo.location);
    $('#event-date').html(evtInfo.date);
    $('#event-description').html(evtInfo.description);
    placeTags(evtInfo.tags);

    if (evtInfo.owner === mainCtrl.getUserId()) {
      $('#privacy-btn-container').removeClass('hide');
      $('.invite-person').removeClass('hide');
      $('.add-tag').removeClass('hide');
      $('#options').removeClass('hide');
      $('#attend-btn').addClass('hide');
    }

    if (evtInfo.large === true) {
      $('#join-squad').removeClass('hide');
    }
  }

  function placeTags(tags) {
    for (let i = 0, len = tags.length; i < len; i += 1) {
      const elem = `<div class="tag">${tags[i]}</div>`;
      $('#tag-container').append(elem);
    }
  }

  function populateOwnEvents(events) {
    let eventTemplate;

    if( events.length > 0) {
      for(let i = 0, len = events.length; i < len; i += 1) {
        const own = events[i].owner === mainCtrl.getUserId() ? '' : 'hide';
        eventTemplate = `
        <article class="event white-bg go-to-page-with-id" data-page="event_info" data-id="${events[i].id}">
          <div class="event-image">
            <img src="${events[i].eventImg}" alt="event-thumbnail">
          </div>
          <div class="event-texts">
            <h4 class="event-title darkestGreen-text">${events[i].title}</h4>
            <p class="event-location darkGreen-text">${events[i].location}</p>
            <p class="event-date darkGreen-text">${events[i].date}</p>
            <h4 class="owner green-text ${own}">Own</h4>
          </div>
        </article>
      `;
        $('#page-content').append(eventTemplate);
      }
    } else {
      $('.no-events-text').removeClass('hide');
    }
    initNavigationBtns();
  }

  function populateSuggestedEvents(events) {
    let eventTemplate;
    const keys = Object.keys(events);

    for(let i = 0, len = keys.length; i < len; i += 1) {
      eventTemplate = `
        <article class="event white-bg go-to-page-with-id" data-page="event_info" data-id="${keys[i]}">
          <div class="event-image">
            <img src="${events[keys[i]].eventImg}" alt="event-thumbnail">
          </div>
          <div class="event-texts">
            <h4 class="event-title darkestGreen-text">${events[keys[i]].title}</h4>
            <p class="event-location darkGreen-text">${events[keys[i]].location}</p>
            <p class="event-date darkGreen-text">${events[keys[i]].date}</p>
            <button>
              <h4 class="main-btn green-bg white-text">Join</h4>
            </button>
          </div>
        </article>
      `;
      $('#page-content').append(eventTemplate);
    }
    initNavigationBtns();
  }

  function initNavigationBtns() {
    $('.go-to-page').on('click', (event) => {
      const nextPage = event.currentTarget.dataset.page;
      console.log('going to page: ' + nextPage);
      mainCtrl.changePage(nextPage);
    });

    $('.go-to-page-with-id').on('click', (event) => {
      const id = event.currentTarget.dataset.id;
      const filename = event.currentTarget.dataset.page;
      const nextPage = `${filename}:${id}`;
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
  }

  function initPage(page) {
    let pageName;

    if (page.indexOf(':') !== -1) {
      pageName = page.split(':')[0]
    } else {
      pageName = page;
    }

    // Page specific buttons
    switch (pageName) {
      case 'own_events': {
        mainCtrl.getUserEvents();
        break;
      }
      case 'event_search': {
        mainCtrl.getSuggestedEvents();
        break;
      }
      case 'event_info': {
        mainCtrl.getEventInfo();
        initNavigationBtns();
        break;
      }
      default: {
        initNavigationBtns();
        break;
      }
    }
  }

  return {
    initPage(page) {
      initPage(page);
    },
    fillEventInfo(evtInfo) {
      fillEventInfo(evtInfo);
    },
    populateOwnEvents(events) {
      populateOwnEvents(events);
    },
    populateSuggestedEvents(events) {
      populateSuggestedEvents(events);
    }
  };
};
