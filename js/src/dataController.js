// 'use strict';
/**
 * Fetches and stores data for the other controllers.
 * @param {Object} mainCtrl - The applications main controller
 * @return {Object} - All of the controllers functions that are shared with other controllers
 */
const DataController = function (mainCtrl) {
  let userData = {};
  let allEvents = 'empty';
  const self = this;

  /**
   * Will filter througt all the events and put user event informations to a list.
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

  function filterSuggestedEvents(events) {
    let eventObjList = [];
    const keys = Object.keys(events);

    for (let i = 0, len = keys.length; i < len; i += 1) {
      if (
        userData.eventsAttending.indexOf(events[keys[i]].id) === -1
        && events[keys[i]].owner.indexOf(userData.id) === -1
      ) {
        eventObjList.push(events[keys[i]]);
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
      url: url,
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
        url: url,
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
    createEvent(data) {
      createEvent(data);
    },
    addAttendee(id) {
      addAttendee(id);
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
