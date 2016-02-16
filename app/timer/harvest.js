!function (window, document, undefined) {
    var e;
    e = function () {
        function e() {
            this.el = document.createElement("div"), this.el.className = "harvest-overlay", this.iframe = document.createElement("iframe"), this.iframe.id = "harvest-iframe", this.el.appendChild(this.iframe), this.el.addEventListener("click", function (e) {
                return function (t) {
                    return e.close()
                }
            }(this)), document.addEventListener("keyup", function (e) {
                return function (t) {
                    var i;
                    return i = t.which, 27 === i ? e.close() : void 0
                }
            }(this))
        }

        return e.prototype.open = function (e) {
            return this.iframe.src = e, document.body.appendChild(this.el)
        }, e.prototype.adjustHeight = function (e) {
            return this.iframe.style.height = e + "px"
        }, e.prototype.close = function () {
            var e;
            return null != (e = this.el.parentNode) ? e.removeChild(this.el) : void 0
        }, e
    }();
    var t, i = function (e, t) {
        return function () {
            return e.apply(t, arguments)
        }
    };
    window.HarvestPlatform = new (t = function () {
        function t() {
            this.runningTimerCheck = i(this.runningTimerCheck, this), this.findTimers = i(this.findTimers, this), this.addTimers = i(this.addTimers, this), this.handlePlatformMessage = i(this.handlePlatformMessage, this), this.runningTimerCheck = this.debounce(this.runningTimerCheck)
        }

        return t.prototype.version = 2, t.prototype.config = window._harvestPlatformConfig, t.prototype.origin = "https://platform.harvestapp.com", t.prototype.initialize = function () {
            var t, i;
            return this.lightbox = new e, this.setupHarvestXDM(), i = ".harvest-timer-icon,.harvest-timer.styled{border:0;font:inherit;font-size:0;line-height:1;margin:0;padding:0;vertical-align:top}.harvest-timer-icon{background:url(https://cache.harvestapp.com/assets/platform/timer-icon-d9cacbf6275b595c3ef84e58c3c35eff.png) no-repeat 0 0;display:inline-block;height:14px;width:12px}@media (-webkit-min-device-pixel-ratio: 1.25), (min-resolution: 1.25dppx), (min-resolution: 120dpi){.harvest-timer-icon{background:url(https://cache.harvestapp.com/assets/platform/timer-icon-retina-e8579bc885d2747ad7e127d8037d3662.png) no-repeat 0 0;background-size:24px 14px}}.harvest-timer.styled{background-color:#fafafa;background-image:-webkit-linear-gradient(#fff, #eee);background-image:linear-gradient(#fff, #eee);border:1px solid #bbbbbb;border-radius:2px;cursor:pointer;display:inline-block;height:14px;padding:2px 3px;width:12px;-webkit-font-smoothing:antialiased}.harvest-timer.styled:hover{background-color:#f0f0f0;background-image:-webkit-linear-gradient(#f8f8f8, #e8e8e8);background-image:linear-gradient(#f8f8f8, #e8e8e8)}.harvest-timer.styled:active{background:#eeeeee;box-shadow:inset 0 1px 4px rgba(0,0,0,0.1)}.harvest-timer.styled.running{background-color:#1385e5;background-image:-webkit-linear-gradient(#53b2fc, #1385e5);background-image:linear-gradient(#53b2fc, #1385e5);border-color:#075fa9}.harvest-timer.styled.running:hover{background-color:#0e7add;background-image:-webkit-linear-gradient(#49a4fd, #0e7add);background-image:linear-gradient(#49a4fd, #0e7add)}.harvest-timer.styled.running:active{background:#1385e5;box-shadow:inset 0 1px 5px rgba(0,0,0,0.2)}.harvest-timer.styled.running>.harvest-timer-icon{background-position:-12px 0px}#harvest-iframe{background:white;border:none;border-radius:6px;box-shadow:0 6px 12px rgba(0,0,0,0.2),0 0 0 1px rgba(0,0,0,0.1);height:300px;left:50%;margin:0;margin-left:-250px;overflow:hidden;padding:0;position:fixed;top:25%;-webkit-transition:height 150ms;transition:height 150ms;width:500px}.harvest-overlay{background-color:rgba(0,0,0,0.2);background-image:-webkit-radial-gradient(50% 40%, 50% 80%, rgba(0,0,0,0.1), rgba(0,0,0,0.3));background-image:radial-gradient(50% 40%, 50% 80%, rgba(0,0,0,0.1), rgba(0,0,0,0.3));bottom:0;height:100%;left:0;opacity:1;position:fixed;right:0;top:0;width:100%;z-index:9998}\n", t = document.createElement("style"), document.head.appendChild(t), t.appendChild(document.createTextNode(i)), window.addEventListener("message", this.handlePlatformMessage), this.listenForEvent("timers:add", this.addTimers), this.listenForEvent("timers:chrome:add", this.findTimers), this.findTimers(), this.xdm.setAttribute("data-ready", !0), this.sendMessage({
                element: document.body,
                type: "ready"
            })
        }, t.prototype.handlePlatformMessage = function (e) {
            var t, i, n, r, a;
            switch (null != (null != e ? e.data : void 0) && (n = e.data, r = n.type, a = n.value, t = n.group_id, i = n.item_id), r) {
                case"frame:close":
                    return this.lightbox.close();
                case"frame:resize":
                    return this.lightbox.adjustHeight(a);
                case"timer:started":
                    return this.setTimer({group: {id: t}, item: {id: i}});
                case"timer:stopped":
                    return this.stopTimer()
            }
        }, t.prototype.setupHarvestXDM = function () {
            var e;
            return e = this.hpNamespace("messaging"), (this.xdm = document.getElementById(e)) ? void 0 : (this.xdm = document.createElement("div"), this.xdm.id = e, this.xdm.style.display = "none", document.body.appendChild(this.xdm))
        }, t.prototype.listenForEvent = function (e, t) {
            return null != window.jQuery ? window.jQuery(this.xdm).bind(this.hpEvent(e), t) : this.xdm.addEventListener(this.hpEvent(e), t)
        }, t.prototype.addTimers = function (e) {
            var t, i, n, r;
            return t = e.element || (null != (i = e.originalEvent) && null != (n = i.detail) ? n.element : void 0) || (null != (r = e.detail) ? r.element : void 0), null != (null != t ? t.jquery : void 0) && (t = t.get(0)), t ? this.findTimer(t) : void 0
        }, t.prototype.findTimers = function () {
            var e, t, i, n, r, a;
            for (a = "." + this.hpNamespace("timer") + ":not([data-listening])", t = document.querySelectorAll(a), r = [], i = 0, n = t.length; n > i; i++)e = t[i], r.push(this.findTimer(e));
            return r
        }, t.prototype.findTimer = function (e) {
            var t, i;
            return t = e.getAttribute("data-skip-styling"),
            i = this.config.skipStyling || e.classList.contains("styled") || null != t && t !== !1 && "false" !== t,
            i || (e.innerHTML = "<span class='harvest-timer-icon'></span>",
                e.classList.add("styled")),
                e.addEventListener("click", function (t) {
                return function (i) {
                    return i.stopPropagation(), t.openIframe(t.getData(e))
                }
            }(this)), e.setAttribute("data-listening", !0), this.runningTimerCheck()
        }, t.prototype.setTimer = function (e) {
            var t, i, n, r, a, o, s, l, u, d, p;
            for (s = document.querySelectorAll("." + this.hpNamespace("timer")), p = [], r = 0, o = s.length; o > r; r++)i = s[r], l = this.getData(i), n = l.group, a = l.item, null == e || (null != n ? n.id : void 0) !== (null != (u = e.group) ? u.id : void 0) || (null != a ? a.id : void 0) !== (null != (d = e.item) ? d.id : void 0) ? (i.classList.remove("running"), p.push(function () {
                var e, n, r, a;
                for (r = i.children, a = [], e = 0, n = r.length; n > e; e++)t = r[e], a.push(t.classList.remove("running"));
                return a
            }())) : (i.classList.add("running"), p.push(function () {
                var e, n, r, a;
                for (r = i.children, a = [], e = 0, n = r.length; n > e; e++)t = r[e], a.push(t.classList.add("running"));
                return a
            }()));
            return p
        }, t.prototype.stopTimer = function () {
            return this.setTimer(null)
        }, t.prototype.getData = function (e) {
            var t, i, n, r, a;
            for (t = {}, a = ["account", "item", "group", "skip-styling"], i = 0, r = a.length; r > i; i++)n = a[i], t[n] = this.getValue(e, n);
            return null == t.group && (t.group = this.getValue(e, "project")), t
        }, t.prototype.getValue = function (e, t) {
            var i;
            return i = function () {
                var i;
                try {
                    return JSON.parse(null != (i = e.getAttribute("data-" + t)) ? i : "null")
                } catch (n) {
                }
            }(), null != (null != i ? i.id : void 0) && (i.id = "" + i.id), i
        }, t.prototype.createPermalink = function (e, t) {
            return null != e && null != t && (null != t.account && (e = e.replace("%ACCOUNT_ID%", t.account.id)), null != t.group && (e = e.replace("%PROJECT_ID%", t.group.id)), null != t.group && (e = e.replace("%GROUP_ID%", t.group.id)), null != t.item && (e = e.replace("%ITEM_ID%", t.item.id))), e
        }, t.prototype.openIframe = function (e) {
            var t, i, n, r, a, o;
            return t = {
                app_name: this.config.applicationName,
                service: e.service || window.location.hostname,
                base_url: this.createPermalink(this.config.permalink, e),
                external_account_id: null != (i = e.account) ? i.id : void 0,
                external_group_id: null != (n = e.group) ? n.id : void 0,
                external_group_name: null != (r = e.group) ? r.name : void 0,
                external_item_id: null != (a = e.item) ? a.id : void 0,
                external_item_name: null != (o = e.item) ? o.name : void 0
            }, this.lightbox.open(this.hpURL("/platform/timer?" + this.param(t)))
        }, t.prototype.runningTimerCheck = function () {
            return clearTimeout(this.runningTimerCheckTimer), this.get(this.hpURL("/platform/running_timer.json"), function (e) {
                return function (t, i) {
                    return 200 === t && (null != i ? e.setTimer({
                        group: {id: i.group_id},
                        item: {id: i.id}
                    }) : e.stopTimer()), 401 !== t ? e.runningTimerCheckTimer = setTimeout(e.runningTimerCheck, 3e4) : void 0
                }
            }(this))
        }, t.prototype.sendMessage = function (e) {
            var t;
            return null == e && (e = {}), t = document.createEvent("CustomEvent"), t.initCustomEvent(this.hpEvent(e.type), !0, !0, e.data), (e.element || this.xdm).dispatchEvent(t)
        }, t.prototype.hpURL = function (e) {
            return this.origin + e
        }, t.prototype.hpNamespace = function (e) {
            return "harvest-" + e
        }, t.prototype.hpEvent = function (e) {
            return this.hpNamespace("event") + ":" + e
        }, t.prototype.param = function (e) {
            var t, i;
            return function () {
                var n;
                n = [];
                for (t in e)i = e[t], null != i && n.push(t + "=" + encodeURIComponent(i));
                return n
            }().join("&")
        }, t.prototype.get = function (e, t) {
            var i;
            return i = new XMLHttpRequest, i.onload = function () {
                return t(i.status, function () {
                    try {
                        return JSON.parse(i.responseText)
                    } catch (e) {
                    }
                }())
            }, i.open("get", e), i.withCredentials = !0, i.setRequestHeader("X-Harvest-Platform-Version", this.version), i.send()
        }, t.prototype.debounce = function (e) {
            var t, i, n;
            return n = 100, i = null, t = null, function () {
                var r;
                return t = (new Date).getTime(), r = function () {
                    var e;
                    return e = (new Date).getTime() - t, i = n > e ? setTimeout(r, n - e) : null
                }, i || e.apply(this, arguments), i || (i = setTimeout(r, n))
            }
        }, t
    }())
}(window, document), null == window.postMessage ? "undefined" != typeof console && null !== console && console.warn("Harvest Platform is disabled.\nTo start and stop timers, cross-domain messaging must be supported\nby your browser.") : window.XMLHttpRequest && "withCredentials" in new XMLHttpRequest ? HarvestPlatform.initialize() : "undefined" != typeof console && null !== console && console.warn("Harvest Platform is disabled.\nTo check for running timers, xhr requests with credentials must be\nsupported by your browser.");