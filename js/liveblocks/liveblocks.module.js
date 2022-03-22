(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Liveblocks = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
    // shim for using process in browser
    var process = module.exports = {};
    
    // cached from whatever global is present so that test runners that stub it
    // don't break things.  But we need to wrap it in a try catch in case it is
    // wrapped in strict mode code which doesn't define any globals.  It's inside a
    // function because try/catches deoptimize in certain engines.
    
    var cachedSetTimeout;
    var cachedClearTimeout;
    
    function defaultSetTimout() {
        throw new Error('setTimeout has not been defined');
    }
    function defaultClearTimeout () {
        throw new Error('clearTimeout has not been defined');
    }
    (function () {
        try {
            if (typeof setTimeout === 'function') {
                cachedSetTimeout = setTimeout;
            } else {
                cachedSetTimeout = defaultSetTimout;
            }
        } catch (e) {
            cachedSetTimeout = defaultSetTimout;
        }
        try {
            if (typeof clearTimeout === 'function') {
                cachedClearTimeout = clearTimeout;
            } else {
                cachedClearTimeout = defaultClearTimeout;
            }
        } catch (e) {
            cachedClearTimeout = defaultClearTimeout;
        }
    } ())
    function runTimeout(fun) {
        if (cachedSetTimeout === setTimeout) {
            //normal enviroments in sane situations
            return setTimeout(fun, 0);
        }
        // if setTimeout wasn't available but was latter defined
        if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
            cachedSetTimeout = setTimeout;
            return setTimeout(fun, 0);
        }
        try {
            // when when somebody has screwed with setTimeout but no I.E. maddness
            return cachedSetTimeout(fun, 0);
        } catch(e){
            try {
                // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
                return cachedSetTimeout.call(null, fun, 0);
            } catch(e){
                // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
                return cachedSetTimeout.call(this, fun, 0);
            }
        }
    
    
    }
    function runClearTimeout(marker) {
        if (cachedClearTimeout === clearTimeout) {
            //normal enviroments in sane situations
            return clearTimeout(marker);
        }
        // if clearTimeout wasn't available but was latter defined
        if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
            cachedClearTimeout = clearTimeout;
            return clearTimeout(marker);
        }
        try {
            // when when somebody has screwed with setTimeout but no I.E. maddness
            return cachedClearTimeout(marker);
        } catch (e){
            try {
                // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
                return cachedClearTimeout.call(null, marker);
            } catch (e){
                // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
                // Some versions of I.E. have different rules for clearTimeout vs setTimeout
                return cachedClearTimeout.call(this, marker);
            }
        }
    
    
    
    }
    var queue = [];
    var draining = false;
    var currentQueue;
    var queueIndex = -1;
    
    function cleanUpNextTick() {
        if (!draining || !currentQueue) {
            return;
        }
        draining = false;
        if (currentQueue.length) {
            queue = currentQueue.concat(queue);
        } else {
            queueIndex = -1;
        }
        if (queue.length) {
            drainQueue();
        }
    }
    
    function drainQueue() {
        if (draining) {
            return;
        }
        var timeout = runTimeout(cleanUpNextTick);
        draining = true;
    
        var len = queue.length;
        while(len) {
            currentQueue = queue;
            queue = [];
            while (++queueIndex < len) {
                if (currentQueue) {
                    currentQueue[queueIndex].run();
                }
            }
            queueIndex = -1;
            len = queue.length;
        }
        currentQueue = null;
        draining = false;
        runClearTimeout(timeout);
    }
    
    process.nextTick = function (fun) {
        var args = new Array(arguments.length - 1);
        if (arguments.length > 1) {
            for (var i = 1; i < arguments.length; i++) {
                args[i - 1] = arguments[i];
            }
        }
        queue.push(new Item(fun, args));
        if (queue.length === 1 && !draining) {
            runTimeout(drainQueue);
        }
    };
    
    // v8 likes predictible objects
    function Item(fun, array) {
        this.fun = fun;
        this.array = array;
    }
    Item.prototype.run = function () {
        this.fun.apply(null, this.array);
    };
    process.title = 'browser';
    process.browser = true;
    process.env = {};
    process.argv = [];
    process.version = ''; // empty string to avoid regexp issues
    process.versions = {};
    
    function noop() {}
    
    process.on = noop;
    process.addListener = noop;
    process.once = noop;
    process.off = noop;
    process.removeListener = noop;
    process.removeAllListeners = noop;
    process.emit = noop;
    process.prependListener = noop;
    process.prependOnceListener = noop;
    
    process.listeners = function (name) { return [] }
    
    process.binding = function (name) {
        throw new Error('process.binding is not supported');
    };
    
    process.cwd = function () { return '/' };
    process.chdir = function (dir) {
        throw new Error('process.chdir is not supported');
    };
    process.umask = function() { return 0; };
    
    },{}],"@liveblocks/client":[function(require,module,exports){
    (function (process){(function (){
    'use strict';
    
    Object.defineProperty(exports, '__esModule', { value: true });
    
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties(Constructor, staticProps);
      return Constructor;
    }
    
    function _extends() {
      _extends = Object.assign || function (target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];
    
          for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key];
            }
          }
        }
    
        return target;
      };
    
      return _extends.apply(this, arguments);
    }
    
    function _inheritsLoose(subClass, superClass) {
      subClass.prototype = Object.create(superClass.prototype);
      subClass.prototype.constructor = subClass;
    
      _setPrototypeOf(subClass, superClass);
    }
    
    function _getPrototypeOf(o) {
      _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
      };
      return _getPrototypeOf(o);
    }
    
    function _setPrototypeOf(o, p) {
      _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
      };
    
      return _setPrototypeOf(o, p);
    }
    
    function _isNativeReflectConstruct() {
      if (typeof Reflect === "undefined" || !Reflect.construct) return false;
      if (Reflect.construct.sham) return false;
      if (typeof Proxy === "function") return true;
    
      try {
        Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
        return true;
      } catch (e) {
        return false;
      }
    }
    
    function _construct(Parent, args, Class) {
      if (_isNativeReflectConstruct()) {
        _construct = Reflect.construct;
      } else {
        _construct = function _construct(Parent, args, Class) {
          var a = [null];
          a.push.apply(a, args);
          var Constructor = Function.bind.apply(Parent, a);
          var instance = new Constructor();
          if (Class) _setPrototypeOf(instance, Class.prototype);
          return instance;
        };
      }
    
      return _construct.apply(null, arguments);
    }
    
    function _isNativeFunction(fn) {
      return Function.toString.call(fn).indexOf("[native code]") !== -1;
    }
    
    function _wrapNativeSuper(Class) {
      var _cache = typeof Map === "function" ? new Map() : undefined;
    
      _wrapNativeSuper = function _wrapNativeSuper(Class) {
        if (Class === null || !_isNativeFunction(Class)) return Class;
    
        if (typeof Class !== "function") {
          throw new TypeError("Super expression must either be null or a function");
        }
    
        if (typeof _cache !== "undefined") {
          if (_cache.has(Class)) return _cache.get(Class);
    
          _cache.set(Class, Wrapper);
        }
    
        function Wrapper() {
          return _construct(Class, arguments, _getPrototypeOf(this).constructor);
        }
    
        Wrapper.prototype = Object.create(Class.prototype, {
          constructor: {
            value: Wrapper,
            enumerable: false,
            writable: true,
            configurable: true
          }
        });
        return _setPrototypeOf(Wrapper, Class);
      };
    
      return _wrapNativeSuper(Class);
    }
    
    function _assertThisInitialized(self) {
      if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }
    
      return self;
    }
    
    function _unsupportedIterableToArray(o, minLen) {
      if (!o) return;
      if (typeof o === "string") return _arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor) n = o.constructor.name;
      if (n === "Map" || n === "Set") return Array.from(o);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
    }
    
    function _arrayLikeToArray(arr, len) {
      if (len == null || len > arr.length) len = arr.length;
    
      for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    
      return arr2;
    }
    
    function _createForOfIteratorHelperLoose(o, allowArrayLike) {
      var it;
    
      if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
        if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
          if (it) o = it;
          var i = 0;
          return function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          };
        }
    
        throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }
    
      it = o[Symbol.iterator]();
      return it.next.bind(it);
    }
    
    function _classPrivateFieldGet(receiver, privateMap) {
      var descriptor = privateMap.get(receiver);
    
      if (!descriptor) {
        throw new TypeError("attempted to get private field on non-instance");
      }
    
      if (descriptor.get) {
        return descriptor.get.call(receiver);
      }
    
      return descriptor.value;
    }
    
    function _classPrivateFieldSet(receiver, privateMap, value) {
      var descriptor = privateMap.get(receiver);
    
      if (!descriptor) {
        throw new TypeError("attempted to set private field on non-instance");
      }
    
      if (descriptor.set) {
        descriptor.set.call(receiver, value);
      } else {
        if (!descriptor.writable) {
          throw new TypeError("attempted to set read only private field");
        }
    
        descriptor.value = value;
      }
    
      return value;
    }
    
    function _classPrivateMethodGet(receiver, privateSet, fn) {
      if (!privateSet.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
      }
    
      return fn;
    }
    
    var ServerMessageType;
    
    (function (ServerMessageType) {
      ServerMessageType[ServerMessageType["UpdatePresence"] = 100] = "UpdatePresence";
      ServerMessageType[ServerMessageType["UserJoined"] = 101] = "UserJoined";
      ServerMessageType[ServerMessageType["UserLeft"] = 102] = "UserLeft";
      ServerMessageType[ServerMessageType["Event"] = 103] = "Event";
      ServerMessageType[ServerMessageType["RoomState"] = 104] = "RoomState";
      ServerMessageType[ServerMessageType["InitialStorageState"] = 200] = "InitialStorageState";
      ServerMessageType[ServerMessageType["UpdateStorage"] = 201] = "UpdateStorage";
    })(ServerMessageType || (ServerMessageType = {}));
    
    var ClientMessageType;
    
    (function (ClientMessageType) {
      ClientMessageType[ClientMessageType["UpdatePresence"] = 100] = "UpdatePresence";
      ClientMessageType[ClientMessageType["ClientEvent"] = 103] = "ClientEvent";
      ClientMessageType[ClientMessageType["FetchStorage"] = 200] = "FetchStorage";
      ClientMessageType[ClientMessageType["UpdateStorage"] = 201] = "UpdateStorage";
    })(ClientMessageType || (ClientMessageType = {}));
    
    var CrdtType;
    
    (function (CrdtType) {
      CrdtType[CrdtType["Object"] = 0] = "Object";
      CrdtType[CrdtType["List"] = 1] = "List";
      CrdtType[CrdtType["Map"] = 2] = "Map";
      CrdtType[CrdtType["Register"] = 3] = "Register";
    })(CrdtType || (CrdtType = {}));
    
    var OpType;
    
    (function (OpType) {
      OpType[OpType["Init"] = 0] = "Init";
      OpType[OpType["SetParentKey"] = 1] = "SetParentKey";
      OpType[OpType["CreateList"] = 2] = "CreateList";
      OpType[OpType["UpdateObject"] = 3] = "UpdateObject";
      OpType[OpType["CreateObject"] = 4] = "CreateObject";
      OpType[OpType["DeleteCrdt"] = 5] = "DeleteCrdt";
      OpType[OpType["DeleteObjectKey"] = 6] = "DeleteObjectKey";
      OpType[OpType["CreateMap"] = 7] = "CreateMap";
      OpType[OpType["CreateRegister"] = 8] = "CreateRegister";
    })(OpType || (OpType = {}));
    
    var WebsocketCloseCodes;
    
    (function (WebsocketCloseCodes) {
      WebsocketCloseCodes[WebsocketCloseCodes["CLOSE_ABNORMAL"] = 1006] = "CLOSE_ABNORMAL";
      WebsocketCloseCodes[WebsocketCloseCodes["INVALID_MESSAGE_FORMAT"] = 4000] = "INVALID_MESSAGE_FORMAT";
      WebsocketCloseCodes[WebsocketCloseCodes["NOT_ALLOWED"] = 4001] = "NOT_ALLOWED";
      WebsocketCloseCodes[WebsocketCloseCodes["MAX_NUMBER_OF_MESSAGES_PER_SECONDS"] = 4002] = "MAX_NUMBER_OF_MESSAGES_PER_SECONDS";
      WebsocketCloseCodes[WebsocketCloseCodes["MAX_NUMBER_OF_CONCURRENT_CONNECTIONS"] = 4003] = "MAX_NUMBER_OF_CONCURRENT_CONNECTIONS";
      WebsocketCloseCodes[WebsocketCloseCodes["MAX_NUMBER_OF_MESSAGES_PER_DAY_PER_APP"] = 4004] = "MAX_NUMBER_OF_MESSAGES_PER_DAY_PER_APP";
      WebsocketCloseCodes[WebsocketCloseCodes["MAX_NUMBER_OF_CONCURRENT_CONNECTIONS_PER_ROOM"] = 4005] = "MAX_NUMBER_OF_CONCURRENT_CONNECTIONS_PER_ROOM";
    })(WebsocketCloseCodes || (WebsocketCloseCodes = {}));
    
    var _parent = new WeakMap();
    
    var _doc = new WeakMap();
    
    var _id = new WeakMap();
    
    var _parentKey = new WeakMap();
    
    var AbstractCrdt = function () {
      function AbstractCrdt() {
        _parent.set(this, {
          writable: true,
          value: void 0
        });
    
        _doc.set(this, {
          writable: true,
          value: void 0
        });
    
        _id.set(this, {
          writable: true,
          value: void 0
        });
    
        _parentKey.set(this, {
          writable: true,
          value: void 0
        });
      }
    
      var _proto = AbstractCrdt.prototype;
    
      _proto._apply = function _apply(op, isLocal) {
        switch (op.type) {
          case OpType.DeleteCrdt:
            {
              if (this._parent != null && this._parentKey != null) {
                return this._parent._detachChild(this);
              }
    
              return {
                modified: false
              };
            }
        }
    
        return {
          modified: false
        };
      };
    
      _proto._setParentLink = function _setParentLink(parent, key) {
        if (_classPrivateFieldGet(this, _parent) != null && _classPrivateFieldGet(this, _parent) !== parent) {
          throw new Error("Cannot attach parent if it already exist");
        }
    
        _classPrivateFieldSet(this, _parentKey, key);
    
        _classPrivateFieldSet(this, _parent, parent);
      };
    
      _proto._attach = function _attach(id, doc) {
        if (_classPrivateFieldGet(this, _id) || _classPrivateFieldGet(this, _doc)) {
          throw new Error("Cannot attach if CRDT is already attached");
        }
    
        doc.addItem(id, this);
    
        _classPrivateFieldSet(this, _id, id);
    
        _classPrivateFieldSet(this, _doc, doc);
      };
    
      _proto._detach = function _detach() {
        if (_classPrivateFieldGet(this, _doc) && _classPrivateFieldGet(this, _id)) {
          _classPrivateFieldGet(this, _doc).deleteItem(_classPrivateFieldGet(this, _id));
        }
    
        _classPrivateFieldSet(this, _parent, undefined);
    
        _classPrivateFieldSet(this, _doc, undefined);
      };
    
      _createClass(AbstractCrdt, [{
        key: "_doc",
        get: function get() {
          return _classPrivateFieldGet(this, _doc);
        }
      }, {
        key: "roomId",
        get: function get() {
          return _classPrivateFieldGet(this, _doc) ? _classPrivateFieldGet(this, _doc).roomId : null;
        }
      }, {
        key: "_id",
        get: function get() {
          return _classPrivateFieldGet(this, _id);
        }
      }, {
        key: "_parent",
        get: function get() {
          return _classPrivateFieldGet(this, _parent);
        }
      }, {
        key: "_parentKey",
        get: function get() {
          return _classPrivateFieldGet(this, _parentKey);
        }
      }]);
    
      return AbstractCrdt;
    }();
    
    var min = 32;
    var max = 126;
    function makePosition(before, after) {
      if (before == null && after == null) {
        return pos([min + 1]);
      }
    
      if (before != null && after == null) {
        return getNextPosition(before);
      }
    
      if (before == null && after != null) {
        return getPreviousPosition(after);
      }
    
      return pos(makePositionFromCodes(posCodes(before), posCodes(after)));
    }
    
    function getPreviousPosition(after) {
      var result = [];
      var afterCodes = posCodes(after);
    
      for (var i = 0; i < afterCodes.length; i++) {
        var code = afterCodes[i];
    
        if (code <= min + 1) {
          result.push(min);
    
          if (afterCodes.length - 1 === i) {
            result.push(max);
            break;
          }
        } else {
          result.push(code - 1);
          break;
        }
      }
    
      return pos(result);
    }
    
    function getNextPosition(before) {
      var result = [];
      var beforeCodes = posCodes(before);
    
      for (var i = 0; i < beforeCodes.length; i++) {
        var code = beforeCodes[i];
    
        if (code === max) {
          result.push(code);
    
          if (beforeCodes.length - 1 === i) {
            result.push(min + 1);
            break;
          }
        } else {
          result.push(code + 1);
          break;
        }
      }
    
      return pos(result);
    }
    
    function makePositionFromCodes(before, after) {
      var index = 0;
      var result = [];
    
      while (true) {
        var beforeDigit = before[index] || min;
        var afterDigit = after[index] || max;
    
        if (beforeDigit > afterDigit) {
          throw new Error("Impossible to generate position between " + before + " and " + after);
        }
    
        if (beforeDigit === afterDigit) {
          result.push(beforeDigit);
          index++;
          continue;
        }
    
        if (afterDigit - beforeDigit === 1) {
          result.push(beforeDigit);
          result.push.apply(result, makePositionFromCodes(before.slice(index + 1), []));
          break;
        }
    
        var mid = afterDigit + beforeDigit >> 1;
        result.push(mid);
        break;
      }
    
      return result;
    }
    
    function posCodes(str) {
      var codes = [];
    
      for (var i = 0; i < str.length; i++) {
        codes.push(str.charCodeAt(i));
      }
    
      return codes;
    }
    function pos(codes) {
      return String.fromCharCode.apply(String, codes);
    }
    function compare(posA, posB) {
      var aCodes = posCodes(posA);
      var bCodes = posCodes(posB);
      var maxLength = Math.max(aCodes.length, bCodes.length);
    
      for (var i = 0; i < maxLength; i++) {
        var a = aCodes[i] == null ? min : aCodes[i];
        var b = bCodes[i] == null ? min : bCodes[i];
    
        if (a === b) {
          continue;
        } else {
          return a - b;
        }
      }
    
      throw new Error("Impossible to compare similar position \"" + posA + "\" and \"" + posB + "\"");
    }
    
    var _data = new WeakMap();
    
    var LiveRegister = function (_AbstractCrdt) {
      _inheritsLoose(LiveRegister, _AbstractCrdt);
    
      function LiveRegister(data) {
        var _this;
    
        _this = _AbstractCrdt.call(this) || this;
    
        _data.set(_assertThisInitialized(_this), {
          writable: true,
          value: void 0
        });
    
        _classPrivateFieldSet(_assertThisInitialized(_this), _data, data);
    
        return _this;
      }
    
      LiveRegister._deserialize = function _deserialize(_ref, parentToChildren, doc) {
        var id = _ref[0],
            item = _ref[1];
    
        if (item.type !== CrdtType.Register) {
          throw new Error("Tried to deserialize a map but item type is \"" + item.type + "\"");
        }
    
        var register = new LiveRegister(item.data);
    
        register._attach(id, doc);
    
        return register;
      };
    
      var _proto = LiveRegister.prototype;
    
      _proto._serialize = function _serialize(parentId, parentKey, doc) {
        if (this._id == null || parentId == null || parentKey == null) {
          throw new Error("Cannot serialize register if parentId or parentKey is undefined");
        }
    
        return [{
          type: OpType.CreateRegister,
          opId: doc == null ? void 0 : doc.generateOpId(),
          id: this._id,
          parentId: parentId,
          parentKey: parentKey,
          data: this.data
        }];
      };
    
      _proto._toSerializedCrdt = function _toSerializedCrdt() {
        var _this$_parent;
    
        return {
          type: CrdtType.Register,
          parentId: (_this$_parent = this._parent) == null ? void 0 : _this$_parent._id,
          parentKey: this._parentKey,
          data: this.data
        };
      };
    
      _proto._attachChild = function _attachChild(id, key, crdt, opId, isLocal) {
        throw new Error("Method not implemented.");
      };
    
      _proto._detachChild = function _detachChild(crdt) {
        throw new Error("Method not implemented.");
      };
    
      _proto._apply = function _apply(op, isLocal) {
        return _AbstractCrdt.prototype._apply.call(this, op, isLocal);
      };
    
      _createClass(LiveRegister, [{
        key: "data",
        get: function get() {
          return _classPrivateFieldGet(this, _data);
        }
      }]);
    
      return LiveRegister;
    }(AbstractCrdt);
    
    var _Symbol$iterator$1, _Symbol$iterator2;
    
    var _items = new WeakMap();
    
    _Symbol$iterator$1 = Symbol.iterator;
    var LiveList = function (_AbstractCrdt) {
      _inheritsLoose(LiveList, _AbstractCrdt);
    
      function LiveList(items) {
        var _this;
    
        if (items === void 0) {
          items = [];
        }
    
        _this = _AbstractCrdt.call(this) || this;
    
        _items.set(_assertThisInitialized(_this), {
          writable: true,
          value: []
        });
    
        var position = undefined;
    
        for (var i = 0; i < items.length; i++) {
          var newPosition = makePosition(position);
    
          var _item = selfOrRegister(items[i]);
    
          _classPrivateFieldGet(_assertThisInitialized(_this), _items).push([_item, newPosition]);
    
          position = newPosition;
        }
    
        return _this;
      }
    
      LiveList._deserialize = function _deserialize(_ref, parentToChildren, doc) {
        var id = _ref[0];
            _ref[1];
        var list = new LiveList([]);
    
        list._attach(id, doc);
    
        var children = parentToChildren.get(id);
    
        if (children == null) {
          return list;
        }
    
        for (var _iterator = _createForOfIteratorHelperLoose(children), _step; !(_step = _iterator()).done;) {
          var entry = _step.value;
          var child = deserialize(entry, parentToChildren, doc);
    
          child._setParentLink(list, entry[1].parentKey);
    
          _classPrivateFieldGet(list, _items).push([child, entry[1].parentKey]);
    
          _classPrivateFieldGet(list, _items).sort(function (itemA, itemB) {
            return compare(itemA[1], itemB[1]);
          });
        }
    
        return list;
      };
    
      var _proto = LiveList.prototype;
    
      _proto._serialize = function _serialize(parentId, parentKey, doc) {
        if (this._id == null) {
          throw new Error("Cannot serialize item is not attached");
        }
    
        if (parentId == null || parentKey == null) {
          throw new Error("Cannot serialize list if parentId or parentKey is undefined");
        }
    
        var ops = [];
        var op = {
          id: this._id,
          opId: doc == null ? void 0 : doc.generateOpId(),
          type: OpType.CreateList,
          parentId: parentId,
          parentKey: parentKey
        };
        ops.push(op);
    
        for (var _iterator2 = _createForOfIteratorHelperLoose(_classPrivateFieldGet(this, _items)), _step2; !(_step2 = _iterator2()).done;) {
          var _step2$value = _step2.value,
              _value = _step2$value[0],
              key = _step2$value[1];
          ops.push.apply(ops, _value._serialize(this._id, key, doc));
        }
    
        return ops;
      };
    
      _proto._indexOfPosition = function _indexOfPosition(position) {
        return _classPrivateFieldGet(this, _items).findIndex(function (item) {
          return item[1] === position;
        });
      };
    
      _proto._attach = function _attach(id, doc) {
        _AbstractCrdt.prototype._attach.call(this, id, doc);
    
        for (var _iterator3 = _createForOfIteratorHelperLoose(_classPrivateFieldGet(this, _items)), _step3; !(_step3 = _iterator3()).done;) {
          var _step3$value = _step3.value,
              _item2 = _step3$value[0];
              _step3$value[1];
    
          _item2._attach(doc.generateId(), doc);
        }
      };
    
      _proto._detach = function _detach() {
        _AbstractCrdt.prototype._detach.call(this);
    
        for (var _iterator4 = _createForOfIteratorHelperLoose(_classPrivateFieldGet(this, _items)), _step4; !(_step4 = _iterator4()).done;) {
          var _step4$value = _step4.value,
              _value2 = _step4$value[0];
    
          _value2._detach();
        }
      };
    
      _proto._attachChild = function _attachChild(id, key, child, opId, isLocal) {
        if (this._doc == null) {
          throw new Error("Can't attach child if doc is not present");
        }
    
        if (this._doc.getItem(id) !== undefined) {
          return {
            modified: false
          };
        }
    
        child._attach(id, this._doc);
    
        child._setParentLink(this, key);
    
        var index = _classPrivateFieldGet(this, _items).findIndex(function (entry) {
          return entry[1] === key;
        });
    
        var newKey = key;
    
        if (index !== -1) {
          if (isLocal) {
            var before = _classPrivateFieldGet(this, _items)[index] ? _classPrivateFieldGet(this, _items)[index][1] : undefined;
            var after = _classPrivateFieldGet(this, _items)[index + 1] ? _classPrivateFieldGet(this, _items)[index + 1][1] : undefined;
            newKey = makePosition(before, after);
    
            child._setParentLink(this, newKey);
          } else {
            var _classPrivateFieldGet2;
    
            _classPrivateFieldGet(this, _items)[index][1] = makePosition(key, (_classPrivateFieldGet2 = _classPrivateFieldGet(this, _items)[index + 1]) == null ? void 0 : _classPrivateFieldGet2[1]);
          }
        }
    
        _classPrivateFieldGet(this, _items).push([child, newKey]);
    
        _classPrivateFieldGet(this, _items).sort(function (itemA, itemB) {
          return compare(itemA[1], itemB[1]);
        });
    
        var newIndex = _classPrivateFieldGet(this, _items).findIndex(function (entry) {
          return entry[1] === newKey;
        });
    
        return {
          reverse: [{
            type: OpType.DeleteCrdt,
            id: id
          }],
          modified: {
            node: this,
            type: "LiveList",
            updates: [{
              index: newIndex,
              type: "insert",
              item: child instanceof LiveRegister ? child.data : child
            }]
          }
        };
      };
    
      _proto._detachChild = function _detachChild(child) {
        if (child) {
          var reverse = child._serialize(this._id, child._parentKey, this._doc);
    
          var indexToDelete = _classPrivateFieldGet(this, _items).findIndex(function (item) {
            return item[0] === child;
          });
    
          _classPrivateFieldGet(this, _items).splice(indexToDelete, 1);
    
          child._detach();
    
          var storageUpdate = {
            node: this,
            type: "LiveList",
            updates: [{
              index: indexToDelete,
              type: "delete"
            }]
          };
          return {
            modified: storageUpdate,
            reverse: reverse
          };
        }
    
        return {
          modified: false
        };
      };
    
      _proto._setChildKey = function _setChildKey(key, child, previousKey) {
        child._setParentLink(this, key);
    
        var previousIndex = _classPrivateFieldGet(this, _items).findIndex(function (entry) {
          return entry[0]._id === child._id;
        });
    
        var index = _classPrivateFieldGet(this, _items).findIndex(function (entry) {
          return entry[1] === key;
        });
    
        if (index !== -1) {
          var _classPrivateFieldGet3;
    
          _classPrivateFieldGet(this, _items)[index][1] = makePosition(key, (_classPrivateFieldGet3 = _classPrivateFieldGet(this, _items)[index + 1]) == null ? void 0 : _classPrivateFieldGet3[1]);
        }
    
        var item = _classPrivateFieldGet(this, _items).find(function (item) {
          return item[0] === child;
        });
    
        if (item) {
          item[1] = key;
        }
    
        _classPrivateFieldGet(this, _items).sort(function (itemA, itemB) {
          return compare(itemA[1], itemB[1]);
        });
    
        var newIndex = _classPrivateFieldGet(this, _items).findIndex(function (entry) {
          return entry[0]._id === child._id;
        });
    
        var updatesDelta = newIndex === previousIndex ? [] : [{
          index: newIndex,
          item: child instanceof LiveRegister ? child.data : child,
          previousIndex: previousIndex,
          type: "move"
        }];
        return {
          modified: {
            node: this,
            type: "LiveList",
            updates: updatesDelta
          },
          reverse: [{
            type: OpType.SetParentKey,
            id: item == null ? void 0 : item[0]._id,
            parentKey: previousKey
          }]
        };
      };
    
      _proto._apply = function _apply(op, isLocal) {
        return _AbstractCrdt.prototype._apply.call(this, op, isLocal);
      };
    
      _proto._toSerializedCrdt = function _toSerializedCrdt() {
        var _this$_parent;
    
        return {
          type: CrdtType.List,
          parentId: (_this$_parent = this._parent) == null ? void 0 : _this$_parent._id,
          parentKey: this._parentKey
        };
      };
    
      _proto.push = function push(element) {
        return this.insert(element, this.length);
      };
    
      _proto.insert = function insert(element, index) {
        if (index < 0 || index > _classPrivateFieldGet(this, _items).length) {
          throw new Error("Cannot insert list item at index \"\x1D" + index + "\". index should be between 0 and " + _classPrivateFieldGet(this, _items).length);
        }
    
        var before = _classPrivateFieldGet(this, _items)[index - 1] ? _classPrivateFieldGet(this, _items)[index - 1][1] : undefined;
        var after = _classPrivateFieldGet(this, _items)[index] ? _classPrivateFieldGet(this, _items)[index][1] : undefined;
        var position = makePosition(before, after);
        var value = selfOrRegister(element);
    
        value._setParentLink(this, position);
    
        _classPrivateFieldGet(this, _items).push([value, position]);
    
        _classPrivateFieldGet(this, _items).sort(function (itemA, itemB) {
          return compare(itemA[1], itemB[1]);
        });
    
        var newIndex = _classPrivateFieldGet(this, _items).findIndex(function (entry) {
          return entry[1] === position;
        });
    
        if (this._doc && this._id) {
          var _id = this._doc.generateId();
    
          value._attach(_id, this._doc);
    
          var storageUpdates = new Map();
          storageUpdates.set(this._id, {
            node: this,
            type: "LiveList",
            updates: [{
              index: newIndex,
              item: value instanceof LiveRegister ? value.data : value,
              type: "insert"
            }]
          });
    
          this._doc.dispatch(value._serialize(this._id, position, this._doc), [{
            type: OpType.DeleteCrdt,
            id: _id
          }], storageUpdates);
        }
      };
    
      _proto.move = function move(index, targetIndex) {
        if (targetIndex < 0) {
          throw new Error("targetIndex cannot be less than 0");
        }
    
        if (targetIndex >= _classPrivateFieldGet(this, _items).length) {
          throw new Error("targetIndex cannot be greater or equal than the list length");
        }
    
        if (index < 0) {
          throw new Error("index cannot be less than 0");
        }
    
        if (index >= _classPrivateFieldGet(this, _items).length) {
          throw new Error("index cannot be greater or equal than the list length");
        }
    
        var beforePosition = null;
        var afterPosition = null;
    
        if (index < targetIndex) {
          afterPosition = targetIndex === _classPrivateFieldGet(this, _items).length - 1 ? undefined : _classPrivateFieldGet(this, _items)[targetIndex + 1][1];
          beforePosition = _classPrivateFieldGet(this, _items)[targetIndex][1];
        } else {
          afterPosition = _classPrivateFieldGet(this, _items)[targetIndex][1];
          beforePosition = targetIndex === 0 ? undefined : _classPrivateFieldGet(this, _items)[targetIndex - 1][1];
        }
    
        var position = makePosition(beforePosition, afterPosition);
    
        var item = _classPrivateFieldGet(this, _items)[index];
    
        var previousPosition = item[1];
        item[1] = position;
    
        item[0]._setParentLink(this, position);
    
        _classPrivateFieldGet(this, _items).sort(function (itemA, itemB) {
          return compare(itemA[1], itemB[1]);
        });
    
        var newIndex = _classPrivateFieldGet(this, _items).findIndex(function (entry) {
          return entry[1] === position;
        });
    
        if (this._doc && this._id) {
          var storageUpdates = new Map();
          storageUpdates.set(this._id, {
            node: this,
            type: "LiveList",
            updates: [{
              index: newIndex,
              previousIndex: index,
              item: item[0],
              type: "move"
            }]
          });
    
          this._doc.dispatch([{
            type: OpType.SetParentKey,
            id: item[0]._id,
            opId: this._doc.generateOpId(),
            parentKey: position
          }], [{
            type: OpType.SetParentKey,
            id: item[0]._id,
            parentKey: previousPosition
          }], storageUpdates);
        }
      };
    
      _proto.delete = function _delete(index) {
        if (index < 0 || index >= _classPrivateFieldGet(this, _items).length) {
          throw new Error("Cannot delete list item at index \"\x1D" + index + "\". index should be between 0 and " + (_classPrivateFieldGet(this, _items).length - 1));
        }
    
        var item = _classPrivateFieldGet(this, _items)[index];
    
        item[0]._detach();
    
        _classPrivateFieldGet(this, _items).splice(index, 1);
    
        if (this._doc) {
          var childRecordId = item[0]._id;
    
          if (childRecordId) {
            var storageUpdates = new Map();
            storageUpdates.set(this._id, {
              node: this,
              type: "LiveList",
              updates: [{
                index: index,
                type: "delete"
              }]
            });
    
            this._doc.dispatch([{
              id: childRecordId,
              opId: this._doc.generateOpId(),
              type: OpType.DeleteCrdt
            }], item[0]._serialize(this._id, item[1]), storageUpdates);
          }
        }
      };
    
      _proto.clear = function clear() {
        if (this._doc) {
          var ops = [];
          var reverseOps = [];
          var updateDelta = [];
          var i = 0;
    
          for (var _iterator5 = _createForOfIteratorHelperLoose(_classPrivateFieldGet(this, _items)), _step5; !(_step5 = _iterator5()).done;) {
            var _item3 = _step5.value;
    
            _item3[0]._detach();
    
            var childId = _item3[0]._id;
    
            if (childId) {
              ops.push({
                id: childId,
                type: OpType.DeleteCrdt
              });
              reverseOps.push.apply(reverseOps, _item3[0]._serialize(this._id, _item3[1]));
              updateDelta.push({
                index: i,
                type: "delete"
              });
            }
    
            i++;
          }
    
          _classPrivateFieldSet(this, _items, []);
    
          var storageUpdates = new Map();
          storageUpdates.set(this._id, {
            node: this,
            type: "LiveList",
            updates: updateDelta
          });
    
          this._doc.dispatch(ops, reverseOps, storageUpdates);
        } else {
          for (var _iterator6 = _createForOfIteratorHelperLoose(_classPrivateFieldGet(this, _items)), _step6; !(_step6 = _iterator6()).done;) {
            var _item4 = _step6.value;
    
            _item4[0]._detach();
          }
    
          _classPrivateFieldSet(this, _items, []);
        }
      };
    
      _proto.toArray = function toArray() {
        return _classPrivateFieldGet(this, _items).map(function (entry) {
          return selfOrRegisterValue(entry[0]);
        });
      };
    
      _proto.every = function every(predicate) {
        return this.toArray().every(predicate);
      };
    
      _proto.filter = function filter(predicate) {
        return this.toArray().filter(predicate);
      };
    
      _proto.find = function find(predicate) {
        return this.toArray().find(predicate);
      };
    
      _proto.findIndex = function findIndex(predicate) {
        return this.toArray().findIndex(predicate);
      };
    
      _proto.forEach = function forEach(callbackfn) {
        return this.toArray().forEach(callbackfn);
      };
    
      _proto.get = function get(index) {
        if (index < 0 || index >= _classPrivateFieldGet(this, _items).length) {
          return undefined;
        }
    
        return selfOrRegisterValue(_classPrivateFieldGet(this, _items)[index][0]);
      };
    
      _proto.indexOf = function indexOf(searchElement, fromIndex) {
        return this.toArray().indexOf(searchElement, fromIndex);
      };
    
      _proto.lastIndexOf = function lastIndexOf(searchElement, fromIndex) {
        return this.toArray().lastIndexOf(searchElement, fromIndex);
      };
    
      _proto.map = function map(callback) {
        return _classPrivateFieldGet(this, _items).map(function (entry, i) {
          return callback(selfOrRegisterValue(entry[0]), i);
        });
      };
    
      _proto.some = function some(predicate) {
        return this.toArray().some(predicate);
      };
    
      _proto[_Symbol$iterator$1] = function () {
        return new LiveListIterator(_classPrivateFieldGet(this, _items));
      };
    
      _createClass(LiveList, [{
        key: "length",
        get: function get() {
          return _classPrivateFieldGet(this, _items).length;
        }
      }]);
    
      return LiveList;
    }(AbstractCrdt);
    
    var _innerIterator = new WeakMap();
    
    _Symbol$iterator2 = Symbol.iterator;
    
    var LiveListIterator = function () {
      function LiveListIterator(items) {
        _innerIterator.set(this, {
          writable: true,
          value: void 0
        });
    
        _classPrivateFieldSet(this, _innerIterator, items[Symbol.iterator]());
      }
    
      var _proto2 = LiveListIterator.prototype;
    
      _proto2[_Symbol$iterator2] = function () {
        return this;
      };
    
      _proto2.next = function next() {
        var result = _classPrivateFieldGet(this, _innerIterator).next();
    
        if (result.done) {
          return {
            done: true,
            value: undefined
          };
        }
    
        return {
          value: selfOrRegisterValue(result.value[0])
        };
      };
    
      return LiveListIterator;
    }();
    
    var _Symbol$iterator;
    
    var _map$1 = new WeakMap();
    
    _Symbol$iterator = Symbol.iterator;
    var LiveMap = function (_AbstractCrdt) {
      _inheritsLoose(LiveMap, _AbstractCrdt);
    
      function LiveMap(entries) {
        var _this;
    
        _this = _AbstractCrdt.call(this) || this;
    
        _map$1.set(_assertThisInitialized(_this), {
          writable: true,
          value: void 0
        });
    
        if (entries) {
          var mappedEntries = [];
    
          for (var _iterator = _createForOfIteratorHelperLoose(entries), _step; !(_step = _iterator()).done;) {
            var entry = _step.value;
    
            var _value = selfOrRegister(entry[1]);
    
            _value._setParentLink(_assertThisInitialized(_this), entry[0]);
    
            mappedEntries.push([entry[0], _value]);
          }
    
          _classPrivateFieldSet(_assertThisInitialized(_this), _map$1, new Map(mappedEntries));
        } else {
          _classPrivateFieldSet(_assertThisInitialized(_this), _map$1, new Map());
        }
    
        return _this;
      }
    
      var _proto = LiveMap.prototype;
    
      _proto._serialize = function _serialize(parentId, parentKey, doc) {
        if (this._id == null) {
          throw new Error("Cannot serialize item is not attached");
        }
    
        if (parentId == null || parentKey == null) {
          throw new Error("Cannot serialize map if parentId or parentKey is undefined");
        }
    
        var ops = [];
        var op = {
          id: this._id,
          opId: doc == null ? void 0 : doc.generateOpId(),
          type: OpType.CreateMap,
          parentId: parentId,
          parentKey: parentKey
        };
        ops.push(op);
    
        for (var _iterator2 = _createForOfIteratorHelperLoose(_classPrivateFieldGet(this, _map$1)), _step2; !(_step2 = _iterator2()).done;) {
          var _step2$value = _step2.value,
              _key = _step2$value[0],
              _value2 = _step2$value[1];
          ops.push.apply(ops, _value2._serialize(this._id, _key, doc));
        }
    
        return ops;
      };
    
      LiveMap._deserialize = function _deserialize(_ref, parentToChildren, doc) {
        var id = _ref[0],
            item = _ref[1];
    
        if (item.type !== CrdtType.Map) {
          throw new Error("Tried to deserialize a map but item type is \"" + item.type + "\"");
        }
    
        var map = new LiveMap();
    
        map._attach(id, doc);
    
        var children = parentToChildren.get(id);
    
        if (children == null) {
          return map;
        }
    
        for (var _iterator3 = _createForOfIteratorHelperLoose(children), _step3; !(_step3 = _iterator3()).done;) {
          var entry = _step3.value;
          var crdt = entry[1];
    
          if (crdt.parentKey == null) {
            throw new Error("Tried to deserialize a crdt but it does not have a parentKey and is not the root");
          }
    
          var child = deserialize(entry, parentToChildren, doc);
    
          child._setParentLink(map, crdt.parentKey);
    
          _classPrivateFieldGet(map, _map$1).set(crdt.parentKey, child);
        }
    
        return map;
      };
    
      _proto._attach = function _attach(id, doc) {
        _AbstractCrdt.prototype._attach.call(this, id, doc);
    
        for (var _iterator4 = _createForOfIteratorHelperLoose(_classPrivateFieldGet(this, _map$1)), _step4; !(_step4 = _iterator4()).done;) {
          var _step4$value = _step4.value;
              _step4$value[0];
              var _value3 = _step4$value[1];
    
          if (isCrdt(_value3)) {
            _value3._attach(doc.generateId(), doc);
          }
        }
      };
    
      _proto._attachChild = function _attachChild(id, key, child, opId, isLocal) {
        var _updates;
    
        if (this._doc == null) {
          throw new Error("Can't attach child if doc is not present");
        }
    
        if (this._doc.getItem(id) !== undefined) {
          return {
            modified: false
          };
        }
    
        var previousValue = _classPrivateFieldGet(this, _map$1).get(key);
    
        var reverse;
    
        if (previousValue) {
          reverse = previousValue._serialize(this._id, key);
    
          previousValue._detach();
        } else {
          reverse = [{
            type: OpType.DeleteCrdt,
            id: id
          }];
        }
    
        child._setParentLink(this, key);
    
        child._attach(id, this._doc);
    
        _classPrivateFieldGet(this, _map$1).set(key, child);
    
        return {
          modified: {
            node: this,
            type: "LiveMap",
            updates: (_updates = {}, _updates[key] = {
              type: "update"
            }, _updates)
          },
          reverse: reverse
        };
      };
    
      _proto._detach = function _detach() {
        _AbstractCrdt.prototype._detach.call(this);
    
        for (var _iterator5 = _createForOfIteratorHelperLoose(_classPrivateFieldGet(this, _map$1).values()), _step5; !(_step5 = _iterator5()).done;) {
          var item = _step5.value;
    
          item._detach();
        }
      };
    
      _proto._detachChild = function _detachChild(child) {
        var _updates2;
    
        var reverse = child._serialize(this._id, child._parentKey, this._doc);
    
        for (var _iterator6 = _createForOfIteratorHelperLoose(_classPrivateFieldGet(this, _map$1)), _step6; !(_step6 = _iterator6()).done;) {
          var _step6$value = _step6.value,
              _key3 = _step6$value[0],
              _value4 = _step6$value[1];
    
          if (_value4 === child) {
            _classPrivateFieldGet(this, _map$1).delete(_key3);
          }
        }
    
        child._detach();
    
        var storageUpdate = {
          node: this,
          type: "LiveMap",
          updates: (_updates2 = {}, _updates2[child._parentKey] = {
            type: "delete"
          }, _updates2)
        };
        return {
          modified: storageUpdate,
          reverse: reverse
        };
      };
    
      _proto._toSerializedCrdt = function _toSerializedCrdt() {
        var _this$_parent;
    
        return {
          type: CrdtType.Map,
          parentId: (_this$_parent = this._parent) == null ? void 0 : _this$_parent._id,
          parentKey: this._parentKey
        };
      };
    
      _proto.get = function get(key) {
        var value = _classPrivateFieldGet(this, _map$1).get(key);
    
        if (value == undefined) {
          return undefined;
        }
    
        return selfOrRegisterValue(value);
      };
    
      _proto.set = function set(key, value) {
        var oldValue = _classPrivateFieldGet(this, _map$1).get(key);
    
        if (oldValue) {
          oldValue._detach();
        }
    
        var item = selfOrRegister(value);
    
        item._setParentLink(this, key);
    
        _classPrivateFieldGet(this, _map$1).set(key, item);
    
        if (this._doc && this._id) {
          var _updates3;
    
          var id = this._doc.generateId();
    
          item._attach(id, this._doc);
    
          var storageUpdates = new Map();
          storageUpdates.set(this._id, {
            node: this,
            type: "LiveMap",
            updates: (_updates3 = {}, _updates3[key] = {
              type: "update"
            }, _updates3)
          });
    
          this._doc.dispatch(item._serialize(this._id, key, this._doc), oldValue ? oldValue._serialize(this._id, key) : [{
            type: OpType.DeleteCrdt,
            id: id
          }], storageUpdates);
        }
      };
    
      _proto.has = function has(key) {
        return _classPrivateFieldGet(this, _map$1).has(key);
      };
    
      _proto.delete = function _delete(key) {
        var item = _classPrivateFieldGet(this, _map$1).get(key);
    
        if (item == null) {
          return false;
        }
    
        item._detach();
    
        if (this._doc && item._id) {
          var _updates4;
    
          var storageUpdates = new Map();
          storageUpdates.set(this._id, {
            node: this,
            type: "LiveMap",
            updates: (_updates4 = {}, _updates4[key] = {
              type: "delete"
            }, _updates4)
          });
    
          this._doc.dispatch([{
            type: OpType.DeleteCrdt,
            id: item._id,
            opId: this._doc.generateOpId()
          }], item._serialize(this._id, key), storageUpdates);
        }
    
        _classPrivateFieldGet(this, _map$1).delete(key);
    
        return true;
      };
    
      _proto.entries = function entries() {
        var _ref2;
    
        var innerIterator = _classPrivateFieldGet(this, _map$1).entries();
    
        return _ref2 = {}, _ref2[Symbol.iterator] = function () {
          return this;
        }, _ref2.next = function next() {
          var iteratorValue = innerIterator.next();
    
          if (iteratorValue.done) {
            return {
              done: true,
              value: undefined
            };
          }
    
          var entry = iteratorValue.value;
          return {
            value: [entry[0], selfOrRegisterValue(iteratorValue.value[1])]
          };
        }, _ref2;
      };
    
      _proto[_Symbol$iterator] = function () {
        return this.entries();
      };
    
      _proto.keys = function keys() {
        return _classPrivateFieldGet(this, _map$1).keys();
      };
    
      _proto.values = function values() {
        var _ref3;
    
        var innerIterator = _classPrivateFieldGet(this, _map$1).values();
    
        return _ref3 = {}, _ref3[Symbol.iterator] = function () {
          return this;
        }, _ref3.next = function next() {
          var iteratorValue = innerIterator.next();
    
          if (iteratorValue.done) {
            return {
              done: true,
              value: undefined
            };
          }
    
          return {
            value: selfOrRegisterValue(iteratorValue.value)
          };
        }, _ref3;
      };
    
      _proto.forEach = function forEach(callback) {
        for (var _iterator7 = _createForOfIteratorHelperLoose(this), _step7; !(_step7 = _iterator7()).done;) {
          var entry = _step7.value;
          callback(entry[1], entry[0], this);
        }
      };
    
      _createClass(LiveMap, [{
        key: "size",
        get: function get() {
          return _classPrivateFieldGet(this, _map$1).size;
        }
      }]);
    
      return LiveMap;
    }(AbstractCrdt);
    
    function remove(array, item) {
      for (var i = 0; i < array.length; i++) {
        if (array[i] === item) {
          array.splice(i, 1);
          break;
        }
      }
    }
    function isSameNodeOrChildOf(node, parent) {
      if (node === parent) {
        return true;
      }
    
      if (node._parent) {
        return isSameNodeOrChildOf(node._parent, parent);
      }
    
      return false;
    }
    function deserialize(entry, parentToChildren, doc) {
      switch (entry[1].type) {
        case CrdtType.Object:
          {
            return LiveObject._deserialize(entry, parentToChildren, doc);
          }
    
        case CrdtType.List:
          {
            return LiveList._deserialize(entry, parentToChildren, doc);
          }
    
        case CrdtType.Map:
          {
            return LiveMap._deserialize(entry, parentToChildren, doc);
          }
    
        case CrdtType.Register:
          {
            return LiveRegister._deserialize(entry, parentToChildren, doc);
          }
    
        default:
          {
            throw new Error("Unexpected CRDT type");
          }
      }
    }
    function isCrdt(obj) {
      return obj instanceof LiveObject || obj instanceof LiveMap || obj instanceof LiveList || obj instanceof LiveRegister;
    }
    function selfOrRegisterValue(obj) {
      if (obj instanceof LiveRegister) {
        return obj.data;
      }
    
      return obj;
    }
    function selfOrRegister(obj) {
      if (obj instanceof LiveObject || obj instanceof LiveMap || obj instanceof LiveList) {
        return obj;
      } else if (obj instanceof LiveRegister) {
        throw new Error("Internal error. LiveRegister should not be created from selfOrRegister");
      } else {
        return new LiveRegister(obj);
      }
    }
    function getTreesDiffOperations(currentItems, newItems) {
      var ops = [];
      currentItems.forEach(function (_, id) {
        if (!newItems.get(id)) {
          ops.push({
            type: OpType.DeleteCrdt,
            id: id
          });
        }
      });
      newItems.forEach(function (crdt, id) {
        var currentCrdt = currentItems.get(id);
    
        if (currentCrdt) {
          if (crdt.type === CrdtType.Object) {
            if (JSON.stringify(crdt.data) !== JSON.stringify(currentCrdt.data)) {
              ops.push({
                type: OpType.UpdateObject,
                id: id,
                data: crdt.data
              });
            }
          }
    
          if (crdt.parentKey !== currentCrdt.parentKey) {
            ops.push({
              type: OpType.SetParentKey,
              id: id,
              parentKey: crdt.parentKey
            });
          }
        } else {
          switch (crdt.type) {
            case CrdtType.Register:
              ops.push({
                type: OpType.CreateRegister,
                id: id,
                parentId: crdt.parentId,
                parentKey: crdt.parentKey,
                data: crdt.data
              });
              break;
    
            case CrdtType.List:
              ops.push({
                type: OpType.CreateList,
                id: id,
                parentId: crdt.parentId,
                parentKey: crdt.parentKey
              });
              break;
    
            case CrdtType.Object:
              ops.push({
                type: OpType.CreateObject,
                id: id,
                parentId: crdt.parentId,
                parentKey: crdt.parentKey,
                data: crdt.data
              });
              break;
    
            case CrdtType.Map:
              ops.push({
                type: OpType.CreateMap,
                id: id,
                parentId: crdt.parentId,
                parentKey: crdt.parentKey
              });
              break;
          }
        }
      });
      return ops;
    }
    function mergeStorageUpdates(first, second) {
      if (!first) {
        return second;
      }
    
      if (second.type === "LiveObject") {
        var updates = first.updates;
    
        for (var _i = 0, _Object$entries = Object.entries(second.updates); _i < _Object$entries.length; _i++) {
          var _Object$entries$_i = _Object$entries[_i],
              key = _Object$entries$_i[0],
              value = _Object$entries$_i[1];
          updates[key] = value;
        }
    
        return _extends({}, second, {
          updates: updates
        });
      } else if (second.type === "LiveMap") {
        var _updates = first.updates;
    
        for (var _i2 = 0, _Object$entries2 = Object.entries(second.updates); _i2 < _Object$entries2.length; _i2++) {
          var _Object$entries2$_i = _Object$entries2[_i2],
              _key = _Object$entries2$_i[0],
              _value = _Object$entries2$_i[1];
          _updates[_key] = _value;
        }
    
        return _extends({}, second, {
          updates: _updates
        });
      } else if (second.type === "LiveList") {
        var _updates2 = first.updates;
        return _extends({}, second, {
          updates: _updates2.concat(second.updates)
        });
      }
    
      return second;
    }
    
    function isPlain(value) {
      var type = typeof value;
      return type === "undefined" || value === null || type === "string" || type === "boolean" || type === "number" || Array.isArray(value) || isPlainObject$1(value);
    }
    
    function isPlainObject$1(value) {
      if (typeof value !== "object" || value === null) return false;
      var proto = Object.getPrototypeOf(value);
      if (proto === null) return true;
      var baseProto = proto;
    
      while (Object.getPrototypeOf(baseProto) !== null) {
        baseProto = Object.getPrototypeOf(baseProto);
      }
    
      return proto === baseProto;
    }
    
    function findNonSerializableValue(value, path) {
      if (path === void 0) {
        path = "";
      }
    
      if (!isPlain) {
        return {
          path: path || "root",
          value: value
        };
      }
    
      if (typeof value !== "object" || value === null) {
        return false;
      }
    
      for (var _i3 = 0, _Object$entries3 = Object.entries(value); _i3 < _Object$entries3.length; _i3++) {
        var _Object$entries3$_i = _Object$entries3[_i3],
            key = _Object$entries3$_i[0],
            nestedValue = _Object$entries3$_i[1];
        var nestedPath = path ? path + "." + key : key;
    
        if (!isPlain(nestedValue)) {
          return {
            path: nestedPath,
            value: nestedValue
          };
        }
    
        if (typeof nestedValue === "object") {
          var nonSerializableNestedValue = findNonSerializableValue(nestedValue, nestedPath);
    
          if (nonSerializableNestedValue) {
            return nonSerializableNestedValue;
          }
        }
      }
    
      return false;
    }
    
    var _map = new WeakMap();
    
    var _propToLastUpdate = new WeakMap();
    
    var _applyUpdate = new WeakSet();
    
    var _applyDeleteObjectKey = new WeakSet();
    
    var LiveObject = function (_AbstractCrdt) {
      _inheritsLoose(LiveObject, _AbstractCrdt);
    
      function LiveObject(object) {
        var _this;
    
        if (object === void 0) {
          object = {};
        }
    
        _this = _AbstractCrdt.call(this) || this;
    
        _applyDeleteObjectKey.add(_assertThisInitialized(_this));
    
        _applyUpdate.add(_assertThisInitialized(_this));
    
        _map.set(_assertThisInitialized(_this), {
          writable: true,
          value: void 0
        });
    
        _propToLastUpdate.set(_assertThisInitialized(_this), {
          writable: true,
          value: new Map()
        });
    
        for (var key in object) {
          var value = object[key];
    
          if (value instanceof AbstractCrdt) {
            value._setParentLink(_assertThisInitialized(_this), key);
          }
        }
    
        _classPrivateFieldSet(_assertThisInitialized(_this), _map, new Map(Object.entries(object)));
    
        return _this;
      }
    
      var _proto = LiveObject.prototype;
    
      _proto._serialize = function _serialize(parentId, parentKey, doc) {
        if (this._id == null) {
          throw new Error("Cannot serialize item is not attached");
        }
    
        var ops = [];
        var op = {
          id: this._id,
          opId: doc == null ? void 0 : doc.generateOpId(),
          type: OpType.CreateObject,
          parentId: parentId,
          parentKey: parentKey,
          data: {}
        };
        ops.push(op);
    
        for (var _iterator = _createForOfIteratorHelperLoose(_classPrivateFieldGet(this, _map)), _step; !(_step = _iterator()).done;) {
          var _step$value = _step.value,
              key = _step$value[0],
              value = _step$value[1];
    
          if (value instanceof AbstractCrdt) {
            ops.push.apply(ops, value._serialize(this._id, key, doc));
          } else {
            op.data[key] = value;
          }
        }
    
        return ops;
      };
    
      LiveObject._deserialize = function _deserialize(_ref, parentToChildren, doc) {
        var id = _ref[0],
            item = _ref[1];
    
        if (item.type !== CrdtType.Object) {
          throw new Error("Tried to deserialize a record but item type is \"" + item.type + "\"");
        }
    
        var object = new LiveObject(item.data);
    
        object._attach(id, doc);
    
        return this._deserializeChildren(object, parentToChildren, doc);
      };
    
      LiveObject._deserializeChildren = function _deserializeChildren(object, parentToChildren, doc) {
        var children = parentToChildren.get(object._id);
    
        if (children == null) {
          return object;
        }
    
        for (var _iterator2 = _createForOfIteratorHelperLoose(children), _step2; !(_step2 = _iterator2()).done;) {
          var entry = _step2.value;
          var crdt = entry[1];
    
          if (crdt.parentKey == null) {
            throw new Error("Tried to deserialize a crdt but it does not have a parentKey and is not the root");
          }
    
          var child = deserialize(entry, parentToChildren, doc);
    
          child._setParentLink(object, crdt.parentKey);
    
          _classPrivateFieldGet(object, _map).set(crdt.parentKey, child);
        }
    
        return object;
      };
    
      _proto._attach = function _attach(id, doc) {
        _AbstractCrdt.prototype._attach.call(this, id, doc);
    
        for (var _iterator3 = _createForOfIteratorHelperLoose(_classPrivateFieldGet(this, _map)), _step3; !(_step3 = _iterator3()).done;) {
          var _step3$value = _step3.value;
              _step3$value[0];
              var value = _step3$value[1];
    
          if (value instanceof AbstractCrdt) {
            value._attach(doc.generateId(), doc);
          }
        }
      };
    
      _proto._attachChild = function _attachChild(id, key, child, opId, isLocal) {
        var _updates;
    
        if (this._doc == null) {
          throw new Error("Can't attach child if doc is not present");
        }
    
        if (this._doc.getItem(id) !== undefined) {
          if (_classPrivateFieldGet(this, _propToLastUpdate).get(key) === opId) {
            _classPrivateFieldGet(this, _propToLastUpdate).delete(key);
          }
    
          return {
            modified: false
          };
        }
    
        if (isLocal) {
          _classPrivateFieldGet(this, _propToLastUpdate).set(key, opId);
        } else if (_classPrivateFieldGet(this, _propToLastUpdate).get(key) === undefined) ; else if (_classPrivateFieldGet(this, _propToLastUpdate).get(key) === opId) {
          _classPrivateFieldGet(this, _propToLastUpdate).delete(key);
    
          return {
            modified: false
          };
        } else {
          return {
            modified: false
          };
        }
    
        var previousValue = _classPrivateFieldGet(this, _map).get(key);
    
        var reverse;
    
        if (isCrdt(previousValue)) {
          reverse = previousValue._serialize(this._id, key);
    
          previousValue._detach();
        } else if (previousValue === undefined) {
          reverse = [{
            type: OpType.DeleteObjectKey,
            id: this._id,
            key: key
          }];
        } else {
          var _data;
    
          reverse = [{
            type: OpType.UpdateObject,
            id: this._id,
            data: (_data = {}, _data[key] = previousValue, _data)
          }];
        }
    
        _classPrivateFieldGet(this, _map).set(key, child);
    
        child._setParentLink(this, key);
    
        child._attach(id, this._doc);
    
        return {
          reverse: reverse,
          modified: {
            node: this,
            type: "LiveObject",
            updates: (_updates = {}, _updates[key] = {
              type: "update"
            }, _updates)
          }
        };
      };
    
      _proto._detachChild = function _detachChild(child) {
        if (child) {
          var _updates2;
    
          var reverse = child._serialize(this._id, child._parentKey, this._doc);
    
          for (var _iterator4 = _createForOfIteratorHelperLoose(_classPrivateFieldGet(this, _map)), _step4; !(_step4 = _iterator4()).done;) {
            var _step4$value = _step4.value,
                key = _step4$value[0],
                value = _step4$value[1];
    
            if (value === child) {
              _classPrivateFieldGet(this, _map).delete(key);
            }
          }
    
          child._detach();
    
          var storageUpdate = {
            node: this,
            type: "LiveObject",
            updates: (_updates2 = {}, _updates2[child._parentKey] = {
              type: "delete"
            }, _updates2)
          };
          return {
            modified: storageUpdate,
            reverse: reverse
          };
        }
    
        return {
          modified: false
        };
      };
    
      _proto._detachChildren = function _detachChildren() {
        for (var _iterator5 = _createForOfIteratorHelperLoose(_classPrivateFieldGet(this, _map)), _step5; !(_step5 = _iterator5()).done;) {
          var _step5$value = _step5.value,
              key = _step5$value[0],
              value = _step5$value[1];
    
          _classPrivateFieldGet(this, _map).delete(key);
    
          value._detach();
        }
      };
    
      _proto._detach = function _detach() {
        _AbstractCrdt.prototype._detach.call(this);
    
        for (var _iterator6 = _createForOfIteratorHelperLoose(_classPrivateFieldGet(this, _map).values()), _step6; !(_step6 = _iterator6()).done;) {
          var value = _step6.value;
    
          if (isCrdt(value)) {
            value._detach();
          }
        }
      };
    
      _proto._apply = function _apply(op, isLocal) {
        if (op.type === OpType.UpdateObject) {
          return _classPrivateMethodGet(this, _applyUpdate, _applyUpdate2).call(this, op, isLocal);
        } else if (op.type === OpType.DeleteObjectKey) {
          return _classPrivateMethodGet(this, _applyDeleteObjectKey, _applyDeleteObjectKey2).call(this, op);
        }
    
        return _AbstractCrdt.prototype._apply.call(this, op, isLocal);
      };
    
      _proto._toSerializedCrdt = function _toSerializedCrdt() {
        var _this$_parent;
    
        return {
          type: CrdtType.Object,
          parentId: (_this$_parent = this._parent) == null ? void 0 : _this$_parent._id,
          parentKey: this._parentKey,
          data: this.toObject()
        };
      };
    
      _proto.toObject = function toObject() {
        return Object.fromEntries(_classPrivateFieldGet(this, _map));
      };
    
      _proto.set = function set(key, value) {
        var _this$update;
    
        this.update((_this$update = {}, _this$update[key] = value, _this$update));
      };
    
      _proto.get = function get(key) {
        return _classPrivateFieldGet(this, _map).get(key);
      };
    
      _proto.delete = function _delete(key) {
        var _updates3;
    
        var keyAsString = key;
    
        var oldValue = _classPrivateFieldGet(this, _map).get(keyAsString);
    
        if (oldValue === undefined) {
          return;
        }
    
        if (this._doc == null || this._id == null) {
          if (oldValue instanceof AbstractCrdt) {
            oldValue._detach();
          }
    
          _classPrivateFieldGet(this, _map).delete(keyAsString);
    
          return;
        }
    
        var reverse;
    
        if (oldValue instanceof AbstractCrdt) {
          oldValue._detach();
    
          reverse = oldValue._serialize(this._id, keyAsString);
        } else {
          var _data2;
    
          reverse = [{
            type: OpType.UpdateObject,
            data: (_data2 = {}, _data2[keyAsString] = oldValue, _data2),
            id: this._id
          }];
        }
    
        _classPrivateFieldGet(this, _map).delete(keyAsString);
    
        var storageUpdates = new Map();
        storageUpdates.set(this._id, {
          node: this,
          type: "LiveObject",
          updates: (_updates3 = {}, _updates3[key] = {
            type: "delete"
          }, _updates3)
        });
    
        this._doc.dispatch([{
          type: OpType.DeleteObjectKey,
          key: keyAsString,
          id: this._id,
          opId: this._doc.generateOpId()
        }], reverse, storageUpdates);
      };
    
      _proto.update = function update(overrides) {
        var _this2 = this;
    
        if (this._doc == null || this._id == null) {
          for (var key in overrides) {
            var oldValue = _classPrivateFieldGet(this, _map).get(key);
    
            if (oldValue instanceof AbstractCrdt) {
              oldValue._detach();
            }
    
            var newValue = overrides[key];
    
            if (newValue instanceof AbstractCrdt) {
              newValue._setParentLink(this, key);
            }
    
            _classPrivateFieldGet(this, _map).set(key, newValue);
          }
    
          return;
        }
    
        var ops = [];
        var reverseOps = [];
    
        var opId = this._doc.generateOpId();
    
        var updatedProps = {};
        var reverseUpdateOp = {
          id: this._id,
          type: OpType.UpdateObject,
          data: {}
        };
        var updateDelta = {};
    
        for (var _key in overrides) {
          var _oldValue = _classPrivateFieldGet(this, _map).get(_key);
    
          if (_oldValue instanceof AbstractCrdt) {
            reverseOps.push.apply(reverseOps, _oldValue._serialize(this._id, _key));
    
            _oldValue._detach();
          } else if (_oldValue === undefined) {
            reverseOps.push({
              type: OpType.DeleteObjectKey,
              id: this._id,
              key: _key
            });
          } else {
            reverseUpdateOp.data[_key] = _oldValue;
          }
    
          var _newValue = overrides[_key];
    
          if (_newValue instanceof AbstractCrdt) {
            _newValue._setParentLink(this, _key);
    
            _newValue._attach(this._doc.generateId(), this._doc);
    
            var newAttachChildOps = _newValue._serialize(this._id, _key, this._doc);
    
            var createCrdtOp = newAttachChildOps.find(function (op) {
              return op.parentId === _this2._id;
            });
    
            if (createCrdtOp) {
              _classPrivateFieldGet(this, _propToLastUpdate).set(_key, createCrdtOp.opId);
            }
    
            ops.push.apply(ops, newAttachChildOps);
          } else {
            updatedProps[_key] = _newValue;
    
            _classPrivateFieldGet(this, _propToLastUpdate).set(_key, opId);
          }
    
          _classPrivateFieldGet(this, _map).set(_key, _newValue);
    
          updateDelta[_key] = {
            type: "update"
          };
        }
    
        if (Object.keys(reverseUpdateOp.data).length !== 0) {
          reverseOps.unshift(reverseUpdateOp);
        }
    
        if (Object.keys(updatedProps).length !== 0) {
          ops.unshift({
            opId: opId,
            id: this._id,
            type: OpType.UpdateObject,
            data: updatedProps
          });
        }
    
        var storageUpdates = new Map();
        storageUpdates.set(this._id, {
          node: this,
          type: "LiveObject",
          updates: updateDelta
        });
    
        this._doc.dispatch(ops, reverseOps, storageUpdates);
      };
    
      return LiveObject;
    }(AbstractCrdt);
    
    function _applyUpdate2(op, isLocal) {
      var isModified = false;
      var reverse = [];
      var reverseUpdate = {
        type: OpType.UpdateObject,
        id: this._id,
        data: {}
      };
      reverse.push(reverseUpdate);
    
      for (var key in op.data) {
        var oldValue = _classPrivateFieldGet(this, _map).get(key);
    
        if (oldValue instanceof AbstractCrdt) {
          reverse.push.apply(reverse, oldValue._serialize(this._id, key));
    
          oldValue._detach();
        } else if (oldValue !== undefined) {
          reverseUpdate.data[key] = oldValue;
        } else if (oldValue === undefined) {
          reverse.push({
            type: OpType.DeleteObjectKey,
            id: this._id,
            key: key
          });
        }
      }
    
      var updateDelta = {};
    
      for (var _key2 in op.data) {
        if (isLocal) {
          _classPrivateFieldGet(this, _propToLastUpdate).set(_key2, op.opId);
        } else if (_classPrivateFieldGet(this, _propToLastUpdate).get(_key2) == null) {
          isModified = true;
        } else if (_classPrivateFieldGet(this, _propToLastUpdate).get(_key2) === op.opId) {
          _classPrivateFieldGet(this, _propToLastUpdate).delete(_key2);
    
          continue;
        } else {
          continue;
        }
    
        var _oldValue2 = _classPrivateFieldGet(this, _map).get(_key2);
    
        if (isCrdt(_oldValue2)) {
          _oldValue2._detach();
        }
    
        isModified = true;
        updateDelta[_key2] = {
          type: "update"
        };
    
        _classPrivateFieldGet(this, _map).set(_key2, op.data[_key2]);
      }
    
      if (Object.keys(reverseUpdate.data).length !== 0) {
        reverse.unshift(reverseUpdate);
      }
    
      return isModified ? {
        modified: {
          node: this,
          type: "LiveObject",
          updates: updateDelta
        },
        reverse: reverse
      } : {
        modified: false
      };
    }
    
    function _applyDeleteObjectKey2(op) {
      var _updates4;
    
      var key = op.key;
    
      if (_classPrivateFieldGet(this, _map).has(key) === false) {
        return {
          modified: false
        };
      }
    
      if (_classPrivateFieldGet(this, _propToLastUpdate).get(key) !== undefined) {
        return {
          modified: false
        };
      }
    
      var oldValue = _classPrivateFieldGet(this, _map).get(key);
    
      var reverse = [];
    
      if (isCrdt(oldValue)) {
        reverse = oldValue._serialize(this._id, op.key);
    
        oldValue._detach();
      } else if (oldValue !== undefined) {
        var _data3;
    
        reverse = [{
          type: OpType.UpdateObject,
          id: this._id,
          data: (_data3 = {}, _data3[key] = oldValue, _data3)
        }];
      }
    
      _classPrivateFieldGet(this, _map).delete(key);
    
      return {
        modified: {
          node: this,
          type: "LiveObject",
          updates: (_updates4 = {}, _updates4[op.key] = {
            type: "delete"
          }, _updates4)
        },
        reverse: reverse
      };
    }
    
    var BACKOFF_RETRY_DELAYS = [250, 500, 1000, 2000, 4000, 8000, 10000];
    var HEARTBEAT_INTERVAL = 30000;
    var PONG_TIMEOUT = 2000;
    
    function isValidRoomEventType(value) {
      return value === "my-presence" || value === "others" || value === "event" || value === "error" || value === "connection";
    }
    
    function makeIdFactory(connectionId) {
      var count = 0;
      return function () {
        return connectionId + ":" + count++;
      };
    }
    
    function makeOthers(presenceMap) {
      var _ref;
    
      var array = Object.values(presenceMap);
      return _ref = {
        get count() {
          return array.length;
        }
    
      }, _ref[Symbol.iterator] = function () {
        return array[Symbol.iterator]();
      }, _ref.map = function map(callback) {
        return array.map(callback);
      }, _ref.toArray = function toArray() {
        return array;
      }, _ref;
    }
    
    function makeStateMachine(state, context, mockedEffects) {
      var effects = mockedEffects || {
        authenticate: function authenticate(auth, createWebSocket) {
          return auth(context.room).then(function (_ref2) {
            var token = _ref2.token;
            var parsedToken = parseToken(token);
            var socket = createWebSocket(token);
            authenticationSuccess(parsedToken, socket);
          }).catch(function (er) {
            return authenticationFailure(er);
          });
        },
        send: function send(messageOrMessages) {
          if (state.socket == null) {
            throw new Error("Can't send message if socket is null");
          }
    
          state.socket.send(JSON.stringify(messageOrMessages));
        },
        delayFlush: function delayFlush(delay) {
          return setTimeout(tryFlushing, delay);
        },
        startHeartbeatInterval: function startHeartbeatInterval() {
          return setInterval(heartbeat, HEARTBEAT_INTERVAL);
        },
        schedulePongTimeout: function schedulePongTimeout() {
          return setTimeout(pongTimeout, PONG_TIMEOUT);
        },
        scheduleReconnect: function scheduleReconnect(delay) {
          return setTimeout(connect, delay);
        }
      };
    
      function genericSubscribe(callback) {
        state.listeners.storage.push(callback);
        return function () {
          return remove(state.listeners.storage, callback);
        };
      }
    
      function crdtSubscribe(crdt, innerCallback, options) {
        var cb = function cb(updates) {
          var relatedUpdates = [];
    
          for (var _iterator = _createForOfIteratorHelperLoose(updates), _step; !(_step = _iterator()).done;) {
            var update = _step.value;
    
            if (options != null && options.isDeep && isSameNodeOrChildOf(update.node, crdt)) {
              relatedUpdates.push(update);
            } else if (update.node._id === crdt._id) {
              innerCallback(update.node);
            }
          }
    
          if (options != null && options.isDeep && relatedUpdates.length > 0) {
            innerCallback(relatedUpdates);
          }
        };
    
        return genericSubscribe(cb);
      }
    
      function createOrUpdateRootFromMessage(message) {
        if (message.items.length === 0) {
          throw new Error("Internal error: cannot load storage without items");
        }
    
        if (state.root) {
          updateRoot(message.items);
        } else {
          state.root = load(message.items);
        }
    
        for (var _key2 in state.defaultStorageRoot) {
          if (state.root.get(_key2) == null) {
            state.root.set(_key2, state.defaultStorageRoot[_key2]);
          }
        }
      }
    
      function buildRootAndParentToChildren(items) {
        var parentToChildren = new Map();
        var root = null;
    
        for (var _iterator2 = _createForOfIteratorHelperLoose(items), _step2; !(_step2 = _iterator2()).done;) {
          var tuple = _step2.value;
          var parentId = tuple[1].parentId;
    
          if (parentId == null) {
            root = tuple;
          } else {
            var children = parentToChildren.get(parentId);
    
            if (children != null) {
              children.push(tuple);
            } else {
              parentToChildren.set(parentId, [tuple]);
            }
          }
        }
    
        if (root == null) {
          throw new Error("Root can't be null");
        }
    
        return [root, parentToChildren];
      }
    
      function updateRoot(items) {
        if (!state.root) {
          return;
        }
    
        var currentItems = new Map();
        state.items.forEach(function (liveCrdt, id) {
          currentItems.set(id, liveCrdt._toSerializedCrdt());
        });
        var ops = getTreesDiffOperations(currentItems, new Map(items));
        var result = apply(ops, false);
        notify(result.updates);
      }
    
      function load(items) {
        var _buildRootAndParentTo = buildRootAndParentToChildren(items),
            root = _buildRootAndParentTo[0],
            parentToChildren = _buildRootAndParentTo[1];
    
        return LiveObject._deserialize(root, parentToChildren, {
          getItem: getItem,
          addItem: addItem,
          deleteItem: deleteItem,
          generateId: generateId,
          generateOpId: generateOpId,
          dispatch: storageDispatch,
          roomId: context.room
        });
      }
    
      function addItem(id, item) {
        state.items.set(id, item);
      }
    
      function deleteItem(id) {
        state.items.delete(id);
      }
    
      function getItem(id) {
        return state.items.get(id);
      }
    
      function addToUndoStack(historyItem) {
        if (state.undoStack.length >= 50) {
          state.undoStack.shift();
        }
    
        if (state.isHistoryPaused) {
          var _state$pausedHistory;
    
          (_state$pausedHistory = state.pausedHistory).unshift.apply(_state$pausedHistory, historyItem);
        } else {
          state.undoStack.push(historyItem);
        }
      }
    
      function storageDispatch(ops, reverse, storageUpdates) {
        if (state.isBatching) {
          var _state$batch$ops, _state$batch$reverseO;
    
          (_state$batch$ops = state.batch.ops).push.apply(_state$batch$ops, ops);
    
          storageUpdates.forEach(function (value, key) {
            state.batch.updates.storageUpdates.set(key, mergeStorageUpdates(state.batch.updates.storageUpdates.get(key), value));
          });
    
          (_state$batch$reverseO = state.batch.reverseOps).push.apply(_state$batch$reverseO, reverse);
        } else {
          addToUndoStack(reverse);
          state.redoStack = [];
          dispatch(ops);
          notify({
            storageUpdates: storageUpdates
          });
        }
      }
    
      function notify(_ref3) {
        var _ref3$storageUpdates = _ref3.storageUpdates,
            storageUpdates = _ref3$storageUpdates === void 0 ? new Map() : _ref3$storageUpdates,
            _ref3$presence = _ref3.presence,
            presence = _ref3$presence === void 0 ? false : _ref3$presence,
            _ref3$others = _ref3.others,
            others = _ref3$others === void 0 ? [] : _ref3$others;
    
        if (others.length > 0) {
          state.others = makeOthers(state.users);
    
          for (var _iterator3 = _createForOfIteratorHelperLoose(others), _step3; !(_step3 = _iterator3()).done;) {
            var event = _step3.value;
    
            for (var _iterator4 = _createForOfIteratorHelperLoose(state.listeners["others"]), _step4; !(_step4 = _iterator4()).done;) {
              var _listener = _step4.value;
    
              _listener(state.others, event);
            }
          }
        }
    
        if (presence) {
          for (var _iterator5 = _createForOfIteratorHelperLoose(state.listeners["my-presence"]), _step5; !(_step5 = _iterator5()).done;) {
            var _listener2 = _step5.value;
    
            _listener2(state.me);
          }
        }
    
        if (storageUpdates.size > 0) {
          for (var _iterator6 = _createForOfIteratorHelperLoose(state.listeners.storage), _step6; !(_step6 = _iterator6()).done;) {
            var subscriber = _step6.value;
            subscriber(Array.from(storageUpdates.values()));
          }
        }
      }
    
      function getConnectionId() {
        if (state.connection.state === "open" || state.connection.state === "connecting") {
          return state.connection.id;
        } else if (state.lastConnectionId !== null) {
          return state.lastConnectionId;
        }
    
        throw new Error("Internal. Tried to get connection id but connection was never open");
      }
    
      function generateId() {
        return getConnectionId() + ":" + state.clock++;
      }
    
      function generateOpId() {
        return getConnectionId() + ":" + state.opClock++;
      }
    
      function apply(item, isLocal) {
        var result = {
          reverse: [],
          updates: {
            storageUpdates: new Map(),
            presence: false
          }
        };
    
        for (var _iterator7 = _createForOfIteratorHelperLoose(item), _step7; !(_step7 = _iterator7()).done;) {
          var op = _step7.value;
    
          if (op.type === "presence") {
            var reverse = {
              type: "presence",
              data: {}
            };
    
            for (var _key3 in op.data) {
              reverse.data[_key3] = state.me[_key3];
            }
    
            state.me = _extends({}, state.me, op.data);
    
            if (state.buffer.presence == null) {
              state.buffer.presence = op.data;
            } else {
              for (var _key4 in op.data) {
                state.buffer.presence[_key4] = op.data;
              }
            }
    
            result.reverse.unshift(reverse);
            result.updates.presence = true;
          } else {
            if (isLocal && !op.opId) {
              op.opId = generateOpId();
            }
    
            var applyOpResult = applyOp(op, isLocal);
    
            if (applyOpResult.modified) {
              var _result$reverse;
    
              result.updates.storageUpdates.set(applyOpResult.modified.node._id, mergeStorageUpdates(result.updates.storageUpdates.get(applyOpResult.modified.node._id), applyOpResult.modified));
    
              (_result$reverse = result.reverse).unshift.apply(_result$reverse, applyOpResult.reverse);
            }
          }
        }
    
        return result;
      }
    
      function applyOp(op, isLocal) {
        if (op.opId) {
          state.offlineOperations.delete(op.opId);
        }
    
        switch (op.type) {
          case OpType.DeleteObjectKey:
          case OpType.UpdateObject:
          case OpType.DeleteCrdt:
            {
              var item = state.items.get(op.id);
    
              if (item == null) {
                return {
                  modified: false
                };
              }
    
              return item._apply(op, isLocal);
            }
    
          case OpType.SetParentKey:
            {
              var _item = state.items.get(op.id);
    
              if (_item == null) {
                return {
                  modified: false
                };
              }
    
              if (_item._parent instanceof LiveList) {
                var previousKey = _item._parentKey;
    
                if (previousKey === op.parentKey) {
                  return {
                    modified: false
                  };
                } else {
                  return _item._parent._setChildKey(op.parentKey, _item, previousKey);
                }
              }
    
              return {
                modified: false
              };
            }
    
          case OpType.CreateObject:
            {
              var parent = state.items.get(op.parentId);
    
              if (parent == null) {
                return {
                  modified: false
                };
              }
    
              return parent._attachChild(op.id, op.parentKey, new LiveObject(op.data), op.opId, isLocal);
            }
    
          case OpType.CreateList:
            {
              var _parent = state.items.get(op.parentId);
    
              if (_parent == null) {
                return {
                  modified: false
                };
              }
    
              return _parent._attachChild(op.id, op.parentKey, new LiveList(), op.opId, isLocal);
            }
    
          case OpType.CreateRegister:
            {
              var _parent2 = state.items.get(op.parentId);
    
              if (_parent2 == null) {
                return {
                  modified: false
                };
              }
    
              return _parent2._attachChild(op.id, op.parentKey, new LiveRegister(op.data), op.opId, isLocal);
            }
    
          case OpType.CreateMap:
            {
              var _parent3 = state.items.get(op.parentId);
    
              if (_parent3 == null) {
                return {
                  modified: false
                };
              }
    
              return _parent3._attachChild(op.id, op.parentKey, new LiveMap(), op.opId, isLocal);
            }
        }
    
        return {
          modified: false
        };
      }
    
      function subscribe(firstParam, listener, options) {
        if (firstParam instanceof AbstractCrdt) {
          return crdtSubscribe(firstParam, listener, options);
        } else if (typeof firstParam === "function") {
          return genericSubscribe(firstParam);
        } else if (!isValidRoomEventType(firstParam)) {
          throw new Error("\"" + firstParam + "\" is not a valid event name");
        }
    
        state.listeners[firstParam].push(listener);
        return function () {
          var callbacks = state.listeners[firstParam];
          remove(callbacks, listener);
        };
      }
    
      function unsubscribe(event, callback) {
        console.warn("unsubscribe is depreacted and will be removed in a future version.\nuse the callback returned by subscribe instead.\nSee v0.13 release notes for more information.\n");
    
        if (!isValidRoomEventType(event)) {
          throw new Error("\"" + event + "\" is not a valid event name");
        }
    
        var callbacks = state.listeners[event];
        remove(callbacks, callback);
      }
    
      function getConnectionState() {
        return state.connection.state;
      }
    
      function getSelf() {
        return state.connection.state === "open" || state.connection.state === "connecting" ? {
          connectionId: state.connection.id,
          id: state.connection.userId,
          info: state.connection.userInfo,
          presence: getPresence()
        } : null;
      }
    
      function connect() {
        if (state.connection.state !== "closed" && state.connection.state !== "unavailable") {
          return null;
        }
    
        var auth = prepareAuthEndpoint(context.authentication, context.fetchPolyfill);
        var createWebSocket = prepareCreateWebSocket(context.liveblocksServer, context.WebSocketPolyfill);
        updateConnection({
          state: "authenticating"
        });
        effects.authenticate(auth, createWebSocket);
      }
    
      function updatePresence(overrides, options) {
        var oldValues = {};
    
        if (state.buffer.presence == null) {
          state.buffer.presence = {};
        }
    
        for (var _key5 in overrides) {
          state.buffer.presence[_key5] = overrides[_key5];
          oldValues[_key5] = state.me[_key5];
        }
    
        state.me = _extends({}, state.me, overrides);
    
        if (state.isBatching) {
          if (options != null && options.addToHistory) {
            state.batch.reverseOps.push({
              type: "presence",
              data: oldValues
            });
          }
    
          state.batch.updates.presence = true;
        } else {
          tryFlushing();
    
          if (options != null && options.addToHistory) {
            addToUndoStack([{
              type: "presence",
              data: oldValues
            }]);
          }
    
          notify({
            presence: true
          });
        }
      }
    
      function authenticationSuccess(token, socket) {
        socket.addEventListener("message", onMessage);
        socket.addEventListener("open", onOpen);
        socket.addEventListener("close", onClose);
        socket.addEventListener("error", onError);
        updateConnection({
          state: "connecting",
          id: token.actor,
          userInfo: token.info,
          userId: token.id
        });
        state.idFactory = makeIdFactory(token.actor);
        state.socket = socket;
      }
    
      function authenticationFailure(error) {
        if (process.env.NODE_ENV !== "production") {
          console.error("Call to authentication endpoint failed", error);
        }
    
        updateConnection({
          state: "unavailable"
        });
        state.numberOfRetry++;
        state.timeoutHandles.reconnect = effects.scheduleReconnect(getRetryDelay());
      }
    
      function onVisibilityChange(visibilityState) {
        if (visibilityState === "visible" && state.connection.state === "open") {
          heartbeat();
        }
      }
    
      function onUpdatePresenceMessage(message) {
        var user = state.users[message.actor];
    
        if (user == null) {
          state.users[message.actor] = {
            connectionId: message.actor,
            presence: message.data
          };
        } else {
          state.users[message.actor] = {
            id: user.id,
            info: user.info,
            connectionId: message.actor,
            presence: _extends({}, user.presence, message.data)
          };
        }
    
        return {
          type: "update",
          updates: message.data,
          user: state.users[message.actor]
        };
      }
    
      function onUserLeftMessage(message) {
        var userLeftMessage = message;
        var user = state.users[userLeftMessage.actor];
    
        if (user) {
          delete state.users[userLeftMessage.actor];
          return {
            type: "leave",
            user: user
          };
        }
    
        return null;
      }
    
      function onRoomStateMessage(message) {
        var newUsers = {};
    
        for (var _key6 in message.users) {
          var _connectionId = Number.parseInt(_key6);
    
          var user = message.users[_key6];
          newUsers[_connectionId] = {
            connectionId: _connectionId,
            info: user.info,
            id: user.id
          };
        }
    
        state.users = newUsers;
        return {
          type: "reset"
        };
      }
    
      function onNavigatorOnline() {
        if (state.connection.state === "unavailable") {
          reconnect();
        }
      }
    
      function onEvent(message) {
        for (var _iterator8 = _createForOfIteratorHelperLoose(state.listeners.event), _step8; !(_step8 = _iterator8()).done;) {
          var _listener3 = _step8.value;
    
          _listener3({
            connectionId: message.actor,
            event: message.event
          });
        }
      }
    
      function onUserJoinedMessage(message) {
        state.users[message.actor] = {
          connectionId: message.actor,
          info: message.info,
          id: message.id
        };
    
        if (state.me) {
          state.buffer.messages.push({
            type: ClientMessageType.UpdatePresence,
            data: state.me,
            targetActor: message.actor
          });
          tryFlushing();
        }
    
        return {
          type: "enter",
          user: state.users[message.actor]
        };
      }
    
      function onMessage(event) {
        if (event.data === "pong") {
          clearTimeout(state.timeoutHandles.pongTimeout);
          return;
        }
    
        var message = JSON.parse(event.data);
        var subMessages = [];
    
        if (Array.isArray(message)) {
          subMessages = message;
        } else {
          subMessages.push(message);
        }
    
        var updates = {
          storageUpdates: new Map(),
          others: []
        };
    
        for (var _iterator9 = _createForOfIteratorHelperLoose(subMessages), _step9; !(_step9 = _iterator9()).done;) {
          var subMessage = _step9.value;
    
          switch (subMessage.type) {
            case ServerMessageType.UserJoined:
              {
                updates.others.push(onUserJoinedMessage(message));
                break;
              }
    
            case ServerMessageType.UpdatePresence:
              {
                updates.others.push(onUpdatePresenceMessage(subMessage));
                break;
              }
    
            case ServerMessageType.Event:
              {
                onEvent(subMessage);
                break;
              }
    
            case ServerMessageType.UserLeft:
              {
                var _event = onUserLeftMessage(subMessage);
    
                if (_event) {
                  updates.others.push(_event);
                }
    
                break;
              }
    
            case ServerMessageType.RoomState:
              {
                updates.others.push(onRoomStateMessage(subMessage));
                break;
              }
    
            case ServerMessageType.InitialStorageState:
              {
                createOrUpdateRootFromMessage(subMessage);
                applyAndSendOfflineOps();
                _getInitialStateResolver == null ? void 0 : _getInitialStateResolver();
                break;
              }
    
            case ServerMessageType.UpdateStorage:
              {
                var applyResult = apply(subMessage.ops, false);
                applyResult.updates.storageUpdates.forEach(function (value, key) {
                  updates.storageUpdates.set(key, mergeStorageUpdates(updates.storageUpdates.get(key), value));
                });
                break;
              }
          }
        }
    
        notify(updates);
      }
    
      function onClose(event) {
        state.socket = null;
        clearTimeout(state.timeoutHandles.pongTimeout);
        clearInterval(state.intervalHandles.heartbeat);
    
        if (state.timeoutHandles.flush) {
          clearTimeout(state.timeoutHandles.flush);
        }
    
        clearTimeout(state.timeoutHandles.reconnect);
        state.users = {};
        notify({
          others: [{
            type: "reset"
          }]
        });
    
        if (event.code >= 4000 && event.code <= 4100) {
          updateConnection({
            state: "failed"
          });
          var error = new LiveblocksError(event.reason, event.code);
    
          for (var _iterator10 = _createForOfIteratorHelperLoose(state.listeners.error), _step10; !(_step10 = _iterator10()).done;) {
            var _listener4 = _step10.value;
    
            if (process.env.NODE_ENV !== "production") {
              console.error("Connection to Liveblocks websocket server closed. Reason: " + error.message + " (code: " + error.code + ")");
            }
    
            _listener4(error);
          }
        } else if (event.wasClean === false) {
          state.numberOfRetry++;
    
          var _delay = getRetryDelay();
    
          if (process.env.NODE_ENV !== "production") {
            console.warn("Connection to Liveblocks websocket server closed (code: " + event.code + "). Retrying in " + _delay + "ms.");
          }
    
          updateConnection({
            state: "unavailable"
          });
          state.timeoutHandles.reconnect = effects.scheduleReconnect(_delay);
        } else {
          updateConnection({
            state: "closed"
          });
        }
      }
    
      function updateConnection(connection) {
        state.connection = connection;
    
        for (var _iterator11 = _createForOfIteratorHelperLoose(state.listeners.connection), _step11; !(_step11 = _iterator11()).done;) {
          var _listener5 = _step11.value;
    
          _listener5(connection.state);
        }
      }
    
      function getRetryDelay() {
        return BACKOFF_RETRY_DELAYS[state.numberOfRetry < BACKOFF_RETRY_DELAYS.length ? state.numberOfRetry : BACKOFF_RETRY_DELAYS.length - 1];
      }
    
      function onError() {}
    
      function onOpen() {
        clearInterval(state.intervalHandles.heartbeat);
        state.intervalHandles.heartbeat = effects.startHeartbeatInterval();
    
        if (state.connection.state === "connecting") {
          updateConnection(_extends({}, state.connection, {
            state: "open"
          }));
          state.numberOfRetry = 0;
    
          if (state.lastConnectionId !== undefined) {
            state.buffer.presence = state.me;
            tryFlushing();
          }
    
          state.lastConnectionId = state.connection.id;
    
          if (state.root) {
            state.buffer.messages.push({
              type: ClientMessageType.FetchStorage
            });
          }
    
          tryFlushing();
        }
      }
    
      function heartbeat() {
        if (state.socket == null) {
          return;
        }
    
        clearTimeout(state.timeoutHandles.pongTimeout);
        state.timeoutHandles.pongTimeout = effects.schedulePongTimeout();
    
        if (state.socket.readyState === state.socket.OPEN) {
          state.socket.send("ping");
        }
      }
    
      function pongTimeout() {
        reconnect();
      }
    
      function reconnect() {
        if (state.socket) {
          state.socket.removeEventListener("open", onOpen);
          state.socket.removeEventListener("message", onMessage);
          state.socket.removeEventListener("close", onClose);
          state.socket.removeEventListener("error", onError);
          state.socket.close();
          state.socket = null;
        }
    
        updateConnection({
          state: "unavailable"
        });
        clearTimeout(state.timeoutHandles.pongTimeout);
    
        if (state.timeoutHandles.flush) {
          clearTimeout(state.timeoutHandles.flush);
        }
    
        clearTimeout(state.timeoutHandles.reconnect);
        clearInterval(state.intervalHandles.heartbeat);
        connect();
      }
    
      function applyAndSendOfflineOps() {
        if (state.offlineOperations.size === 0) {
          return;
        }
    
        var messages = [];
        var ops = Array.from(state.offlineOperations.values());
        var result = apply(ops, true);
        messages.push({
          type: ClientMessageType.UpdateStorage,
          ops: ops
        });
        notify(result.updates);
        effects.send(messages);
      }
    
      function tryFlushing() {
        var storageOps = state.buffer.storageOperations;
    
        if (storageOps.length > 0) {
          storageOps.forEach(function (op) {
            state.offlineOperations.set(op.opId, op);
          });
        }
    
        if (state.socket == null || state.socket.readyState !== state.socket.OPEN) {
          state.buffer.storageOperations = [];
          return;
        }
    
        var now = Date.now();
        var elapsedTime = now - state.lastFlushTime;
    
        if (elapsedTime > context.throttleDelay) {
          var _messages = flushDataToMessages(state);
    
          if (_messages.length === 0) {
            return;
          }
    
          effects.send(_messages);
          state.buffer = {
            messages: [],
            storageOperations: [],
            presence: null
          };
          state.lastFlushTime = now;
        } else {
          if (state.timeoutHandles.flush != null) {
            clearTimeout(state.timeoutHandles.flush);
          }
    
          state.timeoutHandles.flush = effects.delayFlush(context.throttleDelay - (now - state.lastFlushTime));
        }
      }
    
      function flushDataToMessages(state) {
        var messages = [];
    
        if (state.buffer.presence) {
          messages.push({
            type: ClientMessageType.UpdatePresence,
            data: state.buffer.presence
          });
        }
    
        for (var _iterator12 = _createForOfIteratorHelperLoose(state.buffer.messages), _step12; !(_step12 = _iterator12()).done;) {
          var event = _step12.value;
          messages.push(event);
        }
    
        if (state.buffer.storageOperations.length > 0) {
          messages.push({
            type: ClientMessageType.UpdateStorage,
            ops: state.buffer.storageOperations
          });
        }
    
        return messages;
      }
    
      function disconnect() {
        if (state.socket) {
          state.socket.removeEventListener("open", onOpen);
          state.socket.removeEventListener("message", onMessage);
          state.socket.removeEventListener("close", onClose);
          state.socket.removeEventListener("error", onError);
          state.socket.close();
          state.socket = null;
        }
    
        updateConnection({
          state: "closed"
        });
    
        if (state.timeoutHandles.flush) {
          clearTimeout(state.timeoutHandles.flush);
        }
    
        clearTimeout(state.timeoutHandles.reconnect);
        clearTimeout(state.timeoutHandles.pongTimeout);
        clearInterval(state.intervalHandles.heartbeat);
        state.users = {};
        notify({
          others: [{
            type: "reset"
          }]
        });
        clearListeners();
      }
    
      function clearListeners() {
        for (var _key7 in state.listeners) {
          state.listeners[_key7] = [];
        }
      }
    
      function getPresence() {
        return state.me;
      }
    
      function getOthers() {
        return state.others;
      }
    
      function broadcastEvent(event, options) {
        if (options === void 0) {
          options = {
            shouldQueueEventIfNotReady: false
          };
        }
    
        if (state.socket == null && options.shouldQueueEventIfNotReady == false) {
          return;
        }
    
        state.buffer.messages.push({
          type: ClientMessageType.ClientEvent,
          event: event
        });
        tryFlushing();
      }
    
      function dispatch(ops) {
        var _state$buffer$storage;
    
        (_state$buffer$storage = state.buffer.storageOperations).push.apply(_state$buffer$storage, ops);
    
        tryFlushing();
      }
    
      var _getInitialStatePromise = null;
      var _getInitialStateResolver = null;
    
      function getStorage() {
        if (state.root) {
          return new Promise(function (resolve) {
            return resolve({
              root: state.root
            });
          });
        }
    
        if (_getInitialStatePromise == null) {
          state.buffer.messages.push({
            type: ClientMessageType.FetchStorage
          });
          tryFlushing();
          _getInitialStatePromise = new Promise(function (resolve) {
            return _getInitialStateResolver = resolve;
          });
        }
    
        return _getInitialStatePromise.then(function () {
          return {
            root: state.root
          };
        });
      }
    
      function undo() {
        if (state.isBatching) {
          throw new Error("undo is not allowed during a batch");
        }
    
        var historyItem = state.undoStack.pop();
    
        if (historyItem == null) {
          return;
        }
    
        state.isHistoryPaused = false;
        var result = apply(historyItem, true);
        notify(result.updates);
        state.redoStack.push(result.reverse);
    
        for (var _iterator13 = _createForOfIteratorHelperLoose(historyItem), _step13; !(_step13 = _iterator13()).done;) {
          var op = _step13.value;
    
          if (op.type !== "presence") {
            state.buffer.storageOperations.push(op);
          }
        }
    
        tryFlushing();
      }
    
      function redo() {
        if (state.isBatching) {
          throw new Error("redo is not allowed during a batch");
        }
    
        var historyItem = state.redoStack.pop();
    
        if (historyItem == null) {
          return;
        }
    
        state.isHistoryPaused = false;
        var result = apply(historyItem, true);
        notify(result.updates);
        state.undoStack.push(result.reverse);
    
        for (var _iterator14 = _createForOfIteratorHelperLoose(historyItem), _step14; !(_step14 = _iterator14()).done;) {
          var op = _step14.value;
    
          if (op.type !== "presence") {
            state.buffer.storageOperations.push(op);
          }
        }
    
        tryFlushing();
      }
    
      function batch(callback) {
        if (state.isBatching) {
          throw new Error("batch should not be called during a batch");
        }
    
        state.isBatching = true;
    
        try {
          callback();
        } finally {
          state.isBatching = false;
    
          if (state.batch.reverseOps.length > 0) {
            addToUndoStack(state.batch.reverseOps);
          }
    
          if (state.batch.ops.length > 0) {
            state.redoStack = [];
          }
    
          if (state.batch.ops.length > 0) {
            dispatch(state.batch.ops);
          }
    
          notify(state.batch.updates);
          state.batch = {
            ops: [],
            reverseOps: [],
            updates: {
              others: [],
              storageUpdates: new Map(),
              presence: false
            }
          };
          tryFlushing();
        }
      }
    
      function pauseHistory() {
        state.pausedHistory = [];
        state.isHistoryPaused = true;
      }
    
      function resumeHistory() {
        state.isHistoryPaused = false;
    
        if (state.pausedHistory.length > 0) {
          addToUndoStack(state.pausedHistory);
        }
    
        state.pausedHistory = [];
      }
    
      function simulateSocketClose() {
        if (state.socket) {
          state.socket.close();
        }
      }
    
      function simulateSendCloseEvent(event) {
        if (state.socket) {
          onClose(event);
        }
      }
    
      return {
        onClose: onClose,
        onMessage: onMessage,
        authenticationSuccess: authenticationSuccess,
        heartbeat: heartbeat,
        onNavigatorOnline: onNavigatorOnline,
        simulateSocketClose: simulateSocketClose,
        simulateSendCloseEvent: simulateSendCloseEvent,
        onVisibilityChange: onVisibilityChange,
        getUndoStack: function getUndoStack() {
          return state.undoStack;
        },
        getItemsCount: function getItemsCount() {
          return state.items.size;
        },
        connect: connect,
        disconnect: disconnect,
        subscribe: subscribe,
        unsubscribe: unsubscribe,
        updatePresence: updatePresence,
        broadcastEvent: broadcastEvent,
        batch: batch,
        undo: undo,
        redo: redo,
        pauseHistory: pauseHistory,
        resumeHistory: resumeHistory,
        getStorage: getStorage,
        selectors: {
          getConnectionState: getConnectionState,
          getSelf: getSelf,
          getPresence: getPresence,
          getOthers: getOthers
        }
      };
    }
    function defaultState(me, defaultStorageRoot) {
      return {
        connection: {
          state: "closed"
        },
        lastConnectionId: null,
        socket: null,
        listeners: {
          event: [],
          others: [],
          "my-presence": [],
          error: [],
          connection: [],
          storage: []
        },
        numberOfRetry: 0,
        lastFlushTime: 0,
        timeoutHandles: {
          flush: null,
          reconnect: 0,
          pongTimeout: 0
        },
        buffer: {
          presence: me == null ? {} : me,
          messages: [],
          storageOperations: []
        },
        intervalHandles: {
          heartbeat: 0
        },
        me: me == null ? {} : me,
        users: {},
        others: makeOthers({}),
        defaultStorageRoot: defaultStorageRoot,
        idFactory: null,
        clock: 0,
        opClock: 0,
        items: new Map(),
        root: undefined,
        undoStack: [],
        redoStack: [],
        isHistoryPaused: false,
        pausedHistory: [],
        isBatching: false,
        batch: {
          ops: [],
          updates: {
            storageUpdates: new Map(),
            presence: false,
            others: []
          },
          reverseOps: []
        },
        offlineOperations: new Map()
      };
    }
    function createRoom(options, context) {
      var state = defaultState(options.defaultPresence, options.defaultStorageRoot);
      var machine = makeStateMachine(state, context);
      var room = {
        id: context.room,
        getConnectionState: machine.selectors.getConnectionState,
        getSelf: machine.selectors.getSelf,
        subscribe: machine.subscribe,
        unsubscribe: machine.unsubscribe,
        getPresence: machine.selectors.getPresence,
        updatePresence: machine.updatePresence,
        getOthers: machine.selectors.getOthers,
        broadcastEvent: machine.broadcastEvent,
        getStorage: machine.getStorage,
        batch: machine.batch,
        history: {
          undo: machine.undo,
          redo: machine.redo,
          pause: machine.pauseHistory,
          resume: machine.resumeHistory
        },
        internalDevTools: {
          closeWebsocket: machine.simulateSocketClose,
          sendCloseEvent: machine.simulateSendCloseEvent
        }
      };
      return {
        connect: machine.connect,
        disconnect: machine.disconnect,
        onNavigatorOnline: machine.onNavigatorOnline,
        onVisibilityChange: machine.onVisibilityChange,
        room: room
      };
    }
    
    var LiveblocksError = function (_Error) {
      _inheritsLoose(LiveblocksError, _Error);
    
      function LiveblocksError(message, code) {
        var _this;
    
        _this = _Error.call(this, message) || this;
        _this.code = code;
        return _this;
      }
    
      return LiveblocksError;
    }(_wrapNativeSuper(Error));
    
    function parseToken(token) {
      var tokenParts = token.split(".");
    
      if (tokenParts.length !== 3) {
        throw new Error("Authentication error. Liveblocks could not parse the response of your authentication endpoint");
      }
    
      var data = JSON.parse(atob(tokenParts[1]));
    
      if (typeof data.actor !== "number") {
        throw new Error("Authentication error. Liveblocks could not parse the response of your authentication endpoint");
      }
    
      return data;
    }
    
    function prepareCreateWebSocket(liveblocksServer, WebSocketPolyfill) {
      if (typeof window === "undefined" && WebSocketPolyfill == null) {
        throw new Error("To use Liveblocks client in a non-dom environment, you need to provide a WebSocket polyfill.");
      }
    
      var ws = WebSocketPolyfill || WebSocket;
      return function (token) {
        return new ws(liveblocksServer + "/?token=" + token);
      };
    }
    
    function prepareAuthEndpoint(authentication, fetchPolyfill) {
      if (authentication.type === "public") {
        if (typeof window === "undefined" && fetchPolyfill == null) {
          throw new Error("To use Liveblocks client in a non-dom environment with a publicApiKey, you need to provide a fetch polyfill.");
        }
    
        return function (room) {
          return fetchAuthEndpoint(fetchPolyfill || fetch, authentication.url, {
            room: room,
            publicApiKey: authentication.publicApiKey
          });
        };
      }
    
      if (authentication.type === "private") {
        if (typeof window === "undefined" && fetchPolyfill == null) {
          throw new Error("To use Liveblocks client in a non-dom environment with a url as auth endpoint, you need to provide a fetch polyfill.");
        }
    
        return function (room) {
          return fetchAuthEndpoint(fetchPolyfill || fetch, authentication.url, {
            room: room
          });
        };
      }
    
      if (authentication.type === "custom") {
        return authentication.callback;
      }
    
      throw new Error("Internal error. Unexpected authentication type");
    }
    
    function fetchAuthEndpoint(fetch, endpoint, body) {
      return fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      }).then(function (res) {
        if (!res.ok) {
          throw new AuthenticationError("Expected a status 200 but got " + res.status + " when doing a POST request on \"" + endpoint + "\"");
        }
    
        return res.json().catch(function (er) {
          throw new AuthenticationError("Expected a json when doing a POST request on \"" + endpoint + "\". " + er);
        });
      }).then(function (authResponse) {
        if (typeof authResponse.token !== "string") {
          throw new AuthenticationError("Expected a json with a string token when doing a POST request on \"" + endpoint + "\", but got " + JSON.stringify(authResponse));
        }
    
        return authResponse;
      });
    }
    
    var AuthenticationError = function (_Error2) {
      _inheritsLoose(AuthenticationError, _Error2);
    
      function AuthenticationError(message) {
        return _Error2.call(this, message) || this;
      }
    
      return AuthenticationError;
    }(_wrapNativeSuper(Error));
    
    function createClient(options) {
      var clientOptions = options;
      var throttleDelay = getThrottleDelayFromOptions(options);
      var rooms = new Map();
    
      function getRoom(roomId) {
        var internalRoom = rooms.get(roomId);
        return internalRoom ? internalRoom.room : null;
      }
    
      function enter(roomId, options) {
        if (options === void 0) {
          options = {};
        }
    
        var internalRoom = rooms.get(roomId);
    
        if (internalRoom) {
          return internalRoom.room;
        }
    
        internalRoom = createRoom({
          defaultPresence: options.defaultPresence,
          defaultStorageRoot: options.defaultStorageRoot
        }, {
          room: roomId,
          throttleDelay: throttleDelay,
          WebSocketPolyfill: clientOptions.WebSocketPolyfill,
          fetchPolyfill: clientOptions.fetchPolyfill,
          liveblocksServer: clientOptions.liveblocksServer || "wss://liveblocks.net/v5",
          authentication: prepareAuthentication(clientOptions)
        });
        rooms.set(roomId, internalRoom);
    
        if (!options.DO_NOT_USE_withoutConnecting) {
          internalRoom.connect();
        }
    
        return internalRoom.room;
      }
    
      function leave(roomId) {
        var room = rooms.get(roomId);
    
        if (room) {
          room.disconnect();
          rooms.delete(roomId);
        }
      }
    
      if (typeof window !== "undefined") {
        window.addEventListener("online", function () {
          for (var _iterator = _createForOfIteratorHelperLoose(rooms), _step; !(_step = _iterator()).done;) {
            var _step$value = _step.value,
                room = _step$value[1];
            room.onNavigatorOnline();
          }
        });
      }
    
      if (typeof document !== "undefined") {
        document.addEventListener("visibilitychange", function () {
          for (var _iterator2 = _createForOfIteratorHelperLoose(rooms), _step2; !(_step2 = _iterator2()).done;) {
            var _step2$value = _step2.value,
                room = _step2$value[1];
            room.onVisibilityChange(document.visibilityState);
          }
        });
      }
    
      return {
        getRoom: getRoom,
        enter: enter,
        leave: leave
      };
    }
    
    function getThrottleDelayFromOptions(options) {
      if (options.throttle === undefined) {
        return 100;
      }
    
      if (typeof options.throttle !== "number" || options.throttle < 80 || options.throttle > 1000) {
        throw new Error("throttle should be a number between 80 and 1000.");
      }
    
      return options.throttle;
    }
    
    function prepareAuthentication(clientOptions) {
      if (typeof clientOptions.publicApiKey === "string") {
        return {
          type: "public",
          publicApiKey: clientOptions.publicApiKey,
          url: clientOptions.publicAuthorizeEndpoint || "https://liveblocks.io/api/public/authorize"
        };
      } else if (typeof clientOptions.authEndpoint === "string") {
        return {
          type: "private",
          url: clientOptions.authEndpoint
        };
      } else if (typeof clientOptions.authEndpoint === "function") {
        return {
          type: "custom",
          callback: clientOptions.authEndpoint
        };
      }
    
      throw new Error("Invalid Liveblocks client options. For more information: https://liveblocks.io/docs/api-reference/liveblocks-client#createClient");
    }
    
    function liveObjectToJson(liveObject) {
      var result = {};
      var obj = liveObject.toObject();
    
      for (var _key in obj) {
        result[_key] = liveNodeToJson(obj[_key]);
      }
    
      return result;
    }
    
    function liveMapToJson(map) {
      var result = {};
      var obj = Object.fromEntries(map);
    
      for (var _key2 in obj) {
        result[_key2] = liveNodeToJson(obj[_key2]);
      }
    
      return result;
    }
    
    function liveListToJson(value) {
      return value.toArray().map(liveNodeToJson);
    }
    
    function liveNodeToJson(value) {
      if (value instanceof LiveObject) {
        return liveObjectToJson(value);
      } else if (value instanceof LiveList) {
        return liveListToJson(value);
      } else if (value instanceof LiveMap) {
        return liveMapToJson(value);
      } else if (value instanceof LiveRegister) {
        return value.data;
      }
    
      return value;
    }
    
    function isPlainObject(obj) {
      return Object.prototype.toString.call(obj) === "[object Object]";
    }
    
    function anyToCrdt(obj) {
      if (obj == null) {
        return obj;
      }
    
      if (Array.isArray(obj)) {
        return new LiveList(obj.map(anyToCrdt));
      }
    
      if (isPlainObject(obj)) {
        var init = {};
    
        for (var _key3 in obj) {
          init[_key3] = anyToCrdt(obj[_key3]);
        }
    
        return new LiveObject(init);
      }
    
      return obj;
    }
    
    function patchLiveList(liveList, prev, next) {
      var i = 0;
      var prevEnd = prev.length - 1;
      var nextEnd = next.length - 1;
      var prevNode = prev[0];
      var nextNode = next[0];
    
      outer: {
        while (prevNode === nextNode) {
          ++i;
    
          if (i > prevEnd || i > nextEnd) {
            break outer;
          }
    
          prevNode = prev[i];
          nextNode = next[i];
        }
    
        prevNode = prev[prevEnd];
        nextNode = next[nextEnd];
    
        while (prevNode === nextNode) {
          prevEnd--;
          nextEnd--;
    
          if (i > prevEnd || i > nextEnd) {
            break outer;
          }
    
          prevNode = prev[prevEnd];
          nextNode = next[nextEnd];
        }
      }
    
      if (i > prevEnd) {
        if (i <= nextEnd) {
          while (i <= nextEnd) {
            liveList.insert(anyToCrdt(next[i]), i);
            i++;
          }
        }
      } else if (i > nextEnd) {
        var localI = i;
    
        while (localI <= prevEnd) {
          liveList.delete(i);
          localI++;
        }
      } else {
        while (i <= prevEnd && i <= nextEnd) {
          prevNode = prev[i];
          nextNode = next[i];
          var liveListNode = liveList.get(i);
    
          if (liveListNode instanceof LiveObject && isPlainObject(prevNode) && isPlainObject(nextNode)) {
            patchLiveObject(liveListNode, prevNode, nextNode);
          } else {
            liveList.delete(i);
            liveList.insert(anyToCrdt(nextNode), i);
          }
    
          i++;
        }
    
        while (i <= nextEnd) {
          liveList.insert(anyToCrdt(next[i]), i);
          i++;
        }
    
        while (i <= prevEnd) {
          liveList.delete(i);
          i++;
        }
      }
    }
    function patchLiveObjectKey(liveObject, key, prev, next) {
      if (process.env.NODE_ENV !== "production") {
        var nonSerializableValue = findNonSerializableValue(next);
    
        if (nonSerializableValue) {
          console.error("New state path: '" + nonSerializableValue.path + "' value: '" + nonSerializableValue.value + "' is not serializable.\nOnly serializable value can be synced with Liveblocks.");
          return;
        }
      }
    
      var value = liveObject.get(key);
    
      if (next === undefined) {
        liveObject.delete(key);
      } else if (value === undefined) {
        liveObject.set(key, anyToCrdt(next));
      } else if (prev === next) {
        return;
      } else if (value instanceof LiveList && Array.isArray(prev) && Array.isArray(next)) {
        patchLiveList(value, prev, next);
      } else if (value instanceof LiveObject && isPlainObject(prev) && isPlainObject(next)) {
        patchLiveObject(value, prev, next);
      } else {
        liveObject.set(key, anyToCrdt(next));
      }
    }
    function patchLiveObject(root, prev, next) {
      var updates = {};
    
      for (var _key4 in next) {
        patchLiveObjectKey(root, _key4, prev[_key4], next[_key4]);
      }
    
      for (var _key5 in prev) {
        if (next[_key5] === undefined) {
          root.delete(_key5);
        }
      }
    
      if (Object.keys(updates).length > 0) {
        root.update(updates);
      }
    }
    
    function getParentsPath(node) {
      var path = [];
    
      while (node._parentKey != null && node._parent != null) {
        if (node._parent instanceof LiveList) {
          path.push(node._parent._indexOfPosition(node._parentKey));
        } else {
          path.push(node._parentKey);
        }
    
        node = node._parent;
      }
    
      return path;
    }
    
    function patchImmutableObject(state, updates) {
      return updates.reduce(function (state, update) {
        return patchImmutableObjectWithUpdate(state, update);
      }, state);
    }
    
    function patchImmutableObjectWithUpdate(state, update) {
      var path = getParentsPath(update.node);
      return patchImmutableNode(state, path, update);
    }
    
    function patchImmutableNode(state, path, update) {
      var pathItem = path.pop();
    
      if (pathItem === undefined) {
        switch (update.type) {
          case "LiveObject":
            {
              if (typeof state !== "object") {
                throw new Error("Internal: received update on LiveObject but state was not an object");
              }
    
              var newState = Object.assign({}, state);
    
              for (var _key6 in update.updates) {
                var _update$updates$_key, _update$updates$_key2;
    
                if (((_update$updates$_key = update.updates[_key6]) == null ? void 0 : _update$updates$_key.type) === "update") {
                  newState[_key6] = liveNodeToJson(update.node.get(_key6));
                } else if (((_update$updates$_key2 = update.updates[_key6]) == null ? void 0 : _update$updates$_key2.type) === "delete") {
                  delete newState[_key6];
                }
              }
    
              return newState;
            }
    
          case "LiveList":
            {
              if (Array.isArray(state) === false) {
                throw new Error("Internal: received update on LiveList but state was not an array");
              }
    
              var _newState = state.map(function (x) {
                return x;
              });
    
              for (var _iterator = _createForOfIteratorHelperLoose(update.updates), _step; !(_step = _iterator()).done;) {
                var listUpdate = _step.value;
    
                if (listUpdate.type === "insert") {
                  if (listUpdate.index === _newState.length) {
                    _newState.push(liveNodeToJson(listUpdate.item));
                  } else {
                    _newState = [].concat(_newState.slice(0, listUpdate.index), [liveNodeToJson(listUpdate.item)], _newState.slice(listUpdate.index));
                  }
                } else if (listUpdate.type === "delete") {
                  _newState.splice(listUpdate.index, 1);
                } else if (listUpdate.type === "move") {
                  if (listUpdate.previousIndex > listUpdate.index) {
                    _newState = [].concat(_newState.slice(0, listUpdate.index), [liveNodeToJson(listUpdate.item)], _newState.slice(listUpdate.index, listUpdate.previousIndex), _newState.slice(listUpdate.previousIndex + 1));
                  } else {
                    _newState = [].concat(_newState.slice(0, listUpdate.previousIndex), _newState.slice(listUpdate.previousIndex + 1, listUpdate.index + 1), [liveNodeToJson(listUpdate.item)], _newState.slice(listUpdate.index + 1));
                  }
                }
              }
    
              return _newState;
            }
    
          case "LiveMap":
            {
              if (typeof state !== "object") {
                throw new Error("Internal: received update on LiveMap but state was not an object");
              }
    
              var _newState2 = Object.assign({}, state);
    
              for (var _key7 in update.updates) {
                var _update$updates$_key3, _update$updates$_key4;
    
                if (((_update$updates$_key3 = update.updates[_key7]) == null ? void 0 : _update$updates$_key3.type) === "update") {
                  _newState2[_key7] = liveNodeToJson(update.node.get(_key7));
                } else if (((_update$updates$_key4 = update.updates[_key7]) == null ? void 0 : _update$updates$_key4.type) === "delete") {
                  delete _newState2[_key7];
                }
              }
    
              return _newState2;
            }
        }
      }
    
      if (Array.isArray(state)) {
        var newArray = [].concat(state);
        newArray[pathItem] = patchImmutableNode(state[pathItem], path, update);
        return newArray;
      } else {
        var _extends2;
    
        return _extends({}, state, (_extends2 = {}, _extends2[pathItem] = patchImmutableNode(state[pathItem], path, update), _extends2));
      }
    }
    
    var internals = {
      liveObjectToJson: liveObjectToJson,
      liveNodeToJson: liveNodeToJson,
      patchLiveList: patchLiveList,
      patchImmutableObject: patchImmutableObject,
      patchLiveObject: patchLiveObject,
      patchLiveObjectKey: patchLiveObjectKey
    };
    
    exports.LiveList = LiveList;
    exports.LiveMap = LiveMap;
    exports.LiveObject = LiveObject;
    exports.createClient = createClient;
    exports.internals = internals;
    
    }).call(this)}).call(this,require('_process'))
    },{"_process":1}]},{},[])("@liveblocks/client")
    });
    