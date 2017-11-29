// 'use strict';

/**
 * Mainly initializes page event listeners and other page functionalities.
 * @param {Object} mainCtrl - The applications main controller
 * @return {Object} - All of the controllers functions that are shared with other controllers
 */
const PageController = function (mainCtrl) {
  let currentChat = 'empty';

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
        <span class="love-color"></span>
        <span class="hate-color"></span>
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
    const catKeys = Object.keys(categories);
    const currentFilters = mainCtrl.getInterestFilters();

    for (let i = 0, len = catKeys.length; i < len; i += 1) {
      const dropdown = createDropdown(catKeys[i], categories[catKeys[i]]);
      $('#dropdowns').append(dropdown);
    }

    for (let i = 0, len = currentFilters.length; i < len; i += 1) {
      $(`.dropdown-list-item[data-interest="${currentFilters[i]}"]`).addClass('selected');
    }

    $('.dropdown-text').on('click', (event) => {
      if ($(event.currentTarget).parent().hasClass('opened')) {
        $(event.currentTarget).parent().removeClass('opened');
      } else {
        $(event.currentTarget).parent().addClass('opened');
      }
    });

    if ($('.category-page').length > 0) {
      $('.dropdown-list-item').on('click', (event) => {
        if ($(event.currentTarget).hasClass('selected')) {
          $(event.currentTarget).removeClass('selected');
          mainCtrl.removeFilter(event.currentTarget.dataset.interest);
        } else {
          $(event.currentTarget).addClass('selected');
          mainCtrl.addFilter(event.currentTarget.dataset.interest);
        }
      });
    } else {
      initSwipe();
      colorInterests();
    }
  }

  /**
   * Puts all event information to their correct places.
   *
   * @param {Object} evtInfo - Current pages event information.
   */
  function fillEventInfo(evtInfo) {
    const uData = mainCtrl.getCurrentUserData();
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

    if (evtInfo.large === true && uData.eventsAttending.indexOf(evtInfo.id) > -1) {
      if (mainCtrl.checkSquad(evtInfo) === null) {
        $('#join-squad').removeClass('hide');
        $('#leave-squad').addClass('hide');
      } else {
        $('#join-squad').addClass('hide');
        $('#leave-squad').removeClass('hide');
      }
      initSquadJoinBtn(evtInfo);
    }

    initEventInfoBtns(evtInfo);
  }

  function fillProfileInfo(profileData) {
    const currentDate = new Date();
    const birthDate = new Date(profileData.birth);
    const age = currentDate.getFullYear() - birthDate.getFullYear();

    $('#username').html(profileData.nickname);
    $('#age-text span').html(age);
    $('#profile-picture-container').css('background-image', 'url(' + profileData.picture + ')');
    $('#header-image img').attr('src', profileData.bg);
    $('#gender-text span').html(profileData.gender);
    $('#location p span').html(profileData.location);
    $('#about-container p').html(profileData.description);

    populateLovesHates(profileData);
  }

  /**
   * Marks currently used element as loved or hated. Sends that information to database.
   *
   * @param {Object} elem - Element which is currently being used.
   * @param {String} alignment - String which is either "loved" or "hated".
   */
  function addInterest(elem, alignment) {
    const opposite = alignment === 'loved' ? 'hated' : 'loved';
    const value = elem.dataset.interest;

    $(elem).addClass(alignment);
    $(elem).removeClass(opposite);
    mainCtrl.addInterest(value, alignment);
  }

  /**
   * Checks login and signup inputs if they have correct format.
   * @returns {Boolean} Result of input check.
   */
  function checkLoginInput(method) {
    let result = true;
    let username = '';
    let password = '';
    let confirm = '';

    if (method === 'login') {
      username = $('#username').val();
      password = sha1($('#password').val());
    } else {
      username = $('#signup-username').val();
      password = sha1($('#signup-password').val());
      confirm = sha1($('#signup-confirm').val());
    }

    if (method === 'login' && !mainCtrl.checkLoginInput(username, password)) result = false;
    if (method === 'signup') {
      result = mainCtrl.checkNameAvailability(username);
      if (password.length === 0) result = false;
      if (confirm !== password && method === 'signup') result = false;
    }

    return result;
  }

  /**
   * Initializes buttons on lander page.
   */
  function initLanderBtn() {
    $('#open-login-btn').on('click', () => {
      $('#login-field-container').removeClass('hide');
      $('#login-btn-container').addClass('hide');
    });
    $('#open-signup-btn').on('click', () => {
      $('#sign-up-field-container').removeClass('hide');
      $('#login-btn-container').addClass('hide');
    });
    $('.btnPrev').on('click', () => {
      $('#login-field-container').addClass('hide');
      $('#sign-up-field-container').addClass('hide');
      $('#login-btn-container').removeClass('hide');
    });
    $('#signup-submit').on('click', () => {
      if (checkLoginInput('signup')) {
        const signupData = {};
        signupData.id = $('#signup-username').val();
        signupData.password = sha1($('#signup-password').val());
        mainCtrl.signUp(signupData);
      } else {
        alert('check your inputs');
      }
    });
    $('#login-submit').on('click', () => {
      if (checkLoginInput('login')) {
        const loginData = {};
        loginData.username = $('#username').val();
        loginData.password = $('#password').val();
        mainCtrl.setCurrentUser(loginData.username);
        mainCtrl.changePage('profile:own');
      } else {
        alert('check your inputs');
      }
    });
  }

  /**
   * Opens profile information editor on the profile page.
   */
  function openEditor() {
    $('.profile-edit').addClass('hide');
    $('.modal').removeClass('hide');
  }

  /**
   * Initialize profile info edit buttons on users own profile page.
   */
  function initProfInfoEdit() {
    $('#general-information').on('click', () => {
      openEditor();
      $('#birth-edit').removeClass('hide');
      $('#gender-edit').removeClass('hide');
      $('#location-edit').removeClass('hide');
    });
    $('#username').on('click', () => {
      openEditor();
      $('#nickname-edit').removeClass('hide');
    });
    $('#description').on('click', () => {
      openEditor();
      $('#nickname-edit').removeClass('hide');
    });
    $('#profile-picture-container').on('click', () => {
      openEditor();
      $('#nickname-edit').removeClass('hide');
    });
    $('#header img').on('click', () => {
      openEditor();
      $('#nickname-edit').removeClass('hide');
    });
    $('#cancel-edit').on('click', () => {
      $('.modal').addClass('hide');
    });
    $('#confirm-edit').on('click', () => {
      const inputs = $('.profile-edit');
      const data = {};

      for (let i = 0; i < inputs.length; i++) {
        const key = $(inputs[i]).attr('name');
        const value = $(inputs[i]).val();
        data[key] = value;
      }

      $('.modal').addClass('hide');
      mainCtrl.editProfileData(data);
    });
  }

  /**
   * Initializes the interests so user can go to the edit page.
   */
  function initInterestEdit() {
    $('.interest').addClass('own-interest');
    $('.own-interest').on('click', () => {
      mainCtrl.changePage('edit_interests');
    });
  }

  /**
   * Initializes swiping functions on the interests selection page.
   */
  function initSwipe() {
    const travelDistance = 50;
    let mouseDown = false;
    let posXstart = 0;
    let posXdelta = 0;
    let elem = '';

    $('.dropdown-list-item').on('mousedown touchstart', (e) => {
      if (e.handleObj.type === 'mousedown') {
        posXstart = e.offsetX;
      } else {
        posXstart = e.originalEvent.changedTouches[0].pageX - posXstart;
      }

      mouseDown = true;
      elem = e.currentTarget;
    });

    $('.dropdown-list-item').on('mousemove touchmove', (e) => {
      if (mouseDown) {
        if (e.handleObj.type === 'mousemove') {
          posXdelta = e.offsetX - posXstart;
        } else {
          posXdelta = e.originalEvent.changedTouches[0].pageX - posXstart;
        }
      }
    });

    $('.dropdown-list-item').on('mouseup touchend', () => {
      mouseDown = false;

      if (posXdelta > travelDistance) {
        addInterest(elem, 'loved');
      } else if (posXdelta < -travelDistance) {
        addInterest(elem, 'hated');
      }

      posXstart = 0;
      posXdelta = 0;
    });
  }

  /**
   * Initializes the chat message input.
   */
  function initChatInput() {
    $('#chat-message-input').on('keyup', () => {
      if ($('#chat-message-input').val() !== '') {
        const message = $('#chat-message-input').val();
        if (event.keyCode === 13) {
          mainCtrl.sendMessage(currentChat, message);
          $('#chat-message-input').val('');
        }
      }
    });

    $('#send-message').on('click', () => {
      if ($('#chat-message-input').val() !== '') {
        const message = $('#chat-message-input').val();
        mainCtrl.sendMessage(currentChat, message);
        $('#chat-message-input').val('');
      }
    });
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
  function initEventInfoBtns(evtInfo) {
    $('.slider-checkbox').on('click', (event) => {
      if ($(event.currentTarget).hasClass('off')) {
        $(event.currentTarget).addClass('on');
        $(event.currentTarget).removeClass('off');
      } else {
        $(event.currentTarget).addClass('off');
        $(event.currentTarget).removeClass('on');
      }
      mainCtrl.eventPrivacyToggle(evtInfo.id);
    });
    $('#attend-btn').on('click', () => {
      $('#attend-btn').addClass('hide');
      $('#leave-btn').removeClass('hide');

      if (evtInfo.large) {
        $('#join-squad').removeClass('hide');
      }
      mainCtrl.attendEvent(evtInfo.id);
    });
    $('#leave-btn').on('click', () => {
      $('#leave-btn').addClass('hide');
      $('#attend-btn').removeClass('hide');
      $('#leave-squad').addClass('hide');
      $('#join-squad').addClass('hide');
      mainCtrl.leaveEvent(evtInfo.id);
    });
    $('.tag').on('dblclick', (event) => {
      if (evtInfo.owner === mainCtrl.getCurrentUserData().id) {
        const tag = event.currentTarget.innerHTML;
        event.currentTarget.parentNode.removeChild(event.currentTarget);
        mainCtrl.removeTag(evtInfo.id, tag);
      }
    });
    $('#confirm-change').on('click', () => {
      const inputVal = $('#owner-input').val();

      if (inputVal.length > 0) {
        mainCtrl.changeEventOwner(evtInfo.id, inputVal);
        mainCtrl.changePage('own_events');
      } else {
        $('#owner-modal').find('.warning-text').removeClass('hide');
      }
    });
    $('#confirm-remove').on('click', () => {
      mainCtrl.removeEvent(evtInfo.id);
      mainCtrl.changePage('own_events');
    });
    $('#confirm-invite').on('click', () => {
      // TODO: Finish invitation function
      console.log('Sent invitation');
    });
  }

  /**
   * Initiates join squad button.
   */
  function initSquadJoinBtn(evtInfo) {
    $('#join-squad').on('click', () => {
      mainCtrl.joinSquadChat(evtInfo);
      mainCtrl.changePage('chat_list');
    });
    $('#leave-squad').on('click', () => {
      mainCtrl.leaveSquadChat(evtInfo);
      $('#leave-squad').addClass('hide');
      $('#join-squad').removeClass('hide');
    });
  }

  /**
   * Initiates profile navigation bar.
   */
  function initProfileNav() {
    $('.prof-nav-btn').on('click', (e) => {
      const tab = e.currentTarget.dataset.tab;

      $('.selected').removeClass('selected');
      $(e.currentTarget).addClass('selected');
      $('#detailed-information>div').addClass("hide");

      if (tab === 'about') {
        $('#about-container').removeClass("hide");
      } else if (tab === 'loves') {
        $('#loves-container').removeClass("hide");
      } else if (tab === 'hates') {
        $('#hates-container').removeClass("hide");
      }
    });
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
        const eventObj = {};

        eventObj.id = $('#title-field').val() + Math.floor(Math.random() * 100);
        eventObj.title = $('#title-field').val();
        eventObj.location = $('#location-field').val();
        eventObj.date = `${$('#event-date').val()} ${$('#event-time').val()}`;
        eventObj.description = $('#event-description').val();
        eventObj.tags = getTags();
        eventObj.eventImg = $('#event-image').attr('src');
        eventObj.owner = mainCtrl.getCurrentUserData().id;
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
   * Initialize searched event list items and their buttons.
   *
   * @param {String} element - Element string determining what elements buttons should be initialized.
   */
  function initSearchEventBtns() {
    initGotoEventBtns();
    $('.join-btn').on('click', (event) => {
      event.stopPropagation();
      $(event.currentTarget).parent().addClass('hide');
      mainCtrl.attendEvent(event.currentTarget.dataset.id);
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

  function initGotoEventBtns() {
    $('.go-to-event-with-id').one('click', (event) => {
      const id = event.currentTarget.dataset.id;
      const filename = event.currentTarget.dataset.page;
      const nextPage = `${filename}:${id}`;

      console.log(`going to page: ${nextPage}`);
      mainCtrl.changePage(nextPage);
    });
  }

  /**
   * Initializes messages to take user to the profile pages of the message sender.
   */
  function initGotoProfile() {
    $('.list-item').on('click', (e) => {
      mainCtrl.changePage(e.currentTarget.dataset.page + ':' + e.currentTarget.dataset.id);
    });
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
   * Create chat list item template.
   *
   * @param {Object} chat - Contains all the needed chat information.
   * @param {Object} messages - Contains all the chat messages. Used to show the lates message.
   * @returns HTML text with all of the correct texts inserted to it.
   */
  function createChatListItem(chat, messages) {
    let messageContent = '';
    let messageDate = '';
    let time = '';

    if (messages.length > 0) {
      messageContent = messages.slice(-1)[0].content;
      messageDate = new Date(parseFloat(messages.slice(-1)[0].date));
      time = timeDifference(messageDate);
    }

    const chatTemplate = `
        <article class="list-item white-bg go-to-chat" data-page="chat" data-id="${chat.chatId}">
          <div class="list-item-image">
            <img src="build/img/chats/${chat.chatId}.jpg" alt="list-item-thumbnail">
          </div>
          <div class="list-item-texts">
            <h4 class="list-item-title darkestGreen-text">${chat.name}</h4>
            <p class="list-item-location darkGreen-text">${messageContent}</p>
            <p class="list-item-date darkGreen-text">${time}</p>
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
    if (event.owner === mainCtrl.getCurrentUserData().id) {
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
        <article class="list-item white-bg go-to-event-with-id" data-page="event_info" data-id="${event.id}">
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

  /**
   * Creates HTML code for the chat message element.
   *
   * @param {Object} message - Object which has all needed chat information.
   * @returns HTML template
   */
  function createMessageItem(message) {
    const messageDate = new Date(parseFloat(message.date));
    const time = timeDifference(messageDate);
    const template = `
        <article class="list-item white-bg" data-page="profile" data-id="${message.sender}">
          <div class="list-item-image">
            <img src="build/img/users/${message.sender}.jpg" alt="list-item-thumbnail">
          </div>
          <div class="list-item-texts">
            <h4 class="list-item-content">${message.content}</h4>
            <p class="list-item-date">${time}</p>
          </div>
        </article>
    `;

    return template;
  }

  /**
   * Puts chat messages to the DOM.
   *
   * @param {Array} messages - Array of the chats messages.
   */
  function populateChatMessages(messages) {
    let messageTemplate = [];

    for (let i = 0, len = messages.length; i < len; i++) {
      messageTemplate = createMessageItem(messages[i]);
      $('#chat-messages').append(messageTemplate);
    }
    initChatInput();
    initGotoProfile();
  }

  /**
   * Show all of the user's chats on the chats page.
   *
   * @param {Array} chats - List of all of the chats the current user has.
   */
  function populateChatList(chatData) {
    let chatTemplate;

    if (chatData.chats.length > 0) {
      for (let i = 0, len = chatData.chats.length; i < len; i += 1) {
        chatTemplate = createChatListItem(chatData.chats[i], chatData.messages[chatData.chats[i].chatId]);
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
        const event = events[i];
        event.addJoinBtn = false;
        eventTemplate = createEventListItem(event);
        $('#page-content').append(eventTemplate);
      }
    } else {
      $('.no-events-text').removeClass('hide');
    }
    initGotoEventBtns();
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
    initSearchEventBtns();
  }

  /**
   * Add interest correct classes depending on if they are loved or hated already.
   */
  function colorInterests() {
    const loves = mainCtrl.getCurrentUserData().loves;
    const hates = mainCtrl.getCurrentUserData().hates;

    for (let i = 0, len = loves.length; i < len; i++) {
      $(`[data-interest="${loves[i]}"]`).addClass('loved');
    }

    for (let i = 0, len = hates.length; i < len; i++) {
      $(`[data-interest="${hates[i]}"]`).addClass('hated');
    }
  }

  /**
   * Fills profilepages loves and hates lists.
   *
   * @param {Object} profileData - Users profile data.
   */
  function populateLovesHates(profileData) {
    const loves = profileData.loves;
    const hates = profileData.hates;

    for (let i = 0, len = loves.length; i < len; i++) {
      $('#loves-container').append(`<div class="interest">${loves[i]}</div)`);
    }

    for (let i = 0, len = hates.length; i < len; i++) {
      $('#hates-container').append(`<div class="interest">${hates[i]}</div)`);
    }
  }

  function updateChat(receivedMessage) {
    const message = createMessageItem(receivedMessage);
    $('#chat-messages').append(message);
  }

  /**
   * Returns value that tells how long ago the given date was from current date.
   * @param {Number} messageDate - Message date given in milliseconds from 1970
   * @returns {String} result - String which tell how long ago message was sent
   */
  function timeDifference(messageDate) {
    let result = '';
    const currentDate = new Date();
    const timeDiff = Math.floor((currentDate.getTime() - messageDate.getTime()) / 1000);

    if (timeDiff < 60) {
      result = 'Just now';
    } else if (timeDiff < 3600) {
      result = Math.round(timeDiff / 60);
      result = result === 1 ? '1 minute ago' : `${result} minutes ago`;
    } else if (timeDiff < 216000) {
      result = Math.round(timeDiff / 60 / 60);
      result = result === 1 ? '1 hour ago' : `${result} hours ago`;
    } else if (timeDiff < 1512000) {
      result = Math.round(timeDiff / 60 / 60 / 24);
      result = result === 1 ? '1 day ago' : `${result} days ago`;
    } else if (timeDiff < 10584000) {
      result = Math.round(timeDiff / 60 / 60 / 24 / 7);
      result = result === 1 ? '1 week ago' : `${result} weeks ago`;
    } else if (timeDiff < 42336000) {
      result = Math.round(timeDiff / 60 / 60 / 24 / 7 / 4);
      result = result === 1 ? '1 month ago' : `${result} months ago`;
    }

    return result;
  }

  /**
   * Initialize the given page.
   *
   * @param {String} page - Current page and possibly an id for an event or chat (i.e. "event_info:event1234").
   */
  function initPage(page) {
    let pageName;
    let pageId;

    initNavigationBtns();

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
        initSearchbar();
        // TODO: Filter by date function
        break;
      }
      case 'event_info': {
        mainCtrl.getEventInfo(pageId, fillEventInfo);
        initModalBtns();
        break;
      }
      case 'create_event': {
        initCreateEventBtns();
        initModalBtns();
        break;
      }
      case 'category_list': {
        mainCtrl.getCategories(addAllDropdowns);
        break;
      }
      case 'edit_interests': {
        mainCtrl.getCategories(addAllDropdowns);
        break;
      }
      case 'profile': {
        mainCtrl.getProfileInfo(pageId, fillProfileInfo);
        initProfileNav();
        if (pageId === 'own') {
          initInterestEdit();
          initProfInfoEdit();
        }
        break;
      }
      case 'chat_list': {
        mainCtrl.getChatList();
        break;
      }
      case 'chat': {
        currentChat = pageId;
        mainCtrl.getChatMessages(pageId, populateChatMessages);
        break;
      }
      case 'lander': {
        initLanderBtn();
      }
      default: {
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
    },
    updateChat(receivedMessage) {
      updateChat(receivedMessage);
    }
  };
};
