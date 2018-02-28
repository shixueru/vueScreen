'use strict'

function loadingMessage (str) {
  var html = '<div class="loadingMessage" style="top:0;left:0;position: fixed; text-align: center; width: 100%;height:100%; display:none; z-index:10000000;background:rgba(0,0,0,0.5)"><div style="position:absolute;top:50%;left:50%;transform:translateX(-50%);-webkit-transform:translateX(-50%);"><div class="spinner"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div></div><font style="border-radius: 5px; color: #fff; z-index:1000; display: inline-table; line-height: 170%; max-width: 80%; padding: 5px 10px;font-size:14px">' + str + '</font></div></div>'
  $('body').append(html)
  $('body .loadingMessage').fadeIn('normal')
}

function hideLoading () {
  $('body .loadingMessage').fadeOut('normal', function () {
    $(this).remove()
  })
}
Vue.component('alertBox', {
  template: '#alertBox',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: ''
    }
  },
  computed: {
    showAlert: function showAlert () {
      return this.value
    }
  },
  watch: {
    value: function value (v) {
      var _this = this
      if (v) {
        setTimeout(function () {
          _this.showAlert = false
          _this.$emit('input', false)
        }, 1500)
      }
    }
  }
})
new Vue({
  el: '#app',
  data: {
    html: '<p style="line-height: 24px; margin: 0px auto 12px; font-size: 14px; font-family: 微软雅黑, 宋体, Arial; white-space: normal; background-color: rgb(255, 255, 255); text-align: center;"><span style="font-family: &quot;Microsoft YaHei&quot;; font-size: 15px;">在我没看这之前，我觉得要写绑定class ，应该像绑定数据一样这么写</span></p><pre style="margin-top: 0px; margin-bottom: 0px; white-space: pre-wrap; word-wrap: break-word; font-size: 15px; background-color: rgb(255, 255, 255); text-align: center;">class&nbsp;={</pre><p style="line-height: 24px; margin: 0px auto 12px; font-size: 14px; font-family: 微软雅黑, 宋体, Arial; white-space: normal; background-color: rgb(255, 255, 255); text-align: center;"><span style="font-size: 24px;"><strong><span style="font-family: &quot;Microsoft YaHei&quot;;">看官方教程时，不推荐这么写，推荐这样</span></strong></span></p><pre style="margin-top: 0px; margin-bottom: 0px; white-space: pre-wrap; word-wrap: break-word; font-size: 15px; background-color: rgb(255, 255, 255);"><span style="font-size: 24px; color: rgb(255, 0, 0);"><strong>v-bind:class=&quot;{ &#39;class-a&#39;: isA, &#39;class-b&#39;: isB }&quot;</strong></span><span style="font-size: 24px;"><strong><br/></strong></span></pre><p style="line-height: 24px; margin: 0px auto 12px; font-size: 14px; font-family: 微软雅黑, 宋体, Arial; white-space: normal; background-color: rgb(255, 255, 255); text-indent: 2em;"><span style="font-size: 24px;"><strong><span style="font-family: &quot;Microsoft YaHei&quot;; font-size: 15px;">官方的解释，我觉得还是挺接地气的，最起码我能看的懂。</span></strong></span></p><p style="line-height: 24px; margin: 0px auto 12px; font-size: 14px; font-family: 微软雅黑, 宋体, Arial; white-space: normal; background-color: rgb(255, 255, 255);"><span style="font-size: 24px;"><strong><span style="font-family: &quot;Microsoft YaHei&quot;; font-size: 15px;">数据绑定一个常见需求是操作元素的 class 列表和它的内联样式。因为它们都是属性，我们可以用</span></strong></span></p><p><br/></p>',
    src: 'http://www.baidu.com',
    dataList: [],
    collectMsg: [],
    isShow: false,
    text: '',
    winWidth: 0
  },
  methods: {
    initSwiper: function initSwiper (v, data) {
      // 根据接口数据判断有多少个banner，并且进行swiper实例创建
      var swiper = new Swiper('.swiper-container' + v, {
        pagination: '.swiper-pagination' + v,
        paginationClickable: true,
        spaceBetween: 0,
        effect: data.switchView == '1' ? 'slide' : 'fade',
        loop: true,
        autoplay: data.bannerList.length > 1 ? Number(data.switchTime) * 1000 : false,
        autoplayDisableOnInteraction: false /* 用户操作swiper之后，是否禁止autoplay。默认为true：停止。注意此参数，默认为true */
      })
    },
    init: function init () {
      var _this = this
      this.winWidth = document.getElementById('app').clientWidth
      this.ajax('/iFengChao-ThirdParty-Web/pageLoad/queryLoadPageDetail', {}, function (res) {
        if (res.resCode == '00000') {
          hideLoading()
          _this.dataList = res.record.detailList ? res.record.detailList : []
          document.title = res.record.loadPageName
          document.getElementsByName('keywords')[0].content = res.record.keyword
          document.getElementsByName('description')[0].content = res.record.description
          var regex = /<[^>]+>([\d\D]*)<\/[^>]+>/
          if (res.record.scriptContent && regex.test(res.record.scriptContent)) {
            $('body').append(res.record.scriptContent)
          // var script = document.createElement('script')
          // script.type = 'text/javascript'
          // script.innerHTML = res.record.scriptContent.match(regex)[1]
          // document.body.appendChild(script)
          }
          _this.share()
          setTimeout(function () {
            if (_this.dataList) {
              for (var i = 0; i < _this.dataList.length; i++) {
                if (_this.dataList[i].moduleType == '1') {
                  // 类型为轮播图
                  _this.initSwiper(i, _this.dataList[i])
                }
              }
            }
            _this.setImgWidth()
          }, 500)
        }
      })
    },
    submitData: function submitData (index) {
      var _this = this
      var checkNum = 0
      this.dataList[index].collectList.forEach(function (v) {
        if (v.selectType == '0') {
          var obj = {}
          obj[v.fieldName] = v.inputText
          _this.collectMsg.push(obj)
          if (v.inputText === '' && v.needCheck === 'Y') {
            checkNum++
          }
        }
        if (v.selectType == '1') {
          var obj = {}
          obj[v.fieldName] = v.selectOption
          _this.collectMsg.push(obj)
          if (v.selectOption === '' && v.needCheck === 'Y') {
            checkNum++
          }
        }
        if (v.selectType == '2') {
          var obj = {}
          obj[v.fieldName] = v.selectArray
          _this.collectMsg.push(obj)
          if (v.selectArray.length === 0 && v.needCheck === 'Y') {
            checkNum++
          }
        }
      })
      if (checkNum === 0 || checkNum === '0') {
        this.ajax('/iFengChao-ThirdParty-Web/pageLoad/saveCollectMsg', { 'collectMsg': JSON.stringify(_this.collectMsg) }, function (res) {
          hideLoading()
          if (res.resCode == '00000') {
            setTimeout(function () {
              _this.isShow = true
              _this.text = '提交成功！'
              _this.collectMsg = []
              _this.dataList[index].collectList.forEach(function (v) {
                if (v.selectType == '0') {
                  v.inputText = ''
                }
                if (v.selectType == '2') {
                  v.selectArray = []
                }
              })
            }, 800)
          } else {
            setTimeout(function () {
              _this.isShow = true
              _this.text = '提交失败'
            }, 800)
          }
        })
      } else {
        _this.isShow = true
        _this.text = '请填写必填信息！'
        _this.collectMsg = []
      }
    },
    ajax: function ajax (url, data, callback) {
      var _this = this
      var timeStr = new Date().getTime()
      var loadPageId = this.loadPageId; // 暂时写死，应该从url中取
      var str = 'requestTime=' + timeStr + '&loadPageId=' + loadPageId + '&key=miibvqibadanb7AG8A9gZMQbaqefaascatYM77eXa7eaaAeaKCSy6pYO0h3NzebEpTOtKmzhQHdo'; // md5签名验证
      var sign = hex_md5(str)
      data = $.extend({
        'loadPageId': loadPageId,
        'requestTime': timeStr,
        'sign': sign
      }, data)
      loadingMessage('数据加载中')
      $.ajax({
        url: url,
        type: 'POST',
        data: data,
        'dataType': 'JSON'
      }).then(function (res) {
        callback && typeof callback == 'function' ? callback(res) : ''; // 回调中的数据应该是返回接口返回的res
      })
    // callback && typeof (callback) == 'function' ? callback(_this.res) : '' // 回调中的数据应该是返回接口返回的res，现在是写死的模拟数据
    },
    setImgWidth: function setImgWidth () {
      // 设置图片宽度，超过浏览器宽的100%显示
      var img = document.getElementsByTagName('img')
      var app = document.getElementById('app')
      for (var i = 0; i < img.length; i++) {
        (function (i) {
          var imgEl = new Image()
          imgEl.src = img[i].src
          imgEl.onload = function () {
            if (parseInt(getStyle(img[i], 'width')) > parseInt(getStyle(app, 'width'))) {
              img[i].style.width = '100%'
            }
          }
        })(i)
      }
      function getStyle (obj, attr) {
        if (obj.currentStyle) {
          return obj.currentStyle[attr]
        } else {
          return getComputedStyle(obj, false)[attr]
        }
      }
    },
    share: function share () {
      var url = window.location.href
      var domain = window.location.protocol + '//' + window.location.host
      var _this = this
      $.ajax({
        url: '/iFengChao-App-Web/weChat/getSign',
        method: 'POST',
        data: {
          url: url,
          type: 'loadPage',
          loadPageId: _this.loadPageId
        }
      }).then(function (res) {
        getConfig(res)
      })
      function getConfig (res) {
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来
          appId: 'wxb5b62e94bbd6712d', // 必填，公众号的唯一标识
          timestamp: res.timestamp, // 必填，生成签名的时间戳
          nonceStr: res.nonceStr, // 必填，生成签名的随机串
          signature: res.signature, // 必填，签名，见附录1
          jsApiList: ['checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        })
        wx.ready(function () {
          wx.onMenuShareTimeline({
            title: res.sharingTitle, // 分享标题
            desc: res.sharingContent, // 分享描述
            link: res.sharingUrl, // 分享链接
            imgUrl: domain + res.sharingImg, // 分享图标
            success: function success () {
              // 用户确认分享后执行的回调函数
              errorMessage('分享成功')
            },
            cancel: function cancel () {
              // 用户取消分享后执行的回调函数
              errorMessage('未分享')
            }
          })
          // 获取“分享给朋友”按钮点击状态及自定义分享内容接口
          wx.onMenuShareAppMessage({
            title: res.sharingTitle, // 分享标题
            desc: res.sharingContent, // 分享描述
            link: res.sharingUrl, // 分享链接
            type: 'link', // 分享类型,music、video或link，不填默认为link
            imgUrl: domain + res.sharingImg, // 分享图标
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function success () {
              // 用户确认分享后执行的回调函数
              errorMessage('分享成功')
            },
            cancel: function cancel () {
              // 用户取消分享后执行的回调函数
              errorMessage('未分享')
            }
          })
          wx.onMenuShareQQ({
            title: res.sharingTitle, // 分享标题
            desc: res.sharingContent, // 分享描述
            link: res.sharingUrl, // 分享链接
            imgUrl: domain + res.sharingImg, // 分享图标
            success: function success () {
              // 用户确认分享后执行的回调函数
            },
            cancel: function cancel () {
              // 用户取消分享后执行的回调函数
            }
          })
        })
      }
    }
  },
  computed: {
    dataListCopy: function dataListCopy () {
      var _this = this
      this.dataList.forEach(function (item) {
        if (item.moduleType == '3') {
          item.collectList.forEach(function (v) {
            if (v.selectType == '0') {
              v.inputText = ''
            }
            if (v.selectType == '1') {
              if (v.selectDetai.indexOf(',') != -1) {
                v.selectDetai = v.selectDetai.split(',')
              } else if (v.selectDetai.indexOf('，') != -1) {
                v.selectDetai = v.selectDetai.split('，')
              } else if (v.selectDetai.indexOf('、') != -1) {
                v.selectDetai = v.selectDetai.split('、')
              } else if (v.selectDetai.indexOf('。') != -1) {
                v.selectDetai = v.selectDetai.split('。')
              } else if (v.selectDetai.indexOf(';') != -1) {
                v.selectDetai = v.selectDetai.split(';')
              } else if (v.selectDetai.indexOf('；') != -1) {
                v.selectDetai = v.selectDetai.split('；')
              } else if (v.selectDetai.indexOf(' ') != -1) {
                v.selectDetai = v.selectDetai.split(' ')
              } else if (v.selectDetai.indexOf('/') != -1) {
                v.selectDetai = v.selectDetai.split('/')
              }
              v.selectOption = v.selectDetai[0]
            }
            if (v.selectType == '2') {
              v.selectArray = []
              if (v.selectDetai.indexOf(',') != -1) {
                v.selectDetai = v.selectDetai.split(',')
              } else if (v.selectDetai.indexOf('，') != -1) {
                v.selectDetai = v.selectDetai.split('，')
              } else if (v.selectDetai.indexOf('、') != -1) {
                v.selectDetai = v.selectDetai.split('、')
              } else if (v.selectDetai.indexOf('。') != -1) {
                v.selectDetai = v.selectDetai.split('。')
              } else if (v.selectDetai.indexOf(';') != -1) {
                v.selectDetai = v.selectDetai.split(';')
              } else if (v.selectDetai.indexOf('；') != -1) {
                v.selectDetai = v.selectDetai.split('；')
              } else if (v.selectDetai.indexOf(' ') != -1) {
                v.selectDetai = v.selectDetai.split(' ')
              } else if (v.selectDetai.indexOf('/') != -1) {
                v.selectDetai = v.selectDetai.split('/')
              }
              v.selectOption = v.selectDetai[0]
            }
          })
        }
      })
      return this.dataList
    }
  },
  mounted: function mounted () {
    this.$nextTick(function () {
      function getUrlParam (name) {
        var paramIndex = window.location.href.indexOf('?')
        if (paramIndex != -1) {
          var parameter = window.location.href.substring(paramIndex)
          var reg = new RegExp('(^|[&|?])' + name + '=([^&]*)(&|$)'); // 构造一个含有目标参数的正则表达式对象
          var r = parameter.match(reg); // 匹配目标参数
        }
        if (r != null) return unescape(r[2]);return null; // 返回参数值
      }
      this.loadPageId = getUrlParam('loadPageId')
      this.init()
    })
  }
})
