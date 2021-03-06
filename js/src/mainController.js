const preload = (arrayOfImages) => {
  $(arrayOfImages).each(function () {
    $('<img/>')[0].src = this;
  });
};
preload([]);

/**
 * Runs the application and controls all of the application controllers
 * @return {Object} - All of the main controller functions that are shared with other controllers
 */
const MainController = (function () {
  let self = null;
  let pageCtrl;
  let dataCtrl;
  let navCtrl;

  /**
   * Initializes all of this applications controllers and gives itself to them as a parameter.
   */
  function initControllers() {
    pageCtrl = new PageController(self);
    dataCtrl = new DataController(self);
    navCtrl = new Navigation(self);
  }

  /**
   * Starts application by loading the first page.
   */
  function startApplication() {
    console.log('Starting application');
    // dataCtrl.setCurrentUser('testeri');
    dataCtrl.initTempData();
    navCtrl.getContent('lander');
  }

  return {
    init(that) {
      self = that;
      initControllers();
      startApplication();
    },

    // DataController functions
    getUserEvents() {
      dataCtrl.getUserEvents();
    },
    getSuggestedEvents() {
      dataCtrl.getSuggestedEvents();
    },
    getCurrentUserData() {
      return dataCtrl.getCurrentUserData();
    },
    getEventInfo(id, callback) {
      return dataCtrl.getEventInfo(id, callback);
    },
    getProfileInfo(userId, callback) {
      dataCtrl.getProfileInfo(userId, callback);
    },
    getCategories(callback) {
      return dataCtrl.getCategories(callback);
    },
    getSearchResults(searchInput) {
      dataCtrl.getSearchResults(searchInput);
    },
    getChatMessages(id, callback) {
      dataCtrl.getChatMessages(id, callback);
    },
    getChatList() {
      dataCtrl.getChatList();
    },
    createEvent(data) {
      dataCtrl.createEvent(data);
    },
    joinSquadChat(eventInfo) {
      dataCtrl.joinSquadChat(eventInfo);
    },
    leaveSquadChat(eventInfo) {
      dataCtrl.leaveSquadChat(eventInfo);
    },
    checkLoginInput(id, hash) {
      return dataCtrl.checkLoginInput(id, hash);
    },
    checkNameAvailability(name) {
      return dataCtrl.checkNameAvailability(name);
    },
    checkSquad(eventInfo) {
      return dataCtrl.checkSquad(eventInfo);
    },
    eventPrivacyToggle(id) {
      dataCtrl.eventPrivacyToggle(id);
    },
    addInterest(value, alignment) {
      dataCtrl.addInterest(value, alignment);
    },
    addAttendee(name) {
      dataCtrl.addAttendee(name);
    },
    attendEvent(id) {
      dataCtrl.attendEvent(id);
    },
    leaveEvent(id) {
      dataCtrl.leaveEvent(id);
    },
    removeEvent(id) {
      dataCtrl.removeEvent(id);
    },
    removeInterest(value, alignment) {
      dataCtrl.removeInterest(value, alignment);
    },
    removeTag(eventId, tag) {
      dataCtrl.removeTag(eventId, tag);
    },
    getInterestFilters() {
      return dataCtrl.getInterestFilters();
    },
    addFilter(item) {
      dataCtrl.addFilter(item);
    },
    removeFilter(item) {
      dataCtrl.removeFilter(item);
    },
    clearFilters() {
      dataCtrl.clearFilters();
    },
    changeEventOwner(id, newOwner) {
      dataCtrl.changeEventOwner(id, newOwner);
    },
    editProfileData(data, callback) {
      dataCtrl.editProfileData(data, callback);
    },
    sendMessage(id, message) {
      dataCtrl.sendMessage(id, message);
    },
    setCurrentUser(user) {
      dataCtrl.setCurrentUser(user);
    },
    signUp(data) {
      dataCtrl.addUser(data);
      navCtrl.getContent('edit_interests');
    },

    // Navigation functions
    getPrevPage() {
      return navCtrl.getPrevPage();
    },
    getCurrentPage() {
      return navCtrl.getCurrentPage();
    },
    changePage(page) {
      navCtrl.getContent(page);
    },

    // PageController functions
    initPage(page) {
      pageCtrl.initPage(page);
    },
    addAllDropdowns(categories) {
      pageCtrl.addAllDropdowns(categories);
    },
    populateOwnEvents(events) {
      pageCtrl.populateOwnEvents(events);
    },
    populateSearchEvents(events, location) {
      pageCtrl.populateSearchEvents(events, location);
    },
    populateChatMessages(messages) {
      pageCtrl.populateChatMessages(messages);
    },
    populateChatList(chats) {
      pageCtrl.populateChatList(chats);
    },
    populateSuggestedUsers(users) {
      pageCtrl.populateSuggestedUsers(users);
    },
    fillEventInfo(evtInfo) {
      pageCtrl.fillEventInfo(evtInfo);
    },
    updateChat(receivedMessage) {
      pageCtrl.updateChat(receivedMessage);
    }
  };
})();

// Launches the application after the page has loaded.
$(window).load(() => {
  $('.loading').fadeOut(500, () => {
    MainController.init(MainController);
    $('.loaded').fadeIn(1000);
  });
});
