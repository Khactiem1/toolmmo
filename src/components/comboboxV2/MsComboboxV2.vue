<template>
	<div class="ms-combobox ms-editor data-input ms-validate">
		<div class="flex">
      <label class="label mb-2" v-if="label">{{ label }}</label>
      <div
        class="ms-textarea-required"
        v-if="label && rules && rules.find((_) => _?.name == 'required')"
      >
        &nbsp;{{ textRequired }}
      </div>
      <slot name="labelCustom"></slot>
    </div>
		<div class="flex-row flex combo-box-input" :class="[{ 'input-error': errorMessage, disabled: disabled }]">
			<input
				:title="internalText"
				ref="input"
				class="input flex w-100"
				:placeholder="placeholder"
				v-model="internalText"
				v-on="listeners"
				:disabled="disabled"
				:readOnly="readOnly || selectOnly"
				:maxlength="maxLength"
				:class="{ disabled: disabled }"
				@keydown.esc="onEsc"
				@keydown.enter="onEnter"
			/>
			<div
				@click="triggerClick"
				class="icon-combo--dropdown"
				:class="{
					disabled: disabled,
					'point-event-none': readOnly,
					expand: expanded,
				}"
			></div>
		</div>
		<div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
		<teleport to="body">
			<ms-combo-box-dropdown
				ref="dropdownPanel"
				v-if="expanded"
				:topx="dropdownTopx"
				:leftx="dropdownLeftx"
				:maxWidthx="dropdownMaxWidthx"
				:minWidthx="dropdownMinWidthx"
				:maxItemsDisplay="maxItemsDisplay"
				:columnx="columns"
				:comboType="comboType"
				@scrollend="dropdownScrollEnd"
				:highlighIndex="typeAheadPointer"
				:scrollTop="dropdownScrollTop"
				:loading="loading"
				:showEmptyText="isShowTextEmpty"
			>
				<ms-combo-box-item
					v-for="(item, index) in internalDataSource"
					:key="item[valueField]"
					:comboType="comboType"
					:item="item"
					:columnx="columns"
					:valueField="valueField"
					:displayField="displayField"
					:class="{ 'checked': typeAheadPointer == index }"
					@click="onItemClick(item, $event)"
				>
				</ms-combo-box-item>
			</ms-combo-box-dropdown>
		</teleport>
	</div>
</template>
<script>
import { defineComponent } from 'vue';
import MsComboBoxDropdown from './MsComboBoxDropdown.vue';
import MsComboBoxItem from './MsComboBoxItem.vue';
import msBaseComponent from '@/components/base/MsBaseComponent.vue';
import EventBusGlobal, { GlobalEventName } from '@/commons/eventBusGlobal';
import { debounce, isEqual, isEmpty } from 'lodash-es';
import { filter } from '@/mixins/common/filter';
import { useValidateControl } from "@/setup/validateControl";

export default defineComponent({
	name: 'msComboboxV2',
	extends: msBaseComponent,
	mixins: [filter],
	components: {
		MsComboBoxDropdown,
		MsComboBoxItem,
	},
	emits: [
		'msKeydown',
		'comboboxLoadData',
		'blur',
		'beforeQuery',
		'autoSelected',
		'update:modelValue',
		'update:suffixDisplay',
		'update:display',
		'update:data',
		'selected',
		'beforeExpand',
		'change',
		'click',
		'input',
		'paste',
		'beforeSelected',
		'edit-item',
	],
	props: {
		modelValue: {

		},
		placeholder: {
			default: null,
			type: String,
		},
		maxItemsDisplay: {
			default: 8,
			type: Number,
		},
		columns: {
			type: Array,
			default: () => [],
		},
		/**
		 * Trường làm value
		 */
		valueField: {
			type: String,
			default: null,
		},
		/**
		 * Trường giá trị ngăn cách
		 */
		seperateChar: {
			type: String,
			default: '-',
		},
		/**
		 * Trường làm text display
		 */
		displayField: {
			type: String,
			default: null,
		},
		//Dữ liệu của combobox
		data: {
			default: () => [],
			type: Array,
		},
		/**
		 * Kí hiệu cảnh báo trường bắt buộc nhập không được bỏ trống
		 */
		textRequired: {
			type: String,
			default: '*',
			required: false,
		},

		//Độ rộng của 1 item
		itemSize: {
			default: 32,
			type: Number,
		},
		//Chỉ nhận giá trị có trong danh sách
		forceSelection: {
			default: true,
			type: Boolean,
		},
		//Độ rông của dropdown tính bằng px
		dropdownWidth: {
			default: null,
			type: [String, Number],
		},
		//Mode query lấy dữ liệu từ server hay client
		queryMode: {
			type: String,
			default: 'local',
		},
		remoteFilter: {
			type: Boolean,
			default: false,
		},
		//Gán giá trị text lúc ban đầu
		initText: {
			default: null,
			type: String,
		},
		//chỉ cho phép chọn không cho phép nhập text
		selectOnly: {
			default: false,
			type: Boolean,
		},
		display: {},
		firstExpandLoad: {
			default: false,
			type: Boolean,
		},
		keyField: {
			// default: '__vKeyValue',
			type: String,
		},
		maxLength: {
			default: null,
			type: Number,
		},
		/**
		 * custom lại tham số filter
		 */
		buildFilter: {
			type: Function,
			default: null,
		},
		/**
		 * size paging
		 */
		pageSize: {
			type: Number,
			default: 20,
		},
		//Xác định các rule validate
		// Mặc định của combo sẽ là force select
		rules: {
			default: [{ name: 'forceSelection' }],
			type: Array,
		},
		/*
		 *Dùng khi muốn hiển thị tất cả dữ liệu khi expend combobox
		 */
		expandAll: {
			type: Boolean,
			default: false,
		},
	},

	setup(props) {
		const { errorMessage, handlerValidateCombobox, getTitleError, clearValidate, setErrorCustom } = useValidateControl({
			props,
		});
		const validate = () => {
			return handlerValidateCombobox();
		};

		return {
			errorMessage,
			validate,
			getTitleError,
			clearValidate,
			setErrorCustom,
		};
	},
	computed: {
		/**
		 * data source cho tooltip
		 */
		tooltipDataSource() {
			const me = this;
			let dataSource = me.internalDataSource;
			if (me._allData && me._allData.length > 0) {
				dataSource = me._allData;
			}
			return dataSource;
		},
		listeners() {
			const me = this;
			return {
				input: (event) => me.onInput(event),
				focus: (event) => me.onFocus(event),
				change: (event) => me.onChange(event),
				blur: (event) => me.onBlur(event),
				keydown: (event) => me.onKeydown(event),
				click: (event) => me.onClick(event),
			};
		},
		//Tính độ rộng của dropdown combobox để scroll
		styleScroller() {
			const me = this;
			return { 'max-height': me.maxItemsDisplay * me.itemSize + 'px' };
		},
	},
	data() {
		const me = this;
		me.initStaticData();

		return {
			internalDataSource: [],
			_filterData: [],
			internalText: null,
			expanded: false,
			dropdownTopx: 0,
			dropdownLeftx: 0,
			internalSelectedItem: null,
			typeAheadPointer: -1,
			focused: false,
			//kích thước mặc định của itemSize của combox khi được dùng trên lưới Editor
			gridItemSize: 48,
			tooltipLeft: 0,
			dropdownScrollTop: 0,
			/**
			 * Đang load dữ liệu
			 */
			loading: false,
			/**
			 * Tham số load dữ liệu lần gần nhất
			 */
			lastRequestParam: null,
			dropdownMinWidthx: null,
			dropdownMaxWidthx: null,
			isShowTextEmpty: false,
		};
	},

	watch: {
		data: {
			deep: true,
			immediate: true,
			handler(newVal, oldVal) {
				const me = this;
				if (me.loading) {
					me.loading = false;

					me.$nextTick(() => {
						me.doHightlightItem();
					});
				}
				if (newVal == null) {
					//tình huống có thêm/sửa/xóa dữ liệu gốc -> reset để khi expand sẽ load lại dữ liệu
					me.lastQueryString = new Date().getTime();
					me._allData = null;
				} else {
					if (me.queryMode !== 'remote') {
						me._allData = newVal;
					}
					if(me.expandAll){
						me.internalDataSource = me.filterData(me.lastQueryString, newVal)
					} else {
						//Fix lỗi trường hợp tìm kiếm 2 lần liên tiếp ra cùng 1 kết quả giống nhau thì không cập nhật
						if(!me.checkTwoArrayAreTheSame(newVal, me.internalDataSource)){
							me.updateInternalDataSource()
						}
					}
					if (!me.checkTwoArrayAreTheSame(newVal, oldVal) && !me.checkTwoArrayAreTheSame(newVal, me.internalDataSource)) {
						me.initData();
						//@nktiem: me.internalDataSource != newVal (ko hiểu đk này làm gì, gây lỗi hiển thị không có dữ liệu, tạm thời bỏ đk này đi) Bug 24383
						if (!(me.internalDataSource.length === 0 && newVal.length === 0)) {
							//Sau khi bind dữ liệu vào _allData thì thực hiện select lại đối tượng
							if (me.isValid(me.internalValue)) {
								me.doSelectValue(me.internalValue);
							}
						}
					}
				}
			},
		},
		/**
		 * Set lại giá trị hiển thị khi giá trị của biến initText thay đổi
		 */
		initText: {
			immediate: true,
			handler(newVal, oldVal) {
				let me = this;
				//Fix lỗi cellcomboboxVatRate giá trị enum = 0
				if (newVal || newVal == 0 || oldVal || oldVal == 0) {
					me.setInitText(newVal);
				}
			},
		},
		//Khi thay đổi số phần tử của combox thì thiết lập lại vị trí của dropdow
		internalDataSource: {
			immediate: true,
			handler(newVal, oldVal) {
				//ĐVThi sửa lỗi 90491 không thay đổi vị trí khi gõ text để search trên combox
				this.changeDropdownPosition();
				if(newVal && newVal.length > 0){
					this.isShowTextEmpty = false;
				}
				else{
					this.isShowTextEmpty = true;
				}
			},
		},

		/**
		 * Theo dõi sư thay đổi của error message
		 * phục vụ reset lại combo khi validate
		 */
		errorMessage: {
			immediate: true,
			handler(newVal, oldVal) {
				let me = this;
				if (newVal) {
					me.resetWhenHasErrorMessage();
				}
			},
		},

		/**
		 * Theo dõi sự thay đổi của value
		 * Phục vụ mục đích binding 2 chiều
		 */
		modelValue: {
			immediate: true,
			handler(newVal, oldVal) {
				let me = this;
				if (me.isValid(newVal)) {
					me.doSelectValue(newVal, oldVal);
				} else {
					//Nếu dữ liệu v-model không hợp lệ thì reset giá trị
					const me = this;
					me.internalSelectedItem = null;
					me.typeAheadPointer = -1;
					me.internalValue = null;
					me.$emit('update:modelValue', me.internalValue);
					me.$emit('update:display', '');
				}
			},
		},
	},
	//Hàm khởi tạo dữ liệu hook func
	created() {
		const me = this;
		me.initIndex = 0;

		me.initCombo();
		me.initData();
		me.reload = true;
		EventBusGlobal.$on(GlobalEventName.scrollEvent, me.scrollEvent);
	},
	mounted() {
		const me = this;
		//Debounce query để delay load
		if (me.queryMode != 'remote') {
			me.internalQueryDelay = 0;
		}
		me.doQuery = debounce(me.doQueryInternal, me.internalQueryDelay);
		document.addEventListener('click', me.click_out);
	},
	methods: {
		/**
		 * nếu validate combo có lỗi reset combo và cập nhật lại modelvalue, display value
		 */
		resetWhenHasErrorMessage() {
			let me = this;
			me.internalSelectedItem = null;
			me.typeAheadPointer = -1;
			me.internalValue = null;
			me.$emit('update:modelValue', me.internalValue);
			me.$emit('update:display', me.internalText);
		},

		/**
		 * Kiểm tra sự khác biệt giữa 2 mảng
		 */
		checkTwoArrayAreTheSame(a, b) {
			//2 thằng cùng null
			if (a == b) {
				return true;
			} else {
				if (a && b) {
					return JSON.stringify(a) === JSON.stringify(b);
				}
			}
			return false;
		},
		/**
		 * Lấy thông tin item giá trị của combo (value)
		 * @author nvtoan1 - 24.5.2023
		 */
		getItemByValue(value, isDisplayValue) {
			let me = this,
				item;

			if (me.isValid(value)) {
				if (me._allData && me._allData.length > 0) {
					// Trả về item đầu tiên match điều kiện
					// Undefined nếu không có
					item = me._allData.find((item) => {
						return isEqual(isDisplayValue ? item[me.displayField] : item[me.valueField], value);
					});
				} else {
					item = me.internalDataSource.find((item) => {
						return isEqual(isDisplayValue ? item[me.displayField] : item[me.valueField], value);
					});
				}
				if (!item && !isDisplayValue) {
					item = {
						[me.valueField]: me.modelValue,
						[me.displayField]: me.initText,
					};
				}
			}

			//Nếu không có item, trả về null thay vì undefined
			if (!item) {
				return null;
			}

			return item;
		},
		/**
		 * Hàm xử lý update combo theo v-model
		 */
		doSelectValue(value) {
			let me = this,
				item = me.getItemByValue(value);
			if (me.isValid(item)) {
				me.setInternalItem(item, true);
			}
		},
		/**
		 * Hàm kiểm tra giá trị hợp lệ
		 */
		isValid(value) {
			if (typeof value === 'object') {
				return !isEmpty(value);
			}
			return value !== undefined;
		},
		getValue() {
			const me = this;
			return me.internalText;
		},
		/**
		 * kiểm tra xem dữ liệu trên combobox có trống hay không
		 */
		isNullOrEmptyvalue() {
			if (this.modelValue == null || this.modelValue == {}) {
				return true;
			} else {
				return false;
			}
		},
		/**
		 * Bắt sự kiện khi scroll trên chương trình thì đóng combobox lại
		 */
		scrollEvent() {
			const me = this;
			if (me.expanded) {
				me.collapse();
			}
		},
		/**
		 * Mặc định chọn giá trị theo index ban đầu
		 */
		setInitIndex() {
			const me = this;
			if (me.initIndex >= 0 && me.internalDataSource && me.internalDataSource.length > 0 && me.typeAheadPointer < 0) {
				me.typeAheadPointer = me.initIndex;
				me.setInternalItem(me.internalDataSource[me.typeAheadPointer], false);
			}
		},
		/**
		 * Set giá trị hiện thị ban đầu cho combobox khi combo chưa có dữ liệu
		 */
		setInitText(val) {
			const me = this;
			me.internalText = me.initText ? me.initText : val;
		},
		/**
		 * Thực hiện query dữ liệu, có thể từ local hoặc remote tùy theo cấu hình
		 */
		doQueryInternal(searchString, expand) {
			let me = this,
				event = { preventDefault: false, sender: me },
				queryString = searchString;
			me.$emit('beforeQuery', event);
			if (event.preventDefault) {
				return false;
			}
			//Đoạn này check xem nếu khác querystring thì thực hiện load data từ server
			if (me.lastQueryString == queryString && !me.reload) {
				if (expand) {
					me.expand();
				}
			} else {
				//Nếu có queryString thì thực hiện reset data về ban đầu
				if (queryString) {
					me.dropdownScrollTop = 0;
					me.internalDataSource = [];
					me.lastQueryString = queryString;
					me.querying = true;
				}

				if (me.queryMode === 'remote' && !me._allData) {
					me.lastQueryString = queryString;
					me.doRemoteQuery(queryString);
				} else {
					me.$nextTick(() => {
						me.doLocalQuery(queryString);
						if (expand && !me.expanded) {
							me.expand();
						} else {
							me.doHightlightItem(true);
						}
					});
				}
				me.reload = false;
			}
		},

		/**
		 * Xử lý sau khi query xong dữ liệu
		 */
		afterQuery(expand) {
			const me = this;
			if (expand) {
				me.expand();
			}
		},
		/**
		 * Query dữ liệu api
		 */
		doRemoteQuery(queryString) {
			//Build filter,
			let me = this,
				filters = [],
				filterFields = me.filterFields || {};
			return new Promise((resolve, reject) => {
				try {
					if (queryString) {
						const fields = Object.keys(filterFields);
						let filter = {
							Field: fields[0],
							Operator: filterFields[fields[0]],
							Value: queryString,
						};
						filters.push([filter.Field, filter.Operator, filter.Value]);
						if (fields.length > 1) {
							for (let i = 1; i < fields.length; i++) {
								filters.push('or');
								filters.push([fields[i], filterFields[fields[i]], queryString.trim()]);
							}
						}
					}
					let payload = {};
					payload.PageIndex = 1;
					payload.PageSize = me.pageSize;
					payload.pageAppend = false;
					if (filters.length > 0) {
						payload.Filter = JSON.stringify(filters);
					}
					if (me.modelValue && me.valueField) {
						payload.CustomParam = {
							SelectedValue: me.modelValue,
							FieldKey: me.valueField,
						};
						payload.UseSp = true;
					}

					let columns = [me.displayField, me.valueField];
					if (me.columns && me.columns.length > 0) {
						me.columns.forEach((item) => {
							if (item.dataField && columns.indexOf(item.dataField) === -1) {
								columns.push(item.dataField);
							}
						});
					}
					columns = columns.distinctKey(columns);
					payload.columns = columns.join(',');
					me.lastRequestParam = payload;

					if (typeof me.buildFilter == 'function') {
						me.buildFilter(payload);
					}
					me.loading = true;
					me.$emit('comboboxLoadData', payload);
					resolve();
				} catch (error) {
					reject(error);
				}
			});
		},
		/**
		 * Query dữ liệu local
		 */
		doLocalQuery(queryString) {
			const me = this;
			let filterData = me.filterData(queryString);
			if (queryString && me.comboType === 3) {
				//thêm cha vào để build cây
				let roots = [];
				let i = 0;
				while (i < filterData.length) {
					let item = filterData[i],
						parent = item.parentNode;

					if (!parent || Array.isArray(parent)) {
						roots.push(item);
					} else if (filterData.indexOf(parent) === -1) {
						filterData.push(parent);
					}
					i++;
				}

				//sắp xếp root theo đúng thứ tự
				if (roots.length > 1) {
					let rs = [];
					for (let i = 0; i < me._allData.length; i++) {
						let item = me._allData[i];
						if (roots.indexOf(item) > -1) {
							rs.push(item);

							if (rs.length === roots.length) {
								roots = rs;
								break;
							}
						}
					}
				}

				//build cây
				let rs = [];
				let fnPush = function (item) {
					rs.push(item);
					if (Array.isArray(item.childNodes)) {
						item.childNodes.forEach((child) => {
							if (filterData.indexOf(child) > -1) {
								fnPush(child);
							}
						});
					}
				};
				roots.forEach((item) => {
					fnPush(item);
				});

				//sắp xếp theo misaCode
				filterData = rs;
			}

			me._filterData = filterData;
			let ds = [];
			if (me.expandAll) {
				ds = [...me._filterData];
			} else {
				let count = Math.min(me._filterData?.length, me.pageSize);
				for (let i = 0; i < count; i++) {
					ds.push(me._filterData[i]);
				}
			}
			me.internalDataSource = ds;
		},
		filterData(queryString, source) {
			const me = this;
			let matchItem = [];

			let sourceAllData = source ? source : me._allData

			if (queryString) {
				sourceAllData?.forEach((item) => {
					let valid = false;
					for (let f in me.filterFields) {
						let value = item[f];
						let test = me.testFilter(me.filterFields[f], value, queryString);
						if (test) {
							valid = true;
							break;
						}
					}

					if (valid) {
						matchItem.push(item);
					}
				});
			} else {
				matchItem = sourceAllData;
			}
			return matchItem;
		},

		/**
		 * Lấy chuỗi cần query, trường hợp number thì lấy value bỏ qua ký tự phân cách
		 */
		getQueryString() {
			return (this.internalText || '').trim();
		},
		//Click ra ngoài combo đóng combo lại
		click_out(e) {
			const me = this;
			if (!me.$ms.commonFn.hasParent(e.target, me.$el) && me.$refs.dropdownPanel && me.$refs.dropdownPanel.$el && !me.$ms.commonFn.hasParent(e.target, me.$refs.dropdownPanel.$el)) {
				me.collapse();
			}
		},
		//Reset lại các giá trị trong combobox
		reset() {
			const me = this;
			me.internalText = '';
			me.internalSelectedItem = null;
			me.typeAheadPointer = -1;
			me.internalValue = null;
			me.$emit('update:modelValue', me.internalValue);
			me.$emit('update:display', '');
		},
		/**
		 * Set giá trị hiển thị
		 * @pram value giá trị hiển thị
		 */
		setInternalText(value) {
			const me = this;
			me.internalText = value;
		},
		/**
		 * Set value cho combo
		 */
		setValue(value, userAction = false) {
			const me = this;
			me.internalValue = value;
			me.$emit('update:modelValue', me.internalValue);
			me.doHightlightItem();
			if (me.typeAheadPointer >= 0) {
				me.setInternalItem(me.internalDataSource[me.typeAheadPointer], userAction);
			}
		},
		//Sự kiện nhập liệu trên input
		onInput() {
			const me = this;
			me._typing = true;
			me.internalValue = null;
			if (!me.expanded && !(me.internalSelectedItem && !me.internalText)) {
				me.expand();
			} else if (!me.expanded && me.internalSelectedItem && !me.internalText) {
				let metaData = {
					oldData: me.internalSelectedItem,
					newData: null,
				};
				me.reset();
				me.$emit('selected', metaData, me);
				me.oldItemSelected = null;
				return;
			}

			if (!me.internalText) {
				let metaData = {
					oldData: me.internalSelectedItem,
					newData: null,
				};
				me.reset();
				me.$emit('selected', metaData, me);
				me.oldItemSelected = null;
			}

			me.doQuery(me.internalText?.trim(), true);
			me._typing = false;
			if (!me.rules.some((x) => x.name === me.$ms.constant.ValidateRule.ForceSelection) && me.valueField === me.displayField) {
				me.internalValue = me.internalText;
				me.$emit('update:modelValue', me.internalValue);
			}
			me.doHightlightItem(true);
			me.adjustScroll();
		},
		//Sự kiện click vào input
		onClick(e) {
			let el = this.$refs['input'];
			if (el) {
				el.focus();

				this.$nextTick(() => {
					el.select();
				});
			}
			this.$emit('click', e);
			this.triggerClick(e);
		},
		//Sự kiện focus vào input
		onFocus() {
			const me = this;
			me.focused = true;
		},
		//Sự kiện change input
		//Tạm rem hàm này, chưa hiểu làm gì
		onChange(e) {
			let me = this,
				item = me.getItemByValue(me.internalText, true);
			e.valueTextCombo = me.internalText; // DHHoang bổ sung fixbug: 59398
			//Kiểm tra có phải change thật sự ko, Nếu sự kiện change do selected thì ko emit ra sự kiện change nữa do sai nghiệp vụ.
			if(!me.expanded){
				e.isChangeData = true;
			}
			if (me.isValid(item)) {
				me.setInternalItem(item, false);
			}
		},
		//Sự kiện blur input
		onBlur(e) {
			const me = this;
			me.focused = false;

			this.$nextTick(() => {
				setTimeout(() => {
					me.validateBlur();
				}, 100);
			});
			me.$emit('blur', e);
		},
		//Sự kiện keydown input
		onKeydown(e) {
			const me = this;
			// e.stopPropagation();
			//Nếu bấm 2 mũi tên lên xuống mà đang mở dropdown thì ko emit ra ngoài để xử lý
			let isEmitOut = true;
			switch (e.which) {
				//arrow down
				case 40:
					{
						if (!me.expanded) {
							//Thêm expand khi thực hiện query dữ liệu mới
							me.expanded = true;
							me.doQueryInternal('', true);
						} else {
							isEmitOut = false;
							if (me.typeAheadPointer < me.getTotalData() - 1) {
								me.typeAheadPointer++;
								me.adjustScroll();
								me.internalText = me.internalDataSource[me.typeAheadPointer]?.[me.displayField];
							}
						}
					}
					break;
				//arrow up

				case 38:
					{
						if (me.expanded) {
							isEmitOut = false;
							if (me.typeAheadPointer > 0) {
								me.typeAheadPointer--;
								me.adjustScroll();
								me.internalText = me.internalDataSource[me.typeAheadPointer]?.[me.displayField];
							}
						}
					}
					break;
				case 13:
					{
						if (me.typeAheadPointer >= 0) {
							me.setInternalItem(me.internalDataSource[me.typeAheadPointer]);
						}
						me.collapse();
					}
					break;
				case 9:
					{
						if (me.expanded) {
							if (me.typeAheadPointer >= 0) {
								me.setInternalItem(me.internalDataSource[me.typeAheadPointer]);
							}
							me.collapse();
						}
					}
					break;
			}
			if (isEmitOut) {
				me.$emit('msKeydown', e);
			}
		},
		//Lấy tổng số lượng dữ liệu trong data
		getTotalData() {
			const me = this;
			return me.internalDataSource.length;
		},
		//Bôi màu hightlight cho item
		doHightlightItem(ignoreValue) {
			const me = this;
			let index = -1;

			if (me.internalDataSource && me.internalDataSource.length > 0) {
				index = -1;

				if (!ignoreValue && me.internalValue != null && me.internalValue != undefined && !me.loadEnumSource) {
					let sources = me._allData || me.internalDataSource;

					//Trước khi load tính toán lại typeAheadPointer nếu cần thiết để scroll di chuyển về dúng vị trí khi show scroller lên
					//Tìm vị trí selectedItem trong source, không lấy selectedIndex vì có thể không chính xác khi source thay đổi
					for (let i = 0; i < sources.length; i++) {
						let item = sources[i];
						if (item[me.valueField] === me.internalValue) {
							index = i;
							break;
						}
					}
				}

				if (index === -1 && me.internalText) {
					let lowerText = me.internalText.toLowerCase().trim();

					if (me.columns && me.columns.length > 0) {
						for (let i = 0; i < me.internalDataSource.length; i++) {
							let item = me.internalDataSource[i];
							for (let j = 0; j < me.columns.length; j++) {
								let field = me.columns[j].dataField;
								let itemValue = item[field];
								if (typeof itemValue === 'string' && itemValue.toLowerCase().indexOf(lowerText) > -1) {
									index = i;
									break;
								}
							}

							if (index > -1) {
								break;
							}
						}
					} else {
						for (let i = 0; i < me.internalDataSource.length; i++) {
							let itemValue = me.internalDataSource[i][me.displayField];
							if (typeof itemValue === 'string' && itemValue.toLowerCase().indexOf(lowerText) > -1) {
								index = i;
								break;
							}
						}
					}
				}
			}

			me.typeAheadPointer = index;
		},
		/**
		 * Tìm item theo text truyền vào
		 * @param source nếu có source thì sẽ tiến hành lấy từ source ko lấy từ internalDataSource
		 */
		findItemByText(queryText, source) {
			if (!queryText) return false;
			let data = [];
			if(source && source.length){
				data = source;
			}
			else{
				data = this.internalDataSource;
			}
			if (!data || data.length === 0) return false;
			return data.filter((item) => {
				let text = item[this.displayField];
				if (queryText === text) {
					return item;
				}
			});
		},
		//Tìm kiếm item trong list
		filterIndexItemByText(queryText) {
			const me = this;
			let filters = me.filterFields,
				value = queryText || me.internalText,
				index = -1;
			if (filters && value) {
				value = value.toString();
				index = me.internalDataSource.findIndex((item, _index) => {
					let ret = false;
					for (const key in filters) {
						if (filters.hasOwnProperty(key)) {
							const s = filters[key];
							if (s == '*') {
								ret = item[key] && item[key].toString() && item[key].toString().toLowerCase().contains(value.toLowerCase());
							} else {
								ret = item[key] && item[key].toString() && item[key].toString().toLowerCase().startsWith(value.toLowerCase());
							}
							if (ret) {
								break;
							}
						}
					}
					return ret;
				});
			}
			return index;
		},
		//Lấy cột filter để tìm kiếm local
		getFilterFields() {
			let filter = {};
			const me = this;
			if (this.columns && this.columns.length > 0) {
				for (let i = 0; i < this.columns.length; i++) {
					const col = this.columns[i];
					if (!col.filterOperator) {
						filter[this.displayField] = me.$ms.constant.FilterOperator.Contains;
					}
					if (col.dataField && col.filterOperator) {
						if (this.filterColumns && this.filterColumns.length > 0) {
							this.filterColumns.forEach((e) => {
								if (!filter.hasOwnProperty(e)) {
									filter[e] = col.filterOperator;
								}
							});
						} else {
							filter[col.dataField] = col.filterOperator;
						}
					}
				}
			} else {
				//kdlong 31.05.2023 sửa lại operator cho khớp với BE
				filter[this.displayField] = me.$ms.constant.FilterOperator.Contains;
			}
			return filter;
		},
		//Lấy element scroll
		getScroller() {
			if (this.expanded) {
				let dd = this.$refs['dropdownPanel'];
				if (dd && dd.$el && typeof dd.$el.querySelector === 'function') {
					return dd.$el.querySelector('.scroller-overlay');
				}
			}
			return null;
		},
		getMaxHeiCurrItems() {
			let dd = this.$refs['dropdownPanel'];
			if (dd && dd.$el && typeof dd.$el.querySelector === 'function') {
				return dd.$el.querySelector('.scroller-overlay .dropdown-items');
			}
			return null;
		},
		/**
		 * Di chuyển view đến bản ghi nếu cần
		 */
		adjustScroll(typeAheadPointer = this.typeAheadPointer) {
			const row = this.$refs['dropdownPanel']?.$el?.querySelector('.combobox-item');

			if (row) {
				const rowHeight = row.getBoundingClientRect().height;
				let scroller = this.getScroller();
				if (scroller) {
					scroller.scrollTop = Number.parseInt(rowHeight) * typeAheadPointer;
				}
			}
		},
		onScrollerVisible() {
			const me = this;
			me.adjustScroll();
		},
		//Hàm xử lý khi chọn item trên dropdown
		async onItemClick(item, event) {
			const me = this;
			event.preventDefault();
			await me.$emit('beforeSelected', item);
			if (item.Break) {
				me.collapse();
				return;
			}
			me.setInternalItem(item);
			if (me.$refs.input) {
				me.$refs.input.focus();
				me.$refs.input.select();
			}
			me.validateBlur(); // nktiem: 22/12/2023 thêm validate ở đây để bỏ validate nếu có Bug 63257
		},
		/**
		 * Xử lý set text khi chọn 1 item
		 * isNotUserSelected: Có là người dùng chọn hay không
		 */
		setInternalItem(item, isNotUserSelected) {
			const me = this;
			if (item) {
				//Lúc chọn item thì phải clear validate, vì trường hợp đang ở trong input, click vào item để chọn thì control bắt sự kiện blur trước để validate
				// => lỗi dính validate đỏ sau khi chọn vì chưa clear validate ở blur
				if (me.clearValidate) me.clearValidate();
				//Lưu lại thông tin old item
				let oldItems = {};

				oldItems = Object.assign({}, me.internalSelectedItem);
				me.internalSelectedItem = item;
				me.internalValue = item[me.valueField];
				me.internalText = item[me.displayField];
				me.$emit('update:display', item[me.displayField]);
				me.$emit('update:modelValue', me.internalValue); // NOTE: Update value sau khi update display mục đích để ghi đè giá trị trong TH là combo Enum
				me.typeAheadPointer = me.findIndexItem(item);
				if (!isNotUserSelected) {
					let metaData = {
						oldData: oldItems,
						newData: item
					};
					me.$emit('selected', metaData);
					me.oldItemSelected = item;

					me.collapse();
				}
			}
		},

		//Tìm vị trị của item trong data
		findIndexItem(item) {
			const me = this;
			if(me.loadEnumSource) {
				return me.internalDataSource.findIndex((_item) => {
					return _item.enumValue == item.enumValue;
				});
			} else {
				return me.internalDataSource.findIndex((_item) => {
					return _item == item;
				});
			}
		},
		//Khởi tạo dữ liệu tĩnh mặc định
		initStaticData() {
			const me = this;
			me.comboType = 1;

			me.internalQueryDelay = 200;
			me.filterFields = me.getFilterFields();
			me.internalValue = null;
			me.firstExpand = true;
		},

		//append và check đã tồn tại chưa
		appendData(data, appendHead = false) {
			const dataQuery = this.queryMode === 'remote' ? this.internalDataSource : this._allData;
			const validData = data.filter((x) => !dataQuery.some((y) => y[this.valueField] === x[this.valueField]));
			appendHead ? this.internalDataSource.unshift(...validData) : this.internalDataSource.append(validData);
			this.$emit('update:data', this.internalDataSource);
		},
		//Khởi tạo dữ liệu
		initData() {
			const me = this;
			me.updateInternalDataSource()

			if (me.keyField && me.keyField !== me.valueField) {
				me.$ms.commonFn.genVKeyValue(me.internalDataSource, me.keyField);
			}
			if (!me.remoteFilter && me.internalDataSource && me.internalDataSource.length > 0) {
				me._allData = me.internalDataSource;
				me.internalDataSource = [];
			}

			if (me._allData) {
				me.doLocalQuery(me.lastQueryString);
			}
		},
		updateInternalDataSource(){
			let me = this;
			if (me.lastRequestParam && me.lastRequestParam.pageAppend) {
				me.appendData(me.data);
				//nếu dữ liệu trả về ít hơn mong đợi -> đánh dấu kết thúc để khi scroll xuống k load thêm nữa
				if (me.data.length < me.pageSize) {
					me.lastRequestParam.end = true;
				} else {
					me.lastRequestParam.end = false;
				}
			} else {
				me.internalDataSource = [...me.data];
			}
		},
		/**
		 * Khởi tạo combo
		 *
		 * @author hngiap - 01.09.2019
		 * 1 là combo không có columns (ComboEditor)
		 * 2 là combo có columns
		 * 3 là combo tree
		 */
		initCombo() {
			let me = this;
			if (me.columns && me.columns.length !== 0) {
				me.comboType = 2;
			} else {
				me.comboType = 1;
			}
		},

		/**
		 * click vào icon dropdown
		 */
		triggerClick(e) {
			const me = this,
				expanded = me.expanded;

			//disable thì không làm gì
			if (me.disabled) {
				return;
			}

			if (!expanded) {
				me.doQueryInternal('', true);
				me.changeDropdownPosition();
				me.doHightlightItem();
			}

			//đặt nextick để tránh lỗi render dom của combobox tree khi chọn item từ dropdown
			me.$nextTick(() => {
				if(me.expanded){
					if (!me.rules.some((x) => x.name === me.$ms.constant.ValidateRule.ForceSelection) && me.valueField === me.displayField) {
						me.$emit('selected', me.internalValue);
					}
				}
				me.expanded = !expanded;
			});

			//focus input
			//focus input
			if (me.$refs.input) {
				me.$refs.input.focus();
				me.$refs.input.select();
			}
		},

		/**
		 * hiển thị dropdown
		 */
		expand() {
			const me = this;
			me.loading = false;

			me.$emit('beforeExpand', me);
			me.changeDropdownPosition();
			me.doHightlightItem();
			if (me.queryMode == 'local') {
				//kiểm tra internalDataSource có số lượng < typeAheadPointer không,
				//nếu có thì lấy tưng đấy + 10
				if (me.internalDataSource && me.internalDataSource.length < me.typeAheadPointer) {
					me.internalDataSource = me._allData.slice(0, Number(me.typeAheadPointer) + Number(me.pageSize));
				}
			}
			//đặt nextick để tránh lỗi render dom của combobox tree khi chọn item từ dropdown
			me.expanded = true;
			me.$nextTick(() => {
				me.adjustScroll(); //fix bug 14675: khi mở combo không load lên đầu combo
			});
		},
		/**
		 * ẩn dropdown
		 */
		collapse() {
			const me = this;
			me.$nextTick(() => {
				if(me.expanded){
					if (!me.rules.some((x) => x.name === me.$ms.constant.ValidateRule.ForceSelection) && me.valueField === me.displayField) {
						me.$emit('selected', me.internalValue);
					}
				}
				me.expanded = false;
			});
		},
		/**
		 * Hàm set vị trí cho dropdown menu khi expand
		 */
		changeDropdownPosition() {
			let me = this,
				comboEl = me.$el;

			if (comboEl) {
				comboEl = comboEl.getElementsByClassName('combo-box-input')[0];
			}

			if (comboEl) {
				let comboElRect = comboEl.getBoundingClientRect();

				let windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

				let windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

				me.dropdownLeftx = comboElRect.left;
				me.dropdownTopx = comboElRect.top + comboElRect.height + 2;
				me.dropdownMaxWidthx = me.dropdownMinWidthx = me.dropdownWidth ? me.dropdownWidth : comboElRect.width;

				// Nếu chạm phải thì align sang trái
				if (comboElRect.left + me.dropdownMaxWidthx > windowWidth) {
					me.dropdownLeftx = comboElRect.right - me.dropdownMaxWidthx;
				}

				// Nếu chạm bottom thì align top
				let maxItemsDisplay = me.maxItemsDisplay;
				if (me.columns && me.columns.length > 0) {
					maxItemsDisplay += 1;
				}
				if (comboElRect.bottom + me.itemSize * maxItemsDisplay + 2 > windowHeight) {
					let itemsSource = me.columns && me.columns.length > 0 && maxItemsDisplay > me.internalDataSource.length ? me.internalDataSource.length + 1 : me.internalDataSource.length;
					if (me.internalDataSource.length !== 0) {
						me.dropdownTopx = comboElRect.top - (me.itemSize * Math.min(maxItemsDisplay, itemsSource) + 4);
					} else {
						// Trường hợp không có dữ liệu cộng thêm chiều cao của text "không có dữ liệu"
						me.dropdownTopx = comboElRect.top - (me.itemSize * Math.min(maxItemsDisplay, itemsSource) + 42);
					}
				}
			}
		},

		/**
		 * Validate khi blur
		 */
		validateBlur() {
			let me = this;
			this.validate(this);
		},
		/**
		 * scroll xuống cuối drowndown -> load thêm dữ liệu
		 */
		dropdownScrollEnd() {
			const me = this;
			// if (me.pagination) {
			if (me.queryMode === 'remote' && !me._allData) {
				me.scrollDoing = true;
				//remote
				if (me.lastRequestParam && !me.lastRequestParam.end) {

					let payload = me.lastRequestParam;
					payload.PageIndex = payload.PageIndex + 1;
					payload.pageAppend = true;
					me.$emit('comboboxLoadData', payload);
				}
			} else {
				//local
				let data = me._filterData || me._allData;
				if (data) {
					me.internalDataSource = me.internalDataSource || [];
					let start = me.internalDataSource.length;
					let count = Math.min(data.length, me.pageSize + start);
					for (let i = start; i < count; i++) {
						me.internalDataSource.push(data[i]);
					}
				}
			}
			// }
		},
		/**
		 * xử lý phím esc
		 */
		onEsc(e) {
			const me = this;

			//ẩn dropdown và stop event nếu đang expand
			if (me.expanded) {
				me.collapse();
				e.preventDefault();
				e.cancel = true;
			}
		},

		/**
		 * xử lý phím enter
		 */
		onEnter(e) {
			const me = this;

			if (me.expanded && !me.loading && me.internalDataSource.length === 0) {
				e.preventDefault();
				e.stopPropagation();
			}
		},
	},
	beforeUnmount() {
		const me = this;
		me.collapse();
		if (me.$refs.dropdownPanel) {
			me.$refs.dropdownPanel.$el.remove();
		}
		EventBusGlobal.$off(GlobalEventName.scrollEvent, me.scrollEvent);
		document.removeEventListener('click', me.click_out);
	},
});
</script>
<style lang="scss" scoped>
@use "@/assets/scss/component/MsCombobox.scss" as style;
</style>
