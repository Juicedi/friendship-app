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

  return {
    getUserInfo(user) {
      return getUserInfo(user);
    },
    getUserEvents() {
      return getUserEvents();
    }
  };
};
