import { showError } from "@/commons/globalMessage";

export const validateComponent = {
  methods: {
    /**
		 * Hàm validate các control input
		 * Hàm này sử dụng component ms-validate
		 * để bao ngoài vùng được validate
		 * @Chú ý:ref của ms-validate phải là validateObserver
		 */
		async validateComponents() {
      const me: any = this;
      let controls = me.getObserveControl();
			if (controls.length > 0) {
				const errors = controls.map((x) => {
					if (typeof x.validate === 'function') {
						return x.validate();
					}
					return '';
				});
				let indexFirst = errors.findIndex((item) => item);
				if (indexFirst !== -1) {
					showError(errors[indexFirst]).then(() => me.focusFirstError()); // show popup cảnh báo, không cần truyền title
				}
				return !errors.some((x) => x);
			}
			return true;
    },

    /**
		 * Khởi tạo observe control
		 * .ms-validate được thêm vào root khi khai báo rules
		 */
		getObserveControl() {
      const me: any = this;
			const _observeControls = [];
			const $el = me.$el;
			let $controls = null;
			if($el && typeof $el.querySelectorAll == 'function'){
				$controls = $el.querySelectorAll('.ms-validate');
			}
			if ($controls && $controls.length > 0) {
				$controls.forEach((item) => {
					if (typeof item.getVueInstance === 'function') {
						_observeControls.push(item.getVueInstance());
					}
				});
			}
			return _observeControls;
		},

    /**
		 * Hàm dùng để focus vào ô lỗi đầu tiên
		 * */
    focusFirstError() {
			const me: any = this;
			const $el = me.$el;
			let firstErrorEl = null;
			if($el && typeof $el.querySelector == 'function'){
				firstErrorEl = $el.querySelector('.ms-editor .input-error');
			}
			if(firstErrorEl){
				me.$ms.commonFn.focusFirstControl(firstErrorEl);
			}
		},

  },
};
