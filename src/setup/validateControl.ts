import { validateText } from '@/mixins/component/validateText';
import { validateNumber } from '@/mixins/component/validateNumber';
import { ref, getCurrentInstance, computed } from 'vue';
import { validateCombobox } from '@/mixins/component/validateCombobox';
import {isNaN } from 'lodash-es';

export const ValidateRules = {
	required: 'required',
	moreThan: 'moreThan',
	lessThan: 'lessThan',
	equals: 'equals',
	pattern: 'pattern',
	diffierentZero: 'diffierentZero',
	custom: 'custom',
};

export const useValidateControl = ({ props }) => {
	const errorMessage = ref('');
	const isValidate = computed(() => props.rules.length > 0);
	const { proxy }: any = getCurrentInstance();
	const validate = (isValidateFromGrid = null) => {
		//Nếu là editor của grid thì sẽ lấy config từ column
		let rules = [];
		rules = props.rules;
		let message = '';
		if (Array.isArray(rules) && rules.length > 0) {
			for (let index = 0; index < rules.length; index++) {
				const rule = rules[index];
				if (rule) {
					//nktiem Bổ sung thêm cái messageCustom để cho các control có thể tự custom message của mình theo từng rule theo nghiệp vụ
					const { name, compareValue, customValidate, messageCustom } = rule;
					const controlValue = getValueControl();
					//Nếu có custom validate sẽ lấy theo customvalidate
					if (customValidate && typeof customValidate === 'function') {
						//nhgiang4 - truyền thêm context của control hiện tại
						let context = proxy;
						message = customValidate(controlValue, compareValue, getTitleError(), context);
						if (message) {
							break;
						}
					} else {
						message = handlerRule(name, controlValue, compareValue, messageCustom);
						if (message) {
							break;
						}
					}
				}
			}
		}
		errorMessage.value = message;
		return message;
	};
	/**
	 * Xử lý các rule validate
	 * @param {*} rule tên rule
	 * @param {*} compareValue value
	 * @returns
	 */
	const handlerRule = (rule, controlValue, compareValue, messageCustom) => {
		let message = '';

		const titleError = getTitleError();
		switch (rule) {
			case 'required':
				if (controlValue === undefined || controlValue === null || isNaN(controlValue) || controlValue === '') {
					if (messageCustom) {
						message = messageCustom;
					} else {
						message = proxy.$t(`i18nValidate.messages.${rule}`, { field: titleError });
					}
				}
				break;
			case 'moreThan':
				break;
			case 'lessThan':
				break;
			case 'equals':
				break;
			case 'pattern':
				if (!validateText.validateRule(compareValue, controlValue)) {
					if (messageCustom) {
						message = messageCustom;
					} else {
						message = proxy.$t(`i18nValidate.messages.email`, { field: titleError });
					}
				}
				break;
			default:
				break;
		}
		return message;
	};

	/**
	 * Xử lý validate riêng cho combobox
	 */
	const handlerValidateCombobox = (param) => {
		let rules = props.rules;
		let message = '';
		if(props && typeof props.customValidateRules == 'function'){
			rules = props.customValidateRules(rules, props.dataRow, props.col);
		}
		if (Array.isArray(rules)) {
			for (let index = 0; index < rules.length; index++) {
				const rule = rules[index];
				if (rule) {
					//nktiem Bổ sung thêm cái messageCustom để cho các control có thể tự custom message của mình theo từng rule theo nghiệp vụ
					const { name, compareValue, customValidate, messageCustom } = rule;
					message = validateCombobox.validateRule(name, proxy, messageCustom, param, proxy);
					if (message) {
						break;
					}
				}
			}
		}
		if (props.propsData?.callBack && typeof props.propsData?.callBack == 'function') {
			props.propsData.callBack(props.dataRow, errorMessage, message);
		} else {
			errorMessage.value = message;
		}

		return message;
	};

	const clearValidate = () => {
		errorMessage.value = '';
	};

	/**
	 * Lấy value của control (Các control override hàm này)
	 * @returns
	 */
	const getValueControl = () => {
		if (typeof proxy.getValue()?.trim == 'function') {
			//ntson5: trường hợp number/datetime thì sẽ ko trim đc
			return proxy.getValue().trim(); //kdlong 3.6.2023 fixbug 10389
		}
		return proxy.getValue();
	};

	/**
	 * Lấy title của error
	 * @returns
	 */
	const getTitleError = () => {
		const { title } = props;
		if(proxy._isGridEditor){
			const titleError = proxy.col.headerCustom ? proxy.col.headerCustom : proxy.$t(proxy.col.header);
			return titleError;
		}
		else{
			return title || getValidateName();
		}
	};

	/**
	 * Nếu control không khai báo name để hiển thị thông tin lỗi validate -> up parent find label
	 */
	const getValidateName = () => {
		let fn = function (el, c) {
			if (!el || c > 10) {
				return null;
			}

			let labelEl = el.querySelector('label');
			if (labelEl) {
				return (labelEl.innerText || '').replace('*', '');
			}

			return fn(el.parentNode, c + 1);
		};

		return fn(proxy.$el, 0);
	};

	//nhgiang4 - 03.11.2023: fixbug 50340
	const setErrorCustom = (mess) => {
		errorMessage.value = mess;
		if (proxy.dataRow) {
			proxy.internalText = proxy.dataRow[proxy.modelDisplayField];
		}
	};
	return {
		errorMessage,
		validate,
		handlerValidateCombobox,
		getTitleError,
		clearValidate,
		isValidate,
		setErrorCustom,
	};
};
