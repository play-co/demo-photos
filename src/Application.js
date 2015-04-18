/* global GC, Class, logger, bind */

import devkit.photos;

import ui.resource.Image;
import ui.View as View;
import ui.TextView as TextView;
import ui.widget.Spinner;
import ui.ImageScaleView;

exports = Class(GC.Application, function () {

  this.initUI = function () {

    this.btn1 = new TextView({
      superview: this.view,
      text: 'Camera',
      color: 'white',
      x: 20,
      y: 100,
      width: this.view.style.width - 40,
      height: 100,
      padding: 10,
      backgroundColor: '#AAF'
    });

    this.btn2 = new TextView({
      superview: this.view,
      text: 'Gallery',
      color: 'white',
      x: 20,
      y: 300,
      width: this.view.style.width - 40,
      height: 100,
      padding: 10,
      backgroundColor: '#AAF'
    });

    this.overlay = new View({
      superview: this.view,
      layout: 'box',
      widthPercent: '100%',
      heightPercent: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      opacity: 0,
      visible: false
    });

    this.preview = new ui.ImageScaleView({
      superview: this.view,
      x: 0,
      y: 500,
      width: this.view.style.width,
      height: this.view.style.height - 500,
      scaleMethod: 'contain',
      image: 'http://images.google.com/intl/en_ALL/images/srpr/logo11w.png'
    });

    this.spinner = new ui.widget.Spinner({
      superview: this.overlay,
      width: 100,
      height: 100,
      x: this.view.style.width / 2 - 50,
      y: this.view.style.height / 2 - 50
    });

    devkit.photos.on('photoLoading', function () {
      logger.info('photo loading...');
      this.spinner.style.visible = true;
      this.spinner.getAnimation().now({opacity: 1});
    });

    devkit.photos.on('photoLoaded', function () {
      logger.info('photo loaded!');
      this.spinner.getAnimation()
        .now({opacity: 0})
        .then(bind(this, function () {
          this.overlay.style.visible = false;
        }));
    });

    this.btn1.on('InputSelect', function () {
      logger.info('Requesting photo from camera');
      devkit.photos
        .getPhoto({source: 'camera'})
        .then(bind(this, 'showPhoto'));
    }.bind(this));

    this.btn2.on('InputSelect', function () {
      logger.info('Requesting photo from gallery');
      devkit.photos
        .getPhoto({source: 'gallery'})
        .then(bind(this, 'showPhoto'));
    }.bind(this));
  };

  this.showPhoto = function (res) {
    var img = new ui.resource.Image({url: 'data:' + res.data});
    this.preview.setImage(img);
  };
});
