// 'use strict';

/**
 * Mainly initializes page event listeners and other page functionalities.
 * @param {Object} mainCtrl - The applications main controller
 * @return {Object} - All of the controllers functions that are shared with other controllers
 */
const PageController = function (mainCtrl) {
  /**
   * Creates a dropdown HTML string.
   *
   * @param {String} dropdownCategory - Dropdown category as a string.
   * @param {Array} dropdownData - List of all items in the dropdown.
   * @returns HTML string with all correct dropdown data in it.
   */
  function createDropdown(dropdownCategory, dropdownData) {
    let dropdownTemplate = `<div class="dropdown">
    
    <h3 class="dropdown-text green-bg white-text">
      ${dropdownCategory}
      <i class="fa fa-chevron-down white-text dropdown-arrow down" aria-hidden="true"></i>
      <i class="fa fa-chevron-right white-text dropdown-arrow right" aria-hidden="true"></i>
    </h3>
      
    <ul class="dropdown-list">`;

    dropdownData.forEach(function (interest) {
      dropdownTemplate += `<li class="dropdown-list-item" data-interest="${interest.toLowerCase()}">
        ${interest}
        <i class="fa fa-check black-text dropdown-list-checkmark" aria-hidden="true"></i>
      </li>`;
    }, this);

    dropdownTemplate += '</ul></div>';
    return dropdownTemplate;
  }

  /**
   * Adds all dropdowns to the page and initializes their functionalities.
   *
   * @param {Object} data - All of the interest categories and their items.
   */
  function addAllDropdowns(data) {
    const categories = data.categories;
    console.log(categories);
    const catKeys = Object.keys(categories);
    const currentFilters = mainCtrl.getInterestFilters();

    for (let i = 0, len = catKeys.length; i < len; i += 1) {
      const dropdown = createDropdown(catKeys[i], categories[catKeys[i]]);
      $('#dropdowns').append(dropdown);
    }

    for (let i = 0, len = currentFilters.length; i < len; i += 1) {
      $(`.dropdown-list-item[data-interest="${currentFilters[i]}"]`).addClass('selected');
    }

    $('.dropdown-list-item').on('click', (event) => {
      if ($(event.currentTarget).hasClass('selected')) {
        $(event.currentTarget).removeClass('selected');
        mainCtrl.removeFilter(event.currentTarget.dataset.interest);
      } else {
        $(event.currentTarget).addClass('selected');
        mainCtrl.addFilter(event.currentTarget.dataset.interest);
      }
    });

    $('.dropdown-text').on('click', (event) => {
      if ($(event.currentTarget).parent().hasClass('opened')) {
        $(event.currentTarget).parent().removeClass('opened');
      } else {
        $(event.currentTarget).parent().addClass('opened');
      }
    });
  }

  /**
   * Puts all event information to their correct places.
   *
   * @param {Object} evtInfo - Current pages event information.
   */
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

  /**
   * Initializes the searchbar functionality.
   */
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

  /**
   * Initializes the open and close modal buttons.
   */
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

  /**
   * Initializes the event info pages buttons.
   *
   * @param {String} id - Current pages event id.
   */
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

  /**
   * Checks if all inputfields have correct data in them.
   */
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

  /**
   * Gets user selected tags and put them into an array.
   *
   * @returns Array of tags.
   */
  function getTags() {
    const tagElems = $('.tag');
    const list = [];

    for (let i = 0; i < tagElems.length; i += 1) {
      list.push(tagElems[i].innerHTML);
    }

    return list;
  }

  /**
   * Initializes all buttons on Create event page.
   */
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

  /**
   * Appends list of tags to DOM.
   *
   * @param {Array} tags - List of tags to be appended to DOM.
   */
  function placeTags(tags) {
    for (let i = 0, len = tags.length; i < len; i += 1) {
      const elem = `<div class="tag">${tags[i]}</div>`;
      $('#tag-container').append(elem);
    }
  }

  /**
   * Initialize chat list items after their creation.
   */
  function initChatListItems() {
    $('.go-to-chat').on('click', (event) => {
      const id = event.currentTarget.dataset.id;
      const filename = event.currentTarget.dataset.page;
      const nextPage = `${filename}:${id}`;

      console.log(`going to page: ${nextPage}`);
      mainCtrl.changePage(nextPage);
    });
  }

  /**
   * Create chat list item template.
   *
   * @param {Object} chat - Contains all the needed chat information.
   * @returns HTML text with all of the correct texts inserted to it.
   */
  function createChatListItem(chat) {
    const chatTemplate = `
        <article class="list-item white-bg go-to-chat" data-page="chat" data-id="${chat.id}">
          <div class="list-item-image">
            <img src="build/img/users/${chat.messages.slice(-1)[0].sender}.jpg" alt="list-item-thumbnail">
          </div>
          <div class="list-item-texts">
            <h4 class="list-item-title darkestGreen-text">${chat.name}</h4>
            <p class="list-item-location darkGreen-text">${chat.messages.slice(-1)[0].content}</p>
            <p class="list-item-date darkGreen-text">${chat.messages.slice(-1)[0].date}</p>
          </div>
        </article>
    `;
    return chatTemplate;
  }

  /**
   * Create HTML template for event list item.
   *
   * @param {Object} event - Object containing all needed event information.
   * @returns HTML text with all needed data inserted to it.
   */
  function createEventListItem(event) {
    let ownText = '';
    let joinBtn = '';
    if (event.owner === mainCtrl.getUserData().id) {
      ownText = `<h4 class="owner green-text ${event.own}">Own</h4>`;
    }
    if (event.addJoinBtn === true) {
      joinBtn = `
        <button class="main-btn green-bg join-btn" data-id="${event.id}">
          <h4 class="white-text">Join</h4>
        </button>
      `;
    }

    const template = `
        <article class="list-item white-bg go-to-page-with-id" data-page="event_info" data-id="${event.id}">
          <div class="list-item-image">
            <img src="${event.eventImg}" alt="list-item-thumbnail">
          </div>
          <div class="list-item-texts">
            <h4 class="list-item-title darkestGreen-text">${event.title}</h4>
            <p class="list-item-location darkGreen-text">${event.location}</p>
            <p class="list-item-date darkGreen-text">${event.date}</p>
            ${ownText}
          </div>
          ${joinBtn}
        </article>
      `;
    return template;
  }

  function populateChatMessages() {
    console.log('populating chat messages');
  }

  /**
   * Show all of the user's chats on the chats page.
   *
   * @param {Array} chats - List of all of the chats the current user has.
   */
  function populateChatList(chats) {
    let chatTemplate;

    if (chats.length > 0) {
      for (let i = 0, len = chats.length; i < len; i += 1) {
        chatTemplate = createChatListItem(chats[i]);
        $('#page-content').append(chatTemplate);
      }
    } else {
      $('.no-chats-text').removeClass('hide');
    }
    initChatListItems();
  }

  /**
   * Show all users own events and events s/he is currently attending.
   *
   * @param {Array} events - List of events to be shown on the users own events page.
   */
  function populateOwnEvents(events) {
    let eventTemplate;

    if (events.length > 0) {
      for (let i = 0, len = events.length; i < len; i += 1) {
        eventTemplate = createEventListItem(events[i]);
        $('#page-content').append(eventTemplate);
      }
    } else {
      $('.no-events-text').removeClass('hide');
    }
    initNavigationBtns();
  }

  /**
   * Populates event list with search results.
   *
   * @param {Array} events - List of events to be shown on the list.
   * @param {String} location - Location where events should be appended.
   */
  function populateSearchEvents(events, location) {
    let eventTemplate;

    $(location).html('');

    for (let i = 0, len = events.length; i < len; i += 1) {
      const event = events[i];
      event.addJoinBtn = true;
      eventTemplate = createEventListItem(event);
      $(location).append(eventTemplate);
    }
    initSearchEventBtns(location);
  }

  /**
   * Initialize searched event list items and their buttons.
   *
   * @param {String} element - Element string determining what elements buttons should be initialized.
   */
  function initSearchEventBtns(element) {
    $(`${element} .join-btn`).on('click', (event) => {
      event.stopPropagation();
      $(event.currentTarget).parent().addClass('hide');
      mainCtrl.attendEvent(event.currentTarget.dataset.id);
    });
    $(`${element} .go-to-page-with-id`).one('click', (event) => {
      const id = event.currentTarget.dataset.id;
      const filename = event.currentTarget.dataset.page;
      const nextPage = `${filename}:${id}`;

      console.log(`going to page: ${nextPage}`);
      mainCtrl.changePage(nextPage);
    });
    $('#interests-btn').on('click', () => {
      mainCtrl.changePage('category_list');
    });
    if (mainCtrl.getInterestFilters().length > 0) {
      $('#clear-interest-filters').removeClass('hide');
      $('#clear-interest-filters').on('click', (event) => {
        event.stopPropagation();
        mainCtrl.clearFilters();
        mainCtrl.changePage('event_search');
      });
    }
  }

  /**
   * Initialize the basic navigation buttons.
   */
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

  /**
   * Initialize the given page.
   *
   * @param {String} page - Current page and possibly an id for an event or chat (i.e. "event_info:event1234").
   */
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
      case 'category_list': {
        mainCtrl.getCategories(addAllDropdowns);
        initNavigationBtns();
        break;
      }
      case 'profile': {
        initNavigationBtns();
        break;
      }
      case 'chat_list': {
        mainCtrl.getChatList();
        initNavigationBtns();
        break;
      }
      case 'chat': {
        mainCtrl.getChatMessages(pageId);
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
    addAllDropdowns(categories) {
      addAllDropdowns(categories);
    },
    fillEventInfo(evtInfo) {
      fillEventInfo(evtInfo);
    },
    populateOwnEvents(events) {
      populateOwnEvents(events);
    },
    populateSearchEvents(events, location) {
      populateSearchEvents(events, location);
    },
    populateChatMessages(messages) {
      populateChatMessages(messages);
    },
    populateChatList(chats) {
      populateChatList(chats);
    }
  };
};
