// 'use strict';
/**
 * Fetches and stores data for the other controllers.
 * @param {Object} mainCtrl - The applications main controller
 * @return {Object} - All of the controllers functions that are shared with other controllers
 */
const DataController = function (mainCtrl) {
  let userData = {};
  const self = this;

  /**
   * Will filter througt all the events and put user event informations to a list.
   * @param {Object} events - Object that has all event informations.
   * @return {Array} - List of only current user's events.
   */
  function filterUserEvents(events) {
    let eventObjList = [];
    for(let i = 0, len = userData.eventsAttending.length; i < len; i += 1) {
      eventObjList.push(events[userData.eventsAttending[i]]);
    }
    return eventObjList;
  }

  function filterSuggestedEvents(events) {
    let eventObjList = [];
    const keys = Object.keys(events);

    for(let i = 0, len = keys.length; i < len; i += 1) {
      if (
        events[keys[i]].attending.indexOf(userData.id) === -1 
        && events[keys[i]].owner.indexOf(userData.id) === -1
      ){
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
    const url = 'data/events.json';
    $.ajax({
      url: url,
      success: (content) => {
        const events = filterUserEvents(content);
        console.log(events);
        mainCtrl.populateOwnEvents(events);
      },
      error: () => {
        console.log('Error: Couldn\'t get event informations');
      },
    });
  }

  function getEventInfo() {
    const url = 'data/events.json';
    const currentPageInfo = mainCtrl.getCurrentPage();
    const eventId = currentPageInfo.split(':')[1];
    $.ajax({
      url: url,
      success: (content) => {
        console.log(content[eventId]);
        mainCtrl.fillEventInfo(content[eventId]);
      },
      error: () => {
        console.log('Error: Couldn\'t get event informations');
      },
    });
  }

  /**
   *  Gets current users event informations.
   *  @return {Array} - Returns an array of objects which have the event informations
   */
  function getSuggestedEvents() {
    const url = 'data/events.json';
    $.ajax({
      url: url,
      success: (content) => {
        const suggestedEvents = filterSuggestedEvents(content);
        console.log(suggestedEvents);
        mainCtrl.populateSuggestedEvents(suggestedEvents);
      },
      error: () => {
        console.log('Error: Couldn\'t get event informations');
      },
    });
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
    }
  };
};
