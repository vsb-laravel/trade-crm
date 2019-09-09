/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./resources/assets/js/app.js":
/*!************************************!*\
  !*** ./resources/assets/js/app.js ***!
  \************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_submiter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core/submiter */ "./resources/assets/js/core/submiter.js");
/* harmony import */ var _core_pagination__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./core/pagination */ "./resources/assets/js/core/pagination.js");
function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }



var debugEscape = false;
$(document).ajaxComplete(function (event, request, settings) {
  $('div.ui.dropdown:not(.dropdown-assigned),select.ui.dropdown:not(.dropdown-assigned)').addClass('dropdown-assigned').dropdown({
    clearable: true
  });
  $('.ui.dropdown input.search').attr('autocomplete', 'off').prop('readonly', true).on('focus', function () {
    this.removeAttribute('readonly');
  }); // $('.helper:not(.helper-assigned)').popup({hoverable:true}).addClass('helper-assigned');
});
$.ajaxSetup({
  headers: {
    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
  },
  statusCode: {
    401: function _() {
      console.debug('Session timeout');
      document.location.reload();
    }
  }
});
$('body').on('crm.loaded', function (e, crm) {
  var acceptedUrlAction = false;
  var re = /^.+#(\S+)=(\d+)$/ig,
      urlAction = re.exec(document.location.href);

  if (urlAction && !acceptedUrlAction) {
    var act = crm;
    var module = urlAction[1];
    var _id = urlAction[2];

    try {
      act[module].info(_id);
      document.title = "#".concat(_id, " CRM ").concat(system.app);
    } catch (e) {
      console.error(e);
    }

    acceptedUrlAction = true; // console.debug('urlAction',module,id,act, act[module] );
  }
});
var timestamp = new Date();
window.skymechanics = {
  jobj: {
    toJsonObjs: function toJsonObjs($c) {
      var ret = {},
          args = {};
      $c.find("input,select,textarea").each(function () {
        var n, v;
        n = $(this).attr("name");
        v = $(this).val();
        if ($(this).attr('type') == 'checkbox') v = $(this).is(':checked') ? "1" : '0'; // n = (n==undefined)?$(this).attr("name"):undefined;

        if (n != undefined && n.length) {
          var nn = n.split(/\./),
              argss = args;

          if (nn.length > 1) {
            args[nn[0]] = args[nn[0]] ? args[nn[0]] : {};
            args[nn[0]][nn[1]] = v;
          } else args[n] = v;
        }
      });
      ret[$c.attr('data-name')] = JSON.stringify(args);
      return ret;
    },
    toFormFields: function toFormFields(s, name) {
      var ret = '<div class="fields json-field" data-name="' + name + '">';

      try {
        var j = JSON.parse(s);

        for (var i in j) {
          ret += '<div class="four wide field">' + '<label>' + i + '</label>' + '<div class="ui input">' + '<input name="' + i + '" value="' + j[i] + '"/>' + '</div>' + '</div>';
        }
      } catch (e) {
        console.warn(e);
      }

      return ret + '</div>';
    }
  },
  __charts: {},
  removeChart: function removeChart(uid) {
    if (skymechanics.__charts[uid]) delete skymechanics.__charts[uid];
  },
  chart: function chart(uid) {
    this.first = typeof skymechanics.__charts[uid] == "undefined";
    var that = this.first ? this : skymechanics.__charts[uid]; // default values

    that.opts = $.extend({
      ctx: null,
      type: 'line',
      uid: 'chart',
      maxDataLength: 144,
      timeDiff: 60000,
      borderColor: 'rgba(33,187,149,1)',
      // backgroundColor: 'rgb(33,133,208)',
      data: {
        label: 'Line',
        keys: [],
        values: []
      },
      onUpdate: function onUpdate(p) {}
    }, arguments.length > 1 ? arguments[1] : {});
    if (!that.opts.ctx.length) return;

    if (that.first) {
      that.opts.ctx.parents('.ui.modal').attr('data-charts', uid);
    }

    that.chart = that.chart == undefined ? new Chart(that.opts.ctx.get(0).getContext('2d'), {
      type: that.opts.type,
      data: {
        labels: [],
        //that.opts.data.keys,
        datasets: [{
          label: that.opts.data.label,
          borderColor: that.opts.borderColor,
          data: [] //that.opts.data.values

        }]
      },
      options: {
        scales: {
          xAxes: [{
            type: 'time',
            time: {
              displayFormats: {
                quarter: 'hh:mm:ss'
              }
            }
          }]
        },
        zoom: {
          enabled: true,
          mode: 'y' // limits: {
          //     max: 10,
          //     min: 0.5
          // }

        }
      }
    }) : that.chart;
    that.supports = [];

    that.setLine = function (l, r) {
      var callbackf = arguments.length > 2 && typeof arguments[2] === "function" ? arguments[2] : function (h, l) {
        console.debug('fake callback function', h, l);
      };

      if (!this.supports.length) {
        var thatChart = this.chart,
            wasLevel = l,
            wasRange = l * 0.005,
            levelLine = {
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: l,
          borderColor: '#2185d0',
          borderWidth: 4,
          label: {
            enabled: true,
            position: 'right',
            backgroundColor: '#2185d0',
            content: l
          },
          draggable: true,
          onDragStart: function onDragStart(event) {
            wasLevel = event.subject.config.value; // console.debug(this);
          },
          onDrag: function onDrag(event) {
            var nlevel = event.subject.config.value,
                newLine = this;
            rangeDownLine.value = nlevel - nlevel * 0.005;
            rangeUpLine.value = nlevel + nlevel * 0.005;
            newLine.value = nlevel;
            newLine.label.content = nlevel.toFixed(0);
            callbackf(nlevel, (100 * wasRange / nlevel).toFixed(2));
            thatChart.update();
          },
          onDragEnd: function onDragEnd(event) {
            wasLevel = event.subject.config.value;
          }
        },
            rangeDownLine = {
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: l - l * 0.005,
          borderWidth: 6,
          borderColor: '#ccc',
          label: {
            enabled: false,
            position: 'right',
            backgroundColor: '#aaa',
            content: "<<"
          },
          draggable: false,
          onDragStart: function onDragStart(event) {
            wasRange = wasLevel - event.subject.config.value;
          },
          onDrag: function onDrag(event) {
            var nlevel = event.subject.config.value,
                newLine = this; // if(firstDrag){console.debug(event,this);firstDrag=false;}

            newLine.value = nlevel;
            wasRange = wasLevel - event.subject.config.value;
            rangeUpLine.value = wasLevel + wasRange;
            callbackf(wasLevel, 100 * wasRange / wasLevel);
            thatChart.update();
          },
          onDragEnd: function onDragEnd(event) {// wasRange = wasLevel-event.subject.config.value;
          }
        },
            rangeUpLine = {
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: l + l * .005,
          borderWidth: 6,
          borderColor: '#ccc',
          label: {
            enabled: false,
            position: 'right',
            backgroundColor: '#ccc',
            content: "<<"
          },
          draggable: false,
          onDragStart: function onDragStart(event) {
            wasRange = event.subject.config.value - wasLevel;
          },
          onDrag: function onDrag(event) {
            var nlevel = event.subject.config.value,
                newLine = this;
            newLine.value = nlevel;
            wasRange = event.subject.config.value - wasLevel;
            rangeDownLine.value = wasLevel - wasRange;
            callbackf(wasLevel, 100 * wasRange / wasLevel);
            thatChart.update();
          }
        };
        this.supports.push(rangeUpLine);
        this.supports.push(rangeDownLine);
        this.supports.push(levelLine);
        this.chart.options.annotation = {
          events: ['click'],
          annotations: this.supports
        };
        this.chart.update();
      }
    };

    that.removeSupports = function () {
      this.supports.pop();
      this.supports.pop();
      this.supports.pop();
      this.chart.update();
    };

    that.setLineOld = function (l, r) {
      if (this.supports.length < 2) {
        this.chart.data.datasets.push({
          label: 'Level tune',
          type: 'line',
          fill: false,
          pointRadius: 0,
          borderWidth: 3,
          borderColor: 'rgba(187,33,149,1)',
          data: []
        });
        this.chart.data.datasets.push({
          label: 'High range',
          type: 'line',
          fill: false,
          pointRadius: 0,
          data: []
        });
        this.chart.data.datasets.push({
          label: 'Low range',
          type: 'line',
          fill: false,
          pointRadius: 0,
          data: []
        });
      } else {
        this.chart.data.datasets[1].data = [];
        this.chart.data.datasets[2].data = [];
        this.chart.data.datasets[3].data = [];
      }

      for (var i in this.chart.data.datasets[0].data) {
        this.chart.data.datasets[1].data.push(l);
        this.chart.data.datasets[2].data.push(l + r);
        this.chart.data.datasets[3].data.push(l - r);
      }

      this.chart.update();
    };

    that.removeSupportsOld = function () {
      for (var i = 1; i < this.chart.data.datasets; ++i) {
        this.removeDataset(i);
      }
    };

    that.removeDataset = function (i) {
      delete this.chart.data.datasets[i];
      this.chart.update();
    };

    that.set = function (l, d) {
      // console.debug('set data',l,d);
      l.setTime(l.getTime() - this.opts.timeDiff);
      if (!this.chart) return;

      if (this.chart.data.labels.length >= this.opts.maxDataLength) {
        this.chart.data.labels.shift();

        for (var i in this.chart.data.datasets) {
          this.chart.data.datasets[i].data.shift();
        }
      }

      this.chart.data.labels.push(l);
      this.chart.data.datasets[0].data.push(d);

      for (var i = 1; i < this.chart.data.datasets.length; ++i) {
        this.chart.data.datasets[i].data.push(this.chart.data.datasets[i].data[0]);
      }

      this.chart.update();
      this.opts.onUpdate(d);
    };

    that.update = function (d) {
      if (!this.chart) return;

      var td = new Date(),
          timedUpdate = function timedUpdate(that, l, d) {
        that.set(l, d);
      };

      td = td.getTime() + td.getTimezoneOffset() * 1000 * 60 - this.opts.timeDiff;
      td = td - td % 60000;

      for (var i in d.keys) {
        if ($.inArray(d.keys[i].getTime(), that.opts.data.keys) == -1 && d.keys[i] > td) {
          if (d.keys[i].getTime() - td > 0) {
            setTimeout(timedUpdate, d.keys[i].getTime() - td, this, d.keys[i], d.values[i]);
            console.debug('next price in ' + (d.keys[i].getTime() - td));
          }

          that.opts.data.keys.push(d.keys[i].getTime());
          that.opts.data.values.push(d.values[i]);
        } else if (this.first) this.set(d.keys[i], d.values[i]);
      }
    };

    that.update(that.opts.data);
    skymechanics.__charts[uid] = that;
    that.first = false;
    $(document).trigger('skymechanics:chartLoaded', [uid]);
    return that;
  },
  _statdata: {},
  getDataByField: function getDataByField(s, field, v) {
    if (this._statdata[s] == undefined) return undefined;
    if (this._statdata[s][0] == undefined) return undefined;
    if (this._statdata[s][0][field] == undefined) return undefined;

    for (var i in this._statdata[s]) {
      if (this._statdata[s][i][field] == v) return this._statdata[s][i];
    }

    return undefined;
  },
  getDataById: function getDataById(s, id) {
    return skymechanics.getDataByField(s, "id", id);
  },
  getDataByName: function getDataByName(s, name) {
    return skymechanics.getDataByField(s, "name", id);
  },
  getDataByTitle: function getDataByTitle(s, name) {
    return skymechanics.getDataByField(s, "title", id);
  },
  reload: function reload() {
    $('.ui.input.calendar:not(.calendar-assigned)').calendar({
      firstDayOfWeek: 1,
      monthFirst: false,
      ampm: false,
      formatter: {
        datetime: function datetime(date, settings) {
          if (!date) return;
          return date.getFullYear() + '-' + (1 + date.getMonth()).leftPad() + '-' + date.getDate().leftPad() + ' ' + date.getHours().leftPad() + ':' + date.getMinutes().leftPad() + ":" + date.getSeconds().leftPad();
        }
      }
    }).addClass('calendar-assigned');
    $('.ui.input.calendar-notime:not(.calendar-assigned)').calendar({
      type: 'date',
      firstDayOfWeek: 1,
      monthFirst: false,
      ampm: false,
      formatter: {
        datetime: function datetime(date, settings) {
          if (!date) return;
          return date.getFullYear() + '-' + (1 + date.getMonth()).leftPad() + '-' + date.getDate().leftPad();
        }
      },
      onChange: function onChange(d, t, m) {
        $(this).find('.requester').val(t).change();
      }
    }).addClass('calendar-assigned');
    $(".loadering:visible.priorited:not(.loadering-assigned)").each(function () {
      new skymechanics.loader(this, Fresher);
    }).addClass('loadering-assigned');
    $(".loadering:visible:not(.loadering-assigned)").each(function () {
      new skymechanics.loader(this, Fresher);
    }).addClass('loadering-assigned');
    $('div.ui.dropdown:not(.dropdown-assigned),select.ui.dropdown:not(.dropdown-assigned)').addClass('dropdown-assigned').dropdown({
      clearable: true
    });
    $('.ui.dropdown input.search').attr('autocomplete', 'off').prop('readonly', true).on('focus', function () {
      this.removeAttribute('readonly');
    }); // $(".submiter:not(.submiter-assigned)").each(function(e){ skymechanics.submiter(this); }).addClass('submiter-assigned');

    $(".submiter:not(.submiter-assigned)").each(function (e) {
      new _core_submiter__WEBPACK_IMPORTED_MODULE_0__["VUISubmiter"](this);
    }).addClass('submiter-assigned');
    $(".switcher-a:not(.switcher-a-assgined)").each(function () {
      $(this).checkbox({
        onChange: function onChange(e) {
          // if(e)e.preventDefault();
          // if(e)e.stopPropagation();
          var $checker = $(this);
          var $that = $checker.parent('.switcher-a');
          var $submit = $that.parent('.submiter').find('.submit');
          var val = $that.checkbox('is checked') ? 1 : 0;
          $that.data('rollback-value', val == 1 ? 0 : 1);
          $that.addClass('need-rollback'); // $checker.val(val);
          // $checker.data("value",val);

          $submit.trigger("click", [e]);
          console.debug('Switcher-a changed', $that, $checker, $submit);
        }
      });
    }).addClass("switcher-a-assgined");
    $(".switcher:not(.switcher-assgined)").addClass("switcher-assgined").on('change', function (e) {
      var $that = $(this);
      var $submitter = $that.parent('.submiter'); // console.debug('switcher',$that,$submitter);

      if (!$submitter.length) return;
      var val = $that.is(':checked') ? 1 : 0;
      $that.addClass('changed');
      $that.data('rollback-value', val == 1 ? 0 : 1);
      $that.val(val);
      $that.data("value", val);
      $submitter.find('.submit').trigger("click", [e]);
    });
    $(".check-all").prop("checked", false).next('label').html('');
    $(".check-all:not(.checkall-assigned)").on("change", function (e) {
      e.preventDefault();
      console.log('check-all change', $(this).parent());
      var v = $(this).is(':checked') ? true : false,
          list = $(this).attr("data-list");
      $('[data-name=' + list + ']').prop("checked", v).change(); // $(this).next('label').html(v?`${$('[data-name='+list+']').length}`:'');

      $(this).parent().find('label').html(v ? "".concat($('[data-name=' + list + ']').length) : ''); // $(this).parent().checkbox($(this).is(':checked')?`set unchecked`:'set checked');
    }).addClass('checkall-assigned');
    $(".requester:not(.requester-assigned)").each(function () {
      new skymechanics.requester($(this));
    }).addClass('requester-assigned');
    $('.okclose:not(.okclose-assigned)').addClass('okclose-assigned').on('click', function (e) {
      e.preventDefault();
      $(this).parents('.modal').find('.globe.submiter .submit:not(.clicked)').click().addClass('clicked').delay(800).removeClass('clicked');
    });
    $('.bulker:not(.bulker-assigned)').addClass('bulker-assigned').each(function () {
      skymechanics.bulk(this);
    });
    $('.richtext-editor:not(.richtext-editor-assigned)').each(function () {
      var element_id = $(this).attr('id');
      var outer = $(this).attr('data-id');
      var size = $(this).attr('data-size');

      if (element_id) {
        var editor = pell.init({
          element: document.getElementById(element_id),
          onChange: function onChange(html) {
            // document.getElementById('html-output').textContent = html
            var $outer = $("#".concat(outer));
            if ($outer.val) $outer.val(html);
            if ($outer.html) $outer.html(html);
          },
          defaultParagraphSeparator: 'p',
          styleWithCSS: true,
          actions: ['bold', 'italic', 'underline', 'heading1', 'heading2', 'olist', 'ulist', {
            name: 'justerfy',
            icon: '<i class="ui align left icon"></i>',
            title: 'Custom Action',
            result: function result() {
              return pell.exec('justifyLeft');
            }
          }, {
            name: 'center',
            icon: '<i class="ui align center icon"></i>',
            title: 'Custom Action',
            result: function result() {
              return pell.exec('justifyCenter');
            }
          }, {
            name: 'justerfy',
            icon: '<i class="ui align justify icon"></i>',
            title: 'Custom Action',
            result: function result() {
              return pell.exec('justifyFull');
            }
          }, {
            name: 'justerfy',
            icon: '<i class="ui align right icon"></i>',
            title: 'Custom Action',
            result: function result() {
              return pell.exec('justifyRight');
            }
          }, {
            name: 'image',
            result: function result() {
              var url = window.prompt('Enter the image URL');
              if (url) pell.exec('insertImage', url);
            }
          }, {
            name: 'link',
            result: function result() {
              var url = window.prompt('Enter the link URL');
              if (url) pell.exec('createLink', url);
            }
          }],
          classes: {
            actionbar: 'ui secondary top attached menu',
            button: 'ui item',
            content: "ui segment bottom attached ".concat(size, " contenteditable"),
            selected: 'active'
          }
        });
      }
    }).addClass('richtext-editor-assigned');
    $(".ui.tabular:not(.tab-assigned)").addClass("tab-assigned").find(".item").tab({
      onVisible: function onVisible() {
        console.debug('Tab onVisible', arguments, $(".loadering:visible:not(.loadering-assigned)"));
        skymechanics.reload();
      }
    }); // $('.google2fa-otp:not(.masked)').addClass('masked').inputmask("999 999");
  },
  countdown_element: undefined,
  countdown_si: undefined,
  countdown: function countdown() {
    var $that = arguments.length ? arguments[0] : $(this),
        f = function f() {
      if (!skymechanics.countdown_element) return;
      var $that = skymechanics.countdown_element,
          v = parseInt($that.prop('value')) - 1,
          p = {
        h: parseInt(v / 3600),
        m: parseInt(v % 3600 / 60),
        s: parseInt(v % 60)
      };

      if (v < 0) {
        skymechanics.si ? clearInterval(skymechanics.si) : {};
        return;
      }

      $that.text(p.h + ':' + leftZeroPad(p.m) + ':' + leftZeroPad(p.s));
      $that.prop('value', v);
    };

    skymechanics.si ? clearInterval(skymechanics.si) : {};
    skymechanics.countdown_element = $that;
    skymechanics.si = setInterval(f, 1000);
  },
  _actions: {},
  _loaders: [],
  _requests: [],
  _needCached: ['country'],
  _cached: {},
  _type: "get",
  _switchOff: false,
  refresher: function refresher() {
    skymechanics._actions = []; // skymechanics._switchOff = ("undefined"!=typeof(useFresher))?!useFresher:skymechanics._switchOff;

    this.tick = 0;

    this.bind = function () {
      var bnd = $.extend({
        refresh: 1,
        last: new Date().getTime(),
        run: function run() {}
      }, arguments.length ? arguments[0] : {});
      skymechanics._actions[bnd.guid] = bnd; // skymechanics._actions.push(bnd);
    };

    this.unbind = function (uid) {
      if (skymechanics._actions[uid]) delete skymechanics._actions[uid];
    };

    this.execute = function () {
      if (skymechanics._switchOff) return; // if(skymechanics._actions.length==0)return;

      var dt = new Date().getTime();

      for (var i in skymechanics._actions) {
        if (skymechanics._actions[i].refresh == 0) continue; // console.debug("refresher #"+i,(dt-skymechanics._actions[i].last),'>',skymechanics._actions[i].refresh);

        if (dt - skymechanics._actions[i].last > skymechanics._actions[i].refresh) {
          var args = skymechanics._actions[i].arguments == undefined ? null : skymechanics._actions[i].arguments; // console.debug("refresher executing...",skymechanics._actions[i].run,args);

          skymechanics._actions[i].run(args);

          skymechanics._actions[i].last = dt;
        } // skymechanics._switchOff=true;

      }
    };

    setInterval(this.execute, 1000);

    if (skymechanics._switchOff) {
      // console.clear();
      console.info('Manual refresher is in work');
      var currentRefresher = this;
      $('<button style="position:fixed;display:block;z-index:10000;top:0;height:36px;width:88px;right:0;line-height:36px;padding:0 4px;background-color:rgba(0,0,0,.5);color:rgba(255,255,255,.6);">On</button>').appendTo('body').on('click', function () {
        console.clear();
        skymechanics._switchOff = !skymechanics._switchOff;
        $(this).text(skymechanics._switchOff ? 'On' : 'Off');
      });
    }
  },
  touch: function touch(uid) {
    var _arguments = arguments;
    return new Promise(function (resolve, reject) {
      try {
        var obj = _arguments.length > 1 ? _arguments[1] : 'loader';

        switch (obj) {
          case 'loader':
            // if(skymechanics._loaders[uid] && !skymechanics._loaders[uid].opts.fetching)skymechanics._loaders[uid].execute().then(()=>{ resolve(); });
            if (skymechanics._loaders[uid]) skymechanics._loaders[uid].execute().then(function () {
              resolve();
            });
            break;

          default:
            reject("No loader found", uid);
            break;
        }
      } catch (e) {
        reject(e);
      }
    });
  },
  loader: function loader() {
    var container = arguments.length ? $(arguments[0]) : null;

    var _frshr = arguments.length ? $(arguments[1]) : new skymechanics.refresher();

    this.opts = {
      container: container,
      autostart: false,
      fetching: false,
      refresh: 0
    };
    if (container == null) return;
    var attrs = {
      uid: container.attr("data-id") == undefined ? container.attr("data-name") : container.attr("data-id"),
      func: container.attr("data-function"),
      autostart: container.attr("data-autostart") == "true",
      needLoader: container.attr("data-need-loader") == "true",
      action: container.attr("data-action"),
      refresh: container.attr("data-refresh") != undefined ? container.attr("data-refresh") : 0,
      trigger: container.attr("data-trigger") != undefined ? container.attr("data-trigger") : false,
      onchange: container.attr("data-onchange") != undefined ? container.attr("data-onchange") : false,
      request: container.attr("data-request") != undefined ? container.attr("data-request") : false,
      sort: container.attr("data-sort") != undefined ? container.attr("data-sort") : false,
      callback: container.attr("data-request-function") != undefined ? container.attr("data-request-function") : false,
      callbackOnChange: container.attr("data-function-change") != undefined ? container.attr("data-function-change") : false,
      data: {}
    };
    this.opts = $.extend(this.opts, attrs);
    this.opts = $.extend(this.opts, arguments.length > 1 ? arguments[1] : null);
    var isDropdown = this.opts.container.hasClass('ui') && this.opts.container.hasClass('dropdown');

    var execChange = function execChange(f) {
      console.debug('execChange', f);

      try {
        eval(f);
      } catch (e) {
        console.warn('error eval callbackOnChange', f, e);
      }
    }; // console.debug(this.opts);


    this.currentRequest = null;
    var that = this;

    this.execute = function () {
      // return new Promise( (resolve,reject) => {
      var that = this;

      if (that.currentRequest != null) {
        that.currentRequest.abort(); // console.debug('loader previouse execute aborted',that.currentRequest);

        that.currentRequest = null;
      }

      try {
        var opts = arguments.length ? arguments[0] : this.opts,
            rdata = null;
        if (opts == undefined || opts.container == undefined) return;
        if (opts.fetching && opts.fetching == true) return;

        var successCallback = function successCallback(d, opts, name) {
          if (opts.container.prop('tagName') == 'SELECT') {
            var $c = opts.container,
                title = opts.container.attr('data-title') != undefined ? opts.container.attr('data-title') : 'Lists';
            opts.container.html('');
            opts.container.append('<option value="false">' + title + '</option>');

            for (var i in d.data != undefined ? d.data : d) {
              var row = d.data != undefined ? d.data[i] : d[i];
              var name = row.title ? row.title : row.name ? row.name : '',
                  value = row.id == undefined ? name : row.id;
              name = row.surname ? name + ' ' + row.surname : name; // console.debug(title,name,value);

              opts.container.append('<option value="' + value + '">' + name + '</option>');
            }

            skymechanics._statdata[opts.container.attr("data-name")] = d;

            if (opts.callbackOnChange !== false) {
              opts.container.on('change keyup', function () {
                eval(opts.callbackOnChange);
              });
            }
          } else if (opts.container.prop('tagName') == 'DIV' && opts.container.hasClass('ui') && opts.container.hasClass('selection') && opts.container.hasClass('dropdown')) {
            var $c = opts.container,
                title = $c.attr('data-title') != undefined ? $c.attr('data-title') : 'Lists',
                name = $c.attr('data-name'),
                selected = $c.attr('data-value'); // var $e = $('<input class="requester" type="hidden" name="'+name+'" data-name="'+name+'">').appendTo($c);

            $c.text('');
            var $e = $('<input type="hidden" name="' + name + '" data-name="' + name + '">').appendTo($c);

            if ($c.attr('data-trigger') && $c.attr('data-trigger')) {
              $e.attr('data-trigger', $c.attr('data-trigger')).attr('data-target', $c.attr('data-target'));
            }

            if (title != "false") $c.append('<i class="dropdown icon"></i><div class="default text">' + title + '</div>');
            var $m = $('<div class="menu"></div>').appendTo($c);
            if (title != "false") $m.append('<div class="item" data-value="false">' + title + '</div>');

            for (var i in d.data != undefined ? d.data : d) {
              var row = d.data != undefined ? d.data[i] : d[i];
              var code = row.code;
              var name = row.title ? row.title : row.name ? row.name : '',
                  value = row.id == undefined ? name : row.id;
              var disabled = false;

              if (row.enabled != undefined) {
                disabled = row.enabled == 0;
              } // name = (row.surname)?name+' '+row.surname:name;


              var $item = $("<div class=\"".concat(disabled ? 'disabled ' : '', "item\" data-value=\"").concat(value, "\"></div>")).appendTo($m);
              $item.append('<span class="text">' + (code ? code : name) + '</span>');
              if (code) $item.append('<div class="description">' + name + '</div>');else if (row.rights) $item.append('<span class="description">' + row.rights.name + '</span>');else if (row.title && row.name) $item.append('<div class="description">' + row.name + '</div>');
            } // console.debug("loadering::dropdown.onChange",opts.callbackOnChange);


            var onChange = opts.callbackOnChange !== false ? function (v, t, $choice) {
              execChange(opts.callbackOnChange);
            } : function () {};
            opts.container.dropdown({
              onChange: onChange
            });
            opts.container.dropdown('set selected', selected);
            skymechanics._statdata[$c.attr("data-name")] = d;
          }

          var callbackf = getFunctionByName(opts.func);
          callbackf(opts.container, d, name);
        };

        opts.action = opts.container.attr('data-action');

        if (opts.sort !== false) {
          rdata["sort"] = {};
          var srt = opts.sort.split(/\,/g);

          for (var i in srt) {
            var a = srt[i].split(/\s/g);
            rdata["sort"][a[0]] = a[1];
          }
        }

        rdata = $.extend(rdata, opts.data);
        $("[data-target=".concat(that.opts.uid, "].requester.dynamic")).each(function () {
          var name = $(this).data('name');
          var value = $(this).val();
          if ((value == "undefined" || value == null || value.length == 0) && rdata[name]) delete rdata[name];else rdata[name] = value;
        });
        var urlAction = opts.action;
        urlAction = urlAction.replace(/=\{([^\}]+)\}/g, function (m, p, o, s) {
          if ($(p).length) {
            return '=' + $(p).val();
          } else if (p == "data-id") return '=' + $(that).attr("data-id");else if (p.match(/timestamp_.+/i)) {
            //timestamps
            var now = new Date(),
                now = now.getTime(),
                matches = p.match(/timestamp_(\d+)(\w+)/i);
            if (p == 'timestamp_now') return '=' + now;else if (p == 'timestamp_today') {
              now -= now % (24 * 60 * 60 * 1000);
              return '=' + now;
            } else if (matches && matches.length > 2) {
              var c = parseInt(matches[1]),
                  t = matches[2],
                  d = 1000;

              switch (t) {
                case 'minute':
                  d *= 60;
                  break;

                case 'hour':
                  d *= 60 * 60;
                  break;

                case 'day':
                  d *= 60 * 60 * 24;
                  break;
              }

              console.debug('timestamp', new Date(now - c * d));
              return '=' + (now - c * d);
            }
          } else {
            if (p.match(/\./ig)) {
              var f = p.split(/\./g),
                  v = window; // if(p=='crm.finance.__currentPeriod')console.debug(f);

              for (var i in f) {
                v = v[f[i]];
                if (v == undefined) break;
              }

              if (v) {
                return '=' + v;
              }
            }

            return '=' + $('[data-name="' + p + '"]').val();
          }
        });
        var $loader = $('.progress-loader'); // aditional rdata checks

        if (rdata) {
          rdata['per_page'] = rdata.per_page || $.cookie('per_page');
          rdata['per_page'] = rdata['per_page'] ? rdata['per_page'].replace(/^(\d+).*/, "$1") : 15;
        }

        if (rdata && rdata.excel && rdata.excel == "1") {
          var udata = urlAction.match(/\?/) ? "&" : '?';
          Object.keys(rdata).map(function (k) {
            udata += "".concat(k, "=").concat(encodeURI(rdata[k]), "&");
          });
          document.location.href = urlAction + udata;
        } else {
          var precontainer = opts.container.parents('.for-loadering');

          if (opts.needLoader) {
            if (precontainer.length == 0) {
              precontainer = $("<div class=\"for-loadering\"><div class=\"ui inverted dimmer\" ><div class=\"ui indeterminate text loader\" style=\"position:absolute;top:2em;\">".concat(__('crm.fetching'), "</div></div></div>"));
              var $prnt = opts.container.prop('tagName') == 'TBODY' ? opts.container.parent() : opts.container;
              console.debug('Loader added', opts.container.prop('tagName'), $prnt);
              precontainer = precontainer.insertAfter($prnt);
              precontainer.append($prnt.detach());
            }
          }

          var dropdownLoaderingIcon = null;
          that.currentRequest = $.ajax({
            url: urlAction,
            type: skymechanics._type,
            data: rdata,
            beforeSend: function beforeSend() {
              opts.fetching = true;
              precontainer.find('.dimmer').addClass('active');

              if (isDropdown) {
                opts.container.addClass('loading').html("<i class=\"ui dropdown icon\"></i>");
              }
            },
            complete: function complete() {
              opts.fetching = false;

              if (opts.needLoader) {
                console.debug('Loader removed');
                precontainer.find('.dimmer').removeClass('active'); //.find('.text.loadoer').remove();
              }

              if ($loader.length) $loader.fadeOut().progress({
                percent: 0
              }).removeClass('inuse');

              if (isDropdown) {
                if (dropdownLoaderingIcon) dropdownLoaderingIcon.remove();
                opts.container.removeClass('loading');
              } // if(dropdownLoaderingIcon){
              //     dropdownLoaderingIcon.remove();
              //     dropdownLoaderingIcon = $(`<i class="ui green checkmark icon"></i>`).insertAfter(opts.container);
              // }

            },
            success: function success(d, x, s) {
              skymechanics._requests[opts.action] = d;

              try {
                successCallback(d, opts, opts.uid);
              } catch (e) {
                console.error(opts, e);
              }

              if (isDropdown) {
                opts.container.removeClass('loading').addClass('success');
              }
            },
            error: function error() {
              if (isDropdown) {
                opts.container.removeClass('loading').addClass('error');
              }
            }
          });
        }
      } catch (e) {
        console.error(e);
      } // });


      return new Promise(function (resolve, reject) {
        resolve();
      });
    };

    this.execute = this.execute.bind(this);

    if (this.opts.autostart) {
      var _that = this;

      _that.execute(_that.opts);

      $('#body_event_trigger').on('page:show', function (e, $p) {
        e.preventDefault(); // console.debug('page showed',$.contains($p.page,that.opts.container),$p.page.find(that.opts.container).length,that.opts.func);
        // console.debug('page showed',e,$p.page,that.opts.func);

        if ($.contains($p.page, _that.opts.container) || $p.page.find(_that.opts.container).length && _that.opts.func) {
          // console.debug('page showed', that.opts.func,$p);
          _that.execute(_that.opts);
        }
      });
      $('#body_event_trigger').on('page:noactivity', function () {
        if (_that.opts.container.is(':visible')) {
          console.debug('container is visible', _that.opts.func);

          _that.execute(_that.opts);
        }
      }); // if(container.is(':visible')) {
      //     that.execute(that.opts);
      // }
    }

    skymechanics._loaders[this.opts.uid] = this;
    return this;
  },
  requester: function requester() {
    var $that = arguments.length ? arguments[0] : $(this);
    var trigger = $that.attr("data-trigger");
    var initHandler = false;

    var getRequesterValue = function getRequesterValue($that) {
      var val = $that.attr('type') == "checkbox" ? $that.is(':checked') ? 1 : 0 : $that.attr("data-value") != undefined ? $that.attr("data-value") : $that.val();

      if ($that.attr('type') == 'date') {
        val = Date.parse(val);
        val = parseInt(val / 1000);
      }

      if ($that.hasClass('dropdown')) {
        val = $that.dropdown('get value');
      }

      return val;
    };

    var handler = function handler() {
      var act_uids = $that.attr("data-target").split(/,/);
      var name = $that.attr("data-name");
      var val = getRequesterValue($that);
      var depends = $that.data('depends') ? $that.data('depends').split(/\s*,\s*/) : [];

      var _loop = function _loop() {
        var act_uid = act_uids[i];
        var ld = skymechanics._loaders[act_uid].opts.data;
        if (val.length == 0) delete ld[name];else ld[name] = val;
        depends.map(function (depend, i) {
          var $depend = $("".concat(depend));
          var dname = $depend.data('name');
          var value = getRequesterValue($depend);
          if (value.length == 0) delete ld[dname];else ld[dname] = value;
        });

        skymechanics._loaders[act_uid].execute();

        if ($that.attr('data-name') == 'excel') {
          $that.val('false');
          skymechanics._loaders[act_uid].opts.data.excel = "false";
        }
      };

      for (var i in act_uids) {
        _loop();
      }
    };

    if ($that.val() != undefined) {
      if (trigger == "keyup") {
        $that.on(trigger, function (e) {
          e.preventDefault();
          if (!(e.keyCode >= 48 & e.keyCode <= 90 || e.keyCode >= 96 & e.keyCode <= 105 || $.inArray(e.keyCode, [188, 189, 110, 111, 8, 46]) != -1)) return false;
          if (initHandler) clearTimeout(initHandler);
          initHandler = setTimeout(function () {
            // console.debug('Requester triggered with delay',handler);
            handler();
          }, 600);
        });
      } else if (trigger == "enter") {
        $that.on('keyup', function (e) {
          e.preventDefault();
          if (e.keyCode == 13) handler();
        });
      } else $that.on(trigger, function (e) {
        e.preventDefault();
        handler();
      });
    }
  },
  submiterHandler: function submiterHandler(that) {
    console.log('submiterHandler', that);
    $(that).data('autostart', true);
    return new _core_submiter__WEBPACK_IMPORTED_MODULE_0__["VUISubmiter"](that);
  },
  submiter: function submiter() {
    var container = arguments.length ? $(arguments[0]) : null;

    var checkvals = function checkvals($c) {
      var ret = true;
      $c.find('input,textarea,select').filter('[required]:visible').each(function () {
        if (!ret) return;

        if ($(this).val().length == 0) {
          $(this).addClass('value-empty').focus();
          ret = false;
        } else $(this).removeClass('value-empty');
      });
      $c.find('input').each(function () {
        if (!ret) return;
        var min = parseFloat($(this).attr('min')),
            max = parseFloat($(this).attr('max')),
            val = parseFloat($(this).val()),
            $that = $(this),
            $alerter = $that.next('.alerter'),
            popup = $(this).attr('data-validate-text');
        if (!$alerter.length) $alerter = $('<span class="red alerter" style="display:none;"></span>').insertAfter($that);
        if (popup == undefined) popup = 'Value should be from ' + min;
        popup = popup.replace(/\{([^\}]+)\}/g, function (m, p, o, s) {
          if (p == 'min') return min;
          if (p == 'max') return max;
        });

        if (min) {
          if (val < min) {
            ret = false;
            $alerter.text(popup);
            $alerter.fadeIn();
          } else $alerter.fadeOut();
        }

        if (max) {
          if (val > max) {
            ret = false;
            $alerter.text(popup);
            $alerter.fadeIn();
          } else $alerter.fadeOut();
        }
      });
      return ret;
    };

    var getargs = function getargs($c) {
      if (debugEscape) return;
      var args = {};
      $c.find("input,select,textarea").each(function () {
        var n = $(this).attr("data-name"),
            v = $(this).attr('type') == 'checkbox' ? $(this).is(':checked') ? "1" : '0' : $(this).val();

        if ($(this).hasClass('-ui-calendar')) {
          var date = $(this).parents('.ui.calendar').calendar('get date');
          v = date.getFullYear() + '-' + (1 + date.getMonth()).leftPad() + '-' + date.getDate().leftPad() + ' ' + date.getHours().leftPad() + ':' + date.getMinutes().leftPad() + ":" + date.getSeconds().leftPad();
        }

        if (n != undefined && n.length) {
          var nn = n.split(/\./),
              argss = args;

          if (nn.length > 1) {
            for (var i = 0; i < nn.length - 1; ++i) {
              argss[nn[i]] = argss[nn[i]] ? argss[nn[i]] : {};
              argss = argss[nn[i]];
            }

            n = nn[nn.length - 1]; // console.debug(n,v,JSON.stringify(args));
          }

          argss[n] = v;
        }
      }); // $c.find('.json-field').each(function(){args = $.extend(args,skymechanics.jobj.toJsonObjs($(this)));});

      return args;
    };

    var clickfn = function clickfn(e) {
      if (e) e.preventDefault();
      if (e) e.stopPropagation();
      if (!checkvals(container)) return false;
      var before = container.data("confirm");
      var confirm = before ? getFunctionByName(before) : false;
      console.log('submiter confirm function name', before, confirm);

      var action = container.attr("data-action"),
          args = getargs(container),
          callback = container.attr("data-callback"),
          _error = container.attr("data-callback-error"),
          $btn = $(this),
          btnText = $btn.html(),
          ftype = container.attr("data-method");

      if (confirm) confirm({}, container, args);
      ftype = ftype ? ftype : skymechanics._type;
      callback = getFunctionByName(callback); // console.debug('submiter',action,args,callback,error);

      $.ajax({
        url: action,
        data: args,
        type: ftype,
        beforeSend: function beforeSend() {
          $btn.html('<i class="cf-loader fa fa-spin fa-fw fa-circle-o-notch"></i>');
        },
        success: function success(d) {
          callback(d, container, args);

          if (d.redirect) {
            if (d.redirect.form) {
              $(d.redirect.form).appendTo('body').submit();
            } else if (d.redirect.url) {
              document.location.href = d.redirect.url;
            }
          } else if (d.append) {
            if (d.append.view) {
              $(d.append.view).appendTo('body');
            }
          }
        },
        error: function error(x, s) {
          try {
            if (_error) {
              _error = getFunctionByName(_error);

              _error(x.responseJSON, container, args);
            } else callback(x.responseJSON, container, args);
          } catch (e) {
            console.error(e);
          }

          console.error(x.responseJSON, args);
        },
        complete: function complete() {
          $btn.html(btnText);
        }
      });
      return false;
    };

    if (container.attr("data-autostart") == "true") clickfn();else {
      var trigger = container.find('.submit').attr('data-trigger');
      trigger = trigger != undefined && trigger != false ? trigger : 'click';
      container.find('.submit').on(trigger, clickfn);
    }
    container.find('.cancel').on('click', function () {});
    return this;
  },
  bulk: function bulk() {
    var $that = $(arguments.length ? arguments[0] : this),
        trigger = $that.attr("data-bulk-trigger"),
        selector = $that.attr('data-bulk-selector'),
        action = $that.attr('data-bulk-action'),
        param = $that.attr('data-bulk-name'),
        toucher = $that.attr('data-bulk-target');
    if (!selector) return;
    if ($.inArray(trigger, ['click', 'change', 'keyup']) == -1) return;
    $that.on(trigger, function () {
      var val = $that.prop('tagName') == 'DIV' && $that.hasClass('dropdown') ? $that.dropdown('get value') : $that.val();
      if ($that.prop('tagName') == 'BUTTON' || $that.hasClass('button')) val = 'b';

      if (val) {
        $(selector).each(function () {
          var id = $(this).attr('data-id'),
              $itrChecker = $(this).parent(),
              $itr = $(this),
              url = action.replace(/\{([^\}]+)\}/g, function (m, p, o, s) {
            if (p == "data-id") return $itr.attr("data-id");else if (p == "bulk-param-name") return param;else if (p == "bulk-param-value") return val;else if ($(p).length) return '=' + $(p).val();else {
              if (p.match(/\./ig)) {
                var f = p.split(/\./g),
                    v = window;

                for (var i in f) {
                  v = v[f[i]];
                  if (v == undefined) break;
                }

                if (v) {
                  return '=' + v;
                }
              }

              return '=' + $('[data-name=' + p + ']').val();
            }
          });

          if ($itrChecker.checkbox('is checked')) {
            $.ajax({
              url: url,
              success: function success() {
                $itrChecker.checkbox('set unchecked');
              }
            });
          }
        }).promise().done(function () {
          if (trigger == 'buttonClick') return;
          cf.touch(toucher);
          if ($that.hasClass('dropdown')) $that.dropdown('restore defaults');else if ($that.parent().hasClass('dropdown')) $that.parent().dropdown('restore defaults');else if ($that.hasClass('input')) $that.val('');else if ($that.prop('tagName') == 'INPUT') $that.val('');
        });
      }
    });
  },
  bulkButton: function bulkButton(button) {
    var $button = $(button);
    var selector = $button.attr('data-bulk-selector');
    var action = $button.attr('data-bulk-action');
    var toucher = $button.attr('data-bulk-target');
    var $assigners = $('.bulk .bulker[data-bulk-trigger=buttonClick]');
    var textBackup = $button.html();
    var params = {};
    $assigners.each(function () {
      var val = $(this).prop('tagName') == 'DIV' && $(this).hasClass('dropdown') ? $(this).find('input[type="hidden"]').val() : $(this).val();
      var param = $(this).attr('data-bulk-param');
      var name = $(this).attr('data-bulk-name');
      var $that = $(this);
      var urlParam = param.replace(/\{([^\}]+)\}/g, function (m, p, o, s) {
        if (p == "bulk-param-name") return name;else if (p == "bulk-param-value") return val;else if ($(p).length) return '=' + $(p).val();else {
          if (p.match(/\./ig)) {
            var f = p.split(/\./g),
                v = window;

            for (var i in f) {
              v = v[f[i]];
              if (v == undefined) break;
            }

            if (v) {
              return '=' + v;
            }
          }

          return '=' + $('[data-name=' + p + ']').val();
        }
      });
      var pp = urlParam.split(/=/);
      if (pp.length == 2 && pp[1] && pp[1].length && pp[1] != undefined && pp[1] != "undefined") params[pp[0]] = pp[1];
      if ($that.hasClass('dropdown')) $that.dropdown('restore defaults');else if ($that.parent().hasClass('dropdown')) $that.parent().dropdown('restore defaults');else if ($that.hasClass('input')) $that.val('');else if ($that.prop('tagName') == 'INPUT') $that.val('');
    });
    var toCheckLength = $(selector).length;
    var checkedLength = toCheckLength;
    $button.html("<i class=\"ui notched circle loading icon\"></i> ".concat(toCheckLength - checkedLength, "/").concat(toCheckLength, " ").concat(__('crm.done'))).addClass('disabled');
    new Promise(function (resolve, reject) {
      $(selector).each(function () {
        var id = $(this).attr('data-id'),
            $itrChecker = $(this).parent(),
            $itr = $(this);
        var val = $(this).prop('tagName') == 'DIV' && $(this).hasClass('dropdown') ? $(this).find('input[type="hidden"]').val() : $(this).val();
        var param = $(this).attr('data-bulk-param');
        var name = $(this).attr('data-bulk-name');
        var $that = $(this); // console.debug('bulkButton',name,val)

        var url = action.replace(/\{([^\}]+)\}/g, function (m, p, o, s) {
          if (p == "data-id") return $itr.attr("data-id");else if (p == "bulk-param-name") return param;else if (p == "bulk-param-value") return val;else if ($(p).length) return '=' + $(p).val();else {
            if (p.match(/\./ig)) {
              var f = p.split(/\./g),
                  v = window;

              for (var i in f) {
                v = v[f[i]];
                if (v == undefined) break;
              }

              if (v) {
                return '=' + v;
              }
            }

            return '=' + $('[data-name=' + p + ']').val();
          }
        });

        if ($itrChecker.checkbox('is checked')) {
          $.ajax({
            url: url,
            data: params,
            success: function success() {
              $itrChecker.checkbox('set unchecked');
              $button.html("<i class=\"ui notched circle loading icon\"></i> ".concat(toCheckLength - checkedLength, "/").concat(toCheckLength, " ").concat(__('crm.done')));
            },
            complete: function complete() {
              checkedLength--;
              if (checkedLength <= 0) resolve();
            }
          });
        }
      });
    }).then(function () {
      $('.bulk').hide();
      cf.touch(toucher);
      $button.html(textBackup).removeClass('disabled');
    });
  },
  guid: function guid() {
    // Public Domain/MIT
    var d = new Date().getTime();

    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
      d += performance.now(); //use high-precision timer if available
    }

    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : r & 0x3 | 0x8).toString(16);
    });
  }
};
window.cf = skymechanics;
window.Fresher = new skymechanics.refresher();
window.page = {
  activity: timestamp.getTime(),
  current: false,
  notitication: function notitication(n) {
    $('.sidebar#notificationBar').sidebar({
      dimPage: false,
      mobileTransition: 'overlay',
      duration: 64,
      closable: false
    }).sidebar('show');
  },
  dashboard: {
    __currentPeriod: '7d',
    byperiod: function byperiod(that, p) {
      $('.byperiod .active').removeClass('active');
      $('.date').fadeOut(function () {
        $('.date.' + p).fadeIn();
      });
      $(that).addClass('active');
      page.dashboard.__currentPeriod = p;
      $('#page__dashboard .loadering').each(function () {
        var loadering = $(this).attr('data-name');
        if (loadering) skymechanics.touch(loadering);
      });
    },
    options: {
      chart: {
        backgroundColors: ['rgba(33,187,149,.8)', 'rgba(33,133,208,.8)', 'rgba(204, 104, 104,.8)', 'rgba( 104, 204,104,.8)', 'rgba(104, 104, 104,.8)', 'rgba(104, 104, 204,.8)'],
        borderColors: ['rgba(33,187,149,1)', 'rgba(33,133,208,1)', 'rgba(204, 104, 104,1)', 'rgba( 104, 204,104,1)', 'rgba(104, 104, 104,1)', 'rgba(104, 104, 204,1)']
      }
    },
    events: {},
    deals: function deals($c, d) {
      var raw = {},
          profits = {
        total: 0,
        today: 0,
        previous: 0,
        volation: 0
      },
          invested = {
        total: 0,
        today: 0,
        previous: 0,
        volation: 0
      },
          today = new Date(),
          today = new Date(today - today.getTime() % (24 * 60 * 60 * 1000)),
          today = today.getTime(),
          $t = $('#deal_total');

      for (var i in d) {
        var r = d[i];
        raw[r.pair] = raw[r.pair] ? raw[r.pair] : 0;
        raw[r.pair] += parseInt(r.total);
        profits.total += parseFloat(r.profit);

        if (r.date * 1000 == today) {
          profits.today = parseFloat(r.profit);
          profits.volation = profits.previous == 0 ? 100 : 100 * (parseFloat(r.profit) / profits.previous - 1);
        }

        profits.previous = parseFloat(r.profit);
        invested.total += parseFloat(r.amount);

        if (r.date * 1000 == today) {
          invested.today = parseFloat(r.amount);
          invested.volation = invested.previous == 0 ? 100 : 100 * (parseFloat(r.amount) / invested.previous - 1);
        }

        invested.previous = parseFloat(r.amount);
      }

      $t.find('tbody tr:eq(0) td:eq(1)').html(invested.total.currency('$', 2));
      $t.find('tbody tr:eq(0) td:eq(2)').html(invested.today.currency('$') + '<br/><small><i class="ui icon arrow ' + (invested.volation >= 0 ? 'up' : 'down') + '"></i>' + invested.volation.toFixed(2) + '%</small>').addClass(invested.volation >= 0 ? 'green' : 'red');
      $t.find('tbody tr:eq(1) td:eq(1)').html(profits.total.currency('$', 2));
      $t.find('tbody tr:eq(1) td:eq(2)').html(profits.today.currency('$') + '<br/><small><i class="ui icon arrow ' + (profits.volation >= 0 ? 'up' : 'down') + '"></i>' + profits.volation.toFixed(2) + '%</small>').addClass(profits.volation >= 0 ? 'green' : 'red');
      var splited = splitObjectKeys(raw),
          ctx = document.getElementById('chart__deals').getContext('2d'),
          chart = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
          labels: splited.keys,
          datasets: [{
            label: __('crm.trades.title') + ": ",
            backgroundColor: page.dashboard.options.chart.backgroundColors,
            borderColor: page.dashboard.options.chart.borderColors,
            data: splited.values
          }]
        },
        // Configuration options go here
        options: {}
      });
    },
    customers: function customers($c, d) {
      var labels = [],
          cals = [],
          data = {
        clients: [],
        leads: []
      },
          td = new Date(),
          today = new Date(td - td % (24 * 60 * 60 * 1000)),
          totals = {
        previous: 0,
        total: 0,
        today: 0,
        volation: 0
      },
          leads = {
        previous: 0,
        total: 0,
        today: 0,
        volation: 0
      },
          $t = $('#lead_total');

      for (var i in d) {
        var r = d[i],
            dtd = new Date(r.date * 1000),
            dt = system.months[dtd.getMonth()] + ' ' + dtd.getDate();
        labels[dt] = labels[dt] ? labels[dt] : {};
        labels[dt]["clients"] = r.newcustomers;
        labels[dt]["leads"] = r.newlead;
        labels[dt]["total"] = r.total;
        leads.total += parseInt(r.newlead);
        leads.today = parseInt(r.newlead);
        leads.volation = leads.previous == 0 ? 0 : leads.today / leads.previous;
        leads.previous = parseInt(r.newcustomers);
        totals.total += parseInt(r.newcustomers);
        totals.today = parseInt(r.newcustomers);
        totals.volation = totals.previous == 0 ? 0 : totals.today / totals.previous;
        totals.previous = parseInt(r.newcustomers);
      }

      var tt = {
        newlead: 0,
        newcustomers: 0
      };
      d.map(function (item) {
        tt.newlead += parseFloat(item.newlead);
        tt.newcustomers += parseFloat(item.newcustomers);
      });
      $c.html('');
      $c.append("<div class=\"statistic\">\n                    <div class=\"value\"><i class=\"outline user icon\"></i> ".concat(tt.newlead.digit(0), "</div>\n                    <div class=\"label\">").concat(__('crm.dashboard.new_leads'), "</div>\n                </div>"));
      $c.append("<div class=\"statistic\">\n                    <div class=\"value\"><i class=\"user icon\"></i> ".concat(tt.newcustomers.digit(0), "</div>\n                    <div class=\"label\">").concat(__('crm.dashboard.new_customers'), "</div>\n                </div>"));
      $t.html('');
      $t.append("<thead><tr><th class=\"four wide\">&nbsp;</th><th class=\"right aligned\">".concat(__('crm.dashboard.totals'), "</th><th class=\"right aligned\">").concat(__('crm.dashboard.today'), "</th></tr></thead>"));
      $t.append("<tr><th class=\" six wide ui right aligned\">".concat(__('crm.dashboard.new_customers'), "</th><td class=\"ui header right aligned\">").concat(totals.total, "</td><td class=\"ui header color right aligned ").concat(totals.volation < 0 ? "red" : "green", "\">").concat(totals.today, "<br><small>").concat(totals.volation.toFixed(2), "%</small></td></tr>"));
      $t.append("<tr><th class=\"right aligned\">".concat(__('crm.dashboard.new_leads'), "</th>'+'<td class=\"ui header right aligned\">").concat(leads.total, "</td><td class=\"ui header color right aligned ").concat(leads.volation < 0 ? "red" : "green", "\">").concat(leads.today, "<br><small>").concat(leads.volation.toFixed(2), "%</small></td></tr>")); // for(var i=0;i<7;++i){
      //     var c = new Date();
      //     c.setDate(td.getDate()-i);
      //     c = system.months[c.getMonth()]+' '+c.getDate();
      //     cals.push(c);
      //     data.clients.push((labels[c])?labels[c].clients:0);
      //     data.leads.push((labels[c])?labels[c].leads:0);
      // }
      // var chart = new Chart(ctx, {
      //     // The type of chart we want to create
      //     type: 'line',
      //     // The data for our dataset
      //     data: {
      //         labels: cals.reverse(),//["January", "February", "March", "April", "May", "June", "July"],
      //         datasets: [
      //             {
      //                 label: "New customers",
      //                 backgroundColor: 'rgb(33,133,208)',
      //                 borderColor: 'rgb(33,133,208)',
      //                 data: data.clients.reverse()
      //             },
      //             {
      //                 label: "New leads",
      //                 backgroundColor: 'rgb(255, 10, 10)',
      //                 borderColor: 'rgb(255, 10, 10)',
      //                 data: data.leads.reverse()
      //             },
      //         ]
      //     },
      //     // Configuration options go here
      //     options: {}
      // });
    },
    money: function money($c, d, x, s) {
      var //ctx = document.getElementById('chart__money_report').getContext('2d'),
      labels = [],
          cals = [],
          data = {
        deposits: [],
        bonuses: [],
        withdrawals: []
      },
          td = new Date(),
          today = new Date(td - td % (24 * 60 * 60 * 1000)),
          totals = {
        previous: 0,
        total: 0,
        today: 0,
        volation: 0
      },
          $t = $('#withdrawal_total');

      for (var i in d) {
        var r = d[i],
            dtd = new Date(r.date * 1000),
            dt = system.months[dtd.getMonth()] + ' ' + dtd.getDate();
        labels[dt] = labels[dt] ? labels[dt] : {};
        labels[dt]["deposits"] = 0;
        labels[dt]["bonuses"] = 0;
        labels[dt]["withdrawals"] = 0;
        if (r.type == 'deposit') labels[dt].deposits = r.amount;else if (r.type == 'bonus') labels[dt].bonuses = r.amount;else if (r.type == 'withdraw') {
          labels[dt].withdrawals = r.amount;
          totals.total++;
          totals.previous += parseFloat(r.amount);
          totals.today += today == dtd ? parseFloat(r.amount) : 0;
          totals.volation = totals.previous == 0 ? 0 : 100 * (totals.today / totals.previous - 1); // console.debug(totals);
        }
      }

      var dd = {
        deposit: 0,
        withdraw: 0,
        bonus: 0
      };
      d.map(function (item) {
        dd[item.type] += parseFloat(item.amount);
      });
      $c.html('');
      if (dd.withdraw > 0) $c.append("<div class=\"statistic\">\n                    <div class=\"value\"><i class=\"dollar icon\"></i> ".concat(dd.withdraw.digit(2), "</div>\n                    <div class=\"label\">").concat(__('crm.dashboard.withdrawals'), "</div>\n                </div>"));
      if (dd.deposit > 0) $c.append("<div class=\"statistic\">\n                    <div class=\"value\"><i class=\"dollar icon\"></i> ".concat(dd.deposit.digit(2), "</div>\n                    <div class=\"label\">").concat(__('crm.dashboard.deposits'), "</div>\n                </div>"));
      if (dd.bonus > 0) $c.append("<div class=\"statistic\">\n                    <div class=\"value\"><i class=\"dollar icon\"></i> ".concat(dd.bonus.digit(2), "</div>\n                    <div class=\"label\">").concat(__('crm.dashboard.bonus'), "</div>\n                </div>"));
      $t.html('');
      $t.append("<thead><tr><th>&nbsp;</th><th class=\"right aligned\">".concat(__('crm.dashboard.totals'), "</th><th class=\"right aligned\">").concat(__('crm.dashboard.today'), "</th></tr></thead>"));
      $t.append('<tbody><tr><th>Withdrawal</th>' + '<th class="ui header right aligned">' + totals.total + '</td>' + '<td class="ui color right aligned ' + (totals.volation > 0 ? "red" : "green") + '">' + totals.today + '<br><small>' + totals.volation.toFixed(2) + '%</small></td>' + '</tr></tbody>');

      for (var i = 0; i < 7; ++i) {
        var c = new Date();
        c.setDate(td.getDate() - i);
        c = system.months[c.getMonth()] + ' ' + c.getDate();
        cals.push(c);
        data.deposits.push(labels[c] ? labels[c].deposits : 0);
        data.withdrawals.push(labels[c] ? labels[c].withdrawals : 0);
      } // var chart = new Chart(ctx, {
      //     // The type of chart we want to create
      //     type: 'bar',
      //     // The data for our dataset
      //     data: {
      //         labels: cals.reverse(),//["January", "February", "March", "April", "May", "June", "July"],
      //         datasets: [
      //             {
      //                 label: __('crm.dashboard.deposits'),
      //                 backgroundColor: 'rgb(33,133,208)',
      //                 borderColor: 'rgb(33,133,208)',
      //                 data: data.deposits.reverse()
      //             },
      //             {
      //                 label: __('crm.dashboard.totals'),
      //                 backgroundColor: 'rgb(255, 10, 10)',
      //                 borderColor: 'rgb(255, 10, 10)',
      //                 data: data.withdrawals.reverse()
      //             },
      //         ]
      //     },
      //     // Configuration options go here
      //     options: {}
      // });

    },
    deposits: function deposits($c, d) {
      var //ctx = document.getElementById('chart__deposit_report').getContext('2d'),
      labels = [],
          data = [],
          raw = {},
          totals = {
        total: 0,
        today: 0,
        previous: 0,
        volation: 0
      },
          today = new Date(),
          today = new Date(today - today % (24 * 60 * 60 * 1000)),
          $t = $('#deposit_total');

      for (var i in d) {
        var r = d[i],
            merchant = r.title;
        raw[merchant] = raw[merchant] ? raw[merchant] : 0;
        raw[merchant] += parseFloat(r.amount);
        totals.total += parseInt(r.total);
        totals.volation = totals.previous == 0 ? 100 : 100 * (parseFloat(r.amount) / (parseFloat(r.amount) + totals.previous) - 1);
        totals.previous += parseFloat(r.amount);
        if (r.trunc_date == today) total.today = parseFloat(r.total);
        totals[merchant] = totals[merchant] ? totals[merchant] : {
          previous: 0,
          volation: 0,
          total: 0
        };
        totals[merchant].total += parseInt(r.total);
        totals[merchant].volation = totals[merchant].previous == 0 ? 100 : 100 * (parseFloat(r.amount) / (parseFloat(r.amount) + totals[merchant].previous) - 1);
        totals[merchant].previous += parseFloat(r.amount);
        totals[merchant].today = r.trunc_date == today ? r.total : 0;
      }

      $c.html('');
      Object.keys(raw).map(function (merchant) {
        var item = raw[merchant];
        $c.append("<div class=\"statistic\">\n                    <div class=\"value\"><i class=\"dollar icon\"></i> ".concat(item.digit(2), "</div>\n                    <div class=\"label\">").concat(merchant, "</div>\n                </div>"));
      });
      $t.html('');
      $t.append("<thead><tr><th>&nbsp;</th><th class=\"right aligned\">".concat(__('crm.dashboard.totals'), "</th><th class=\"right aligned\">").concat(__('crm.dashboard.today'), "</th></tr></thead>"));
      $t.append('<tbody><tr>' + "<td><b>".concat(__('crm.dashboard.deposits'), "</b></td>") + '<td class="right aligned"><b>' + totals.total + '</b></td>' + '<td class="color right aligned ' + (totals.volation > 0 ? "green" : "red") + '"><b>' + totals.today + '</b><br><small>' + totals.volation.toFixed(2) + '%</small></td>' + '</tr></tbody>');

      for (var i in totals) {
        if ($.inArray(i, ['total', 'volation', 'previous', 'today']) < 0) {
          $t.append('<tr>' + "<td>".concat(i, "</td>") + "<td class=\"right aligned\">".concat(totals[i].total, "</td>") + "<td class=\"right aligned color ".concat(totals[i].volation > 0 ? "green" : "red", "\">").concat(totals[i].today, "<br><small>").concat(totals[i].volation.digit(2), "%</small></td>") + '</tr>');
        }
      }
    }
  },
  image: {
    view: function view(that) {
      var $img = $(that).find('img:first'),
          $iframe = $(that).find('iframe:first'),
          id = "img" + skymechanics.guid(),
          $m = $('<div class="ui page dimmer" id="' + id + '"></div>').appendTo($('body')),
          actions = arguments.length > 1 ? arguments[1] : {},
          $c = $('<div class="content"></div>').appendTo($m),
          buttonColor = ['green', 'red'],
          j = 0;
      $c = $('<div class="center"></div>').appendTo($c);
      $("<div style=\"cursor:pointer;position:fixed;right:2em;top:2em;\"><i class=\"ui big close icon\"></i></div>").appendTo($c).on('click', function () {
        $(this).closest('.dimmer').dimmer('hide');
        $(this).closest('.dimmer').remove();
      });
      if ($img.length) $c.append('<img clas="ui image" src="' + $img.attr('src') + '" style="max-width:640px;"/><br/><br/>');else if ($iframe.length) $c.append($iframe); // $m.append('');
      // $ac = $('<div class="ui buttons"></div>').appendTo($c);

      for (var i in actions) {
        $('<button class="ui button basic circular icon inverted ' + buttonColor[j++] + '" style="margin-left:2rem" onclick="' + actions[i] + '">' + i + '</button>').appendTo($c).on('click', function () {
          $(this).closest('.dimmer').dimmer('hide');
          $(this).closest('.dimmer').remove();
        });
      }

      $m.dimmer({
        closeable: '',
        onHide: function onHide($e) {
          $("#".concat(id)).remove();
        }
      }).dimmer('show');
      console.debug(id, $m);
    }
  },
  show: function show() {
    var p, subpage;

    if (page.current !== false) {
      page.current.menu.removeClass('active');
      page.current.page.transition('fly right');
      if (page.current.subpage !== false) page.current.subpage.hide(); // page.current.page.hide();
      // if(page.current.subpage!==false)page.current.subpage.hide();
    }

    var that = arguments.length ? arguments[0] : 'body';

    if (arguments.length > 1) {
      p = arguments[1];
      $.cookie('page.current', p);
    } else {
      p = $.cookie('page.current'); // console.debug('cookie undefined value',p);

      p = !p ? 'dashboard' : p;
    }

    if (arguments.length > 2) {
      subpage = arguments[2];
      $.cookie('page.current.sub', subpage);
    } else {
      subpage = $.cookie('page.current.sub');
      subpage = !subpage ? false : subpage;
    }

    page.current = {
      name: '',
      menu: $(that),
      page: $('#page__' + p),
      subpage: false
    };
    page.current.page.transition('fly left');
    page.current.page.show();

    if (subpage) {
      page.current.subpage = $('#page__' + p + '_' + subpage);
      page.current.subpage.show();
    }

    page.current.menu.addClass('active');
    page.current.name = page.current.page.attr('name'); // console.debug(page.current);
    // $('#page__'+p+' .left .menu .item').removeClass('active');
    // $('#page__'+p+' .left .menu .item[data-href='+dhref+']').addClass('active');
    // $('#body_event_trigger').trigger('page:show',{page:$('#page__'+p)})

    skymechanics.reload();
    if (window.cardContainer) window.cardContainer.hide();
    $('#main_dimmer').fadeOut();
    $('.pusher').removeClass('dimmed');
  },
  showHref: function showHref(t, p, a) {
    var p,
        subpage,
        dhref = 'page__';

    if (arguments.length > 1) {
      p = arguments[1];
      $.cookie('page.current', p);
    } else {
      p = $.cookie('page.current'); // console.debug('cookie undefined value',p);

      p = !p ? 'dashboard' : p;
    }

    dhref += p;

    if (arguments.length > 2) {
      subpage = arguments[2];
      $.cookie('page.current.sub', subpage);
    } else {
      subpage = $.cookie('page.current.sub');
      subpage = !subpage ? false : subpage;
    }

    $('#body_event_trigger').trigger('page:show', {
      page: $('#page__' + p)
    });

    if (subpage) {
      page.current.push(subpage);
      dhref += '_' + subpage;
      $('#page__' + p + '_' + subpage).show();
    } // console.debug('show page universal navigation',document.location);
    // document.location.href=`?page=${p}&subpage=${subpage}`;


    document.location.href = document.location.origin + document.location.pathname + "?page=".concat(p, "&subpage=").concat(subpage); // console.debug($(t).attr('data-href'));

    $('#page__' + p + ' .left .menu .item').removeClass('active'); // console.debug(dhref,'#page__'+p+' .left.menu .item[data-href='+dhref+']','#page__'+p+' .left.menu .item');

    $('#page__' + p + ' .left .menu .item[data-href=' + dhref + ']').addClass('active');
    return;
  },
  modalPreloaderStart: function modalPreloaderStart(id) {
    var $dash = $("<div class=\"ui mini basic modal\" id=\"".concat(id, "\"><div class=\"ui active dimmer content\" style=\"height:20vh;\"><div class=\"ui text loader\">Getting data</div></div></div>")).appendTo('#modals');
    page.modal("#".concat(id));
    return $dash;
  },
  modalPreloaderEnd: function modalPreloaderEnd($dash, d) {
    var reload = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    $dash.removeClass('basic mini').addClass('fullscreen');
    $dash.html(d);
    if (reload) skymechanics.reload();
  },
  modal: function modal(id) {
    var $id = id instanceof jQuery ? id : $(id);
    var cfReload = arguments.length > 1 ? arguments[1] : true;
    var settings = {
      transition: 'fade',
      allowMultiple: true,
      centered: false,
      observeChanges: true,
      onHidden: function onHidden(e) {
        var ch = $(this).attr('data-charts');
        skymechanics.removeChart(ch);
        $(this).remove();
        $id.remove();
      }
    };
    console.debug('Modal.settings', settings);
    $id.modal(settings).modal('show');
    if (cfReload) skymechanics.reload(); // $('#body_event_trigger').trigger('page:show',{page:$id});
  },
  paginate: function paginate() {
    return _construct(_core_pagination__WEBPACK_IMPORTED_MODULE_1__["VUIPaginate"], Array.prototype.slice.call(arguments));
  }
}; // $(document).ready(function(){
// fixed tasks header

$('#listTasks').html($('#listTasksHidden').clone().html()); // $('.ui.sidebar').sidebar();

$('.sidebar#menuBar').sidebar({
  mobileTransition: 'overlay',
  duration: 128,
  dimPage: false,
  onHide: function onHide() {// if(window.cardContainer)window.cardContainer.hide();
  }
}).sidebar('attach events', '.toggler', 'toggle');
$('.datetask').on('change keyup blur', function () {
  var $d = $(this).parents('.form').find('.datetask.date'),
      $t = $(this).parents('.form').find('.datetask.time'),
      $r = $(this).parents('.form').find('[data-name=start_date]'); // console.debug($d.val(),$t.val());

  $r.val($d.val() + ' ' + $t.val());
});
$('select.ui.dropdown:not(.dropdown-assigned),div.ui.dropdown:not(.dropdown-assigned)').addClass('dropdown-assigned').dropdown();
$('.helper:not(.helper-assigned)').addClass('helper-assigned').popup({
  hoverable: true
});
$('[data-name=search]').on('focus', function () {
  // $(this).closest('.form').find('input').val('');
  $(this).closest('.form').find('.dropdown').dropdown('restore defaults');
});
$(".ui.tabular:not(.tab-assigned)").addClass("tab-assigned").find(".item").tab({
  onVisible: function onVisible() {
    console.debug('Tab onVisible', arguments, $(".loadering:visible:not(.loadering-assigned)"));
    skymechanics.reload();
  },
  onLoad: function onLoad() {
    console.debug('Tab loaded', arguments, $(".loadering:visible:not(.loadering-assigned)"));
    skymechanics.reload();
  }
});

if (typeof PAGE_TAB != "undefined") {
  $.tab('change tab', PAGE_TAB);
}

$('.ui.sticky:visible:not(.assigned)').each(function () {
  var tcontext = $(this).attr('data-context'),
      opts = {
    observeChanges: true,
    pushing: true,
    offset: 120
  };
  if (tcontext) opts['context'] = tcontext;
  $(this).sticky(opts).addClass('assigned');
});
$('body').on('mousemove click keyup', function (e) {
  var timestamp = new Date();
  page.activity = timestamp.getTime();
});
var timeCheck = 60000;
setInterval(function () {
  var timestamp = new Date();
  var diff = timestamp.getTime() - page.activity;

  if (diff > timeCheck) {
    $('body').trigger('page:noactivity');
    page.activity = timestamp.getTime();
  }
}, timeCheck);
skymechanics.reload();
page.show(); // });

/***/ }),

/***/ "./resources/assets/js/components/card.js":
/*!************************************************!*\
  !*** ./resources/assets/js/components/card.js ***!
  \************************************************/
/*! exports provided: Card */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Card", function() { return Card; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Card =
/*#__PURE__*/
function () {
  function Card(name) {
    _classCallCheck(this, Card);

    this._name = name;
    this.shouldUpdate = true;
    this.isUpdate = false;
    this.rendered = false;
    this.$container = $("<div class=\"ui crm raised card\" data-uid=\"\" style=\"display:none\"></div>");
    this.getUid = this.getUid.bind(this);
    this.getCardName = this.getCardName.bind(this);
    this.getTitle = this.getTitle.bind(this);
    this.render = this.render.bind(this);
    this.compare = this.compare.bind(this);
  }

  _createClass(Card, [{
    key: "getUid",
    value: function getUid() {
      return this._uid;
    }
  }, {
    key: "getCardName",
    value: function getCardName() {
      return this._name;
    }
  }, {
    key: "getTitle",
    value: function getTitle() {
      return '';
    }
  }, {
    key: "render",
    value: function render() {
      var _this = this;

      var that = this;
      return new Promise(function (resolve, reject) {
        if (_this.rendered) {
          resolve(that);
          return;
        }

        that.$container.attr('data-uid', that._uid);
        if (that.draw) that.draw();else {
          console.warn('no draw func', that);
          reject(that);
        }
        resolve(that);
      });
    }
  }, {
    key: "compare",
    value: function compare(data) {
      return true;
    }
  }]);

  return Card;
}();

/***/ }),

/***/ "./resources/assets/js/components/container.js":
/*!*****************************************************!*\
  !*** ./resources/assets/js/components/container.js ***!
  \*****************************************************/
/*! exports provided: Container */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Container", function() { return Container; });
/* harmony import */ var _card__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./card */ "./resources/assets/js/components/card.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }


var Container =
/*#__PURE__*/
function () {
  function Container() {
    var _this = this;

    _classCallCheck(this, Container);

    this.$toggler = $('#cards_container_toggler,#cards_container_closer');
    this.$container = $('#cards_container');
    this.$content = $('#cards_container_content');
    this.$counter = $('#cards_container_count');
    this.$menu = $('#cards_container_menu');
    this.$container.sidebar({
      duration: 0,
      onVisible: function onVisible() {
        console.debug(new Date().toString(), 'sidebar showing');
      },
      onShow: function onShow() {
        console.debug(new Date().toString(), 'sidebar showed');
        _this.slided = true;
      },
      onHide: function onHide() {
        console.debug('sidebar hidding');
      },
      onHidden: function onHidden() {
        console.debug('sidebar hidden');
        _this.slided = false;
      }
    });
    this.$container.sidebar('attach events', '#cards_container_toggler,#cards_container_closer');
    this.cards = {};
    this.append = this.append.bind(this);
    this.appendOneCard = this.appendOneCard.bind(this);
    this.slice = this.slice.bind(this);
    this.before = this.before.bind(this);
    this.after = this.after.bind(this);
    this.show = this.show.bind(this);
    this.touch = this.touch.bind(this);
    this.slideLeft = this.slideLeft.bind(this);
    this.slideRight = this.slideRight.bind(this);
    this.hide = this.hide.bind(this);
    this.slided = false;
    this.active = false;
    var dims = {
      display: Math.floor($(document).height()),
      header: Math.ceil($("#crm_header").height()),
      footer: Math.ceil($("#crm_footer").outerHeight())
    };
    var cheight = this.$container.height - 2 * dims.header - 28;
    this.$container.css({
      top: dims.header + 8
    }); // this.$content.css({height:cheight})
    // console.debug('dims',cheight, dims);

    this.after();
  }

  _createClass(Container, [{
    key: "before",
    value: function before() {// if(Object.keys(this.cards).length==0){
      //     this.slideRight();
      // }else {
      //     this.slideLeft();
      // }
    }
  }, {
    key: "after",
    value: function after() {
      var _this2 = this;

      var that = this;
      this.$counter.text(Object.keys(this.cards).length);
      if (Object.keys(this.cards).length == 0) this.slideRight();else this.slideLeft();
      this.$menu.find('.item:not(#cards_container_closer)').addClass('remove');
      this.$content.find('.card').addClass('remove');

      var _loop = function _loop(uid) {
        var card = _this2.cards[uid];

        if (_this2.$menu.find(".item[data-uid=\"".concat(uid, "\"]")).length == 0) {
          // card.render().then( (that) => {that.$container.appendTo(this.$content)});
          var adds = window.onlineUsers && card.getCardName() == 'user' && window.onlineUsers.list[card.user.id] ? 'online' : '';
          var mitem = $("<a class=\"ui simple crm ".concat(adds, " item\" data-uid=\"").concat(uid, "\"><i class=\"ui ").concat(card.getCardName(), " icon\"></i>").concat(card.getTitle(), "</a>")).appendTo(_this2.$menu);
          mitem.on('click', function () {
            that.show(uid);
          });
          $('<a class="ui grey link"><i class="ui close icon"></i></a>').appendTo(mitem).on('click', function () {
            that.slice(card);
          });
        } else {
          _this2.$container.find("[data-uid=\"".concat(uid, "\"]")).removeClass('remove');
        }
      };

      for (var uid in this.cards) {
        _loop(uid);
      }

      this.$menu.find('.item.remove').remove();
      this.$content.find('.card.remove').remove();
      if (this.active !== false) this.show(this.active);else if (Object.keys(this.cards).length) {
        this.show(this.cards[Object.keys(this.cards)[0]].getUid());
      } // $(".ui.tabular .item:not(.tab-assigned)").addClass('tab-assigned').tab();
    }
  }, {
    key: "show",
    value: function show(uid) {
      var _this3 = this;

      this.cards[uid].render().then(function (that) {
        that.$container.appendTo(_this3.$content);

        _this3.$content.find(".crm.card:not(.crm.card[data-uid=\"".concat(uid, "\"])")).hide();

        _this3.$menu.find(".item:not(.item[data-uid=\"".concat(uid, "\"])")).removeClass('active');

        _this3.$content.find(".crm.card[data-uid=\"".concat(uid, "\"]")).show();

        _this3.$menu.find(".item[data-uid=\"".concat(uid, "\"]")).addClass('active');

        skymechanics.reload();
      });
    }
  }, {
    key: "append",
    value: function append(cards) {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        _this4.before();

        if (!Array.isArray(cards)) cards = [cards];
        new Promise(function (resolve, reject) {
          cards.map(function (card, i) {
            _this4.appendOneCard(card);
          });
          resolve();
        }).then(function () {
          _this4.after();
        });
        resolve();
      });
    }
  }, {
    key: "appendOneCard",
    value: function appendOneCard(card) {
      if (card instanceof _card__WEBPACK_IMPORTED_MODULE_0__["Card"]) {
        if (this.cards[card.getUid()] == undefined) {
          this.cards[card.getUid()] = card;
          this.active = card.getUid(); // console.log((new Date()).toString(),'container appends '+Object.keys(this.cards).length);
        }
      }
    }
  }, {
    key: "slice",
    value: function slice(card) {
      if (card instanceof _card__WEBPACK_IMPORTED_MODULE_0__["Card"]) {
        if (this.active == card.getUid()) this.active = null;
        delete this.cards[card.getUid()];
      }

      this.after();
    }
  }, {
    key: "touch",
    value: function touch(cuid) {
      // console.debug('container touch',cuid,this.cards[cuid].user,$(`.card[data-uid=${cuid}]`));
      if (this.cards[cuid] && this.cards[cuid].shouldUpdate) {
        this.cards[cuid].render().then(function (that) {
          $(".card[data-uid=".concat(cuid, "]")).replaceWith(that.$container.show());
        }); // if(this.active)this.show(this.active);
      }
    }
  }, {
    key: "slideLeft",
    value: function slideLeft() {
      if (this.slided) return;
      console.log(new Date().toString(), 'container showing sidebar');
      this.$container.sidebar('show');
      this.$toggler.fadeIn();
      this.slided = true;
    }
  }, {
    key: "slideRight",
    value: function slideRight() {
      if (!this.slided) return;
      console.log(new Date().toString(), 'container hiding sidebar');
      this.$container.sidebar('hide');
      this.$toggler.hide();
      this.slided = false;
      this.active = false;
    }
  }, {
    key: "hide",
    value: function hide() {
      this.$container.sidebar('hide');
      this.$toggler.fadeIn();
    }
  }]);

  return Container;
}();

/***/ }),

/***/ "./resources/assets/js/components/index.js":
/*!*************************************************!*\
  !*** ./resources/assets/js/components/index.js ***!
  \*************************************************/
/*! exports provided: LimitlessList, VUIPassword, VUICopytext, VUIEditable, VUIResourceRemove, VUIMessage, VUIModal, VUIPrompt, VUIFileupload */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LimitlessList", function() { return LimitlessList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VUIPassword", function() { return VUIPassword; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VUICopytext", function() { return VUICopytext; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VUIEditable", function() { return VUIEditable; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VUIResourceRemove", function() { return VUIResourceRemove; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VUIMessage", function() { return VUIMessage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VUIModal", function() { return VUIModal; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VUIPrompt", function() { return VUIPrompt; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VUIFileupload", function() { return VUIFileupload; });
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VUIComponent = function VUIComponent() {
  _classCallCheck(this, VUIComponent);
};

var LimitlessList =
/*#__PURE__*/
function (_VUIComponent) {
  _inherits(LimitlessList, _VUIComponent);

  function LimitlessList() {
    _classCallCheck(this, LimitlessList);

    return _possibleConstructorReturn(this, _getPrototypeOf(LimitlessList).call(this));
  }

  return LimitlessList;
}(VUIComponent);
var VUIPassword =
/*#__PURE__*/
function (_VUIComponent2) {
  _inherits(VUIPassword, _VUIComponent2);

  function VUIPassword() {
    var _this;

    var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'password';

    _classCallCheck(this, VUIPassword);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(VUIPassword).call(this));
    _this.name = n;
    _this.id = skymechanics.guid();
    _this.render = _this.render.bind(_assertThisInitialized(_this));
    _this.toggle = _this.toggle.bind(_assertThisInitialized(_this));
    return _possibleConstructorReturn(_this, _this.render());
  }

  _createClass(VUIPassword, [{
    key: "toggle",
    value: function toggle() {
      var $input = $("#".concat(this.id));
      var $eye = $("#clicker".concat(this.id));
      console.debug('Password component eye click', $input, $eye);

      if ($input.attr("type") == "password") {
        $input.get(0).type = 'text';
        $eye.addClass('slash');
      } else {
        $input.get(0).type = 'password';
        $eye.removeClass('slash');
      }
    }
  }, {
    key: "render",
    value: function render() {
      var that = this;
      var $div = $("<div class=\"ui action input\"></div>");
      $("<input id=\"".concat(this.id, "\" type=\"password\" data-name=\"").concat(this.name, "\" name=\"").concat(this.name, "\"/>")).appendTo($div);
      $("<button class=\"ui basic icon button\"><i  id=\"clicker".concat(this.id, "\" class=\"ui eye icon\"></i></button>")).appendTo($div).on('click', that.toggle);
      return $div;
    }
  }]);

  return VUIPassword;
}(VUIComponent);
var VUICopytext =
/*#__PURE__*/
function (_VUIComponent3) {
  _inherits(VUICopytext, _VUIComponent3);

  function VUICopytext() {
    var _this2;

    var v = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    _classCallCheck(this, VUICopytext);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(VUICopytext).call(this));
    _this2.value = v;
    _this2.id = skymechanics.guid();
    _this2.render = _this2.render.bind(_assertThisInitialized(_this2));
    return _possibleConstructorReturn(_this2, _this2.render());
  }

  _createClass(VUICopytext, [{
    key: "render",
    value: function render() {
      var id = this.id,
          value = this.value;
      var $div = $("<div class=\"ui action input\"></div>");
      $("<input id=\"".concat(id, "\" type=\"text\" readonly=\"readonly\" value=\"").concat(value, "\"/>")).appendTo($div);
      $("<button class=\"ui basic icon button\" onclick=\"copyValue(this,'#".concat(id, "')\"><i  id=\"clicker").concat(id, "\" class=\"ui copy icon\"></i></button>")).appendTo($div);
      return $div;
    }
  }]);

  return VUICopytext;
}(VUIComponent);
var VUIEditable =
/*#__PURE__*/
function (_VUIComponent4) {
  _inherits(VUIEditable, _VUIComponent4);

  function VUIEditable(a) {
    var _this3;

    var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var v = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    var c = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

    _classCallCheck(this, VUIEditable);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(VUIEditable).call(this));
    _this3.action = a;
    _this3.name = n;
    _this3.value = v;
    _this3.callback = c;
    _this3.id = skymechanics.guid();
    _this3.render = _this3.render.bind(_assertThisInitialized(_this3));
    return _possibleConstructorReturn(_this3, _this3.render());
  }

  _createClass(VUIEditable, [{
    key: "render",
    value: function render() {
      var that = this;
      var $res = $('<div class="ui action input"></div>');
      $("<a class=\"ui icon link editor\" id=\"".concat(that.id, "\"><i class=\"ui pencil icon\"></i></a>")).appendTo($res).on('click', function () {
        $("#".concat(that.id, "_editable_part")).show();
        $("#".concat(that.id, "_static_part")).hide();
        $("#".concat(that.id)).hide();
      });
      $("<span class=\"static\" id=\"".concat(that.id, "_static_part\">").concat(that.value, "</span>")).appendTo($res);
      var $form = $("<div class=\"ui form\" data-action=\"".concat(that.action, "\" style=\"display:none;\" id=\"").concat(that.id, "_editable_part\" data-method=\"put\" data-callback=\"").concat(that.callback || '', "\"></div>")).appendTo($res);
      var $fields = $("<div class=\"fields\"></div>").appendTo($form);
      $("<div class=\"field\"><div class=\"ui input\"><input type=\"".concat(isNaN(that.value) ? 'text' : 'number', "\" id=\"").concat(that.id, "_value\" data-name=\"").concat(that.name, "\" value=\"").concat(that.value, "\" /></div></div>")).appendTo($fields);
      $fields = $("<div class=\"field\"></div>").appendTo($fields);
      $("<button class=\"ui primary button submit\">".concat(__('crm.save'), "</button>")).appendTo($fields).on('click', function () {
        $("#".concat(that.id, "_editable_part")).hide();
        $("#".concat(that.id, "_static_part")).html($("#".concat(that.id, "_value")).val());
        $("#".concat(that.id, "_static_part")).show();
        $("#".concat(that.id)).show();
      });
      skymechanics.submiter($form);
      return $res;
    }
  }]);

  return VUIEditable;
}(VUIComponent);
var VUIResourceRemove =
/*#__PURE__*/
function (_VUIComponent5) {
  _inherits(VUIResourceRemove, _VUIComponent5);

  function VUIResourceRemove(a) {
    var _this4;

    var c = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    _classCallCheck(this, VUIResourceRemove);

    _this4 = _possibleConstructorReturn(this, _getPrototypeOf(VUIResourceRemove).call(this));
    _this4.action = a;
    _this4.callback = c;
    _this4.id = skymechanics.guid();
    _this4.render = _this4.render.bind(_assertThisInitialized(_this4));
    return _possibleConstructorReturn(_this4, _this4.render());
  }

  _createClass(VUIResourceRemove, [{
    key: "render",
    value: function render() {
      var that = this;
      var $form = $("<div class=\"ui form\" data-action=\"".concat(that.action, "\" id=\"").concat(that.id, "\" data-method=\"delete\" data-callback=\"").concat(that.callback || '', "\"></div>"));
      $("<button class=\"ui red icon button submit\"><i class=\"ui trash icon\"></i></button>").appendTo($form);
      skymechanics.submiter($form);
      return $form;
    }
  }]);

  return VUIResourceRemove;
}(VUIComponent);
var VUIMessage =
/*#__PURE__*/
function (_VUIComponent6) {
  _inherits(VUIMessage, _VUIComponent6);

  function VUIMessage() {
    var _this5;

    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, VUIMessage);

    _this5 = _possibleConstructorReturn(this, _getPrototypeOf(VUIMessage).call(this));
    _this5.title = data.title || __('crm.message.title');
    _this5.message = data.message || __('crm.message.empty');
    _this5.warn = data.warn || false;
    _this5.error = data.error || false;
    _this5.render = _this5.render.bind(_assertThisInitialized(_this5));
    return _possibleConstructorReturn(_this5, _this5.render());
  }

  _createClass(VUIMessage, [{
    key: "render",
    value: function render() {
      var m = "<div class=\"ui basic small modal\">\n            <div class=\"ui icon header\">\n                ".concat(this.warn ? '<i class="yellow info icon"></i>' : this.error ? '<i class="red remove icon"></i>' : '<i class="green checkmark icon"></i>', "\n                ").concat(this.title, "\n            </div>\n            <div class=\"content\" style=\"text-align:center\">\n                ").concat(this.message, "\n            </div>\n            <div class=\"actions\" style=\"text-align:center\">\n                <div class=\"ui green ok inverted button\">\n                    <i class=\"checkmark icon\"></i>\n                    ").concat(__('crm.message.ok'), "\n                </div>\n            </div>\n        </div>");
      var $message = $(m).appendTo('body').modal({
        transition: 'scale',
        allowMultiple: true,
        onHidden: function onHidden(e) {
          $(this).remove();
        }
      }).modal('show');
      return $message;
    }
  }]);

  return VUIMessage;
}(VUIComponent);
var VUIModal =
/*#__PURE__*/
function (_VUIComponent7) {
  _inherits(VUIModal, _VUIComponent7);

  function VUIModal() {
    var _this6;

    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, VUIModal);

    _this6 = _possibleConstructorReturn(this, _getPrototypeOf(VUIModal).call(this));
    _this6.title = data.title || __('crm.message.title');
    _this6.message = data.message || __('crm.message.empty');
    _this6.warn = data.warn || false;
    _this6.error = data.error || false;
    _this6.approve = data.approve || false;
    _this6.deny = data.deny || false;
    _this6.render = _this6.render.bind(_assertThisInitialized(_this6));
    return _possibleConstructorReturn(_this6, _this6.render());
  }

  _createClass(VUIModal, [{
    key: "render",
    value: function render() {
      var approve = this.approve;
      var deny = this.deny;
      var m = "<div class=\"ui mini modal\">\n            <div class=\"ui icon header\">\n                ".concat(this.title, "\n            </div>\n            <div class=\"content\" style=\"text-align:center\">\n                ").concat(this.message, "\n            </div>\n            <div class=\"actions\" style=\"text-align:center\">\n                ").concat(deny ? '<div class="ui red cancel button"><i class="checkmark icon"></i>' + __('crm.message.cancel') + '</div>' : '', "\n                ").concat(approve ? '<div class="ui green ok button"><i class="checkmark icon"></i>' + __('crm.message.ok') + '</div>' : '', "\n            </div>\n        </div>");
      var $message = $(m).appendTo('body').modal({
        transition: 'scale',
        allowMultiple: true,
        onHidden: function onHidden(e) {
          $(this).remove();
        },
        onApprove: function onApprove(e) {
          if (approve) approve(e);
        },
        onDeny: function onDeny(e) {
          if (deny) deny(e);
        }
      }).modal('show'); // if(skymechanics && skymechanics.reload) skymechanics.reload();

      return $message;
    }
  }]);

  return VUIModal;
}(VUIComponent);
var VUIPrompt =
/*#__PURE__*/
function (_VUIComponent8) {
  _inherits(VUIPrompt, _VUIComponent8);

  function VUIPrompt() {
    var _this7;

    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, VUIPrompt);

    _this7 = _possibleConstructorReturn(this, _getPrototypeOf(VUIPrompt).call(this));
    _this7.title = data.title || __('crm.message.title');
    _this7.values = data.values || false;
    _this7.render = _this7.render.bind(_assertThisInitialized(_this7));
    if (_this7.values === false) return _possibleConstructorReturn(_this7);
    return _possibleConstructorReturn(_this7, _this7.render());
  }

  _createClass(VUIPrompt, [{
    key: "render",
    value: function render() {
      var _this8 = this;

      return new Promise(function (resolve, reject) {
        var m = "<div class=\"ui mini modal\">\n                <div class=\"ui icon header\">\n                    ".concat(_this8.title, "\n                </div>\n                <div class=\"content\" style=\"text-align:center\">\n                    <div class=\"ui form\">\n                        ").concat(_this8.values.map(function (val, i) {
          return "<div class=\"ui field\">\n                                <!-- <div class=\"ui label\"></div> -->\n                                <label>".concat(val.title || 'Value', "</label>\n                                <div class=\"ui input\">\n                                    <input class=\"prompted\" type=\"text\" data-name=\"").concat(val.name || 'name', "\"  name=\"").concat(val.name || 'name', "\"  value=\"").concat(val.value || '', "\" />\n                                </div>\n                            </div>");
        }).join(), "\n                    </div>\n                </div>\n                <div class=\"actions\" style=\"text-align:center\">\n                    <div class=\"ui red cancel button\"><i class=\"checkmark icon\"></i>").concat(__('crm.message.cancel'), "</div>\n                    <div class=\"ui green ok button\"><i class=\"checkmark icon\"></i>").concat(__('crm.message.ok'), "</div>\n                </div>\n            </div>");
        $(m).appendTo('body').modal({
          transition: 'scale',
          allowMultiple: true,
          onHidden: function onHidden(e) {
            $(this).remove();
          },
          onApprove: function onApprove(e) {
            var ret = [];
            $(m).find('.prompted').each(function () {
              ret.push({
                name: $(this).data('name'),
                value: $(this).val()
              });
            });
            console.log('resolved', ret);
            resolve(ret);
          },
          onDeny: function onDeny(e) {
            resolve([]);
          }
        }).modal('show');
      });
    }
  }]);

  return VUIPrompt;
}(VUIComponent);
var VUIFileupload =
/*#__PURE__*/
function (_VUIComponent9) {
  _inherits(VUIFileupload, _VUIComponent9);

  function VUIFileupload() {
    var _this9;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, VUIFileupload);

    _this9 = _possibleConstructorReturn(this, _getPrototypeOf(VUIFileupload).call(this));
    _this9.options = $.extend({
      container: $('body'),
      action: '/',
      button: false,
      autoUpload: false,
      done: function done(e, data) {}
    }, options);
    _this9.render = _this9.render.bind(_assertThisInitialized(_this9));
    return _possibleConstructorReturn(_this9, _this9.render());
  }

  _createClass(VUIFileupload, [{
    key: "render",
    value: function render() {
      var that = this;
      var $container = that.options.container;
      var $list = $("<div class=\"ui items\"></div>").appendTo($container);
      var $progress = $("<div class=\"ui progress fileupload-progress\"><div class=\"bar\"><div class=\"progress\"></div></div><div class=\"label\">".concat(__('crm.fileuploading'), "</div></div>"));
      var $fu = $("<input class=\"ui input fileupload\" id=\"fileupload\" type=\"file\" accept=\".gif,.jpg,.jpeg,.png\" name=\"upload[]\" data-url=\"".concat(that.options.action, "\"/>")).appendTo($container).addClass('fileupload-assigned').fileupload({
        autoUpload: that.options.autoUpload,
        acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
        maxFileSize: 999000,
        disableImageResize: /Android(?!.*Chrome)|Opera/.test(window.navigator.userAgent),
        previewMaxWidth: 100,
        previewMaxHeight: 100,
        previewCrop: true
      }).on('fileuploadadd', function (e, data) {
        // $('#uploadall').removeClass('disabled');
        // console.debug('fileuploadadd',that.options.button,$progress);
        $.each(data.files, function (index, file) {
          $list.html('');
          var node = $("<div class=\"ui item\" data-name=\"".concat(file.name, "\"></div>"));
          var $imageplace = $("<div class=\"ui tiny image\"></div>").appendTo(node);
          $("<div class=\"ui middle aligned content\">\n                    <a class=\"header\">".concat(file.name, "</a>\n                    <div class=\"description\">").concat((file.size / 1024).toFixed(0), " Kb</div>\n                    <div class=\"meta red error\"></div>\n                </div>")).appendTo(node).append($progress);

          if (that.options.button) {
            that.options.button.removeClass('disabled').on('click', function () {
              var $this = $(this);
              var data = $this.data();
              $('#fileupload_progress').progress({
                percent: 0
              });
              $this.off('click').html("<i class=\"ui ban icon\"></i> ".concat(__('crm.abort')));
              $this.on('click', function () {
                $this.remove();
                data.abort();
              });
              data.submit().always(function () {
                $this.remove();
              });
            }).data(data);
          }

          data.context = node;
          node.appendTo($list);
          var image = image = new Image();
          $(image).on('load', function () {
            var dim = this.width / this.height;
            var $this = $(this);
            var data = $this.data();
            $imageplace.append(image);

            if (dim < 1.6) {
              data.abort();
              console.log("The image width is " + this.width + " and image height is " + this.height + " dim=" + dim, dim < 4 / 3);
              console.warn('wrong image format');
              var error = $('<span class="text-danger"/>').text(__('crm.options.banner_file_wrong_dim'));
              node.find('.meta').append(error);
            } else {
              console.debug(data);
              data.submit();
            }
          }).data(data);
          image.src = window.URL.createObjectURL(file);
        });
      }).on('fileuploadprocessalways', function (e, data) {
        var index = data.index,
            file = data.files[index],
            node = $(data.context.children()[index]);
        console.debug('fileuploadprocessalways', file);

        if (file.preview) {
          node.prepend(file.preview);
        }

        if (file.error) {
          node.append($('<span class="text-danger"/>').text(file.error));
        }
      }).on('fileuploadprogressall', function (e, data) {
        console.debug('fileuploadprogressall:', e);
        var $prog = data.context; // data.bitrate

        $('.fileupload-progress:first').progress({
          percent: parseInt(data.loaded / data.total * 100, 10)
        });
      }).on('fileuploaddone', function (e, data) {
        data.context.remove(); // const img = (doc.file.match(/\.(pdf|docx?)$/))
        //     ?`<iframe src="https://docs.google.com/viewer?url=${document.location.hostname}/${doc.file}&embedded=true" style="width: 100%; height: 100%" frameborder="0">${__('crm.message.browser_doesnt_support')}</iframe>`
        //     :`<img src="${doc.file}"/>`;
        // $(`#uploaded_${user.id}`).append(`<div class="card" id="kyc_${user.id}_${doc.id}">
        //     <a class="ui image" style="position:relative;" href="javascript:0" onclick="page.image.view(this,{'<i class=\\'check icon\\'></i>':'crm.user.kyc.accept(${doc.id},${user.id})','<i class=\\'ban icon\\'></i>':'crm.user.kyc.decline(${doc.id},${user.id})'})">
        //         <div style="background-color:rgba(33,186,69,.2);position:absolute;width:100%;height:100%;"><i class="ui big green check icon"></i></div>
        //         ${img}
        //     </a>
        //     <div class="content">
        //         <div class="meta">
        //             ${doc.created_at}
        //         </div>
        //     </div>
        //     <div class="actions">
        //         <button class="ui icon black button" onclick="crm.user.kyc.delete(${doc.id},${user.id})"><i class="ui trash icon"></i></button>
        //     </div>
        // </div>`);

        that.options.done(e, data);
      }).on('fileuploadfail', function (e, data) {
        $.each(data.files, function (index) {
          var error = $('<span class="text-danger"/>').text('File upload failed.');
          $(data.context.children()[index]).append('<br>').append(error);
        });
      }).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');
      return $fu;
    }
  }]);

  return VUIFileupload;
}(VUIComponent);

/***/ }),

/***/ "./resources/assets/js/core/defer.js":
/*!*******************************************!*\
  !*** ./resources/assets/js/core/defer.js ***!
  \*******************************************/
/*! exports provided: Defer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Defer", function() { return Defer; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Defer =
/*#__PURE__*/
function () {
  function Defer(data, model, callback) {
    var need = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    _classCallCheck(this, Defer);

    this.data = data;
    this.model = model;
    this.callback = callback;
    this.need = need;
    this.load = this.load.bind(this);
    this.load();
  }

  _createClass(Defer, [{
    key: "load",
    value: function load() {
      var that = this;
      var data = that.data,
          model = that.model,
          need = that.need,
          callback = that.callback;
      if (!data.id) return;

      if (data[need]) {
        callback(data);
        return;
      }

      $.ajax({
        url: "/".concat(model, "/").concat(data.id),
        success: function success(d) {
          $.extend(data, d);
          callback(data);
        }
      });
    }
  }]);

  return Defer;
}();

/***/ }),

/***/ "./resources/assets/js/core/pagination.js":
/*!************************************************!*\
  !*** ./resources/assets/js/core/pagination.js ***!
  \************************************************/
/*! exports provided: VUIPaginate */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VUIPaginate", function() { return VUIPaginate; });
/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../components */ "./resources/assets/js/components/index.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }


var VUIPaginate = // page.paginate(d, 'user-list', container, `<div class="ui basic icon button open-in-cards" onclick="crm.user.card($('[data-name=user_selected]:checked'),'kyc',this)" style="display:none;"><i class="address card outline icon"></i> ${__('crm.open_in_cards')}</div>`);
function VUIPaginate(d) {
  var tl = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'data-list';
  var $t = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

  _classCallCheck(this, VUIPaginate);

  var s = '';
  if ($t && $t.data('name')) tl = $t.attr('data-name');
  if ($t && $t.data('id')) tl = $t.attr('data-id');
  if (d == false) return;
  var from = 1,
      to = d.last_page;
  from = d.current_page - 3 > from ? d.current_page - 3 : from;
  to = d.current_page + 3 <= to ? d.current_page + 3 : to;
  s += '<div class="ui pagination borderless menu" style="margin:auto;">';
  s += '<div class="item"><a class="requester" data-name="page" data-value="1" href="javascript:void(0);" data-trigger="click" data-target="' + tl + '">First page</a></div>';
  if (d.prev_page_url) s += '<div class="item prev"><a class="requester" data-name="page" data-value="' + (d.current_page - 1) + '" href="javascript:void(0);" data-trigger="click" data-target="' + tl + '">...</a></div>';

  for (var i = from; i <= to; ++i) {
    s += '<div class="item ' + (d.current_page == i ? "active" : "") + '"><a class="requester" data-name="page" data-value="' + i + '" href="javascript:void(0);" data-trigger="click" data-target="' + tl + '">' + i + '</a></div>';
  }

  if (d.next_page_url) s += '<div class="item next"><a class="requester" data-name="page" data-value="' + (d.current_page + 1) + '" href="javascript:void(0);" data-trigger="click" data-target="' + tl + '">...</a></div>';
  s += '<div class="item"><a class="requester" data-name="page" data-value="' + d.last_page + '" href="javascript:void(0);" data-trigger="click" data-target="' + tl + '">Last page</a></div>';
  s += "<div class=\"ui last item\"><div class=\"ui labeled input\"><div class=\"ui label\">".concat(__('crm.exactly_page'), "</div><input class=\"requester\" data-trigger=\"enter\" data-target=\"").concat(tl, "\" type=\"number\" data-name=\"page\" placeholder=\"").concat(__('crm.max_page'), " ").concat(d.last_page, "\" max=\"").concat(d.last_page, "\"/></div>"); // s+=`<div class="ui right menu"><div class="item"><div class="ui labeled input"><div class="ui label">${__('crm.exactly_page')}</div><input class="requester" data-trigger="enter" data-target="${tl}" type="number" data-name="page" placeholder="${__('crm.max_page')} ${d.last_page}" max="${d.last_page}"/></div></div></div>`;

  s += '</div>'; // s+='<div class="total_item"><span>'+d.current_page+'</span>/<span>'+d.last_page+'</span></div>';

  if ($t) {
    var $parent = $t.prop('tagName') == 'TBODY' ? $t.parent() : $t;
    var $pp = $parent.parent().find(".pagination"),
        $totals = $parent.parent().find('.list-totals'); // console.debug('pagination',$parent.parent(),$parent,$t,$totals,$pp)

    if (!$pp.length) $pp = $('<div class="pagination ui attached message" style="width:100%;text-align:center;"></div>').insertAfter($parent);
    $pp.html(s);

    if (!$totals.length) {
      $totals = $('<div class="ui top attached borderless secondary menu fluid list-totals"></div>').insertBefore($parent);
      $totals.append("<div class=\"item\">".concat(__('crm.dashboard.totals'), ":&nbsp;&nbsp;<span class=\"ui header total\" number=\"'+d.total+'\"></span></div>"));

      for (var j = 3; j < arguments.length; ++j) {
        var strArgs = arguments[j] || undefined;
        if (strArgs) $totals.append('<div class="item">' + strArgs + '</div>');
      } // if($.inArray(tl,['user-list'])){
      //     var $btn = $('<button class="ui basic icon labeled button requester" data-name="export" data-value="xlsx" data-trigger="click" data-target="'+tl+'"><i class="file excel outline icon"></i> Export</button>').appendTo($('<div class="item"></div>').appendTo($totals));
      // }


      var $totalRight = $('<div class="right menu"></div>').appendTo($totals);
      var $pagination = $('<select class="ui compact dropdown requester" data-name="per_page" data-trigger="change" data-target="' + tl + '"></select>').appendTo($('<div class="item">Per page: </div>').appendTo($totalRight)),
          per_page = $.cookie('per_page'),
          options = [15, 20, 30, 50, 100, 500];

      if (!per_page) {
        $.cookie('per_page', 15);
        per_page = 15;
      }

      for (var i in options) {
        $pagination.append('<option' + (options[i] == per_page ? ' selected' : '') + '>' + options[i] + '</option>');
      }

      $pagination.on('change', function () {
        var pp = $(this).dropdown('get value');
        $.cookie('per_page', pp[0]);
        skymechanics.touch(tl);
      }); // $('<button class="ui basic icon button updater" data-target="'+tl+'"><i class="refresh icon"></i></button>').appendTo($('<div class="item"></div>').appendTo($totalRight)).on('click',function(){skymechanics.touch($(this).attr('data-target'));});

      $('<button class="ui basic icon button updater" data-target="' + tl + '"><i class="refresh icon"></i></button>').appendTo($('<div class="item"></div>').appendTo($totalRight)).on('click', function () {
        skymechanics.touch(tl);
      });
    }

    $totals.find('.total').animateNumber({
      number: d.total
    }).prop('number', d.total); // $totals.find('.updater').attr('data-target',tl);

    skymechanics.reload();
  }
};

/***/ }),

/***/ "./resources/assets/js/core/submiter.js":
/*!**********************************************!*\
  !*** ./resources/assets/js/core/submiter.js ***!
  \**********************************************/
/*! exports provided: VUISubmiter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VUISubmiter", function() { return VUISubmiter; });
/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../components */ "./resources/assets/js/components/index.js");
function _readOnlyError(name) { throw new Error("\"" + name + "\" is read-only"); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }


var VUISubmiter =
/*#__PURE__*/
function () {
  function VUISubmiter(that) {
    _classCallCheck(this, VUISubmiter);

    this.container = $(that);
    this.clickfn = this.clickfn.bind(this);
    this.getargs = this.getargs.bind(this);
    this.checkvals = this.checkvals.bind(this);
    this.google2fa = this.google2fa.bind(this);
    this.query = this.query.bind(this);
    this.checkGoogle2faCondition = this.checkGoogle2faCondition.bind(this);
    this.$buttonSubmiter = this.container.find('.submit');
    this.container.find('.cancel').on('click', function () {});

    if (this.container.data("autostart")) {
      // console.log('VUISubmiter autostart=',this.container.data("autostart"),this.clickfn());
      this.clickfn();
    } else {
      var trigger = this.$buttonSubmiter.data('trigger') || 'click';
      var clickfn = this.clickfn;
      this.$buttonSubmiter.on(trigger, function (e) {
        clickfn();
      });
    }
  }

  _createClass(VUISubmiter, [{
    key: "checkvals",
    value: function checkvals($c) {
      var ret = true;
      $c.find('input,textarea,select').filter('[required]:visible').each(function () {
        if (!ret) return;

        if ($(this).val().length == 0) {
          $(this).addClass('value-empty').focus();
          ret = false;
        } else $(this).removeClass('value-empty');
      });
      $c.find('input').each(function () {
        if (!ret) return;
        var min = parseFloat($(this).attr('min')),
            max = parseFloat($(this).attr('max')),
            val = parseFloat($(this).val()),
            $that = $(this),
            $alerter = $that.next('.alerter'),
            popup = $(this).attr('data-validate-text');
        if (!$alerter.length) $alerter = $('<span class="red alerter" style="display:none;"></span>').insertAfter($that);
        if (popup == undefined) popup = 'Value should be from ' + min;
        popup = popup.replace(/\{([^\}]+)\}/g, function (m, p, o, s) {
          if (p == 'min') return min;
          if (p == 'max') return max;
        });

        if (min) {
          if (val < min) {
            ret = false;
            $alerter.text(popup);
            $alerter.fadeIn();
          } else $alerter.fadeOut();
        }

        if (max) {
          if (val > max) {
            ret = false;
            $alerter.text(popup);
            $alerter.fadeIn();
          } else $alerter.fadeOut();
        }
      });
      return ret;
    }
  }, {
    key: "getargs",
    value: function getargs($c) {
      var args = {};
      $c.find("input,select,textarea").each(function () {
        var n = $(this).attr("data-name"),
            v = $(this).attr('type') == 'checkbox' ? $(this).is(':checked') ? "1" : '0' : $(this).val();

        if ($(this).hasClass('-ui-calendar')) {
          var date = $(this).parents('.ui.calendar').calendar('get date');
          v = date.getFullYear() + '-' + (1 + date.getMonth()).leftPad() + '-' + date.getDate().leftPad() + ' ' + date.getHours().leftPad() + ':' + date.getMinutes().leftPad() + ":" + date.getSeconds().leftPad();
        }

        if ($(this).data('prompt')) {
          v = prompt($(this).data('title'), v); // const vals = new VUIPrompt({
          //     title:$(this).data('title'),
          //     values:[
          //         {
          //             title:$(this).data('title'),
          //             value:v,
          //             name:n
          //         }
          //     ]
          // });
          // console.log('VUIPrompted ',vals);
        }

        if (n != undefined && n.length) {
          var nn = n.split(/\./),
              argss = args;

          if (nn.length > 1) {
            for (var i = 0; i < nn.length - 1; ++i) {
              argss[nn[i]] = argss[nn[i]] ? argss[nn[i]] : {};
              argss = argss[nn[i]];
            }

            n = nn[nn.length - 1];
          }

          argss[n] = v;
        }
      });
      return args;
    }
  }, {
    key: "google2fa",
    value: function google2fa(args) {
      var error = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var container = this.container;
      return new Promise(function (resolve, reject) {
        var $modal = new _components__WEBPACK_IMPORTED_MODULE_0__["VUIModal"]({
          title: __('crm.private.google2fa.one_time_password'),
          message: "<div class=\"ui form\">\n                        <div class=\"ui field\">\n                            <div class=\"ui massive icon blue color input\">\n                                <input id=\"one_time_password\" class=\"google2fa-otp\" class=\"ui huge input\" name=\"one_time_password\" required autofocus/>\n                                <i class=\"ui google blue color icon\"></i>\n                            </div>\n                            ".concat(error ? '<div class="ui error bottom attached message">' + error.message + '</div>' : '', "\n                        </div>\n                    </div>"),
          approve: function approve($e) {
            console.log('approving', $e.parents('.form'), $e.parent('.form').find('#one_time_password'));
            args['__g2fa'] = $('#one_time_password').val();
            resolve(args);
          },
          deny: function deny($e) {
            console.log('decline', $e); // document.location.reload(true);

            reject(args);
          }
        });
        $('#one_time_password').inputmask({
          autoUnmask: true,
          mask: "999 999"
        });
        $('#one_time_password').on("keyup", function () {
          var val = $(this).val();
          if (val.length == 6) $modal.find('.ok.button').trigger('click');
        });
      });
    }
  }, {
    key: "query",
    value: function query(args) {
      var container = this.container,
          $buttonSubmiter = this.$buttonSubmiter,
          google2fa = this.google2fa;
      var callback = getFunctionByName(container.attr("data-callback"));

      var _error = container.attr("data-callback-error");

      var btnText = $buttonSubmiter.html();
      var action = container.attr("data-action");
      var ftype = container.attr("data-method") || 'GET';
      $.ajax({
        url: action,
        data: args,
        type: ftype,
        beforeSend: function beforeSend() {
          if ($buttonSubmiter.find('i.icon').length) $buttonSubmiter.find('i.icon').replaceWith('<i class="cf-loader fa fa-spin fa-fw fa-circle-o-notch"></i>');else $buttonSubmiter.html('<i class="cf-loader fa fa-spin fa-fw fa-circle-o-notch"></i>');
        },
        success: function success(d) {
          callback(d, container, args);

          if (d.redirect) {
            if (d.redirect.form) {
              $(d.redirect.form).appendTo('body').submit();
            } else if (d.redirect.url) {
              document.location.href = d.redirect.url;
            }
          } else if (d.append) {
            if (d.append.view) {
              $(d.append.view).appendTo('body');
            }
          }
        },
        error: function error(x, s) {
          console.debug('Error in submiter response', container.find('.changed'), x.responseJSON);
          container.find('.need-rollback').each(function () {
            var $that = $(this);
            var val = $that.data('rollback-value');
            console.log('rollback changes', $that, val);

            if ($that.hasClass('checkbox')) {
              // const $check = $that.parents('.checkbox:first');
              var $check = $that;
              console.log('rollback changes on checkbox', $check);
              $check.checkbox("set ".concat(val == 1 ? 'checked' : 'unchecked'));
            }

            $that.removeClass('need-rollback');
          });

          try {
            var err = x.responseJSON;

            if (err.error && err.error == 762) {
              new _components__WEBPACK_IMPORTED_MODULE_0__["VUIMessage"]({
                error: true,
                title: __('crm.error'),
                message: err.message
              });
              return;
            }
          } catch (e) {
            console.error(e);
          }

          try {
            if (_error) {
              _error = (_readOnlyError("error"), getFunctionByName(_error));

              _error(x.responseJSON, container, args);
            } else callback(x.responseJSON, container, args);
          } catch (e) {
            console.error(e);
          }

          console.error(x.responseJSON, args);
        },
        complete: function complete() {
          $buttonSubmiter.html(btnText);
        }
      });
    }
  }, {
    key: "clickfn",
    value: function clickfn(e) {
      var _this = this;

      var container = this.container;
      if (e) e.preventDefault();
      if (e) e.stopPropagation();
      if (!this.checkvals(container)) return false;
      var args = this.getargs(container);
      var g2fa = container.data('google2fa') || false;
      var g2faCondition = container.data('google2fa-condition') || false;
      if (window.user.google2fa == "1" && g2fa && this.checkGoogle2faCondition(args, g2faCondition)) this.google2fa(args).then(function (arge) {
        _this.query(arge);
      })["catch"](function (arge) {});else this.query(args);
    }
  }, {
    key: "checkGoogle2faCondition",
    value: function checkGoogle2faCondition(args, condition) {
      if (condition == false) return true;
      console.debug('VUISubmiter.checkGoogle2faCondition', args, eval("args.".concat(condition)));
      return eval("args.".concat(condition));
    }
  }]);

  return VUISubmiter;
}();

/***/ }),

/***/ "./resources/assets/js/crm.js":
/*!************************************!*\
  !*** ./resources/assets/js/crm.js ***!
  \************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_messages__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/messages */ "./resources/assets/js/modules/messages.js");
/* harmony import */ var _modules_finance__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/finance */ "./resources/assets/js/modules/finance.js");
/* harmony import */ var _modules_deals__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/deals */ "./resources/assets/js/modules/deals.js");
/* harmony import */ var _modules_affilate__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modules/affilate */ "./resources/assets/js/modules/affilate.js");
/* harmony import */ var _modules_brands__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./modules/brands */ "./resources/assets/js/modules/brands.js");
/* harmony import */ var _modules_events__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./modules/events */ "./resources/assets/js/modules/events.js");
/* harmony import */ var _modules_instruments__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./modules/instruments */ "./resources/assets/js/modules/instruments.js");
/* harmony import */ var _modules_user__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./modules/user */ "./resources/assets/js/modules/user.js");
/* harmony import */ var _modules_lead__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./modules/lead */ "./resources/assets/js/modules/lead.js");
/* harmony import */ var _modules_newsfeed__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./modules/newsfeed */ "./resources/assets/js/modules/newsfeed.js");
/* harmony import */ var _modules_partner__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./modules/partner */ "./resources/assets/js/modules/partner.js");
/* harmony import */ var _modules_telephony__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./modules/telephony */ "./resources/assets/js/modules/telephony.js");
/* harmony import */ var _modules_merchant__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./modules/merchant */ "./resources/assets/js/modules/merchant.js");
/* harmony import */ var _modules_online__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./modules/online */ "./resources/assets/js/modules/online.js");
/* harmony import */ var _modules_clock__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./modules/clock */ "./resources/assets/js/modules/clock.js");
/* harmony import */ var _modules_chart_index__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./modules/chart/index */ "./resources/assets/js/modules/chart/index.js");
/* harmony import */ var _components_container__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./components/container */ "./resources/assets/js/components/container.js");
/* harmony import */ var _modules_dashboard__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./modules/dashboard */ "./resources/assets/js/modules/dashboard/index.js");
/* harmony import */ var _modules_options_private__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./modules/options/private */ "./resources/assets/js/modules/options/private.js");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { keys.push.apply(keys, Object.getOwnPropertySymbols(object)); } if (enumerableOnly) keys = keys.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

// import {imap} from './crm.imap.js';



















var version = '3.1';
window.cardContainer = new _components_container__WEBPACK_IMPORTED_MODULE_16__["Container"]();
window.SUBSCRIBE_PRICE = false;
window.tradehost = window.document.location.hostname; //.replace(/crm\./ig,"trade.");

window.crm = {
  charts: [],
  affilate: new _modules_affilate__WEBPACK_IMPORTED_MODULE_3__["Affilate"](),
  brands: new _modules_brands__WEBPACK_IMPORTED_MODULE_4__["Brands"](),
  deal: new _modules_deals__WEBPACK_IMPORTED_MODULE_2__["Deals"](),
  comments: new _modules_messages__WEBPACK_IMPORTED_MODULE_0__["Comments"](),
  events: new _modules_events__WEBPACK_IMPORTED_MODULE_5__["Events"](),
  finance: new _modules_finance__WEBPACK_IMPORTED_MODULE_1__["Finance"](),
  "import": function _import(m) {
    var version = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "3.0";
    var src = document.createElement('script');
    src.setAttribute('src', "/crm.".concat(version, "/js/crm.").concat(m, ".js"));
    document.body.appendChild(src);
  },
  instrument: new _modules_instruments__WEBPACK_IMPORTED_MODULE_6__["Pairs"](),
  json2html: function json2html(j) {
    var r = '';

    if (_typeof(j) != 'object') {
      try {
        j = JSON.parse(j);
      } catch (e) {
        console.warn(e);
        return r;
      }
    }

    Object.keys(j).map(function (k, i) {
      var v = j[k];
      r += "<code>".concat(k, "</code>: <strong>").concat(v, "</strong>&nbsp;&nbsp;");
    });
    return r;
  },
  lead: new _modules_lead__WEBPACK_IMPORTED_MODULE_8__["Lead"](),
  merchant: new _modules_merchant__WEBPACK_IMPORTED_MODULE_12__["Merchant"](),
  messages: new _modules_messages__WEBPACK_IMPORTED_MODULE_0__["Messages"](),
  mail: new _modules_messages__WEBPACK_IMPORTED_MODULE_0__["Mails"](),
  newsfeed: new _modules_newsfeed__WEBPACK_IMPORTED_MODULE_9__["Newsfeed"](),
  partner: new _modules_partner__WEBPACK_IMPORTED_MODULE_10__["Partner"](),
  telephony: new _modules_telephony__WEBPACK_IMPORTED_MODULE_11__["Telephony"](),
  user: new _modules_user__WEBPACK_IMPORTED_MODULE_7__["Users"]()
};
var acceptedUrlAction = false;
var re = /^.+#(\S+)=(\d+)$/ig,
    urlAction = re.exec(document.location.href);

if (urlAction && !acceptedUrlAction) {
  var act = crm;
  var module = urlAction[1];
  var id = urlAction[2];

  try {
    act[module].info(id);
    document.title = "#".concat(id, " CRM ").concat(system.app);
  } catch (e) {
    console.error(e);
  }

  acceptedUrlAction = true;
}

window.socket = window.location.hostname.match(/\.bs$/ig) ? new io("".concat(window.document.location.hostname, ":").concat(window.wsport), {
  'reconnect': true,
  'reconnection delay': 3200,
  'max reconnection attempts': 5,
  'secure': true
}) : new io(); // window.socket =new io(`${window.wshost}:${window.wsport}`,{
//         'reconnect': true,
//         'reconnection delay': 3200,
//         'max reconnection attempts': 5
//         ,'secure': true
//     });

window.onlineUsers = new _modules_online__WEBPACK_IMPORTED_MODULE_13__["OnlineUsers"]();
socket.on('connect', function () {
  socket.emit('user_info', {
    userId: window.user.id
  });
  $('#reenable_connection').slideUp();
});
socket.on('disconnect', function () {
  console.warn('socket connection lost'); // $('#reenable_connection').slideDown();
}); // socket.on('disconnect', (reason) => {
//     console.warn('disconnected from socket');
//     if (reason === 'io server disconnect') {
//         socket.connect();
//     }
// });

socket.on('all_user', function (data) {
  onlineUsers.handle(data.users);
});

if (window.user.can.trades) {
  socket.on('ohlc', function (e) {
    var tick = {
      instrument_id: e.data.pair.id,
      price: e.data.close,
      time: e.data.time,
      volation: e.data.volation,
      pair: e.data.pair,
      tune: e.data.tune,
      user: e.data.user ? e.data.user : undefined
    };
    crm.instrument.prices.render($('#prices'), tick); // if(SUBSCRIBE_PRICE)
    // crm.deal.onPrice(tick)

    for (var i in cardContainer.cards) {
      var card = cardContainer.cards[i];
      if (card.ohlc) card.ohlc(tick);
    } // if(e.data.tune)console.debug('ohlc event tune',tick,e.data);

  });
}

window.sockettime = {
  event: 0,
  user: 0,
  ohlc: 0,
  userstate: 0
};
socket.on('event', function (e) {
  var tt = new Date().getTime();
  crm.events.append(e.data);
  window.sockettime.event = window.sockettime.event == 0 ? new Date().getTime() - tt : (window.sockettime.event + new Date().getTime() - tt) / 2;
});
socket.on('user', function (e) {
  var tt = new Date().getTime();

  if (cardContainer.cards["cuser_".concat(e.data.id)]) {
    cardContainer.cards["cuser_".concat(e.data.id)].fresh(e.data);
    cardContainer.touch("cuser_".concat(e.data.id));
  } // console.debug('user event',e.data)


  if (window.onlineUsers.list[e.data.id]) {
    window.onlineUsers.list[e.data.id] = e.data;
    window.onlineUsers.render(e.data);
  }

  if (e.data.id == window.user.id) {
    console.debug('myself change', e.data); //myself

    if (e.data.rights_id != window.user.rights_id) {
      //logout
      document.getElementById('logout-form').submit();
    }
  }

  window.sockettime.user = window.sockettime.user == 0 ? new Date().getTime() - tt : (window.sockettime.user + new Date().getTime() - tt) / 2;
  if (window.sockettime.userstate == 0) console.log(e);
  window.sockettime.userstate = window.sockettime.userstate == 0 ? e.data.loaded : (window.sockettime.userstate + e.data.loaded) / 2;
});
window.timeStart = new Date();
window.ohlcCounter = {
  total: 0,
  minute: timeStart.getTime() - timeStart.getTime() % 60000
};
window.lastOhlcCounter = false;
window.lastOhlc = null;
socket.on('ohlc', function (e) {
  var tt = new Date().getTime();
  var ohlc = e.data;
  var pr = {
    instrument_id: ohlc.instrument_id,
    time: ohlc.time,
    price: ohlc.close,
    pair: ohlc.pair,
    source: ohlc.source,
    source_id: ohlc.source_id,
    volation: ohlc.volation,
    tune: ohlc.tune ? true : false
  };
  if (!pr.tune) crm.instrument.prices.render($('#prices'), pr);
  crm.deal.onPrice(pr);
  new Promise(function (resolve, reject) {
    var time = new Date().getTime();
    var minute = time - time % 60000;

    if (window.ohlcCounter.minute < minute) {
      window.lastOhlcCounter = window.lastOhlcCounter ? window.lastOhlcCounter : _objectSpread({}, window.ohlcCounter, {
        count: 1
      });
      window.lastOhlcCounter.total += window.ohlcCounter.total;
      window.lastOhlcCounter.count++;
      window.lastOhlcCounter.avg = Math.floor(window.lastOhlcCounter.total / window.lastOhlcCounter.count);
      window.ohlcCounter = {
        total: 0,
        minute: minute
      };
    }

    window.ohlcCounter[ohlc.pair.symbol] = window.ohlcCounter[ohlc.pair.symbol] ? window.ohlcCounter[ohlc.pair.symbol] : {
      minute: parseInt(ohlc.time) - parseInt(ohlc.time) % 60000,
      total: 0
    };
    window.ohlcCounter.total++;
    window.ohlcCounter[ohlc.pair.symbol].total++;
  });
  window.lastOhlc = pr;
  window.sockettime.ohlc = window.sockettime.ohlc == 0 ? new Date().getTime() - tt : (window.sockettime.ohlc + new Date().getTime() - tt) / 2;
});
$('#body_event_trigger').on('crm.user::loaded', function () {
  // const modules = ['clock','events','affilate','lead','instruments','merchant','scheduler','chat','imap','brands'];
  // modules.map( (module,i) => {crm.import(module);});
  $('body').trigger('crm.loaded', crm);
});
var clock = new _modules_clock__WEBPACK_IMPORTED_MODULE_14__["Clock"]('#clock');
clock.render();
setInterval(clock.render, 1000); // dashboardds

var dashboardObject = new _modules_dashboard__WEBPACK_IMPORTED_MODULE_17__["Dashboard"]();
window.dashboard_trades = dashboardObject.trades;

window.register2fasecret = function (d, c, a) {
  var prv = new _modules_options_private__WEBPACK_IMPORTED_MODULE_18__["Private"](d, c, a);
};

window.confirm2fasecret = function (d, c, a) {
  console.debug('need confirm');
  var prv = new _modules_options_private__WEBPACK_IMPORTED_MODULE_18__["Private"](d, c, a);
};

/***/ }),

/***/ "./resources/assets/js/functions.js":
/*!******************************************!*\
  !*** ./resources/assets/js/functions.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

Number.prototype.decimal = function () {
  return this;
};

Number.prototype.integer = function () {
  return this;
};

String.prototype.decimal = function () {
  return parseFloat(this);
};

String.prototype.integer = function () {
  return parseInt(this);
};

Number.prototype.timestamp = function () {
  var date = new Date(this * 1000);
  var res = "".concat(date.getSMYear().leftPad(), "-").concat((date.getSMMonth() + 1).leftPad(), "-").concat(date.getSMDate().leftPad(), " ").concat(date.getSMHours().leftPad(), ":").concat(date.getSMMinutes().leftPad(), ":").concat(date.getSMSeconds().leftPad());
  return res;
};

String.prototype.timestamp = function () {
  return this.integer().timestamp();
};

Date.prototype.getSMYear = function () {
  return USE_UTC ? this.getUTCFullYear() : this.getFullYear();
};

Date.prototype.getSMMonth = function () {
  return USE_UTC ? this.getUTCMonth() : this.getMonth();
};

Date.prototype.getSMDate = function () {
  return USE_UTC ? this.getUTCDate() : this.getDate();
};

Date.prototype.getSMHours = function () {
  return USE_UTC ? this.getUTCHours() : this.getHours();
};

Date.prototype.getSMMinutes = function () {
  return USE_UTC ? this.getUTCMinutes() : this.getMinutes();
};

Date.prototype.getSMSeconds = function () {
  return USE_UTC ? this.getUTCSeconds() : this.getSeconds();
};

window.truncDay = function (d) {
  var r = parseInt(d);
  return r - r % (1000 * 60 * 60 * 24);
};

window.leftZeroPad = function (s) {
  var ret = s.toString(),
      length = ret.length,
      defaults = {
    symbol: '0',
    maxLength: 2
  },
      opts = $.extend(defaults, arguments.length > 1 ? arguments[1] : {});

  for (var i = 0; i < opts.maxLength - length; ++i) {
    ret = opts.symbol + ret;
  }

  return ret;
}; // window.amountFormat = function(d){
//     var s = parseFloat(d);
//     if(isNaN(s))return 0;
//     return s.toLocaleString();
// }


window.dateFormat = function (d) {
  if (d == null || d == '' || typeof d == "undefined") return '';
  var date = new Date(d * 1000),
      withTime = arguments.length > 1 ? arguments[1] : true,
      style = arguments.length > 2 ? arguments[2] : 'new',
      res = '<small>' + date.getSMYear() + '</small><br>';
  if (isNaN(date.getSMYear())) return '';
  if (style == 'simple') res = date.getSMYear() + '-' + (date.getSMMonth() + 1).leftPad() + '-' + date.getSMDate().leftPad() + ' ';else {
    res += '<span class="ui basic circular label huge">' + leftZeroPad(date.getSMDate()) + '</span><br/>';
    res += '<small>' + system.months[date.getSMMonth()] + '</small>';
  }

  if (withTime) {
    res += '<br><small>' + leftZeroPad(date.getSMHours());
    res += ':' + leftZeroPad(date.getSMMinutes());
    res += ':' + leftZeroPad(date.getSMSeconds()) + '</small>';
  }

  return res;
};

window.splitObjectKeys = function (o) {
  var k = [],
      v = [];

  for (var i in o) {
    k.push(i);
    v.push(o[i]);
  }

  return {
    keys: k,
    values: v
  };
};

window.splitObject2XY = function (o) {
  var ret = [];

  for (var i in o) {
    var key = i;

    try {
      key = new Date(key);
    } catch (e) {}

    ret.push({
      x: key,
      y: o[i]
    });
  }

  return ret;
};

String.prototype.datetime = function () {
  return parseInt(this).datetime(arguments[0] || {});
};

Number.prototype.datetime = function () {
  var date = new Date(this * 1000),
      opts = $.extend({
    show: {
      time: true,
      date: true
    },
    style: 'cool'
  }, arguments.length ? arguments[0] : {}),
      res = '';
  if (isNaN(date.getSMYear())) return '';

  if (opts.style == 'simple') {
    if (opts.show.date) res += date.getSMYear() + '-' + leftZeroPad(date.getSMMonth() + 1) + '-' + leftZeroPad(date.getSMDate()) + ' ';

    if (opts.show.time) {
      res += '<small>' + leftZeroPad(date.getSMHours());
      res += ':' + leftZeroPad(date.getSMMinutes());
      res += ':' + leftZeroPad(date.getSMSeconds()) + '</small>';
    }
  } else if (opts.style == 'cool') {
    res = '<small>' + date.getSMYear() + '</small><br>';
    res += '<span class="ui basic circular label huge">' + leftZeroPad(date.getSMDate()) + '</span><br/>';
    res += '<small>' + system.months[date.getSMMonth()] + '</small>';

    if (opts.show.time) {
      res += '<br/>';
      res += '<small>' + leftZeroPad(date.getSMHours());
      res += ':' + leftZeroPad(date.getSMMinutes());
      res += ':' + leftZeroPad(date.getSMSeconds()) + '</small>';
    }
  } else if (opts.style == 'time') {
    res += leftZeroPad(date.getSMHours());
    res += ':' + leftZeroPad(date.getSMMinutes());
    res += ':' + leftZeroPad(date.getSMSeconds());
  }

  return res;
};

String.prototype.currency = function () {
  var p = arguments[1] || 2,
      s = arguments[0] || ''; //,v = parseFloat(this).toFixed(p),sp = v.split(/\./);

  return parseFloat(this).currency(s, p);

  if (sp.length > 1) {
    var d = sp[0],
        r = d.split('').reverse().join('');
    r = r.replace(/(\d{3})/g, '$1 ');
    v = r.split('').reverse().join('').replace(/^\s/, '') + '.' + sp[1];
  }

  return s + v;
};

Number.prototype.currency = function () {
  var p = arguments[1] || 2,
      s = arguments[0] || '',
      v = Math.abs(this).toFixed(p),
      sp = v.split(/\./),
      sign = this < 0 ? '-' : '';

  if (sp.length > 1) {
    var d = sp[0],
        r = d.split('').reverse().join('');
    r = r.replace(/(\d{3})/g, '$1 ');
    v = r.split('').reverse().join('').replace(/^\s/, '') + '.' + sp[1];
  }

  return sign + s.replace(/\s/ig, '') + v.replace(/^\s*/ig, '');
};

String.prototype.digit = function () {
  parseFloat(this).digit(arguments.length ? arguments[0] : 2);
};

Number.prototype.digit = function () {
  var p = arguments[0] || getPointPosition(this);
  var v = this.toFixed(p);
  var sp = v.split(/\./);

  if (sp.length > 1) {
    var d = sp[0],
        r = d.split('').reverse().join('');
    r = r.replace(/(\d{3})/g, '$1 ');
    v = r.split('').reverse().join('').replace(/^\s/, '') + '.' + sp[1];
  }

  return v;
};

Number.prototype.dollars = function () {
  var cur = '$';
  if (document.location.href.match(/windigoarena/)) cur = 'W';
  return this.currency(cur, 2);
};

String.prototype.dollars = function () {
  var cur = '$';
  if (document.location.href.match(/windigoarena/)) cur = 'W';
  return this.currency(cur, 2);
};

Number.prototype.percent = function () {
  var ret = this * 100;
  return ret.currency('', 2) + '%';
};

String.prototype.percent = function () {
  var ret = parseFloat(this) * 100;
  return ret.currency('', 2) + '%';
};

String.prototype.leftPad = function () {
  var ret = this,
      length = ret.length,
      defaults = {
    symbol: '0',
    maxLength: 2
  },
      opts = $.extend(defaults, arguments.length > 1 ? arguments[1] : {});

  for (var i = 0; i < opts.maxLength - length; ++i) {
    ret = opts.symbol + ret;
  }

  return ret;
};

Number.prototype.leftPad = function () {
  var ret = this.toString(),
      length = ret.length,
      defaults = {
    symbol: '0',
    maxLength: 2
  },
      opts = $.extend(defaults, arguments.length > 1 ? arguments[1] : {});

  for (var i = 0; i < opts.maxLength - length; ++i) {
    ret = opts.symbol + ret;
  }

  return ret;
};

window.copyValue = function (that, t) {
  console.debug('copyValue', that, t); // const copyText = document.querySelector(`${t}`);

  var copyText = $("".concat(t)).get(0);
  copyText.select();
  var exec = document.execCommand("copy");
  if (exec) $(that).html('Copied');
};

window.getFunctionByName = function (func) {
  var fakeFunc = function fakeFunc(a, b, c) {};

  var f = window;
  if (!func) f = fakeFunc;else if (func.match(/\./)) {
    var ff = func.split(/\./g);

    for (var i in ff) {
      f = f[ff[i]] != undefined ? f[ff[i]] : fakeFunc;
      if (f == fakeFunc) break;
    }
  } else {
    f = window[func];
    if (!f) f = fakeFunc;
  }
  return f;
};

window.getObjectByPath = function (obj, path) {
  var fakeFunc = false,
      f = obj;
  if (!path) f = obj;else if (path.match(/\./)) {
    var ff = path.split(/\./g);

    for (var i in ff) {
      f = f[ff[i]] != undefined ? f[ff[i]] : fakeFunc;
      if (f == fakeFunc) break;
    }
  } else {
    f = obj[path];
    if (!f) f = fakeFunc;
  }
  return f;
};

window.http_params = function (d) {
  var ret = '';
  if (!d) return ret;
  Object.keys(d).map(function (i) {
    ret = ret + (ret.length ? '&' : '') + "".concat(i, "=").concat(d[i]);
  });
  return ret;
};

window.getPointPosition = function (v) {
  var n = v;
  var p = 0;

  while (parseInt(n) !== n) {
    ++p;
    n *= 10;
  }

  return p;
};

var TITLE_BLINK = false;
var TITLE_TEXT = $('title');
var timer,
    title = $('title'),
    title_text = '';

function blinkTitle(text) {
  title_text = text;
  TITLE_BLINK = true;
  timer = setInterval(function () {
    title.text(title.text().length == 0 ? title_text : '');
    console.debug('blinking', title, title_text);

    if (!TITLE_BLINK) {
      clearInterval(timer);
      title.text(TITLE_TEXT);
    }
  }, title.text().length == 0 ? 300 : 1800);
  $(window).focus(function () {
    TITLE_BLINK = false;
  });
} // blinkTitle('new event')
// Object.prototype.pipsPrice=() => {
//     if(typeof(this.price) == "undefined")return;
//     if(isNaN(this.price.price))return;
//     const price = parseFloat(this.price.price)
//     let toFixed = 0, pp = parseFloat(this.pips);
//     while( (pp*10)%10 > 0 && toFixed<5 ){
//         pp=10*pp;
//         toFixed++;
//     }
//     return price.currency('',toFixed);
// }


window.getMeta = function (arr, name) {
  for (var i in arr) {
    var m = arr[i];
    if (m.meta_name == name) return m;
  }

  return false;
};

window.guid = function () {
  var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 8;
  return Math.random().toString(36).substr(2, length - 2);
};

/***/ }),

/***/ "./resources/assets/js/modules/affilate.js":
/*!*************************************************!*\
  !*** ./resources/assets/js/modules/affilate.js ***!
  \*************************************************/
/*! exports provided: Affilate, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Affilate", function() { return Affilate; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Affilate =
/*#__PURE__*/
function () {
  function Affilate() {
    _classCallCheck(this, Affilate);

    this.__charts = {};
  }

  _createClass(Affilate, [{
    key: "list",
    value: function list($c, d) {
      $c.html('');

      for (var i in d.data) {
        var row = d.data[i],
            tr = $('<tr data-class="user" data-id="' + row.id + '"></tr>').appendTo($c),
            deposits = 0;
        var campaign = decodeURI(crm.user.getMeta(row.meta, 'campaign'));
        var comment = row.comments.length ? row.comments[row.comments.length - 1] : false;

        try {
          campaign = JSON.stringify(JSON.parse(campaign), null, 2);
        } catch (e) {
          campaign = false;
        }

        for (var j in row.deposits) {
          deposits += parseFloat(row.deposits[j].amount);
        }

        tr.append('<td class="center aligned">' + dateFormat(row.created_at) + '</td>');
        tr.append('<td><code>#' + row.id + '</code> ' + row.name + ' ' + row.surname + (system.options.get('show_email_2_affilate') ? '<br><small><i class="icon mail' + (row.email_verified == "1" ? '' : ' outline') + '"></i>' + row.email + '</small>' : '') // +'<br><small><i class="icon phone"></i>'+row.phone+'</small>'
        + '<br><small><i class="icon world"></i>' + crm.user.getMeta(row.meta, 'country') + '</small>' + '</td>');
        tr.append('<td>' + row.status.title + '</td>');
        tr.append('<td>' + deposits.currency('T') + '</td>');
        var commentRow = comment !== false ? "<b>Comments:</b><i>".concat(comment.comment, "</i><br/><small>").concat(dateFormat(comment.created_at, false, 'simple'), "</small><br/>") : '';
        var campaignRow = campaign !== false ? "<b>Campaign:</b>".concat(campaign) : '';
        tr.append("<td>".concat(commentRow).concat(campaignRow, "</td>"));
      }

      page.paginate(d, 'affilate-user-list', $c);
    }
  }, {
    key: "dashboard",
    value: function dashboard($c, d) {
      var rep = {
        ctx: $c.find('#chart__affilate_bycountry').get(0),
        data: {},
        raw: {}
      },
          rep1 = {
        ctx: $c.find('#chart__affilate_date').get(0),
        data: {},
        raw: {}
      },
          totalDeposit = 0;

      for (var i in d) {
        var u = d[i],
            name = u.name + ' ' + u.surname,
            status = u.status.title,
            country = u.country && u.country.length ? u.country[0].meta_value : '',
            date = new Date((u.created_at - u.created_at % (24 * 60 * 60)) * 1000),
            deposits = 0;

        for (var j in u.deposits) {
          deposits += parseFloat(u.deposits[j].amount);
        }

        rep.raw[country] = rep.raw[country] ? rep.raw[country] : 0;
        rep.raw[country]++;
        rep1.raw[date] = rep1.raw[date] ? rep1.raw[date] : 0;
        rep1.raw[date] += deposits;
        totalDeposit += deposits;
      }

      rep.data = splitObjectKeys(rep.raw);
      rep1.data = splitObjectKeys(rep1.raw); // console.debug(rep,rep1);

      if (rep.ctx) {
        if (crm.affilate.__charts['affilate_by_countries']) crm.affilate.__charts['affilate_by_countries'].destroy();
        crm.affilate.__charts['affilate_by_countries'] = new Chart(rep.ctx.getContext('2d'), {
          type: 'pie',
          data: {
            labels: rep.data.keys,
            datasets: [{
              label: "",
              borderColor: page.dashboard.options.chart.borderColors,
              backgroundColor: page.dashboard.options.chart.backgroundColors,
              data: rep.data.values
            }]
          },
          options: {
            title: {
              display: true,
              text: 'Quantity of customers by countries'
            }
          }
        });
      }

      if (rep1.ctx) {
        if (crm.affilate.__charts['affilate_by_days']) crm.affilate.__charts['affilate_by_days'].destroy();
        crm.affilate.__charts['affilate_by_days'] = new Chart(rep1.ctx.getContext('2d'), {
          type: 'bar',
          data: {
            labels: rep1.data.keys,
            datasets: [{
              label: __('crm.dashboard.deposits'),
              borderColor: page.dashboard.options.chart.borderColors,
              backgroundColor: page.dashboard.options.chart.backgroundColors,
              data: rep1.data.values
            }]
          },
          options: {
            title: {
              display: true,
              text: 'Total Amount of deposits ' + totalDeposit.currency('$', 2)
            },
            scales: {
              xAxes: [{
                type: 'time',
                time: {
                  displayFormats: {
                    quarter: 'hh:mm:ss'
                  }
                }
              }]
            }
          }
        });
      }
    }
  }]);

  return Affilate;
}();
/* harmony default export */ __webpack_exports__["default"] = (Affilate);

/***/ }),

/***/ "./resources/assets/js/modules/brands.js":
/*!***********************************************!*\
  !*** ./resources/assets/js/modules/brands.js ***!
  \***********************************************/
/*! exports provided: Brands */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Brands", function() { return Brands; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Brands =
/*#__PURE__*/
function () {
  function Brands() {
    _classCallCheck(this, Brands);

    this.__currentPeriod = 'm';
  }

  _createClass(Brands, [{
    key: "byperiod",
    value: function byperiod(that, p) {
      $('.byperiod .active').removeClass('active');
      $('.date').fadeOut(function () {
        $('.date.' + p).fadeIn();
      });
      $(that).addClass('active'); // console.debug($(that).text());

      $('#brands_period').text($(that).text());
      crm.brands.__currentPeriod = p;
      cf.touch('finance-report-brands');
    }
  }, {
    key: "calculatePercent",
    value: function calculatePercent(amt, percent) {
      var percents = {
        200000: 10,
        500000: 8,
        1000000: 6
      },
          cur = 10;
      if (percent) cur = percent;else {
        for (var i in percents) {
          if (amt <= i) cur = percents[i];
          break;
        }
      }
      return {
        value: amt * cur / 100,
        percent: cur
      };
    }
  }, {
    key: "info",
    value: function info(id) {
      var $c = $('#brand_info'),
          jsonPrint = function jsonPrint(s) {
        var r = '',
            j = {};

        if (typeof s === 'string') {
          try {
            j = JSON.parse(s);
          } catch (e) {
            console.warn(s, 'is not VALID JSON');
          }
        } else j = s;

        for (var i in j) {
          r += '<b>' + i + '</b>:&nbsp;<code style="color:#999;font-weight:100;">' + j[i] + '</code>  ';
        }

        return r;
      };

      $.ajax({
        url: '/api/brand/' + id,
        type: 'get',
        beforeSend: function beforeSend() {
          $c.html('');
          $c.addClass('loader active ui');
        },
        success: function success(u, s, x) {
          var $f = $('<div class="column sixteen wide"></div>').appendTo($c),
              $t = $('<div class="column sixteen wide"></div>').appendTo($c),
              t = {};
          $f.append('<h3>Brand <span style="font-weight:100">"' + u.title + '"</span>');
          $f = $('<div class="ui form"></div>').appendTo($f);
          $f.append('<div class="field submiter loadering" data-action="/api/brand/' + u.id + '" data-method="put" data-name="brand-off-{{$option->id}}">' + '<div class="ui slider checkbox resource">' + '<input  data-name="value" type="checkbox" ' + (u.active && u.active.value == "1" ? ' checked="checked"' : '') + ' name="can_use_crm" onchange="$(this).closest(\'.submiter\').find(\'.submit\').click()"/>' + '<label>Active CRM system</label>' + '</div>' + '<input type="hidden" data-name="action" value="option" />' + '<input type="hidden" data-name="option" value="can_use_crm" />' // +'<input type="hidden" data-name="_token" value="{{ csrf_token() }}" />'
          + '<input type="hidden" class="submit" />' + '</div>');
          $t = $('<table class="ui table"></table').appendTo($t);
          $t.append('<caption>Invoices for today</caption>');
          $t.append('<thead><tr>' // +'<th class="two wide">Time</th>'
          + '<th class="two wide">Amount</th>' + '<th class="fourteen wide">Details</th>' + '</tr></thead>');
          if (u.invoices.length) u.invoices.map(function (row, i) {
            $t.append('<tr>' // +'<td class="center aligned">'+row.created_at.datetime({show:{time:true,date:false},style:'simple'})+'</td>'
            + '<td class="right aligned">' + row.amount.currency('$') + '</td>' + '<td class="small">' + jsonPrint(row.raw) + '</td>' + '</tr>');
          });else $t.append('<tr><td>No one</td></tr>');
          skymechanics.reload();
        },
        complete: function complete(x, s) {
          $c.removeClass("active loader");
        }
      });
    }
  }, {
    key: "list",
    value: function list($c, d) {
      var rep = {
        ctx: $c.find('.chart').get(0),
        data: {},
        raw: {}
      },
          amountSum = function amountSum(l) {
        var res = 0;

        for (var i in l) {
          res += parseFloat(l[i].amount);
        }

        return res;
      },
          calcToday = function calcToday(l) {
        var res = {
          count: 0,
          amt: 0
        };
        var td = truncDay(new Date().getTime());

        for (var i in l) {
          if (truncDay(l[i].created_at * 1000) == td) {
            res.count += 1;
            res.amt += parseFloat(l[i].amount);
          }
        }

        return res.count == 0 ? false : res;
      },
          totalDeposit = 0,
          totalPercent = 0,
          $t = $c.find('#brands_total tbody'),
          $foot = $t.parent().find('tfoot');

      $t.html('');

      for (var i in d) {
        var u = d[i],
            amt = amountSum(u.invoices),
            total = u.invoices ? u.invoices.length : '-',
            perc = u.id == 8 ? crm.brands.calculatePercent(amt, 7) : crm.brands.calculatePercent(amt),
            calc = calcToday(u.invoices);
        rep.raw[u.title] = rep.raw[u.title] ? rep.raw[u.title] : 0;
        rep.raw[u.title] += amt;
        calc = calc == false ? '' : "<div class=\"ui tag olive label\">+".concat(calc.amt.currency('$', 2), " (").concat(calc.count, ")</div>");
        $t.append('<tr  class="' + (total == 0 || total == '-' ? 'negative' : 'positive') + '">' + '<td>' + '<h3><a href="#brand_info" onclick="crm.brands.info(' + u.id + ')" style="position:relative;">' + u.title + '</a>' + calc + '</h3>' + '<a href="' + u.url + '" target="_blank"><i class="hashtag icon"></i>' + u.url + '</a>' // +'<div class="field submiter loadering" data-action="/api/brand/'+u.id+'" data-method="put" data-name="brand-off-{{$option->id}}">'
        //     +'<div class="ui slider checkbox resource">'
        //         +'<input  data-name="value" type="checkbox" '+((u.active && u.active.value=="1")?' checked="checked"':'')+' name="can_use_crm" onchange="$(this).closest(\'.submiter\').find(\'.submit\').click()"/>'
        //         +'<label>Active CRM system</label>'
        //     +'</div>'
        //     +'<input type="hidden" data-name="action" value="option" />'
        //     +'<input type="hidden" data-name="option" value="can_use_crm" />'
        //     // +'<input type="hidden" data-name="_token" value="{{ csrf_token() }}" />'
        //     +'<input type="hidden" class="submit" />'
        // +'</div>'
        + '</td>' + '<td>' + total + '</td>' + '<td class="right aligned">' + amt.currency('$', 2) + '<br/><small class="color grey">' + perc.value.currency('$', 2) + ' (' + perc.percent + '%)</small>' + '</td>' + '</tr>'); // console.debug(totalDeposit,isNaN(amt)?0:amt);

        totalDeposit += isNaN(amt) ? 0 : amt;
        totalPercent += perc.value;
      }

      $foot = $foot.length ? $foot : $('<tfoot></tfoot').appendTo($t.parent());
      $foot.html('');
      $foot.append('<tr><td colspan=3 class="right aligned ui header">' + totalDeposit.currency('$', 2) + '<br/><small class="color grey">' + totalPercent.currency('$', 2) + '</small>' + '</td></tr>');
      rep.data = splitObjectKeys(rep.raw);
      if (crm.finance.charts['brands_chart']) crm.finance.charts['brands_chart'].destroy();
      crm.finance.charts['brands_chart'] = new Chart(rep.ctx.getContext('2d'), {
        type: 'bar',
        data: {
          labels: rep.data.keys,
          datasets: [{
            label: "",
            borderColor: page.dashboard.options.chart.borderColors,
            backgroundColor: page.dashboard.options.chart.backgroundColors,
            data: rep.data.values
          }]
        },
        options: {
          title: {
            display: true,
            text: 'Total Amount of deposits ' + totalDeposit.currency('$', 2) // ,scales: {
            //     xAxes: [{
            //         type: 'time',
            //         time: {
            //             displayFormats: {
            //                 quarter: 'hh:mm:ss'
            //             }
            //         }
            //     }]
            // }

          }
        }
      });
      cf.reload();
    }
  }]);

  return Brands;
}();
;

/***/ }),

/***/ "./resources/assets/js/modules/chart.js":
/*!**********************************************!*\
  !*** ./resources/assets/js/modules/chart.js ***!
  \**********************************************/
/*! exports provided: SUPPORT_LINE_RANGE, SMChart */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SUPPORT_LINE_RANGE", function() { return SUPPORT_LINE_RANGE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SMChart", function() { return SMChart; });
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { keys.push.apply(keys, Object.getOwnPropertySymbols(object)); } if (enumerableOnly) keys = keys.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var SUPPORT_LINE_RANGE = 0.001;
var SMChart =
/*#__PURE__*/
function () {
  function SMChart(uid) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, SMChart);

    Chart.defaults.global.elements.point.radius = 0;
    Chart.defaults.global.elements.point.borderWidth = 0;
    this.uid = uid;
    this.opts = $.extend({
      ctx: null,
      type: 'line',
      uid: 'chart',
      maxDataLength: 144,
      timeDiff: 60000,
      borderColor: 'rgba(33,187,149,1)',
      pointBorderWidth: 0,
      pointBorderColor: 'rgba(255,255,255,0)',
      pointBackgroundColor: 'rgba(255,255,255,0)',
      pointHitRadius: 0,
      data: {
        label: 'Line',
        keys: [],
        values: []
      },
      onUpdate: function onUpdate(p) {}
    }, opts);
    this.chart = null;
    this.supports = [];
    this.render = this.render.bind(this);
    this.update = this.update.bind(this);
    this.setSupport = this.setSupport.bind(this);
    this.removeSupports = this.removeSupports.bind(this);
    this.handlerData = this.handlerData.bind(this);
    this.render();
  }

  _createClass(SMChart, [{
    key: "render",
    value: function render() {
      console.debug('SMChart render', this.opts.ctx, this.opts.ctx.get(0));
      this.chart = new Chart(this.opts.ctx.get(0).getContext('2d'), {
        type: this.opts.type,
        data: {
          labels: [],
          //this.opts.data.keys,
          datasets: [{
            label: this.opts.data.label,
            borderColor: this.opts.borderColor,
            data: this.opts.data.values
          }]
        },
        options: {
          scales: {
            // xAxes: [{
            //     type: 'time',
            //     time: {
            //         displayFormats: {
            //             quarter: 'hh:mm:ss'
            //         }
            //     }
            // }]
            xAxes: [{
              type: 'time',
              distribution: 'series'
            }]
          },
          zoom: {
            enabled: true,
            // drag: true,
            mode: 'y',
            // rangeMin: {x: null,y: null},
            // rangeMax: {x: null,y: null},
            onZoom: function onZoom() {
              console.log('I was zoomed!!!');
            }
          },
          pan: {
            // Boolean to enable panning
            enabled: true,
            // Panning directions. Remove the appropriate direction to disable
            // Eg. 'y' would only allow panning in the y direction
            mode: 'xy',
            // Function called once panning is completed
            // Useful for dynamic data loading
            onPan: function onPan() {
              console.log('I was panned!!!');
            }
          }
        }
      });
    }
  }, {
    key: "setSupport",
    value: function setSupport(l) {
      var range = arguments.length > 1 ? arguments[1] : SUPPORT_LINE_RANGE;
      var callbackf = arguments.length > 2 && typeof arguments[2] === "function" ? arguments[2] : function (h, l) {
        console.debug('fake callback function', h, l);
      };

      if (!this.supports.length) {
        var thatChart = this.chart,
            wasLevel = l,
            wasRange = l * 0.001,
            levelLine = {
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: l,
          borderColor: '#2185d0',
          borderWidth: 4,
          cubicInterpolationMode: 'monotone',
          label: {
            enabled: true,
            position: 'right',
            backgroundColor: '#2185d0',
            content: l
          },
          draggable: true,
          onDragStart: function onDragStart(event) {
            wasLevel = event.subject.config.value; // console.debug(this);
          },
          onDrag: function onDrag(event) {
            var nlevel = event.subject.config.value,
                newLine = this;
            rangeDownLine.value = nlevel - nlevel * range;
            rangeUpLine.value = nlevel + nlevel * range;
            newLine.value = nlevel;
            newLine.label.content = nlevel.toFixed(0);
            callbackf(nlevel, (100 * wasRange / nlevel).toFixed(2));
            thatChart.update();
          },
          onDragEnd: function onDragEnd(event) {
            wasLevel = event.subject.config.value;
          }
        },
            rangeDownLine = {
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: l - l * range,
          borderWidth: 6,
          borderColor: '#ccc',
          label: {
            enabled: false,
            position: 'right',
            backgroundColor: '#aaa',
            content: "<<"
          },
          draggable: false,
          onDragStart: function onDragStart(event) {
            wasRange = wasLevel - event.subject.config.value;
          },
          onDrag: function onDrag(event) {
            var nlevel = event.subject.config.value,
                newLine = this; // if(firstDrag){console.debug(event,this);firstDrag=false;}

            newLine.value = nlevel;
            wasRange = wasLevel - event.subject.config.value;
            rangeUpLine.value = wasLevel + wasRange;
            callbackf(wasLevel, 100 * wasRange / wasLevel);
            thatChart.update();
          },
          onDragEnd: function onDragEnd(event) {// wasRange = wasLevel-event.subject.config.value;
          }
        },
            rangeUpLine = {
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: l + l * range,
          borderWidth: 6,
          borderColor: '#ccc',
          label: {
            enabled: false,
            position: 'right',
            backgroundColor: '#ccc',
            content: "<<"
          },
          draggable: false,
          onDragStart: function onDragStart(event) {
            wasRange = event.subject.config.value - wasLevel;
          },
          onDrag: function onDrag(event) {
            var nlevel = event.subject.config.value,
                newLine = this;
            newLine.value = nlevel;
            wasRange = event.subject.config.value - wasLevel;
            rangeDownLine.value = wasLevel - wasRange;
            callbackf(wasLevel, 100 * wasRange / wasLevel);
            thatChart.update();
          }
        };
        this.supports.push(rangeUpLine);
        this.supports.push(rangeDownLine);
        this.supports.push(levelLine);
        this.chart.options.annotation = {
          events: ['click'],
          annotations: this.supports
        };
        this.chart.update();
      }
    }
  }, {
    key: "removeSupports",
    value: function removeSupports() {
      this.supports.pop();
      this.supports.pop();
      this.supports.pop();
      this.chart.update();
    }
  }, {
    key: "update",
    value: function update(data) {
      if (!this.chart) return;
      time = new Date(data.created_at * 1000);
      val = parseFloat(data.price);
      this.opt.data.keys.push(time.getTime());
      this.opt.data.keys.push(time.getTime());

      for (var i in this.opt.data.keys) {
        if ($.inArray(d.keys[i].getTime(), this.opts.data.keys) == -1 && d.keys[i] > td) {
          if (d.keys[i].getTime() - td > 0) {
            setTimeout(timedUpdate, d.keys[i].getTime() - td, this, d.keys[i], d.values[i]);
            console.debug('next price in ' + (d.keys[i].getTime() - td));
          }

          this.opts.data.keys.push(d.keys[i].getTime());
          this.opts.data.values.push(d.values[i]);
        } else if (this.first) this.set(d.keys[i], d.values[i]);
      }
    }
  }, {
    key: "set",
    value: function set(l, d) {
      var datasetNum = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      if (this.chart == undefined || this.chart.data.datasets[datasetNum] == undefined) return;
      var last = this.chart.data.datasets[datasetNum].data[this.chart.data.datasets[datasetNum].data.length - 1];
      if (last.x > l) l = last.x;
      this.chart.data.datasets[datasetNum].data.push({
        x: l,
        y: d
      });
      this.chart.update();
    }
  }, {
    key: "handlerData",
    value: function handlerData(uid, l, d) {
      if (this.uid == uid) {
        this.set(l, d);
      }
    }
  }, {
    key: "getDataset",
    value: function getDataset() {
      var datasetNum = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      var nds = _objectSpread({}, this.chart.data.datasets[datasetNum]);

      nds.data = this.chart.data.datasets[datasetNum].data.slice();
      return nds;
    }
  }, {
    key: "removeDataset",
    value: function removeDataset() {
      var datasetNum = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      if (this.chart.data.datasets.length - 1 < datasetNum) return;
      this.chart.data.datasets.pop(); // = this.chart.data.datasets[datasetNum]=null;

      this.chart.update();
      console.debug('addDataset', this.chart.data.datasets);
    }
  }, {
    key: "addDataset",
    value: function addDataset(ds) {
      // this.chart.data.datasets[this.chart.data.datasets.length-1].borderColor='rgba(33,187,149,.2)';
      var newDataset = $.extend({
        label: "Second",
        data: [],
        borderColor: '#1e2535',
        pointBorderWidth: 0
      }, ds);
      this.chart.data.datasets.push(newDataset);
      this.chart.update();
      console.debug('addDataset', ds, this.chart.data.datasets);
    }
  }]);

  return SMChart;
}();

/***/ }),

/***/ "./resources/assets/js/modules/chart/index.js":
/*!****************************************************!*\
  !*** ./resources/assets/js/modules/chart/index.js ***!
  \****************************************************/
/*! exports provided: SUPPORT_LINE_RANGE, VUIChart */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SUPPORT_LINE_RANGE", function() { return SUPPORT_LINE_RANGE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VUIChart", function() { return VUIChart; });
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { keys.push.apply(keys, Object.getOwnPropertySymbols(object)); } if (enumerableOnly) keys = keys.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

if (window.charts == undefined) window.charts = [];
var SUPPORT_LINE_RANGE = 0.001;
var VUIChart =
/*#__PURE__*/
function () {
  function VUIChart(uid) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, VUIChart);

    Chart.defaults.global.elements.point.radius = 0;
    Chart.defaults.global.elements.point.borderWidth = 0;
    this.uid = uid;
    this.opts = $.extend({
      ctx: null,
      type: 'line',
      uid: 'chart',
      maxDataLength: 144,
      timeDiff: 60000,
      borderColor: 'rgba(33,187,149,1)',
      pointBorderWidth: 0,
      pointBorderColor: 'rgba(255,255,255,0)',
      pointBackgroundColor: 'rgba(255,255,255,0)',
      pointHitRadius: 0,
      data: {
        label: 'Line',
        keys: [],
        values: []
      },
      onUpdate: function onUpdate(p) {}
    }, opts);
    this.chart = null;
    this.supports = [];
    this.render = this.render.bind(this);
    this.update = this.update.bind(this);
    this.setSupport = this.setSupport.bind(this);
    this.removeSupports = this.removeSupports.bind(this);
    this.handlerData = this.handlerData.bind(this);
    this.render();
  }

  _createClass(VUIChart, [{
    key: "render",
    value: function render() {
      console.debug('VUIChart render', this.opts.ctx, this.opts.ctx.get(0));
      this.chart = new Chart(this.opts.ctx.get(0).getContext('2d'), {
        type: this.opts.type,
        data: {
          labels: [],
          //this.opts.data.keys,
          datasets: [{
            label: this.opts.data.label,
            borderColor: this.opts.borderColor,
            data: this.opts.data.values
          }]
        },
        options: {
          scales: {
            // xAxes: [{
            //     type: 'time',
            //     time: {
            //         displayFormats: {
            //             quarter: 'hh:mm:ss'
            //         }
            //     }
            // }]
            xAxes: [{
              type: 'time',
              distribution: 'series'
            }]
          },
          zoom: {
            enabled: true,
            // drag: true,
            mode: 'y',
            // rangeMin: {x: null,y: null},
            // rangeMax: {x: null,y: null},
            onZoom: function onZoom() {
              console.log('I was zoomed!!!');
            }
          },
          pan: {
            // Boolean to enable panning
            enabled: true,
            // Panning directions. Remove the appropriate direction to disable
            // Eg. 'y' would only allow panning in the y direction
            mode: 'xy',
            // Function called once panning is completed
            // Useful for dynamic data loading
            onPan: function onPan() {
              console.log('I was panned!!!');
            }
          }
        }
      });
    }
  }, {
    key: "setSupport",
    value: function setSupport(l) {
      var range = arguments.length > 1 ? arguments[1] : SUPPORT_LINE_RANGE;
      var callbackf = arguments.length > 2 && typeof arguments[2] === "function" ? arguments[2] : function (h, l) {
        console.debug('fake callback function', h, l);
      };

      if (!this.supports.length) {
        var thatChart = this.chart,
            wasLevel = l,
            wasRange = l * 0.001,
            levelLine = {
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: l,
          borderColor: '#2185d0',
          borderWidth: 4,
          label: {
            enabled: true,
            position: 'right',
            backgroundColor: '#2185d0',
            content: l
          },
          draggable: true,
          onDragStart: function onDragStart(event) {
            wasLevel = event.subject.config.value; // console.debug(this);
          },
          onDrag: function onDrag(event) {
            var nlevel = event.subject.config.value,
                newLine = this;
            rangeDownLine.value = nlevel - nlevel * range;
            rangeUpLine.value = nlevel + nlevel * range;
            newLine.value = nlevel;
            newLine.label.content = nlevel.toFixed(0);
            callbackf(nlevel, (100 * wasRange / nlevel).toFixed(2));
            thatChart.update();
          },
          onDragEnd: function onDragEnd(event) {
            wasLevel = event.subject.config.value;
          }
        },
            rangeDownLine = {
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: l - l * range,
          borderWidth: 6,
          borderColor: '#ccc',
          label: {
            enabled: false,
            position: 'right',
            backgroundColor: '#aaa',
            content: "<<"
          },
          draggable: false,
          onDragStart: function onDragStart(event) {
            wasRange = wasLevel - event.subject.config.value;
          },
          onDrag: function onDrag(event) {
            var nlevel = event.subject.config.value,
                newLine = this; // if(firstDrag){console.debug(event,this);firstDrag=false;}

            newLine.value = nlevel;
            wasRange = wasLevel - event.subject.config.value;
            rangeUpLine.value = wasLevel + wasRange;
            callbackf(wasLevel, 100 * wasRange / wasLevel);
            thatChart.update();
          },
          onDragEnd: function onDragEnd(event) {// wasRange = wasLevel-event.subject.config.value;
          }
        },
            rangeUpLine = {
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: l + l * range,
          borderWidth: 6,
          borderColor: '#ccc',
          label: {
            enabled: false,
            position: 'right',
            backgroundColor: '#ccc',
            content: "<<"
          },
          draggable: false,
          onDragStart: function onDragStart(event) {
            wasRange = event.subject.config.value - wasLevel;
          },
          onDrag: function onDrag(event) {
            var nlevel = event.subject.config.value,
                newLine = this;
            newLine.value = nlevel;
            wasRange = event.subject.config.value - wasLevel;
            rangeDownLine.value = wasLevel - wasRange;
            callbackf(wasLevel, 100 * wasRange / wasLevel);
            thatChart.update();
          }
        };
        this.supports.push(rangeUpLine);
        this.supports.push(rangeDownLine);
        this.supports.push(levelLine);
        this.chart.options.annotation = {
          events: ['click'],
          annotations: this.supports
        };
        this.chart.update();
      }
    }
  }, {
    key: "removeSupports",
    value: function removeSupports() {
      this.supports.pop();
      this.supports.pop();
      this.supports.pop();
      this.chart.update();
    }
  }, {
    key: "update",
    value: function update(data) {
      if (!this.chart) return;
      time = new Date(data.created_at * 1000);
      val = parseFloat(data.price);
      this.opt.data.keys.push(time.getTime());
      this.opt.data.keys.push(time.getTime());

      for (var i in this.opt.data.keys) {
        if ($.inArray(d.keys[i].getTime(), this.opts.data.keys) == -1 && d.keys[i] > td) {
          if (d.keys[i].getTime() - td > 0) {
            setTimeout(timedUpdate, d.keys[i].getTime() - td, this, d.keys[i], d.values[i]);
            console.debug('next price in ' + (d.keys[i].getTime() - td));
          }

          this.opts.data.keys.push(d.keys[i].getTime());
          this.opts.data.values.push(d.values[i]);
        } else if (this.first) this.set(d.keys[i], d.values[i]);
      }
    }
  }, {
    key: "set",
    value: function set(l, d) {
      var datasetNum = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      if (!this.chart) return;
      if (!this.chart.data.datasets[datasetNum]) return;
      var last = this.chart.data.datasets[datasetNum].data[this.chart.data.datasets[datasetNum].data.length - 1]; // console.debug('chart add tick to rerender()',datasetNum,last)

      if (last.x >= l) {
        l = last.x;
        l.setMilliseconds(l.getMilliseconds() + 10);
      }

      this.chart.data.datasets[datasetNum].data.push({
        x: l,
        y: d
      });
      this.chart.update();
    }
  }, {
    key: "handlerData",
    value: function handlerData(uid, l, d) {
      if (this.uid == uid) {
        this.set(l, d);
      }
    }
  }, {
    key: "getDataset",
    value: function getDataset() {
      var datasetNum = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      var nds = _objectSpread({}, this.chart.data.datasets[datasetNum]);

      nds.data = this.chart.data.datasets[datasetNum].data.slice();
      return nds;
    }
  }, {
    key: "removeDataset",
    value: function removeDataset() {
      var datasetNum = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      if (this.chart.data.datasets.length - 1 < datasetNum) return;
      this.chart.data.datasets.pop(); // = this.chart.data.datasets[datasetNum]=null;

      this.chart.update(); // console.debug('removeDataset',this.chart.data.datasets)
    }
  }, {
    key: "addDataset",
    value: function addDataset(ds) {
      // this.chart.data.datasets[this.chart.data.datasets.length-1].borderColor='rgba(33,187,149,.2)';
      var newDataset = $.extend({
        label: "Second",
        data: [],
        borderColor: '#1e2535',
        pointBorderWidth: 0
      }, ds);
      this.chart.data.datasets.push(newDataset);
      this.chart.update(); // console.debug('addDataset',ds,this.chart.data.datasets)
    }
  }]);

  return VUIChart;
}();

/***/ }),

/***/ "./resources/assets/js/modules/clock.js":
/*!**********************************************!*\
  !*** ./resources/assets/js/modules/clock.js ***!
  \**********************************************/
/*! exports provided: Clock, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Clock", function() { return Clock; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Clock =
/*#__PURE__*/
function () {
  function Clock(selector) {
    var utc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    _classCallCheck(this, Clock);

    this.container = $(selector);
    this.date = new Date();
    this.utc = utc;
    if (this.container.length == 0) console.error("Clock.constructor: Wrong selector $('".concat(selector, "'). No container found."));
    this.weekDays = ['Sun', 'Mon', 'Tue', 'Wen', 'Thu', 'Fri', 'Sat'];
    this.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    this.render = this.render.bind(this);
  }

  _createClass(Clock, [{
    key: "render",
    value: function render() {
      // console.debug('Clock.render',this);
      var dt = new Date(),
          str = dt.toUTCString(),
          //dt.getFullYear()+(dt.getMonth()+1).leftPad()+dt.getDate().leftPad(),
      year = dt.getFullYear(),
          month = this.months[dt.getMonth()],
          day = dt.getDate().leftPad(),
          week = this.weekDays[dt.getDay()],
          hour = dt.getHours().leftPad(),
          minute = dt.getMinutes().leftPad(),
          delim = "<span class=\"delimeter\">:</span>";
      this.container.html("<div class=\"ui mini inverted statistic\">\n            <div class=\"value\">".concat(hour).concat(delim).concat(minute, "</div>\n            <div class=\"label\">").concat(week, ", ").concat(day, " of ").concat(month, "'").concat(year, "</div>\n        </div>"));
    }
  }]);

  return Clock;
}();
;
/* harmony default export */ __webpack_exports__["default"] = (Clock);

/***/ }),

/***/ "./resources/assets/js/modules/dashboard/index.js":
/*!********************************************************!*\
  !*** ./resources/assets/js/modules/dashboard/index.js ***!
  \********************************************************/
/*! exports provided: Dashboard */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Dashboard", function() { return Dashboard; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Dashboard =
/*#__PURE__*/
function () {
  function Dashboard() {
    _classCallCheck(this, Dashboard);

    this.__currentPeriod = '7d';
    this.options = {
      chart: {
        backgroundColors: ['rgba(33,187,149,.8)', 'rgba(33,133,208,.8)', 'rgba(204, 104, 104,.8)', 'rgba( 104, 204,104,.8)', 'rgba(104, 104, 104,.8)', 'rgba(104, 104, 204,.8)'],
        borderColors: ['rgba(33,187,149,1)', 'rgba(33,133,208,1)', 'rgba(204, 104, 104,1)', 'rgba( 104, 204,104,1)', 'rgba(104, 104, 104,1)', 'rgba(104, 104, 204,1)']
      }
    };
    this.byperiod = this.byperiod.bind(this);
    this.trades = this.trades.bind(this);
  }

  _createClass(Dashboard, [{
    key: "byperiod",
    value: function byperiod(that, p) {
      $('.byperiod .active').removeClass('active');
      $('.date').fadeOut(function () {
        $('.date.' + p).fadeIn();
      });
      $(that).addClass('active');
      this.__currentPeriod = p;
      $('#page__dashboard .loadering').each(function () {
        var loadering = $(this).attr('data-name');
        if (loadering) skymechanics.touch(loadering);
      });
    }
  }, {
    key: "trades",
    value: function trades($c, d) {
      var limitSymbols = 12;
      var raw = {},
          profits = {
        total: 0,
        today: 0,
        previous: 0,
        volation: 0
      },
          invested = {
        total: 0,
        today: 0,
        previous: 0,
        volation: 0
      },
          today = new Date(),
          $t = $('#deal_total');
      today = new Date(today - today.getTime() % (24 * 60 * 60 * 1000));
      today = today.getTime(); // console.debug('dashboard trades',d);

      for (var i in d) {
        var r = d[i];
        var cntTotal = parseInt(r.total);
        raw[r.pair] = raw[r.pair] ? raw[r.pair] : 0;
        raw[r.pair] += cntTotal;
        profits.total += parseFloat(r.profit);

        if (r.date * 1000 == today) {
          profits.today = parseFloat(r.profit);
          profits.volation = profits.previous == 0 ? 100 : 100 * (parseFloat(r.profit) / profits.previous - 1);
        }

        profits.previous = parseFloat(r.profit);
        invested.total += parseFloat(r.amount);

        if (r.date * 1000 == today) {
          invested.today = parseFloat(r.amount);
          invested.volation = invested.previous == 0 ? 100 : 100 * (parseFloat(r.amount) / invested.previous - 1);
        }

        invested.previous = parseFloat(r.amount); // if(i>limitSymbols)break;
      }

      $t.find('tbody tr:eq(0) td:eq(1)').html(invested.total.currency('$', 2));
      $t.find('tbody tr:eq(0) td:eq(2)').html(invested.today.currency('$') + '<br/><small><i class="ui icon arrow ' + (invested.volation >= 0 ? 'up' : 'down') + '"></i>' + invested.volation.toFixed(2) + '%</small>').addClass(invested.volation >= 0 ? 'green' : 'red');
      $t.find('tbody tr:eq(1) td:eq(1)').html(profits.total.currency('$', 2));
      $t.find('tbody tr:eq(1) td:eq(2)').html(profits.today.currency('$') + '<br/><small><i class="ui icon arrow ' + (profits.volation >= 0 ? 'up' : 'down') + '"></i>' + profits.volation.toFixed(2) + '%</small>').addClass(profits.volation >= 0 ? 'green' : 'red');
      var splited = splitObjectKeys(raw);
      var ctx = document.getElementById('chart__deals').getContext('2d');
      if (crm.charts['trades_report']) crm.charts['trades_report'].destroy();
      crm.charts['trades_report'] = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
          labels: splited.keys,
          datasets: [{
            label: __('crm.trades.title') + ": ",
            backgroundColor: this.options.chart.backgroundColors,
            borderColor: this.options.chart.borderColors,
            data: splited.values
          }]
        },
        options: {}
      });
    }
  }]);

  return Dashboard;
}();
/*
function customers($c,d){
    var //ctx = document.getElementById('chart__lead_client').getContext('2d'),
        labels = [],cals=[];
        data={
            clients:[],
            leads:[]
        },td=new Date(),
        today = new Date(td - (td%(24*60*60*1000))),
        totals={previous:0,total:0,today:0,volation:0},
        leads={previous:0,total:0,today:0,volation:0},
        $t = $('#lead_total');
    for(var i in d){
        var r = d[i], dtd = new Date(r.date*1000),dt = system.months[dtd.getMonth()]+' '+dtd.getDate() ;
        labels[dt]=(labels[dt])?labels[dt]:{};
        labels[dt]["clients"] = r.newcustomers;
        labels[dt]["leads"] = r.newlead;
        labels[dt]["total"] = r.total;
        leads.total+=parseInt(r.newlead);
        leads.today=parseInt(r.newlead);
        leads.volation=(leads.previous==0)?0:leads.today/leads.previous;
        leads.previous=parseInt(r.newcustomers);

        totals.total+=parseInt(r.newcustomers);
        totals.today=parseInt(r.newcustomers);
        totals.volation=(totals.previous==0)?0:totals.today/totals.previous;
        totals.previous=parseInt(r.newcustomers);
    }

    let tt = {newlead:0,newcustomers:0}
    d.map( (item) => {
        tt.newlead+=parseFloat(item.newlead);
        tt.newcustomers+=parseFloat(item.newcustomers);
    });
    $c.html('');
    $c.append(`<div class="statistic">
            <div class="value"><i class="outline user icon"></i> ${tt.newlead.digit(0)}</div>
            <div class="label">${__('crm.dashboard.new_leads')}</div>
        </div>`)
    $c.append(`<div class="statistic">
            <div class="value"><i class="user icon"></i> ${tt.newcustomers.digit(0)}</div>
            <div class="label">${__('crm.dashboard.new_customers')}</div>
        </div>`)
    $t.html('');
    $t.append(`<thead><tr><th class="four wide">&nbsp;</th><th class="right aligned">${__('crm.dashboard.totals')}</th><th class="right aligned">${__('crm.dashboard.today')}</th></tr></thead>`);
    $t.append(`<tr><th class=" six wide ui right aligned">${__('crm.dashboard.new_customers')}</th><td class="ui header right aligned">${totals.total}</td><td class="ui header color right aligned ${((totals.volation<0)?"red":"green")}">${totals.today}<br><small>${totals.volation.toFixed(2)}%</small></td></tr>`);
    $t.append(`<tr><th class="right aligned">${__('crm.dashboard.new_leads')}</th>'+'<td class="ui header right aligned">${leads.total}</td><td class="ui header color right aligned ${((leads.volation<0)?"red":"green")}">${leads.today}<br><small>${leads.volation.toFixed(2)}%</small></td></tr>`);
    // for(var i=0;i<7;++i){
    //     var c = new Date();
    //     c.setDate(td.getDate()-i);
    //     c = system.months[c.getMonth()]+' '+c.getDate();
    //     cals.push(c);
    //     data.clients.push((labels[c])?labels[c].clients:0);
    //     data.leads.push((labels[c])?labels[c].leads:0);
    // }
    // var chart = new Chart(ctx, {
    //     // The type of chart we want to create
    //     type: 'line',
    //     // The data for our dataset
    //     data: {
    //         labels: cals.reverse(),//["January", "February", "March", "April", "May", "June", "July"],
    //         datasets: [
    //             {
    //                 label: "New customers",
    //                 backgroundColor: 'rgb(33,133,208)',
    //                 borderColor: 'rgb(33,133,208)',
    //                 data: data.clients.reverse()
    //             },
    //             {
    //                 label: "New leads",
    //                 backgroundColor: 'rgb(255, 10, 10)',
    //                 borderColor: 'rgb(255, 10, 10)',
    //                 data: data.leads.reverse()
    //             },
    //         ]
    //     },
    //     // Configuration options go here
    //     options: {}
    // });
},
function money($c,d,x,s){
    var //ctx = document.getElementById('chart__money_report').getContext('2d'),
        labels = [],cals=[];
        data={
            deposits:[],
            withdrawals:[]
        },td=new Date(),
        today = new Date(td - (td%(24*60*60*1000))),
        totals={previous:0,total:0,today:0,volation:0},
        $t = $('#withdrawal_total');
    for(var i in d){
        var r = d[i], dtd = new Date(r.date*1000),dt = system.months[dtd.getMonth()]+' '+dtd.getDate() ;
        labels[dt]=(labels[dt])?labels[dt]:{};
        labels[dt]["deposits"] = 0;
        labels[dt]["withdrawals"] = 0;
        if(r.type=='deposit')labels[dt].deposits=r.amount;
        else if(r.type=='withdraw'){
            labels[dt].withdrawals=r.amount;
            totals.total++;
            totals.previous+=parseFloat(r.amount);
            totals.today+=(today==dtd)?parseFloat(r.amount):0;
            totals.volation=(totals.previous==0)?0:100*((totals.today/totals.previous)-1);
            // console.debug(totals);
        }
    }
    let dd = { deposit: 0, withdraw: 0};
    d.map( (item) => {
        dd[item.type]+= parseFloat(item.amount)
    })
    $c.html('');
    if(dd.withdraw>0) $c.append(`<div class="statistic">
            <div class="value"><i class="dollar icon"></i> ${dd.withdraw.digit()}</div>
            <div class="label">${__('crm.dashboard.withdrawals')}</div>
        </div>`);
    if(dd.deposit>0) $c.append(`<div class="statistic">
            <div class="value"><i class="dollar icon"></i> ${dd.deposit.digit()}</div>
            <div class="label">${__('crm.dashboard.deposits')}</div>
        </div>`);

    $t.html('');
    $t.append(`<thead><tr><th>&nbsp;</th><th class="right aligned">${__('crm.dashboard.totals')}</th><th class="right aligned">${__('crm.dashboard.today')}</th></tr></thead>`);
    $t.append('<tbody><tr><th>Withdrawal</th>'
        +'<th class="ui header right aligned">'+totals.total+'</td>'
        +'<td class="ui color right aligned '+((totals.volation>0)?"red":"green")+'">'+totals.today+'<br><small>'+totals.volation.toFixed(2)+'%</small></td>'
        +'</tr></tbody>');
    for(var i=0;i<7;++i){
        var c = new Date();
        c.setDate(td.getDate()-i);
        c = system.months[c.getMonth()]+' '+c.getDate();
        cals.push(c);
        data.deposits.push((labels[c])?labels[c].deposits:0);
        data.withdrawals.push((labels[c])?labels[c].withdrawals:0);
    }
    // var chart = new Chart(ctx, {
    //     // The type of chart we want to create
    //     type: 'bar',
    //     // The data for our dataset
    //     data: {
    //         labels: cals.reverse(),//["January", "February", "March", "April", "May", "June", "July"],
    //         datasets: [
    //             {
    //                 label: __('crm.dashboard.deposits'),
    //                 backgroundColor: 'rgb(33,133,208)',
    //                 borderColor: 'rgb(33,133,208)',
    //                 data: data.deposits.reverse()
    //             },
    //             {
    //                 label: __('crm.dashboard.totals'),
    //                 backgroundColor: 'rgb(255, 10, 10)',
    //                 borderColor: 'rgb(255, 10, 10)',
    //                 data: data.withdrawals.reverse()
    //             },
    //         ]
    //     },
    //     // Configuration options go here
    //     options: {}
    // });

},
function deposits($c,d){
    var //ctx = document.getElementById('chart__deposit_report').getContext('2d'),
        labels=[],data=[],
        raw={},
        totals = {
            total:0,
            today:0,
            previous:0,
            volation:0
        },
        today = new Date(),today = new Date(today - (today%(24*60*60*1000))),
        $t = $('#deposit_total');

    for(var i in d){
        var r = d[i],merchant = r.title;
        raw[merchant]=(raw[merchant])?raw[merchant]:0;
        raw[merchant]+=parseFloat(r.amount);
        totals.total+=parseInt(r.total);
        totals.volation=(totals.previous==0)?100:100*((parseFloat(r.amount)/(parseFloat(r.amount)+totals.previous))-1);
        totals.previous+=parseFloat(r.amount);
        if(r.trunc_date == today)total.today=parseFloat(r.total);
        totals[merchant]=(totals[merchant])?totals[merchant]:{previous:0,volation:0,total:0};
        totals[merchant].total+=parseInt(r.total);
        totals[merchant].volation=(totals[merchant].previous==0)?100:100*((parseFloat(r.amount)/(parseFloat(r.amount)+totals[merchant].previous))-1);
        totals[merchant].previous+=parseFloat(r.amount);
        totals[merchant].today=(r.trunc_date == today)?r.total:0;
    }
    $c.html('');
    Object.keys(raw).map( (merchant) => {
        const item = raw[merchant];
        $c.append(`<div class="statistic">
            <div class="value"><i class="dollar icon"></i> ${item.digit()}</div>
            <div class="label">${merchant}</div>
        </div>`)
    })
    $t.html('');
    $t.append(`<thead><tr><th>&nbsp;</th><th class="right aligned">${__('crm.dashboard.totals')}</th><th class="right aligned">${__('crm.dashboard.today')}</th></tr></thead>`);

    $t.append('<tbody><tr>'
        +`<td><b>${__('crm.dashboard.deposits')}</b></td>`
        +'<td class="right aligned"><b>'+totals.total+'</b></td>'
        +'<td class="color right aligned '+((totals.volation>0)?"green":"red")+'"><b>'+totals.today+'</b><br><small>'+totals.volation.toFixed(2)+'%</small></td>'
    +'</tr></tbody>');
    for(var i in totals){
        if($.inArray(i,['total','volation','previous','today'])<0){
            $t.append('<tr>'
                +`<td>${i}</td>`
                +`<td class="right aligned">${totals[i].total}</td>`
                +`<td class="right aligned color ${((totals[i].volation>0)?"green":"red")}">${totals[i].today}<br><small>${totals[i].volation.digit(2)}%</small></td>`
            +'</tr>');
        }
    }
}
*/

/***/ }),

/***/ "./resources/assets/js/modules/deals.js":
/*!**********************************************!*\
  !*** ./resources/assets/js/modules/deals.js ***!
  \**********************************************/
/*! exports provided: Corrida, Deals, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Corrida", function() { return Corrida; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Deals", function() { return Deals; });
/* harmony import */ var _chart__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./chart */ "./resources/assets/js/modules/chart.js");
/* harmony import */ var _trade_trade__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./trade/trade */ "./resources/assets/js/modules/trade/trade.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



var Corrida =
/*#__PURE__*/
function () {
  function Corrida(chart, trade) {
    _classCallCheck(this, Corrida);

    this.chart = chart;
    this.trade = trade;
    this.render = this.render.bind(this);
    this.read = this.read.bind(this);
    this.send = this.send.bind(this);
    this.set = this.set.bind(this);
    this.data = this.data.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getTuneData = this.getTuneData.bind(this);
    $("#riskb_".concat(this.trade.id)).on('click', this.handleClick);
    $("#riskon_".concat(this.trade.id)).on('change', this.handleChange);
  }

  _createClass(Corrida, [{
    key: "handleClick",
    value: function handleClick() {
      this.data();
    }
  }, {
    key: "handleChange",
    value: function handleChange() {
      var _this = this;

      console.debug('riskon changed'); // $(`.corida-set-button_${this.trade.id}`).removeClass('basic');

      if ($("#riskon_".concat(this.trade.id)).checkbox('is checked')) {
        $("#smoothing_".concat(this.trade.id, ",#risk_high_").concat(this.trade.id, ",#risk_low_").concat(this.trade.id)).closest('.ui.input').removeClass('disabled');
        $("#risk_high_".concat(this.trade.id, ":not(.initialized)")).val(parseFloat(this.trade.open_price)).addClass('initialized');
        var rr = crm.deal.dataRange ? crm.deal.dataRange : _chart__WEBPACK_IMPORTED_MODULE_0__["SUPPORT_LINE_RANGE"];
        this.chart.setSupport(this.trade.open_price, rr, this.render);
        this.getTuneData().then(function (values) {
          socket.emit('subscribe', {
            subscriptId: _this.trade.user_id
          });
          var tuneData = {
            label: "tuning",
            data: values,
            borderColor: 'rgba(30,37,41,.8)'
          };

          _this.chart.addDataset(tuneData);
        })["catch"](function (x) {
          console.warn('getTuneData:', x);
        });
      } else {
        $("#smoothing_".concat(this.trade.id, ",#risk_high_").concat(this.trade.id, ",#risk_low_").concat(this.trade.id)).closest('.ui.input').addClass('disabled');
        socket.emit('unsubscribe', {
          subscriptId: this.trade.user_id
        });
        this.chart.removeSupports();
        this.chart.removeDataset(1);
      }
    }
  }, {
    key: "render",
    value: function render(level, r) {
      var oldlevel = $("#risk_high_".concat(this.trade.id)).val();
      if (oldlevel != level) $("riskb_".concat(this.trade.id)).removeClass('basic');
      $("#risk_high_".concat(this.trade.id)).val(level);
      $("#risk_low_".concat(this.trade.id)).val(r);
      var open = parseFloat(this.trade.close_price);
      var $aprox = $("#predictions_".concat(this.trade.id, ".predictions tbody"));
      if (isNaN(open)) return;
      var res = crm.deal.calculate(this.trade, level);
      var duration = parseInt(Math.abs(1 - open / level) / 0.0001);
      $aprox.find('tr:eq(0) td:eq(1) strong').html(level.toFixed(5));
      $aprox.find('tr:eq(1) td:eq(1) strong').html(res.profit.currency('T'));
      $aprox.find('tr:eq(1) td:eq(1) small').html(res.percent.toFixed(2) + '%');
      $aprox.find('tr:eq(2) td:eq(1)').prop('value', duration);
      skymechanics.countdown($aprox.find('tr:eq(2) td:eq(1)'));
    }
  }, {
    key: "read",
    value: function read() {
      var that = this;
      $.ajax({
        url: '/json/user/meta',
        dataType: "json",
        data: {
          meta_name: 'user_tune_corida_#' + that.trade.instrument_id,
          user_id: that.trade.user_id
        },
        success: function success(d, x, s) {
          if (typeof d.meta_value != "undefined") {
            that.set(JSON.parse(d.meta_value));
          } else {
            that.set({
              riskon: 0
            });
          }
        }
      });
    }
  }, {
    key: "send",
    value: function send(dd) {
      var that = this;
      $.ajax({
        url: '/json/user/meta',
        dataType: "json",
        data: {
          meta_name: 'user_tune_corida_#' + that.trade.instrument_id,
          meta_value: JSON.stringify(dd),
          user_id: that.trade.user_id
        },
        success: function success(d, x, s) {
          if (typeof d.meta_value != "undefined") that.set(JSON.parse(d.meta_value));else {
            that.set({
              riskon: 0
            });
          }
        }
      });
    }
  }, {
    key: "set",
    value: function set(c) {
      var gp = (c.high + "").split("."),
          precision = gp[1] != undefined ? gp[1].length : 1;
      precision = precision > 5 ? 5 : precision;
      $("#risk_high_".concat(this.trade.id)).val(c.high);
      $("#risk_low_".concat(this.trade.id)).val(c.low);

      if (c.smoothing && setTuneSpeed) {
        setTuneSpeed(parseFloat(c.smoothing));
      }

      if (c.riskon == '1') {
        $("#risk_high_".concat(this.trade.id)).addClass('initialized');
        $("#smoothing,#risk_high,#risk_low_".concat(this.trade.id)).closest('.ui.input').removeClass('disabled');

        if (c.onclose && c.onclose === 1) {
          $("#onclose_".concat(this.trade.id)).checkbox('set checked');
        }

        var range = parseFloat(c.low),
            level = parseFloat(c.high);
        range = level * range / 100;
        this.chart.setSupport(level, range, this.render);
        this.render(level, range);
        $("#riskon_".concat(this.trade.id)).checkbox('set checked');
        $("riskb_".concat(this.trade.id)).addClass('basic');
      } else {
        this.chart.removeSupports();
        $("#smoothing,#risk_high,#risk_low_".concat(this.trade.id)).closest('.ui.input').addClass('disabled');
        $("#riskon_".concat(this.trade.id)).checkbox('set unchecked');
      }

      crm.deal.touch();
    }
  }, {
    key: "change",
    value: function change(max, min) {// $('#risk_high').val(max);
      // $('#risk_low').val(min);
      //
      // if (parseInt($('#riskon').val()) == 1) {
      //     this.send({
      //         riskon: 1,
      //         high: max,
      //         low: 0.5,
      //         onclose:$('#onclose').is('checked')?1:0
      //     });
      // }
    }
  }, {
    key: "data",
    value: function data() {
      var max = parseFloat($("#risk_high_".concat(this.trade.id)).val()),
          min = parseFloat($("#risk_low_".concat(this.trade.id)).val()),
          ro = $("#riskon_".concat(this.trade.id)).checkbox('is checked') ? 1 : 0; // console.debug(ro,max,min);

      var rr = crm.deal.dataRange ? crm.deal.dataRange : _chart__WEBPACK_IMPORTED_MODULE_0__["SUPPORT_LINE_RANGE"];
      $('[data-name=onclose]').prop('disabled', false);
      $("riskb_".concat(this.trade.id)).addClass('basic');
      this.send({
        riskon: ro,
        high: max,
        low: rr,
        onclose: $("#onclose_".concat(this.trade.id)).checkbox('is checked') ? 1 : 0,
        deal_id: this.trade.id
      });
    }
  }, {
    key: "getTuneData",
    value: function getTuneData() {
      var time = new Date().getTime() - 360000;
      var endpoint = "/data/histominute/1?instrument_id=".concat(this.trade.instrument_id, "&user_id=").concat(this.trade.user_id, "&date_from=").concat(time, "&limit=16");
      return new Promise(function (resolve, reject) {
        $.ajax({
          url: endpoint,
          success: function success(d) {
            var data = [];
            d.reverse().map(function (row, i) {
              var dt = new Date(row.time * 1000);
              var level = parseFloat(row.close);
              data.push({
                x: dt,
                y: level
              });
            });
            resolve(data);
          },
          error: function error(x) {
            reject(x);
          }
        });
      });
    }
  }]);

  return Corrida;
}();
var Deals =
/*#__PURE__*/
function () {
  function Deals() {
    _classCallCheck(this, Deals);

    this.current = undefined;
    this._current = undefined;
    this.corrida = null;
    this.tune = new Tune();
    this.smchart = null;
    this.container = null;
    this.dataRange = _chart__WEBPACK_IMPORTED_MODULE_0__["SUPPORT_LINE_RANGE"];
    this.TUNE_SPEED = {
      slow: 0.0001,
      normal: 0.0005,
      fast: 0.0012
    };
    this._data = {};
    this.onPrice = this.onPrice.bind(this);
    this.chart = this.chart.bind(this);
    this.list = this.list.bind(this);
    this.info = this.info.bind(this);
  }

  _createClass(Deals, [{
    key: "touch",
    value: function touch() {
      skymechanics.touch('deal-list');
    }
  }, {
    key: "onClose",
    value: function onClose() {
      skymechanics.touch('deal-list');
      $('.ui.modal').modal('hide');
    }
  }, {
    key: "showList",
    value: function showList() {
      $('.popup.deals').fadeIn(animationTime ? animationTime : 256);
      $('body').addClass('active');
    }
  }, {
    key: "terminate",
    value: function terminate(id) {
      var price = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var params = {
        deal_id: id
      };
      if (price !== false) params['current_price'] = price;
      $.ajax({
        url: "/deal/delete",
        data: params,
        success: function success(d, x, s) {
          crm.deal.onClose();
        }
      });
    }
  }, {
    key: "list",
    value: function list(container, d, x, s) {
      // console.debug('deals list '+d.data.length);
      container.html('');

      for (var i in d.data) {
        var row = d.data[i],
            _s = '<tr data-class="deal" data-id="' + row.id + '" class="' + (row.account && row.account.type == 'real' ? 'positive' : '') + '">',
            tradeBalance = parseFloat(row.profit) + (row.type == 'forex' ? 0 : parseFloat(row.amount)),
            type = row.type == 'forex' ? 'fx' : 'sm';

        this._data[row.id] = row;
        _s += '<td class="center aligned">' + dateFormat(row.created_at) + '</td>';
        _s += '<td><a href="javascript:crm.deal.info(' + row.id + ')">#' + row.id + '&nbsp;' + row.instrument.symbol + '</a><br><small>' + row.status.name + '</small><br/><small><strong>' + type + '</strong></small></td>';
        _s += '<td>#' + row.user.id + ' <a onclick="crm.user.card(' + row.user.id + ')">' + row.user.name + ' ' + row.user.surname + '</a>' + '<br><small><i class="icon mail"></i>' + row.user.email + '</small>' + '<br><small><i class="icon phone"></i>' + row.user.phone + '</small>' + '<br><small><i class="icon world"></i>' + crm.user.getMeta(row.user.meta, 'country') + '</small>' + '</td>';
        _s += row.user.manager ? '<td><a onclick="crm.user.card(' + row.user.manager.id + ')" data-class="manager" data-id="' + row.user.manager.id + '">' + row.user.manager.name + ' ' + row.user.manager.surname + '</a></td>' : '<td></td>';
        _s += '<td>' + '<a href="javascript:crm.instrument.edit(' + row.instrument_id + ')" data-class="instrument" data-id="' + row.instrument_id + '">' + row.instrument.title + '<br><small>' + row.instrument.source.name + '</small></a>' + '<br><small><strong>' + (row.account && row.account.type == 'real' ? 'Live account' : 'Demo account') + '</strong></small>' + '</td>';
        _s += '<td class="right aligned">' + '<i class="big arrow circle outline color ' + (row.direction == -1 ? 'down red' : 'up green') + ' icon"></i>' + parseFloat(row.invested).currency('T') + '<span class="description">x' + row.multiplier + '</span></div>' + '<br/><small>fee: ' + parseFloat(row.fee).currency('T') + '</small>' + '<br><small>SL:' + row.stop_low + '<br>TP:' + row.stop_high + '</small>' + '</td>';
        _s += '<td class="right aligned"><strong>' + tradeBalance.currency('T') + '</strong><br/><small>O:' + row.open_price + '</small><br/><small>C:' + crm.instrument.prices.element(row.close_price) + '</small></td>';
        var dealAction = user.rights_id > 7 && row.status_id < 100 ? "<button class=\"ui red icon button\" onclick=\"crm.deal.terminate(".concat(row.id, ")\"><i class=\"ui close icon\"></i></button>") : '';
        _s += '<td>' + (row.status_id != 20 && row.is_tune == 'Y' ? '<i class="checkmark icon">' : '&nbsp;') + dealAction + '</td>'; // s+='<td><a href="#" onclick="crm.deal.edit('+row.id+')" id="edit_deal">{{ trans('messages.edit') }}</a><a href="#" onclick="crm.deal.info('+row.id+')" class="edit">{{ trans('messages.info') }}</a></td>';
        // s+='<td><a href="#" onclick="crm.deal.info('+row.id+')" class="edit">{{ trans('messages.info') }}</a></td>';

        _s += '</tr>';
        container.append(_s);
      }

      page.paginate(d, 'deal-list', container);
      $('.ui.table.sortable:not(.assigned)').addClass('assigned').tablesort();
      $('[data-name=search]:visible').each(function () {
        var $that = $(this),
            keyword = $that.val();
        $("table:visible tbody tr td").unmark({
          done: function done() {
            $("table:visible tbody tr td").mark(keyword, {});
          }
        });
      });
    }
  }, {
    key: "info",
    value: function info(id) {
      if (!arguments.length) return;
      var id = arguments[0];
      var that = this;
      this._current = id;

      if (that._data[id]) {
        cardContainer.append(new _trade_trade__WEBPACK_IMPORTED_MODULE_1__["Trade"](that._data[id]));
        return;
      } else {
        $.ajax({
          url: "/json/deal/" + id + '/info',
          dataType: "json",
          success: function success(d, x, s) {
            that._data[id] = d.data[0];
            cardContainer.append(new _trade_trade__WEBPACK_IMPORTED_MODULE_1__["Trade"](that._data[id]));
          }
        });
        return;
      }

      if (id == undefined) return;
      var $dash = page.modalPreloaderStart("deal_".concat(id, "_dashboard"));
      $.ajax({
        url: "/html/deal/" + id + '/info',
        dataType: "html",
        success: function success(d, x, s) {
          page.modalPreloaderEnd($dash, d, true);
          window.SUBSCRIBE_PRICE = true;
        }
      });
    }
  }, {
    key: "calculate",
    value: function calculate(trade, price) {
      var op = parseFloat(trade.open_price),
          da = parseFloat(trade.amount),
          df = parseFloat(trade.fee),
          dm = parseInt(trade.multiplier),
          dd = parseInt(trade.direction),
          p = (price / op - 1) * dd * dm * da;
      return {
        profit: p + da,
        percent: 100 * ((p - df) / (da + df))
      };
    }
  }, {
    key: "onPrice",
    value: function onPrice(price) {
      if (this.smchart && this.current && this.current.instrument_id == price.instrument_id) {
        var time = new Date(price.time * 1000);
        var n = parseFloat(price.price);
        var trade = this.current;
        var $f = this.container.parents('.ui.modal').find('.current');
        var $o = this.container.parents('.ui.modal').find('.profit');
        var $p = this.container.parents('.ui.modal').find('.percent');
        var last = parseFloat($f.text().replace(/[\s,]/g, ''));
        var pd = n > last ? 'green' : 'red';
        this.container.parents('.ui.active.loader').removeClass('active loader'); // console.debug('chart updated',n,trade);

        var calc = crm.deal.calculate(trade, n);
        $p.parents('td').removeClass('green red changed').addClass((calc.profit > 0 ? 'green' : 'red') + ' changed');
        $p.html(calc.percent.currency('') + '%');
        $o.html(calc.profit.currency(''));
        $f.removeClass('green red changed').addClass(pd + ' changed').html(n.currency('', 5));
        this.smchart.set(time, n, price.tune ? 1 : 0);
      }
    }
  }, {
    key: "chart",
    value: function chart($c, d) {
      var data = [],
          labels = [];
      d = d.reverse();
      var level = 0;
      var range = 0;
      var minLevel = false;
      var maxLevel = false;
      var pairId = null;
      this.container = $c;
      var trade = this._data[this._current];
      d.map(function (row, i) {
        var dt = new Date(row.time * 1000);
        level = parseFloat(row.close);
        pairId = row.instrument_id;
        labels.push(dt);
        data.push({
          x: dt,
          y: level
        });
        var newr = Math.abs(parseFloat(row.high) - parseFloat(row.low));
        if (i != 0) range = range + newr / (i + 1);else range = newr;
        minLevel = minLevel == false || minLevel > parseFloat(row.low) ? parseFloat(row.low) : minLevel;
        maxLevel = maxLevel == false || maxLevel < parseFloat(row.high) ? parseFloat(row.high) : maxLevel;
      });
      this.dataRange = (maxLevel - minLevel) / level;
      this.dataRange = this.dataRange / 10;
      console.debug('abg range ohlc/level', this.dataRange);
      this.onPrice({
        // set current price
        instrument_id: pairId,
        price: level
      });
      this.smchart = new _chart__WEBPACK_IMPORTED_MODULE_0__["SMChart"](pairId, {
        ctx: $c.find('.chart:first'),
        data: {
          label: __('crm.instruments.prices'),
          keys: labels,
          values: data
        },
        onUpdate: function onUpdate(p) {
          var n = parseFloat(p.y),
              trade = $c.parents('.ui.modal').find('#trade_data').length ? JSON.parse($c.parents('.ui.modal').find('#trade_data').text()) : undefined,
              $f = $c.parents('.ui.modal').find('.current'),
              $o = $c.parents('.ui.modal').find('.profit'),
              $p = $c.parents('.ui.modal').find('.percent'),
              last = parseFloat($f.text().replace(/[\s,]/g, '')),
              pd = n > last ? 'green' : 'red';
          if (!trade) return;
          $c.parents('.ui.active.loader').removeClass('active loader'); // console.debug('chart updated',n,trade);

          var calc = crm.deal.calculate(trade, n); // console.debug(calc);

          $p.parents('td').removeClass('green red changed').addClass((calc.profit > 0 ? 'green' : 'red') + ' changed');
          $p.html(calc.percent.currency('') + '%');
          $o.html(calc.profit.currency(''));
          $f.removeClass('green red changed').addClass(pd + ' changed').html(n.currency('', 5));
        }
      }); // this.smchart.setSupport(level,level*.5);

      this.corrida = new Corrida(this.smchart, trade);
      this.corrida.read();
    }
  }]);

  return Deals;
}();

var Tune =
/*#__PURE__*/
function () {
  function Tune() {
    _classCallCheck(this, Tune);

    this.raw = {};
  }

  _createClass(Tune, [{
    key: "read",
    value: function read() {
      $.ajax({
        url: '/json/user/meta',
        dataType: "json",
        data: {
          meta_name: 'user_tune_#' + deal.instrument.id,
          user_id: deal.user.id
        },
        success: function success(d, x, s) {
          if (typeof d.meta_value != "undefined") deal.tune.setData(JSON.parse(d.meta_value));
        }
      });
    }
  }, {
    key: "send",
    value: function send() {
      $.ajax({
        url: '/json/user/meta',
        dataType: "json",
        data: {
          meta_name: 'user_tune_#' + deal.instrument.id,
          meta_value: deal.tune.makeData(),
          user_id: deal.user.id
        }
      });
    }
  }, {
    key: "real",
    value: function real() {
      var currentProfit = parseFloat($('#deal_{{$deal->id}}_profit').text());
      deal.tune.setData({
        profit: 0,
        //parseFloat($('#deal_{{$deal->id}}_profit').text()),
        flying: $("#tune_{{$deal->id}} #flying").val()
      }); // deal.tune.send();
    }
  }, {
    key: "change",
    value: function change() {
      deal.tune.send();
    }
  }]);

  return Tune;
}();

/* harmony default export */ __webpack_exports__["default"] = (Deals);

/***/ }),

/***/ "./resources/assets/js/modules/events.js":
/*!***********************************************!*\
  !*** ./resources/assets/js/modules/events.js ***!
  \***********************************************/
/*! exports provided: Events */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Events", function() { return Events; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Events =
/*#__PURE__*/
function () {
  function Events() {
    _classCallCheck(this, Events);

    this.container = $('#dashboard_events'); // const $counter = this.container.find('.count');
    // $counter.prop('number',parseInt($counter.text()));

    this.render = this.render.bind(this);
    this.dashboard = this.dashboard.bind(this);
    this.touch = this.touch.bind(this);
    this.close = this.close.bind(this);
    this.closeAll = this.closeAll.bind(this);
    this.view = this.view.bind(this);
    this.init = this.init.bind(this);
    this.flushEvent = this.flushEvent.bind(this);
    this.container.find('.count').fadeOut();
    this.container.find('.menu').fadeOut().html(''); // $('.events').popup({
    //     inline      : true,
    //     hoverable   : true,
    //     position    : 'bottom right',
    //     preserve    : true,
    //     context     : $('.top.fixed.menu'),
    //     delay       : {
    //         show: 300,
    //         hide: 800
    //     }
    // });
  }

  _createClass(Events, [{
    key: "init",
    value: function init(d) {
      this.data = d;
      this.render();
    }
  }, {
    key: "indexOf",
    value: function indexOf(id) {
      var res = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
      res = undefined;

      for (var i = 0; i < this.data.length; ++i) {
        var item = this.data[i];
        res = item;
        if (item.id == id) return i;
      }

      return -1;
    }
  }, {
    key: "append",
    value: function append(e) {
      var _this = this;

      this.container.removeClass('yellow changed');
      this.data.push(e);
      this.render().then(function () {
        _this.container.addClass('yellow changed');
      });
    }
  }, {
    key: "touch",
    value: function touch() {
      cf.touch('dashboard-events');
    }
  }, {
    key: "close",
    value: function close(id) {
      var status = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "closed";
      var that = this;
      var $counter = this.container.find('.count');
      var count = parseInt($counter.text());
      count = isNaN(count) ? '99+' : count;
      $.ajax({
        url: "/user/event/".concat(id, "/update"),
        data: {
          status: "".concat(status)
        },
        success: function success(d) {
          $("#event-".concat(id)).fadeOut();
          $counter.text(--count); //

          that.flushEvent(id);

          if (that.data && that.data.length == 0) {
            that.container.find('.count').fadeOut();
            that.container.find('.menu').fadeOut().html('');
          }
        }
      });
    }
  }, {
    key: "closeAll",
    value: function closeAll() {
      var that = this;
      this.data.map(function (item) {
        that.close(item.id);
      });
      this.data = [];
    }
  }, {
    key: "view",
    value: function view(id) {
      this.close(id, "watched");
    }
  }, {
    key: "flushEvent",
    value: function flushEvent(id) {
      var i = 0;
      var found = false;

      for (i = 0; i < this.data.length; ++i) {
        var item = this.data[i];

        if (item.id == id) {
          found = true;
          break;
        }
      }

      if (found) this.data.slice(i, 1);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        try {
          if (!_this2.data.length) return;

          var $c = _this2.container.find('.menu');

          var eventLength = 0;
          var that = _this2;
          $c.html('');
          $('<a class="icon item"><i class="ui close icon"></i>Close all</a>').appendTo($c).on('click', _this2.closeAll);
          $c = $('<div class="ui divided items"></div>').appendTo($c);
          var needTouches = {
            deal: 0,
            user: 0,
            merchant: 0,
            finance: 0
          };
          var ctime = new Date().getTime();

          _this2.data.map(function (row, i) {
            if (user.rights_id >= 8 || user.childs.indexOf(row.user.parent_user_id) > -1 || user.childs.indexOf(row.user.affilate_id) > -1) {
              eventLength++;
              var $itm = $("<a class=\"item event\" id=\"event-".concat(row.id, "\"></a>")).appendTo($c);
              var color = '';
              var icon = 'blank';
              var text = 'new';
              var what = row.object_type + ' ' + row.type;

              var func = function func() {};

              switch (row.object_type) {
                case 'deal':
                  var pair = system.pairs.get(row.object.instrument_id);
                  what = "Trade #".concat(row.object_id);

                  switch (row.type) {
                    case 'close':
                      what += ' closed';
                      break;

                    case 'new':
                      what += ' opened';
                      break;

                    default:
                      break;
                  }

                  var pairIcons = '';
                  if (currency.byId(pair.from_currency_id)) pairIcons += "<i class=\"ic ic_".concat(currency.byId(pair.from_currency_id).code.toLowerCase(), "\"></i>");
                  if (currency.byId(pair.to_currency_id)) pairIcons += "<i class=\" ic ic_".concat(currency.byId(pair.to_currency_id).code.toLowerCase(), "\"></i>");
                  text = "".concat(pairIcons, "&nbsp;<strong>").concat(pair.title, "</strong> ").concat(row.object.invested.dollars(), " <sup>x").concat(row.object.multiplier.integer(), "</sup> ");
                  icon = 'industry';

                  func = function func() {
                    crm.deal.info(row.object_id);
                  };

                  needTouches.deal = ctime; // console.debug('trade changed need card touch',row,cardContainer,cardContainer.cards[`ctrade_${row.object_id}`]);

                  if (cardContainer && cardContainer.cards["ctrade_".concat(row.object_id)]) {
                    cardContainer.cards["ctrade_".concat(row.object_id)].fresh(row.object);
                    cardContainer.touch("ctrade_".concat(row.object_id));
                  } // crm.deal.touch();


                  break;

                case 'user':
                  what = "Customer #".concat(row.object_id);
                  text = "".concat(row.object.title);
                  icon = 'user';

                  func = function func() {
                    crm.user.card(row.object_id);
                  };

                  needTouches.user = ctime;
                  break;

                case 'transaction':
                  what = 'Deposit request';
                  text = row.object.amount.dollars();
                  icon = 'dollar';

                  func = function func() {
                    page.show(_this2, 'finance', 'transactions');
                  };

                  needTouches.merchant = ctime;
                  break;

                case 'invoice':
                  what = 'Deposit';
                  text = row.object.amount.dollars();
                  icon = 'dollar';

                  func = function func() {
                    page.show(_this2, 'finance', 'transactions');
                  }; // crm.merchant.touch();


                  needTouches.merchant = ctime;
                  break;

                case 'withdrawal':
                  what = 'Withdrawal';
                  icon = 'money bill alternate';
                  text = row.object.amount.dollars();

                  func = function func() {
                    page.show(_this2, 'finance', 'withdrawals');
                  }; // crm.merchant.touch();


                  needTouches.merchant = ctime;
                  needTouches.finance = ctime;
                  break;
              }

              switch (row.type) {
                case 'message':
                  what = __("crm.new_message");
                  text = "".concat(row.object && row.object.message ? row.object.message : '');
                  icon = 'letter';

                  func = function func() {
                    crm.user.card(row.user_id);
                  };

                  break;

                case 'kyc':
                  text = 'New document scan uploaded';
                  needTouches.user = ctime;

                  func = function func() {
                    crm.user.card(row.user_id);
                  };

                  if (cardContainer && cardContainer.cards["cuser_".concat(row.object_id)]) {
                    cardContainer.cards["cuser_".concat(row.object_id)].fresh(row.object);
                    cardContainer.touch("cuser_".concat(row.object_id));
                  }

                  break;

                case 'tuned':
                  text = 'tune reached level';
                  $itm.addClass('alarm');
                  break;

                case 'margincall':
                  text = __('crm.margincall');
                  $itm.addClass('alarm');
                  break;
              } // $(`<div class="image"><i class="ui ${icon} huge icon"></i></div>`).appendTo($itm);


              var $cnt = $("<div class=\"middle aligned content\"></div>").appendTo($itm);
              $("<div class=\"header\"><i class=\"ui ".concat(icon, " icon\"></i>").concat(what, "</div>")).appendTo($cnt);
              $("<div class=\"description\"><p>".concat(text, "</p><p><a href=\"javascript:crm.user.card(").concat(row.user_id, ")\">").concat(row.user.title, "</a></p></div>")).appendTo($cnt);
              var $action = $("<div class=\"extra\"></div>").appendTo($cnt);
              $("<button class=\"ui icon basic button\"><i class=\"ui eye icon\"></i>Hide</button>").appendTo($action).on('click', function () {
                that.view(row.id);
              });
              $("<button class=\"ui primary basic button\">View</button>").appendTo($action).on('click', function () {
                that.view(row.id);
                func();
              });
            }
          });

          if (eventLength) {
            $c.fadeIn();

            _this2.container.fadeIn();

            if (eventLength >= 100) eventLength = '99+';

            _this2.container.find('.count').fadeIn();

            _this2.container.find('.count').html(eventLength); //animateNumber({number:(this.data.length),numberStep:function(now,tween){$(tween.elem).html(now);}}).prop('number',this.data.length);

          } else {
            $c.fadeOut();

            _this2.container.find('.count').fadeOut();

            that.container.find('.menu').fadeOut().html('');
          }

          Object.keys(needTouches).map(function (k, i) {// if(crm[k] && crm[k].touch)crm[k].touch();
          });
          resolve();
        } catch (e) {
          reject(e);
        }
      });
    }
  }, {
    key: "dashboard",
    value: function dashboard($cont, d) {
      var counts = 0,
          errors = 0,
          $c = $cont.find('.menu');
      crm.events.data = d;
      console.debug(d);
      $c.html('');
      $c.append('<a class="item" onclick="crm.events.closeAll(this)">Close all</a>');

      var _loop = function _loop() {
        var row = d[i],
            type = row.type,
            what = row.object_type;
        if (row.user_id == system.user.id) return "continue";
        counts++;
        var $card = $("<div class=\"ui card\" data-id=\"".concat(row.id, "\"></div>")).appendTo($c);
        var $data = $('<div class="content ui link"></div>').appendTo($card);
        var $actions = $('<div class="extra content"></div>').appendTo($card);

        switch (row.object_type) {
          case 'deal':
            what = 'Trade';
            break;

          case 'user':
            what = 'Customer';
            break;

          case 'invoice':
            what = 'Deposit';
            break;

          case 'withdrawal':
            what = 'Withdrawal';
            break;
        }

        switch (row.type) {
          case 'kyc':
            type = 'New document scan uploaded';
            break;

          case 'tuned':
            type = 'tune reached level';
            break;
        }

        $actions = $('<div class="meta right aligned"></div>').appendTo($actions);
        $viewBtn = $('<button class="ui small basic button" onclick="crm.events.view(this,' + row.id + ')"><i class="icon eye"></i>View</button>').appendTo($actions);
        $actions.append('<button class="ui black small button" onclick="crm.events.close(this,' + row.id + ')">Close</button>');
        $data.append('<div class="right floated right aligned">' + dateFormat(row.created_at, true, 'simple') + '</div>');
        $data.append('<div class="header">' + what + ' <small>' + type + '</small></div>');
        $data.append('<div class="meta"><i class="icon user"></i>' + row.user.name + ' ' + row.user.surname + '</div>');

        if (row.object_type == 'deal' && row.object) {
          pair = system.pairs.get(row.object.instrument_id);
          object_id = row.object_id;
          pnl = ((parseFloat(row.object.profit) + parseFloat(row.object.amount)) / parseFloat(row.object.invested) - 1) * 100;
          $data.append('<div class="meta ' + (pnl > 0 ? 'red' : 'green') + ' color">' + '#<small>' + row.object.id + '</small><i class="ic ic_' + pair.from.code.toLowerCase() + '"></i><i style="margin-left:-10px;" class="ic ic_' + pair.to.code.toLowerCase() + '"></i><strong>' + pair.title + '</strong>' + '<br/><br/><span class="">Profit: <b>' + (row.object.profit + row.object.amount).currency('T') + '</b> P&L: ' + pnl.toFixed(2) + '%</span>' + '</div>');
          $viewBtn.on('click', function () {
            crm.deal.info(object_id);
          });
        } else if (row.object_type == 'user') {
          $viewBtn.on('click', function () {
            crm.user.card(row.object_id);
          });
        } else if (row.object_type == 'error') {
          $viewBtn.hide();
          $card.addClass('red negotive');
          $data.addClass('red negotive');
          $actions.addClass('red negotive');
          errors++;
        } else if (row.object_type == 'invoice') {
          $data.append('<div class="meta">' + '#<small>' + row.object.id + '</small>' + '<br/><br/>Amount: <strong>' + row.object.amount.currency('T') + '</strong>' + '</div>');
          $viewBtn.on('click', function () {
            crm.user.card(row.object_id, 'finance');
          });
        } else if (row.object_type == 'withdrawal') {
          $data.append('<div class="meta">' + '#<small>' + row.object.id + '</small>' + '<br/><br/>Amount: <strong>' + row.object.amount.currency('T') + '</strong>' + '</div>');
          $viewBtn.on('click', function () {
            crm.user.card(row.object_id, 'finance');
          });
        } // else $data.on('click',function(){crm.user.card(row.user.id,'trades')});

      };

      for (var i in d) {
        var $viewBtn;
        var pair, object_id, pnl;

        var _ret = _loop();

        if (_ret === "continue") continue;
      }

      $cont.find('div:eq(0)').html(counts > 100 ? '99+' : counts).removeClass("red olive").addClass(errors ? 'red' : 'olive');

      if (counts) {
        $cont.fadeIn();
      } else {
        $cont.fadeOut();
        $cont.find('.menu').html('');
      }
    }
  }, {
    key: "dashboardPopup",
    value: function dashboardPopup($c, d) {
      var counts = 0;
      var errors = 0;
      var $cont = $('#dashboard_events');
      crm.events.data = d;
      $c.html('');
      var $containter = $('<div class="ui container five column relaxed divided grid"></div>').appendTo($c);
      var $customers = $('<div class="column"></div>').appendTo($containter);
      var $deposits = $('<div class="column"></div>').appendTo($containter);
      var $withdrawals = $('<div class="column"></div>').appendTo($containter);
      var $trades = $('<div class="column"></div>').appendTo($containter);
      var $errors = $('<div class="column"></div>').appendTo($containter);
      var $customersHead = $('<h4 class="ui header"><i class="ui user icon"></i>Customers</h4>').appendTo($customers);
      var $depositsHead = $('<h4 class="ui header"><i class="ui dollar icon"></i>Deposits</h4>').appendTo($deposits);
      $customers = $('<div class="ui divided items"></div>').appendTo($customers); // $c.append('<a class="item" onclick="crm.events.closeAll(this)">Close all</a>');

      crm.events.data.map(function (row, i) {
        var type = row.type;
        var what = row.object_type; // if (row.user_id == system.user.id) continue;

        counts++;
        var $item = $('<div class="ui tiny item"></item>');

        if (what == 'user') {
          $item.appendTo($customers);
          $item.append("<div class=\"content\">\n                        <div class=\"image\"></div>\n                        <div class=\"small header\">".concat(type, " Customer</div>\n                        <div class=\"ui description\"><i class=\"ui user icon\"></i>").concat(row.user.title, "</div>\n                    </div>"));
          $item.on('click', function () {
            crm.user.card(row.object_id);
          });
        } // let $card = $('<div class="ui card" data-id="' + row.id +'"></div>').appendTo($c),
        //     $data = $('<div class="content ui link"></div>').appendTo($card),
        //     $actions = $('<div class="extra content"></div>').appendTo($card);
        // switch (row.object_type) {
        //     case 'deal':
        //         what = 'Trade';
        //         break;
        //     case 'user':
        //         what = 'Customer';
        //         break;
        //     case 'invoice':
        //         what = 'Deposit';
        //         break;
        //     case 'withdrawal':
        //         what = 'Withdrawal';
        //         break;
        // }
        // switch (row.type) {
        //     case 'kyc':
        //         type = 'New document scan uploaded';
        //         break;
        //     case 'tuned':
        //         type = 'tune reached level';
        //         break;
        // }
        // $actions = $('<div class="meta right aligned"></div>').appendTo($actions);
        // var $viewBtn = $('<button class="ui small basic button" onclick="crm.events.view(this,' +row.id + ')"><i class="icon eye"></i>View</button>').appendTo($actions);
        // $actions.append('<button class="ui black small button" onclick="crm.events.close(this,' +row.id + ')">Close</button>');
        // $data.append('<div class="right floated right aligned">' +dateFormat(row.created_at, true, 'simple') + '</div>');
        // $data.append('<div class="header">' + what + ' <small>' + type +'</small></div>')
        // $data.append('<div class="meta"><i class="icon user"></i>' +row.user.name + ' ' + row.user.surname + '</div>');
        // if (row.object_type == 'deal' && row.object) {
        //     var pair = system.pairs.get(row.object.instrument_id),
        //         object_id = row.object_id,
        //         pnl = (((parseFloat(row.object.profit) + parseFloat(row.object.amount)) / parseFloat(row.object.invested)) -1) * 100;
        //     $data.append('<div class="meta ' + ((pnl > 0) ? 'red' :'green') + ' color">' + '#<small>' + row.object.id + '</small><i class="ic ic_' +pair.from.code.toLowerCase() +'"></i><i style="margin-left:-10px;" class="ic ic_' +pair.to.code.toLowerCase() + '"></i><strong>' + pair.title +
        //         '</strong>' +
        //         '<br/><br/><span class="">Profit: <b>' + (row.object
        //             .profit + row.object.amount).currency('T') +
        //         '</b> P&L: ' + pnl.toFixed(2) + '%</span>'
        //
        //         + '</div>');
        //     $viewBtn.on('click', function() {
        //         crm.deal.info(object_id)
        //     });
        // } else if (row.object_type == 'user') {
        //     $viewBtn.on('click', function() {crm.user.card(row.object_id)});
        // } else if (row.object_type == 'error') {
        //     $viewBtn.hide();
        //     $card.addClass('red negotive');
        //     $data.addClass('red negotive');
        //     $actions.addClass('red negotive');
        //     errors++;
        // } else if (row.object_type == 'invoice') {
        //     $data.append('<div class="meta">' + '#<small>' + row.object.id + '</small>' + '<br/><br/>Amount: <strong>' +row.object.amount.currency('T') + '</strong>' +'</div>');
        //     $viewBtn.on('click', function() {crm.user.card(row.object_id, 'finance')});
        // } else if (row.object_type == 'withdrawal') {
        //     $data.append('<div class="meta">' + '#<small>' + row.object.id + '</small>' + '<br/><br/>Amount: <strong>' +row.object.amount.currency('T') + '</strong>' +'</div>');
        //     $viewBtn.on('click', function() {crm.user.card(row.object_id, 'finance') });
        // }
        // else $data.on('click',function(){crm.user.card(row.user.id,'trades')});

      });
      $cont.find('div:eq(0)').html(counts > 100 ? '99+' : counts).removeClass("red olive").addClass(errors ? 'red' : 'olive');

      if (counts) {
        $cont.fadeIn();
      } else {
        $cont.fadeOut();
      }
    }
  }]);

  return Events;
}();
;
Events.prototype.data = [];

/***/ }),

/***/ "./resources/assets/js/modules/finance.js":
/*!************************************************!*\
  !*** ./resources/assets/js/modules/finance.js ***!
  \************************************************/
/*! exports provided: Finance */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Finance", function() { return Finance; });
/* harmony import */ var _components_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../components/index */ "./resources/assets/js/components/index.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }


var Finance =
/*#__PURE__*/
function () {
  function Finance() {
    _classCallCheck(this, Finance);

    this.__currentPeriod = '7d';
    this.charts = {};
  }

  _createClass(Finance, [{
    key: "touch",
    value: function touch() {
      cf.touch('user-withdrawals');
      cf.touch('user-transactions');
    }
  }, {
    key: "byperiod",
    value: function byperiod(that, p) {
      $('.byperiod .active').removeClass('active');
      $('.date').fadeOut(function () {
        $('.date.' + p).fadeIn();
      });
      $(that).addClass('active');
      crm.finance.__currentPeriod = p;
      cf.touch('finance-report-r');
      cf.touch('finance-report-d');
      cf.touch('finance-report-w');
    }
  }, {
    key: "withdrawals",
    value: function withdrawals($c, d) {
      var cbd = {
        ctx: $c.find('.chart:first').get(0),
        data: {},
        raw: {}
      },
          cbm = {
        ctx: $c.find('.chart:last').get(0),
        data: {},
        raw: {}
      },
          cbo = {},
          $t = $c.find('.table tbody');

      for (var i in d) {
        var row = d[i],
            dt = new Date(row.date * 1000),
            date = leftZeroPad(dt.getDate()) + ' ' + system.months[dt.getMonth()],
            amount = parseFloat(row.amount),
            office = row.office,
            //(row.user && row.user.manager)?crm.user.getMeta(row.user.manager.meta,'office'):'notset',
        status = row.status;
        cbd.raw[date] = cbd.raw[date] ? cbd.raw[date] : 0;
        cbd.raw[date] += amount;
        cbm.raw[status] = cbm.raw[status] ? cbm.raw[status] : 0;
        cbm.raw[status] += amount;
        cbo[office] = cbo[office] ? cbo[office] : {
          amount: 0,
          total: 0
        };
        cbo[office].amount += amount;
        cbo[office].total++;
      }

      cbd.data = splitObjectKeys(cbd.raw);
      cbm.data = splitObjectKeys(cbm.raw);
      if (cbd.ctx) var chart = new Chart(cbd.ctx.getContext('2d'), {
        type: 'bar',
        data: {
          labels: cbd.data.keys,
          datasets: [{
            label: "Withdrawals",
            borderColor: page.dashboard.options.chart.borderColors[0],
            data: cbd.data.values
          }]
        },
        options: {}
      });
      if (cbm.ctx) var chart = new Chart(cbm.ctx.getContext('2d'), {
        type: 'pie',
        data: {
          labels: cbm.data.keys,
          datasets: [{
            label: "Withdrawals",
            backgroundColor: page.dashboard.options.chart.backgroundColors,
            borderColor: page.dashboard.options.chart.borderColors,
            data: cbm.data.values
          }]
        },
        options: {}
      });
      $t.html('');

      for (var i in cbo) {
        $t.append('<tr><td>' + i + '</td><td class="right aligned">' + cbo[i].total + '</td><td class="ui header right aligned">' + cbo[i].amount.currency('T') + '</td></tr>');
      }
    }
  }, {
    key: "withdrawal",
    value: function withdrawal($c, d) {
      $c.html('');
      var totals = {
        request: 0,
        approved: 0,
        declined: 0,
        total: 0
      };
      var totalAproved = 0;

      for (var i in d.data) {
        var row = d.data[i],
            $tr = $("<tr></tr>"),
            manager = row.manager ? row.manager : undefined;
        totals.total += parseFloat(row.amount);

        switch (row.status) {
          case 'approved':
            totals.approved += parseFloat(row.amount);
            break;

          case 'declined':
            totals.declined += parseFloat(row.amount);
            break;

          case 'request':
            totals.request += parseFloat(row.request);
            break;
        }

        if (row.status == 'approved') $tr.addClass('positive');
        if (row.status == 'declined') $tr.addClass('negative');
        $('<td class="center aligned">' + dateFormat(row.created_at) + '</td>').appendTo($tr); // $('<td>'+((row.merchant)?row.merchant.title:'')+'</td>').appendTo($tr);

        $("<td>".concat(row.account ? crm.user.showCustomer(row.account.user) : '', "</td>")).appendTo($tr); // $('<td><a onclick="crm.user.card('+row.account.user.id+')" data-class="user" data-id="'+row.account.user.id+'">'+row.account.user.name+' '+row.account.user.surname+'</a>'
        //     +'<br/><small><i class="icon mail"></i>'+row.account.user.email+'</small>'
        //     +'<br/><small><i class="icon phone"></i>'+row.account.user.phone+'</small>'
        //     +'</td>').appendTo($tr);
        // $((manager)?'<td class="ui center middle aligned"><a href="#"  onclick="crm.user.card('+manager.id+')" data-class="manager" data-id="'+manager.id+'">'+manager.name+' '+manager.surname+'</a></td>':'<td></td>').appendTo($tr);

        $('<td class="center aligned"><h3>' + row.status + '</h3>' + (row.status != 'request' ? dateFormat(row.created_at) : '') + '</td>').appendTo($tr);
        $('<td>' + parseFloat(row.amount).currency('T ') + '</td>').appendTo($tr);

        if (row.status == 'request' && system.user.rights_id >= 8) {
          $('<td>' + '<div class="submiter" data-action="/json/finance/withdrawal/' + row.id + '/approved" data-callback="crm.finance.withdrawalCallback" style="display:inline-block"><button class="ui secondary button submit">Approve</button></div>' // +'<div class="submiter" data-action="/json/finance/withdrawal/'+row.id+'/declined" data-callback="crm.finance.withdrawalCallback" style="display:inline-block"><div class="ui buttons">'
          + '<button class="ui button submit" onclick="crm.finance.withdrawalDecline(' + row.id + ')">Decline</button>' // +'<div class="ui floating dropdown icon button submit" data-trigger="change"><input type="hidden" name="comment" data-name="comment"/>'
          //     +'<div class="default text">Decline</div>'
          //     +'&nbsp;<i class="dropdown icon"></i>'
          //     +'<div class="menu">'
          //         +'<div class="item" data-value="Not enough balance">Not enough balance</div>'
          //         +'<div class="item" data-value="Can\'t withdraw bonus">Can\'t withdraw bonus</div>'
          //         +'<div class="item" data-value="Need verification docs">Need verification docs</div>'
          //     +'</div>'
          // +'</div></div>'
          // +'</div>'
          + '</td>').appendTo($tr);
        } else {
          var comment = row.comments && row.comments.length ? '<strong>Comment:</strong><br/>' + row.comments[0].comment : '';
          $("<td>".concat(comment, "</td>")).appendTo($tr);
        }

        $tr.appendTo($c);
      }

      page.paginate(d, 'user-withdrawals', $c, "<span class=\"ui grey large label\">\n                Requested: &nbsp;&nbsp;<span class=\"ui detail totalRequested\" number=\"".concat(totals.request, "\">").concat(totals.request.dollars(), "</span>\n            </span>\n            <span class=\"ui green large label\">\n                Approved: &nbsp;&nbsp;<span class=\"ui detail totalApproved\" number=\"").concat(totals.approved, "\">").concat(totals.approved.dollars(), "</span>\n            </span>\n            <span class=\"ui red large label\">\n                Declined: &nbsp;&nbsp;<span class=\"ui detail totalDeclined\" number=\"").concat(totals.declined, "\">").concat(totals.declined.dollars(), "</span>\n            </span>\n\n        "));
      $('.list-totals .totalRequested').animateNumber({
        number: totals.request,
        numberStep: function numberStep(now, tween) {
          $(tween.elem).html(now.dollars());
        }
      }).prop('number', totals.request);
      $('.list-totals .totalApproved').animateNumber({
        number: totals.approved,
        numberStep: function numberStep(now, tween) {
          $(tween.elem).html(now.dollars());
        }
      }).prop('number', totals.approved);
      $('.list-totals .totalDeclined').animateNumber({
        number: totals.declined,
        numberStep: function numberStep(now, tween) {
          $(tween.elem).html(now.dollars());
        }
      }).prop('number', totals.declined);
      $('[data-name=search]:visible').each(function () {
        var $that = $(this),
            keyword = $that.val(); // console.debug('search field need mark',keyword,$("table:visible tbody tr td").length);

        $("table:visible tbody tr td").unmark({
          done: function done() {
            $("table:visible tbody tr td").mark(keyword, {});
          }
        });
      });
      cf.reload();
    }
  }, {
    key: "withdrawalDecline",
    value: function withdrawalDecline(id) {
      var $prompt = $('<div class="ui modal submiter" data-action="/json/finance/withdrawal/' + id + '/declined" data-callback="crm.finance.withdrawalCallback"></div>').appendTo('body'),
          $header = $('<div class="header"></div>').appendTo($prompt),
          $content = $('<div class="content"></div>').appendTo($prompt),
          $actions = $('<div class="actions"></div>').appendTo($prompt);
      $prompt.append('<i class="close icon"></i>');
      $header.html('Specify reason of decline');
      $content = $('<div class="ui form"></div>').appendTo($content); // $content.append('<input data-name="comment" type="hidden"/>');

      var $field = $('<div class="field"></div>').appendTo($content);
      $('<div class="ui search"><div class="ui icon input"><input class="prompt" type="text" data-name="comment" placeholder="Decline comment..."><i class="search icon"></i></div><div class="results"></div></div>').appendTo($field).search({
        apiSettings: {
          url: '/used/comments?search={query}&type=withdrawal',
          onResponse: function onResponse(result) {
            var response = {
              results: []
            };

            for (var i in result) {
              var u = result[i];
              console.debug('search comment result', u);
              response.results.push({
                title: u.comment
              });
            }

            console.debug(response);
            return response;
          }
        },
        // onSelect(result, response){
        //     $modal.find('[data-name=comment]').val(result.comment);
        // }
        minCharacters: 3
      });
      $('<div class="ui black deny button">Cancel</div>').appendTo($actions).on('click', function () {
        $prompt.find('.close').click();
      });
      $('<div class="ui positive right labeled icon button submit">Ok<i class="checkmark icon"></i></div>').appendTo($actions).on('click', function () {
        $prompt.find('.close').click();
      });
      page.modal($prompt);
      skymechanics.reload();
    }
  }, {
    key: "withdrawalCallback",
    value: function withdrawalCallback($c, d) {
      console.debug('withdrawal touch'); // cf._loaders['user-list'].execute();

      skymechanics.touch('user-withdrawals'); // if(cf._loaders['user-withdrawals'])cf._loaders['user-withdrawals'].execute();
      // if(cf._loaders['user-list'])cf._loaders['user-list'].execute();
    }
  }, {
    key: "touch",
    value: function touch() {}
  }, {
    key: "transaction",
    value: function transaction($c, d) {
      $c.html('');
      var total = 0;
      d.data.map(function (row, i) {
        var $tr = $("<tr></tr>");
        var raw = row.raw;
        var manager = row.user.manager ? row.user.manager : undefined;
        if (row.error == 0 && row.transaction && row.transaction.type == 'deposit') $tr.addClass('positive');
        if (row.error > 0 && row.transaction.code != '0') $tr.addClass('negative');
        $('<td class="center aligned">' + dateFormat(row.created_at) + '</td>').appendTo($tr);
        $("<td>".concat(row.merchant.title) + (raw.method ? "<br/><small>".concat(raw.method, "</small>") : '') + '</td>').appendTo($tr);
        $("<td>".concat(crm.user.showCustomer(row.user), "</td>")).appendTo($tr);
        $('<td>' + crm.user.showManager(row.user.manager, 'Manager') + '<br/>' + crm.user.showManager(row.user.affilate, 'Affilate') + (row.user.lead ? "<br/><small>Source: ".concat(row.user.lead.source, "</small>") : '') + '</td>').appendTo($tr);
        $('<td>' + (row.transaction && $.inArray(row.transaction.type, ['debit', 'deposit']) == -1 ? '-' : '') + parseFloat(row.amount).currency('T ') + '</td>').appendTo($tr); // $('<td>'+parseFloat(row.amount).currency('T ')+'</td>').appendTo($tr);

        var f_success = "transaction_add_".concat(user.id);
        var f_error = f_success + '_error';

        window[f_success] = function (response, container, request) {
          new _components_index__WEBPACK_IMPORTED_MODULE_0__["VUIMessage"]({
            title: __('crm.success'),
            message: "<b>".concat(__('crm.transactions.' + response.type), "</b> <i>").concat(response.merchant.name, "</i><h3>").concat(response.transaction.amount.dollars(), "</h3>")
          });
          skymechanics.touch('user-transactions');
        };

        window[f_error] = function (response, container, request) {
          new _components_index__WEBPACK_IMPORTED_MODULE_0__["VUIMessage"]({
            title: __('crm.error'),
            message: "".concat(response.message),
            error: true
          });
        };

        $('<td>' + (row.error == '0' ? "Success<br/>" : row.transaction.code == '0' ? "Request<br/>" : "Failed<br/>") + (row.transaction.code == '0' && window.user.can.chief ? "<div class=\"\" data-action=\"/pay/".concat(row.merchant.name, "/").concat(row.transaction_id, "/approve\" data-google2fa=\"true\" data-method=\"PUT\"  data-callback=\"").concat(f_success, "\" data-callback-error=\"").concat(f_error, "\" data-autostart=\"true\" onclick=\"skymechanics.submiterHandler(this)\">\n                        <input type=\"hidden\" data-prompt=\"true\" data-title=\"").concat(__('crm.finance.correct_amount'), "\" data-name=\"amount\" value=\"").concat(row.amount, "\"/>\n                        <button class=\"ui green small icon button submit\">\n                            <i class=\"ui checkmark icon\"></i>\n                            ").concat(__('crm.approve'), "\n                        </button>\n                    <div><br/>") : '') + (row.transaction && row.transaction.type ? "<small>".concat(row.transaction.type, "</small><br/>") : '') + '<i class="first order icon"></i><small>Order ID: ' + row.order_id + '</small><br/>' + '<i class="sun icon"></i><small>Trx ID:' + row.transaction_id + '</small><br/>' + (row.message ? '<i class="info icon"></i><small>Error: ' + row.message + '</small>' : '') + "<small>".concat(raw ? crm.json2html(raw) : '-', "</small>") + '</td>').appendTo($tr);
        $tr.appendTo($c);
        total += row.error == 0 ? parseFloat(row.amount) : 0;
      });
      page.paginate(d, 'user-transactions', $c, "Amount: &nbsp;&nbsp;<span class=\"ui header totalAmount\" number=\"".concat(total, "\">").concat(total.dollars(), "</span>"));
      $('.list-totals .totalAmount').animateNumber({
        number: total,
        numberStep: function numberStep(now, tween) {
          $(tween.elem).html(now.dollars());
        }
      }).prop('number', total);
      ;
      $('[data-name=search]:visible').each(function () {
        var $that = $(this),
            keyword = $that.val(); // console.debug('search field need mark',keyword,$("table:visible tbody tr td").length);

        $("table:visible tbody tr td").unmark({
          done: function done() {
            $("table:visible tbody tr td").mark(keyword, {});
          }
        });
      });
    }
  }, {
    key: "deposits",
    value: function deposits($c, d) {
      var $t = $c.find('.table tbody'),
          bm = {
        ctx: $c.find('.chart').get(0),
        datap: {},
        datad: {},
        dataa: {}
      };
      $t.html('');

      for (var i in d) {
        var row = d[i],
            $tr = $('<tr></tr>').appendTo($t),
            manager = row.manager_name + ' ' + row.manager_surname,
            office = row.office;
        $('<td><a href="javascript:0;" onclick="crm.user.card(' + row.manager_id + ')">' + manager + '</a<</td>').appendTo($tr);
        $('<td>' + row.office + '</td>').appendTo($tr); // $('<td class="right aligned">'+parseFloat(row.process).currency('T')+'</td>').appendTo($tr);

        $('<td class="right aligned">' + parseFloat(row.declined).currency('T') + '</td>').appendTo($tr);
        $('<td class="header right aligned">' + parseFloat(row.approved).currency('T') + '</td>').appendTo($tr);
        bm.datap[office] = bm.datap[office] ? bm.datap[office] : 0;
        bm.datad[office] = bm.datad[office] ? bm.datad[office] : 0;
        bm.dataa[office] = bm.dataa[office] ? bm.dataa[office] : 0;
        bm.datap[office] += parseFloat(row.process);
        bm.datad[office] += parseFloat(row.declined);
        bm.dataa[office] += parseFloat(row.approved);
      }

      bm.datap = splitObjectKeys(bm.datap);
      bm.datad = splitObjectKeys(bm.datad);
      bm.dataa = splitObjectKeys(bm.dataa);

      if (bm.ctx) {
        if (crm.finance.charts['finance_kpi']) crm.finance.charts['finance_kpi'].destroy();
        crm.finance.charts['finance_kpi'] = new Chart(bm.ctx.getContext('2d'), {
          type: 'horizontalBar',
          data: {
            labels: bm.dataa.keys,
            datasets: [// {
            //     label: "Process",
            //     backgroundColor: page.dashboard.options.chart.backgroundColors[5],
            //     borderColor: page.dashboard.options.chart.borderColors[5],
            //     data: bm.datap.values
            // }
            {
              label: __('crm.finances.declined'),
              backgroundColor: page.dashboard.options.chart.backgroundColors[2],
              borderColor: page.dashboard.options.chart.borderColors[2],
              data: bm.datad.values
            }, {
              label: __('crm.finances.approved'),
              backgroundColor: page.dashboard.options.chart.backgroundColors[0],
              borderColor: page.dashboard.options.chart.borderColors[0],
              data: bm.dataa.values
            }]
          },
          options: {
            scales: {
              xAxes: [{
                stacked: true
              }],
              yAxes: [{
                stacked: true
              }]
            }
          }
        });
      }
    }
  }, {
    key: "merchants",
    value: function merchants($c, d) {
      var cbd = {
        ctx: $c.find('.chart:first').get(0),
        data: {},
        raw: {}
      },
          cbm = {
        ctx: $c.find('.chart:last').get(0),
        data: {},
        raw: {}
      },
          cbo = {},
          $t = $c.find('.table tbody');

      for (var i in d) {
        var row = d[i],
            dt = new Date(row.created_at * 1000),
            date = leftZeroPad(dt.getDate()) + ' ' + system.months[dt.getMonth()],
            amount = parseFloat(row.amount),
            office = row.user && row.user.manager ? crm.user.getMeta(row.user.manager.meta, 'office') : 'notset',
            merchant = row.merchant.name;
        cbd.raw[date] = cbd.raw[date] ? cbd.raw[date] : 0;
        cbd.raw[date] += amount;
        cbm.raw[merchant] = cbm.raw[office] ? cbm.raw[office] : 0;
        cbm.raw[merchant] += amount;
        cbo[office] = cbo[office] ? cbo[office] : {
          amount: 0,
          total: 0
        };
        cbo[office].amount += amount;
        cbo[office].total++;
      }

      cbd.data = splitObjectKeys(cbd.raw);
      cbm.data = splitObjectKeys(cbm.raw);

      if (cbd.ctx) {
        if (crm.finance.charts['merchants_by_day']) crm.finance.charts['merchants_by_day'].destroy();
        crm.finance.charts['merchants_by_day'] = new Chart(cbd.ctx.getContext('2d'), {
          type: 'bar',
          data: {
            labels: cbd.data.keys,
            datasets: [{
              label: __('crm.dashboard.deposits'),
              borderColor: page.dashboard.options.chart.borderColors[0],
              data: cbd.data.values
            }]
          }
        });
      }

      if (cbm.ctx) {
        if (crm.finance.charts['merchants_by_merchants']) crm.finance.charts['merchants_by_merchants'].destroy();
        crm.finance.charts['merchants_by_merchants'] = new Chart(cbm.ctx.getContext('2d'), {
          type: 'pie',
          data: {
            labels: cbm.data.keys,
            datasets: [{
              label: __('crm.dashboard.deposits'),
              backgroundColor: page.dashboard.options.chart.backgroundColors,
              borderColor: page.dashboard.options.chart.borderColors,
              data: cbm.data.values
            }]
          }
        });
      }

      $t.html('');

      for (var i in cbo) {
        $t.append('<tr><td>' + i + '</td><td class="right aligned">' + cbo[i].total + '</td><td class="right aligned"><strong>' + cbo[i].amount.currency('T') + '</strong></td></tr>');
      }
    }
  }]);

  return Finance;
}();

/***/ }),

/***/ "./resources/assets/js/modules/instruments.js":
/*!****************************************************!*\
  !*** ./resources/assets/js/modules/instruments.js ***!
  \****************************************************/
/*! exports provided: Groups, Pair, Pairs, Prices, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Groups", function() { return Groups; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Pair", function() { return Pair; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Pairs", function() { return Pairs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Prices", function() { return Prices; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var isPairInList = function isPairInList(pair, pairs) {
  for (var i in pairs) {
    if (pairs[i].id == pair.id) return true;
  }

  return false;
};

var Groups =
/*#__PURE__*/
function () {
  function Groups() {
    _classCallCheck(this, Groups);

    this.current = null;
    this.data = null;
    this.$c = null;
    this.list = this.list.bind(this);
    this.render = this.render.bind(this);
    this.add = this.add.bind(this);
    this.added = this.added.bind(this);
    this.edit = this.edit.bind(this);
    this.edited = this.edited.bind(this);
    this.link = this.link.bind(this);
    this["delete"] = this["delete"].bind(this);
  }

  _createClass(Groups, [{
    key: "list",
    value: function list($c, d) {
      this.data = d;
      this.$c = $c;
      this.render();
    }
  }, {
    key: "render",
    value: function render() {
      crm.instrument.groups.$c.html('');
      crm.instrument.groups.data.data.map(function (group, i) {
        var $tr = $('<tr></tr>').appendTo(crm.instrument.groups.$c);
        $tr.append("<td>".concat(group.id, "</td>"));
        $("<td><a>".concat(group.name, "</a></td>")).appendTo($tr).on('click', function () {
          crm.instrument.groups.edit(group);
        });
        $tr.append("<td class=\"right aligned\">Trade fee: <strong>".concat(group.commission.currency('%', 2), "</strong><br/>Daily swap: <strong>").concat(group.dayswap.currency('%', 2), "</strong></td>"));
        $tr.append("<td class=\"right aligned\">Buy: <strong>".concat(group.spread_buy.currency('%', 2), "</strong><br/>Sell: <strong>").concat(group.spread_sell.currency('%', 2), "</strong></td>"));
        $tr.append("<td class=\"right aligned\">Lot: <strong>".concat(group.lot.currency('', 0), "</strong><br/>Pips: <strong>").concat(group.pips.currency('', 2), "</td>"));
        $tr.append("<td>".concat(group.pairs.length, "</td>"));
        if (group.name.toLowerCase() != 'default') $tr.append("<td><button class=\"ui icon red button delete\" onclick=\"crm.instrument.groups.delete(this,".concat(group.id, ")\"><i class=\"trash icon\"></i> Delete group</button></td>")); // $tr.on('hover',function(){$(this).find('.delete').fadeIn();},function(){$(this).find('.delete').fadeOut();});
      });
      $('#groups_count').html(crm.instrument.groups.data.total);
      page.paginate(crm.instrument.groups.data, 'instrument-group-list', crm.instrument.groups.$c);
    }
  }, {
    key: "add",
    value: function add() {
      var $c = $('<div class="ui modal submiter" data-action="/pairgroup" data-method="post" data-callback="crm.instrument.groups.added" id="pairgroup_add"></div>').appendTo('#modals');
      $c.append("<i class=\"close icon\" onclick=\"$('.ui.modal').show('close')\"></i>");
      $c.append('<div class="header"><i class="icon industry"></i></div>');
      var $b = $('<div class="content ui form"></div>').appendTo($c);
      $("<input type=\"hidden\" data-name=\"_token\" value=\"".concat(Laravel.csrfToken, "\"/>")).appendTo($b);
      $("<div class=\"field\"><label>Group name</label><div class=\"ui input\"><input type=\"text\" data-name=\"name\"/></div></div>").appendTo($b);
      $("<div class=\"two fields\">\n            <div class=\"field\"><label>Commission</label><div class=\"ui labeled input\"><div class=\"ui basic label\">%</div><input type=\"number\" data-name=\"commission\"/></div></div>\n            <div class=\"field\"><label>Daily swap</label><div class=\"ui labeled input\"><div class=\"ui basic label\">%</div><input type=\"number\" data-name=\"dayswap\"/></div></div>\n        </div>\n        <div class=\"ui horizontal divider\">Spreads</div>\n        <div class=\"two fields\">\n            <div class=\"field\"><label>Buy</label><div class=\"ui labeled input\"><div class=\"ui basic label\">%</div><input type=\"number\" data-name=\"spread_buy\"/></div></div>\n            <div class=\"field\"><label>Sell</label><div class=\"ui labeled input\"><div class=\"ui basic label\">%</div><input type=\"number\" data-name=\"spread_sell\"/></div></div>\n        </div>\n        <div class=\"ui horizontal divider\">Type of trading</div>\n        <div class=\"field\">\n            <label>Type</label>\n            <div class=\"ui selection search dropdown\">\n                <input type=\"hidden\" data-name=\"type\" value=\"sm\" onchange=\"{if($(this).val()=='forex')$('.forex-like').slideDown();else if($(this).val()!='forex')$('.forex-like').slideUp();}\"/>\n                <div class=\"default text\">Gibrid</div>\n                <i class=\"dropdown icon\"></i>\n                <div class=\"menu\">\n                    <div class=\"item\" data-value=\"sm\">Gibrid</div>\n                    <div class=\"item\" data-value=\"forex\">Forex</div>\n                </div>\n            </div>\n        </div>\n        <div class=\"ui horizontal divider forex-like\" style=\"display:none;\">For forex like trading</div>\n        <div class=\"two fields forex-like\" style=\"display:none;\">\n            <div class=\"field\"><label>Lot volume</label><div class=\"ui input\"><input type=\"number\" data-name=\"lot\" value=\"1\"/></div></div>\n            <div class=\"field\"><label>Minimal pips</label><div class=\"ui input\"><input type=\"number\" data-name=\"pips\" value=\"1\"/></div></div>\n        </div>").appendTo($b);
      var $f = $('<div class="actions"></div>').appendTo($c);
      $('<div class="ui black deny button">Close</div>').appendTo($f);
      $('<div class="ui positive right labeled icon button submit">Ok <i class="checkmark icon"></i></div>').appendTo($f);
      $('#pairgroup_add .ui.dropdown:not(.dropdown-assigned)').addClass('dropdown-assigned').dropdown();
      page.modal('#pairgroup_add');
    }
  }, {
    key: "edit",
    value: function edit(ig) {
      crm.instrument.groups.current = ig;
      var $c = $("<div class=\"ui modal submiter\" data-action=\"/pairgroup/".concat(ig.id, "\" data-method=\"put\" data-callback=\"crm.instrument.groups.edited\" id=\"pairgroup_add\"></div>")).appendTo('#modals');
      $c.append("<i class=\"close icon\" onclick=\"$('.ui.modal').show('close')\"></i>");
      $c.append("<div class=\"header\"><i class=\"icon industry\"></i>".concat(ig.name, "</div>"));
      var $b = $('<div class="content ui form"></div>').appendTo($c);
      $("<input type=\"hidden\" data-name=\"_token\" value=\"".concat(Laravel.csrfToken, "\"/>")).appendTo($b);
      $("<div class=\"field\"><label>Group name</label><div class=\"ui input\"><input type=\"text\" data-name=\"name\" value=\"".concat(ig.name, "\"/></div></div>")).appendTo($b);
      $("<div class=\"two fields\">\n            <div class=\"field\"><label>Commission</label><div class=\"ui labeled input\"><div class=\"ui basic label\">%</div><input type=\"number\" data-name=\"commission\" value=\"".concat(ig.commission, "\"/></div></div>\n            <div class=\"field\"><label>Daily swap</label><div class=\"ui labeled input\"><div class=\"ui basic label\">%</div><input type=\"number\" data-name=\"dayswap\" value=\"").concat(ig.dayswap, "\"/></div></div>\n        </div>\n        <div class=\"ui horizontal divider\">Spreads</div>\n        <div class=\"two fields\">\n            <div class=\"field\"><label>Buy</label><div class=\"ui labeled input\"><div class=\"ui basic label\">%</div><input type=\"number\" data-name=\"spread_buy\" value=\"").concat(ig.spread_buy, "\"/></div></div>\n            <div class=\"field\"><label>Sell</label><div class=\"ui labeled input\"><div class=\"ui basic label\">%</div><input type=\"number\" data-name=\"spread_sell\" value=\"").concat(ig.spread_sell, "\"/></div></div>\n        </div>\n        <div class=\"ui horizontal divider\">Type of trading</div>\n        <div class=\"field\">\n            <label>Type</label>\n            <div class=\"ui selection dropdown\">\n                <input type=\"hidden\" data-name=\"type\" value=\"").concat(ig.type, "\" onchange=\"{if($(this).val()=='forex')$('.forex-like').slideDown();else if($(this).val()!='forex')$('.forex-like').slideUp();}\"/>\n                <div class=\"default text\">Gibrid</div>\n                <i class=\"dropdown icon\"></i>\n                <div class=\"menu\">\n                    <div class=\"item\" data-value=\"sm\">Gibrid</div>\n                    <div class=\"item\" data-value=\"forex\">Forex</div>\n                </div>\n            </div>\n        </div>\n        <div class=\"ui horizontal divider forex-like\" style=\"display:none;\">For forex like trading</div>\n        <div class=\"two fields forex-like\" style=\"display:none;\">\n            <div class=\"field\"><label>Lot volume</label><div class=\"ui input\"><input type=\"number\" data-name=\"lot\" value=\"1\"/></div></div>\n            <div class=\"field\"><label>Minimal pips</label><div class=\"ui input\"><input type=\"number\" data-name=\"pips\" value=\"1\"/></div></div>\n        </div>")).appendTo($b);
      $('#pairgroup_add .ui.dropdown:not(.dropdown-assigned)').addClass('dropdown-assigned').dropdown().dropdown('set selected', ig.type);
      $c.append("<div class=\"ui horizontal divider\">Pairs</div>");
      var $g = $("<div class=\"ui container grid\"></div>").appendTo($c),
          $na = $("<div class=\"eight wide column\"></div>").appendTo($g),
          $aa = $("<div class=\"eight wide column\"></div>").appendTo($g),
          $f = $('<div class="actions"></div>').appendTo($c);
      $aa.append("<div class=\"ui header\">Already in group&nbsp;<span class=\"allready\">".concat(ig.pairs.length, "</span></div>"));
      $na.append('<div class="ui header">Availiable&nbsp;<span class="avaliable"></span></div>');
      $aa = $("<div class=\"ui divided items aa\"></div>").appendTo($aa);
      $na = $("<div class=\"ui divided items na\"></div>").appendTo($na);
      $('<div class="ui black deny button">Close</div>').appendTo($f);
      $("<div class=\"ui positive right labeled icon button submit\" onclick=\"$(this).closest('.ui.modal').find('.close').click();\">Ok <i class=\"checkmark icon\"></i></div>").appendTo($f);
      var allpairs = [];

      for (var i in crm.instrument.data) {
        var pair = crm.instrument.data[i];
        if (parseInt(pair.enabled) !== 1) continue;

        if (!isPairInList(pair, ig.pairs) && $.inArray(parseInt(pair.id), allpairs) == -1) {
          allpairs.push(parseInt(pair.id));
          var price = pair.price ? parseFloat(pair.price) : 0;
          $("<div class=\"item\" data-id=\"".concat(pair.id, "\" data-action=\"add\" onclick=\"crm.instrument.groups.link(this)\">\n                    <div class=\"image\" style=\"position:relative;\">\n                        <i class=\"ic ic_").concat(pair.from.code.toLowerCase(), "\"></i>\n                        <i class=\"ic ic_").concat(pair.to.code.toLowerCase(), "\"></i>\n                    </div>\n                    <div class=\"content\">\n                        <div class=\"header\">").concat(pair.title, "</div>\n                        <div class=\"description\">").concat(pair.symbol, "</div>\n                        <div class=\"meta\">\n                            <span class=\"stay\">").concat(pair.source.name, "</span>\n                            ").concat(crm.instrument.prices.element(price, pair.id), "\n                        </div>\n                    </div>\n                </div>")).appendTo($na).css('cursor', 'pointer');
        }
      }

      ;
      $('.avaliable').text(allpairs.length);
      $('.allready').text(ig.pairs.length);
      ig.pairs.map(function (pair, i) {
        var price = pair.price ? parseFloat(pair.price) : 0;
        $("<div class=\"item\" data-id=\"".concat(pair.id, "\"  data-action=\"del\" onclick=\"crm.instrument.groups.link(this)\">\n                <div class=\"image\" style=\"position:relative;\">\n                    <i class=\"ic ic_").concat(pair.from.code.toLowerCase(), "\"></i>\n                    <i class=\"ic ic_").concat(pair.to.code.toLowerCase(), "\"></i>\n                </div>\n                <div class=\"content\">\n                    <div class=\"header\">").concat(pair.title, "</div>\n                    <div class=\"description\">").concat(pair.symbol, "</div>\n                    <div class=\"meta\">\n                        <span class=\"stay\">").concat(pair.source.name, "</span>\n                        ").concat(crm.instrument.prices.element(price, pair.id), "\n                    </div>\n                </div>\n            </div>")).appendTo($aa).css('cursor', 'pointer');
      });
      page.modal('#pairgroup_add');
    }
  }, {
    key: "link",
    value: function link(that) {
      var pairs = [],
          ig = crm.instrument.groups.current,
          $that = $(that).clone(),
          act = $(that).attr('data-action'),
          $cols = $(that).closest('.grid').find('.column:eq(' + (act == 'del' ? '0' : '1') + ') .items');
      var already = ig.pairs.map(function (pair) {
        return pair.id;
      });
      $that.attr('data-action', act == 'del' ? 'add' : 'del');
      $cols.append($that);
      $('.items.aa .item').each(function () {
        var np = $(this).attr('data-id');
        if ($.inArray(np, already) == -1 && $.inArray(np, pairs) == -1) pairs.push(np);
      });
      $.ajax({
        url: "/pairgroup/".concat(ig.id),
        type: "put",
        data: {
          _token: Laravel.csrfToken,
          pairs: pairs
        },
        success: function success(d, x, s) {
          ig = d;
          var avaliable = 0;

          for (var i in crm.instrument.data) {
            if (!isPairInList(crm.instrument.data[i], ig.pairs)) avaliable++;
          }

          ;
          $('.avaliable').text(avaliable);
          $('.allready').text(pairs.length);
          $(that).remove();
          skymechanics.touch('instrument-group-list');
        }
      });
    }
  }, {
    key: "delete",
    value: function _delete(that, id) {
      $.ajax({
        url: "/pairgroup/".concat(id),
        type: "delete",
        data: {
          _token: Laravel.csrfToken
        },
        success: function success(d, x, s) {
          $(that).closest('tr').remove();
        }
      });
    }
  }, {
    key: "added",
    value: function added(d, $c) {
      skymechanics.touch('instrument-group-list');
      $c.find('.close').click();
      crm.instrument.groups.edit(d);
    }
  }, {
    key: "edited",
    value: function edited(d, $c) {
      skymechanics.touch('instrument-group-list');
    }
  }]);

  return Groups;
}();
Groups.prototype.data = {};
Groups.prototype.$c = $('body');
var Pair =
/*#__PURE__*/
function () {
  function Pair(id) {
    var _this = this;

    _classCallCheck(this, Pair);

    this.id = id;
    this.getted = false;
    this.get = this.get.bind(this);
    this.render = this.render.bind(this);
    this.get().then(function () {
      _this.render();
    });
  }

  _createClass(Pair, [{
    key: "get",
    value: function get() {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        var that = _this2;
        $.ajax({
          url: "/instrument/".concat(that.id),
          success: function success(d, x, s) {
            console.debug('got pair data', d);
            that = $.extend(that, d);
            that.getted = true;
            resolve();
          },
          error: function error(x, s) {
            reject();
          }
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      if (!this.getted) return;
      console.log('rendering', this);
      var $c = $("<div class=\"ui modal submiter\" data-action=\"/instrument/".concat(this.id, "\" data-method=\"put\" data-callback=\"crm.instrument.edited\" id=\"pair_").concat(this.id, "_edit\"></div>")).appendTo('#modals');
      $c.append("<i class=\"close icon\" onclick=\"$('.ui.modal').show('close')\"></i>");
      $c.append("<div class=\"header\"><i class=\"icon industry\"></i>".concat(this.symbol, "</div>"));
      var $b = $('<div class="content ui form"></div>').appendTo($c);
      $("<input type=\"hidden\" data-name=\"_token\" value=\"".concat(Laravel.csrfToken, "\"/>")).appendTo($b);
      var $g = $("<div class=\"ui container grid\"></div>").appendTo($c);
      var $na = $("<div class=\"six wide column\"></div>").appendTo($g);
      var $aa = $("<div class=\"ten wide column\"></div>").appendTo($g);
      var $f = $('<div class="actions"></div>').appendTo($c);
      $('<div class="ui black deny button">Close</div>').appendTo($f);
      $("<div class=\"ui positive right labeled icon button submit\" onclick=\"$(this).closest('.ui.modal').find('.close').click();\">Ok <i class=\"checkmark icon\"></i></div>").appendTo($f);
      page.modal("#pair_".concat(this.id, "_edit"));
    }
  }]);

  return Pair;
}();
var Pairs =
/*#__PURE__*/
function () {
  function Pairs() {
    _classCallCheck(this, Pairs);

    this.data = {};
    this.chartObj = null;
    this.groups = new Groups();
    this.prices = new Prices();
    this.current = null;
    this.currency = {
      update: function update(d, $c) {
        $c.parent().find('img').attr('src', d.image);
      }
    };
    this.edit = this.edit.bind(this);
  }

  _createClass(Pairs, [{
    key: "touch",
    value: function touch(d, $c) {
      skymechanics.touch('instrument-list');
    }
  }, {
    key: "price",
    value: function price($c, d) {
      var data = [],
          labels = [];
      d = d.reverse();

      for (var i in d) {
        var row = d[i],
            dt = new Date(row.time * 1000);
        labels.push(dt);
        data.push({
          x: dt,
          y: parseFloat(row.price)
        });
      }

      new skymechanics.chart('pair_chart', {
        ctx: $c.find('.chart:first'),
        data: {
          label: 'Prices',
          keys: labels,
          values: data
        },
        onUpdate: function onUpdate(p) {
          var n = parseFloat(p.y),
              trade = $c.parents('.ui.modal').find('#trade_data').length ? JSON.parse($c.parents('.ui.modal').find('#trade_data').text()) : undefined,
              $f = $c.parents('.ui.modal').find('.current'),
              $o = $c.parents('.ui.modal').find('.profit'),
              $p = $c.parents('.ui.modal').find('.percent'),
              last = parseFloat($f.text().replace(/[\s,]/g, '')),
              pd = n > last ? 'green' : 'red';
          if (!trade) return;
          $c.parents('.ui.active.loader').removeClass('active loader'); // console.debug('chart updated',n,trade);

          var calc = crm.deal.calculate(trade, n); // console.debug(calc);

          $p.parents('td').removeClass('green red changed').addClass((calc.profit > 0 ? 'green' : 'red') + ' changed');
          $p.animateNumber({
            number: calc.percent,
            numberStep: function numberStep(now, tween) {
              $(tween.elem).html(now.currency('') + '%');
            }
          }).prop('number', calc.percent);
          $o.animateNumber({
            number: calc.profit,
            numberStep: function numberStep(now, tween) {
              $(tween.elem).html(now.currency(''));
            }
          }).prop('number', calc.profit);
          $f.removeClass('green red changed').addClass(pd + ' changed').animateNumber({
            number: n,
            numberStep: function numberStep(now, tween) {
              $(tween.elem).html(now.currency('', 5));
            }
          }).prop('number', n);
        }
      });
    }
  }, {
    key: "list",
    value: function list(container, d, x, s) {
      console.debug('pairs.list render', d);
      container.html(''); // crm.instrument.data = d.data;
      // let allpairs = [];

      d.data.map(function (row, i) {
        // if($.inArray(parseInt(row.id),allpairs)!=-1)return;
        // allpairs.push(parseInt(row.id));
        // const price = (row.histo && row.histo.close)?parseFloat(row.histo.close):0;
        var price = row.price ? parseFloat(row.price) : 0;
        var $tr = $('<tr data-class="instrument" data-id="' + row.id + '"></tr>').appendTo(container);
        window.crm.instrument.data[row.id] = row;
        $tr.append('<td>' + row.id + '</td>');
        $tr.append('<td><div class="ui slider checkbox submiter" data-action="/json/instrument/' + row.id + '/update" data-name="pair-enabled" data-callback="crm.instrument.touch">' + '<input class="pair enabled switcher" type="checkbox" data-name="enabled" ' + (row.enabled == '1' ? 'checked' : '') + '><label></label>' + '<input type="hidden" class="submit"/></div></td>');
        $tr.append("<td class=\"\">\n                <div class=\"image\" style=\"position:relative;\">\n                    <i class=\"ic ic_".concat(row.from.code.toLowerCase(), "\" style=\"display:inline-block;\"></i>\n                    <i class=\"ic ic_").concat(row.to.code.toLowerCase(), "\" style=\"display:inline-block;\"></i>\n                </div>"));
        $tr.append("<td class=\"ui header\">\n                    <a href=\"javascript:0;\" onclick=\"crm.instrument.edit(".concat(row.id, ")\">").concat(row.title, "</a><br/>\n                    <code>").concat(row.symbol, "</code><br/>\n                    ").concat(row.type, " <small>group</small><br/>\n                    <small>").concat(row.source.name, "</small>&nbsp;&nbsp;<small>").concat(crm.instrument.prices.element(price, row.id), "</small>\n            </td>"));
        $tr.append("<td class=\"\">\n                <strong>Lot</strong>&nbsp;&nbsp;<small><code>".concat(row.lot, "</code></small>\n                    <strong>Pips</strong>&nbsp;&nbsp;<small><code>").concat(row.pips ? row.pips : '', "</code></small>\n                    <strong>Fee</strong>&nbsp;&nbsp;<small><code>").concat(row.commission.percent(), "</code></small>\n                    <strong>Swap</strong>&nbsp;&nbsp;<small><code>").concat((row.dayswap / 100).percent(), "</code></small>\n            </td>"));
      });
      $('.pair.enabled.switcher').on('change', function () {
        $(this).parent().find('.submit').click();
      });
      page.paginate(d, 'instrument-list', container);
      console.debug('pairs.list rendered');
      cf.reload(); // crm.instrument.addFormCheck(1);
    }
  }, {
    key: "enable",
    value: function enable(id, v) {
      $.ajax({
        url: '/json/instrument/' + id + '/update',
        dataType: 'json',
        beforeSend: function beforeSend() {
          if (v) $('#pair-id-' + id + '-enable i.fa').toggleClass('fa-square-o', false, 256).toggleClass('fa-check-square-o', true, 256);else $('#pair-id-' + id + '-enable i.fa').toggleClass('fa-check-square-o', false, 256).toggleClass('fa-square-o', true, 256);
        },
        data: {
          enabled: v ? '1' : '0'
        },
        success: function success() {
          if (cf._loaders['instrument-list']) cf._loaders['instrument-list'].execute();
        }
      });
    }
  }, {
    key: "add",
    value: function add() {
      var $c = $('<div class="ui modal submiter" data-action="/json/instrument/add" data-callback="crm.instrument.added" id="pair_add"></div>').appendTo('body'); //.appendTo('#modals');

      var firstCurrency = {
        id: 0,
        name: ''
      },
          lastCurrency = {
        id: 0,
        name: ''
      },
          itr = 0;

      for (var i in currency.data) {
        if (itr == 0) {
          firstCurrency = {
            id: currency.data[i].id,
            name: currency.data[i].name,
            code: i
          };
        } else if (itr == 1) {
          lastCurrency = {
            id: currency.data[i].id,
            name: currency.data[i].name,
            code: i
          };
        } else break;

        ++itr;
      }

      $c.append('<i class="close icon" onclick="$(\'.ui.modal\').show(\'close\')"></i>');
      $c.append('<div class="header"><i class="icon industry"></i></div>');
      var $b = $('<div class="content  ui form"></div>').appendTo($c);
      $("<div class=\"two fields\"><div class=\"field required\">\n            <label>From</label>\n            <div class=\"ui search selection dropdown fromcurrencyid\">\n                <input type=\"hidden\" data-name=\"from_currency_id\" name=\"from_currency_id\"/>\n                <div class=\"default text\"></div>\n                <i class=\"dropdown icon\"></i>\n                <div class=\"menu\">\n                    ".concat(currency.toOptionListDiv(), "\n                </div>\n            </div>\n        </div>\n        <div class=\"field required\">\n            <label>To</label>\n                <div class=\"ui search selection dropdown tocurrencyid\">\n                    <input type=\"hidden\" data-name=\"to_currency_id\" name=\"to_currency_id\"/>\n                    <div class=\"default text\"></div>\n                    <i class=\"dropdown icon\"></i>\n                    <div class=\"menu\">\n                        ").concat(currency.toOptionListDiv(), "\n                    </div>\n                </div>\n            </div>\n        </div>")).appendTo($b); // $('<div class="field"><label>From</label><select class="ui search dropdown" data-name="from_currency_id">' +currency.toOptionList() + '</select></div>').appendTo($b);
      // $('<div class="field"><label>To</label><select class="ui search dropdown" data-name="to_currency_id">' +currency.toOptionList() + '</select></div>').appendTo($b);

      $('<div class="field required"><label>Symbol</label><input class="ui input" data-name="symbol"/></div>').appendTo($b);
      $("<div class=\"field required\"><label>Source</label><div class=\"ui search selection dropdown pair_source_id\"><input type=\"hidden\" data-name=\"source_id\" name=\"source_id\" value=\"6\"/><div class=\"default text\"></div><i class=\"dropdown icon\"></i><div class=\"menu\">".concat(system.sources.toOptionListDiv(), "</div></div></div>")).appendTo($b);
      $("<div class=\"field required\"><label>Type</label><div class=\"ui search selection dropdown pair_type\">\n            <input type=\"hidden\" data-name=\"type\" name=\"type\" onchange=\"\"/>\n            <div class=\"default text\"></div>\n            <i class=\"dropdown icon\"></i>\n            <div class=\"menu\">\n                <div class=\"ui item\" data-value=\"fiat\">Fiat</div>\n                <div class=\"ui item\" data-value=\"crypto\">Crypto</div>\n                <div class=\"ui item\" data-value=\"equities\">Equities</div>\n                <div class=\"ui item\" data-value=\"commodities\">Commodities</div>\n                <div class=\"ui item\" data-value=\"indices\">Indices</div>\n            </div>\n        </div></div>").appendTo($b);
      $('<input type="hidden" data-name="enabled" value="1" />').appendTo($b);
      var $f = $('<div class="actions"></div>').appendTo($c);
      $('<div class="ui black deny button">Close</div>').appendTo($f);
      $('<div class="ui positive right labeled icon button submit">Ok <i class="checkmark icon"></i></div>').appendTo($f);
      page.modal('#pair_add'); // cf.reload();
      // crm.instrument.addFormCheck(1);
      //

      var $fc = $(".dropdown.fromcurrencyid");
      var $tc = $(".dropdown.tocurrencyid");
      $fc.addClass('dropdown-assigned').dropdown({
        // values: currency.toValues(),
        // value: lastCurrency.id,
        onChange: function onChange(value, text, $choice) {
          console.debug('checking from');
          crm.instrument.addFormCheck(1);
        }
      });
      $tc.addClass('dropdown-assigned').dropdown({
        // values: currency.toValues(),
        // value: firstCurrency.id,
        onChange: function onChange(value, text, $choice) {
          console.debug('checking to');
          crm.instrument.addFormCheck(2);
        }
      }); // $fc.dropdown("set value",lastCurrency.id);
      // $tc.dropdown("set value",firstCurrency.id);

      $(".dropdown.pair_source_id").addClass('dropdown-assigned').dropdown("set value", 6);
      $(".dropdown.pair_type").addClass('dropdown-assigned').dropdown("set value", "crypto");
    }
  }, {
    key: "addFormCheck",
    value: function addFormCheck() {
      var j = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var $symb = $('[data-name=symbol]');
      var $fc = $('.dropdown.fromcurrencyid');
      var $tc = $('.dropdown.tocurrencyid');
      var fc = parseInt($fc.dropdown('get value'));
      var tc = parseInt($tc.dropdown('get value'));
      console.debug('check for pair dublicates', fc, tc);
      var exclude = [j == 1 ? fc : tc];

      for (var i in crm.instrument.data) {
        var pair = crm.instrument.data[i];

        if (j == 1 && pair.from_currency_id == fc) {
          exclude.push(parseInt(pair.to_currency_id));
        } else if (j == 2 && pair.to_currency_id == tc) {
          exclude.push(parseInt(pair.from_currency_id));
        }
      }

      var newList = currency.toValues(exclude);
      console.debug('currency new list for(' + j + ')', newList, exclude);

      if (j == 1) {
        $tc.dropdown("setup menu", {
          values: newList
        });
        $tc.dropdown('set value', $.inArray(tc, exclude) == -1 ? tc : newList[0].value);
      } else if (j == 2) {
        $fc.dropdown("setup menu", {
          values: newList
        });
        $fc.dropdown('set value', $.inArray(fc, exclude) == -1 ? fc : newList[0].value);
      }

      var fcur = currency.byId($fc.dropdown('get value'));
      var tcur = currency.byId($tc.dropdown('get value'));
      $symb.val("".concat(fcur ? fcur.code.toUpperCase() : '').concat(tcur ? tcur.code.toUpperCase() : ''));
    }
  }, {
    key: "added",
    value: function added(d, $c) {
      var $msg = $c.find('.message');
      if (!$msg.length) $msg = $('<div class="ui top attached message"></div>').prependTo($c.find('.content'));
      $msg.removeClass('positive');
      $msg.removeClass('negative');

      if (d.id) {
        $msg.addClass('positive');
        $msg.html("Pair ".concat(d.title, " added"));
        cf.touch('instrument-list'); // $c.modal('hide');
      } else {
        $msg.addClass('negotive'); // $msg.html(JSON.stringify(d))

        $msg.html(d.message);
      }
    }
  }, {
    key: "edit",
    value: function edit(id) {
      // this.current = new Pair(id);
      var $dash = page.modalPreloaderStart("pair_".concat(id, "_dashboard"));
      $.ajax({
        url: "/html/instrument/".concat(id),
        success: function success(d, x, s) {
          page.modalPreloaderEnd($dash, d, true);
        }
      });
    }
  }, {
    key: "history",
    value: function history(container, d, x, s) {
      var int2OnOff = function int2OnOff(i) {
        return parseInt(i) == 1 ? 'On' : 'Off';
      };

      container.html('');

      for (var i in d) {
        var s = '<tr data-class="instrument-history" data-id="' + d[i].id + '">',
            row = d[i];
        s += '<td>' + new Date(row.created_at * 1000) + '</td>';
        s += '<td>' + int2OnOff(row.old_enabled) + ' / ' + int2OnOff(row.new_enabled) + '</td>';
        s += '<td>' + parseFloat(row.old_commission) * 100 + '% / ' + parseFloat(row.new_commission) * 100 + '%</td>';
        s += '</tr>';
        container.append(s);
      }

      var pp = cf.pagination(d),
          $pp = container.parent().closest(".pagination");
      if (!$pp.length) $pp = $('<div class="pagination"></div>').insertAfter(container.parent());
      $pp.html(pp);
    }
  }]);

  return Pairs;
}();
;
var Prices =
/*#__PURE__*/
function () {
  function Prices() {
    _classCallCheck(this, Prices);

    $('.prices-form input:not(#count)').on('change', function () {
      $('#prices').html('');
    });
  }

  _createClass(Prices, [{
    key: "element",
    value: function element(price, pair) {
      price = parseFloat(price);
      return "<span class=\"price pair-price-".concat(pair, "\" number=\"").concat(price, "\"><i class=\"ui caret down red icon\" style=\"margin-right:0;\"></i>").concat(price.digit(), "</span>");
    }
  }, {
    key: "setPrice2All",
    value: function setPrice2All(price, pair) {
      price = parseFloat(price);
      var oldPrice = parseFloat($(".price.pair-price-".concat(pair)).prop('number'));
      var icon = oldPrice > price ? '<i class="ui caret down red icon" style="margin-right:0;"></i>' : '<i class="ui caret up green icon" style="margin-right:0;"></i>';
      $(":hover > .price.pair-price-".concat(pair)).html(icon + price.digit(5)); //animateNumber({ number: price,numberStep: (now, tween) => { $(tween.elem).html(icon+now.digit());} }).prop('number', price);
      // $(`.price.pair-price-${pair}`).html(icon+price.digit());//animateNumber({ number: price,numberStep: (now, tween) => { $(tween.elem).html(icon+now.digit());} }).prop('number', price);
    }
  }, {
    key: "render",
    value: function render($c, d) {
      if (window.ohlcCounter) {
        $('#tick_counter').html("".concat(__('crm.ticks.current_count'), " ").concat(window.ohlcCounter.total, "  <strong>").concat(__('crm.ticks.avg'), " ").concat(window.lastOhlcCounter.avg ? window.lastOhlcCounter.avg + '/' + __('crm.ticks.per_minute') : '-', " </strong>"));
      }

      if (d.tune != undefined) return;
      var price = parseFloat(d.price);

      if ($c.length) {
        var filters = {
          search: $('#search').val(),
          pairs: $('#pair').val(),
          source: $('#source').val(),
          type: $('#type').val(),
          count: parseInt($('#count').val())
        };
        var check = true;
        var se = new RegExp(filters.search && filters.search.length ? "".concat(filters.search) : '.*', 'ig');

        if (filters.search && filters.search.length) {
          check = se.test(d.pair.symbol);
          if (!check) return;
        }

        if (filters.type && filters.type.length) {
          check = $.inArray(d.pair.type, filters.type.split(/,/g)) > -1;
          if (!check) return;
        }

        if (filters.pairs && filters.pairs.length) {
          check = $.inArray("".concat(d.instrument_id), filters.pairs.split(/,/g)) > -1;
          if (!check) return;
        }

        if (filters.source && filters.source.length) {
          check = $.inArray("".concat(d.source_id), filters.source.split(/,/g)) > -1;
          if (!check) return;
        }

        if ($c.find('.item').length > filters.count) $c.find('.item:last').remove();
        var icon = d.volation == -1 ? '<i class="ui caret down red icon" style="margin-right:0;"></i>' : '<i class="ui caret up green icon" style="margin-right:0;"></i>';
        var $i = $('<div class="ui price image item"></div>');
        var $img = $("<div class=\"ui image\" style=\"min-width:8.5em;\"><i class=\"ic ic_".concat(d.pair.from.code.toLowerCase(), "\"></i><i class=\"ic ic_").concat(d.pair.to.code.toLowerCase(), "\"></i></div>")).appendTo($i);
        var $cnt = $("<div class=\"ui content\">\n                    <div class=\"ui header\"><small><code>#".concat(d.pair.id, "</code></small>").concat(d.pair.title, "</div>\n                    <div class=\"ui meta\"><code>").concat(d.time.timestamp(), "</code> <b>").concat(d.pair.symbol, "</b> ").concat(icon).concat(price.digit(), "</div>\n                </div>")).appendTo($i);
        $c.prepend($i);
      }

      crm.instrument.prices.setPrice2All(price, d.instrument_id); // to all other interface
    }
  }]);

  return Prices;
}();
/* harmony default export */ __webpack_exports__["default"] = (Pairs);

/***/ }),

/***/ "./resources/assets/js/modules/lead.js":
/*!*********************************************!*\
  !*** ./resources/assets/js/modules/lead.js ***!
  \*********************************************/
/*! exports provided: Lead */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Lead", function() { return Lead; });
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Lead =
/*#__PURE__*/
function () {
  function Lead() {
    _classCallCheck(this, Lead);

    this.current = null;
    this.data = {};
  }

  _createClass(Lead, [{
    key: "showList",
    value: function showList(opts) {
      $.ajax({
        url: '/lead/list/html',
        dataType: "html",
        data: opts,
        success: function success(d, x, s) {
          $(d).appendTo('body');
          cf.reload();
        }
      });
    }
  }, {
    key: "showImport",
    value: function showImport(o) {
      $('.import_leads').fadeIn(animationTime ? animationTime : 256);
      $('body').addClass('active');
      var $c = $('<div class="ui modal small" id="lead_import"></div>').appendTo('#modals');
      $c.append('<i class="close icon" onclick="$(\'.ui.modal\').show(\'close\')"></i>');
      $c.append("<div class=\"header\"><i class=\"icon user outline\"></i> ".concat(__('crm.leads.import'), "</div>"));
      var $co = $('<div class="ui content"></div>').appendTo($c);
      var $bo = $('<form class="ui form" action="/lead/upload" method="post" enctype="multipart/form-data"></form>').appendTo($co);
      var $bo1 = $('<div class="fields"></div>').appendTo($bo);
      $bo = $('<div class="fields"></div>').appendTo($bo);
      $('<input type="hidden" name="_token" value="' + window.Laravel.csrfToken + '"/>').appendTo($bo);
      $("<div class=\"field twelve wide\">\n            <label>".concat(__('crm.affilate'), "</label>\n            <div class=\"ui search selection dropdown\">\n                <input type=\"hidden\" name=\"affilate_id\" value=\"").concat(window.user.id, "\"/>\n                <i class=\"ui dropdown icon\"/>\n                <div class=\"default text\"></div>\n                <div class=\"menu\">").concat(employees.toItemList(), "</div>\n            </div>\n        </div>")).appendTo($bo1).dropdown();
      $('<div class="field twelve wide"><div class="ui input"><input class="ui input file" type="file" name="import" /></div></div>').appendTo($bo);
      $('<div class="field four wide right aligned"><button class="ui button icon" type="submit"><i class="upload icon"></i> Import</button></div> ').appendTo($bo);
      $('<div class="ui floating message info"><div class="header">Format xls(x)</div><p>Name, Surname, email, phone number, country, source, source description</p></div>').appendTo($co);
      $('<div class="ui floating bottom warning message"><div class="header">Note!</div><p>Required fields are <b>name</b> and <b>phone</b> or <b>mail</b></p></div>').appendTo($co);
      page.modal('#lead_import');
    }
  }, {
    key: "info",
    value: function info() {
      if (!arguments.length) return;
      var id = arguments[0];
      id = _typeof(id) == "object" ? window.crm.lead.current : id;
      if (id == undefined) return;
      this.current = id;
      $.ajax({
        url: "/lead/" + id + '/html',
        dataType: "html",
        success: function success(d, x, s) {
          // console.debug(d,x,s);
          $('body').append(d); // crm.user.calendar.init('scheduler_here');
        }
      });
    }
  }, {
    key: "touch",
    value: function touch() {
      if (cf._loaders['lead-list']) cf._loaders['lead-list'].execute();
      cf.touch('user-list');
      $('#customers_count').text(crm.user.data.total);
      $('#leads_count').text(crm.lead.data.total);
    }
  }, {
    key: "list",
    value: function list(container, d, x, s) {
      container.html('');
      crm.lead.data = d;

      for (var i in d.data) {
        var row = d.data[i];
        var tr = $('<tr data-class="user" data-id="' + row.id + '"></tr>').appendTo(container);
        tr.append('<td><div class="ui checkbox"><input type="checkbox" data-name="lead_selected" value="lead_' + row.id + '" data-id="' + row.id + '" /><label></label></div></td>');
        tr.append('<td class="center aligned">' + dateFormat(row.created_at) + '</td>');
        var c2c = '<br><small><i class="icon phone"></i>' + row.phone + '</small>';

        if (system.telephony) {
          for (var _i in system.telephony.get()) {
            var tel = system.telephony.list[_i],
                userExt = crm.user.getMeta(system.user.meta, tel.name + '_ext');
            c2c = '';
            if (userExt.length && tel.enabled == "1") c2c += '<br><small><i class="icon phone"></i><a href="javascript:crm.telephony.link(' + _i + ',\'' + userExt + '\',\'' + row.phone + '\')" target="_blank">' + row.phone + '</a></small>';else c2c = "<br/><small>".concat(row.phone, "</small>");
          }
        }

        tr.append('<td>#' + row.id + '<a onclick="crm.lead.info(' + row.id + ')">' + row.name + ' ' + row.surname + '</strong>' + '<br><small><i class="icon mail"></i>' + row.email + '</small>' + c2c + (row.country ? '<br><small><i class="icon world"></i>' + row.country + '</small>' : '') + '</td>'); // tr.append('<td>'+((row.manager && row.manager.meta)?crm.user.getMeta(row.manager.meta,'office'):'')+'</td>');

        tr.append('<td>' + row.status.title + '</td>');
        var comment = row.comments.length ? row.comments[0] : false;
        var commentRow = comment !== false ? "<b>Last comments:</b><i>".concat(comment.comment, "</i><br/><small>").concat(dateFormat(comment.created_at, false, 'simple'), "</small><br/>") : '';
        tr.append('<td>' + (row.manager ? '<b>Manager: </b><a href="javascript:crm.user.card(' + row.manager.id + ')">' + row.manager.name + ' ' + row.manager.surname + '</a>' : '') + '<br><small>' + (row.manager && row.manager.meta ? crm.user.getMeta(row.manager.meta, 'office') : '') + '</small>' + (row.affilate ? '<br><b>Affilate:</b><a href="javascript:crm.user.card(' + row.affilate.id + ')">' + row.affilate.name + ' ' + row.affilate.surname + '</a>' : '') + "<br/>".concat(commentRow) + "<br/><small>Source: ".concat(row.source, "</small>") + '</td>');
      }

      page.paginate(d, 'lead-list', container);
      container.find('[data-name=lead_selected]').on('click change keyup', function (e) {
        if ($('[data-name=lead_selected]:checked').length) {
          $('.lead.bulk').show();
          skymechanics.reload();
        } else $('.lead.bulk').hide();
      });
      $('input.search:visible').each(function () {
        var $that = $(this),
            keyword = $that.val();
        $("table:visible tbody tr td").unmark({
          done: function done() {
            $("table:visible tbody tr td").mark(keyword, {});
          }
        });
      });
    }
  }, {
    key: "assign",
    value: function assign(that) {
      var manager_id = $(that).dropdown('get value');

      if (manager_id) {
        $('[data-name=lead_selected]:checked').each(function () {
          var id = $(this).attr('data-id'),
              $that = $(this).parent();
          $.ajax({
            url: '/lead/' + id + '/update?manager_id=' + manager_id,
            success: function success() {
              $that.checkbox('uncheck');
            }
          });
        }).promise().done(function () {
          $('.onselect').hide();
          $(that).dropdown('restore defaults');
          crm.lead.touch();
        });
      }
    }
  }, {
    key: "delete",
    value: function _delete() {
      $('[data-name=lead_selected]:checked').each(function () {
        var id = $(this).attr('data-id');
        $.ajax({
          url: '/lead/' + id + '/delete',
          success: function success() {}
        });
      }).promise().done(function () {
        $('.onselect').hide();
        crm.lead.touch();
      });
    }
  }, {
    key: "add",
    value: function add() {
      var $c = $('<div class="ui modal submiter" data-action="/lead/add" data-callback="crm.lead.added" id="lead_add"></div>').appendTo('#modals');
      $c.append('<i class="close icon" onclick="$(\'.ui.modal\').show(\'close\')"></i>');
      $c.append('<div class="header"><i class="icon user outline"></i> New lead registration form</div>');
      var $bo = $('<div class="content ui form"></div>').appendTo($c);
      var $b = $('<div class="fields"></div>').appendTo($bo);
      $('<div class="field eight wide"><label>Name</label><div class="ui input"><input type="text" name="name" data-name="name" placeholder="Name" required></div></div>').appendTo($b);
      $('<div class="field eight wide"><label>Surname</label><div class="ui input"><input type="text" name="surname" data-name="surname" placeholder="Surname"  required/></div></div>').appendTo($b);
      $('<h4 class="ui dividing header">Contacts</h4>').appendTo($bo);
      $b = $('<div class="fields"></div>').appendTo($bo);
      $('<div class="field eight wide"><label>Email</label><div class="ui input"><input type="email" name="email" data-name="email" placeholder="Nameaddress@servername.com"  required></div></div>').appendTo($b);
      $('<div class="field eight wide"><label>Phone</label><div class="ui input"><input type="tel" name="phone" data-name="phone" placeholder="Phone number"  required/></div></div>').appendTo($b);
      $('<div class="field eight wide"><label>Country</label><select class="ui dropdown" name="country" data-title="Choose country" data-name="country" required>' + system.countries.toOptionList() + '</select>').appendTo($b);
      $('<div class="field eight wide"><label>Office</label><div class="ui input"><input type="text" name="office" data-name="office" placeholder="Office"/></div></div>').appendTo($b);
      $('<h4 class="ui dividing header">Status</h4>').appendTo($bo);
      $b = $('<div class="fields"></div>').appendTo($bo);
      $('<div class="field eight wide"><label>Status</label><select class="ui dropdown loadering" name="status_id" data-title="Status" data-name="status_id" placeholder="User status" required data-action="/json/user/status" data-autostart="true"></select>').appendTo($b);
      $('<input type="hidden" data-name="manager_id" value="' + system.user.id + '" />').appendTo($b);
      $('<input type="hidden" data-name="source" value="crm system">').appendTo($b);
      var $f = $('<div class="actions"></div>').appendTo($c);
      $('<div class="ui black deny button">Close</div>').appendTo($f);
      $('<div class="ui positive right labeled icon button submit">Ok <i class="checkmark icon"></i></div>').appendTo($f);
      page.modal('#lead_add');
    }
  }, {
    key: "added",
    value: function added(d, $c) {
      if (d.name) {
        crm.lead.touch();
        $c.modal('hide');
      } else alert(d);
    }
  }]);

  return Lead;
}();
;

/***/ }),

/***/ "./resources/assets/js/modules/merchant.js":
/*!*************************************************!*\
  !*** ./resources/assets/js/modules/merchant.js ***!
  \*************************************************/
/*! exports provided: Merchant */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Merchant", function() { return Merchant; });
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Merchant =
/*#__PURE__*/
function () {
  function Merchant() {
    _classCallCheck(this, Merchant);
  }

  _createClass(Merchant, [{
    key: "touch",
    value: function touch(d, $c) {
      skymechanics.touch('merchants-list');
      if (d && d.RedirectURL) window.open(d.RedirectURL, '_blank');
    }
  }, {
    key: "payment",
    value: function payment(id) {
      var row = $('.merchant[data-id=' + id + '] td:eq(0)').text();
      row = JSON.parse(row);
      var $modal = $('<div class="ui modal merchant" id="merchant_' + id + '_payment"></div>').appendTo('#modals');
      $modal.append('<i class="close icon" onclick="$(\'.ui.modal\').show(\'close\')"></i>');
      $modal.append('<div class="header">' + row.name + '</div>');
      var $content = $('<div class="content scrolling"></div>').appendTo($modal),
          $form = $('<div class="ui form submiter globe" data-action="/user/finance/deposit" data-callback="crm.merchant.touch"></div>').appendTo($content);
      $form.append("<input type=\"hidden\" data-name=\"merchant\" value=\"".concat(row.name, "\"/>"));
      $form.append("<input type=\"hidden\" data-name=\"merchant_id\" value=\"".concat(row.id, "\"/>"));
      $form.append('<input type="hidden" data-name="currency_id" value="1"/>');
      $form.append('<input type="hidden" data-name="user_id" value="1"/>');
      var $usearch = $('<div class="field"></div>').appendTo($form);
      $usearch.append('<label>to Customer</label>');
      $('<div class="ui search"><div class="ui icon input"><input class="prompt" type="text" placeholder="Customer search..."><i class="search icon"></i></div><div class="results"></div></div>').appendTo($usearch).search({
        apiSettings: {
          url: '/json/user?search={query}',
          onResponse: function onResponse(result) {
            var response = {
              results: []
            };

            for (var i in result.data) {
              var u = result.data[i];
              response.results.push({
                id: u.id,
                title: u.name + ' ' + u.surname,
                description: '#<strong><code>' + u.id + '</code></strong> ' + u.rights.title
              });
            }

            return response;
          }
        },
        onSelect: function onSelect(result, response) {
          console.debug('onSelect', result, response, $modal.find('[data-name=user_id]'));
          $modal.find('[data-name=user_id]').val(result.id);
        },
        minCharacters: 3
      });
      $form.append('<div class="field"><label>Amount</label><input class="ui input" data-name="amount" value=""/></div>');
      $form.append('<div class="field"><label>Method</label>' + '<div class="ui selection dropdown"><input type="hidden" name="Method" data-name="method" value="CreditCard"/><div class="default text">CreditCard</div><i class="dropdown icon"></i><div class="menu">' + '<div class="item" data-value="CryptoCoin">CryptoCoin</div>' + '<div class="item" data-value="CreditCard">CreditCard</div>' + '<div class="item" data-value="YandexMoney">YandexMoney</div>' + '<div class="item" data-value="WireTransfer">WireTransfer</div>' + '</div></div></div>');
      $form.append('<input type="hidden" class="submit"/>');
      $modal.append('<div class="actions"><div class="ui positive right labeled icon button okclose">Make<i class="checkmark icon"></i></div></div>');
      page.modal('#merchant_' + id + '_payment');
    }
  }, {
    key: "edit",
    value: function edit(id) {
      var row = $('.merchant[data-id=' + id + '] td:eq(0)').text();
      row = JSON.parse(row);
      var $modal = $('<div class="ui modal deals" id="merchant_' + id + '_dashboard"></div>').appendTo('#modals'),
          settings = row.settings; // JSON.parse((row.settings=='null')?'{}':row.settings);

      $modal.append('<i class="close icon" onclick="$(\'.ui.modal\').show(\'close\')"></i>');
      $modal.append('<div class="header">' + row.name + '</div>');
      var $content = $('<div class="content scrolling"></div>').appendTo($modal),
          $form = $('<div class="ui form submiter globe" data-action="/json/merchant/' + row.id + '/update" data-callback="crm.merchant.touch"></div>').appendTo($content);
      $form.append('<div class="field"><label>Title</label><input class="ui input" data-name="title" value="' + row.title + '"/></div>');
      $form.append('<div class="ui horizontal divider">Settings</div>');

      for (var i in settings) {
        var setting = settings[i];

        if (_typeof(setting) == "object") {
          settings = JSON.stringify(settings);
        }

        $form.append('<div class="field setting"><label>' + i + '</label><input class="ui input" data-name="settings.' + i + '" value="' + setting + '"/></div>');
      }

      $form.append('<input type="hidden" class="submit"/>');
      $modal.append('<div class="actions"><div class="ui basic labeled icon button" onclick="crm.merchant.payment(' + id + ')">Pay<i class="dollar icon"></i></div><div class="ui positive right labeled icon button okclose">Ok<i class="checkmark icon"></i></div></div>');
      page.modal('#merchant_' + id + '_dashboard');
    }
  }, {
    key: "list",
    value: function list($c, d) {
      $c.html('');

      for (var i in d) {
        var row = d[i],
            $tr = $('<tr data-class="" class="merchant' + (row.enabled == 2 ? ' disabled' : '') + '" data-id="' + row.id + '"></tr>').appendTo($c);
        $tr.append('<td style="display:none;">' + JSON.stringify(row) + '</td>');
        $tr.append('<td>' + row.id + '</td>');
        if (row.enabled == '2') $tr.append('<td>&nbsp;</td>'); // else $tr.append('<td><div class="ui slider checkbox submiter" data-action="/json/merchant/' +row.id +'/update" data-name="merchant-enabled" data-callback="crm.merchant.touch">' +'<input class="merchant enabled switcher" type="checkbox" data-name="enabled" ' +
        //     ((row.enabled == '1') ? 'checked' : '') +
        //     ' onchange="$(this).closest(\'.submiter\').find(\'.submit\').click();"><label></label>' +
        //     '<input type="hidden" class="submit"/></div></td>');
        else $tr.append("<td>\n                <div class=\"ui slider checkbox submiter\" data-action=\"/json/merchant/".concat(row.id, "/update\" data-name=\"merchant-enabled\" data-callback=\"crm.merchant.touch\">\n                    <input class=\"merchant enabled switcher\" type=\"checkbox\" data-name=\"enabled\" ").concat(row.enabled != '0' ? 'checked' : '', " onchange=\"$(this).closest('.submiter').find('.submit').click();\">\n                    <label></label>\n                    <input type=\"hidden\" class=\"submit\"/>\n                </div>\n            </td>"));
        $tr.append("<td class=\"ui header aligned left\"><a href=\"javascript:0;\" onclick=\"crm.merchant.edit(".concat(row.id, ")\">").concat(row.title, "</a><br/><small>").concat(row.name, "</small></td>"));
        $tr.append("<td>\n                    <div class=\"ui radio checkbox submiter\" data-action=\"/json/merchant/".concat(row.id, "/update\" data-name=\"merchant-default\" data-callback=\"crm.merchant.touch\">\n                        <input class=\"merchant default\" type=\"checkbox\" data-name=\"default\" ").concat(row["default"] != '0' ? 'checked' : '', " onchange=\"$(this).closest('.submiter').find('.submit').click();\">\n                        <label></label>\n                        <input type=\"hidden\" class=\"submit\"/>\n                    </div>\n                </td>"));
      }

      $('.pair.enabled.switcher').on('change', function () {
        $(this).parent().find('.submit').click();
      }); // page.paginate(d,'instrument-list',$c);

      cf.reload();
    }
  }]);

  return Merchant;
}();
;

/***/ }),

/***/ "./resources/assets/js/modules/messages.js":
/*!*************************************************!*\
  !*** ./resources/assets/js/modules/messages.js ***!
  \*************************************************/
/*! exports provided: Messages, Comments, Mails, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Messages", function() { return Messages; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Comments", function() { return Comments; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Mails", function() { return Mails; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Messages =
/*#__PURE__*/
function () {
  function Messages() {
    _classCallCheck(this, Messages);
  }

  _createClass(Messages, [{
    key: "touch",
    value: function touch() {
      if (cf._loaders['dashboard-messages']) cf._loaders['dashboard-messages'].execute();
    }
  }, {
    key: "added",
    value: function added(d, $c) {
      cf.touch('user-messages');
      crm.messages.touch();
      $c.find('input:visible,textarea:visible').val('');
    }
  }, {
    key: "list",
    value: function list($c, d, x, s) {
      if (!d.length) return;
      $c.html('');
      var ddt = parseInt(d[0].created_at).datetime({
        style: 'simple',
        show: {
          time: false
        }
      });
      $c.append('<div class="ui horizontal divider">' + ddt + '</div>');

      for (var i in d) {
        var m = d[i];
        var _s = '';
        var isme = m.author_id == system.user.id;
        var mdt = parseInt(m.created_at).datetime({
          style: 'simple',
          show: {
            time: false
          }
        });
        var status = m.status == 'new' ? ' blue' : '';
        var $m = $('<div class="ui message from' + status + '"></div>').appendTo($c);

        if (mdt != ddt) {
          ddt = mdt;
          $c.append('<div class="ui horizontal divider">' + ddt + '</div>');
        }

        $m.addClass(isme ? 'me' : 'user'); // s+=(m.author_id == {{Auth::id()}})?'<div class="message from-me">':'<div class="message from-user">';

        $m.append('<i class="close icon" onclick="crm.messages.delete(this,' + m.id + ')"></i>' // +'<div class="right floated"><a class="ui link"><i class="icon eye"></i></a></div>'
        + '<div class="ui header">' + m.subject + '</div>' + '<div class="description">' + m.message + '</div>');
        $m.append('<div class="right floated right aligned meta"><i class="icon clock"></i>' + parseInt(m.created_at).datetime({
          style: 'time'
        }) + '</div>');

        if (m.status == 'new' && m.user_id == system.user.id) {
          $m.append('<div class="ui horizontal divider">actions</div>');
          var $b = $('<div class="ui right aligned buttons"></div>').appendTo($m);
          $b.append('<button class="ui button icon basic labeled" onclick="crm.messages.view(this,' + m.id + ')"><i class="eye icon"></i>Viewed</button>');
        } // $m.append('<div class="meta"><i class="icon author"></i>'+m.author.name+' '+m.author.surname+'</div>');

      }
    }
  }, {
    key: "delete",
    value: function _delete(that, id) {
      $.ajax({
        url: '/user/message/' + id + '/delete',
        success: function success(d) {
          if (d == true) {
            $(that).closest('.message').transition('fade');
            crm.messages.touch();
          }
        }
      });
    }
  }, {
    key: "view",
    value: function view(that, id) {
      console.debug('message viewed');
      $.ajax({
        url: '/user/message/' + id + '/edit',
        data: {
          status: 'viewed'
        },
        success: function success(d) {
          $(that).closest('.message').removeClass('blue');
          $(that).closest('.message').find('.divider,.buttons').transition('fade');
          crm.messages.touch();
        }
      });
    }
  }, {
    key: "dashboard",
    value: function dashboard($cont, d) {
      var counts = 0;
      var $c = $cont.find('.menu');
      $c.html('');

      for (var i in d) {
        var row = d[i];
        if (row.author_id == system.user.id) continue;
        counts++;
        var $card = $('<div class="ui card"></div>').appendTo($c);
        $card.append('<div class="content">' + '<div class="right floated right aligned">' + dateFormat(row.created_at, true, 'simple') + '</div>' + '<div class="header">' + row.subject + '</div>' + '<div class="meta">' + row.message + '</div>' + '</div>');
        $card.append('<div class="extra content">' // +'<div class="meta right aligned"></div>'
        + '<div class="meta right aligned"><i class="icon user"></i>' + row.author.name + ' ' + row.author.surname + '</div>' + '</div>');
        $card.on('click', function () {
          console.debug("messages", "crm.user.card(row.author.id,'messages')");
          crm.user.card(row.author.id, 'messages');
        });
      }

      if (counts) {
        $cont.show();
        $cont.find('.messages').html(counts);
      } else {
        $cont.hide();
        $cont.find('.messages').html('');
      }
    }
  }]);

  return Messages;
}();
var Comments =
/*#__PURE__*/
function () {
  function Comments() {
    _classCallCheck(this, Comments);
  }

  _createClass(Comments, [{
    key: "added",
    value: function added(d, container, a) {
      if (!d.comment) return;
      var $comments = container.parent().find('.comment:first');
      var comment = $('<div class="comment"></div>').insertBefore($comments);
      var date = new Date(d.created_at);
      var avatar = system.user.id % 5;
      comment.append('<a class="avatar"><img src="/crm/images/avatar/' + avatar + '.jpg"></a>');
      comment.append('<div class="content">' + '<a class="author">' + system.user.name + ' ' + system.user.surname + '</a>' + '<div class="metadata"><span class="date">' + dateFormat(d.created_at, true, 'simple') + '</span></div>' + '<div class="text">' + d.comment + '</div>' + '</div>');
      $('.comment.empty').remove();
      $('#comment_list').scrollTop(0);
      $('textarea[name=comment]').val('');
      $('#comment').parents('.submiter').find('.submit').addClass('disabled');
      console.debug('comment added', d, crm.user, crm.lead);
      if (d.object_type == "user") crm.user.touch();else if (d.object_type == "lead") crm.lead.touch();
    }
  }]);

  return Comments;
}();
var Mails =
/*#__PURE__*/
function () {
  function Mails() {
    _classCallCheck(this, Mails);
  }

  _createClass(Mails, [{
    key: "add",
    value: function add() {
      var $c = $('<div class="ui modal submiter" data-action="/mail/add" data-callback="crm.mail.touch" id="mail_add"></div>').appendTo('#modals');
      $c.append('<i class="close icon" onclick="$(\'.ui.modal\').show(\'close\')"></i>');
      $c.append('<div class="header"><i class="icon mail outline"></i> New mail template</div>');
      var $bo = $('<div class="content ui form"></div>').appendTo($c);
      var $b = $('<div class="fields"></div>').appendTo($bo);
      $('<div class="field eight wide"><label>Name</label><div class="ui input"><input type="text" name="name" data-name="name" placeholder="Name" required></div></div>').appendTo($b);
      $('<div class="field eight wide"><label>Title</label><div class="ui input"><input type="text" name="title" data-name="title" placeholder="title"  required/></div></div>').appendTo($b);
      $('<h4 class="ui dividing header">Template</h4>').appendTo($bo);
      $b = $('<div class="fields"></div>').appendTo($bo);
      $('<div class="field sixteen wide"><label>Template</label><div class="ui input"><textarea data-name="template" placeholder="Template"  required></textarea></div></div>').appendTo($b);
      var $f = $('<div class="actions"></div>').appendTo($c);
      $('<div class="ui black deny button">Close</div>').appendTo($f);
      $('<div class="ui positive right labeled icon button submit">Ok <i class="checkmark icon"></i></div>').appendTo($f);
      page.modal('#mail_add');
    }
  }, {
    key: "list",
    value: function list($c, d) {
      $c.html('');

      for (var i in d) {
        $c.append('<div class="divider"></div>');
        var row = d[i],
            $i = $('<div class="item"></div>').appendTo($c),
            $i = $('<div class="content"></div>').appendTo($i);
        $i.append('<div class="ui header">' + row.title + '</div></div>');
        var $f = $('<div class="submiter ui form" data-action="/mail/' + row.id + '/update" data-callback="crm.mail.touch"></div>').appendTo($i);
        $('<div class="fields"><div class="field eight wide"><label>Name</label><div class="ui input"><input type="text" name="name" data-name="name" placeholder="Name" required value="' + row.name + '"></div></div>' + '<div class="field eight wide"><label>Title</label><div class="ui input"><input type="text" name="title" data-name="title" placeholder="title"  required value="' + row.title + '"/></div></div></div>').appendTo($f);
        $('<div class="field sixteen wide"><label>Template</label><div class="ui input"><textarea data-name="template" placeholder="Template"  required>' + row.template + '</textarea></div></div>').appendTo($f); // $f.append('<div class="right floated content"><button class="ui button basic icon"><i class="trash icon"></i>Delete</button><button class="ui button submit">Save</button></div>');

        $f.append('<div class="right floated content"><button class="ui button submit">Save</button></div>');
      }

      cf.reload();
    }
  }, {
    key: "touch",
    value: function touch() {
      $('#mail_add').show('close');
      cf.touch('mail-template-list');
    }
  }, {
    key: "sent",
    value: function sent(d, $c) {
      cf.touch('user-mail');
      $c.find('.dropdown').dropdown('restore defaults');
      $c.find('input:visible,textarea:visible').val('');
    }
  }, {
    key: "chooseTemplate",
    value: function chooseTemplate($c, d) {
      crm.mail.templates = {};
      d.map(function (t, i) {
        crm.mail.templates[t.id] = t;
      });
    }
  }, {
    key: "loadTemplate",
    value: function loadTemplate(v, t, $choice) {
      var $templ = $('.mailsText');
      var templ = crm.mail.templates[v] ? crm.mail.templates[v].template : '';
      $templ.html(templ);
      console.debug($templ.text(), templ);
    }
  }, {
    key: "user",
    value: function user($c, d) {
      if (!d.length) return;
      $c.html('');
      var ddt = parseInt(d[0].created_at).datetime({
        style: 'simple',
        show: {
          time: false
        }
      });
      $c.append('<div class="ui horizontal divider">' + ddt + '</div>');

      for (var i in d) {
        var m = d[i],
            mdt = parseInt(m.created_at).datetime({
          style: 'simple',
          show: {
            time: false
          }
        });
        var $m = $('<div class="comment"></div>').appendTo($c);
        $m.append('<a class="avatar"><img src="/crm/images/avatar/' + m.sender.id % 5 + '.jpg"></a>');
        $m.append('<div class="content">' + '<a class="author">' + m.sender.name + ' ' + m.sender.surname + '</a>' + '<div class="metadata"><span class="date">' + parseInt(m.created_at).datetime({
          style: 'time'
        }) + '</span></div>' + '<div class="metadata"><code>Template #' + m.mail.id + '</code><b>' + m.mail.name + '</b></div>' + '<div class="text"><div class="ui header">' + m.mail.title + '</div>' + m.text + '</div>' + '</div>');

        if (mdt != ddt) {
          ddt = mdt;
          $c.append('<div class="ui horizontal divider">' + ddt + '</div>');
        }
      }
    }
  }]);

  return Mails;
}();
/* harmony default export */ __webpack_exports__["default"] = (Messages);

/***/ }),

/***/ "./resources/assets/js/modules/newsfeed.js":
/*!*************************************************!*\
  !*** ./resources/assets/js/modules/newsfeed.js ***!
  \*************************************************/
/*! exports provided: Newsfeed */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Newsfeed", function() { return Newsfeed; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Newsfeed =
/*#__PURE__*/
function () {
  function Newsfeed() {
    _classCallCheck(this, Newsfeed);
  }

  _createClass(Newsfeed, [{
    key: "render",
    value: function render($c, d) {
      $c.html('');
      d.data.map(function (row, i) {
        var $row = $("<tr data-id=\"".concat(row.id, "\"></tr>")).appendTo($c);
        $("<td class=\"center aligned\">".concat(dateFormat(row.created_at), "</td>")).appendTo($row);
        $("<td class=\"\">\n                <div class=\"ui unstackable item\">\n                    <div class=\"image\">\n                        <img class=\"ui tiny image\" src=\"".concat(row.icon, "\"/>\n                    </div>\n                    <div class=\"content\">\n                        <div class=\"ui header\"><a href=\"javascript:crm.newsfeed.edit(").concat(row.id, ")\">").concat(row.title, "</a></div>\n                        <div class=\"meta\">Category <b>").concat(row.category, "</b></div>\n                        <div class=\"description\">").concat(row.anonce, "</div>\n                        <div class=\"extra\">Author: ").concat(crm.user.showManager(row.user), "</div>\n                    </div>\n                </div>\n            </td>")).appendTo($row); // $cell =

        $("<td>\n                <div class=\"ui slider checkbox submiter\" data-action=\"/newsfeed/".concat(row.id, "\" data-method=\"put\"><input type=\"hidden\" class=\"submit\"/><input class=\"publish-unpublish\" type=\"checkbox\" data-name=\"published\" ") + (row.published == 1 ? 'checked="checked"' : '') + "/><label></label></div>\n                <div class=\"submiter\" style=\"display:inline-block\" data-action=\"/newsfeed/".concat(row.id, "\" data-method=\"delete\" data-callback=\"crm.newsfeed.added\"><button class=\"ui basic icon button submit\" title=\"Remove\"><i class=\"trash icon\"></i></button></div>\n            </td>")).appendTo($row);
      });
      $('.publish-unpublish').on('change', function () {
        $(this).parent('.submiter').find('.submit').click();
      }); // page.refresh();

      page.paginate(d, 'newsfeed-list', $c);
    }
  }, {
    key: "added",
    value: function added() {
      $('#newsfeed_add').modal('hide');
      $('#newsfeed_edit').modal('hide');
      cf.touch('newsfeed-list');
    }
  }, {
    key: "add",
    value: function add() {
      var $c = $('<div class="ui ontop fullscreen scrolling long modal submiter" data-action="/newsfeed" data-method="post" data-callback="crm.newsfeed.added" id="newsfeed_add"></div>').appendTo('#modals');
      $c.append('<i class="close icon" onclick="$(\'.ui.modal\').show(\'close\')"></i>');
      $c.append('<div class="header"><i class="icon newspaper outline"></i> Create news</div>');
      var $bo = $('<div class="content ui form "></div>').appendTo($c),
          $b = $('<div class="fields"></div>').appendTo($bo);
      $('<div class="field required"><label>Category</label><div class="ui left icon input search"><i class="ui folder icon"></i><input type="text" name="category" data-name="category" placeholder="Category" required></div></div>').appendTo($bo);
      $('<div class="field required"><label>Title</label><div class="ui left icon input"><i class="ui heading icon"></i><input type="text" name="title" data-name="title" placeholder="Title" required></div></div>').appendTo($bo);
      $('<div class="field required"><label>Image</label><div class="ui left icon input"><i class="ui image icon"></i><input type="text" name="icon" data-name="icon" placeholder="Image" required></div></div>').appendTo($bo);
      $("<div class=\"field required\">\n            <label>Anonce</label>\n            <div class=\"richtext-editor\" data-id=\"newsfeed_anonce\" id=\"newsfeed_anonce_edtor\" data-size=\"normal\"></div>\n            <input type=\"hidden\" data-name=\"anonce\" id=\"newsfeed_anonce\"/>\n        </div>").appendTo($bo);
      $("<div class=\"field required\">\n            <label>Content</label>\n            <div class=\"richtext-editor\" data-id=\"newsfeed_content\" id=\"newsfeed_edtor\" data-size=\"large\"></div>\n            <input type=\"hidden\" data-name=\"content\" id=\"newsfeed_content\"/>\n        </div>").appendTo($bo);
      var $f = $('<div class="actions"></div>').appendTo($c);
      $('<div class="ui black deny button">Close</div>').appendTo($f);
      $('<div class="ui positive right labeled icon button submit">Ok <i class="checkmark icon"></i></div>').appendTo($f);
      cf.reload();
      page.modal('#newsfeed_add');
    }
  }, {
    key: "edit",
    value: function edit(id) {
      var $c = $("<div class=\"ui ontop fullscreen scrolling modal long submiter\" data-action=\"/newsfeed/".concat(id, "\" data-method=\"put\" data-callback=\"crm.newsfeed.added\" id=\"newsfeed_edit\"></div>")).appendTo('#modals');
      $c.append("<i class=\"close icon\" onclick=\"$('#newsfeed_edit').modal('hide')\"></i>");
      $c.append("<div class=\"header\"><i class=\"icon newspaper outline\"></i> Edit news #".concat(id, "</div>"));
      var $bo = $('<div class="content ui form"></div>').appendTo($c),
          $b = $('<div class="fields"></div>').appendTo($bo);
      $('<div class="field required"><label>Category</label><div class="ui left icon input search"><i class="ui folder icon"></i><input type="text" name="category" data-name="category" placeholder="Category" required></div></div>').appendTo($bo);
      $('<div class="field loader"><label>Title</label><div class="ui left icon input"><i class="ui heading icon"></i><input type="text" name="title" data-name="title" placeholder="Title"></div></div>').appendTo($bo);
      $('<div class="field loader"><label>Image</label><div class="ui left icon input"><i class="ui image icon"></i><input type="text" name="icon" data-name="icon" placeholder="Image" required></div></div>').appendTo($bo);
      $("<div class=\"field loader\">\n            <label>Anonce</label>\n            <div class=\"richtext-editor\" data-id=\"newsfeed_anonce\" id=\"newsfeed_anonce_edtor\" data-size=\"normal\"></div>\n            <input type=\"hidden\" data-name=\"anonce\" id=\"newsfeed_anonce\"/>\n        </div>").appendTo($bo);
      $("<div class=\"field loader\">\n            <label>Content</label>\n            <div class=\"richtext-editor\" data-id=\"newsfeed_content\" id=\"newsfeed_edtor\"></div>\n            <input type=\"hidden\" data-name=\"content\" id=\"newsfeed_content\"/>\n        </div>").appendTo($bo);
      var $f = $('<div class="actions"></div>').appendTo($c);
      $('<div class="ui black deny button">Close</div>').appendTo($f);
      $('<div class="ui positive right labeled icon button submit">Ok <i class="checkmark icon"></i></div>').appendTo($f);
      page.modal('#newsfeed_edit');
      $.ajax({
        url: "/newsfeed/".concat(id),
        type: 'get',
        success: function success(d, s, x) {
          $c.find('[data-name=title]').val(d.title);
          $c.find('[data-name=category]').val(d.category);
          $c.find('[data-name=anonce]').val(d.anonce);
          $c.find('[data-name=content]').val(d.content);
          $c.find('[data-name=icon]').val(d.icon);
          $c.find('#newsfeed_anonce_edtor .ui.segment').html(d.anonce);
          $c.find('#newsfeed_edtor .ui.segment').html(d.content);
          $('#newsfeed_edit').modal('setting', 'centered', false);
          $('#newsfeed_edit').modal('refresh');
          $('#newsfeed_edit .field').removeClass('loader');
        }
      });
    }
  }, {
    key: "sentHandler",
    value: function sentHandler(d, $c) {
      // $c.find('.close').click();
      $('#new_mail_message').modal('hide');
      skymechanics.touch('imap-list'); //onclick="$(\'.ui.modal\').show(\'close\')"
    }
  }, {
    key: "update",
    value: function update(uid, user_id) {
      var m = [];

      if (uid == undefined) {
        $('.checkbox.checked[data-uid][data-user-id]').each(function () {
          m.push({
            uid: $(this).attr('data-uid'),
            user_id: $(this).attr('data-user-id')
          });
        });
      } else m.push({
        uid: uid,
        user_id: user_id
      });

      m.map(function (r) {
        $.ajax({
          url: "/imap/".concat(r.uid),
          type: 'put',
          data: {
            _token: window.Laravel.csrfToken,
            user_id: r.user_id,
            status: 'read'
          },
          success: function success() {
            $(".imap-".concat(r.uid)).addClass('viewed');
          }
        });
      });
    }
  }, {
    key: "delete",
    value: function _delete(uid, user_id) {
      var m = [];

      if (uid == undefined) {
        $('.checkbox.checked[data-uid][data-user-id]').each(function () {
          m.push({
            uid: $(this).attr('data-uid'),
            user_id: $(this).attr('data-user-id')
          });
        });
      } else m.push({
        uid: uid,
        user_id: user_id
      });

      m.map(function (r) {
        $.ajax({
          url: "/imap/".concat(r.uid),
          data: {
            _token: window.Laravel.csrfToken,
            user_id: r.user_id
          },
          type: 'delete',
          success: function success() {
            $(".imap-".concat(r.uid)).remove();
          }
        });
      });
    }
  }, {
    key: "select",
    value: function select(that, df) {
      var st = $(that).checkbox('is checked') ? 'check' : 'uncheck';
      $(that).closest('.message').next('.accordion').find(".".concat(df, " .checkbox")).checkbox("".concat(st));
    }
  }]);

  return Newsfeed;
}();
;

/***/ }),

/***/ "./resources/assets/js/modules/online.js":
/*!***********************************************!*\
  !*** ./resources/assets/js/modules/online.js ***!
  \***********************************************/
/*! exports provided: OnlineUsers */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OnlineUsers", function() { return OnlineUsers; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var OnlineUsers =
/*#__PURE__*/
function () {
  function OnlineUsers() {
    _classCallCheck(this, OnlineUsers);

    this.list = {};
    this.socketList = [];
    this.ids = [];
    this.currentAuth = window.user;
    this.load = this.load.bind(this);
    this.handle = this.handle.bind(this);
    this.render = this.render.bind(this);
    this.onlineNowById = this.onlineNowById.bind(this);
  }

  _createClass(OnlineUsers, [{
    key: "handle",
    value: function handle(d) {
      this.socketList = d;
      this.load();
    }
  }, {
    key: "load",
    value: function load() {
      var _this = this;

      var that = this;
      this.ids = [];
      this.socketList.map(function (item, i) {
        var id = item.id;

        if (id != user.id) {
          if (user.rights_id >= 8 || user.childs.indexOf(item.parent_user_id) > -1 || user.childs.indexOf(item.affilate_id) > -1) {
            if (that.list[id] == undefined || that.list[id] == null) {
              that.list[id] = item;
              that.list[id].signin = true;
              that.render(that.list[id]);
            } else {
              that.list[id].signin = true;
            }
          }

          if (item.rights_id == 1 && !user.fastlogin && _this.ids.indexOf(id) == -1) _this.ids.push(id);
        }
      });

      for (var i in that.list) {
        if (that.list[i].signin === false) {
          var $u = $("#online-user-".concat(that.list[i].id));
          if (that.list[i].rights_id > 1) $('#online_admins').find('.label').text(parseInt($('#online_admins').find('.label').text()) - 1);else $('#online_users').find('.label').text(parseInt($('#online_users').find('.label').text()) - 1);
          $u.remove();
          delete that.list[i];
        } else that.list[i].signin = false;
      }

      $('input[data-name=ids]').val(this.ids.join());
      $('#user_list_online_count').text(this.ids.length); // that.render();
    }
  }, {
    key: "onlineNowById",
    value: function onlineNowById() {
      this.ids.join();
    }
  }, {
    key: "render",
    value: function render(user) {
      var force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if ($("#online-user-".concat(user.id)).length) {
        if (!force) return;
        $("#online-user-".concat(user.id)).remove();
      }

      var $admins = $('#online_admins');
      var $users = $('#online_users');
      $admins.removeClass('yellow changed');
      $users.removeClass('yellow changed');
      var $al = $admins.find('.label');
      var $as = $admins.find('.menu');
      var $ul = $users.find('.label');
      var $us = $users.find('.menu');

      if (user.rights_id > 1) {
        //admins
        $as.append("<a class=\"right aligned item\" id=\"online-user-".concat(user.id, "\" data-type=\"admin\" onclick=\"crm.user.card(").concat(user.id, ")\">\n                <i class=\"user circle icon\"></i>\n                <span class=\"text\">").concat(user.title || "#".concat(user.id), "</span>\n                <span class=\"description\">").concat(user.rights.name || '', "</span></a>"));
        $admins.find('.label').text(parseInt($admins.find('.label').text()) + 1);
        $admins.addClass('yellow changed');
      } else {
        // user
        $us.append("<a class=\"right aligned item\" id=\"online-user-".concat(user.id, "\" data-type=\"user\" onclick=\"crm.user.card(").concat(user.id, ")\">\n                <i class=\"user icon\"></i>\n                <span class=\"text\">").concat(user.title || "#".concat(user.id), "</span>\n                <span class=\"description\">").concat(user.fastlogin ? __('crm.fastlogin') : user.balance.dollars(), "</span>\n            </a>"));
        $users.find('.label').text(parseInt($users.find('.label').text()) + 1);
        $users.addClass('yellow changed');
      }
    }
  }]);

  return OnlineUsers;
}();

/***/ }),

/***/ "./resources/assets/js/modules/options/private.js":
/*!********************************************************!*\
  !*** ./resources/assets/js/modules/options/private.js ***!
  \********************************************************/
/*! exports provided: Private */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Private", function() { return Private; });
/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../components */ "./resources/assets/js/components/index.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }


var Private =
/*#__PURE__*/
function () {
  function Private(d, c, a) {
    var _this = this;

    _classCallCheck(this, Private);

    this.args = {
      request: a,
      response: d,
      container: c
    };
    this.guid = guid();
    this.getqr = this.getqr.bind(this);
    this.render = this.render.bind(this);

    if (this.args.response.meta_value == '1') {
      var $modal = new _components__WEBPACK_IMPORTED_MODULE_0__["VUIModal"]({
        title: __('crm.private.google2fa.one_time_password'),
        message: "<div class=\"ui loading placeholder segment\" id=\"g2fa_code\" style=\"height:460px;\"></div>",
        approve: function approve($e) {
          console.log('Ok');
        }
      });
      this.getqr().then(function (d) {
        _this.render(d);
      });
      this.$section = $("#g2fa_code");
    } else {
      new _components__WEBPACK_IMPORTED_MODULE_0__["VUIMessage"]({
        title: __('crm.success'),
        message: ' '
      });
    }
  }

  _createClass(Private, [{
    key: "getqr",
    value: function getqr() {
      var userId = this.args.request.user_id;
      var container = this.args.container;
      return new Promise(function (resolve, reject) {
        $.ajax({
          url: "/user/".concat(userId, "/google2fa"),
          type: 'post',
          success: function success(d, x, s) {
            resolve(d);
          },
          error: function error(x, s) {
            reject();
          }
        });
      });
    }
  }, {
    key: "render",
    value: function render(d) {
      var $section = this.$section;
      $section.removeClass('loading');
      $section.replaceWith(d);
    }
  }]);

  return Private;
}();

/***/ }),

/***/ "./resources/assets/js/modules/partner.js":
/*!************************************************!*\
  !*** ./resources/assets/js/modules/partner.js ***!
  \************************************************/
/*! exports provided: Partner */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Partner", function() { return Partner; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Partner =
/*#__PURE__*/
function () {
  function Partner() {
    _classCallCheck(this, Partner);

    this.__charts = {};
  }

  _createClass(Partner, [{
    key: "list",
    value: function list($c, d) {
      $c.html('');
      d.data.map(function (row, i) {
        var tr = $('<tr data-class="user" data-id="' + row.id + '"></tr>').appendTo($c);
        var canFollow = crm.user.getMeta(row.meta, 'can_follow');
        canFollow = canFollow ? JSON.parse(canFollow) : {
          partner: currentAuth.id,
          can: false
        };
        tr.append("<td class=\"center aligned\">".concat(dateFormat(row.created_at), "</td>"));
        tr.append("<td>".concat(crm.user.showCustomer(row), "</td>"));
        tr.append("<td>\n                    <div class=\"ui slider checkbox submiter\" data-action=\"/json/user/meta?meta_name=can_follow\" data-name=\"user-can-follow\">\n                        <input type=\"hidden\" data-name=\"user_id\" value=\"".concat(row.id, "\" />\n                        <input type=\"hidden\" data-name=\"meta_value\" value='").concat(JSON.stringify(canFollow), "'}/>\n                        <input class=\"switcher\" type=\"checkbox\" data-name=\"\" ").concat(canFollow.can ? 'checked="checked"' : '', "/>\n                        <input type=\"hidden\" class=\"submit\"/>\n                        <label>").concat(__('crm.customers.can_follow'), "</label>\n                    </div>\n\n                </td>"));
        tr.append('<td>' + (row.comments.length ? '<i>' + row.comments[row.comments.length - 1].comment + '</i><br/><small>' + dateFormat(row.comments[row.comments.length - 1].created_at, false, 'simple') + '</small>' : '') + '</td>');
      });
      $('.switcher').on('change', function () {
        var $p = $(this).parent();
        var cf = JSON.parse($p.find('[data-name=meta_value]').val());
        cf.can = !cf.can;
        $p.find('[data-name=meta_value]').val(JSON.stringify(cf));
        $p.find('.submit').click();
      });
      page.paginate(d, 'partner-user-list', $c);
    }
  }, {
    key: "dashboard",
    value: function dashboard($c, d) {
      var rep = {
        ctx: $c.find('#chart__affilate_bycountry').get(0),
        data: {},
        raw: {}
      },
          rep1 = {
        ctx: $c.find('#chart__affilate_date').get(0),
        data: {},
        raw: {}
      },
          totalDeposit = 0;

      for (var i in d) {
        var u = d[i],
            name = u.name + ' ' + u.surname,
            status = u.status.title,
            country = u.country && u.country.length ? u.country[0].meta_value : '',
            date = new Date((u.created_at - u.created_at % (24 * 60 * 60)) * 1000),
            deposits = 0;

        for (var j in u.deposits) {
          deposits += parseFloat(u.deposits[j].amount);
        }

        rep.raw[country] = rep.raw[country] ? rep.raw[country] : 0;
        rep.raw[country]++;
        rep1.raw[date] = rep1.raw[date] ? rep1.raw[date] : 0;
        rep1.raw[date] += deposits;
        totalDeposit += deposits;
      }

      rep.data = splitObjectKeys(rep.raw);
      rep1.data = splitObjectKeys(rep1.raw); // console.debug(rep,rep1);

      if (rep.ctx) {
        if (crm.affilate.__charts['affilate_by_countries']) crm.affilate.__charts['affilate_by_countries'].destroy();
        crm.affilate.__charts['affilate_by_countries'] = new Chart(rep.ctx.getContext('2d'), {
          type: 'pie',
          data: {
            labels: rep.data.keys,
            datasets: [{
              label: "",
              borderColor: page.dashboard.options.chart.borderColors,
              backgroundColor: page.dashboard.options.chart.backgroundColors,
              data: rep.data.values
            }]
          },
          options: {
            title: {
              display: true,
              text: 'Quantity of customers by countries'
            }
          }
        });
      }

      if (rep1.ctx) {
        if (crm.affilate.__charts['affilate_by_days']) crm.affilate.__charts['affilate_by_days'].destroy();
        crm.affilate.__charts['affilate_by_days'] = new Chart(rep1.ctx.getContext('2d'), {
          type: 'bar',
          data: {
            labels: rep1.data.keys,
            datasets: [{
              label: __('crm.dashboard.deposits'),
              borderColor: page.dashboard.options.chart.borderColors,
              backgroundColor: page.dashboard.options.chart.backgroundColors,
              data: rep1.data.values
            }]
          },
          options: {
            title: {
              display: true,
              text: 'Total Amount of deposits ' + totalDeposit.currency('$', 2)
            },
            scales: {
              xAxes: [{
                type: 'time',
                time: {
                  displayFormats: {
                    quarter: 'hh:mm:ss'
                  }
                }
              }]
            }
          }
        });
      }
    }
  }]);

  return Partner;
}();

/***/ }),

/***/ "./resources/assets/js/modules/tasks_notification.js":
/*!***********************************************************!*\
  !*** ./resources/assets/js/modules/tasks_notification.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

$(document).ready(function () {
  var functNotifTask = '';
  $.each(JSON.parse($('#notifTasks').text()), function (index, value) {
    // console.log(value['start_hour'],value['start_minute']);
    functNotifTask += "setInterval(function () {\n\t\t\t\t\t\t\tvar date = new Date();\n\t\t\t\t\t\t\tif (date.getHours() == ".concat(value['start_hour'], " &&  \n\t\t\t\t\t\t\t   (date.getMinutes() - ").concat(value['start_minute'], " <= 5) &&\n\t\t\t\t\t\t\t   (date.getMinutes() - ").concat(value['start_minute'], " >= 0))\n\t\t\t\t\t\t\t{\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t$().toastmessage('showToast', {\n\t\t\t\t                     text     : '").concat(value['title'], "<br>").concat(value['text'], "<br><a onclick=crm.user.card(").concat(value['object_id'], ")>\u041F\u0440\u043E\u0441\u043C\u043E\u0442\u0440\u0435\u0442\u044C</a>',\n\t\t\t\t                     sticky   : true,\n\t\t\t\t                     position : 'top-right',\n\t\t\t\t                     type     : 'notice',\n\t\t\t\t                     closeText: '',\n                \t\t\t\t});\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}, 300000);");
  });
  eval(functNotifTask);
});

/***/ }),

/***/ "./resources/assets/js/modules/telephony.js":
/*!**************************************************!*\
  !*** ./resources/assets/js/modules/telephony.js ***!
  \**************************************************/
/*! exports provided: Telephony */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Telephony", function() { return Telephony; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Telephony =
/*#__PURE__*/
function () {
  function Telephony() {
    _classCallCheck(this, Telephony);
  }

  _createClass(Telephony, [{
    key: "list",
    value: function list($c, d) {
      for (var i in d) {
        var row = d[i],
            $item = $('<div class="ui form submiter" data-action="/api/telephony/' + row.id + '" data-method="put"></div>');
        $('<div class="field">' + '<div class="ui slider checkbox">' + '<input  data-name="enabled" type="checkbox" ' + (row.enabled && row.enabled == 1 ? 'checked="checked"' : '') + ' name="enabled"/>' + '<label>' + row.name + '</label>' + '</div>' + '</div>').appendTo($item);
        $(skymechanics.jobj.toFormFields(row.settings, 'settings')).appendTo($item);
        $('<div class="field">' + '<button class="ui green button submit">Save</button>' + '</div>').appendTo($item);
        $c.append($item);
        $c.append('<div class="divider"></div>');
      }
    }
  }, {
    key: "lazyLink",
    value: function lazyLink(phone) {
      var i = system.telephony.available();
      console.debug('LazyLink', i, phone);
      var tel = system.telephony.get()[i];
      console.debug('LazyLink', i, phone, tel);
      var ext = crm.user.getMeta(system.user.meta, tel.name + "_ext");
      console.debug('LazyLink', i, tel, ext, phone);
      crm.telephony.link(i, ext, phone);
    }
  }, {
    key: "link",
    value: function link(i, ext, phone) {
      var tel = system.telephony.list[i]; // console.info('C2C: '+tel.settings.url+'?username='+ext+'&number='+phone+'&caller_id_number=0');

      if (tel.name == 'Odricall') {
        $.ajax({
          url: tel.settings.url + '?username=' + ext + '&number=' + phone + '&caller_id_number=' + phone,
          success: function success(d, x, s) {
            console.debug(d);
          },
          error: function error(x, s) {
            alert(tel.name + ': ' + x.responseJSON.message);
          }
        });
      }
    }
  }]);

  return Telephony;
}();
;

/***/ }),

/***/ "./resources/assets/js/modules/trade/trade.js":
/*!****************************************************!*\
  !*** ./resources/assets/js/modules/trade/trade.js ***!
  \****************************************************/
/*! exports provided: Trade, Corrida */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Trade", function() { return Trade; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Corrida", function() { return Corrida; });
/* harmony import */ var _components_card__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../components/card */ "./resources/assets/js/components/card.js");
/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../components */ "./resources/assets/js/components/index.js");
/* harmony import */ var _chart_index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../chart/index */ "./resources/assets/js/modules/chart/index.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }




var Trade =
/*#__PURE__*/
function (_Card) {
  _inherits(Trade, _Card);

  function Trade(u) {
    var _this;

    _classCallCheck(this, Trade);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Trade).call(this, 'chart line'));
    _this.auth = window.user;
    _this._uid = 'ctrade_' + u.id;
    _this.draw = _this.draw.bind(_assertThisInitialized(_this));
    _this.ohlc = _this.ohlc.bind(_assertThisInitialized(_this));
    _this.chart = _this.chart.bind(_assertThisInitialized(_this));
    _this.calculate = _this.calculate.bind(_assertThisInitialized(_this));
    _this.reopen = _this.reopen.bind(_assertThisInitialized(_this));
    _this.terminate = _this.terminate.bind(_assertThisInitialized(_this));
    _this.setTuneSpeed = _this.setTuneSpeed.bind(_assertThisInitialized(_this));
    _this.handleChange = _this.handleChange.bind(_assertThisInitialized(_this));
    _this.trade = u;
    _this.getTitle = _this.getTitle.bind(_assertThisInitialized(_this));
    _this._chart = null;
    _this.dataRange = null;
    _this._corrida = null;
    _this.tuned = false;

    _this.draw();

    return _this;
  }

  _createClass(Trade, [{
    key: "compare",
    value: function compare(data) {
      var trade = this.trade;
      if (trade.status_id != data.status_id) return false;
      return true;
    }
  }, {
    key: "fresh",
    value: function fresh(d) {
      console.debug('freshing trade fresh', d, this.trade);

      if (!this.compare(d)) {
        this.trade = d;
        this.draw(true);
      }
    }
  }, {
    key: "handleChange",
    value: function handleChange() {
      var trade = this.trade,
          $container = this.$container,
          auth = this.auth;
      $("#riskb_".concat(trade.id)).removeClass('basic');
    }
  }, {
    key: "getTitle",
    value: function getTitle() {
      return "#".concat(this.trade.id, " ").concat(this.trade.instrument.title);
    }
  }, {
    key: "reopen",
    value: function reopen() {
      var trade = this.trade,
          auth = this.auth;
      var that = this;
      $.ajax({
        url: "/deal/".concat(trade.id),
        type: 'put',
        data: {
          _token: window.cfrf,
          status_id: 10
        },
        success: function success(d, x, s) {
          that.trade = d;
          that.draw();
        }
      });
    }
  }, {
    key: "terminate",
    value: function terminate() {
      var price = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var trade = this.trade,
          auth = this.auth;
      var that = this;
      console.debug('terminating trade', trade);
      var params = {
        deal_id: trade.id,
        current_price: trade.close_price
      };
      $.ajax({
        url: "/deal/delete",
        data: params,
        success: function success(d, x, s) {
          trade = d;
          that.trade = d;
          console.debug('terminating trade success', trade);
          that.draw();
        }
      });
    }
  }, {
    key: "calculate",
    value: function calculate(price) {
      var trade = this.trade;
      var op = parseFloat(trade.open_price),
          da = parseFloat(trade.amount),
          df = parseFloat(trade.fee),
          dm = parseInt(trade.multiplier),
          dd = parseInt(trade.direction),
          p = (price / op - 1) * dd * dm * da;
      return {
        profit: p + da,
        percent: (da + p) / (da + df)
      };
    }
  }, {
    key: "ohlc",
    value: function ohlc(price) {
      if (this._chart && this.trade.instrument_id == price.instrument_id) {
        var newPrice = parseFloat(price.price);
        var time = new Date(price.time * 1000);
        var trade = this.trade,
            $container = this.$container;
        var $f = $container.find(".current#current_price_".concat(trade.id));
        var $o = $container.find(".profit#current_profit_".concat(trade.id));
        var $p = $container.find(".percent#current_percent_".concat(trade.id));
        var lastPrice = parseFloat(trade.close_price);

        if (!this.tuned && price.tune == undefined || price.tune != undefined && price.user && price.user.id == this.trade.user_id) {
          var calc = this.calculate(newPrice);
          var pd = newPrice > lastPrice ? 'green' : 'red';

          if (!this.tuned || this.tuned && price.tune != undefined && price.user && price.user.id == this.trade.user_id) {
            $p.removeClass('green red changed').addClass((calc.profit > 0 ? 'green' : 'red') + ' changed');
            $p.html(calc.percent.percent());
            $o.html(calc.profit.dollars());
            $f.removeClass('green red changed').addClass(pd + ' changed').html(newPrice.digit(5));
            this.trade.close_price = newPrice;
          }
        }

        if (price.tune != undefined && price.user && price.user.id == this.trade.user_id) {
          this._chart.set(time, newPrice, 1);
        } else if (price.tune == undefined) this._chart.set(time, newPrice, 0);
      }
    }
  }, {
    key: "chart",
    value: function chart($c, d) {
      var data = [],
          labels = [];
      d = d.reverse();
      var level = 0;
      var range = 0;
      var minLevel = false;
      var maxLevel = false;
      var pairId = null;
      var that = this;
      var trade = this.trade;
      d.map(function (row, i) {
        var dt = new Date(row.time * 1000);
        level = parseFloat(row.close);
        pairId = row.instrument_id;
        labels.push(dt);
        data.push({
          x: dt,
          y: level
        });
        var newr = Math.abs(parseFloat(row.high) - parseFloat(row.low));
        if (i != 0) range = range + newr / (i + 1);else range = newr;
        minLevel = minLevel == false || minLevel > parseFloat(row.low) ? parseFloat(row.low) : minLevel;
        maxLevel = maxLevel == false || maxLevel < parseFloat(row.high) ? parseFloat(row.high) : maxLevel;
      });
      this.dataRange = (maxLevel - minLevel) / level;
      console.debug('abg range ohlc/level', this.dataRange);
      this.ohlc({
        // set current price
        instrument_id: pairId,
        price: level
      });
      data = data.reverse();
      this._chart = new _chart_index__WEBPACK_IMPORTED_MODULE_2__["VUIChart"](pairId, {
        ctx: $c.find('.chart:first'),
        data: {
          label: __('crm.instruments.prices'),
          keys: labels,
          values: data
        },
        onUpdate: function onUpdate(p) {
          var n = parseFloat(p.y),
              trade = $c.parents('.ui.modal').find('#trade_data').length ? JSON.parse($c.parents('.ui.modal').find('#trade_data').text()) : undefined,
              $f = $c.parents('.ui.modal').find('.current'),
              $o = $c.parents('.ui.modal').find('.profit'),
              $p = $c.parents('.ui.modal').find('.percent'),
              last = parseFloat($f.text().replace(/[\s,]/g, '')),
              pd = n > last ? 'green' : 'red';
          if (!trade) return;
          $c.parents('.ui.active.loader').removeClass('active loader'); // console.debug('chart updated',n,trade);

          var calc = crm.deal.calculate(trade, n); // console.debug(calc);

          $p.parents('td').removeClass('green red changed').addClass((calc.profit > 0 ? 'green' : 'red') + ' changed');
          $p.html(calc.percent.currency('') + '%');
          $o.html(calc.profit.currency(''));
          $f.removeClass('green red changed').addClass(pd + ' changed').html(n.currency('', 5));
        }
      }); // this.smchart.setSupport(level,level*.5);

      this._corrida = new Corrida(this._chart, this);

      this._corrida.read(function (t) {
        that.tuned = t;
        console.log("trade #".concat(that.trade.id, " is ").concat(t ? 'tunned' : 'normal'));
      });
    }
  }, {
    key: "setTuneSpeed",
    value: function setTuneSpeed(s) {
      var trade = this.trade;
      $("#riskb_".concat(trade.id)).removeClass('basic');
      $("#corrida_smoothing_".concat(trade.id, "_buttons.tunespeed button")).removeClass('active');
      $("#corrida_smoothing_".concat(trade.id, "_buttons.tunespeed .").concat(s)).addClass('active');
      var $val = $("#corrida_smoothing_".concat(trade.id));
      var ss = crm.deal.TUNE_SPEED[s];
      $val.val(ss);
      return ss;
    }
  }, {
    key: "draw",
    value: function draw() {
      var isUpdate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var that = this;
      var trade = this.trade,
          $container = this.$container,
          auth = this.auth;
      var isForex = trade.type === 'forex';
      var profit = parseFloat(trade.profit) + parseFloat(isForex ? 0 : trade.amount);
      var profitPercent = profit / parseFloat(trade.invested); // if(!isUpdate)

      $container.html(''); // let $content = isUpdate?$container.find('.content:first'):$(`<div class="ui content scrolling"></div>`).appendTo($container);
      // let $header = isUpdate?$container.find('.header:first'):$(`<div class="header"></div>`).appendTo($content);

      var $content = $("<div class=\"ui content scrolling\"></div>").appendTo($container);
      var $header = $("<div class=\"header\"></div>").appendTo($content);
      $header.html("<i class=\"ui hcart line icon\"></i><code>#".concat(trade.id, "</code> ").concat(trade.instrument.title));
      var tradeAction = "<div class=\"ui negotive fluid message\">".concat(__('crm.trades.not_reopen'), " (").concat(trade.profit.dollars(), ")</div>");
      if (["10", "30", 10, 30].indexOf(trade.status_id) > -1) tradeAction = "<button class=\"ui icon red button right floated\" id=\"terminate_trade_".concat(trade.id, "\"><i class=\"close icon\"></i>").concat(__('crm.trades.terminate'), "</button>");else if (trade.status_id == 100 || trade.status_id == 20 && trade.profit <= 0) tradeAction = "<button class=\"ui icon olive button right floated\" id=\"reopen_trade_".concat(trade.id, "\"><i class=\"refresh icon\"></i>").concat(__('crm.trades.reopen'), "</button>");
      var $follow = '';

      if (trade.user.meta) {
        var m = getMeta(trade.user.meta, 'can_follow');

        if (m !== false) {
          var f = JSON.parse(m.meta_value);
          console.log('trade follow', m, f);
          $follow = "<tr>\n                    <td><i class=\"large user middle aligned icon\"></i></td>\n                    <td>".concat(__('crm.partner.following'), "</td>\n                    <td class=\"ui right aligned\"><a href=\"javascript:crm.user.card(").concat(f.partner, ")\">").concat(__('crm.partner.guru'), "</a></td>\n                </tr>");
        }
      }

      $content = $("<div class=\"ui stackable grid\"></div>").appendTo($content);
      var $left = $("<div class=\"column four wide left-column\">\n        <div class=\"ui items\">\n            <div class=\"ui item\">\n                <div class=\"ui tiny image\">\n                    ".concat(trade.type == 'forex' ? '<img src="/crm/images/forex.gif" style="width:40px"/>' : '<img src="/crm/images/xcryptex.webp" style="width:40px"/>', "\n                </div>\n                <div class=\"content right aligned\">\n                    <div class=\"header\">").concat(trade.type, "</div>\n                    <div class=\"description\">").concat(tradeAction, "</div>\n                </div>\n            </div>\n        </div>\n        <table class=\"ui relaxed table\">\n            <tr>\n                <td><i class=\"large user middle aligned icon\"></i></td>\n                <td>").concat(__('crm.customers.name'), "</td>\n                <td class=\"ui right aligned\"><a href=\"javascript:crm.user.card(").concat(trade.user.id, ")\">").concat(trade.user.title || '', "</a></td>\n            </tr>\n            ").concat($follow, "\n            <tr>\n                <td><i class=\"large industry middle aligned icon\"></i></td>\n                <td>").concat(__('crm.instruments.title'), "<br /><small>").concat(__('crm.trades.fee'), " ").concat(trade.instrument.commission.percent(), "</small></td>\n                <td class=\"right aligned\">\n                    <div class=\"ui item\">\n                        <a class=\"header\" onclick=\"crm.instrument.edit(").concat(trade.instrument.id, ")\"><code>#").concat(trade.instrument_id, "</code> ").concat(trade.instrument.title, "</a>\n                        <div class=\"meta\">").concat(trade.instrument.source.name, " <strong>").concat(trade.instrument.symbol, "</strong></div>\n                        <div class=\"content\">").concat(trade.direction > 0 ? "<i class=\"large arrow up middle aligned icon green\"></i> ".concat(__('crm.trades.buy')) : "<i class=\"large arrow down middle aligned icon red\"></i> ".concat(__('crm.trades.sell')), "</div>\n                    </div>\n                </td>\n            </tr>\n            <tr>\n                <td><i class=\"large leaf middle aligned icon\"></i></td>\n                <td><a class=\"header\"></a><div class=\"description\">").concat(__('crm.accounts.type'), "</div></td>\n                <td class=\"right aligned\">").concat(trade.account.type == 'real' ? __('crm.accounts.real') : __('crm.accounts.demo'), "</td>\n            </tr>\n            <tr>\n                <td><i class=\"large calendar middle aligned icon\"></i></td>\n                <td><a class=\"header\"></a><div class=\"description\">").concat(__('crm.trades.created_at'), "</div></td>\n                <td class=\"right aligned\"><div class=\"header\">").concat(trade.created_at.datetime({
        style: 'simple'
      }), "</div></td>\n            </tr>\n            ").concat(trade.status_id == 20 ? "<tr>\n                <td><i class=\"large calendar middle aligned icon\"></i></td>\n                <td><a class=\"header\"></a><div class=\"description\">".concat(__('crm.trades.closed_at'), "</div></td>\n                <td class=\"right aligned\"><div class=\"header\">").concat(trade.updated_at.datetime({
        style: 'simple'
      }), "</div></td>\n            </tr>") : '', "\n            ").concat(isForex ? "<tr>\n                    <td><i class=\"large dollar middle aligned icon\"></i></td>\n                    <td><a class=\"header\"></a><div class=\"description\">".concat(__('crm.trades.contract'), "</div></td>\n                    <td class=\"right aligned\">\n                        <div class=\"header\">").concat(trade.invested.dollars(), " <sup>x</sup><small class=\"multiplier\"></small></div>\n                        volume: ").concat(trade.volume || '0', "\n                    </td>\n                </tr>") : "<tr>\n                    <td><i class=\"large dollar middle aligned icon\"></i></td>\n                    <td><a class=\"header\"></a><div class=\"description\">".concat(__('crm.trades.invested'), "</div></td>\n                    <td class=\"right aligned\">\n                        <div class=\"header\">").concat(trade.invested.dollars(), " <sup>x</sup><small class=\"multiplier\"></small></div>\n                        fee: ").concat(trade.fee.dollars() || '0', "\n                    </td>\n                </tr>"), "\n            <tr>\n                <td><i class=\"large circle middle aligned icon\"></i></td>\n                <td>").concat(__('crm.trades.status'), "</td>\n                <td class=\"right aligned\">").concat(trade.status.name, "</td>\n            </tr>\n            <tr>\n                <td><i class=\"large circle middle aligned icon\"></i></td>\n                <td>").concat(trade.status_id == 30 ? __('crm.trades.atp') : __('crm.trades.open_price'), "</td>\n                <td class=\"right aligned open-price\"></td>\n            </tr>\n            <tr>\n                <td><i class=\"large circle middle aligned icon\"></i></td>\n                <td>").concat(trade.status_id == 20 ? __('crm.trades.close_price') : __('crm.trades.current_price'), "</td>\n                <td class=\"right aligned ").concat(trade.status_id == 20 ? '' : 'current', "\" id=\"current_price_").concat(trade.id, "\" number=\"").concat(trade.close_price || '0', "\">").concat(trade.close_price || '0', "</td>\n            </tr>\n            <tr>\n                <td><i class=\"large circle middle aligned icon\"></i></td>\n                <td>").concat(__('crm.trades.tp'), "</td>\n                <td class=\"right aligned stop-high\"></td>\n            </tr>\n            <tr>\n                <td><i class=\"large circle middle aligned icon\"></i></td>\n                <td>").concat(__('crm.trades.sl'), "</td>\n                <td class=\"right aligned stop-low\"></td>\n            </tr>\n            <tr>\n                <td><i class=\"large dollar middle aligned icon\"></i></td>\n                <td><div class=\"description\">").concat(__('crm.trades.profit'), "</div></td>\n                <td class=\"right aligned\"><div class=\"ui item\">\n                    <div class=\"header ").concat(trade.status_id == 10 ? 'profit' : '', "\" id=\"current_profit_").concat(trade.id, "\">").concat(profit.dollars(), "</div>\n                    <div class=\"description ").concat(trade.status_id == 10 ? 'percent' : '', "\" id=\"current_percent_").concat(trade.id, "\">").concat(profitPercent.percent(), "</div>\n                </div></td>\n            </tr>\n        </table>\n        <div class=\"ui horizontal divider\">").concat(__('crm.trades.day_swap'), "</div>\n        </div>")).appendTo($content);
      $left.find('.stop-low').append(auth.can.retention ? new _components__WEBPACK_IMPORTED_MODULE_1__["VUIEditable"]('/deal/' + trade.id, 'stop_low', trade.stop_low) : trade.stop_low || '0');
      $left.find('.stop-high').append(auth.can.retention ? new _components__WEBPACK_IMPORTED_MODULE_1__["VUIEditable"]('/deal/' + trade.id, 'stop_high', trade.stop_high) : trade.stop_high || '0');
      $left.find('.open-price').append(auth.can.retention ? new _components__WEBPACK_IMPORTED_MODULE_1__["VUIEditable"]('/deal/' + trade.id, 'open_price', trade.open_price) : trade.open_price || '0');
      $left.find('.multiplier').append(auth.can.retention ? new _components__WEBPACK_IMPORTED_MODULE_1__["VUIEditable"]('/deal/' + trade.id, 'multiplier', trade.multiplier) : trade.multiplier || '1');
      console.debug('assign buttons ', $left.find("#terminate_trade_".concat(trade.id)), $left.find("#reopen_trade_".concat(trade.id)));
      $left.find("#terminate_trade_".concat(trade.id)).on('click', this.terminate);
      $left.find("#reopen_trade_".concat(trade.id)).on('click', this.reopen);
      var $dayswap = $("<table class=\"ui relaxed table\"></table").appendTo($left);
      trade.user.meta.map(function (meta, i) {
        var re = new RegExp("trade#".concat(trade.id, "_swap_(\\d+)"));
        var ms = re.exec(meta.meta_name);
        if (ms && ms.length) $("<tr><td><i class=\"calendar icon\"></i>".concat(ms[1].datetime({
          style: 'simple'
        }), "</td><td>").concat(meta.meta_value.dollars(), "</td></tr>")).appendTo($dayswap);
      });
      var $right = $("<div class=\"column ".concat(trade.status_id == 20 || trade.multiplier < 50 ? 'twelve' : 'nine', " wide right-column\"></div>")).appendTo($content);
      $("<div class=\"ui header\">".concat(__('crm.dealchart'), "</div>")).appendTo($right);
      window["trade_chart_".concat(trade.id)] = this.chart;
      $("<div class=\"loadering\" data-action=\"/data/histominute/1?instrument_id=".concat(trade.instrument.id, "&user_id=").concat(auth.id, "&limit=16\" data-autostart=\"true\" data-need-loader=\"true\" data-function=\"trade_chart_").concat(trade.id, "\"><canvas id=\"chart_").concat(trade.id, "_instrument_price\" class=\"chart\" width=\"640\" height=\"360\"></canvas></div>")).appendTo($right);

      if (auth.can.tune && trade.status_id != 20 && trade.multiplier >= 50) {
        $right = $("<div class=\"column three wide\"></div>").appendTo($content);
        var $tune = $("<div class=\"ui header\">".concat(__('crm.trades.tune'), "</div>\n            <div class=\"ui horizontal divider\">").concat(__('crm.deal.tune_corrida'), "</div>\n            <div class=\"ui form corrida\">\n                <div class=\"field\">\n                    <div class=\"ui checkbox slider\" id=\"riskon_").concat(trade.id, "\">\n                        <input type=\"checkbox\" data-name=\"riskon\" value=\"\"/>\n                        <label>").concat(__('crm.trades.tuneon'), "</label>\n                    </div>\n                </div>\n                <div class=\"field\">\n                    <div class=\"ui checkbox\" id=\"onclose_").concat(trade.id, "\">\n                        <input type=\"checkbox\" data-name=\"onclose\" value=\"\" disabled=\"disabled\"/>\n                        <label>").concat(__('crm.deal.onclose'), "</label>\n                    </div>\n                </div>\n                <div class=\"fields\">\n                    <div class=\"field\">\n                        <label>").concat(__('crm.trades.tunespeed'), "</label>\n                        <input type=\"hidden\" data-name=\"smoothing\" id='corrida_smoothing_").concat(trade.id, "' value=\"0.000025\"/>\n                        <div class=\"ui basic buttons tunespeed\" id=\"corrida_smoothing_").concat(trade.id, "_buttons\">\n                            <button data-value=\"slow\" class=\"ui slow button active\">").concat(__('crm.trades.tunespeed_slow'), "</button>\n                            <button data-value=\"normal\" class=\"ui normal button\">").concat(__('crm.trades.tunespeed_normal'), "</button>\n                            <button data-value=\"fast\" class=\"ui fast button\">").concat(__('crm.trades.tunespeed_fast'), "</button>\n                        </div>\n                    </div>\n                </div>\n\n                <input type=\"hidden\" data-name=\"high\" id='risk_high_").concat(trade.id, "' value=\"\"/>\n                <input type=\"hidden\" data-name=\"low\" id=\"risk_low_").concat(trade.id, "\" step=\"1\" min=1 max=\"10\" value=\"1\"/>\n            </div>\n            <div class=\"ui horizontal divider\">Approximate values</div>\n            <table class=\"ui table relaxed predictions\" id=\"predictions_").concat(this.trade.id, "\">\n                <tbody>\n                    <tr><td>Reach instrument price</td><td class=\"right aligned\"><strong></strong></td></tr>\n                    <tr><td>Profit</td><td class=\"right aligned\"><strong></strong><br /><small></small></td></tr>\n                    <tr><td>Duration</td><td class=\"right aligned\"></td></tr>\n                </tbody>\n            </table>\n            <div class=\"field right floated\">\n                <button class=\"ui button basic primary corida-set-button\" id=\"riskb_").concat(this.trade.id, "\">Set</button>\n            </div>")).appendTo($right);
        $tune.find('.tunespeed button').on('click', function () {
          var s = $(this).data('value');
          that.setTuneSpeed(s);
        });
        $tune.find("#onclose_".concat(trade.id, " input, #riskon_").concat(trade.id)).on('change', function () {
          that.handleChange();
        });
      }

      skymechanics.reload();
    }
  }]);

  return Trade;
}(_components_card__WEBPACK_IMPORTED_MODULE_0__["Card"]);
var Corrida =
/*#__PURE__*/
function () {
  function Corrida(chart, trade) {
    _classCallCheck(this, Corrida);

    this.tuned = false;
    this.chart = chart;
    this.trade = trade;
    this.corrida = null;
    this.render = this.render.bind(this);
    this.read = this.read.bind(this);
    this.send = this.send.bind(this);
    this.sendRaw = this.sendRaw.bind(this);
    this.set = this.set.bind(this);
    this.data = this.data.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getTuneData = this.getTuneData.bind(this);
    $("#riskb_".concat(this.trade.trade.id)).on('click', this.handleClick);
    $("#riskon_".concat(this.trade.trade.id)).on('change', this.handleChange);
    this.TUNE_SPEED = {
      slow: 0.0001,
      normal: 0.0005,
      fast: 0.0012
    };
    this.smoothing = this.TUNE_SPEED.normal;
  }

  _createClass(Corrida, [{
    key: "handleClick",
    value: function handleClick() {
      this.data();
    }
  }, {
    key: "handleChange",
    value: function handleChange() {
      var trade = this.trade.trade;
      console.debug('riskon changed'); // $(`.corida-set-button_${trade.id}`).removeClass('basic');

      if ($("#riskon_".concat(trade.id)).checkbox('is checked')) {
        $("#smoothing_".concat(trade.id, ",#risk_high_").concat(trade.id, ",#risk_low_").concat(trade.id)).closest('.ui.input').removeClass('disabled');
        $("#risk_high_".concat(trade.id, ":not(.initialized)")).val(parseFloat(trade.open_price)).addClass('initialized');
        var rr = crm.deal.dataRange ? crm.deal.dataRange : SUPPORT_LINE_RANGE;
        this.chart.setSupport(trade.open_price, rr, this.render);
        socket.emit('subscribe', {
          subscriptId: this.trade.user_id
        }); // this.getTuneData().then( (values) => {
        //     const tuneData = {
        //         label: __("crm.trade.tuning"),
        //         data: values,
        //         borderColor: 'rgba(30,37,41,.8)',
        //     };
        //     // if(tuneData.length) {
        //         console.debug('tuned data',tuneData);
        //         socket.emit('subscribe', {subscriptId: this.trade.user_id});
        //         this.chart.addDataset(tuneData);
        //     // }
        // }).catch((x)=>{console.warn('getTuneData:',x)});
      } else {
        $("#smoothing_".concat(trade.id, ",#risk_high_").concat(trade.id, ",#risk_low_").concat(trade.id)).closest('.ui.input').addClass('disabled'); // socket.emit('unsubscribe', {subscriptId: this.trade.user_id});

        this.chart.removeSupports(); // this.chart.removeDataset(1);
      }
    }
  }, {
    key: "render",
    value: function render(level, r) {
      var trade = this.trade.trade;
      var oldlevel = $("#risk_high_".concat(trade.id)).val();
      if (oldlevel != level) $("#riskb_".concat(trade.id)).removeClass('basic');
      $("#risk_high_".concat(trade.id)).val(level);
      $("#risk_low_".concat(trade.id)).val(r);
      var open = parseFloat(trade.close_price);
      var $aprox = $("#predictions_".concat(trade.id, ".predictions tbody")); // console.debug('render',$aprox.find('tr:eq(0) td:eq(1) strong'),open);

      if (isNaN(open)) return;
      var res = this.trade.calculate(level);
      var speedy = parseFloat($("#corrida_smoothing_".concat(trade.id)).val());
      var duration = parseInt(10 * Math.abs(1 - open / level) / speedy);
      console.debug(duration);
      $aprox.find('tr:eq(0) td:eq(1) strong').html(level.toFixed(5));
      $aprox.find('tr:eq(1) td:eq(1) strong').html(res.profit.digit(2));
      $aprox.find('tr:eq(1) td:eq(1) small').html(res.percent.percent());
      $aprox.find('tr:eq(2) td:eq(1)').prop('value', duration);
      skymechanics.countdown($aprox.find('tr:eq(2) td:eq(1)'));
    }
  }, {
    key: "read",
    value: function read() {
      var _this2 = this;

      var tuned = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var trade = this.trade.trade;
      var that = this;
      this.getTuneData().then(function (values) {
        var tuneData = {
          label: __("crm.trade.tuning"),
          data: values,
          borderColor: 'rgba(30,37,41,.8)'
        };
        console.debug('tuned data', tuneData);

        if (values.length) {
          socket.emit('subscribe', {
            subscriptId: _this2.trade.user_id
          });

          _this2.chart.addDataset(tuneData);
        }
      })["catch"](function (x) {
        console.warn('getTuneData:', x);
      });
      $.ajax({
        url: '/json/user/meta',
        dataType: "json",
        data: {
          meta_name: 'user_tune_corida_#' + trade.instrument_id,
          user_id: trade.user_id
        },
        success: function success(d, x, s) {
          if (typeof d.meta_value != "undefined") {
            that.set(JSON.parse(d.meta_value));
            if (tuned && typeof tuned == 'function') tuned(that.tuned);
          } else {
            that.set({
              riskon: 0
            });
          }
        }
      });
    }
  }, {
    key: "send",
    value: function send(dd) {
      var trade = this.trade.trade;
      var that = this;
      $.ajax({
        url: '/json/user/meta',
        dataType: "json",
        data: {
          meta_name: 'user_tune_corida_#' + trade.instrument_id,
          user_id: trade.user_id
        },
        success: function success(d, x, s) {
          if (typeof d.meta_value != "undefined") {
            var corr = JSON.parse(d.meta_value);
            dd.gone = corr.gone ? corr.gone : 0;
            dd.deal_id = corr.deal_id ? corr.deal_id : trade.id;
            console.debug('update corrida', corr, dd);
            that.sendRaw(dd);
          } else {
            dd.gone = 0;
            dd.deal_id = trade.id;
            console.debug('set corrida', dd);
            that.sendRaw(dd);
          }
        }
      });
    }
  }, {
    key: "sendRaw",
    value: function sendRaw(dd) {
      var trade = this.trade.trade;
      var that = this;
      $.ajax({
        url: '/json/user/meta',
        dataType: "json",
        data: {
          meta_name: 'user_tune_corida_#' + trade.instrument_id,
          meta_value: JSON.stringify(dd),
          user_id: trade.user_id
        },
        success: function success(d, x, s) {
          if (typeof d.meta_value != "undefined") that.set(JSON.parse(d.meta_value));else {
            that.set({
              riskon: 0
            });
          }
        }
      });
    }
  }, {
    key: "set",
    value: function set(c) {
      var trade = this.trade.trade;
      var gp = (c.high + "").split("."),
          precision = gp[1] != undefined ? gp[1].length : 1;
      precision = precision > 5 ? 5 : precision;
      $("#risk_high_".concat(trade.id)).val(c.high);
      $("#risk_low_".concat(trade.id)).val(c.low);

      if (c.smoothing && this.trade) {
        this.trade.setTuneSpeed(parseFloat(c.smoothing));
      }

      if (c.low && this.trade) {
        var val = parseFloat(c.low);
        var speedName = 'normal';
        console.debug('button speed tune settings', this.TUNE_SPEED, val);

        for (var i in this.TUNE_SPEED) {
          console.debug('button speed', this.TUNE_SPEED, val, i);

          if (this.TUNE_SPEED[i] == val) {
            speedName = i;
            break;
          }
        }

        this.trade.setTuneSpeed(speedName);
      }

      if (c.riskon == '1') {
        this.tuned = true;
        $("#risk_high_".concat(trade.id)).addClass('initialized');
        $("#smoothing,#risk_high,#risk_low_".concat(trade.id)).closest('.ui.input').removeClass('disabled');

        if (c.onclose && c.onclose === 1) {
          $("#onclose_".concat(trade.id)).checkbox('set checked');
        }

        var range = parseFloat(c.low);
        var level = parseFloat(c.high); // range = level*range/100;
        // crm.deal.TUNE_SPEED[s]

        var rr = crm.deal.dataRange ? crm.deal.dataRange : SUPPORT_LINE_RANGE;
        this.chart.setSupport(level, rr, this.render);
        this.render(level, rr);
        $("#riskon_".concat(trade.id)).checkbox('set checked');
        $("#riskb_".concat(trade.id)).addClass('basic');
      } else {
        this.chart.removeSupports();
        $("#smoothing,#risk_high,#risk_low_".concat(trade.id)).closest('.ui.input').addClass('disabled');
        $("#riskon_".concat(trade.id)).checkbox('set unchecked');
      }

      crm.deal.touch();
    }
  }, {
    key: "change",
    value: function change(max, min) {// $('#risk_high').val(max);
      // $('#risk_low').val(min);
      //
      // if (parseInt($('#riskon').val()) == 1) {
      //     this.send({
      //         riskon: 1,
      //         high: max,
      //         low: 0.5,
      //         onclose:$('#onclose').is('checked')?1:0
      //     });
      // }
    }
  }, {
    key: "data",
    value: function data() {
      var trade = this.trade.trade;
      var max = parseFloat($("#risk_high_".concat(trade.id)).val()),
          min = parseFloat($("#risk_low_".concat(trade.id)).val()),
          ro = $("#riskon_".concat(trade.id)).checkbox('is checked') ? 1 : 0;
      $('[data-name=onclose]').prop('disabled', false);
      $("#riskb_".concat(trade.id)).addClass('basic');
      this.trade.tuned = ro == 1; // const rr = crm.deal.dataRange?crm.deal.dataRange:SUPPORT_LINE_RANGE;

      var rr = $("#corrida_smoothing_".concat(trade.id)).val();
      var cd = {
        riskon: ro,
        high: max,
        low: rr,
        onclose: $("#onclose_".concat(trade.id)).checkbox('is checked') ? 1 : 0,
        deal_id: this.trade.id
      };
      console.debug('new corrida val', cd);
      this.send(cd);
    }
  }, {
    key: "getTuneData",
    value: function getTuneData() {
      var trade = this.trade.trade;
      var time = new Date().getTime() - 360000;
      var endpoint = "/data/histominute/1?instrument_id=".concat(trade.instrument_id, "&user_id=").concat(trade.user_id, "&date_from=").concat(time, "&limit=16");
      return new Promise(function (resolve, reject) {
        $.ajax({
          url: endpoint,
          success: function success(d) {
            var data = [];
            d.map(function (row, i) {
              var dt = new Date(row.time * 1000);
              var level = parseFloat(row.close);
              data.push({
                x: dt,
                y: level
              });
            });
            resolve(data);
          },
          error: function error(x) {
            reject(x);
          }
        });
      });
    }
  }]);

  return Corrida;
}();

/***/ }),

/***/ "./resources/assets/js/modules/user.js":
/*!*********************************************!*\
  !*** ./resources/assets/js/modules/user.js ***!
  \*********************************************/
/*! exports provided: Users */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Users", function() { return Users; });
/* harmony import */ var _user_user__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./user/user */ "./resources/assets/js/modules/user/user.js");
/* harmony import */ var _core_defer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/defer */ "./resources/assets/js/core/defer.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



var Users =
/*#__PURE__*/
function () {
  function Users() {
    _classCallCheck(this, Users);

    this._data = {};
    this.current = null;
    this.kyc = {
      accept: function accept(doc, user_id) {
        var $c = $('#kyc_' + user_id + '_' + doc);
        $.ajax({
          url: '/user/kyc/' + doc + '/update/verified',
          success: function success() {
            $c.find('.verified').fadeIn();
          }
        });
      },
      decline: function decline(doc, user_id) {
        var $c = $('#kyc_' + user_id + '_' + doc);
        $.ajax({
          url: '/user/kyc/' + doc + '/update/declined',
          success: function success() {
            $c.fadeOut();
          }
        });
      },
      "delete": function _delete(doc, user_id) {
        var $c = $('#kyc_' + user_id + '_' + doc);
        $.ajax({
          url: "/user/kyc/".concat(doc, "/delete"),
          success: function success() {
            $c.remove();
          }
        });
      }
    };
    this.calendar = {
      init: function init(id) {
        scheduler.config.xml_date = "%Y-%m-%d %H:%i";

        scheduler.templates.week_date_class = function (date, today) {
          if (date.getDay() == 0 || date.getDay() == 6) return "weekday";
          return "";
        };

        scheduler.init(id, new Date(2018, 0, 13), "week");
        scheduler.load("./Scheduler/data/events.xml");
      }
    };
    this.tune = {
      getcurdata: function getcurdata() {
        var v = $("#user_chart_tune").text().replace(/%/i, "");
        v = isNaN(v) ? 0 : parseInt(v);
        return {
          tune: v,
          user: crm.user.current
        };
      },
      setcurdata: function setcurdata(v) {
        $("#user_chart_tune").text(v.tune + '%');
      },
      send: function send(v) {
        var chart;
        $.ajax({
          url: '/json/user/meta',
          dataType: "json",
          data: {
            meta_name: 'user_chart_tune',
            meta_value: v.tune,
            user_id: v.user
          },
          success: function success(d) {
            graphControl.makeChart(6000, "user_chart", v.user, chart);
          }
        });
      },
      up: function up() {
        var d = this.getcurdata();
        if (d.tune < 0) d.tune = 5;else if (d.tune <= 10) d.tune += 5;
        this.send(d);
        this.setcurdata(d);
      },
      real: function real() {
        var d = this.getcurdata();
        d.tune = 0;
        this.send(d);
        this.setcurdata(d);
      },
      down: function down() {
        var d = this.getcurdata();
        if (d.tune > 0) d.tune = -5;else if (Math.abs(d.tune) <= 10) d.tune -= 5;
        this.send(d);
        this.setcurdata(d);
      }
    };
    this.mail = {
      choose: function choose(that) {
        var val = $(that).val(),
            form = $('.mail-params'),
            findOrSet = function findOrSet(n, v) {
          form.find("[data-name=\"".concat(n, "\"]")).length ? form.find("[data-name=\"".concat(n, "\"]")).val(v) : form.append("<input type=\"hidden\" data-name=\"".concat(n, "\" value=\"").concat(v, "\"/>"));
        };

        switch (val) {
          case 'yandex':
            findOrSet('mail.imap.host', 'imap.yandex.ru');
            findOrSet('mail.imap.port', 993);
            findOrSet('mail.imap.encryption', 'ssl');
            findOrSet('mail.smtp.host', 'smtp.yandex.ru');
            findOrSet('mail.smtp.port', 465);
            findOrSet('mail.smtp.encryption', 'ssl');
            break;

          case 'gmail':
            findOrSet('mail.imap.host', 'imap.gmail.com');
            findOrSet('mail.imap.port', 993);
            findOrSet('mail.imap.encryption', 'ssl');
            findOrSet('mail.smtp.host', 'smtp.gmail.com'); //'smtp.gmail.com', 465, 'ssl'

            findOrSet('mail.smtp.port', 465);
            findOrSet('mail.smtp.encryption', 'ssl');
            break;
        }

        $('.mail-params').slideDown();
      }
    };
    this.data = {};
    this.info = this.info.bind(this);
    this.reload = this.reload.bind(this);
    this.adminTreeCollapsed = {};
    this.admintree = this.admintree.bind(this);
    this.card = this.card.bind(this);
    this.list = this.list.bind(this);

    this.__loaded();
  }

  _createClass(Users, [{
    key: "card",
    value: function card(id) {
      var tab = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "kyc";
      var that = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var users = crm.user._data;
      var lastIcon = that ? $(that).html() : null;
      if (that) $(that).html("<i class=\"ui circle notched loading icon\"></i>"); // //console.debug(id,id instanceof $)

      if (id instanceof $) {
        var list = [];
        id.each(function () {
          var id = $(this).attr('data-id');
          var ucard = new _user_user__WEBPACK_IMPORTED_MODULE_0__["User"](users[id], tab);
          list.push(ucard);
          $(this).prop('checked', false);
        });
        cardContainer.append(list).then(function () {
          $(that).html(lastIcon);
        });
        return;
      }

      users[id] ? cardContainer.append(new _user_user__WEBPACK_IMPORTED_MODULE_0__["User"](users[id], tab)).then(function () {
        $(that).html(lastIcon);
      }) : this.info(id, tab);
    }
  }, {
    key: "info",
    value: function info(id) {
      var tab = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "kyc";
      var that = this;
      if (id == undefined) return;

      if (that._data[id]) {
        cardContainer.append(new _user_user__WEBPACK_IMPORTED_MODULE_0__["User"](that._data[id], tab));
        return;
      } else {
        $.ajax({
          url: "/json/user/" + id,
          dataType: "json",
          data: {
            tab: tab
          },
          success: function success(d, x, s) {
            that._data[id] = d;
            cardContainer.append(new _user_user__WEBPACK_IMPORTED_MODULE_0__["User"](that._data[id], tab));
          }
        });
        return;
      }

      this.current = id;
      var $dash = page.modalPreloaderStart("user_".concat(id, "_dashboard"));
      $.ajax({
        url: "/html/user/" + id,
        dataType: "html",
        data: {
          tab: tab
        },
        success: function success(d, x, s) {
          if (d == "false" || d == false) {
            $dash.html("<div class=\"header\">Access denied</div><div class=\"content\"></div>");
          }

          page.modalPreloaderEnd($dash, d, true);
        }
      });
    }
  }, {
    key: "reload",
    value: function reload() {
      var id = this.current;
      var tab = $("#user_".concat(id, "_dashboard .tabular .item.active")).attr('data-tab'); //console.debug('crm user reload',this.current,tab);

      var $dash = page.modalPreloaderStart("user_".concat(id, "_dashboard"));
      $.ajax({
        url: "/html/user/" + id,
        dataType: "html",
        data: {
          tab: tab
        },
        success: function success(d, x, s) {
          if (d == "false" || d == false) {
            $dash.html("<div class=\"header\">Access denied</div><div class=\"content\"></div>");
          }

          page.modalPreloaderEnd($dash, d, true);
        }
      });
    }
  }, {
    key: "__loaded",
    value: function __loaded() {
      $('#body_event_trigger').trigger('crm.user::loaded');
    }
  }, {
    key: "accountsTouch",
    value: function accountsTouch(d, $c) {
      cf.touch('user-accounts');
    }
  }, {
    key: "showManager",
    value: function showManager(manager) {
      var title = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Manager';
      if (!manager) return '';
      return  true ? '<a href="javascript:crm.user.card(' + manager.id + ')">' + manager.title + "</a>" : undefined;
    }
  }, {
    key: "showCustomer",
    value: function showCustomer(row) {
      var c2c = undefined;

      if (system.telephony) {
        for (var i in system.telephony.get()) {
          var tel = system.telephony.list[i];
          var userExt = crm.user.getMeta(system.user.meta, tel.name + '_ext');
          c2c = c2c ? c2c : '';
          if (userExt.length && tel.enabled == "1") c2c += '<br><small><i class="icon phone"></i><a href="javascript:crm.telephony.link(' + i + ',\'' + userExt + '\',\'' + row.phone + '\')" target="_blank">' + row.phone + '</a></small>';
        }
      }

      var country = "<br><small><i class=\"icon world\"></i>".concat(crm.user.getMeta(row.meta, 'country'), "</small>");
      return "<code>#".concat(row.id, "</code>\n            <a onclick=\"crm.user.card(").concat(row.id, ")\">").concat(row.title, "</a>&nbsp;&nbsp;\n            <small><i class=\"icon mail") + (row.email_verified == "1" ? '' : ' outline') + '"></i>' + row.email + '</small>' + (c2c || '<br><small><i class="icon phone"></i>' + row.phone + '</small>') + "".concat(country);
    }
  }, {
    key: "accounts",
    value: function accounts($c, d) {
      $c.html('');

      for (var i in d) {
        var account = d[i],
            $i = $('<div class="item"></div>').appendTo($c);
        $i.append('<div class="ui tiny image"><i class="ic ic_' + account.currency.code.toLowerCase() + '"></i></div>');
        $('<div class="content"></div>').appendTo($i).append('<div class="header">' + account.type + '</div>').append('<div class="description">' + account.amount.currency() + '</div>').append('<div class="extra">' + '<div class="submiter" data-action="/account/' + account.id + '" data-method="delete" data-callback="crm.user.accountsTouch"><input type="hidden" data-name="_token" value="' + window.Laravel.csrfToken + '"/><div class="ui right floated red button submit"><i class="times icon"></i>Close</div></div>' + (account.status == 'open' ? '<i class="green check icon"></i>' : '<i class="grey times icon"></i>') + account.status + '</div>');
      }

      cf.reload();
    }
  }, {
    key: "added",
    value: function added(d, $c) {
      if (d.error) {
        alert(d.message);
      } else {
        crm.user.touch();
        $c.modal('hide');
      }
    }
  }, {
    key: "online",
    value: function online($c, d) {
      var onlineCounts = 0,
          $l = $c.find('.label'),
          $s = $c.find('.menu');
      $s.html(''); // //console.debug('Online users',$l, $s, d);

      d.map(function (row, i) {
        $s.append("<a class=\"item\" onclick=\"crm.user.card(".concat(row.id, ")\"><i class=\"user") + (row.rights_id > 1 ? ' circle' : '') + " icon\"></i>&nbsp;".concat(row.title, "</a>"));
        onlineCounts++;
      });
      $l.text(onlineCounts);

      if (onlineCounts) {
        $c.show();
        $l.show();
      } else $c.hide();
    }
  }, {
    key: "getMeta",
    value: function getMeta(l, n) {
      var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'string';
      var ret = false;

      for (var i in l) {
        var m = l[i];

        if (m.meta_name == n) {
          ret = m.meta_value;
          break;
        }
      }

      if (ret) {
        try {
          switch (type) {
            case 'json':
              ret = JSON.parse(ret);
              break;
          }
        } catch (e) {
          console.error('cast data error', type, ret, e);
        }
      }

      return ret ? ret : '';
    }
  }, {
    key: "adminTouch",
    value: function adminTouch() {
      cf.touch('admin-tree');
      cf.touch('admin-list');
    }
  }, {
    key: "touch",
    value: function touch() {
      cf.touch('admin-tree');
      cf.touch('user-list');
      cf.touch('user-log');
      cf.touch('deal-list');
      cf.touch('user-accounts');
      cf.touch("user-finance-".concat(crm.user.current));
      $('#customers_count').text(crm.user.data.total);
    }
  }, {
    key: "showList",
    value: function showList(opts) {
      $.ajax({
        url: '/html/user',
        dataType: "html",
        data: opts,
        success: function success(d, x, s) {
          var container = $(d).appendTo('body');
          cf.reload();
          cf._loaders['user-list'].opts.data = {}; // cf._loaders['user-list'].execute();

          for (var i in opts) {
            container.find('[data-name="' + i + '"]').val(opts[i]).change();
          }
        }
      });
      return;
    }
  }, {
    key: "list",
    value: function list(container, d, x, s) {
      var _this = this;

      crm.user.data = d;
      var rights = parseInt($('[data-id=user-rights]').val()),
          showBalances = rights < 2 ? true : false;

      if (!showBalances) {
        $('#users .client-only').hide();
        $('#users .notclient-only').show();
      } else {
        $('#users .client-only').show();
        $('#users .notclient-only').hide();
      } // //console.debug(rights,showBalances);


      container.html('');

      var _loop = function _loop() {
        var row = d.data[i],
            tr = $('<tr data-class="user" data-id="' + row.id + '"></tr>').appendTo(container),
            c2c = undefined;
        _this._data[row.id] = row;

        if (system.telephony) {
          for (var _i in system.telephony.get()) {
            var tel = system.telephony.list[_i],
                userExt = crm.user.getMeta(system.user.meta, tel.name + '_ext');
            c2c = c2c ? c2c : '';
            if (userExt.length && tel.enabled == "1") c2c += '<br><small><i class="icon phone"></i><a href="javascript:crm.telephony.link(' + _i + ',\'' + userExt + '\',\'' + row.phone + '\')" target="_blank">' + row.phone + '</a></small>';
          }
        }

        tr.append('<td><div class="ui checkbox"><input type="checkbox" class="bulker" data-name="user_selected" value="user_' + row.id + '" data-id="' + row.id + '" /><label></label></div></td>' + '<td class="center aligned">' + dateFormat(row.created_at) + '</td>' + '<td>' + crm.user.showCustomer(row) + '</td>');
        var $td1 = $("<td class=\"ui right aligned\"></td>").appendTo(tr);
        new _core_defer__WEBPACK_IMPORTED_MODULE_1__["Defer"](row, 'user', function (row) {
          $td1.html(row.balance.currency('USD', 2));
          var $td = $("<td class=\"ui right aligned\"></td>").appendTo(tr);
          var kyc = crm.user.getMeta(row.meta, 'kyc');

          switch (kyc) {
            case "true":
            case "2":
              kyc = '<i class="hourglass full icon helper" data-html="KYC status:&lt;b&gt;Full&lt;/b&gt;"></i>';
              break;

            case "1":
              kyc = '<i class="hourglass half icon helper" data-html="KYC status:&lt;b&gt;Partial&lt;/b&gt;"></i>';
              break;

            default:
              kyc = '<i class="hourglass empty icon helper" data-html="KYC status:&lt;b&gt;None&lt;/b&gt;"></i>';
              break;
          }

          $td.html((row.rights ? row.rights.title : '') + '<br/><small>' + (row.status ? row.status.title : '') + '</small>' + '<br/>KYC: ' + kyc + '</td>');
          $td = $("<td class=\"ui right aligned\"></td>").appendTo(tr);
          var campaign = decodeURI(crm.user.getMeta(row.meta, 'campaign'));

          try {
            campaign = JSON.stringify(JSON.parse(campaign), null, 2);
          } catch (e) {}

          var ftd = crm.user.getMeta(row.meta, 'ftd', 'json');
          var comment = row.comments && row.comments.length ? row.comments[0] : false;
          var commentRow = comment !== false ? "<b>Last comments:</b><i><p>".concat(comment.comment, "</p></i><br/><small>").concat(dateFormat(comment.created_at, false, 'simple'), "</small><br/>") : '';
          $td.html(crm.user.showManager(row.manager) + '<br/><small>' + (row.manager ? crm.user.getMeta(row.manager.meta, 'office') : '') + '</small>' + '<br/>' + crm.user.showManager(row.affilate, 'Affilate') + "<br/>".concat(commentRow) + (campaign ? '<br/><b>Campaign:</b> <pre>' + campaign + '</pre>' : '') + (row.source ? "<br/><small>Source: ".concat(row.source, "</small>") : '') + (ftd && ftd.amount ? "<br>FTD: " + crm.user.showManager(ftd.manager, 'FTD') + "&nbsp; " + ftd.amount.dollars() : ''));
          tr.append('<td class="center aligned">' + dateFormat(parseInt(crm.user.getMeta(row.meta, 'last_login'))) + '<br>' + crm.user.getMeta(row.meta, 'last_login_ip') + '</td>');
        }, 'meta');
      };

      for (var i in d.data) {
        _loop();
      }

      container.visibility({
        initialCheck: false,
        // continuous:true,
        once: false,
        onTopVisible: function onTopVisible(calculations) {////console.debug('Top',calculations)
        },
        onTopPassed: function onTopPassed(calculations) {//console.debug('Top passed',calculations)
        },
        onBottomVisible: function onBottomVisible(calculations) {//console.debug('onBottomVisible',calculations)
        }
      });
      page.paginate(d, 'user-list', container, "<div class=\"ui basic icon button open-in-cards\" onclick=\"crm.user.card($('[data-name=user_selected]:checked'),'kyc',this)\" style=\"display:none;\"><i class=\"address card outline icon\"></i> ".concat(__('crm.open_in_cards'), "</div>"));
      container.find('[data-name=user_selected]').on('click change keyup', function (e) {
        if ($('[data-name=user_selected]:checked').length) {
          $('.user.bulk').show();
          $('.open-in-cards').show(); // skymechanics.reload();
        } else {
          $('.user.bulk').hide();
          $('.open-in-cards').hide();
        }
      });
      container.parent().parent().find('.form #sendMail:not(.bulk.assigned)').on('click', function () {
        var mail = $(this).closest('.form').find('#mailsTemplate').dropdown('get value'),
            val = $(this).closest('.form').find('#mailsText').val();
        $('[data-name=user_selected]').each(function () {
          var id = $(this).attr('data-id'),
              $that = $(this).parent();

          if ($that.checkbox('is checked') && id) {
            //console.debug('sending mail [' + mail +', ' + val + '] to ' + id);
            $.ajax({
              url: '/mail/send',
              data: {
                user_id: id,
                sender_id: system.user.id,
                mail_id: mail,
                text: val
              },
              success: function success() {
                $that.checkbox('uncheck');
              }
            });
          }
        }).promise().done(function () {
          crm.mail.touch();
        });
      }).addClass('assigned');
      $('[data-name=search]:visible').each(function () {
        var $that = $(this),
            keyword = $that.val(); // //console.debug('search field need mark',keyword,$("table:visible tbody tr td").length);

        $("table:visible tbody tr td").unmark({
          done: function done() {
            $("table:visible tbody tr td").mark(keyword, {});
          }
        });
      });
    }
  }, {
    key: "admins",
    value: function admins(container, d, x, s) {
      var rights = parseInt($('[data-id=user-rights]').val()); // //console.debug(rights,showBalances);

      container.html('');

      for (var i in d.data) {
        var row = d.data[i];
        var tr = $('<tr data-class="user" data-id="' + row.id + '"></tr>').appendTo(container);

        switch (row.rights_id) {
          case "0":
            tr.addClass('negative');
            break;

          case "10":
            tr.addClass('positive');
            break;
        }

        tr.append('<td><div class="ui checkbox"><input type="checkbox" class="bulker" data-name="admin_selected" value="user_' + row.id + '" data-id="' + row.id + '" /><label></label></div></td>');
        tr.append('<td class="center aligned">' + dateFormat(row.created_at) + '</td>');
        tr.append('<td>#' + row.id + ' <a onclick="crm.user.card(' + row.id + ')">' + row.name + ' ' + row.surname + '</a>' + '<br><small><i class="icon mail' + (row.email_verified == "1" ? '' : ' outline') + '"></i>' + row.email + '</small>' + '<br><small><i class="icon phone"></i>' + row.phone + '</small>' + '<br><small><i class="icon world"></i>' + crm.user.getMeta(row.meta, 'country') + '</small>' + '</td>');
        tr.append('<td class="">' + row.office + '</td>');
        tr.append('<td class="right aligned">' + row.users_count + '</td>');
        tr.append('<td class="ui header">' + row.rights.title + '</td>');
        tr.append('<td>' + (row.manager ? '<b>Administrator:</b><a href="javascript:crm.user.card(' + row.manager.id + ')">' + row.manager.name + ' ' + row.manager.surname + "</a>" : '') + '<br><small>' + (row.manager ? crm.user.getMeta(row.manager.meta, 'office') : '') + '</small>' + '</td>');
        tr.append('<td class="center aligned">' + dateFormat(parseInt(crm.user.getMeta(row.meta, 'last_login'))) + '<br>' + crm.user.getMeta(row.meta, 'last_login_ip') + '</td>');
      }

      page.paginate(d, 'admin-list', container);
      container.find('[data-name=admin_selected]').on('click change keyup', function (e) {
        if ($('[data-name=admin_selected]:checked').length) {
          $('.admin.bulk').show();
          skymechanics.reload();
        } else $('.admin.bulk').hide();
      });
      container.parent().parent().find('.form #sendMail:not(.bulk.assigned)').on('click', function () {
        var mail = $(this).closest('.form').find('#mailsTemplate').dropdown('get value'),
            val = $(this).closest('.form').find('#mailsText').val();
        $('[data-name=user_selected]').each(function () {
          var id = $(this).attr('data-id'),
              $that = $(this).parent();

          if ($that.checkbox('is checked') && id) {
            console.debug('sending mail [' + mail + ', ' + val + '] to ' + id);
            $.ajax({
              url: '/mail/send',
              data: {
                user_id: id,
                sender_id: system.user.id,
                mail_id: mail,
                text: val
              },
              success: function success() {
                $that.checkbox('uncheck');
              }
            });
          }
        }).promise().done(function () {
          crm.mail.touch();
        });
      }).addClass('assigned');
    }
  }, {
    key: "log",
    value: function log($c, d) {
      $c.html('');
      d.data.map(function (row, i) {
        var $s = $("<tr id=\"log-".concat(row.id, "\" class=\"user-log user-log-").concat(row.type, "\"></tr>")).appendTo($c);
        $('<td class="user-log-date">' + dateFormat(row.created_at, true, 'simple') + '</td>').appendTo($s);
        var $o = $('<td class="user-log-object"></td>').appendTo($s);

        switch (row.type) {
          case 'deal.open':
            $o.html('<b class="ui header small">Trade opened</b>' + row.description + ' <button class="ui button" onclick="crm.deal.info(' + row.object_id + ')">View</button>' + '<br/><small>' + crm.json2html(row.object ? row.object : {}) + '</small>');
            break;

          case 'deal.close':
            $o.html('<b class="ui header small">Trade closed</b>' + row.description + ' <button class="ui button" onclick="crm.deal.info(' + row.object_id + ')">View</button>' + '<br/><small>' + crm.json2html(row.object ? row.object : {}) + '</small>');
            break;

          case 'deal.drop':
            $o.html('<b class="ui header small">Autoclosed trade</b> ' + row.description + '- <button class="ui button" onclick="crm.deal.info(' + row.object_id + ')">View</button>' + '<br/><small>' + crm.json2html(row.object ? row.object : {}) + '</small>');
            break;

          case 'login':
            $o.html(row.description);
            break;

          case 'deposit':
            var status = 'processing';
            if (row.object.code == 200) status = 'success';else if (row.object.code > 200) status = 'failed';
            $o.html('<div class="ui header small">Deposit on ' + (row.object.amount ? currency.value(row.object.amount, row.object.currency ? row.object.currency.code : 'USD') : '') + '. Status = ' + status + '</div>' + row.description + '<br/><small>' + crm.json2html(row.object ? row.object : {}) + '</small>');
            break;

          case 'credit':
            $o.html('<div class="ui header small">Credit on ' + (row.object.amount ? currency.value(row.object.amount, row.object.currency ? row.object.currency.code : 'USD') : '') + '. Status = ' + (row.object.code <= 200 ? 'success' : 'failed') + '</div>' + row.description + '<br/><small>' + crm.json2html(row.object ? row.object : {}) + '</small>');
            break;

          case 'withdrawal':
            $o.html('<div class="ui header small">Withdrawal on ' + currency.value(row.object.amount, row.object.currency ? row.object.currency.code : 'USD') + '. Status = ' + (row.object.code <= 200 ? 'success' : 'failed') + '</div>' + row.description + '<br/><small>' + crm.json2html(row.object ? row.object : {}) + '</small>');
            break;

          case 'register':
            $o.html(row.description);
            break;

          default:
            $o.html(row.description + '<br/><small>' + crm.json2html(row.object ? row.object : {}) + '</small>');
            break;
        }
      });
      page.paginate(d, 'user-log', $c);
    }
  }, {
    key: "deposited",
    value: function deposited(d, $c) {
      if (d.type == 'deposit') {
        if (d.merchant) {
          if (d.merchant.enabled == "1") {
            var was = parseFloat($('#user-total-deposits').data('value'));
            var amount = parseFloat(d.amount); //console.debug('total deposits',was,amount)

            $('#user-total-deposits').animateNumber({
              number: amount + was,
              numberStep: function numberStep(now, tween) {
                $(tween.elem).html(now.currency());
              }
            });
          }

          if (d.merchant.enabled == "2" && d.merchant.title.match(/bonus/i)) {
            var _was = parseFloat($('#user-total-bonus').data('value'));

            var _amount = parseFloat(d.amount); //console.debug('total deposits',was,amount)


            $('#user-total-bonus').animateNumber({
              number: _amount + _was,
              numberStep: function numberStep(now, tween) {
                $(tween.elem).html(now.currency());
              }
            });
          }
        }
      }

      cf.touch('user-accounts');
      cf.touch("user-finance-".concat(crm.user.current));
    }
  }, {
    key: "transaction",
    value: function transaction($c, d) {
      $c.html('');
      var first = true;
      var totals = {
        deposit: 0,
        bonus: 0,
        withdrawal: 0
      };

      for (var i in d.data) {
        var row = d.data[i];
        var transactionClass = row.code == '200' ? 'positive' : row.code == '0' ? '' : 'negotive';

        if (row.type == 'deposit') {
          if (row.merchant_id == 3) totals.bonus += parseFloat(row.amount);else totals.deposit += parseFloat(row.amount);
        } else if (row.withdrawalStatus == 'approved' && (row.type == 'withdrawal' || row.type == 'withdraw')) totals.withdrawal += parseFloat(row.amount);

        var $s = $("<tr id=\"transaction-".concat(row.id, " class=\"ui ").concat(transactionClass, " user-transaction user-transaction-").concat(row.status, " \"></tr>")).appendTo($c);

        if (first) {
          (function () {
            first = false;
            var balance = parseFloat(row.accountBalance);
            $('.user-real-account-balance') //.animateNumber({row.accountBalance.currency('T')});
            .animateNumber({
              number: balance,
              numberStep: function numberStep(now, tween) {
                $(tween.elem).html(balance.currency('T'));
              }
            }).prop('number', balance);
          })();
        }

        $('<td class="user-transaction-id">' + row.id + '</td>').appendTo($s);
        $('<td class="center aligned user-transaction-date">' + dateFormat(row.created_at) + '</td>').appendTo($s);
        $('<td class="user-transaction-amount">' + row.amount.dollars() + '</td>').appendTo($s);
        $('<td class="user-transaction-merchant">' + row.merchant_name + '</td>').appendTo($s);
        $('<td class="user-transaction-type">' + row.type + '</td>').appendTo($s);
        var code = $('<td class="user-transaction-code"></td>').appendTo($s); // $('<span class="user-transaction-code-value">'+row.code+'</span>').appendTo(code);

        $('<span class="user-transaction-code-status"><i class="fa ' + (row.code == '200' ? 'fa-check-circle-o' : row.code == '0' ? 'fa-spin fa-fw fa-circle-o-notch' : 'fa-minus-circle') + '"></i></span>').appendTo(code);
        var withdrawalStr = '';

        if (row.type == 'withdraw') {
          if (row.withdrawalStatus == 'approved') withdrawalStr = "<i class=\"ui green checkmark icon\"></i> ".concat(__('crm.finance.approved'));else if (row.withdrawalStatus == 'declined') withdrawalStr = "<i class=\"ui red ban icon\"></i> ".concat(__('crm.finance.declined'));else if (row.withdrawalStatus == 'request') withdrawalStr = "".concat(__('crm.finance.request'));
        }

        $("<td class=\"user-transaction-actions\">\n            ".concat(row.code == '200' && row.type != 'fee' && window.user.can.admin && row.type != 'withdraw' ? "<div class=\"submiter user-transaction-reverse\" id=\"user_transactio_reverse\" data-action=\"/transaction/".concat(row.id, "\" data-method=\"delete\" data-callback=\"crm.user.touch\">\n                    <input type=\"hidden\" data-name=\"_token\" value=\"").concat(window.Laravel.csrfToken, "\" />\n                    <button class=\"ui icon red submit button\"><i class=\"ui ban icon\"></i>").concat(__('crm.reverse'), "</button>\n                </div>") : row.type == 'withdraw' ? withdrawalStr : '', "\n            </td>")).appendTo($s);
      } // //console.debug('totals:',totals)
      // $('#user-total-deposits').animateNumber({number:totals.deposit,numberStep:(now,tween)=>{$(tween.elem).html(now.currency());}}).prop('number',totals.deposit);
      // $('#user-total-bonus').animateNumber({number:totals.bonus,numberStep:(now,tween)=>{$(tween.elem).html(now.currency());}}).prop('number',totals.bonus);
      // $('#user-total-withdraws').animateNumber({number:totals.withdrawal,numberStep:(now,tween)=>{$(tween.elem).html(now.currency());}}).prop('number',totals.withdrawal);


      $('.user-account .input, .user-account input:visible').val('');
      $('.user-account .dropdown').dropdown('restore defaults');
      page.paginate(d, "user-finance-".concat(crm.user.current), $c);
      cf.reload();
    }
  }, {
    key: "add",
    value: function add() {
      var $c = $('<div class="ui modal submiter" data-action="/user/add/json" data-callback="crm.user.added" id="user_add"></div>').appendTo('#modals');
      $c.append('<i class="close icon" onclick="$(\'.ui.modal\').show(\'close\')"></i>');
      $c.append('<div class="header"><i class="icon user outline"></i> New customer registration form</div>');
      var $bo = $('<div class="content ui form"></div>').appendTo($c),
          $b = $('<div class="fields"></div>').appendTo($bo);
      $('<div class="field eight wide"><label>Name</label><div class="ui input"><input type="text" name="name" data-name="name" placeholder="Name" required></div></div>').appendTo($b);
      $('<div class="field eight wide"><label>Surname</label><div class="ui input"><input type="text" name="surname" data-name="surname" placeholder="Surname"  required/></div></div>').appendTo($b);
      $('<h4 class="ui dividing header">Contacts</h4>').appendTo($bo);
      $b = $('<div class="fields"></div>').appendTo($bo);
      $('<div class="field eight wide"><label>Email</label><div class="ui input"><input type="email" name="email" data-name="email" placeholder="Nameaddress@servername.com"  required></div></div>').appendTo($b);
      $('<div class="field eight wide"><label>Phone</label><div class="ui input"><input type="tel" name="phone" data-name="phone" placeholder="Phone number"  required/></div></div>').appendTo($b);
      $b = $('<div class="fields"></div>').appendTo($bo);
      $('<div class="field eight wide"><label>Country</label><select class="ui search dropdown" name="country" data-title="Choose country" data-name="country" required>' + system.countries.toOptionList() + '</select>').appendTo($b);
      $('<div class="field eight wide"><label>Office</label><div class="ui input"><input type="text" name="office" data-name="office" placeholder="Office"/><div class="ui search selection dropdown loadering" data-name="office2" data-title="Office" data-action="/json/user/offices" data-autostart="true" onchange="{$(\'[data-name=office]\').val($(this).find(\'input\').val());}"></div></div></div>').appendTo($b);
      $('<h4 class="ui dividing header">Access</h4>').appendTo($bo);
      $b = $('<div class="fields"></div>').appendTo($bo);
      $('<div class="field eight wide"><label>Rights</label><select class="ui dropdown loadering" name="rights_id" data-title="Rights" data-name="rights_id" placeholder="User rights" required data-action="/json/user/rights" data-autostart="true"></select>').appendTo($b).on('change', function () {
        //console.debug('dropdown changed',$(this).find('.dropdown').dropdown('get value'));
        if ($(this).find('.dropdown').dropdown('get value')[0] > 2) {
          $(this).closest('.modal').find('.mail').slideDown();
        } else $(this).closest('.modal').find('.mail').slideUp();
      });
      $('<div class="field eight wide"><label>Password</label><div class="ui input"><input type="password" name="password" data-name="password" placeholder="password" required></div></div>').appendTo($b);
      $('<input type="hidden" data-name="parent_user_id" value="' + system.user.id + '" />').appendTo($b);
      $('<input type="hidden" name="status_id" data-name="status_id" value="200"/>').appendTo($b);
      $("<div class=\"mail\" style=\"display:none\">\n            <h4 class=\"ui dividing header\">Mail access</h4>\n            <div class=\"field\">\n                <label>Mail server</label>\n                <div class=\"ui selection dropdown\" >\n                    <input type=\"hidden\" name=\"mail\" data-name=\"mail.server\" value=\"\" onchange=\"crm.user.mail.choose(this)\">\n                    <i class=\"dropdown icon\"></i>\n                    <div class=\"default text\">Choose mail server</div>\n                    <div class=\"menu\">\n                        <div class=\"item\" data-value=\"yandex\">Yandex.Mail</div>\n                        <div class=\"item\" data-value=\"gmail\">Google.Mail</div>\n                    </div>\n                </div>\n            </div>\n            <div class=\"two fields mail-params\" style=\"display:none;\">\n                <div class=\"field\">\n                    <label>Mail login</label>\n                    <div class=\"ui input\">\n                        <input type=\"text\" data-name=\"mail.login\"/>\n                    </div>\n                </div>\n                <div class=\"field\">\n                    <label>Mail password</label>\n                    <div class=\"ui input\">\n                        <input type=\"password\" data-name=\"mail.password\"/>\n                    </div>\n                </div>\n            </div>\n        </div>").appendTo($bo);
      var $f = $('<div class="actions"></div>').appendTo($c);
      $('<div class="ui black deny button">Close</div>').appendTo($f);
      $('<div class="ui positive right labeled icon button submit">Ok <i class="checkmark icon"></i></div>').appendTo($f);
      page.modal('#user_add');
    }
  }, {
    key: "edit",
    value: function edit(id) {
      $.ajax({
        url: "/json/user/" + id,
        dataType: "json",
        success: function success(d, x, s) {
          var user = d[0];
          $('.edit_user').attr('data-action', '/json/user/' + id + '/update');

          for (var i in user) {
            $('.edit_user form [data-name="' + i + '"]').val(user[i]);
          } // $('.popup,.bgc').fadeOut((window.animationTime!=undefined)?window.animationTime:256);


          $('.edit_user').fadeIn(window.animationTime != undefined ? window.animationTime : 256); // cf.submiter($('.edit_user'));
        }
      });
    }
  }, {
    key: "remove",
    value: function remove(id) {
      var $c = $(this).parent().parent('.modal'); // //console.debug('remove user #'+id,$(this),$c);

      $.ajax({
        url: "/user/" + id + "/remove",
        dataType: "json",
        success: function success(d, x, s) {
          crm.user.touch();
          cf.touch('admin-list');
          cf.touch('user-list');
          $('.modal').modal('hide');
        }
      });
    }
  }, {
    key: "deposit",
    value: function deposit(i) {
      var tut = $('#' + i);
      cf.submiter(tut); ////console.debug(tut);
    }
  }, {
    key: "deals",
    value: function deals(container, d, x, s) {
      container.html('');

      for (var i in d) {}

      var pp = cf.pagination(d),
          $pp = container.parent().next(".pagination");
      if (!$pp.length) $pp = $('<div class="pagination"></div>').insertAfter(container.parent());
      $pp.html(pp);
    }
  }, {
    key: "instruments",
    value: function instruments($cnr, id) {
      var inst_tabs = $cnr.find('.user-instruments-tab'),
          inst_tab_cons = inst_tabs.parent(),
          first = true;
      inst_tabs.html('');

      for (var i in window.crm.instrument.data) {
        var inst = window.crm.instrument.data[i],
            s = '';
        inst_tabs.append('<li>' + inst.title + '</li>');
        s += '<div class="tabs_dash_con user-instrument" data-id="' + inst.id + '">';
        s += '<h3>' + inst.title + '</h3>';
        s += '<img alt="chart for ' + inst.title + '" style="width:60%;height:300px; border:solid 1px grey;float:left;"/>';
        s += '<div class="submiter instrument-fee" style="width:30%;float:left;margin-left:10px;">';
        s += '<label for="user_instrument_fee">Commission: <input name="fee" value="1"/>%</label>';
        s += '<a href="#" class="edit button submit">${__("messages.save")}</a>';
        s += '</div>';
        s += '<div class="tunner" style="float:left;margin:10px 0 0 10px; border-top:solid 1px grey;width:30%;">';
        s += '<span class="user_chart_tune">5%</span>&nbsp;';
        s += '<a id="user_chart_up" href="#" class="button" onclick="crm.user.tune.up(' + inst.id + ')">Up</a>&nbsp;';
        s += '<a id="user_chart_up" href="#" class="button" onclick="crm.user.tune.real(' + inst.id + ')">Real</a>&nbsp;';
        s += '<a id="user_chart_up" href="#" class="button" onclick="crm.user.tune.down(' + inst.id + ')">Down</a>';
        s += '</div>';
        s += '</div>';
        inst_tab_cons.append(s);
        /*<div class="tabs_dash_con">
            <div class="user-chart-tuner">
                <span id="user_chart_tune">5%</span>&nbsp;
                <a id="user_chart_up" href="#" onclick="crm.user.tune.up()">Up</a>&nbsp;
                <a id="user_chart_up" href="#" onclick="crm.user.tune.real()">Real</a>&nbsp;
                <a id="user_chart_up" href="#" onclick="crm.user.tune.down()">Down</a>
            </div>
            <div id="user_chart" class="chart"></div>
        </div>*/
      }

      inst_tabs.find('li:first').click();
    }
  }, {
    key: "admintree",
    value: function admintree($c, d, dataName) {
      var pref = 'caus_admin_';
      var that = this;
      $c.html("<div id=\"admins_tree\"></div>");
      $("<button class=\"ui basic icon button\" style=\"position:absolute; top:0; right:0;\"><i class=\"ui refresh icon\"></i></button>").appendTo($c).on('click', function () {
        skymechanics.touch(dataName);
      });
      var treantConfig = {
        chart: {
          container: "#admins_tree",
          // connectors: 'step',
          // rootOrientation: 'WEST',
          callback: {
            // onCreateNode:function(){ //console.log('onCreateNode',arguments) },
            // onCreateNodeCollapseSwitch:function(){ //console.log('onCreateNodeCollapseSwitch',arguments) },
            // onAfterAddNode:function(){ //console.log('onAfterAddNode',arguments) },
            // onBeforeAddNode:function(){ //console.log('onBeforeAddNode',arguments) },
            // onAfterPositionNode:function(){ //console.log('onAfterPositionNode',arguments) },
            // onBeforePositionNode:function(){ //console.log('onBeforePositionNode',arguments) },
            onToggleCollapseFinished: function onToggleCollapseFinished(node, s) {
              // //console.log('onToggleCollapseFinished',node.text['data-id']);
              that.adminTreeCollapsed[node.text['data-id']] = node.collapsed;
            } // onAfterClickCollapseSwitch:function(){ //console.log('onAfterClickCollapseSwitch',arguments) },
            // onBeforeClickCollapseSwitch:function(){ //console.log('onBeforeClickCollapseSwitch',arguments) },
            // onTreeLoaded:function(){ //console.log('onTreeLoaded',arguments) }

          },
          animateOnInit: true,
          node: {
            collapsable: true
          },
          animation: {
            nodeAnimation: "easeOutBounce",
            nodeSpeed: 700,
            connectorsAnimation: "bounce",
            connectorsSpeed: 700
          }
        },
        nodeStructure: {
          image: "/images/favicon.png",
          text: {
            name: ''
          },
          children: []
        }
      };
      var nodes = treantConfig.nodeStructure.children;
      var list = d.data;

      var makeNode = function makeNode(node) {
        var collapsed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        var error = false;
        var chlds = recurse(node.id, node.rights_id, error);
        var clps = that.adminTreeCollapsed[node.id] != undefined ? that.adminTreeCollapsed[node.id] : true; // //console.debug('collapsed',that.adminTreeCollapsed[node.id], that.adminTreeCollapsed[node.id]!=undefined)

        var ret = {
          collapsed: chlds.length > 0 && clps,
          image: "/crm/images/avatar/".concat(node.id % 5, ".jpg"),
          stackChildren: true,
          link: {
            href: "javascript:crm.user.info(".concat(node.id, ")")
          },
          text: {
            name: "#".concat(node.id, " ").concat(node.title, " - [").concat(chlds.length, "]"),
            title: "".concat(node.rights.name || '-'),
            desc: "".concat(node.office || ''),
            'data-id': node.id
          }
        };
        if (chlds.length) ret['children'] = chlds;
        if (error) ret['HTMLclass'] = 'alarm';
        return ret;
      };

      var recurse = function recurse(id, rights) {
        var error = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        var ret = [];
        list.map(function (node, i) {
          if (node.parent_user_id == id) {
            if (parseInt(node.rights_id) < parseInt(rights)) ret.push(makeNode(node));else error = true;
          }
        });
        return ret;
      };

      var found = false;
      list.map(function (node, i) {
        // if(node.rights_id >= 8 && node.rights_id<10){
        if (node.rights_id == (window.user.rights_id == 10 ? 8 : window.user.rights_id)) {
          found = true;
          nodes.push(makeNode(node));
        }
      });

      if (!found) {
        list.map(function (node, i) {
          //console.debug(node.rights_id);
          if (node.rights_id == 10) {
            found = true;
            nodes.push(makeNode(node));
          }
        });
      }

      if (!found) {
        list.map(function (node, i) {
          //console.debug(node.rights_id);
          if (node.rights_id == 7) {
            found = true;
            nodes.push(makeNode(node));
          }
        });
      } //console.log('user.admintree',nodes);


      var tree = new Treant(treantConfig);

      var onDrag = function onDrag(e) {
        var dd = $(e.target);
        if (!dd.hasClass('node')) dd = dd.parents('.node:first'); //console.debug('onDrag',dd.data('id'),e);

        e.originalEvent.dataTransfer.setData("user-id", dd.data('id'));
      };

      var onDrop = function onDrop(e) {
        var uid = e.originalEvent.dataTransfer.getData("user-id");
        var cur = $(e.target);
        if (!cur.hasClass('node')) cur = cur.parents('.node:first');
        cur.removeClass('allow-assign');
        var parentId = cur.data('id'); //console.debug('drop',uid,parentId,e);

        $.ajax({
          url: "/json/user/".concat(uid, "/update"),
          type: 'get',
          data: {
            parent_user_id: cur.data('id')
          },
          before: function before(x, s) {},
          success: function success(d, x, s) {},
          complete: function complete(x, s) {
            //console.debug('finished');
            crm.user.adminTouch();
          }
        });
      };

      var onDragOver = function onDragOver(e) {
        e.preventDefault();
        var $allow = $(e.target);
        if (!$allow.hasClass('node')) $allow = $allow.parents('.node');
        $allow.addClass('allow-assign');
      };

      var onDragLeave = function onDragLeave(e) {
        e.preventDefault();
        var $allow = $(e.target);
        if (!$allow.hasClass('node')) $allow = $allow.parents('.node');
        $allow.removeClass('allow-assign'); //console.debug('onDragOut',$allow);
      };

      $('.node').attr('draggable', true).on('dragstart', onDrag).on('drop', onDrop).on('dragover', onDragOver).on('dragleave', onDragLeave);
    }
  }]);

  return Users;
}();
;

/***/ }),

/***/ "./resources/assets/js/modules/user/user.js":
/*!**************************************************!*\
  !*** ./resources/assets/js/modules/user/user.js ***!
  \**************************************************/
/*! exports provided: User */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "User", function() { return User; });
/* harmony import */ var _components_card__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../components/card */ "./resources/assets/js/components/card.js");
/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../components */ "./resources/assets/js/components/index.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }



var User =
/*#__PURE__*/
function (_Card) {
  _inherits(User, _Card);

  function User(u) {
    var _this;

    var tab = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'kyc';

    _classCallCheck(this, User);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(User).call(this, 'user'));
    _this._uid = 'cuser_' + u.id;
    _this.user = u;
    _this.auth = window.user;
    _this.tab = "".concat(tab, "_").concat(u.id);
    _this.getTitle = _this.getTitle.bind(_assertThisInitialized(_this));
    _this.draw = _this.draw.bind(_assertThisInitialized(_this));
    _this.leftColumn = _this.leftColumn.bind(_assertThisInitialized(_this));
    _this.kyc = _this.kyc.bind(_assertThisInitialized(_this));
    _this.trades = _this.trades.bind(_assertThisInitialized(_this));
    _this.comments = _this.comments.bind(_assertThisInitialized(_this));
    _this.tasks = _this.tasks.bind(_assertThisInitialized(_this));
    _this.finance = _this.finance.bind(_assertThisInitialized(_this));
    _this.accounts = _this.accounts.bind(_assertThisInitialized(_this));
    _this.log = _this.log.bind(_assertThisInitialized(_this));
    _this.messages = _this.messages.bind(_assertThisInitialized(_this));
    _this.mail = _this.mail.bind(_assertThisInitialized(_this));
    _this.meta = _this.meta.bind(_assertThisInitialized(_this));
    _this.compare = _this.compare.bind(_assertThisInitialized(_this));
    _this.pnl = _this.pnl.bind(_assertThisInitialized(_this));
    _this.restrictions = _this.restrictions.bind(_assertThisInitialized(_this));
    _this.load = _this.load.bind(_assertThisInitialized(_this));
    _this.totals = _this.totals.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(User, [{
    key: "load",
    value: function load() {
      var that = this;
      var user = that.user;
      return new Promise(function (resolve, reject) {
        if (user.transactions) {
          resolve();
        }

        if (user.deal) resolve();
        if (user.trades) resolve();
        $.ajax({
          url: "/user/".concat(user.id),
          beforeSend: function beforeSend(e) {
            console.log("User ".concat(user.id, " load data"));
          },
          success: function success(d) {
            $.extend(user, d); // console.debug('loaded user ',user, newuser);
            // that.user = newuser;

            resolve();
          },
          complete: function complete(d) {}
        });
      });
    }
  }, {
    key: "getBalance",
    value: function getBalance(user) {
      var a = 0;
      if (!user.accounts) return a;
      user.accounts.map(function (account, i) {
        if (account.type == 'real') a += parseFloat(account.amount);
      });
      return a;
    }
  }, {
    key: "compare",
    value: function compare(data) {
      var user = this.user;
      if (JSON.stringify(user.messages) != JSON.stringify(data.messages)) return false;
      if (this.getBalance(user) != this.getBalance(data)) return false; // if(data.comments == undefined) return false;

      if (user.comments && user.comments.length != data.comments.length) return false; // if(user.deal.length!=data.deal.length) return false;

      return true;
    }
  }, {
    key: "getMetaRaw",
    value: function getMetaRaw(n) {
      var ret = false;
      var l = this.user.meta;

      for (var i in l) {
        var m = l[i];

        if (m.meta_name === n) {
          return m;
        }
      }

      return false;
    }
  }, {
    key: "getMeta",
    value: function getMeta(n) {
      var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'string';
      var ret = this.getMetaRaw(n);

      if (ret) {
        try {
          ret = ret.meta_value;

          switch (type) {
            case 'json':
              ret = JSON.parse(ret);
              break;
          }
        } catch (e) {
          console.error('cast data error', type, ret, e);
        }
      }

      return ret ? ret : '';
    }
  }, {
    key: "fresh",
    value: function fresh(d) {
      // console.debug('callback user fresh',d);
      if (!this.compare(d)) {
        // this.user = $.extend(this.user,d);
        this.user = d;
        this.draw(true);
        this.shouldUpdate = true;
        this.isUpdate = true;
        this.rendered = false;
      }
    }
  }, {
    key: "getTitle",
    value: function getTitle() {
      return "#".concat(this.user.id, " ").concat(this.user.title);
    }
  }, {
    key: "draw",
    value: function draw() {
      var _this2 = this;

      var isUpdate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      if (this.rendered) return;
      var that = this;
      var user = this.user,
          $container = this.$container,
          auth = this.auth;
      isUpdate = this.isUpdate;
      if (!isUpdate) this.$container.html('');
      var $content = isUpdate ? this.$container.find('.content:first') : $("<div class=\"ui content\"><div class=\"ui inverted dimmer\"><div class=\"ui text loader\">".concat(__('crm.fetching'), "</div></div></div>")).appendTo($container);
      this.$container.find('.dimmer').addClass('active');
      var $grid = isUpdate ? this.$container.find('.grid:first') : $("<div class=\"ui stackable grid\"></div>").appendTo($content); // $grid = isUpdate?this.$container.find('.row:first'):$(`<div class="ui row"></div>`).appendTo($grid);

      var $left = isUpdate ? this.$container.find('.left-column') : $("<div class=\"column four wide left-column\"></div>").appendTo($grid);

      if (!isUpdate) {
        this.load().then(function () {
          _this2.leftColumn($left, isUpdate);

          console.debug('loaded', user);
          var $right = isUpdate ? _this2.$container.find('.right-column') : $("<div class=\"column twelve wide right-column\"></div>").appendTo($grid);
          var $tab = isUpdate ? $right.find('.tabular.menu:first') : $("<div class=\"ui top attached tabular stackable menu\"></div>").appendTo($right);
          if (auth.can.ftd) $tab.append("<a class=\"item active\" data-tab=\"kyc_".concat(user.id, "\">").concat(__('crm.customers.kyc'), "</a>"));
          if (auth.rights_id == 10 || user.rights_id == 1 && auth.can.retention) $tab.append("<a class=\"item\" data-tab=\"trades_".concat(user.id, "\">").concat(__('crm.customers.trades'), "</a>")); // $tab.append(`<a class="item task-user-item" data-tab="tasks_${user.id}">${__('crm.customers.tasks')}</a>`)

          if (auth.rights_id == 10 || user.rights_id == 1 && auth.can.ftd) $tab.append("<a class=\"item\" data-tab=\"finance_".concat(user.id, "\">").concat(__('crm.customers.finance'), "</a>"));
          if (auth.rights_id == 10 || user.rights_id == 1 && auth.can.admin) $tab.append("<a class=\"item\" data-tab=\"accounts_".concat(user.id, "\">").concat(__('crm.accounts.title'), "</a>"));
          $tab.append("<a class=\"item\" data-tab=\"messages_".concat(user.id, "\">").concat(__('crm.customers.messages'), "</a>")); // $tab.append(`<a class="item" data-tab="mail_${user.id}">${__('crm.mail.title')}</a>`)

          if (auth.can.admin) $tab.append("<a class=\"item\" data-tab=\"meta_".concat(user.id, "\">").concat(__('crm.admin.meta'), "</a>"));
          if (auth.can.ftd) $tab.append("<a class=\"item".concat(auth.can.ftd ? '' : ' active', "\" data-tab=\"log_").concat(user.id, "\">").concat(__('crm.customers.log'), "</a>"));
          if (auth.can.admin && user.rights_id != 1) $tab.append("<a class=\"item\" data-tab=\"restrictions_".concat(user.id, "\">").concat(__('crm.restrictions.title'), "</a>"));
          if (auth.rights_id == 10 || user.rights_id == 1 && auth.can.fastlogin) $tab.append("<a class=\"ui item color blue inverder label\" href=\"//".concat(window.tradehost, "/user/fastlogin/").concat(user.id, "\" target=\"_blank\">").concat(__('crm.fastlogin'), "</a>"));
          $("<div class=\"ui right menu\">\n                    <a class=\"ui item color green label\"><i class=\"ui refresh icon\"></i></a>\n                </div>").appendTo($tab).on('click', function (e) {
            console.debug('fresh card', that);
            that.isUpdate = true;
            that.draw();
          });
          if (auth.can.ftd) _this2.kyc(isUpdate ? $right.find(".tab[data-tab=\"kyc_".concat(user.id, "\"]")) : $("<div class=\"ui bottom attached tab segment active\" data-tab=\"kyc_".concat(user.id, "\"></div>")).appendTo($right));
          if (auth.rights_id == 10 || user.rights_id == 1) _this2.trades(isUpdate ? $right.find(".tab[data-tab=\"trades_".concat(user.id, "\"]")) : $("<div class=\"ui bottom attached tab segment \" data-tab=\"trades_".concat(user.id, "\"></div>")).appendTo($right)); // if(auth.rights_id==10 || user.rights_id==1)this.tasks(isUpdate?$right.find(`.tab[data-tab="tasks_${user.id}"]`):$(`<div class="ui bottom attached tab segment" data-tab="tasks_${user.id}"></div>`).appendTo($right))

          if (auth.rights_id == 10 || user.rights_id == 1) _this2.finance($right.find(".tab[data-tab=\"finance_".concat(user.id, "\"]")).length ? $right.find(".tab[data-tab=\"finance_".concat(user.id, "\"]")) : $("<div class=\"ui bottom attached tab segment\" data-tab=\"finance_".concat(user.id, "\"></div>")).appendTo($right));
          if (auth.rights_id == 10 || user.rights_id == 1) _this2.accounts(isUpdate ? $right.find(".tab[data-tab=\"accounts_".concat(user.id, "\"]")) : $("<div class=\"ui bottom attached tab segment\" data-tab=\"accounts_".concat(user.id, "\"></div>")).appendTo($right));

          _this2.messages(isUpdate ? $right.find(".tab[data-tab=\"messages_".concat(user.id, "\"]")) : $("<div class=\"ui bottom attached tab segment\" data-tab=\"messages_".concat(user.id, "\"></div>")).appendTo($right));

          if (auth.can.admin) _this2.meta(isUpdate ? $right.find(".tab[data-tab=\"meta_".concat(user.id, "\"]")) : $("<div class=\"ui bottom attached tab segment\" data-tab=\"meta_".concat(user.id, "\"></div>")).appendTo($right));

          _this2.log(isUpdate ? $right.find(".tab[data-tab=\"log_".concat(user.id, "\"]")) : $("<div class=\"ui bottom attached tab segment".concat(auth.can.ftd ? '' : ' active', "\" data-tab=\"log_").concat(user.id, "\"></div>")).appendTo($right));

          _this2.mail(isUpdate ? $right.find(".tab[data-tab=\"mail_".concat(user.id, "\"]")) : $("<div class=\"ui bottom attached tab segment\" data-tab=\"mail_".concat(user.id, "\"></div>")).appendTo($right));

          if (auth.rights_id == 10 || auth.can.admin && user.rights_id != 1) _this2.restrictions(isUpdate ? $right.find(".tab[data-tab=\"restrictions_".concat(user.id, "\"]")) : $("<div class=\"ui bottom attached tab segment\" data-tab=\"restrictions_".concat(user.id, "\"></div>")).appendTo($right)); // skymechanics.reload();

          $tab.tab({
            onLoad: function onLoad(tabPath) {
              console.debug('card tab changed', that.tab);
              that.tab = tabPath;
            }
          });
          $tab.tab('change tab', that.tab);

          _this2.$container.find('.dimmer').removeClass('active');
        });
      } else {
        // console.log('touching cards');
        this.leftColumn($left, isUpdate);
        skymechanics.touch("user-trade-".concat(user.id)); // skymechanics.touch(`user-finance-${user.id}`);

        if (auth.rights_id == 10 || user.rights_id == 1) this.finance(this.$container.find(".right-column .tab[data-tab=\"finance_".concat(user.id, "\"]")));
        skymechanics.touch("user-accounts-".concat(user.id));
        skymechanics.touch("user-log-".concat(user.id));
        skymechanics.touch("user-messages-".concat(user.id));
      }

      this.shouldUpdate = false;
      this.rendered = true;
      this.isUpdate = false;
    }
  }, {
    key: "comments",
    value: function comments($div) {
      var user = this.user;
      $("<div class=\"ui horizontal divider\">".concat(__("crm.customers.comments"), "</div>")).appendTo($div);
      $div = $("<div class=\"ui item clearing\"></div>").appendTo($div);
      $div = $("<div class=\"ui comments\" style=\"width:100%;\"></div>").appendTo($div);
      var $form = $("<div class=\"ui form submiter\" data-action=\"/user/".concat(user.id, "/comment\" data-name=\"user-comment\" data-callback=\"crm.comments.added\"></div>")).appendTo($div);
      var $field = $("<div class=\"ui field\"></div>").appendTo($form);
      $("<textarea name=\"comment\" class=\"ui input\" data-name=\"comment\" id=\"".concat(user.id, "comment\" placeholder=\"").concat(__('crm.comments.comment_text'), "\" required style=\"height:2rem;\"></textarea>")).appendTo($field).on('change keyup', function (e) {
        var $btn = $(this).parents('.submiter').find('.submit');

        if ($(this).val().length) {
          $btn.removeClass('disabled');
          if (e.keyCode == 13 && e.ctrlKey) $btn.click();
        } else $btn.addClass('disabled');
      });
      $("<div class=\"ui field right aligned\">\n                <div class=\"ui blue labeled submit icon button disabled\">\n                    <i class=\"icon edit\"></i> ".concat(__('crm.customers.addcomment'), "\n                </div>\n            </div>")).appendTo($form);
      if (!user.comments || user.comments.length == 0) $("<div class=\"comment empty\">No Comments</div>").appendTo($div);else {
        user.comments.map(function (comment, i) {
          $("<div class=\"comment\">\n                    <a class=\"avatar\"><img src=\"/crm/images/avatar/".concat(comment.author.id % 5, ".jpg\"></a>\n                    <div class=\"content\">\n                        <a class=\"author\">").concat(comment.author.title, "</a>\n                        <div class=\"metadata\">\n                            <span class=\"date\">").concat(comment.created_at.datetime({
            style: 'simple'
          }), "</span>\n                        </div>\n                        <div class=\"text\">").concat(comment.comment, "</div>\n                    </div>\n                </div>")).appendTo($div);
        });
      }
    }
  }, {
    key: "leftColumn",
    value: function leftColumn($div) {
      var isUpdate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var user = this.user,
          auth = this.auth;
      this.pnl();
      $div = isUpdate ? $div.find("#user-".concat(user.id, "left-column")) : $("<div id=\"user-".concat(user.id, "left-column\" class=\"ui items\"></div>")).appendTo($div);

      if (isUpdate) {
        $div.find("#user-".concat(user.id, "-card-title")).html("<div class=\"ui content\">\n                <div class=\"ui header\">\n                    <code>#".concat(user.id, "</code> ").concat(user.title, "\n                    <h5 class=\"ui header\" style=\"display:inline;\">").concat(user.created_at.datetime({
          style: 'simple'
        }), "</h5>\n                </div>\n            </div>"));
        $div.find("#user-".concat(user.id, "-balance")).html("<h5 class=\"ui large label blue\"><div class=\"detail\">".concat(__('crm.customers.balance'), "</div> ").concat(this.getBalance(user).dollars(), "</h5>"));
        $div.find("#user-".concat(user.id, "-pnl")).html("<h5 class=\"ui large label purple\"><div class=\"detail\">".concat(__('crm.customers.pnl'), "</div> ").concat(user.pnl.dollars(), "</h5>"));
        $div.find("#user-".concat(user.id, "-tradeVolume")).html("<h5 class=\"ui large label green\"><div class=\"detail\">".concat(__('crm.customers.tradeVolume'), "</div> ").concat(user.tradeVolume.dollars(), "</h5>"));
        return;
      }

      $div.append("<div class=\"ui item\" id=\"user-".concat(user.id, "-card-title\"><div class=\"ui content\"><div class=\"ui header\"><code>#").concat(user.id, "</code> ").concat(user.title, " <h5 class=\"ui header\" style=\"display:inline;\">").concat(user.created_at.datetime({
        style: 'simple'
      }), "</h5></div></div></div>"));
      $div.append("<div class=\"ui clearing right aligned\" id=\"user-".concat(user.id, "-balance\"><h5 class=\"ui large label blue\"><div class=\"detail\">").concat(__('crm.customers.balance'), "</div>").concat(this.getBalance(user).dollars(), "</h5></div>"));
      $div.append("<div class=\"ui clearing right aligned\" id=\"user-".concat(user.id, "-pnl\"><h5 class=\"ui large label purple\"><div class=\"detail\">").concat(__('crm.customers.pnl'), "</div> ").concat(user.pnl.dollars(), "</h5></div>"));
      $div.append("<div class=\"ui clearing right aligned\" id=\"user-".concat(user.id, "-tradeVolume\"><h5 class=\"ui large label green\"><div class=\"detail\">").concat(__('crm.customers.tradeVolume'), "</div> ").concat(user.tradeVolume.dollars(), "</h5></div>"));
      if (user.rights_id > 1 && this.getMeta('admincode')) $("<div class=\"ui clearing right aligned\"><label>".concat(__('crm.customers.admincode'), "</label></div>")).appendTo($div).append(new _components__WEBPACK_IMPORTED_MODULE_1__["VUICopytext"](this.getMeta('admincode')));
      $("<div class=\"ui clearing right aligned\"><label>".concat(__('crm.customers.login'), "</label></div>")).appendTo($div).append(new _components__WEBPACK_IMPORTED_MODULE_1__["VUICopytext"](user.email));
      this.comments($div);
      $div.append("<div class=\"ui horizontal divider\">".concat(__('crm.customers.statuses'), "</div>"));
      var ftd = this.getMeta('ftd', 'json');
      if (ftd) $div.append("<div class=\"ui clearing\"><label>".concat(__('crm.customers.ftd'), "</label><h5 class=\"ui header\" style=\"display:inline;\">").concat(ftd.manager.title, "</h5></div>"));
      $div.append("<div class=\"ui clearing item\"><label>".concat(__('crm.customers.source'), "</label><h5 class=\"ui header\" style=\"display:inline;\">").concat(user.source ? user.source : '', "</h5></div>"));

      if (this.auth.can.kyc) {
        var canTradeMeta = this.getMeta('can_trade');
        var can_trade = canTradeMeta == '1' || canTradeMeta == 'true' ? true : false;
        var kyc = this.getMeta('kyc');
        $("<div class=\"field submiter\" data-action=\"/json/user/meta?meta_name=kyc&user_id=".concat(user.id, "\" data-name=\"user-kyc\" data-callback=\"crm.user.touch\">\n                <input type=\"hidden\" class=\"submit\"/>\n                <label>KYC</label>\n                <div class=\"ui search selection dropdown\">\n                    <input type=\"hidden\" data-name=\"meta_value\" value=\"").concat(kyc ? kyc : 0, "\" onchange=\"$(this).parent().parent().find('.submit').click()\"/>\n                    <i class=\"dropdown icon\"></i>\n                    <div class=\"default text\"></div>\n                    <div class=\"menu\" tabindex=\"-1\">\n                        <div class=\"item\" data-value=\"0\">None</div>\n                        <div class=\"item\" data-value=\"1\">Partial</div>\n                        <div class=\"item\" data-value=\"2\">Fully</div>\n                    </div>\n                </div>\n            </div>")).appendTo($div); // $(`<div class="ui clearing item">
        //     <div class="submiter" data-action="/json/user/meta?meta_name=kyc" data-name="user-kyc" data-callback="crm.user.touch" style="width:100%;">
        //         <input type="hidden" data-name="user_id" value="${user.id}" />
        //         <input type="hidden" data-name="meta_value" value="${kyc}" />
        //         <input type="hidden" class="submit"/>
        //         <div class="ui indicating progress" data-value="${kyc}" data-percent="${100*kyc/2}" data-total="2" id="user_${user.id}_kyc">
        //             <div class="bar">
        //                 <div class="progress"></div>
        //             </div>
        //             <div class="label">
        //                 <div class="ui inline buttons">
        //                     <button class="ui icon basic button" onclick="$('#user_${user.id}_kyc').progress('decrement')"><i class="arrow left icon"></i></button>
        //                     <button class="ui basic button disabled">KYC</button>
        //                     <button class="ui icon basic button" onclick="$('#user_${user.id}_kyc').progress('increment')"><i class="arrow right icon"></i></button>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        // </div>`).appendTo($div).find('.progress').progress({
        //     label: false,
        //     onChange:function(p,v,t){
        //         switch(v){
        //             case 0:$(this).progress('set bar label','None KYC');break;
        //             case 1:$(this).progress('set bar label','Partial KYC');break;
        //             case 2:$(this).progress('set bar label','Fully KYC');break;
        //         }
        //         $(this).closest('.submiter').find('[data-name=meta_value]').val(v);
        //         $(this).closest('.submiter').find('.submit').click();
        //     }
        // }).progress('set progress',kyc?kyc:0);

        $div.append("<div class=\"ui item\">\n                <div class=\"ui slider checkbox submiter\" data-action=\"/json/user/meta?meta_name=can_trade\" data-name=\"user-can-trade\" data-callback=\"userCanTrade\">\n                    <input type=\"hidden\" data-name=\"user_id\" value=\"".concat(user.id, "\" />\n                    <!-- <input type=\"hidden\" class=\"submit\" /> -->\n                    <input class=\"cantrade submit\" data-trigger=\"change\" type=\"checkbox\" data-name=\"meta_value\" ").concat(can_trade ? 'checked="checked" value="true"' : '', "/>\n                    <label>").concat(__('crm.customers.can_trade'), "</label>\n                </div>\n            </div>"));
      }

      var $form = $("<div class=\"ui form submiter globe\" data-action=\"/json/user/".concat(user.id, "/update\" data-callback=\"crm.user.touch\" id=\"\"></div>")).appendTo($div);
      $form.append("<input type=\"hidden\" data-name=\"user_id\" value=\"".concat(user.id, "\" />"));

      if (this.auth.can.kyc) {
        $form.append("<div class=\"field\">\n                <div class=\"ui slider checkbox\">\n                    <input type=\"checkbox\" data-name=\"email_verified\" ".concat(user.email_verified == "1" ? 'checked="checked" value="true"' : '', " />\n                    <label>").concat(__('crm.customers.email_verified'), "</label>\n                </div>\n            </div>"));
      }

      $("<div class=\"field\">\n            <label>".concat(__('crm.customers.status'), "</label>\n            <div class=\"ui search selection dropdown\">\n                <input type=\"hidden\"  data-name=\"status_id\" value=\"").concat(user.status_id, "\"/>\n                <i class=\"dropdown icon\"></i>\n                <div class=\"default text\"></div>\n                <div class=\"menu\" tabindex=\"-1\">").concat(this.auth.statuses.toItemList(), "</div>\n            </div>\n        </div>")).appendTo($form); //.dropdown().dropdown('set value', user.status_id);

      if (this.auth.can.kyc) {
        $("<div class=\"field\">\n                <label>".concat(__('crm.customers.rights'), "</label>\n                <div class=\"ui search selection dropdown\">\n                    <input type=\"hidden\"  data-name=\"rights_id\" value=\"").concat(user.rights_id, "\"/>\n                    <i class=\"dropdown icon\"></i>\n                    <div class=\"default text\"></div>\n                    <div class=\"menu\" tabindex=\"-1\">").concat(this.auth.rights.toItemList(), "</div>\n                </div>\n            </div>")).appendTo($form); //.dropdown('set value', user.rights_id)

        $("<div class=\"field\">\n                <label>".concat(__('crm.customers.manager'), "</label>\n                <div class=\"ui selection dropdown\" id=\"user-manager\">\n                    <input type=\"hidden\" name=\"parent_user_id\" data-name=\"parent_user_id\" value=\"").concat(user.parent_user_id, "\">\n                    <i class=\"dropdown icon\"></i>\n                    <div class=\"default text\"></div>\n                    <div class=\"menu\" tabindex=\"-1\">\n                        ").concat(window.employees.toItemList(), "\n                    </div>\n                </div>\n            </div>")).appendTo($form);
        $("<div class=\"field\">\n                <label>".concat(__('crm.customers.affilate'), "</label>\n                <div class=\"ui search selection dropdown\" id=\"user-affilate\">\n                    <input type=\"hidden\" name=\"affilate_id\" data-name=\"affilate_id\" value=\"").concat(user.affilate_id, "\">\n                    <i class=\"dropdown icon\"></i>\n                    <div class=\"default text\"></div>\n                    <div class=\"menu\" tabindex=\"-1\">\n                        ").concat(window.employees.toItemList(), "\n                    </div>\n                </div>\n            </div>")).appendTo($form);
      }

      if (auth.can.retention) $("<div class=\"field\"><label>".concat(__('crm.customers.changepassword'), "</label></div>")).appendTo($form).append(new _components__WEBPACK_IMPORTED_MODULE_1__["VUIPassword"]());
      if (user.rights_id > 1) $form.append("\n            <div class=\"field\">\n                <label>".concat(__('crm.customers.office'), "</label>\n                <div class=\"ui input\">\n                    <input data-name=\"office\" value=\"").concat(user.office, "\" />\n                </div>\n            </div>"));
      $form.append("<buttom class=\"ui button green submit\">".concat(__('crm.save'), "</button>")); // $form.append(``)

      return $div;
    }
  }, {
    key: "kyc",
    value: function kyc($div) {
      var user = this.user,
          auth = this.auth;
      $div.html('');
      var $form = $("<div class=\"ui form submiter globe\" data-action=\"/json/user/".concat(user.id, "/update\" data-callback=\"crm.user.touch\"></div>")).appendTo($div);
      var address = this.getMeta('');
      $("<div class=\"three fields\">\n            <div class=\"field\">\n                <label for=\"name\">".concat(__('crm.customers.name'), "</label>\n                <input ").concat(auth.can.retention ? '' : 'readonly="readonly"', " type=\"text\" data-name=\"name\" placeholder=\"").concat(__('messages.Enter_your_name'), "\" value=\"").concat(user.name, "\" >\n            </div>\n            <div class=\"field\">\n                <label for=\"l_name\">").concat(__('crm.customers.surname'), "</label>\n                <input ").concat(auth.can.retention ? '' : 'readonly="readonly"', " type=\"text\" data-name=\"surname\" placeholder=\"").concat(__('messages.Enter_last_name'), "\" value=\"").concat(user.surname, "\">\n            </div>\n            <div class=\"field\">\n                <label for=\"l_name_l\">").concat(__('crm.customers.middlename'), "</label>\n                <input ").concat(auth.can.retention ? '' : 'readonly="readonly"', " type=\"text\" data-name=\"midname\" placeholder=\"").concat(__('messages.Enter_middle_name'), "\"  value=\"").concat(this.getMeta('midname') || '', "\">\n            </div>\n        </div>\n        <div class=\"three fields\">\n            <div class=\"field\">\n                <label for=\"date\">").concat(__('crm.customers.birthday'), "</label>\n                <input ").concat(auth.can.retention ? '' : 'readonly="readonly"', " type=\"date\" data-name=\"birthday\" placeholder=\"").concat(__('crm.customers.dd_mm_yyyy'), "\" value=\"").concat(this.getMeta('birthday') || '', "\">\n            </div>\n        </div><div class=\"ui horizontal divider\">").concat(__('crm.customers.contacts'), "</div>\n        <div class=\"two fields\">\n            <div class=\"field\">\n                <label for=\"tel\">").concat(__('crm.customers.phone'), "</label>\n                <div class=\"ui action input\">\n                    <input ").concat(auth.can.retention ? '' : 'readonly="readonly"', " type=\"tel\" data-name=\"phone\" placeholder=\"").concat(__('messages.Enter_phone_number'), "\" value=\"").concat(user.phone, "\">\n                    <button class=\"ui icon button\" onclick=\"crm.telephony.lazyLink('").concat(user.phone, "')\"><i class=\"phone icon\"></i></button>\n                </div>\n            </div>\n            <div class=\"field\">\n                <label for=\"tel\">").concat(__('crm.customers.email'), "</label>\n                <input ").concat(auth.can.retention ? '' : 'readonly="readonly"', " type=\"tel\" data-name=\"email\" placeholder=\"").concat(__('crm.customers.email'), "\" value=\"").concat(user.email, "\">\n            </div>\n        </div><div class=\"ui horizontal divider\">").concat(__('crm.customers.location'), "</div>\n        <div class=\"three fields\">\n            <div class=\"field\">\n                <label for=\"country\">").concat(__('crm.customers.country'), "</label>\n                <div class=\"ui selection search dropdown\">\n                    <input type=\"hidden\"  data-name=\"country\" value=\"").concat(this.getMeta('country') || '', "\"\n                    <i class=\"dropdown icon\"></i>\n                    <div class=\"default text\"></div>\n                    <div class=\"menu\" tabindex=\"-1\">").concat(window.countries.toItemList(true), "</div>\n                </div>\n            </div>\n            <div class=\"field\">\n                <label for=\"city\">").concat(__('crm.customers.city'), "</label>\n                <input ").concat(auth.can.retention ? '' : 'readonly="readonly"', " type=\"text\" data-name=\"city\" placeholder=\"").concat(__('messages.Enter_the_name_of_the_city'), "\" value=\"").concat(user.address ? user.address.city : '', "\">\n            </div>\n\n            <div class=\"field\">\n                <label for=\"name\">").concat(__('crm.customers.index'), "</label>\n                <input ").concat(auth.can.retention ? '' : 'readonly="readonly"', " type=\"text\" data-name=\"zip\" placeholder=\"").concat(__('messages.Enter_the_index'), "\" value=\"").concat(user.address ? user.address.zip : '', "\">\n            </div>\n        </div>\n        <div class=\"field\">\n            <label for=\"address1\">").concat(__('crm.customers.address'), " 1</label>\n            <input ").concat(auth.can.retention ? '' : 'readonly="readonly"', " type=\"text\" data-name=\"address1\" placeholder=\"").concat(__('messages.Enter_the_address'), " 1\" value=\"").concat(user.address ? user.address.address1 : '', "\">\n        </div>\n        <div class=\"field\">\n            <label for=\"address2\">").concat(__('crm.customers.address'), " 2</label>\n            <input ").concat(auth.can.retention ? '' : 'readonly="readonly"', " type=\"text\" data-name=\"address2\" placeholder=\"").concat(__('messages.Enter_the_address'), " 2\" value=\"").concat(user.address ? user.address.address2 : '', "\">\n        </div>\n        <div class=\"ui horizontal divider\">").concat(__('crm.customers.passport'), "</div>\n        <div class=\"fields\">\n            <div class=\"six wide field\">\n                <label for=\"pasport\">").concat(__('crm.customers.passportseries'), "</label>\n                <input ").concat(auth.can.retention ? '' : 'readonly="readonly"', " type=\"text\" data-name=\"passport\" placeholder=\"").concat(__('messages.Enter_the_series'), "\" value=\"").concat(user.passport ? user.address.series : '', "\">\n            </div>\n            <div class=\"ten wide field\">\n                <label for=\"num_pasport\">").concat(__('crm.customers.passportid'), "</label>\n                <input ").concat(auth.can.retention ? '' : 'readonly="readonly"', " type=\"text\" data-name=\"num_pasport\" placeholder=\"").concat(__('crm.customers.passportid'), "\" value=\"").concat(user.passport ? user.address.num_pasport : '', "\">\n            </div>\n        </div>\n        <div class=\"fields\">\n            <div class=\"ten wide field\">\n                <label for=\"kem\">").concat(__('crm.customers.passportissuedby'), "</label>\n                <input ").concat(auth.can.retention ? '' : 'readonly="readonly"', " type=\"text\" data-name=\"issued\" placeholder=\"").concat(__('crm.customers.passportissuedby'), "\" value=\"").concat(user.passport ? user.address.issued : '', "\">\n            </div>\n            <div class=\"six wide field\">\n                <label for=\"until\">").concat(__('crm.customers.passportvalid'), "</label>\n                <input ").concat(auth.can.retention ? '' : 'readonly="readonly"', " type=\"date\" data-name=\"until\" placeholder=\"").concat(__('messages.dd_mm_yyyy'), "\" value=\"").concat(user.passport ? user.address.until : '', "\">\n            </div>\n        </div>\n        <div class=\"ui right\">\n            <button class=\"ui button green submit\">").concat(__('crm.save'), "</button>\n        </div>")).appendTo($form);
      if (!auth.can.kyc) return;
      $("<div class=\"ui horizontal divider\">".concat(__('crm.customers.uploads'), "</div>")).appendTo($div);
      $form = $("<div class=\"ui form\"></div>").appendTo($div);
      $form = $("<div class=\"two fields\"></div>").appendTo($form);
      $form = $("<div class=\"ui field\"><label>".concat(__('crm.upload'), "</label></div>")).appendTo($form);
      $("<input class=\"ui input fileupload\" id=\"fileupload\" type=\"file\" name=\"upload[]\" multiple data-url=\"/user/".concat(user.id, "/upload\"/>")).appendTo($form).addClass('fileupload-assigned').fileupload({
        autoUpload: true,
        acceptFileTypes: /(\.|\/)(gif|jpe?g|png|pdf|doc?x)$/i,
        maxFileSize: 999000,
        disableImageResize: /Android(?!.*Chrome)|Opera/.test(window.navigator.userAgent),
        previewMaxWidth: 100,
        previewMaxHeight: 100,
        previewCrop: true
      }).on('fileuploadadd', function (e, data) {
        $('#uploadall').removeClass('disabled');
        $.each(data.files, function (index, file) {
          // console.debug(index,file);
          var node = $("<div class=\"ui item\" data-name=\"".concat(file.name, "\"/>")) // .append($(`<img class="ui avatar image" src="/images/avatar2/small/rachel.png">`)
          .append("<div class=\"content\" style=\"position:relative;\">\n                                    <a class=\"header\">".concat(file.name, "</a>\n                                    <div class=\"description\">").concat((file.size / 1024).toFixed(0), " Kb</div>\n                                    <div class=\"ui progress fileupload-progress\"><div class=\"bar\"><div class=\"progress\"></div></div><div class=\"label\">Uploading File</div></div>\n                                </div>"));
          node.find('.content button').on('click', function () {
            var $this = $(this),
                data = $this.data();
            $('#fileupload_progress').progress({
              percent: 0
            });
            $this.off('click').html('<i class="ui ban icon"></i> Abort').on('click', function () {
              $this.remove();
              data.abort();
            });
            data.submit().always(function () {
              $this.remove();
            });
          }).data(data); // node.find('.content').append(uploadButton.clone(true).data(data));

          data.context = node;
          node.appendTo("#fileupload_list_".concat(user.id));
        });
      }).on('fileuploadprocessalways', function (e, data) {
        var index = data.index,
            file = data.files[index],
            node = $(data.context.children()[index]); // console.debug('fileuploadprocessalways',file)

        if (file.preview) {
          node.prepend(file.preview);
        }

        if (file.error) {
          node.append($('<span class="text-danger"/>').text(file.error));
        }
      }).on('fileuploadprogressall', function (e, data) {
        var $prog = data.context;
        $('.fileupload-progress:first').progress({
          percent: parseInt(data.loaded / data.total * 100, 10)
        });
      }).on('fileuploaddone', function (e, data) {
        var doc = data.result; // console.debug('fileuploaddone',data);

        data.context.remove();
        var img = doc.file.match(/\.(pdf|docx?)$/) ? "<iframe src=\"https://docs.google.com/viewer?url=".concat(document.location.hostname, "/").concat(doc.file, "&embedded=true\" style=\"width: 100%; height: 100%\" frameborder=\"0\">").concat(__('crm.message.browser_doesnt_support'), "</iframe>") : "<img src=\"".concat(doc.file, "\"/>");
        $("#uploaded_".concat(user.id)).append("<div class=\"card\" id=\"kyc_".concat(user.id, "_").concat(doc.id, "\">\n                <a class=\"ui image\" style=\"position:relative;\" href=\"javascript:0\" onclick=\"page.image.view(this,{'<i class=\\'check icon\\'></i>':'crm.user.kyc.accept(").concat(doc.id, ",").concat(user.id, ")','<i class=\\'ban icon\\'></i>':'crm.user.kyc.decline(").concat(doc.id, ",").concat(user.id, ")'})\">\n                    <div style=\"background-color:rgba(33,186,69,.2);position:absolute;width:100%;height:100%;\"><i class=\"ui big green check icon\"></i></div>\n                    ").concat(img, "\n                </a>\n                <div class=\"content\">\n                    <div class=\"meta\">\n                        ").concat(doc.created_at, "\n                    </div>\n                </div>\n                <div class=\"actions\">\n                    <button class=\"ui icon black button\" onclick=\"crm.user.kyc.delete(").concat(doc.id, ",").concat(user.id, ")\"><i class=\"ui trash icon\"></i></button>\n                </div>\n            </div>"));
      }).on('fileuploadfail', function (e, data) {
        $.each(data.files, function (index) {
          var error = $('<span class="text-danger"/>').text('File upload failed.');
          $(data.context.children()[index]).append('<br>').append(error);
        });
      }).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');
      $("<div class=\"ui list\" id=\"fileupload_list_".concat(user.id, "\"></div>")).appendTo($div);
      $form = $("<div class=\"ui cards\" id=\"uploaded_".concat(user.id, "\"></div>")).appendTo($div);
      if (user.documents) user.documents.map(function (doc, i) {
        var icName = "imageClick_".concat(doc.id, "_").concat(user.id);

        window[icName] = function (that) {
          page.image.view(that, {
            '<i class="check icon"></i>': "crm.user.kyc.accept(".concat(doc.id, ",").concat(user.id, ")"),
            '<i class="ban icon"></i>': "crm.user.kyc.decline(".concat(doc.id, ",").concat(user.id, ")")
          });
        };

        $("<div class=\"card\" id=\"kyc_".concat(user.id, "_").concat(doc.id, "\">\n                <a class=\"ui image\" style=\"position:relative;cursor:pointer;\"\n                    onclick=\"").concat(icName, "(this)\">\n                    <div class=\"verified\" style=\"background-color:rgba(33,186,69,.2);position:absolute;width:100%;height:100%;").concat(doc.status != 'verified' ? 'display:none;' : '', " \"><i class=\"ui big green check icon\"></i></div>\n                    ").concat(doc.file.match(/\.(pdf|docx?)$/) ? "<iframe src=\"https://docs.google.com/viewer?url=".concat(document.location.hostname, "/").concat(doc.file, "&embedded=true\" style=\"width: 100%; height: 100%\" frameborder=\"0\">").concat(__('crm.message.browser_doesnt_support'), "</iframe>") : "<img src=\"".concat(doc.file, "\"/>"), "\n                </a>\n                <div class=\"content\">\n                    <!-- <div class=\"header\">").concat(doc.type, "</div> -->\n                    <div class=\"meta\">\n                        ").concat(doc.created_at.datetime({
          style: 'simple'
        }), "\n                    </div>\n                </div>\n                <div class=\"actions\">\n                    <button class=\"ui icon black button\" onclick=\"crm.user.kyc.delete(").concat(doc.id, ",").concat(user.id, ")\"><i class=\"ui trash icon\"></i></button>\n                </div>\n            </div>")).appendTo($form);
      }); // $(``).appendTo($div);
    }
  }, {
    key: "trades",
    value: function trades($div) {
      $div.html('');
      var user = this.user,
          auth = this.auth;
      $("<div class=\"ui horizontal divider\">".concat(__('crm.instruments.groups.title'), "</div>\n        <div class=\"ui form\">\n            <div class=\"ui fields submiter\" data-action=\"/json/user/meta?meta_name=pairgroup\">\n                <div class=\"field four wide\">\n                    <input type=\"hidden\" data-name=\"user_id\" value=\"").concat(user.id, "\" />\n                    <input type=\"hidden\" id=\"user_").concat(user.id, "_pair_group_submit\" class=\"submit\"/>\n                    <label>").concat(__('crm.instruments.groups.title'), "</label>\n                    <div class=\"ui selection dropdown loadering\" id=\"user_").concat(user.id, "_pair_group\" data-name=\"meta_value\" data-value=\"").concat(this.getMeta('pairgroup') || '', "\" data-action=\"/pairgroup\" data-autostart=\"true\" data-trigger=\"\" data-function-change=\"$('#user_").concat(user.id, "_pair_group_submit').click()\"></div>\n                </div>\n            </div>\n            <div class=\"ui fields submiter\" data-action=\"/json/user/meta?meta_name=margincall\">\n                <div class=\"field four wide\">\n                    <input type=\"hidden\" data-name=\"user_id\" value=\"").concat(user.id, "\" />\n                    <label>").concat(__('forex.marginCall'), "</label>\n                    <div class=\"ui input\"><input type=\"number\" id=\"user_").concat(user.id, "_margincall\" data-name=\"meta_value\" value=\"").concat(user.margincall || '', "\"/></div>\n                </div>\n                <div class=\"field\">\n                    <label>&nbsp;</label>\n                    <div class=\"ui green icon button submit\"><i class=\"ui checkmark icon\"></i> ").concat(__('crm.save'), "</div>\n                </div>\n            </div>\n            <div class=\"ui fields submiter\" data-action=\"/json/user/meta?meta_name=stopout\">\n                <input type=\"hidden\" data-name=\"user_id\" value=\"").concat(user.id, "\" />\n                <div class=\"field four wide\">\n                    <label>").concat(__('forex.stopOut'), "</label>\n                    <div class=\"ui input\"><input type=\"number\" id=\"user_").concat(user.id, "_stopOut\" data-name=\"meta_value\" value=\"").concat(user.stopout || '', "\"/></div>\n                </div>\n                <div class=\"field\">\n                    <label>&nbsp;</label>\n                    <div class=\"ui green icon button submit\"><i class=\"ui checkmark icon\"></i> ").concat(__('crm.save'), "</div>\n                </div>\n            </div>\n        </div>\n        <div class=\"ui horizontal divider\">").concat(__('crm.trades.list'), "</div>\n        <div class=\"ui form\">\n            <div class=\"inline fields\">\n                <label>").concat(__('crm.trades.status'), "</label>\n                <div class=\"field\">\n                    <div class=\"ui huge radio checkbox\">\n                        <input type=\"radio\" name=\"status_id\" checked=\"checked\" class=\"requester\" data-name=\"status_id\" data-value=\"false\" data-trigger=\"change\" data-target=\"deal-list\">\n                        <label>").concat(__('crm.all'), "</label>\n                    </div>\n                </div>\n                <div class=\"field\">\n                    <div class=\"ui radio checkbox\">\n                        <input type=\"radio\" name=\"status_id\"  class=\"requester\" data-name=\"status_id\" data-value=\"10\" data-trigger=\"change\" data-target=\"deal-list\">\n                        <label>").concat(__('crm.trades.active'), "</label>\n                    </div>\n                </div>\n                <div class=\"field\">\n                    <div class=\"ui radio checkbox\">\n                        <input type=\"radio\" name=\"status_id\" class=\"requester\" data-name=\"status_id\" data-value=\"30\" data-trigger=\"change\" data-target=\"deal-list\">\n                        <label>").concat(__('crm.trades.delayed'), "</label>\n                    </div>\n                </div>\n                <div class=\"field\">\n                    <div class=\"ui radio checkbox\">\n                        <input type=\"radio\" name=\"status_id\" class=\"requester\" data-name=\"status_id\" data-value=\"20\" data-trigger=\"change\" data-target=\"deal-list\">\n                        <label>").concat(__('crm.trades.closed'), "</label>\n                    </div>\n                </div>\n                ").concat(auth.can.superadmin ? "<div class=\"field\">\n                    <div class=\"ui radio checkbox\">\n                        <input type=\"radio\" name=\"status_id\" class=\"requester\" data-name=\"status_id\" data-value=\"100\" data-trigger=\"change\" data-target=\"deal-list\">\n                        <label>".concat(__('crm.trades.hidden'), "</label>\n                    </div>\n                </div>") : '', "\n            </div>\n        </div>")).appendTo($div);
      $div.find('[name=status_id]').on('click change', function (a, b, s) {});
      var $table = $("<div class=\"for-loader\"><table class=\"ui table selectable sortable\"><thead></thead><tbody class=\"loadering\" data-need-loader=\"true\" data-id=\"user-trade-".concat(user.id, "\" data-action=\"/json/deal?status=all&user_id=").concat(user.id, "\" data-function=\"crm.deal.list\" data-autostart=\"true\" data-trigger=\"\"></tbody></table></div>")).appendTo($div);
    }
  }, {
    key: "tasks",
    value: function tasks($div) {
      var user = this.user,
          auth = this.auth;
    }
  }, {
    key: "transactions",
    value: function transactions($div) {
      var from = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var _count = 15;
      var user = this.user,
          auth = this.auth;
      var trs = user.transactions.reverse();

      var _till = from + _count;

      _till = _till > trs.length ? trs.length : _till;

      for (var i = from; i < _till; ++i) {
        var row = trs[i];
        var transactionClass = row.code == '200' ? 'positive' : row.code == '0' ? '' : 'negative';
        var code = row.code == '200' ? 'fa-check-circle-o' : row.code == '0' ? 'fa-spin fa-fw fa-circle-o-notch' : 'fa-minus-circle';
        var $row = $("<tr id=\"transaction-".concat(row.id, " class=\"ui ").concat(transactionClass, " user-transaction user-transaction-").concat(row.status, " \"></tr>")).appendTo($div);
        $("<td class=\"user-transaction-id\">".concat(row.id, "</td>")).appendTo($row);
        $("<td class=\"center aligned user-transaction-date\">".concat(row.created_at.datetime(), "</td>")).appendTo($row);
        $("<td class=\"user-transaction-amount\">".concat(row.amount.dollars(), "</td>")).appendTo($row);
        $("<td class=\"user-transaction-merchant\">".concat(row.merchant.name, "</td>")).appendTo($row);
        $("<td class=\"user-transaction-type\">".concat(row.type, "</td>")).appendTo($row);
        $("<td class=\"user-transaction-code\"><span class=\"user-transaction-code-status\"><i class=\"fa ".concat(code, "\"></i></span></td>")).appendTo($row);
        var $actions = $("<td class=\"user-transaction-actions\"></td>").appendTo($row);

        if (row.code == '200' && row.type != 'fee') {
          $("<div class=\"submiter user-transaction-reverse\" id=\"user_transactio_reverse\" data-action=\"/transaction/$".concat(row.id, "\" data-method=\"delete\" data-callback=\"crm.user.touch\">\n                    <input type=\"hidden\" data-name=\"_token\" value=\"{{ csrf_token() }}\" />\n                    <button class=\"ui icon red submit button\"><i class=\"ui ban icon\"></i>").concat(__('crm.reverse'), "</button>\n                </div>"));
          $("").appendTo($actions);
        }
      }
    }
  }, {
    key: "finance",
    value: function finance($div) {
      var user = this.user,
          auth = this.auth; // $div.html('');

      var totals = this.totals();
      var $cols = $div.find("#user_".concat(user.id, "_card_finance_grid_row"));
      $cols = $cols.length ? $cols : $("<div id=\"user_".concat(user.id, "_card_finance_grid\" class=\"ui stackable grid two columns\"><div id=\"user_").concat(user.id, "_card_finance_grid_row\" class=\"ui row\"></div></div>")).appendTo($div).find("#user_".concat(user.id, "_card_finance_grid_row"));
      var $col = $cols.find("#user_".concat(user.id, "_card_finance_grid_totals"));
      $col = $col.length ? $col : $("<div class=\"ui column\" id=\"user_".concat(user.id, "_card_finance_grid_totals\"></div>")).appendTo($cols);
      $col.html("<div class=\"ui horizontal divider\">".concat(__('crm.user.totals'), "</div>\n            <table class=\"ui definition table\">\n                <thead><tr><th></th><th>").concat(__('crm.amount'), "</th></tr></thead>\n                <tbody>\n                    ").concat(Object.keys(totals).map(function (i) {
        var total = totals[i];
        var tot = i;
        var val = total;
        return "<tr>\n                                <td>".concat(__("crm.customers.".concat(tot)), "</td>\n                                <td id=\"user-total-").concat(tot, "\" data-number=\"").concat(val, "\" data-value=\"").concat(val, "\">").concat(val.dollars(), "</td>\n                            </tr>");
      }).join(''), "\n                </tbody>\n            </table>"));

      if (auth.can.deposit) {
        var realAccs = [];
        if (user.accounts) user.accounts.map(function (acc, i) {
          if (acc.type == "real") realAccs.push(acc);
        });
        var accounts = new Collection(realAccs, {
          name: 'currency.name',
          value: 'id',
          desc: 'currency.code'
        });
        var f_success = "transaction_add_".concat(user.id);
        var f_error = f_success + '_error';

        window[f_success] = function (response, container, request) {
          new _components__WEBPACK_IMPORTED_MODULE_1__["VUIMessage"]({
            title: __('crm.success'),
            message: "<b>".concat(__('crm.transactions.' + response.type), "</b> <i>").concat(response.merchant.name, "</i><h3>").concat(response.amount.dollars(), "</h3>")
          });
          $("#user_".concat(user.id, "_card_finance_grid_deposit input")).val();
        };

        window[f_error] = function (response, container, request) {
          new _components__WEBPACK_IMPORTED_MODULE_1__["VUIMessage"]({
            title: __('crm.error'),
            message: "".concat(response.message),
            error: true
          });
        };

        $col = $cols.find("#user_".concat(user.id, "_card_finance_grid_deposit"));
        $col = $col.length ? $col : $("<div class=\"ui column\" id=\"user_".concat(user.id, "_card_finance_grid_deposit\">\n            <div class=\"ui form submiter user-account\" data-action=\"/transaction/add\" data-callback=\"").concat(f_success, "\" data-callback-error=\"").concat(f_error, "\">\n                <div class=\"ui header dividing\">Make transaction on <b>Live</b> account</div>\n                    <input type=\"hidden\" data-name=\"currency\" value=\"USD\"/>\n                    <input type=\"hidden\" data-name=\"user_id\" value=\"").concat(user.id, "\"/>\n                        <div class=\"field\">\n                            <label>Account:</label>\n                            <div class=\"ui selection dropdown\">\n                                <input type=\"hidden\" data-id=\"account_id\" data-name=\"account_id\" value=\"").concat(accounts.first() ? accounts.first().id : '', "\"/>\n                                <div class=\"default text\"></div>\n                                <i class=\"dropdown icon\"></i>\n                                <div class=\"menu\">").concat(accounts.toItemList(), "</div>\n                            </div>\n                        </div>\n                        <div class=\"field\">\n                            <label>Transaction type:</label>\n                            <div class=\"ui selection dropdown\">\n                                <input type=\"hidden\" data-id=\"type\" data-name=\"type\" value=\"deposit\"/>\n                                <div class=\"default text\">Deposit</div>\n                                <i class=\"dropdown icon\"></i>\n                                <div class=\"menu\">\n                                    <div class=\"item\" data-value=\"deposit\">\n                                        <span class=\"text\">Deposit</span>\n                                        <span class=\"description\">fund account</span>\n                                    </div>\n                                    ").concat(auth.can.chief ? "<div class=\"item\" data-value=\"debit\">\n                                            <span class=\"text\">Return</span>\n                                            <span class=\"description\">refund account</span>\n                                        </div>\n                                        <div class=\"item\" data-value=\"credit\">\n                                            <span class=\"text\">Credit</span>\n                                            <span class=\"description\">withdraw</span>\n                                        </div>" : '', "\n                                </div>\n                            </div>\n                        </div>\n                        <div class=\"ui two fields\">\n                            <div class=\"field\">\n                                <label>Merchant:</label>\n                                <div class=\"ui selection dropdown\">\n                                    <input type=\"hidden\" data-id=\"merchants\" data-name=\"merchant_id\" value=\"").concat(merchants.first() ? merchants.first().id : '', "\"/>\n                                    <div class=\"default text\"></div>\n                                    <i class=\"dropdown icon\"></i>\n                                    <div class=\"menu\">\n                                        ").concat(merchants.toItemList(), "\n                                    </div>\n                                </div>\n                            </div>\n                            <div class=\"field\">\n                                <label>Method:</label>\n                                <div class=\"ui selection dropdown\">\n                                    <input type=\"hidden\" name=\"Method\" data-name=\"method\"/>\n                                    <div class=\"default text\">Method</div>\n                                    <i class=\"dropdown icon\"></i>\n                                    <div class=\"menu\">\n                                        <div class=\"item\" data-value=\"false\">Method</div>\n                                        <div class=\"item\" data-value=\"CreditCard\"> ").concat(__('messages.creditcard'), "</div>\n                                        <div class=\"item\" data-value=\"CryptoCurrency\"> ").concat(__('messages.CryptoCurrency'), "</div>\n                                        <!-- <div class=\"item\" data-value=\"YandexMoney\"> ").concat(__('messages.yandexmoney'), "</div> -->\n                                        <div class=\"item\" data-value=\"WireTransfer\">WireTransfer</div>\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                        <div class=\"field\">\n                            <label>Amount:</label>\n                            <div class=\"ui input\">\n                                <input type=\"number\" data-name=\"amount\" min=\"0\" step=\"0.01\"/>\n                            </div>\n                        </div>\n                        <div class=\"ui field right aligned\">\n                            <button type=\"button\" class=\"ui button deposit primary submit\">").concat(__('crm.done'), "</button>\n                        </div>\n                    </div>\n            </div>")).appendTo($cols);
      }

      if ($div.find("#user_".concat(user.id, "_card_finance_grid_transactions")).length) skymechanics.touch("user-finance-".concat(user.id));else {
        $("<div id=\"user_".concat(user.id, "_card_finance_grid_transactions\" class=\"ui horizontal divider\">").concat(__('crm.finance.transactions'), "</div>")).appendTo($div);
        $("<div class=\"ui attached form\">\n                <div class=\"fields\">\n                    <div class=\"field\">\n                        <div class=\"ui search selection dropdown\">\n                            <input type=\"hidden\" class=\"requester\" data-id=\"merchants\" data-name=\"merchant_id\" data-trigger=\"change\" data-target=\"user-finance-".concat(user.id, "\" />\n                            <div class=\"default text\">Merchants</div>\n                            <i class=\"ui dropdown icon\"></i>\n                            <div class=\"menu\">").concat(merchants.toItemList(), "</div>\n                        </div>\n                    </div>\n                    <div class=\"field\">\n                        <div class=\"ui search selection dropdown\">\n                            <input type=\"hidden\" class=\"requester\" data-id=\"status\" data-name=\"status\" data-trigger=\"change\" data-target=\"user-finance-").concat(user.id, "\" />\n                            <div class=\"default text\">").concat(__('crm.all'), "</div>\n                            <i class=\"ui dropdown icon\"></i>\n                            <div class=\"menu\">\n                                <div class=\"item\" data-value=\"false\" selected>All</div>\n                                <div class=\"item\" data-value=\"success\">Success</div>\n                                <div class=\"item\" data-value=\"processing\">Processing</div>\n                                <div class=\"item\" data-value=\"failed\">Failed</div>\n                            </div>\n                    </div>\n                </div>\n            </div>")).appendTo($div);
        $("<table class=\"ui stackable table\"><tbody class=\"loadering\" data-id=\"user-finance-".concat(user.id, "\" data-need-loader=\"true\" data-action=\"/finance/report/userTransactions?user_id=").concat(user.id, "\" data-function=\"crm.user.transaction\" data-autostart=\"true\"></tbody></table>")).appendTo($div);
      }
    }
  }, {
    key: "accounts",
    value: function accounts($div) {
      var user = this.user,
          auth = this.auth;
      $div.html("<div class=\"ui grid two columns\">\n            <div class=\"column\">\n                <div class=\"ui header\">Accounts</div>\n                <div class=\"ui items loadering\" data-id=\"user-accounts-".concat(user.id, "\" data-need-loader=\"true\" data-action=\"/account?user_id=").concat(user.id, "\" data-function=\"crm.user.accounts\" data-autostart=\"true\"></div>\n            </div>\n            <div class=\"column\">\n                <div class=\"ui header dividing\">Add Account</div>\n                    <div class=\"ui form submiter user-account\" id=\"add_user_account_\" data-action=\"/account\" data-method=\"post\" data-callback=\"crm.user.accountsTouch\">\n                        <input type=\"hidden\" data-name=\"_token\" value=\"{{ csrf_token() }}\" />\n                        <input type=\"hidden\" data-name=\"status\" value=\"open\" />\n                        <input type=\"hidden\" data-name=\"user_id\" value=\"").concat(user.id, "\" />\n                        <input type=\"hidden\" data-name=\"amount\" value=\"0\" />\n                        <div class=\"field\">\n                            <label>Type:</label>\n                            <div class=\"ui selection dropdown\">\n                                <input type=\"hidden\" data-id=\"type\" data-name=\"type\"/>\n                                <div class=\"default text\">Account type</div>\n                                    <i class=\"dropdown icon\"></i>\n                                    <div class=\"menu\">\n                                        <div class=\"item\" data-value=\"real\">Live</div>\n                                        <div class=\"item\" data-value=\"demo\">Demo</div>\n                                    </div>\n                            </div>\n                        </div>\n                        <div class=\"field\">\n                            <label>Currency:</label>\n                            <div class=\"ui labeled selection dropdown\">\n                                <input type=\"hidden\" data-id=\"currency_id\" data-name=\"currency_id\"/>\n                                <div class=\"default text\">Currency</div>\n                                <i class=\"dropdown icon\"></i>\n                                <div class=\"menu\">\n                                    ").concat(currency.toOptionListDiv(), "\n                                </div>\n                            </div>\n                        </div>\n                        <div class=\"ui field right aligned\">\n                            <button type=\"button\" class=\"ui button deposit primary submit\">").concat(__("crm.accounts.add"), "</button>\n                        </div>\n                    </div>\n            </div>\n        </div>"));
    }
  }, {
    key: "log",
    value: function log($div) {
      var user = this.user,
          auth = this.auth; // <div class="six wide field">
      //     <div class="ui search icon input">
      //         <input placeholder="${__('crm.search')}..." class="requester search" data-name="search" data-trigger="keyup" data-target="user-log"><i class="search icon"></i>
      //     </div>
      // </div>

      $div.html("\n            <div class=\"ui form\">\n                <div class=\"inline fields\">\n                    <div class=\"field\">\n                        <div class=\"ui search selection dropdown\">\n                            <input type=\"hidden\" data-name=\"type\" class=\"requester\" data-trigger=\"change\" data-target=\"user-log\"/>\n                            <i class=\"dropdown icon\"></i>\n                            <div class=\"default text\">".concat(__('crm.history.type'), "</div>\n                            <div class=\"menu\" tabindex=\"-1\">").concat(window.user.historyTypes.toItemList(), "</div>\n                        </div>\n                    </div>\n                    <div class=\"field\">\n                        <div class=\"ui icon labeled calendar-notime input\" >\n                            <div class=\"ui label\"  onclick=\"$(this).next().val('').change();\"><i class=\"ui refresh icon\"></i></div>\n                            <input type=\"text\" class=\"-ui-calendar requester\" placeholder=\"").concat(__('crm.date_from'), "\" data-name=\"date_from\" data-target=\"user-log\"  data-trigger=\"change\"/>\n                            <i class=\"calendar icon\"></i>\n                        </div>\n                    </div>\n                    <div class=\"field\">\n                        <div class=\"ui icon labeled calendar-notime input\" >\n                            <div class=\"ui label\"  onclick=\"$(this).next().val('').change();\"><i class=\"ui refresh icon\"></i></div>\n                            <input type=\"text\" class=\"-ui-calendar requester\" placeholder=\"").concat(__('crm.date_to'), "\" data-name=\"date_to\" data-target=\"user-log\"  data-trigger=\"change\"/>\n                            <i class=\"calendar icon\"></i>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        <table class=\"ui attached padded selectable stackable table\">\n            <thead>\n                <th>Date</th>\n                <th>Event</th>\n            </thead>\n            <tbody class=\"loadering\"  data-need-loader=\"true\" data-id=\"user-log-").concat(user.id, "\" data-action=\"/json/user/").concat(user.id, "/history\" data-function=\"crm.user.log\" data-autostart=\"true\"></tbody>\n        </table>"));
      skymechanics.reload();
    }
  }, {
    key: "messages",
    value: function messages($div) {
      $div.html('');
      var user = this.user,
          auth = this.auth;
      var callBackfunction = "user_messages_added_".concat(user.id);
      var $c = $("<div class=\"loadering ui item\" data-id=\"user-messages-".concat(user.id, "\" data-action=\"/user/messages?user_id=").concat(user.id, "\" data-refresh=\"0\" data-autostart=\"true\" data-function=\"crm.messages.list\"></div>")).appendTo($div);
      $div.append("<div class=\"ui horizontal divider\">".concat(__('crm.messages.write'), "</div>"));
      var $container = $("<div class=\"submiter ui form\" data-action=\"/user/message/add\" data-callback=\"".concat(callBackfunction, "\">\n            <input type=\"hidden\" data-name=\"user_id\" value=\"").concat(user.id, "\">\n            <input type=\"hidden\" data-name=\"subject\" value=\"#").concat(auth.id, " ").concat(auth.title, "\">\n            <div class=\"field\">\n                <div class=\"ui input\">\n                    <textarea data-name=\"message\" required placeholder=\"").concat(__('messages.message'), "\"  maxlength=\"1000\"></textarea>\n                </div>\n            </div>\n            <div class=\"ui blue labeled submit icon button\">\n                <i class=\"icon send\"></i> ").concat(__('crm.send'), "\n            </div>\n        </div>")).appendTo($div);

      window[callBackfunction] = function (d, $c) {
        console.log("Calling ".concat(callBackfunction));
        $container.find('textarea').val('').text('');
        skymechanics.touch("user-messages-".concat(user.id));
      };

      var d = user.messages;
      if (d == undefined || !d.length) return;
      $c.html('');
      var ddt = parseInt(d[0].created_at).datetime({
        style: 'simple',
        show: {
          time: false
        }
      });
      $c.append('<div class="ui horizontal divider">' + ddt + '</div>');

      for (var i in d) {
        var m = d[i];
        var s = '';
        var isme = m.author_id == system.user.id;
        var mdt = parseInt(m.created_at).datetime({
          style: 'simple',
          show: {
            time: false
          }
        });
        var status = m.status == 'new' ? ' blue' : '';
        var $m = $('<div class="ui message from' + status + '"></div>').appendTo($c);

        if (mdt != ddt) {
          ddt = mdt;
          $c.append('<div class="ui horizontal divider">' + ddt + '</div>');
        }

        $m.addClass(isme ? 'me' : 'user'); // s+=(m.author_id == {{Auth::id()}})?'<div class="message from-me">':'<div class="message from-user">';

        $m.append('<i class="close icon" onclick="crm.messages.delete(this,' + m.id + ')"></i>' // +'<div class="right floated"><a class="ui link"><i class="icon eye"></i></a></div>'
        + '<div class="ui header">' + m.subject + '</div>' + '<div class="description">' + m.message + '</div>');
        $m.append('<div class="right floated right aligned meta"><i class="icon clock"></i>' + parseInt(m.created_at).datetime({
          style: 'time'
        }) + '</div>');

        if (m.status == 'new' && m.user_id == system.user.id) {
          $m.append('<div class="ui horizontal divider">actions</div>');
          var $b = $('<div class="ui right aligned buttons"></div>').appendTo($m);
          $b.append('<button class="ui button icon basic labeled" onclick="crm.messages.view(this,' + m.id + ')"><i class="eye icon"></i>Viewed</button>');
        } // $m.append('<div class="meta"><i class="icon author"></i>'+m.author.name+' '+m.author.surname+'</div>');

      }
    }
  }, {
    key: "mail",
    value: function mail($div) {
      var user = this.user,
          auth = this.auth;
      $div.html("<div class=\"loadering ui comments\" data-id=\"user-mail\" data-action=\"/user/mail?user_id=".concat(user.id, "\" data-refresh=\"0\" data-autostart=\"true\" data-function=\"crm.mail.user\"></div>\n        <div class=\"ui horizontal divider\">").concat(__('messages.writemessage'), "</div>\n        <div class=\"submiter ui form\" data-action=\"/mail/send\" data-callback=\"crm.mail.sent\">\n            <input type=\"hidden\" data-name=\"user_id\" value=\"").concat(user.id, "\">\n            <div class=\"field\">\n                <label>").concat(__('crm.mail.template'), "</label>\n                <div class=\"loadering ui selection dropdown\" id=\"mailsTemplate\" data-id=\"mailsTemplate\" data-title=\"Templates\" data-name=\"mail_id\" data-action=\"/mail\" data-autostart=\"true\" data-function=\"crm.mail.chooseTemplate\" data-function-change=\"crm.mail.loadTemplate\"></div>\n            </div>\n            <div class=\"field\">\n                <label>Sender:</label>\n                ").concat(window.system.mailer, "\n            </div>\n            <div class=\"field\">\n                <div class=\"ui input\">\n                    <textarea class=\"mailsText\" data-name=\"text\" required placeholder=\"").concat(__('messages.text'), "\"></textarea>\n                </div>\n            </div>\n            <div class=\"ui blue labeled submit icon button\">\n                <i class=\"icon send\"></i> ").concat(__('messages.Send'), "\n            </div>\n        </div>"));
    }
  }, {
    key: "meta",
    value: function meta($div) {
      var user = this.user,
          auth = this.auth;
      $div.html('');
      $div = $("<div class=\"ui relaxed list\"></div>").appendTo($div);
      if (user.meta) user.meta.map(function (meta, i) {
        window["user_meta_remove_".concat(meta.id, "_callback")] = function (d, s) {
          $("#usermeta_".concat(meta.id)).remove();
        };

        var $meta = $("<div class=\"ui item\" id=\"usermeta_".concat(meta.id, "\">\n                <div class=\"content\">\n                    <div class=\"header\">").concat(meta.meta_name, "</div>\n                    <div class=\"description\" id=\"user_meta_edit_").concat(meta.id, "\">\n                        ").concat(meta.meta_value || '', "\n                    </div>\n                </div>\n                <div class=\"right floated content\" id=\"user_meta_remove_").concat(meta.id, "\"></div>\n                <div class=\"right floated content\">").concat(meta.created_at.datetime({
          style: 'simple'
        }), "</div>\n            </div>")).appendTo($div);
        auth.can.admin ? $meta.find("#user_meta_edit_".concat(meta.id)).html(new _components__WEBPACK_IMPORTED_MODULE_1__["VUIEditable"]('/usermeta/' + meta.id, 'meta_value', meta.meta_value || '')) : null;
        $meta.find("#user_meta_remove_".concat(meta.id)).append(new _components__WEBPACK_IMPORTED_MODULE_1__["VUIResourceRemove"]('/usermeta/' + meta.id, "user_meta_remove_".concat(meta.id, "_callback")));
      });
    }
  }, {
    key: "pnl",
    value: function pnl() {
      var user = this.user;

      if (false) {} else {
        var pnl = 0;
        var tradeVolume = 0;
        if (user.deal) user.deal.map(function (trade, i) {
          pnl += parseFloat(trade.profit);
          tradeVolume += parseFloat(trade.invested);
        });
        this.user.pnl = pnl;
        this.user.tradeVolume = tradeVolume;
      }
    }
  }, {
    key: "totals",
    value: function totals() {
      var user = this.user;
      var totals = {
        deposit: 0,
        bonus: 0,
        withdrawal: 0
      };

      if (false) {} else if (user.transactions) user.transactions.reverse().map(function (row, i) {
        if (row.code == 200) {
          if (row.type == 'deposit') {
            if (row.merchant && row.merchant.enabled == 2) totals.bonus += parseFloat(row.amount);else if (row.merchant && row.merchant.enabled == 1) totals.deposit += parseFloat(row.amount);
          } else if (row.type == 'withdrawal' || row.type == 'withdraw' && row.withdrawal && row.withdrawal.status == "approved") totals.withdrawal += parseFloat(row.amount);
        }
      });

      return totals;
    }
  }, {
    key: "restrictions",
    value: function restrictions($div) {
      var user = this.user,
          auth = this.auth;
      var allow = this.getMetaRaw('ip_allow');
      var deny = this.getMetaRaw('ip_deny');
      var allowDropButton = "<div class=\"ui submiter form\" id=\"allow_drop_button_".concat(user.id, "\" data-action=\"/usermeta/").concat(allow.id, "\" data-method=\"DELETE\" data-callback=\"allowDropCallback_").concat(user.id, "\" style=\"margin-top: -3rem;margin-bottom: 1rem;\"><div class=\"field right aligned\"><button class=\"ui icon red submit button\">").concat(__('crm.drop'), " <i class=\"ui trash icon\"></i></button></div></div>");
      var denyDropButton = "<div class=\"ui submiter form\" id=\"deny_drop_button_".concat(user.id, "\" data-action=\"/usermeta/").concat(deny.id, "\" data-method=\"DELETE\" data-callback=\"denyDropCallback_").concat(user.id, "\" style=\"margin-top: -3rem;margin-bottom: 1rem;\"><div class=\"field right aligned\"><button class=\"ui icon red submit button\">").concat(__('crm.drop'), " <i class=\"ui trash icon\"></i></button></div></div>");

      window["allowCallback_".concat(user.id)] = function (d, $s) {
        var allow = d;
        if ($("#allow_drop_button_".concat(user.id)).length == 0) $("#drop_allow_button_section_".concat(user.id)).html("<div class=\"ui submiter form\" id=\"allow_drop_button_".concat(user.id, "\" data-action=\"/usermeta/").concat(allow.id, "\" data-method=\"DELETE\" data-callback=\"allowDropCallback_").concat(user.id, "\" style=\"margin-top: -3rem;margin-bottom: 1rem;\"><div class=\"field right aligned\"><button class=\"ui icon red submit button\">").concat(__('crm.drop'), " <i class=\"ui trash icon\"></i></button></div></div>"));
        skymechanics.reload();
      };

      window["allowDropCallback_".concat(user.id)] = function (d, $s) {
        $("#allow_value_".concat(user.id)).val('');
        $s.remove();
      };

      window["denyCallback_".concat(user.id)] = function (d, $s) {
        var deny = d;
        if ($("#deny_drop_button_".concat(user.id)).length == 0) $("#drop_deny_button_section_".concat(user.id)).html("<div class=\"ui submiter form\" id=\"deny_drop_button_".concat(user.id, "\" data-action=\"/usermeta/").concat(deny.id, "\" data-method=\"DELETE\" data-callback=\"denyDropCallback_").concat(user.id, "\" style=\"margin-top: -3rem;margin-bottom: 1rem;\"><div class=\"field right aligned\"><button class=\"ui icon red submit button\">").concat(__('crm.drop'), " <i class=\"ui trash icon\"></i></button></div></div>"));
        skymechanics.reload();
      };

      window["denyDropCallback_".concat(user.id)] = function (d, $s) {
        $("#deny_value_".concat(user.id)).val('');
        $s.remove();
      };

      $div.html("<div class=\"ui bottom attached tab segment active\" data-tab=\"restricts\">\n            <div class=\"ui center aligned huge header\">".concat(__('crm.restrictions.ip'), "</div>\n            <div class=\"ui items\">\n                <div class=\"item\">\n                    <div class=\"content\">\n                        <div class=\"ui header\" id=\"allow_header_").concat(user.id, "\">").concat(__('crm.restrictions.allow'), "</div>\n                        <div class=\"description\"></div>\n                        <div class=\"extra\">\n                            <i class=\"ui info icon\"></i>").concat(__('crm.value_separate_comma'), "\n                        </div>\n                        <div class=\"right floated extra\" id=\"drop_allow_button_section_").concat(user.id, "\">\n                            ").concat(allow ? allowDropButton : '', "\n                        </div>\n                    </div>\n                </div>\n                <div class=\"item\">\n                    <div class=\"content\">\n                    <div class=\"ui form globe submiter\" data-action=\"/json/user/meta?meta_name=ip_allow\" data-callback=\"allowCallback_").concat(user.id, "\">\n                        <input type=\"hidden\" data-name=\"user_id\" value=\"").concat(user.id, "\" />\n                        <div class=\"ui field\">\n                            <textarea data-name=\"meta_value\" id=\"allow_value_").concat(user.id, "\">").concat(allow ? allow.meta_value : '', "</textarea>\n                        </div>\n                        <div class=\"ui field right aligned\">\n                            <button class=\"ui icon green button submit\">").concat(__('crm.save'), " <i class=\"ui save icon\"></i></button>\n                        </div>\n                    </div>\n                    </div>\n                </div>\n                <div class=\"item\">\n                    <div class=\"content\">\n                        <div class=\"ui header\" id=\"allow_header_").concat(user.id, "\">").concat(__('crm.restrictions.deny'), "</div>\n                        <div class=\"description\"></div>\n                        <div class=\"extra\">\n                            <i class=\"ui info icon\"></i>").concat(__('crm.value_separate_comma'), "\n                        </div>\n                        <div class=\"right floated extra\" id=\"drop_deny_button_section_").concat(user.id, "\">\n                            ").concat(deny ? denyDropButton : '', "\n                        </div>\n                    </div>\n                </div>\n                <div class=\"item\">\n                    <div class=\"content\">\n                        <div class=\"ui form globe submiter\" data-action=\"/json/user/meta?meta_name=ip_deny\" data-callback=\"denyCallback_").concat(user.id, "\">\n                            <input type=\"hidden\" data-name=\"user_id\" value=\"").concat(user.id, "\" />\n                            <div class=\"ui field\">\n                                <textarea data-name=\"meta_value\" id=\"deny_value_").concat(user.id, "\">").concat(deny ? deny.meta_value : '', "</textarea>\n                            </div>\n                            <div class=\"ui field right aligned\">\n                                <button class=\"ui icon green submit button\">").concat(__('crm.save'), " <i class=\"ui save icon\"></i></button>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n\n        </div>"));
    }
  }]);

  return User;
}(_components_card__WEBPACK_IMPORTED_MODULE_0__["Card"]);

/***/ }),

/***/ "./resources/assets/js/scheduler/func_calendar.js":
/*!********************************************************!*\
  !*** ./resources/assets/js/scheduler/func_calendar.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

$(document).ready(function () {
  if ($('.container').is('.calendar')) {
    console.log('calendar_main');
    $(".info-task").popup({
      html: $('#infoContent').html(),
      inline: true
    });
    $('.calendar-picker').calendar();
    $('body').on('click', '.hide-popup', function () {
      $(this).parent().removeClass('popup');
    });
    $(function () {
      var _$$fullCalendar;

      var todayDate = moment().startOf('day');
      var YM = todayDate.format('YYYY-MM');
      var YESTERDAY = todayDate.clone().subtract(1, 'day').format('YYYY-MM-DD');
      var TODAY = todayDate.format('YYYY-MM-DD');
      var TOMORROW = todayDate.clone().add(1, 'day').format('YYYY-MM-DD');
      var dataEvents = $('#dataEvents').text();
      $('#calendar_scheduler').fullCalendar((_$$fullCalendar = {
        defaultView: 'agendaWeek',
        navLinks: true,
        selectable: true,
        nowIndicator: true,
        businessHours: true,
        // themeSystem: 'pulse',
        allDaySlot: false,
        header: {
          left: 'prev,next today',
          center: 'title',
          right: 'month,agendaWeek,agendaDay,listWeek'
        },
        editable: true,
        eventLimit: true
      }, _defineProperty(_$$fullCalendar, "navLinks", true), _defineProperty(_$$fullCalendar, "viewRender", function viewRender(view) {// $('.popover').not(this).removeClass('show');
      }), _defineProperty(_$$fullCalendar, "events", function events(start, end, timezone, callback) {
        // $('.popover').not(this).removeClass('show');
        var viewDate = DateDiff(new Date(end.format()), new Date(start.format()));
        var checkClosedTask = $('#checkClosedTask').prop('checked');

        switch (viewDate) {
          case 1:
            scaleDate = 'day';
            break;

          case 7:
            scaleDate = 'week';
            break;

          case 42:
            scaleDate = 'month';
            break;

          default:
            scaleDate = '';
            break;
        }

        $.ajax({
          type: 'POST',
          url: '/get_tasks',
          data: {
            start_date: start.format(),
            end_date: end.format(),
            scaleDate: scaleDate,
            checkClosedTask: checkClosedTask,
            _token: $('meta[name="csrf-token"]').attr('content')
          },
          success: function success(data) {
            var events = [];
            var color = '#eee';
            $.each(data.tasks, function (i, val) {
              switch (val.status_id) {
                case 1:
                  color = '#3a87ad';
                  break;

                case 2:
                  color = '#d64518';
                  break;

                case 3:
                  color = '#43d60d';
                  break;

                default:
                  classTask = '';
                  break;
              }

              events.push({
                id: val.id,
                title: val.title,
                start: val.start_date,
                end: val.end_date,
                status: val.status_id,
                color: color
              });
            });
            callback(events);
          }
        });
      }), _defineProperty(_$$fullCalendar, "eventResize", function eventResize(event, delta, revertFunc, jsEvent, ui, view) {
        // $('.popover').not(this).removeClass('show');
        data = {
          start_date: event.start.format(),
          end_date: event.end.format(),
          id: event.id
        };
        dragResizeTask(data, event, revertFunc, view);
      }), _defineProperty(_$$fullCalendar, "eventDrop", function eventDrop(event, delta, revertFunc, jsEvent, ui, view) {
        // $('.popover').not(this).removeClass('show');
        if (event.status == 3 || event.status == 2) {
          revertFunc();
          return false;
        }

        data = {
          start_date: event.start.format(),
          end_date: event.end.format(),
          id: event.id
        };
        dragResizeTask(data, event, revertFunc, view);
      }), _defineProperty(_$$fullCalendar, "eventRender", function eventRender(event, element) {
        //$('.popover').not(this).removeClass('show');
        var buttons = "<button data-toggle='tooltip' title='Edit Task' type ='button' id-task='" + event.id + "'' class='btn hide-popup btn-default  fa fa-pencil fa-2x edit-task'>" + "</button>&nbsp;<button type ='button' data-toggle='tooltip' title='Delete Task' id-task='" + event.id + "'' class='btn hide-popup btn-danger fa fa-trash fa-2x delete-task'></button>" + "&nbsp<button type ='button' data-toggle='tooltip' title='Closed Task' id-task='" + event.id + "'' class='btn hide-popup btn-dark fa fa-times fa-2x closed-task'></button>";

        switch (event.status) {
          case 1:
            // buttons +=  "&nbsp;</button>&nbsp;<button type ='button' data-toggle='tooltip' title='Start Task' id-task='"+event.id+"'' class='btn hide-popup btn-success  fa fa-caret-square-o-right fa-2x start-task'></button>";
            break;

          case 2:
            // buttons =  "</button>&nbsp;<button type ='button' data-toggle='tooltip' title='Delete Task' id-task='"+event.id+"'' class='btn hide-popup btn-danger fa fa-trash fa-2x delete-task'></button>"
            // + "&nbsp;<button data-toggle='tooltip' title='Refresh Task' type ='button' id-task='"+event.id+"'' class='btn hide-popup btn-info  fa fa-repeat fa-2x renew-task'>"
            // + "&nbsp;</button>&nbsp;<button type ='button' data-toggle='tooltip' title='Closed Task' id-task='"+event.id+"'' class='btn hide-popup btn-dark fa fa-times fa-2x closed-task'></button>"
            // classTask = 'progress-bar-striped';
            break;

          case 3:
            buttons = "</button>&nbsp;<button type ='button' data-toggle='tooltip' title='Delete Task' id-task='" + event.id + "'' class='btn hide-popup btn-danger fa fa-trash fa-2x delete-task'></button>";
            break;

          default:
            classTask = '';
            break;
        }

        if (typeof event.title === 'undefined') {
          event.title = '';
        }

        element.popup({
          on: 'click',
          html: buttons,
          title: event.title
        });
      }), _defineProperty(_$$fullCalendar, "eventClick", function eventClick(event, jsEvent, view) {// $('.popover').not(this).removeClass('show');
        // $(this).popover ('toggle').attr('data-trigger', 'focus');
      }), _defineProperty(_$$fullCalendar, "select", function select(startDate, endDate) {
        clearModalInput();
        $('.modal-input').removeClass('ui input error').val('');
        $('#addTaskModal').modal('show');
        $('#startTime').val(startDate.format('llll'));
        $('#endTime').val(endDate.format('llll'));
      }), _$$fullCalendar));
    });
    $('#checkClosedTask').on('click', function () {
      if ($(this).prop('checked') == true) {
        $('.closed-info').removeClass('d-none');
      } else {
        $('.closed-info').addClass('d-none');
      } // $('#calendar_scheduler').fullCalendar('removeEventSources');


      $('#calendar_scheduler').fullCalendar('rerenderEvents');
      $('#calendar_scheduler').fullCalendar('refetchEvents');
    });
    $('body').on("click", '.closed-task', function () {
      //$('.popover').not(this).removeClass('show');
      var taskId = $(this).attr('id-task');
      swal({
        title: 'Are you sure you want to close this task?',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, closed it!'
      }).then(function (result) {
        if (result.value) {
          $.ajax({
            type: 'PUT',
            url: '/edit_task',
            data: {
              id: taskId,
              type: 'closed_status',
              _token: $('meta[name="csrf-token"]').attr('content')
            },
            error: function error() {
              swal({
                type: 'error',
                title: 'Oops...',
                text: 'An error has occurred. Please reload the page and try again!'
              });
            },
            success: function success(data) {
              if (data.success == true) {
                if ($('#checkClosedTask').prop('checked') == true) {
                  thisEvent = $("#calendar_scheduler").fullCalendar('clientEvents', taskId);
                  eventData = {
                    id: thisEvent[0].id,
                    title: thisEvent[0].title,
                    start: thisEvent[0].start.format(),
                    end: thisEvent[0].end.format(),
                    status: 3,
                    color: '#43d60d' // fromSelect: true,

                  };
                  $("#calendar_scheduler").fullCalendar('removeEvents', taskId);
                  $('#calendar_scheduler').fullCalendar('renderEvent', eventData);
                } else {
                  $("#calendar_scheduler").fullCalendar('removeEvents', taskId);
                }
              }
            }
          });
        }
      });
    });
    $('body').on("click", '.edit-task, .renew-task', function () {
      $('.modal-input').removeClass('ui input error').val('');
      $('.edit-role').removeClass('active selected');
      taskId = $(this).attr('id-task');
      $.ajax({
        type: 'POST',
        url: '/show_task',
        data: {
          id: taskId,
          _token: $('meta[name="csrf-token"]').attr('content')
        },
        error: function error() {
          swal({
            type: 'error',
            title: 'Oops...',
            text: 'An error has occurred. Please reload the page and try again!'
          });
        },
        success: function success(data) {
          if (data.task) {
            //$('.popover').removeClass('show');
            $('.modal span.invalid-feedback').remove();
            $('.modal-input').removeClass('ui input error').val('');
            $('#userRoleEdit').dropdown('set selected', data.task['object_type']);
            $('#noticeTaskEdit').val(data.task['text']);
            $('#titleTaskEdit').val(data.task['title']);
            $('#taskId').val(data.task['id']);
            $('.startTimeEdit').calendar("set date", new Date(data.task['start_date']));
            $('.endTimeEdit').calendar("set date", new Date(data.task['end_date']));

            if (data.task['email']) {
              userInfo = data.task['name'] + ' ' + data.task['surname'] + ' ' + data.task['email'];
              $('#searchUserEdit').attr('id-user', data.task['id-user']);
            } else {
              userInfo = "";
            }

            $('#searchUserEdit').val(userInfo);
            $('#updateTaskModal').modal('show');
          }
        }
      });
    });
    $('#updateTask').on("click", function () {
      clearModalInput();
      startTime = $('#startTimeEdit').val();
      endTime = $('#endTimeEdit').val();
      notice = $('#noticeTaskEdit').val();
      title = $('#titleTaskEdit').val();
      userId = $('#searchUser').attr('id-user');
      id = $('#taskId').val();
      objectType = $('#userRoleEdit').val();
      $.ajax({
        type: 'PUT',
        url: '/edit_task',
        data: {
          id: id,
          start_date: startTime,
          end_date: endTime,
          object_type: objectType,
          object_id: userId,
          text: notice,
          type: 'new_status',
          title: title,
          _token: $('meta[name="csrf-token"]').attr('content')
        },
        success: function success(data) {
          flagError = false;

          if (data.object_id) {
            $('#searchUserEdit').addClass('ui input error');
            $('#searchUserEditDiv').append("<div class='ui basic red pointing prompt label transition visible'>This user does not exist</div>");
            flagError = true;
          }

          if (data.object_type) {
            $('#userRoleEdit').addClass('ui input error');
            $('#userRoleEditDiv').append("<div class='ui basic red pointing prompt label transition visible'>" + data.object_type + "</div>");
            flagError = true;
          }

          if (data.start_date) {
            $('#startTimeEdit').addClass('ui input error');
            $('#startTimeEditDiv').append("<div class='ui basic red pointing prompt label transition visible'>" + data.start_date + "</div>");
            flagError = true;
          }

          if (data.end_date) {
            $('#endTimeEdit').addClass('ui input error');
            $('#endTimeEditDiv').append("<div class='ui basic red pointing prompt label transition visible'>" + data.end_date + "</div>");
            flagError = true;
          }

          if (data.text) {
            $('#noticeTaskEdit').addClass('ui input error');
            $('#noticeTaskEditDiv').append("<div class='ui basic red pointing prompt label transition visible'>" + data.text + "</div>");
            flagError = true;
          }

          if (data.title) {
            $('#titleTaskEdit').addClass('ui input error');
            $('#titleTaskEditDiv').append("<div class='ui basic red pointing prompt label transition visible'>" + data.title + "</div>");
            flagError = true;
          }

          if (flagError == false && data.success == true) {
            $("#calendar_scheduler").fullCalendar('removeEvents', taskId);
            eventData = {
              id: taskId,
              title: data.task['title'],
              start: startTime,
              status: data.task['status_id'],
              end: endTime
            };
            $('#calendar_scheduler').fullCalendar('renderEvent', eventData);
            $('#updateTaskModal').modal('hide');
            notificationTasks(startTime, data.task['title'], userId, notice);
          }
        }
      });
    });
    $('body').on("click", '.delete-task', function () {
      // $('.popover').not(this).removeClass('show');
      var taskId = $(this).attr('id-task');
      swal({
        title: 'Are you sure you want to delete this task?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then(function (result) {
        if (result.value) {
          $.ajax({
            type: 'DELETE',
            url: '/delete_task',
            data: {
              id: taskId,
              _token: $('meta[name="csrf-token"]').attr('content')
            },
            error: function error() {
              swal({
                type: 'error',
                title: 'Oops...',
                text: 'An error has occurred. Please reload the page and try again!'
              });
            },
            success: function success(data) {
              if (data.success == true) {
                $("#calendar_scheduler").fullCalendar('removeEvents', taskId);
                swal('Deleted!', 'You have disabled this use', 'success');
              }
            }
          });
        }
      });
    });
    $('#createTask').on("click", function () {
      clearModalInput();
      var startTime = $('#startTime').val();
      var endTime = $('#endTime').val();
      var notice = $('#noticeTask').val();
      var title = $('#titleTask').val();
      var objectType = $('#userRole').val();
      var userId = $('#searchUser').attr('id-user');
      $.ajax({
        type: 'POST',
        url: '/task_add',
        data: {
          start_date: startTime,
          object_id: userId,
          end_date: endTime,
          object_type: objectType,
          text: notice,
          title: title,
          _token: $('meta[name="csrf-token"]').attr('content')
        },
        error: function error() {
          swal({
            type: 'error',
            title: 'Oops...',
            text: 'An error has occurred. Please reload the page and try again!'
          });
        },
        success: function success(data) {
          flagError = false;

          if (data.object_id) {
            $('#searchUser').addClass('ui input error');
            $('#searchUserDiv').append("<div class='ui basic red pointing prompt label transition visible'>This user does not exist</div>");
            flagError = true;
          }

          if (data.object_type) {
            $('#userRole').addClass('ui input error');
            $('#userRoleDiv').append("<div class='ui basic red pointing prompt label transition visible'>" + data.object_type + "</div>");
            flagError = true;
          }

          if (data.start_date) {
            $('#startTime').addClass('ui input error');
            $('#startTimeDiv').append("<div class='ui basic red pointing prompt label transition visible'>" + data.start_date + "</div>");
            flagError = true;
          }

          if (data.end_date) {
            $('#endTime').addClass('ui input error');
            $('#endTimeDiv').append("<div class='ui basic red pointing prompt label transition visible'>" + data.end_date + "</div>");
            flagError = true;
          }

          if (data.text) {
            $('#noticeTask').addClass('ui input error');
            $('#noticeTaskDiv').append("<div class='ui basic red pointing prompt label transition visible'>" + data.text + "</div>");
            flagError = true;
          }

          if (data.title) {
            $('#titleTask').addClass('ui input error');
            $('#titleTaskDiv').append("<div class='ui basic red pointing prompt label transition visible'>" + data.title + "</div>");
            flagError = true;
          }

          if (flagError == false && data.newTask) {
            eventData = {
              id: data.newTask['id'],
              title: data.newTask['title'],
              start: startTime,
              end: endTime,
              status: data.newTask['status_id'],
              fromSelect: true
            };
            $('#calendar_scheduler').fullCalendar('renderEvent', eventData);
            $('#addTaskModal').modal('hide');
            console.log(startTime);
            notificationTasks(startTime, data.newTask['title'], userId, notice);
          }
        }
      });
    });
  }
});

function dragResizeTask(data, event, revertFunc, view) {
  data._token = $('meta[name="csrf-token"]').attr('content');
  $.ajax({
    type: 'PUT',
    url: '/edit_task',
    data: data,
    success: function success(data) {
      if (data.start_date) {
        swal({
          type: 'error',
          title: 'Oops...',
          text: data.start_date
        });
      }

      if (data.success == true) {
        $('#calendar_scheduler').fullCalendar('updateEvent', event);
        notificationTasks(data.task['start_date'], data.title_task, data.object_id_task, data.notice_task);
        return true;
      }

      revertFunc();
    }
  });
}

function clearModalInput() {
  $('.ui.basic.red').remove();
  $('.modal-input').removeClass('ui input error');
  return true;
}

function DateDiff(date1, date2) {
  var datediff = date1.getTime() - date2.getTime();
  return datediff / (24 * 60 * 60 * 1000);
}

function changeEvent(taskId, color) {
  thisEvent = $("#calendar_scheduler").fullCalendar('clientEvents', taskId);
  eventData = {
    id: thisEvent[0].id,
    title: thisEvent[0].title,
    start: thisEvent[0].start.format(),
    end: thisEvent[0].end.format(),
    status: 2,
    color: color // fromSelect: true,

  };
  $("#calendar_scheduler").fullCalendar('removeEvents', taskId);
  $('#calendar_scheduler').fullCalendar('renderEvent', eventData);
}

function notificationTasks(startDate, title, object_id, text) {
  var startNotif = new Date(startDate);
  startNotif = startNotif.getTime() - 5 * 60 * 1000;
  startNotif = new Date(startNotif);
  setInterval(function () {
    var date = new Date();

    if (date.getDate() == startNotif.getDate() && date.getHours() == startNotif.getHours() && date.getMinutes() - startNotif.getMinutes() <= 5 && date.getMinutes() - startNotif.getMinutes() >= 0) {
      $().toastmessage('showToast', {
        text: "".concat(title, "<br>").concat(text, "<br><a onclick=\"crm.user.card(").concat(object_id, ")\">\u041F\u0440\u043E\u0441\u043C\u043E\u0442\u0440\u0435\u0442\u044C</a>"),
        sticky: true,
        position: 'top-right',
        type: 'notice',
        closeText: ''
      });
    }
  }, 300000);
}

/***/ }),

/***/ "./resources/assets/js/scheduler/func_users_avalible_table.js":
/*!********************************************************************!*\
  !*** ./resources/assets/js/scheduler/func_users_avalible_table.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

$(document).ready(function () {
  var userSearch = $('#searchUser');
  var userSearchEdit = $('#searchUserEdit');
  $('.search-input').typeahead({
    source: function source(query, process) {
      return $.get('json/user?calendar=true&search=' + query, function (data) {
        console.log(data);
        d = [];
        $.each(data, function (i, val) {
          dd = {
            'name': val.name + ' ' + val.surname + ' ' + val.email,
            'id': val.id
          };
          d.push(dd);
        });
        return process(d);
      });
    },
    hint: true,
    items: 6,
    autoSelect: false,
    minLength: 3
  });
  $('.search-input').on('change', function () {
    var currentAdd = userSearch.typeahead("getActive");
    var currentEdit = userSearchEdit.typeahead("getActive");

    if (currentAdd) {
      $(".search-input").attr('id-user', currentAdd.id);
    } else if (currentEdit) {
      $(".search-input").attr('id-user', currentEdit.id);
    }
  }); // $('#assignUserTask').on('click', function(){
  // 	let letsearch = $('#searchUser').val();
  // 	$.ajax({
  //                type: 'get',
  //                url: '/json/user',
  //                data: {
  //                    search: letsearch,
  //                    // type: 'start_status',
  //                    // _token: $('meta[name="csrf-token"]').attr('content')
  //                },
  //                // error: function () {
  //                //     swal({
  //                //         type: 'error',
  //                //         title: 'Oops...',
  //                //         text: 'An error has occurred. Please reload the page and try again!',
  //                //     });
  //                // },
  //                success: function (data) {
  //                    // if (data.success == true)
  //                    // {
  //                    //     changeEvent(taskId, '#d64518');
  //                    // }
  //                }
  //            });
  // $('.user-search').search({
  //                  apiSettings: {
  //                      url: '/json/user?search={query}',
  //                      onResponse: function(result) {
  //                          let response = {results: []};
  //                          result.data.map((u,i)=>{
  //                              response.results.push({
  //                                  id: u.id,
  //                                  title: u.name + ' ' + u.surname,
  //                                  description: `#<strong><code>${u.id}</code></strong> ${u.rights.title}`
  //                              });
  //                          })
  //                          return response;
  //                      }
  //                  },
  // });
});

/***/ }),

/***/ "./resources/assets/style.styl":
/*!*************************************!*\
  !*** ./resources/assets/style.styl ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 0:
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** multi ./resources/assets/js/functions.js ./resources/assets/js/app.js ./resources/assets/js/crm.js ./resources/assets/js/scheduler/func_calendar.js ./resources/assets/js/scheduler/func_users_avalible_table.js ./resources/assets/js/modules/tasks_notification.js ./resources/assets/style.styl ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! /Users/pittsb/Projects/trade-crm/resources/assets/js/functions.js */"./resources/assets/js/functions.js");
__webpack_require__(/*! /Users/pittsb/Projects/trade-crm/resources/assets/js/app.js */"./resources/assets/js/app.js");
__webpack_require__(/*! /Users/pittsb/Projects/trade-crm/resources/assets/js/crm.js */"./resources/assets/js/crm.js");
__webpack_require__(/*! /Users/pittsb/Projects/trade-crm/resources/assets/js/scheduler/func_calendar.js */"./resources/assets/js/scheduler/func_calendar.js");
__webpack_require__(/*! /Users/pittsb/Projects/trade-crm/resources/assets/js/scheduler/func_users_avalible_table.js */"./resources/assets/js/scheduler/func_users_avalible_table.js");
__webpack_require__(/*! /Users/pittsb/Projects/trade-crm/resources/assets/js/modules/tasks_notification.js */"./resources/assets/js/modules/tasks_notification.js");
module.exports = __webpack_require__(/*! /Users/pittsb/Projects/trade-crm/resources/assets/style.styl */"./resources/assets/style.styl");


/***/ })

/******/ });