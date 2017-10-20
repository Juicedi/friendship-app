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

  function getEventInfo() {
    const url = 'data/events.json';
    const currentPageInfo = mainCtrl.getCurrentPage();
    const eventId = currentPageInfo.split(':')[1];

    if (allEvents === 'empty') {
      $.ajax({
        url,
        success: (content) => {
          console.log(content[eventId]);
          mainCtrl.fillEventInfo(content[eventId]);
        },
        error: () => {
          console.log('Error: Couldn\'t get event informations');
        },
      });
    } else {
      mainCtrl.fillEventInfo(allEvents[eventId]);
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
          mainCtrl.populateSuggestedEvents(suggestedEvents);
        },
        error: () => {
          console.log('Error: Couldn\'t get event informations');
        },
      });
    } else {
      const suggestedEvents = filterSuggestedEvents(allEvents);
      console.log(suggestedEvents);
      mainCtrl.populateSuggestedEvents(suggestedEvents);
    }
  }

  function attendEvent(id) {
    const index = userData.eventsAttending.indexOf(id);

    if (index === -1) {
      userData.eventsAttending.push(id);
      allEvents[id].attending.push(userData.id);
    }
    console.log(userData.eventsAttending);
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
    getEventInfo(eventId) {
      return getEventInfo(eventId);
    },
    getSuggestedEvents() {
      return getSuggestedEvents();
    },
    attendEvent(id) {
      attendEvent(id);
    },
    leaveEvent(id) {
      leaveEvent(id);
    },
    removeEvent(id) {
      removeEvent(id);
    },
    changeEventOwner(id, newOwner) {
      changeEventOwner(id, newOwner);
    }
  };
};
