export const shortkeyStatusbar = {
    props: {},
    data: function () {
      return {
        /**
         * Chuỗi text hiển thị ở status bar: dùng cho hiển thị phím tắt, hướng dẫn,....
         */
        statusBarText: null,
      };
    },
    methods: {
      /**
       * Xử lý phím tắt
       */
      shortkeyAction(e) {
        let me = this;
        switch (e.originEvent.which) {
          case 120:
              
          case 27: //esc
  
            break;
          default:
            me.executeShortkey(e);
            break;
        }
      },
  
      /**
       * Xử lý phím tắt
       */
      executeShortkey(e) {
        if (e.originEvent.cancel) {
          return;
        }
        let me: any = this;
        const shortkey = e.target.getAttribute('shortkey');
        if (shortkey && shortkey.split('|').indexOf(e.srcKey) > -1) {
          e.originEvent.preventDefault();
          e.originEvent.stopPropagation();
          e.originEvent.cancel = true;
  
          //click vào body để unfocus khỏi control hiện tại -> submit giá trị đang nhập
          document.body.click();
  
          var selector = ['[shortkey-target="', e.srcKey, '"]'].join('');
          var target = me.$el.querySelector(selector);
          if (target) {
            if (target.classList.contains('split-button')) {
              let button = target.querySelector('button');
              if (button) {
                button.click();
              }
            } else {
              target.click();
            }
          }
        }
      },
    },
  };
  