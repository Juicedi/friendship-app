// 'use strict';

/**
 * Mainly initializes page event listeners and other page functionalities.
 * @param {Object} mainCtrl - The applications main controller
 * @return {Object} - All of the controllers functions that are shared with other controllers
 */
const PageController = function (mainCtrl) {
  function addDropdowns() {

  }

  function fillEventInfo(evtInfo) {
    const uData = mainCtrl.getUserData();
    $('#header-image img').attr('src', evtInfo.eventImg);
    $('#event-title').html(evtInfo.title);
    $('#event-location').html(evtInfo.location);
    $('#event-date').html(evtInfo.date);
    $('#event-description').html(evtInfo.description);
    $('.attendee-number').html(evtInfo.attending.length);
    placeTags(evtInfo.tags);

    if (uData.eventsAttending.indexOf(evtInfo.id) !== -1) {
      $('#attend-btn').addClass('hide');
      $('#leave-btn').removeClass('hide');
    } else {
      $('#attend-btn').removeClass('hide');
      $('#leave-btn').addClass('hide');
    }

    if (evtInfo.owner === uData.id) {
      $('#privacy-btn-container').removeClass('hide');
      $('.invite-person').removeClass('hide');
      $('.add-tag').removeClass('hide');
      $('#options').removeClass('hide');
      $('#attend-btn').addClass('hide');
      $('#leave-btn').addClass('hide');
    }

    if (evtInfo.large === true) {
      $('#join-squad').removeClass('hide');
    }
  }

  function initSearchbar() {
    $('#search-field').keyup((event) => {
      const key = event.keyCode;
      if (key === 13 && event.currentTarget.value.length > 0) {
        const searchInput = event.currentTarget.value;

        mainCtrl.getSearchResults(searchInput);
        $('#search-results').removeClass('hide');
        $('#cancel-search').removeClass('hide');
        $('#suggested-events').html('');
        $('#suggested-events').addClass('hide');
      }

      /* If the suggested events are still show on the screen, don't refresh them.
      Just hide cancel button. */
      if (event.currentTarget.value.length < 1 && !$('#suggested-events').hasClass('hide')) {
        $('#cancel-search').addClass('hide');
      } else if (event.currentTarget.value.length < 1) {
        $('#cancel-search').addClass('hide');
        $('#search-results').addClass('hide');
        $('#search-results').html('');
        $('#suggested-events').removeClass('hide');
        mainCtrl.getSuggestedEvents();
      }
    });
    $('#cancel-search').on('click', () => {
      $('#search-field').val('');
      $('#cancel-search').addClass('hide');
      $('#search-results').addClass('hide');
      $('#search-results').html('');
      $('#suggested-events').removeClass('hide');
      mainCtrl.getSuggestedEvents();
    });
  }

  function initModalBtns() {
    $('.close-modal-btn').on('click', (event) => {
      $(event.currentTarget).parent().parent().addClass('hide');
      $('#modal-overlay').addClass('hide');
    });
    $('.open-modal-btn').on('click', (event) => {
      const modal = event.currentTarget.dataset.modal;
      $(`#${modal}-modal`).removeClass('hide');
      $('#modal-overlay').removeClass('hide');
    });
  }

  function initEventInfoBtns(id) {
    $('.slider-checkbox').on('click', (event) => {
      if ($(event.currentTarget).hasClass('off')) {
        $(event.currentTarget).addClass('on');
        $(event.currentTarget).removeClass('off');
      } else {
        $(event.currentTarget).addClass('off');
        $(event.currentTarget).removeClass('on');
      }
      mainCtrl.eventPrivacyToggle(id);
    });
    $('#attend-btn').on('click', () => {
      $('#attend-btn').addClass('hide');
      $('#leave-btn').removeClass('hide');
      mainCtrl.attendEvent(id);
    });
    $('#leave-btn').on('click', () => {
      $('#leave-btn').addClass('hide');
      $('#attend-btn').removeClass('hide');
      mainCtrl.leaveEvent(id);
    });
    $('.tag').on('dblclick', (event) => {
      if (mainCtrl.getEventInfo(id).owner === mainCtrl.getUserData().id) {
        const tag = event.currentTarget.innerHTML;
        event.currentTarget.parentNode.removeChild(event.currentTarget);
        mainCtrl.removeTag(id, tag);
      }
    });
    $('#confirm-change').on('click', () => {
      const inputVal = $('#owner-input').val();

      if (inputVal.length > 0) {
        mainCtrl.changeEventOwner(id, inputVal);
        mainCtrl.changePage('own_events');
      } else {
        $('#owner-modal').find('.warning-text').removeClass('hide');
      }
    });
    $('#confirm-remove').on('click', () => {
      mainCtrl.removeEvent(id);
      mainCtrl.changePage('own_events');
    });
    $('#confirm-invite').on('click', () => {
      // TODO: Finish invitation function
      console.log('Sent invitation');
    });
    // TODO: Add tags function
  }

  function checkCreateInputs() {
    const title = $('#title-field').val();
    const location = $('#location-field').val();
    const date = $('#event-date').val();
    const time = $('#event-time').val();
    const desc = $('#event-description').val();

    if (
      title.length > 0
      && location.length > 0
      && date.length > 0
      && time.length > 0
      && desc.length > 0
    ) {
      return true;
    }
    return false;
  }

  function getTags() {
    const tagElems = $('.tag');
    const list = [];

    for (let i = 0; i < tagElems.length; i += 1) {
      list.push(tagElems[i].innerHTML);
    }

    return list;
  }

  function initCreateEventBtns() {
    $('#submit-event').on('click', () => {
      let check = false;
      check = checkCreateInputs();

      if (check) {
        console.log('event added');
        const eventObj = {};

        eventObj.id = $('#title-field').val() + Math.floor(Math.random() * 100);
        eventObj.title = $('#title-field').val();
        eventObj.location = $('#location-field').val();
        eventObj.date = `${$('#event-date').val()} ${$('#event-time').val()}`;
        eventObj.description = $('#event-description').val();
        eventObj.tags = getTags();
        eventObj.eventImg = $('#event-image').attr('src');
        eventObj.owner = mainCtrl.getUserData().id;
        eventObj.attending = [];
        eventObj.large = false;
        eventObj.private = false;

        mainCtrl.createEvent(eventObj);
      }
    });
    $('#confirm-image').on('click', () => {
      let newSrc = $('#image-input').val();

      $('#change-image-modal').addClass('hide');
      $('#modal-overlay').addClass('hide');
      $('#event-image').attr('src', newSrc);

      newSrc = '';
    });
    $('#tags-field').keyup((event) => {
      const keycode = event.keyCode;
      const inputValue = event.currentTarget.value.toLowerCase();
      let tagTemplate = '';

      if (keycode === 13 && inputValue.length > 0) {
        console.log('added tag');
        tagTemplate = `<div class="tag">${inputValue}</div>`;
        $('#tag-container').append(tagTemplate);
      }
    });
    $('.tag').on('dblclick', (event) => {
      event.currentTarget.parentNode.removeChild(event.currentTarget);
    });
  }

  function placeTags(tags) {
    for (let i = 0, len = tags.length; i < len; i += 1) {
      const elem = `<div class="tag">${tags[i]}</div>`;
      $('#tag-container').append(elem);
    }
  }

  function populateOwnEvents(events) {
    let eventTemplate;

    if (events.length > 0) {
      for (let i = 0, len = events.length; i < len; i += 1) {
        const own = events[i].owner === mainCtrl.getUserData().id ? '' : 'hide';
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

  function populateSearchEvents(events, location) {
    let eventTemplate;

    $(location).html('');

    for (let i = 0, len = events.length; i < len; i += 1) {
      eventTemplate = `
        <article class="event white-bg go-to-event-page-with-id" data-page="event_info" data-id="${events[i].id}">
          <div class="event-image">
            <img src="${events[i].eventImg}" alt="event-thumbnail">
          </div>
          <div class="event-texts">
            <h4 class="event-title darkestGreen-text">${events[i].title}</h4>
            <p class="event-location darkGreen-text">${events[i].location}</p>
            <p class="event-date darkGreen-text">${events[i].date}</p>
          </div>
          <button class="main-btn green-bg join-btn" data-id="${events[i].id}">
            <h4 class="white-text">Join</h4>
          </button>
        </article>
      `;
      $(location).append(eventTemplate);
    }
    $(`${location} .join-btn`).on('click', (event) => {
      event.stopPropagation();
      $(event.currentTarget).parent().addClass('hide');
      mainCtrl.attendEvent(event.currentTarget.dataset.id);
    });
    initSearchEventBtns(location);
  }

  function initSearchEventBtns(element) {
    $(`${element} .go-to-event-page-with-id`).one('click', (event) => {
      const id = event.currentTarget.dataset.id;
      const filename = event.currentTarget.dataset.page;
      const nextPage = `${filename}:${id}`;
      console.log(`going to page: ${nextPage}`);
      mainCtrl.changePage(nextPage);
    });
  }

  function initNavigationBtns() {
    $('.go-to-page').one('click', (event) => {
      const nextPage = event.currentTarget.dataset.page;
      console.log('going to page: ' + nextPage);
      mainCtrl.changePage(nextPage);
    });

    $('.go-to-page-with-id').one('click', (event) => {
      const id = event.currentTarget.dataset.id;
      const filename = event.currentTarget.dataset.page;
      const nextPage = `${filename}:${id}`;
      console.log(`going to page: ${nextPage}`);
      mainCtrl.changePage(nextPage);
    });

    $('.btnBack').one('click', () => {
      const prevPage = mainCtrl.getPrevPage();

      if (prevPage === '' || typeof prevPage !== 'string') {
        console.log('There is no previous page stored');
      } else {
        console.log(`Going to previous page: ${prevPage}`);
        mainCtrl.changePage(prevPage);
      }
    });
  }

  function initPage(page) {
    let pageName;
    let pageId;

    if (page.indexOf(':') !== -1) {
      pageName = page.split(':')[0];
      pageId = page.split(':')[1];
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
        initNavigationBtns();
        initSearchbar();
        // TODO: Filter function
        break;
      }
      case 'event_info': {
        mainCtrl.getEventInfo(pageId, initEventInfoBtns);
        initModalBtns();
        initNavigationBtns();
        initEventInfoBtns(pageId);
        break;
      }
      case 'create_event': {
        initCreateEventBtns();
        initModalBtns();
        initNavigationBtns();
        break;
      }
      case 'profile': {
        initNavigationBtns();
        break;
      }
      case 'chat_list': {
        initNavigationBtns();
        break;
      }
      case 'chat': {
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
    populateSearchEvents(events, location) {
      populateSearchEvents(events, location);
    }
  };
};
