// 'use strict';
/**
 * Fetches and stores data for the other controllers.
 * @param {Object} mainCtrl - The applications main controller
 * @return {Object} - All of the controllers functions that are shared with other controllers
 */
const DataController = function (mainCtrl) {
  let userData = {};
  let categories = 'empty';
  let allEvents = 'empty';
  let allChats = 'empty';
  let allUsers = 'empty';
  let selectedFilters = [];

  function addFilter(item) {
    if (selectedFilters.indexOf(item) === -1) {
      selectedFilters.push(item);
    }
  }

  function removeFilter(item) {
    if (selectedFilters.indexOf(item) !== -1) {
      selectedFilters.splice(selectedFilters.indexOf(item), 1);
    }
  }

  function clearFilters() {
    selectedFilters = [];
  }

  function getCategories(callback) {
    const url = 'data/categories.json';

    if (categories === 'empty') {
      $.ajax({
        url,
        success: (content) => {
          categories = content;

          if (typeof callback !== 'undefined') {
            callback(content);
          }
          return content;
        },
        error: () => {
          console.log('Error: Couldn\'t get user informations');
        },
      });
    } else {
      if (typeof callback !== 'undefined') {
        callback(categories);
      }
      return categories;
    }
  }

  /**
   * Will filter througt all the events and put user event informations to a list.
   *
   * @param {Object} events - Object that has all event informations.
   * @return {Array} - List of only current user's events.
   */
  function filterUserEvents(events) {
    let eventObjList = [];
    for (let i = 0, len = userData.eventsAttending.length; i < len; i += 1) {
      eventObjList.push(events[userData.eventsAttending[i]]);
    }
    return eventObjList;
  }

  function checkLovesAndHates(user) {
    let result= false;

    for (let i = 0, len = userData.loves.length; i < len; i += 1) {
      if (user.loves.indexOf(userData.loves[i]) !== -1) {
        result = true;
      }
    }

    for (let i = 0, len = userData.hates.length; i < len; i += 1) {
      if (user.hates.indexOf(userData.hates[i]) !== -1) {
        result = true;
      }
    }

    return result;
  }

  function filterSuggestedUsers(users) {
    const userList = [];
    let found = 0;
    for (let i = 0; i < found || i < users.lenght; i += 1) {
      const match = checkLovesAndHates(users[i]);
      if (match) {
        userList.push(users[userData.eventsAttending[i]]);
        found += 1;
      }
    }
    return userList;
  }

  function filterChats(chats) {
    const ownChats = [];
    for (let i = 0, len = userData.chats.length; i < len; i += 1) {
      ownChats.push(chats[userData.chats[i]]);
    }
    return ownChats;
  }

  /**
   * Checks if selected filters match with the event tags
   *
   * @param {Object} event - Event object which tags will be checked
   * @returns {Boolean} - Returns true if filters matched with the event tags
   */
  function checkTags(event) {
    const tags = event.tags;
    let result = false;

    for (let i = 0, len = tags.length; i < len; i += 1) {
      if (selectedFilters.indexOf(tags[i]) !== -1) {
        result = true;
      }
    }

    return result;
  }

  /**
   * Filters events that are relevant to user
   * (This will be done mostly in the server when we get one)
   *
   * @param {Object} events - List of all events
   * @returns {Array} - Returns list of relevant event objects
   */
  function filterSuggestedEvents(events) {
    const eventObjList = [];
    const keys = Object.keys(events);

    for (let i = 0, len = keys.length; i < len; i += 1) {

      if (
        userData.eventsAttending.indexOf(events[keys[i]].id) === -1
        && events[keys[i]].owner !== userData.id
      ) {
        if (selectedFilters.length > 0) {
          if (checkTags(events[keys[i]])) {
            eventObjList.push(events[keys[i]]);
          }
        } else {
          eventObjList.push(events[keys[i]]);
        }
      }
    }
    return eventObjList;
  }

  /**
   * Gets user information from database.
   * @param {String} userName - Username which user information will be fetched.
   * @return {Object} - Returns all of the user information
   */
  function getUserInfo(username) {
    const url = 'data/users.json';
    $.ajax({
      url,
      success: (content) => {
        userData = content[username];
        console.log(userData);
        return userData;
      },
      error: () => {
        console.log('Error: Couldn\'t get user informations');
      },
    });
  }

  /**
   *  Gets current users event informations.
   *  @return {Array} - Returns an array of objects which have the event informations
   */
  function getUserEvents() {
    if (allEvents === 'empty') {
      const url = 'data/events.json';
      $.ajax({
        url,
        success: (content) => {
          allEvents = content;
          const events = filterUserEvents(content);
          console.log(events);
          mainCtrl.populateOwnEvents(events);
        },
        error: () => {
          console.log('Error: Couldn\'t get event informations');
        },
      });
    } else {
      const events = filterUserEvents(allEvents);
      console.log(events);
      mainCtrl.populateOwnEvents(events);
    }
  }

  function getEventInfo(eventId, callback) {
    const url = 'data/events.json';

    if (allEvents === 'empty') {
      $.ajax({
        url,
        success: (content) => {
          allEvents = content;
          console.log(content[eventId]);
          if (typeof callback === 'function') {
            mainCtrl.fillEventInfo(content[eventId]);
          } else {
            return content[eventId];
          }
        },
        error: () => {
          console.log('Error: Couldn\'t get event informations');
        },
      });
    } else if (typeof callback === 'function') {
      mainCtrl.fillEventInfo(allEvents[eventId]);
    } else {
      return allEvents[eventId];
    }
  }

  /**
   *  Gets current users event informations.
   *  @return {Array} - Returns an array of objects which have the event informations
   */
  function getSuggestedEvents() {
    if (allEvents === 'empty') {
      const url = 'data/events.json';
      $.ajax({
        url,
        success: (content) => {
          allEvents = content;
          const suggestedEvents = filterSuggestedEvents(content);
          console.log(suggestedEvents);
          mainCtrl.populateSearchEvents(suggestedEvents, '#suggested-events');
        },
        error: () => {
          console.log('Error: Couldn\'t get event informations');
        },
      });
    } else {
      const suggestedEvents = filterSuggestedEvents(allEvents);
      console.log(suggestedEvents);
      mainCtrl.populateSearchEvents(suggestedEvents, '#suggested-events');
    }
  }

  function getChatList() {
    if (allChats === 'empty') {
      const url = 'data/chats.json';
      $.ajax({
        url,
        success: (content) => {
          allChats = content;
          const ownChats = filterChats(content);
          console.log(ownChats);
          mainCtrl.populateChatList(ownChats);
        },
        error: () => {
          console.log('Error: Couldn\'t get event informations');
        },
      });
    } else {
      const ownChats = filterChats(allChats);
      console.log(ownChats);
      mainCtrl.populateChatList(ownChats);
    }
  }

  function getSearchResults(searchInput) {
    const inputLower = searchInput.toLowerCase();
    const keys = Object.keys(allEvents);
    const length = keys.length;
    const found = [];

    for (let i = 0; i < length; i += 1) {
      const id = keys[i];

      if (allEvents[id].title.toLowerCase() === inputLower) {
        found.push(allEvents[id]);
      } else if (allEvents[id].tags.indexOf(inputLower) !== -1) {
        found.push(allEvents[id]);
      }
    }
    mainCtrl.populateSearchEvents(found, '#search-results');
  }

  function attendEvent(id) {
    const index = userData.eventsAttending.indexOf(id);

    if (index === -1) {
      userData.eventsAttending.push(id);
      allEvents[id].attending.push(userData.id);
    }
    console.log(userData.eventsAttending);
  }

  function createEvent(data) {
    allEvents[data.id] = data;
    attendEvent(data.id);
    mainCtrl.changePage('own_events');
    console.log(allEvents);
  }

  function eventPrivacyToggle(id) {
    console.log('toggling privacy');
  }

  function addAttendee(name) {
    console.log('Added attendee' + name);
  }

  function leaveEvent(id) {
    const index = userData.eventsAttending.indexOf(id);
    userData.eventsAttending.splice(index, 1);
    console.log(userData.eventsAttending);
  }

  function removeEvent(id) {
    console.log('removed event' + id);
    leaveEvent(id);
    delete allEvents[id];
    console.log(allEvents);
  }

  function removeTag(id, tag) {
    const index = allEvents[id].tags.indexOf(tag);
    allEvents[id].tags.splice(index, 1);
  }

  function changeEventOwner(id, newOwner) {
    console.log('changed ' + id + ' event\'s owner to ' + newOwner);
    leaveEvent(id);
    allEvents[id].owner = newOwner;
  }

  return {
    getCategories(callback) {
      return getCategories(callback);
    },
    getUserInfo(user) {
      return getUserInfo(user);
    },
    getUserData() {
      return userData;
    },
    getUserEvents() {
      return getUserEvents();
    },
    getEventInfo(eventId, callback) {
      return getEventInfo(eventId, callback);
    },
    getSuggestedEvents() {
      return getSuggestedEvents();
    },
    getSearchResults(searchInput) {
      getSearchResults(searchInput);
    },
    getChatList() {
      getChatList();
    },
    createEvent(data) {
      createEvent(data);
    },
    addAttendee(id) {
      addAttendee(id);
    },
    getInterestFilters() {
      return selectedFilters;
    },
    addFilter(item) {
      addFilter(item);
    },
    removeFilter(item) {
      removeFilter(item);
    },
    clearFilters() {
      clearFilters();
    },
    attendEvent(id) {
      attendEvent(id);
    },
    leaveEvent(id) {
      leaveEvent(id);
    },
    eventPrivacyToggle(id) {
      eventPrivacyToggle(id);
    },
    removeEvent(id) {
      removeEvent(id);
    },
    removeTag(id, tag) {
      removeTag(id, tag);
    },
    changeEventOwner(id, newOwner) {
      changeEventOwner(id, newOwner);
    }
  };
};
