<template>
	<div class="ms-combobox ms-editor data-input ms-validate">
		<div class="flex">
            <label class="label mb-2" v-if="label">{{ label }}</label>
            <div class="ms-textarea-required" v-if="label && rules && rules.find((_) => _?.name == 'required')">
                &nbsp;{{ textRequired }}
            </div>
			<slot name="labelCustom"></slot>
        </div>
		<div 
			class="flex-row flex combo-box-input" 
			:class="[{ 'input-error': errorMessage, disabled: disabled }]"
			style="display: inline-flex; margin-right: 12px; min-width: 100px; margin-inline: 0 14px; width: 100%; padding-left: 10px"
		>
			<div class="selected-options">
				<div class="selected-items selected-items-input" v-for="(item, index) in selectedItems" :key="index">
					<div class="item-text" v-html="getItemDisplay(item[1])"></div>
					<i class="fa fa-times pointer" aria-hidden="true" @click.stop="effectItem(item[1], true)"></i>
				</div>
				<input
					:placeholder="selectedItems && selectedItems.size ? '' : placeholder"
					:title="internalText"
					ref="input"
					class="input flex"
					v-model="internalText"
					:class="{ disabled: disabled }"
					style="flex: 1; padding-left: 2px;"
					@keydown="() => modelValue"
					@keydown.backspace="onBackSpace"
					:disabled="disabled"
					v-on="listeners"
				/>
			</div>
			<div
				@click="expand"
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
				:columnx="columns"
				:comboType="comboType"
				@scrollend="dropdownScrollEnd"
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
					@click="onItemClick(item, $event, index)"
					:class="[
						{ 'ms-combobox-item--highlight': typeAheadPointer == index},
						{ 'checked-mutiple': isCheckedItem(item)}
					]"
				></ms-combo-box-item>
			</ms-combo-box-dropdown>
		</teleport>
	</div>
</template>
<script>
import { watch, ref, getCurrentInstance, onMounted, onBeforeUnmount, onBeforeMount, computed } from 'vue';
import MsComboBoxDropdown from './MsComboBoxDropdown.vue';
import MsComboBoxItem from './MsComboBoxItem.vue';
import { filter } from '@/mixins/common/filter';
import { useValidateControl } from "@/setup/validateControl";
import msBaseComponent from '@/components/base/MsBaseComponent.vue';
import { reactive } from '@vue/reactivity';
import { debounce } from 'lodash-es';

export default {
	components: {
		MsComboBoxDropdown,
		MsComboBoxItem,
	},
	mixins: [filter],
	extends: msBaseComponent,
	props: {
		modelValue: {},
		placeholder: {
			default: null,
			type: [Number, String],
		},
		/**
		 * custom lại tham số filter
		 */
		buildFilter: {
			type: Function,
			default: null,
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
		//Độ rộng của 1 item
		itemSize: {
			default: 32,
			type: Number,
		},
		/**
		 * Kí hiệu cảnh báo trường bắt buộc nhập không được bỏ trống
		 * created by: hvanh 9-5-2023
		 */
		textRequired: {
			type: String,
			default: '*',
			required: false,
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
		autoLoad: {
			default: false,
			type: Boolean,
		},
		/**
		 * size paging
		 */
		pageSize: {
			type: Number,
			default: 100,
		},
		//Xác định các rule validate
		rules: {
			default: [{ name: 'forceSelection' }],
			type: Array,
		},
		disabled: {
			default: false,
			type: Boolean,
		},
	},
	setup(props, { emit }) {
		const internalDataSource = ref([]);
		const input = ref({});
		const expanded = ref(false);
		const { proxy } = getCurrentInstance();
		const internalText = ref('');
		const internalValue = ref('');
		const loading = ref(false);
		const dropdownScrollTop = ref(0);
		const typing = ref(false);
		const filterFields = reactive({});
		const dropdownTopx = ref(0);
		const dropdownLeftx = ref(0);
		const comboType = ref(1);
		const dropdownPanel = ref({});
		const selectedItems = reactive(new Map());
		const typeAheadPointer = ref(0);
		const allData = ref([]);
		const isShowTextEmpty = ref(false);
		const listeners = computed(() => {
			return {
				input: (event) => proxy.onInput(event),
				focus: (event) => proxy.onFocus(event),
				keydown: event => proxy.onKeyDown(event),
				blur: (event) => onBlur(event),
				click: event => onClick(event)
			};
		});
		
		/**
		 * Sự kiện click input
		 */
		const onClick = (e) => {
			expand(e);
		};

		/**
		 * Sự kiện blur
		 */
		const onBlur = (e) => {
			proxy.$emit('blur', e);
			proxy.$nextTick(() => {
				setTimeout(() => {
					proxy.validate();
				}, 200);
			});
		};

		/**
		 * Hàm lấy dữ liệu
		 */
		const getValue = () => {
			return proxy.modelValue;
		};
		
		/**
		 * Xử lý sự kiện nhấn phím `backspace`
		 */
		const onBackSpace = () => {
			let me = proxy,
				rawValue = getRawValue(),
				selected = getSelected();
			if (!rawValue && selected.size > 0) {
				// Lấy key cuối cùng
				const lastKey = [...selected.keys()].pop();

				// Bỏ chọn phần tử cuối cùng
				me.effectItem(selected.get(lastKey), true);
			}
		};
		/**
		 * Lấy ra các giá trị được chọn
		 */
		const getSelected = () => {
			const me = proxy;
			return selectedItems;
		};
		/**
		 * Lấy ra giá trị đang nhập
		 */
		const getRawValue = () => {
			return internalText.value;
		};
		const rebuildSelectedItems = (cacheData = null) => {
			const splitInternalText = internalValue.value
				.toString()
				.split(';')
				.filter((x) => x);
			if (splitInternalText.length > 0 && splitInternalText.length !== selectedItems.size) {
				if (!cacheData) {
					cacheData = new Map();
					internalDataSource.value.forEach((x) => cacheData.set(x[props.valueField], x));
				}

				selectedItems.clear();
				splitInternalText.forEach((text) => {
					if (cacheData.has(text)) {
						const item = cacheData.get(text);
						item.selected = true;
						selectedItems.set(item[props.valueField], item);
					}
				});
			} else if (splitInternalText.length === 0) {
				selectedItems.clear();
				internalDataSource.value.forEach((x) => (x.selected = false));
			}
			if(splitInternalText.length > 0){
				// Tích hoặc tích item khi bind lại modelValue
				internalDataSource.value.forEach((x) => {
					if(splitInternalText.includes(x[props.valueField])) {
						x.selected = true;
						selectedItems.set(x[props.valueField], x);
					}else{
						x.selected = false;
					}
				});
			}
		};

		/**
		 * Click vào icon xổ xuống
		 */
		const expand = (e) => {
			const me = proxy,
				expand = expanded.value;
			loading.value = false;

			//disable thì không làm gì
			if (me.disabled || me.readOnly) {
				return;
			}

			if (!expand) {
				//TODO => Query internal
				query();
				changeDropdownPosition();
			}

			expanded.value = !expand;
			me.$nextTick(() => {
				adjustScroll();
			});

			//focus input
			if(input.value){
				input.value.focus();
			}
		};

		/**
		 * Thay đổi position khi mở dropdown
		 */
		const changeDropdownPosition = () => {
			let me = proxy,
				comboEl = me.$el;

			if (comboEl) {
				comboEl = comboEl.getElementsByClassName('combo-box-input')[0];
			}

			if (comboEl) {
				let comboElRect = comboEl.getBoundingClientRect(),
					comboMenuEl = me.$el;

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
					me.dropdownTopx = comboElRect.top - (me.itemSize * Math.min(maxItemsDisplay, me.internalDataSource.length) + 16);
				}
			}
		};

		const query = (forceLoad = false) => {
			switch (props.queryMode) {
				case 'local':
					localQuery();
					break;
				case 'remote':
					remoteQuery(forceLoad);
					break;
				default:
					break;
			}
		};

		/**
		 * Sự kiện nhập liệu trên input
		 * @author hvanh - 25.5.2023
		 */
		const onInput = debounce(() => {
			const me = proxy;

			me.typing = true;
			if (!expanded.value) {
				me.expand();
			}

			if (!me.internalText) {
				let metaData = {
					oldData: me.internalSelectedItem,
					newData: null,
				};
				me.$emit('selected', metaData);
				me.reset();
			}
			typeAheadPointer.value = 0;
			query(true);
			me.typing = false;
			adjustScroll();
		},300);
		const reset = () => {
			const me = proxy;
			me.internalText = '';
			me.internalValue = '';
			me.internalSelectedItem = null;
			me.$emit('update:display', '');
		};
		/**
		 * Sự kiện focus trên input
		 * @author hvanh - 25.5.2023
		 */
		const onFocus = (e) => {};
		const onEsc = (e) => {
			const me = proxy;

			//ẩn dropdown và stop event nếu đang expand
			if (me.expanded) {
				expanded.value = false;
				e.preventDefault();
				e.cancel = true;
			}
		};

		const onKeyDown = (e) => {
			switch (e.keyCode) {
				case 13:
					if (typeAheadPointer.value >= 0 && typeAheadPointer.value < internalDataSource.value.length) {
						onItemClick(internalDataSource.value[typeAheadPointer.value]);
					}
					return;
				case 38:
					if (typeAheadPointer.value === 0) return;
					typeAheadPointer.value -= 1;
					adjustScroll();
					return;

				case 40:
					if (!expanded.value) {
						typeAheadPointer.value = 0;
						expand();
					} else {
						if (lastRequestParam && lastRequestParam.end && internalDataSource.value.length === typeAheadPointer.value + 1) {
						} else {
							typeAheadPointer.value += 1;
							adjustScroll();
						}
					}
					return;

				case 27:
					onEsc(e);
					break;
			}
			emit('msKeydown', e);
		};
		
		/**
		 * Check xem item có đang được checked
		 */
		const isCheckedItem = (item) => {
			const me = proxy;
			if(me.modelValue && item){
				const lstItemChecked = me.modelValue.split(';');
				return lstItemChecked.includes(item[me.valueField]);
			}
		};

		const getScroller = () => {
			if (expanded.value) {
				const dd = dropdownPanel.value;
				if (dd && dd.$el && typeof dd.$el.querySelector === 'function') {
					return dd.$el.querySelector('.scroller-overlay');
				}
			}
			return null;
		};

		const adjustScroll = () => {
			const row = dropdownPanel.value?.$el?.querySelector('.combobox-item');
			if (row) {
				const rowHeight = row.getBoundingClientRect().height;
				let scroller = getScroller();
				if (scroller) {
					scroller.scrollTop = Number.parseInt(rowHeight - 0.5) * typeAheadPointer.value;
				}
			}
		};

		/**
		 * Query data có sẵn ở local
		 */
		const localQuery = () => {
			let me = proxy;
			if (!lastRequestParam || !lastRequestParam.end) {
				const payload = {};
				payload.pageAppend = true;

				const start = payload.skip;
				const count = Math.min(props.data.length, payload.take + start);
				const isEnd = count === start;

				if (!isEnd) {
					for (let i = payload.skip; i < count; i++) {
						internalDataSource.value.push(props.data[i]);
					}
				} else {
					payload.end = true;
				}
				lastRequestParam = payload;
			}
			let filterData = filterFn(internalText.value);
			me._filterData = filterData;
			let count = Math.min(me._filterData?.length, me.pageSize);
			let ds = [];
			for (let i = 0; i < count; i++) {
				ds.push(me._filterData[i]);
			}

			internalDataSource.value = ds;
		};
		/**
		 * Hàm tìm kiếm trên local
		 */
		const filterFn = (queryString) => {
			let matchItem = [];
			if (queryString) {
				allData.value?.forEach((item) => {
					let valid = false;
					for (let f in proxy.filterFields.value) {
						let value = item[f];
						let test = proxy.testFilter(proxy.filterFields.value[f], value, queryString);
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
				matchItem = allData.value;
			}
			return matchItem;
		};
		/**
		 * Lấy cột filter để tìm kiếm trên local
		 */
		const getFilterFields = () => {
			let filter = {};
			const me = proxy;
			if (props.columns && props.columns.length > 0) {
				for (let i = 0; i < props.columns.length; i++) {
					const col = props.columns[i];
					if (!col.filterOperator) {
						filter[me.displayField] = me.$ms.constant.FilterOperator.Contains;
					}
					//
					if (col.dataField && col.filterOperator) {
						if (me.filterColumns && me.filterColumns.length > 0) {
							me.filterColumns.forEach((e) => {
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
				filter[me.displayField] = me.$ms.constant.FilterOperator.Contains;
			}
			return filter;
		};
		/**
		 * Khởi tạo data
		 */
		const initData = (value) => {
			filterFields.value = getFilterFields(); // Khởi tạo gán giá trị lấy các cột filter local

			let cacheData = null;
			if (props.queryMode === 'remote') {
				if (lastRequestParam && lastRequestParam.pageAppend) {
					cacheData = new Map();
					internalDataSource.value.concat(value).forEach((x) => {
						if (!cacheData.has(x[props.valueField])) {
							cacheData.set(x[props.displayField], x);
						}
					});
					internalDataSource.value = [...cacheData.values()];
				} else {
					//Nếu có data mới sẽ clear cache do data thêm qua quick add sẽ được add trực tiếp vào list
					internalDataSource.value = value;
					// selectedItems.clear();
				}
				if (value.length < props.pageSize && lastRequestParam) {
					lastRequestParam.end = true;
				}
				//Rebuild lại các selected item nếu có
				rebuildSelectedItems(cacheData);
			} else {
				localQuery();
			}
		};
		let lastRequestParam = null;

		/**
		 * Query lên server
		 */
		const remoteQuery = (forceLoad = false) => {
			if (!lastRequestParam || forceLoad) {
				const payload = {};
				payload.PageIndex = 1;//kdlong 28.2.2025 fixbug 165627
				payload.PageSize = props.pageSize;
				payload.pageAppend = false;
				let columns = [props.displayField, props.valueField].concat(props.columns.map((x) => x.dataField));

				columns = columns.distinctKey(columns);
				payload.columns = columns.join(',');

				if (props.modelValue && props.valueField) {
					payload.CustomParam = {
						SelectedValue: props.modelValue,
						FieldKey: props.valueField,
						IsSelectMultiple: true,
					};
				}

				const fields = Object.keys(getFilterFields());
				const filterFields = getFilterFields();
				let queryString = internalText.value;
				let filters = [];
				if(queryString){
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
					if (filters.length) {
						payload.Filter = JSON.stringify(filters);
					}
				}
				lastRequestParam = payload;
				if (typeof props.buildFilter == 'function') {
					props.buildFilter(payload);
				}
				loading.value = true;
				emit('comboboxLoadData', payload);
			}
		};

		/**
		 * Query thêm data nếu scroll xuống cuối
		 */
		const dropdownScrollEnd = () => {
			if (props.queryMode === 'local') {
				query();
			} else {
				if (lastRequestParam && !lastRequestParam.end) {
					if (lastRequestParam.skip && lastRequestParam.skip === internalDataSource.value.length) {
						return;
					}

					let payload = lastRequestParam;
					payload.PageIndex = payload.PageIndex + 1;
					payload.pageAppend = true;
					emit('comboboxLoadData', payload);
				}
			}
		};
		/**
		 * Tích chọn select hoặc ngừng select 1 item
		 */
		const effectItem = (item, updateModel = false) => {
			let me = proxy;
			if(me.disabled || me.readOnly) return;
			item.selected = !item.selected;
			if (item.selected) {
				selectedItems.set(item[props.valueField], item);
			} else {
				selectedItems.delete(item[props.valueField]);
			}
			setInternalValue(buildText());
			me.$nextTick(() => {
				changeDropdownPosition();
			});
			if (updateModel) {
				emit('update:modelValue', internalValue.value);//kdlong 13.2.2025 fixbug
			}
		};

		/**
		 * Build text hiển thị trên ô input
		 */
		const buildText = () => {
			let rebuildText = '';
			const sizes = selectedItems.size;
			let index = 0;
			selectedItems.forEach((value, key) => {
				if (index === sizes - 1) {
					rebuildText += `${value[props.valueField]}`;
				} else {
					rebuildText += `${value[props.valueField]};`;
				}
				index++;
			});
			return rebuildText;
		};
		/**
		 * Build text hiển thị trên ô input
		 */
		const buildDisplayField = () => {
			let rebuildText = '';
			const sizes = selectedItems.size;
			let index = 0;
			selectedItems.forEach((value, key) => {
				if (index === sizes - 1) {
					rebuildText += `${value[props.displayField]}`;
				} else {
					rebuildText += `${value[props.displayField]};`;
				}
				index++;
			});
			return rebuildText;
		};
		/**
		 * Xử lý click vào item
		 */
		const onItemClick = (item, event, index) => {
			if(internalText.value){//kdlong 12.3.2025 fixbug 165554
				internalText.value = null; // Sau khi chọn xong thì xóa text search đi
				proxy.query(true);
				typeAheadPointer.value = 0;
			}
			effectItem(item);
			//TODO updateModel theo value field nếu có nhu cầu
			let data = buildText();
			let dataDisplay = buildDisplayField();
			emit('update:modelValue', data);
			emit('update:displayName', dataDisplay);
			proxy.$nextTick(() => {
				setTimeout(() => {
					if(input.value){
						input.value.focus();
					}
				}, 0);
			});
		};

		/**
		 * Xử lý click ra ngoài
		 */
		const clickOutSide = (e) => {
			const me = proxy;
			if (!me.$ms.commonFn.hasParent(e.target, me.$el) && dropdownPanel.value && dropdownPanel.value.$el && !me.$ms.commonFn.hasParent(e.target, dropdownPanel.value.$el)) {
				expanded.value = false;
			}
		};
		const { errorMessage, handlerValidateCombobox, getTitleError, clearValidate } = useValidateControl({
			props,
		});
		const validate = () => {
			return handlerValidateCombobox();
		};

		/**
		 * Gán giá trị cho biển internal value
		 * @author NVLAM 31.05.2023
		 */
		const setInternalValue = (value) => {
			internalValue.value = value;
		};

		/**
		 * Lấy text hiển thị trên item
		 * Nếu có column lấy theo column.field, nếu không có column lấy theo displayField, nếu không có displayField lấy theo valueField
		 */
		const getItemDisplay = (item, column) => {
			const me = proxy;
			let field = column ? column.dataField : props.displayField || props.valueField;

			let value = '';
			if (field) {
				value = item[field];
			} else {
				value = item;
			}
			return me.$ms.commonFn.processXssValue(value);
		};

		//Hook
		onMounted(() => {
			document.addEventListener('click', clickOutSide);
			if (props.autoLoad) {
				query();
			}
		});
		onBeforeUnmount(() => {
			const me = proxy;
			expanded.value = false;
			if (dropdownPanel.value && dropdownPanel.value.$el) {
				dropdownPanel.value.$el.remove();
			}
			document.removeEventListener('click', clickOutSide);
		});
		watch(
			() => props.data,
			(value, oldValue) => {
				if (loading.value) {
					loading.value = false;
				}
				if (value) {
					if (props.queryMode === 'local') {
						allData.value = value;
					}
				}

				if (Array.isArray(value) && value.length > 0) {
					initData(value);
					isShowTextEmpty.value = false;
				} else {
					internalDataSource.value = [];
					isShowTextEmpty.value = true;
				}
			},
			{ immediate: true }
		);

		watch(
			() => props.modelValue,
			(value, oldValue) => {
				if (value != null && value !== internalValue.value) {
					setInternalValue(value);
					rebuildSelectedItems();
				}
			},
			{ immediate: true }
		);
		onBeforeMount(() => {
			let me = proxy;
			if (me.columns && me.columns.length !== 0) {
				me.comboType = 2;
			} else {
				me.comboType = 1;
			}
		});

		const getMetaData = () => {
			return JSON.parse(JSON.stringify([...selectedItems.values()]));
		};
		
		/**
		 * ẩn dropdown
		 */
		const collapse = () => {
			const me = proxy;
			me.$nextTick(() => {
				me.expanded = false;
			});
		};

		return {
			internalDataSource,
			query,
			onEsc,
			expanded,
			collapse,
			expand,
			input,
			dropdownLeftx,
			dropdownTopx,
			internalText,
			loading,
			dropdownScrollEnd,
			comboType,
			dropdownScrollTop,
			validate,
			getTitleError,
			clearValidate,
			errorMessage,
			onItemClick,
			dropdownPanel,
			typeAheadPointer,
			onKeyDown,
			getMetaData,
			selectedItems,
			getItemDisplay,
			effectItem,
			onInput,
			onFocus,
			listeners,
			typing,
			filterFn,
			reset,
			allData,
			getFilterFields,
			filterFields,
			onBackSpace,
			getValue,
			isShowTextEmpty,
			rebuildSelectedItems,
			isCheckedItem,
		};
	},
};
</script>
<style lang="scss" scoped>
@use "@/assets/scss/component/MsCombobox.scss" as style;
.icon-combo--dropdown{
	height: unset !important;
}
</style>
