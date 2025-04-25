<script>
import { defineComponent, onMounted, getCurrentInstance } from 'vue';
import msCombobox from './MsComboboxV2.vue';
import { useValidateControl } from "@/setup/validateControl";

export default defineComponent({
	name: 'msComboboxEnum',
	extends: msCombobox,
	props: {
		enum: {
			default: null,
			type: String,
		},
		/**
		 * @override
		 */
		valueField: {
			type: String,
			default: 'enumValue',
		},
		/**
		 * @override
		 */
		displayField: {
			type: String,
			default: 'enumText',
		},

		values: {
			type: [Array, String],
			default: '',
		},

		/**
		 * Custom dữ liệu
		 */
		customData: {
			default: null,
			type: [Array, Function],
		},

    /*
		 *Dùng khi muốn hiển thị tất cả dữ liệu khi expend combobox
		 */
		expandAll: {
			type: Boolean,
			default: true,
		},
	},

	setup(props) {
		//Variable
		const { proxy } = getCurrentInstance();

		const { errorMessage, handlerValidateCombobox, getTitleError } = useValidateControl({
			props,
		});
		const validate = () => {
			return handlerValidateCombobox();
		};
		//Hooks
		onMounted(() => {
			loadEnumSource();
		});

		//Method
		/**
		 * Bổ sung values theo dạng text hoặc mảng để có thể filter theo enum
		 * NCPHUOC 15/07/2022
		 */
		const loadEnumSource = () => {
			let source = proxy.$ms.commonFn.getEnumSource(proxy.enum, proxy.values);
			if (Array.isArray(source)) {
				let filterItems = [];
				if (Array.isArray(props.values) && props.values.length > 0) {
					filterItems = props.values;
				} else {
					if (props.values) {
						filterItems = props.values.split(',');
					}
				}

				if (filterItems.length > 0) {
					const map = new Map();
					//Map lại để lấy cho nhanh
					filterItems.forEach((x) => {
						map.set(x, 1);
					});
					source = source.filter((item) => map.has(item.enumValue));
				}
			}

			/** Xử lý custom dữ liệu */
			if (proxy.customData) {
				if (Array.isArray(proxy.customData)) {
					source = proxy.customData.concat(source);
				}

				if (typeof proxy.customData == 'function') {
					source = proxy.customData(source, proxy);
				}
			}

			proxy._allData = source;
			//tvthai 18.5.2023: Gán internalDataSource, fix lỗi lần đầu mở form chưa có internalDataSource => lỗi k gán dc giá trị mặc định cho combobox
			proxy.internalDataSource = source;
			//nvlam 26.06.2023: sau khi load xong phải chọn dữ liệu do hàm chọn ở combobox đã chạy trước khi combobox enum load dữ liệu
			proxy.doSelectValue(proxy.modelValue);
		};

		/**
		 * Override lại hàm này, thêm set internal value trên comboboxenum
		 * Hàm này chỉ chạy 1 lần duy nhất như trong base
		 */
		const setInitText = (val) => {
			//toàn bộ quá trình base nó tự làm hết cho rồi.
			//nên mình chỉ cần fix trường hợp khi nào là lần đầu tiên mở thôi
			if (proxy.internalValue == null) {
				if (proxy.modelValue != null || proxy.modelValue != undefined) {
					//ưu tiên modelValue trước
					proxy.internalValue = proxy.modelValue;
					const sources = proxy.$ms.constant[props.enum];
					let text = '';
					for (let key in sources) {
						if (sources[key] === proxy.modelValue) {
							let enumText = proxy.$t('i18nEnum.' + props.enum + '.' + key);
							text = enumText;
							break;
						}
					}
					proxy.internalText = text;
				} else if (proxy.initText) {
					//sau đó mới ưu tiên theo initText
					proxy.internalText = proxy.initText ? proxy.initText : val;
					const sources = proxy.$ms.constant[props.enum];
					if (Object.keys(sources)?.length > 0) {
						let value = null;
						for (const key in sources) {
							let enumText = proxy.$t('i18nEnum.' + props.enum + '.' + key);
							if (val === enumText) {
								value = sources[key];
								break;
							}
						}
						if (typeof value !== 'undefined' && value !== null) {
							proxy.setValue(value);
						}
					}
				}
			}
		};
		return {
			validate,
			errorMessage,
			getTitleError,
			setInitText,
			loadEnumSource,
		};
	},
	watch: {
		_filterData: function (newVal, oldVal) {
			let me = this;
			if (newVal.length > 0) {
				let itemFind = newVal.find((x) => x.enumText.trim() == me.internalText?.trim());
				if (itemFind) {
					if (itemFind.enumValue !== me.internalValue) {
						me.oldItemSelected = me.internalSelectedItem;
						me.setValue(itemFind.enumValue, true);
					}
				} else if (me.internalValue != null) {
					me.internalSelectedItem = null;
					me.typeAheadPointer = -1;
					me.internalValue = null;
					me.$emit('update:modelValue', me.internalValue);
					me.$emit('update:display', '');
				}
			}
		},
	},
});
</script>

<style lang="scss" scoped>
@use "@/assets/scss/component/MsCombobox.scss" as style;
</style>
