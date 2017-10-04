const AnimationController = function () {
  /* global $:false, TweenLite: false, Ease: false, Power1: false, Power2: false, Linear: false */

  const self = this;

  const ua = window.navigator.userAgent;
  const msie = ua.indexOf('MSIE ');

  self.animation = function (anim, callback) {
    switch (anim) {
      case 'animatoin123':
        TweenLite.to(logo, 0.1, { scale: 1.1, ease: 'linear', transformOrigin: '50% 50%', force3D: false });
        break;
      default:
        break;
    }
  };

  return {
    animation(anim, callback) {
      self.animation(anim, callback);
    }
  };
};
