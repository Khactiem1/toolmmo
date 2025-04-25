<template>
	<div class="ms-combobox ms-editor data-input ms-validate">
		<div class="flex">
      <label class="label mb-2" v-if="label">{{ label }}</label>
      <div
        class="ms-textarea-required"
        v-if="rules && rules.find((_) => _?.name == 'required')"
      >
        &nbsp;{{ textRequired }}
      </div>
      <slot name="labelCustom"></slot>
    </div>
		<div class="flex-row flex combo-box-input" :class="[{ 'input-error': errorMessage, disabled: disabled }]">
			<input
				:title="internalText"
				ref="input"
				class="input flex"
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
			<ms-combobox-tree-dropdown
				ref="dropdownPanel"
				v-if="expanded"
				:topx="dropdownTopx"
				:leftx="dropdownLeftx"
				:maxWidthx="dropdownMaxWidthx"
				:maxItemsDisplay="maxItemsDisplay"
				:minWidthx="dropdownMinWidthx"
				:columns="columns"
				:highlighIndex="typeAheadPointer"
				:scrollTop="dropdownScrollTop"
				:loading="loading"
				:showEmptyText="isShowTextEmpty"
			>
				<ms-combobox-tree-item
					v-for="(item, itemIndex) in internalDataSource"
					:key="itemIndex"
					:item="item"
					:columns="columns"
					:valueField="valueField"
					:displayField="displayField"
					:selectedValue="modelValue"
					@itemClick="onItemClick"
					@toogleExpand="itemToogleExpand"
					:activeValue="activeItem ? activeItem[valueField] : null"
				/>
			</ms-combobox-tree-dropdown>
		</teleport>
	</div>
</template>
<script>
import { defineComponent, getCurrentInstance } from 'vue';
import MsComboboxTreeDropdown from './MsComboboxTreeDropdown.vue';
import MsComboboxTreeItem from './MsComboboxTreeItem.vue';
import msBaseComponent from '@/components/base/MsBaseComponent.vue';
import EventBusGlobal, { GlobalEventName } from '@/commons/eventBusGlobal';
import { debounce, isEqual, isEmpty, find } from 'lodash-es';
import { filter } from '@/mixins/common/filter';
import { useValidateControl } from '@/setup/validateControl';

export default defineComponent({
	name: 'MsComboboxTree',
	extends: msBaseComponent,
	mixins: [filter],
	components: {
		MsComboboxTreeDropdown,
		MsComboboxTreeItem,
	},
	emits: ['msKeydown', 'comboboxLoadData', 'blur', 'beforeQuery', 'autoSelected', 'update:modelValue', 'update:display', 'selected', 'beforeExpand', 'change', 'click', 'input'],
	props: {
		modelValue: {},
		placeholder: {
			default: null,
			type: [Number, String],
		},
		maxItemsDisplay: {
			default: 10,
			type: Number,
		},
		columns: {
			type: Array,
			default: () => [],
		},
		/**
		 * Kí hiệu cảnh báo trường bắt buộc nhập không được bỏ trống
		 */
		 textRequired: {
			type: String,
			default: '*',
			required: false,
		},
		/**
		 * Trường làm value
		 * CreatedBy LTDAT 15.06.2020
		 */
		valueField: {
			type: String,
			default: null,
		},
		/**
		 * Trường làm text display
		 * CreatedBy LTDAT 15.06.2020
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
			default: 28,
			type: Number,
		},
		//Chỉ nhận giá trị có trong danh sách
		forceSelection: {
			default: true,
			type: Boolean,
		},
		//Parent Field
		idProperty: {
			default: 'id',
			type: String,
		},
		//Field chứa parentID
		parentIdProperty: {
			default: 'parent_id',
			type: String,
		},
		//Không cho phép chọn trường là cha
		notSelectionParent: {
			default: false,
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
		//Gán giá trị text lúc ban đầu
		initText: {
			default: null,
			type: [Number, String],
		},
		//chỉ cho phép chọn không cho phép nhập text
		selectOnly: {
			default: false,
			type: Boolean,
		},
		autoLoad: {
			default: false,
			type: Boolean,
		},
		mappingField: {
			default: null,
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
		 * Danh sách các trường dữ liệu lấy về
		 */
		requestField: {
			type: String,
			default: null,
		},

		/**
		 * custom lại tham số filter
		 */
		buildFilter: {
			type: Function,
			default: null,
		},

		isReload: {
			type: Boolean,
			default: false,
		},
		/**
		 * size paging
		 */
		pageSize: {
			type: Number,
			default: 10,
		},

		//Xác định các rule validate
		// Mặc định của combo sẽ là force select
		rules: {
			default: [{ name: 'forceSelection' }],
			type: Array,
		},

		/**
		 * Expand tất cả các node
		 */
		expandAll: {
			type: Boolean,
			default: false,
		},
		/**
		 * Có xử lý bất đồng bộ trước khi expand combo ra không
		 */
		isAsyncBeforeExpand: {
			type: Boolean,
			default: false,
		},
		/**
		 * Đẩy phần tử được chọn lên đầu tiên
		 */
		pushElmTop: {
			type: Boolean,
			default: false,
		},
		/**
		 * Hiển thị cả cây thư mục khi tìm kiếm hay không
		 */
		showRootSearch: {
			type: Boolean,
			default: true,
		},

		/**
		 * Tìm kiếm local có tìm kiếm con ra cả cha hay không, mặc định là false chỉ tìm con ko tìm ra cha
		 * nktiem 29/12/2023
		 */
		isQueryLocalFilterParent: {
			type: Boolean,
			default: false,
		},
	},

	setup(props) {
		const { errorMessage, handlerValidateCombobox, getTitleError, clearValidate } = useValidateControl({
			props,
		});
		const { proxy } = getCurrentInstance();
		const validate = () => {
			// return true;
			if (!proxy.isGridEditor) {
				return handlerValidateCombobox();
			}
			return '';
		};
		return { errorMessage, validate, getTitleError, clearValidate };
	},
	computed: {
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
	},
	data() {
		const me = this;
		me.initStaticData();
		return {
			internalDataSource: [],
			internalText: null,
			expanded: false,
			dropdownTopx: 0,
			dropdownLeftx: 0,
			internalSelectedItem: null,
			typeAheadPointer: -1,
			focused: false,
			gridItemSize: 48,
			dropdownScrollTop: 0,
			loading: false, // Đang load dữ liệu
			/**
			 * Tham số load dữ liệu lần gần nhất
			 */
			lastRequestParam: null,
			dropdownMinWidthx: null,
			dropdownMaxWidthx: null,
			/**
			 * item đang được target trong dropdown menu
			 */
			activeItem: null,
			isShowTextEmpty: false,
			// mảng phẳng chứa tất cả các phần tử
			internalFlattenDataSource: {
				type: Array,
				default: [],
			},
		};
	},

	watch: {
		data: {
			inmediate: true,
			handler(newVal) {
				const me = this;
				if (me.loading) {
					me.loading = false;
				}

				if (newVal == null) {
					//tình huống có thêm/sửa/xóa dữ liệu gốc -> reset để khi expand sẽ load lại dữ liệu
					me.lastQueryString = new Date().getTime();
					me._allData = null;
				} else {
					if (me.queryMode !== 'remote') {
						me._allData = newVal;
					}

					if (me.internalDataSource != newVal && !(me.internalDataSource.length === 0 && newVal.length === 0)) {
						me.initData();
						//Sau khi bind dữ liệu vào _allData thì thực hiện select lại đối tượng
						if (me.isValid(me.modelValue)) {
							me.doSelectValue(me.modelValue);
						}
					} else if (me.internalDataSource.length === 0 && newVal.length === 0) {
						me.isShowTextEmpty = true;
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
				if (newVal || oldVal) {
					me.setInitText(newVal);
				}
			},
		},

		/**
		 * Theo dõi sự thay đổi của value
		 * Phục vụ mục đích binding 2 chiều
		 *
		 * @author tvthai - 27.6.2023
		 */
		modelValue: {
			immediate: true,
			handler(newVal, oldVal) {
				let me = this;
				if (me.isValid(newVal)) {
					//sử dụng nexttick fix trường hợp chỗ này gọi sau created( là lúc khởi tạo data) -> doselected hoạt động sai
					me.$nextTick(() => {
						me.doSelectValue(newVal, oldVal);
					});
				} else {
					//Nếu dữ liệu v-model không hợp lệ thì reset giá trị
					const me = this;
					me.internalSelectedItem = null;
					me.typeAheadPointer = -1;
					me.internalValue = null;
					me.activeItem = null; 
					//Lưu ý: dòng me.internalText = null; chỉ dùng được cho comboboxTree này, Nếu dùng cho combobox thường khác thì sẽ lỗi
					//vì ở bên đó, trường hợp text nhập lỗi không có trong danh mục cũng sẽ chạy vào đây với (newVal == null) suy ra tự động clear input
					// me.internalText = null;
					me.$emit('update:modelValue', me.internalValue);
					me.$emit('update:display', '');
				}
			},
		},
		/**
		 * Theo dõi text nhập ở input
		 */
		internalText: {
			immediate: true,
			handler(newVal, oldVal) {
				let me = this;
				//Nếu bằng null và đang mở thì không set active
				if (!newVal && me.expanded) {
					me.activeItem = null;
				}
			},
		},
	},
	//Hàm khởi tạo dữ liệu hook func
	created() {
		const me = this;
		me.initIndex = 0;

		// me.setInitIndex();
		me.initData();
		if (me.autoLoad) {
			me.doQueryInternal(null, false);
		}
		EventBusGlobal.$on(GlobalEventName.scrollEvent, me.scrollEvent);
	},
	mounted() {
		const me = this;
		//Debounce query để delay load
		if (me.queryMode != 'remote') {
			me.internalQueryDelay = 500;
		}
		me.doQuery = debounce(me.doQueryInternal, me.internalQueryDelay);
		document.addEventListener('click', me.click_out);
	},
	methods: {
		/**
		 * Hàm kiểm tra giá trị hợp lệ
		 */
		isValid(value) {
			// typeof null = 'object'
			if (typeof value === 'object') {
				return !isEmpty(value);
			}
			return value !== undefined;
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
						return isEqual(item[me.valueField], value);
					});
				} else {
					item = me.internalDataSource.find((item) => {
						return isEqual(item[me.valueField], value);
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
		flattenArray(arr) {
			let result = [];
			let me = this;
			arr.forEach((element, index) => {
				if (element.childNodes && Array.isArray(element.childNodes)) {
					result.push(element);
					result = result.concat(me.flattenArray(element.childNodes)); // đệ quy gọi lại hàm flattenArray cho các phần tử con
				} else {
					result.push(element);
				}
			});
			return result;
		},
		getValue() {
			const me = this;
			return me.internalText;
		},
		/**
		 * kiểm tra xem dữ liệu trên combobox có trống hay không
		 * @author tmchi 16.04.2021
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
		 * Created by LTDAT
		 */
		scrollEvent() {
			const me = this;
			if (me.expanded) {
				me.collapse();
			}
		},
		/**
		 * Set giá trị hiện thị ban đầu cho combobox khi combo chưa có dữ liệu
		 * Created by LTDAT(25.06.2020)
		 */
		setInitText(val) {
			const me = this;
			me.internalText = me.initText ? me.initText : val;
		},
		/**
		 * Thực hiện query dữ liệu, có thể từ local hoặc remote tùy theo cấu hình
		 * CreatedBy LTDAT 11/12/2019
		 */
		doQueryInternal(searchString, expand) {
			let me = this,
				event = { preventDefault: false, sender: me },
				queryString = searchString;
			me.$emit('beforeQuery', event);
			if (event.preventDefault) {
				return false;
			}
			if (me.lastQueryString === queryString && !me.isReload) {
				if (expand) {
					// me.expand();
				}
			} else {
				me.dropdownScrollTop = 0;
				me.internalDataSource = [];
				me.lastQueryString = queryString;
				me.querying = true;

				if (me.queryMode === 'remote' && !me._allData) {
					me.doRemoteQuery(queryString);
				} else {
					me.$nextTick(() => {
						me.doLocalQuery(queryString);
						me.initData();
						if (expand && !me.expanded) {
							// me.expand();
						} else {
							//hvanh fixbug:23087 Nếu chỉ mở ra mà không tìm kiếm thì không focus
							if (queryString) {
								me.doHightlightItem(true);
								// active bản ghi đầu tiên
								me.setActive(me.internalDataSource[0]);
							}
						}
					});
				}
			}
		},
		/**
		 * Query dữ liệu api
		 * CreatedBy LTDAT 24.06.2020
		 */
		doRemoteQuery(queryString) {
			//Build filter,
			let me = this,
				filters = [],
				filterFields = me.filterFields || {};
			return new Promise((resolve, reject) => {
				try {
					if (queryString) {
						const filterQuery = {};
						const fields = Object.keys(filterFields);
						let filter = {
							Field: fields[0],
							Operator: filterFields[fields[0]],
							Value: queryString,
						};
						filters.push(filter);
						if (fields.length > 1) {
							filter.Ors = [];
							for (let i = 1; i < fields.length; i++) {
								filter.Ors.push({
									Field: fields[i],
									Operator: filterFields[fields[i]],
									Value: queryString,
								});
							}
						}
					}
					let payload = {};
					payload.skip = 0;
					payload.take = me.pageSize;
					payload.pageAppend = false;
					if (filters.length > 0) {
						payload.filter = JSON.stringify(filters);
					}

					let columns = [me.displayField, me.valueField];
					if (me.columns && me.columns.length > 0) {
						me.columns.forEach((item) => {
							if (item.dataField && columns.indexOf(item.dataField) === -1) {
								columns.push(item.dataField);
							}
						});
					}

					if (me.mappingField) {
						for (let i in me.mappingField) {
							if (columns.indexOf(i) === -1) {
								columns.push(i);
							}
						}
					}

					if (me.requestField) {
						me.requestField.split(',').forEach((item) => {
							if (item && columns.indexOf(item)) {
								columns.push(item);
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

					if (me.modelValue) {
						Object.assign(payload, {
							selectedItem: JSON.stringify({
								[me.valueField]: me.modelValue,
							}),
						});
					}
					me.$emit('comboboxLoadData', payload);
					resolve();
				} catch (error) {
					reject(error);
				}
			});
		},
		/**
		 * Query dữ liệu local
		 * CreatedBy LTDAT 24.06.2020
		 * Modified by: dhhoang 08.08.2023 fixbug 25428
		 */
		doLocalQuery(queryString) {
			const me = this;
			if (!queryString) {
				//nếu không có text dùng all source đã build khi initData luôn
				me.internalDataSource = me._allTreeData;

				if (me.expandAll) {
					me.expandAllNode();
				} else if (Array.isArray(me.internalDataSource)) {
					//expand all cấp 1 và item đầu tiên của level2
					let expandLv2 = true;
					for (let i = 0; i < me.internalDataSource.length; i++) {
						let item = me.internalDataSource[i];
						me.resetExpand(item, true);

						if (expandLv2 && Array.isArray(item.childNodes) && item.childNodes.length > 0) {
							expandLv2 = false;
							let lv2 = item.childNodes[0];
							me.resetExpand(lv2, true);
						}
					}
				}
				me.internalFlattenDataSource = [...me.flattenArray(me.internalDataSource)];
			} else {
				let filterData = me.filterData(queryString);
				let processed = {};
				let roots = [];

				//thêm cha vào để build cây
				let fnItem = function (item) {
					let id = item[me.idProperty];
					if (processed.hasOwnProperty(item[id])) {
						return;
					}
					processed[id] = item;

					delete item.expanded;
					delete item.childNodes;
					delete item.isParent;

					let child = item;
					let pid = child[me.parentIdProperty];
					let pa = item;
					// if (filterData.findIndex(_ => _[me.idProperty] === pid) !== -1) {
					while (pid) {
						let temp = me._parents[pid];
						if (!temp) {
							break;
						}

						pa = processed[pid];
						if (!pa) {
							pa = { ...temp };
							pa.childNodes = [];
							processed[pid] = pa;
						} else if (pa.childNodes) {
							for (let i = 0; i < pa.childNodes.length; i++) {
								let node = pa.childNodes[i];
								if (child[me.idProperty] === node[me.idProperty]) {
									// node.expanded = true;
									return;
								}
							}
						}

						pa.expanded = true;
						pa.isParent = true;
						pa.childNodes = pa.childNodes || [];
						pa.childNodes.push(child);

						//prv
						child = pa;
						pid = pa[me.parentIdProperty];
					}
					// }

					if (pa) {
						let exist = false;
						for (let i = 0; i < roots.length; i++) {
							if (pa[me.idProperty] === roots[i][me.idProperty]) {
								exist = true;
								break;
							}
						}

						if (!exist && !pa.ParentId) {
							roots.push(pa);
						}
					}
				};

				if (me.isQueryLocalFilterParent) {
					for (let i = 0; i < filterData.length; i++) {
						let item = { ...filterData[i] };
						if (me.showRootSearch) {
							fnItem(item);
						} else {
							roots.push(item);
						}
					}
				} else {
					roots = filterData;
				}
				//sắp xếp lại cho đúng thứ tự
				if (roots.length > 1) {
					let fnOrder = function (items) {
						let rs = items.sortObject('_ix');
						for (let i = 0; i < rs.length; i++) {
							if (Array.isArray(rs[i].childNodes) && rs[i].childNodes.length > 0) {
								fnOrder(rs[i].childNodes);
							}
						}
						return rs;
					};
					roots = fnOrder(roots);
				}

				me.internalDataSource = roots;
				me.internalFlattenDataSource = [...me.flattenArray(me.internalDataSource)];
				me.createDisplayMap();
			}

			// if (me.internalSelectedItem) {
			//   me.appendData([me.internalSelectedItem], true);
			// }

			if (me.internalDataSource <= 0) {
				me.isShowTextEmpty = true;
			} else {
				me.isShowTextEmpty = false;
			}
		},

		/**
		 * Tạo map node từ data source
		 */
		createDisplayMap() {
			const me = this;
			let map = {};
			let fn = function (items, parentId) {
				for (let i = 0; i < items.length; i++) {
					let item = items[i];
					map[item[me.valueField]] = item;
					if (Array.isArray(item.childNodes) && item.childNodes.length > 0) {
						fn(item.childNodes);
					}
				}
			};

			fn(me.internalDataSource);
			me._sourceMap = map;
		},

		/**
		 * Expand tất cả các node
		 */
		expandAllNode(items = this.internalDataSource) {
			if (!Array.isArray(items)) {
				return;
			}
			const me = this;
			for (let i = 0; i < items.length; i++) {
				let item = items[i];

				me.resetExpand(item, true);
				if (Array.isArray(item.childNodes) && item.childNodes.length > 0) {
					me.expandAllNode(item.childNodes);
				}
			}
		},

		/**
		 * Modified by: DHHoang 07/08/2023
		 * fixbug: 25428
		 */
		resetExpand(item, expand) {
			const me = this;
			item.expanded = expand;
			if (item.childNodes && item.childNodes.length > 0) {
				for (let i = 0; i < item.childNodes.length; i++) {
					let child = item.childNodes[i];
					me.resetExpand(child, true);
				}
			}
		},

		filterData(queryString) {
			const me = this;
			let matchItem = [];

			if (queryString) {
				me._allData.forEach((item) => {
					let valid = false;
					for (let f in me.filterFields) {
						let value = item[f];
						let test = me.testFilter(me.filterFields[f], value, queryString.trim());
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
				matchItem = me._allData;
			}

			return me.nomalizeDataTree(matchItem, me.idProperty || me.valueField, me.parentIdProperty); // Build lại thành hình tree (Bug 98419)
		},

		/**
		 * Lấy chuỗi cần query, trường hợp number thì lấy value bỏ qua ký tự phân cách
		 * CreatedBy LTDAT 11/12/2019
		 */
		getQueryString() {
			return (this.internalText || '').trim();
		},
		//Click ra ngoài combo đóng combo lại
		//Created by LTDAT 18.06.2020
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
			// me.typeAheadPointer = -1;
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
		},
		//Sự kiện nhập liệu trên input
		//Created by LTDAT (16.06.2020)
		// thêm ignoreQurery để tránh filter khi xổ dropdown (ntson5 15/06/2023)
		onInput(e, isIgnoreQuery = false) {
			const me = this;

			me._typing = true;
			//kdlong 27.06.2023 fixbug 17076
			if (!me.expanded && !(me.internalSelectedItem && !me.internalText)) {
				me.expand();
			} else if (!me.expanded && me.internalSelectedItem && !me.internalText) {
				let metaData = {
					oldData: me.internalSelectedItem,
					newData: null,
				};
				me.$emit('selected', metaData);
				me.reset();
				return;
			}

			if (!me.internalText) {
				let metaData = {
					oldData: me.internalSelectedItem,
					newData: null,
				};
				me.$emit('selected', metaData);
				me.reset();
			}
			if (isIgnoreQuery) {
				me.doQuery(null, true);
			} else {
				me.doQuery(me.internalText, true);
			}
			me._typing = false;
			if (!me.forceSelection && me.valueField == me.displayField) {
				me.internalValue = me.internalText;
				me.$emit('update:modelValue', me.internalValue);
			}
		},

		//Bôi màu hightlight cho item
		doHightlightItem(ignoreValue) {
			const me = this;
			let index = -1;

			if (me.internalDataSource && me.internalDataSource.length > 0) {
				index = -1;

				if (!ignoreValue && me.internalValue != null && me.internalValue != undefined) {
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
					let lowerText = me.internalText.toLowerCase();

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
		 * Di chuyển view đến bản ghi nếu cần
		 * @param {Bản ghi cần view} index
		 * CreatedBy LTDAT 16.06.2020
		 */
		adjustScroll(typeAheadPointer = this.typeAheadPointer) {
			const row = this.$refs['dropdownPanel']?.$el?.querySelector('.combobox-item');
			if (row) {
				const rowHeight = row.getBoundingClientRect().height;
				let scroller = this.getScroller();
				if (scroller) {
					// scroller.scrollToItem(typeAheadPointer, true);
					let trSelected = this.$refs['dropdownPanel']?.$el?.querySelector('.combobox-item.checked');
					if(!trSelected)
						return
					let allComboboxItem = this.$refs['dropdownPanel']?.$el?.querySelectorAll(".combobox-item")
					//Tìm ra vị trí của itemSelected trên danh sách (combo này hiện tại k cho load remote)
					let indexSelected =  Array.prototype.indexOf.call(allComboboxItem, trSelected);
					scroller.scrollTop = (Number.parseInt(rowHeight) - 1) * indexSelected;
				}
			}
		},
		//Sự kiện click vào input
		//Created by NNLAM (19/04/2021)
		onClick(e) {
			this.$emit('click', e);
			this.triggerClick(e);
		},
		//Sự kiện focus vào input
		//Created by LTDAT (16.06.2020)
		onFocus(e) {
			const me = this;
			me.focused = true;
			e.target.select();
		},
		//Sự kiện change input
		//Created by LTDAT (16.06.2020)
		//Tạm rem hàm này, chưa hiểu làm gì
		onChange() {
			const me = this;
		},
		//Sự kiện blur input
		//Created by LTDAT (16.06.2020)
		// pvduy 07/05/2021: sửa lại combobox (đã trao đổi với SA anh BNDuc)
		onBlur(e) {
			const me = this;
			me.focused = false;
			me.$nextTick(() => {
				setTimeout(() => {
					me.validateBlur();
				}, 10);
			});
			me.$emit('blur', e);
		},
		//Sự kiện keydown input
		//Created by LTDAT (16.06.2020)
		onKeydown(e) {
			const me = this;
			// nhgiang4 - 15.08.2023: nếu là enter thì không ngăn nổi bọt để window có thể lắng nghe sự kiện keydown => next control
			if (e.keyCode !== 13 && e.keyCode !== 27) {
				// nktiem 21/12/2023 do e.stopPropagation(); nên form cha ko bắt được sự kiện esc để đóng form nên case thêm mã phím esc
				e.stopPropagation();
			}
			let isEmitOut = true;

			switch (e.which) {
				case 40: //arrow down
					me.downKeyAction(e);
					isEmitOut = false;
					break;
				case 38: //arrow up
					me.prevKeyAction(e);
					isEmitOut = false;
					break;
				// case 39: //arrow right
				// 	me.rightKeyAction(e);
				// 	break;
				// case 37: //arrow left
				// 	me.leftKeyAction(e);
				// 	break;
				case 13: //enter
					me.enterKeyAction(e);
					break;
				//kdlong 17.07.2023 fixbug 14943 đang xử lý tab giống như enter => bỏ
				//hvanh 9.8.2023 fixbug: 23087 mở sự kiện tab
				case 9: //tab
					me.tabKeyAction(e);
					break;
			}
			if (isEmitOut) {
				me.$emit('msKeydown', e);
			}
		},
		/**
		 * Xử lý phím tab
		 */
		tabKeyAction() {
			const me = this;
			if (me.expanded && me.activeItem) {
				let node = me._nodes[me.activeItem[me.valueField]];
				me.setInternalItem(node);
			}
			me.collapse();
		},
		/**
		 * Xử lý phím enter
		 * @modified hvanh - 18.8.2023
		 */
		enterKeyAction() {
			const me = this;
			if (me.expanded && me.activeItem) {
				let node = me._nodes[me.activeItem[me.valueField]];
				me.setInternalItem(node);
			}

			me.collapse();
		},
		/**
		 * Xử lý phím phải
		 */
		rightKeyAction(e) {
			const me = this;
			if (!me.expanded || !me.activeItem) {
				return;
			}
			stopEvent(e);

			if (Array.isArray(me.activeItem.childNodes) && me.activeItem.childNodes.length > 0) {
				me.activeItem.expanded = true;
				return;
			}
		},
		/**
		 * Xử lý phím trái
		 */
		leftKeyAction(e) {
			const me = this;
			if (!me.expanded || !me.activeItem) {
				return;
			}
			stopEvent(e);

			//xử lý collapse node expand, nếu node không phải cha thì ref vào node cha gần nhất
			if (me.activeItem.expanded && Array.isArray(me.activeItem.childNodes) && me.activeItem.childNodes.length > 0) {
				let id = me.activeItem[me.valueField];
				let node = me.findNodeById(id);
				if (node) {
					node.expanded = false;
				}
				return;
			}

			let pid = me.activeItem.ParentId;
			if (pid) {
				let parent = me.findNodeById(pid);
				me.setActive(parent);
			}
		},

		/**
		 * Xử lý phím up, active bản ghi trước đó
		 */
		prevKeyAction(e) {
			const me = this;
			if (!me.expanded) {
				return;
			}

			stopEvent(e);

			//nếu không có bản ghi nào thi không làm gì
			if (!me.activeItem) {
				return;
			}

			//xử lý active con cuối cùng và sâu nhất đang expanded
			let activeFn = function (item) {
				if (item.expanded && Array.isArray(item.childNodes) && item.childNodes.length > 0) {
					activeFn(item.childNodes[item.childNodes.length - 1]);
				} else {
					//hvanh - 18.8.2023 Nếu text hiện tại không phải text insert hoặc trùng với text active trước
					if (me.activeItem[me.displayField] === me.internalText) {
						me.setTextDisplay(item);
					}
					me.setActive(item);
				}
			};

			let prevFn = function (item, items) {
				let cValue = item[me.valueField],
					count = items?.length;
				for (let i = 0; i < count; i++) {
					if (items[i][me.valueField] == cValue) {
						if (i === 0) {
							return false;
						}
						activeFn(items[i - 1]);
						return true;
					}
				}

				return false;
			};

			if (!me.internalText) {
				let pid = me.activeItem.ParentId;
				if (pid) {
					let parent = me.findNodeById(pid);
					let res = prevFn(me.activeItem, parent.childNodes);
					if (!res) {
						me.setTextDisplay(parent);
						me.setActive(parent);
					}
				} else {
					//root
					prevFn(me.activeItem, me.internalDataSource);
				}
			} else {
				let indexActiveItem = me.internalFlattenDataSource.findIndex((item) => item[me.valueField] === me.activeItem[me.valueField]);
				if (indexActiveItem > 0) {
					if (me.activeItem[me.displayField] === me.internalText) {
						me.setTextDisplay(me.internalFlattenDataSource[indexActiveItem - 1]);
					}
					me.setActive(me.internalFlattenDataSource[indexActiveItem - 1]);
				} else {
					if (me.activeItem[me.displayField] === me.internalText) {
						me.setTextDisplay(me.internalFlattenDataSource[0]);
					}
					me.setActive(me.internalFlattenDataSource[0]);
				}
			}
			//nhgiang4 - 29.08.2023: fixbug 30654
			me.setInternalItem(me.activeItem);
		},

		/**
		 * Xử lý phím down, active bản ghi tiếp theo
		 */
		downKeyAction(e) {
			const me = this;
			stopEvent(e);

			if (!me.expanded) {
				//Thêm expand khi thực hiện query dữ liệu mới
				me.expand();
				me.doQueryInternal(null, true);
				if (!me.internalText) {
					me.activeItem = null;
				}
				return;
			}

			const source = me.internalDataSource;
			//nếu chưa có thì lấy bản ghi đầu tiên
			if (!me.activeItem && me.expanded) {
				if (Array.isArray(source) && source.length > 0) {
					me.setActive(source[0]);
					if (!me.internalText) {
						me.setTextDisplay(source[0]);
					}
				}
			} else {
				if (me.activeItem.IsParent && me.activeItem.expanded && Array.isArray(me.activeItem.childNodes) && me.activeItem.childNodes.length > 0) {
					//active first child
					if (me.activeItem[me.displayField] === me.internalText) {
						me.setTextDisplay(me.activeItem.childNodes[0]);
					}
					me.setActive(me.activeItem.childNodes[0]);
				} else {
					let nextFn = function (item, items) {
						let cValue = item[me.valueField],
							count = items.length - 1;
						for (let i = 0; i < count; i++) {
							if (items[i][me.valueField] == cValue) {
								me.setActive(items[i + 1]);
								return true;
							}
						}

						return false;
					};

					let parentFn = function (item) {
						if (!me.internalText) {
							let pid = item.ParentId;
							if (pid) {
								let parent = me.findNodeById(pid);
								let rs = nextFn(item, parent.childNodes);
								if (!rs) {
									//node đứng cuối trong các con -> nhảy ra level ngoài
									parentFn(parent);
								}
							} else {
								//next root
								nextFn(item, source);
							}
						} else {
							let indexActiveItem = me.internalFlattenDataSource.findIndex((item) => item[me.valueField] === me.activeItem[me.valueField]);
							//Nếu thằng đang tìm kiếm mà bằng với text ở input thì mới set
							if (me.activeItem[me.displayField] === me.internalText) {
								me.setTextDisplay(me.internalFlattenDataSource[indexActiveItem + 1]);
							}

							if (indexActiveItem < me.internalFlattenDataSource.length - 1) {
								me.setActive(me.internalFlattenDataSource[indexActiveItem + 1]);
							} else {
								me.setActive(me.internalFlattenDataSource[me.internalFlattenDataSource.length - 1]);
							}
						}
					};

					parentFn(me.activeItem);
				}
			}
			//nhgiang4 - fixbug 30654
			me.setInternalItem(me.activeItem);
		},

		/**
		 * Set giá trị hiển thị khi mỗi item được active
		 * @author hvanh - 18.8.2023
		 */
		setTextDisplay(text) {
			let me = this;
			if (text) {
				me.internalText = text[me.displayField];
			}
		},

		/**
		 * Tìm node hiển thị theo id
		 */
		findNodeById(id) {
			const me = this;
			let source = me._sourceMap || me._nodes;
			if (!source[id]) {
				let _source = {};
				me.internalFlattenDataSource.forEach((item) => {
					_source[item[me.valueField]] = item;
				});
				return _source[id];
			}
			return source[id];
		},

		//Lấy tổng số lượng dữ liệu trong data
		getTotalData() {
			const me = this;
			return me.internalDataSource.length;
		},
		//Tìm kiếm item trong list
		//Created by LTDAT(16.06.2020)
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
		/**
		 * Tìm item theo text truyền vào
		 * HTHIEP 01.07.2022
		 */
		findItemByText(queryText) {
			if (!queryText) return false;
			if (!this.internalFlattenDataSource || this.internalFlattenDataSource.length === 0) return false;
			return this.internalFlattenDataSource.filter((item) => {
				let text = item[this.displayField];
				if (queryText === text) {
					return item;
				}
			});
		},
		//Lấy cột filter để tìm kiếm local
		//Created by LTDAT 16.06.2020
		getFilterFields() {
			let filter = {};
			const me = this;
			if (this.columns && this.columns.length > 0) {
				for (let i = 0; i < this.columns.length; i++) {
					const col = this.columns[i];
					if (!col.filterOperator) {
						col.filterOperator = this.$ms.constant.FilterOperator.Contains;
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
				filter[this.displayField] = this.$ms.constant.FilterOperator.Contains;
			}
			return filter;
		},
		//Lấy element scroll
		//Created by LTDAT (16.06.2020)
		getScroller() {
			if (this.expanded) {
				let dd = this.$refs['dropdownPanel'];
				if (dd && dd.$el && typeof dd.$el.querySelector === 'function') {
					return dd.$el.querySelector('.scroller-overlay');
				}
			}
			return null;
		},

		/**
		 * Hàm xử lý khi chọn item trên dropdown
		 * Created by LTDAT(16.06.2020)
		 * @modified : nvquyet 29/12/2023 bổ sung thêm phần scroll item được chọn lên đầu
		 */
		onItemClick(item, event) {
			const me = this;
			event.preventDefault();
			if (me.notSelectionParent && item.IsParent) {
				item.expanded = !item.expanded;
			} else {
				me.setInternalItem(item);
				me.collapse();
				me.adjustScroll();
				me.validate(me);
			}
		},

		/**
		 *	Set giá trị được chọn
		 * @modified : nvquyet 09/08/2023 bổ sung isNotUserSelected - cờ đánh dấu đây ko phải là thao tác của người dùng
		 */
		setInternalItem(item, isNotUserSelected = false) {
			const me = this;
			if (item) {
				if (me.clearValidate) me.clearValidate();
				if (me.notSelectionParent && item.IsParent) {
					return;
				} else if (!me.internalSelectedItem || me.internalSelectedItem[me.valueField] !== item[me.valueField]) {
					//Lưu lại thông tin old item
					let oldItems = {};
					oldItems[me.valueField] = me.internalValue;
					oldItems[me.displayField] = me.internalText;
					me.internalSelectedItem = item;
					me.internalValue = item[me.valueField];
					me.$emit('update:modelValue', me.internalValue);
					me.internalText = item[me.displayField];
					// me.typeAheadPointer = me.findIndexItem(item);
					me.$emit('update:display', me.internalText);
					if (!isNotUserSelected) {
						let metaData = {
							oldData: oldItems,
							newData: item,
							userAction: isNotUserSelected,
						};
						me.$emit('selected', metaData);
						// nvhuy1 comment lai hàm gọi change vì hàm selected đã gán lại giá cho comboboxtree
						// me.$emit('change', item[me.valueField], oldItems[me.valueField]);

						me.$nextTick(() => {
							//nhgiang4 - 15.08.2023: focus ô input sau khi chọn giá trị fixbug 21358
							if (me.$refs.input) {
								me.$refs.input.focus();
								me.$refs.input.select();
							}
						});
					}
					if (me.pushElmTop) me.dropdownScrollTop = 0;
				}
				// me.collapse();
			}
		},
		//Tìm vị trị của item trong data
		findIndexItem(item) {
			const me = this;
			return me.internalDataSource.findIndex((_item) => {
				return _item == item;
			});
		},
		//Khởi tạo dữ liệu tĩnh mặc định
		initStaticData() {
			const me = this;

			me.internalQueryDelay = 200;
			me.filterFields = me.getFilterFields();
			me.internalValue = null;
			me.firstExpand = true;
		},

		/**
		 * Khởi tạo dữ liệu combobox tree
		 */
		initData() {
			const me = this;
			let dataTree = me.nomalizeDataTree(me.data, me.idProperty || me.valueField, me.parentIdProperty);

			if (me.keyField && me.keyField !== me.valueField) {
				me.$ms.commonFn.genVKeyValue(me.internalDataSource, me.keyField);
			}

			me._allTreeData = dataTree;
			let treeData = me.$ms.commonFn.getBodyData(dataTree, true);
			if (treeData.length > 0) {
				me.internalDataSource = me._allData = treeData;
				me.doLocalQuery(me.lastQueryString);
			} else {
				me.internalDataSource = [];
				me._allData = null;
			}

			me.internalFlattenDataSource = [...me.flattenArray(me.internalDataSource)];
			if (me.modelValue != null && me.pushElmTop) {
				me.pushElementSelected(me.internalDataSource);
			}
		},
		/**
		 * Thực hiện tìm kiếm giá tị được chọn trong cây dữ liệu và push lên đầu danh sách
		 * @author nvhuy1 26.12.2023
		 */
		pushElementSelected(data) {
			const me = this;
			data.forEach((item) => {
				if (item[me.idProperty] == me.modelValue) {
					let indexNodeSelect = data.findIndex((item) => item[me.idProperty] == me.modelValue);
					if (indexNodeSelect != -1) {
						let element = data.splice(indexNodeSelect, 1)[0]; // Xóa phần tử tại index và lấy ra phần tử đó
						me.internalDataSource.unshift(element); // Thêm phần tử vào đầu mảng
					}
					return -1;
				} else if (item.hasOwnProperty('childNodes') && item['childNodes']?.length > 0) {
					me.pushElementSelected(item['childNodes']);
				}
			});
		},

		/**
		 * Chuyển dữ liệu thành dạng tree
		 */
		nomalizeDataTree(data, idField, parentField) {
			const me = this;
			let dataTemp = [...data],
				parentNodes = [],
				parents = {},
				allMap = {},
				findParent = function (pid) {
					if (!parents.hasOwnProperty(pid)) {
						let parent = find(dataTemp, (o) => {
							return o[idField] === pid;
						});
						parents[pid] = parent;
					}

					return parents[pid];
				};
			//xóa hết childNodes để build lại hình cây đúng (không bị +1 các item con sau khi build lại)
			dataTemp.forEach((item) => {
				if (item.childNodes) delete item.childNodes;
			});
			for (let i = 0; i < dataTemp.length; i++) {
				let item = dataTemp[i];

				allMap[item[me.valueField]] = item;

				//đánh dấu luôn vị trí tương đối, sau này dùng để sắp xếp lại dữ liệu khi filter
				item._ix = i;

				let pid = item[parentField];
				if (pid) {
					//Tìm cha
					let parent = findParent(pid);
					if (parent) {
						// item.parentNode = parent;
						if (!parent.hasOwnProperty('childNodes')) {
							parent['childNodes'] = [];
						}
						if (!parent.hasOwnProperty('IsParent')) {
							parent['IsParent'] = true;
						}
						parent.childNodes.push(item);
						item.ParentId = parent[me.valueField];
					} else {
						parentNodes.push(item);
					}
				} else {
					// NMSINH: thêm món này vì nếu chọn thằng ko có Cha trong list thì nó chính là cha luôn
					parentNodes.push(item);
				}
			}

			me._nodes = allMap;
			me._parents = parents;
			return parentNodes;
		},

		/**
		 * click vào icon dropdown
		 * khi click vào icon dropdown, truyền thêm biến ignore = true để danh sách ko bị filter theo internal text. Bug 14183
		 */
		triggerClick(e) {
			const me = this,
				expanded = me.expanded;

			//disable thì không làm gì
			if (me.disabled) {
				return;
			}

			if (!expanded) {
				me.onInput(e, true);
				me.initData();
			}

			//đặt nextick để tránh lỗi render dom của combobox tree khi chọn item từ dropdown
			me.$nextTick(() => {
				if (expanded) me.expanded = !expanded;
			});

			//focus input
			if (me.$refs.input) {
				me.$refs.input.focus();
				me.$refs.input.select();
			}
		},

		/**
		 * hiển thị dropdown
		 * !modified by Tvthai: Hiện tại chưa thế thi công load remote combo này, nên là ae sẽ load trước khi expand, không load luôn lúc mở form
		 * !note: Ae sửa gì khi expand thì sửa vào hàm funcDoExpand nhé
		 */
		expand() {
			const me = this;
			//Nếu bất đồng bộ thì form xử lý xong tự gọi hàm funcDoExpand
			if (me.isAsyncBeforeExpand) {
				me.$emit('beforeExpand', me.funcDoExpand, me);
			} else {
				me.$emit('beforeExpand');
				me.funcDoExpand();
			}
		},
		//Tất cả code của expand() trước vứt hết vào đây
		funcDoExpand() {
			let me = this;
			me.changeDropdownPosition();
			//đặt nextick để tránh lỗi render dom của combobox tree khi chọn item từ dropdown
			me.$nextTick(() => {
				me.expanded = true;
					me.$nextTick(() => {
						me.adjustScroll();
					})
			});
		},
		/**
		 * ẩn dropdown
		 */
		collapse() {
			const me = this;
			me.$nextTick(() => {
				if (me.expanded) {
					if (me.rules && !me.rules.some((x) => x.name === me.$ms.constant.ValidateRule.ForceSelection) && me.valueField === me.displayField) {
						me.$emit('selected', me.internalValue);
					}
				}
				me.expanded = false;
			});
		},
		/**
		 * Hàm set vị trí cho dropdown menu khi expand
		 * TODO: Chưa xử lý khi có scroll
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
				me.dropdownMaxWidthx = me.dropdownMinWidthx = me.dropdownWidth ? parseInt(me.dropdownWidth) : comboElRect.width;

				// Nếu chạm phải thì align sang trái
				if (comboElRect.left + me.dropdownMaxWidthx > windowWidth) {
					me.dropdownLeftx = comboElRect.right - me.dropdownMaxWidthx;
				}

				//nếu trước đó đã tính -> giữ nguyên, đợi render xong hiển thị dropdown sẽ tính lại sau
				if (!me.dropdownTopx) {
					me.dropdownTopx = comboElRect.top + comboElRect.height + 2;
				}

				me.$nextTick(() => {
					setTimeout(() => {
						let dd = me.$refs.dropdownPanel;
						if (dd && dd.$el) {
							let ofs = dd.$el.getBoundingClientRect();
							if (me.pushElmTop) {
								dd.$refs.menuBodyCon.scrollTop = 0;
							}
							if (comboElRect.top + comboElRect.height + ofs.height + 10 > windowHeight) {
								//quay lên trên
								me.dropdownTopx = comboElRect.top - ofs.height - 2;
							} else {
								me.dropdownTopx = comboElRect.top + comboElRect.height + 2;
							}
						}
					}, 0);
				});
			}
		},

		/**
		 * Validate khi blur
		 * ntnghia - 11/03/2021 quickAdd
		 * bnduc 21.6.2021: Đổi lại thành gọi hàm validate của control thay vì viết scustom như này
		 */
		validateBlur() {
			//TODO Tạm thời xóa validate do chưa kiểm soát được
			this.validate(this);
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

		/**
		 * Xử lý khi expand/collapse item node thì gán activeItem luon
		 */
		itemToogleExpand(item, expanded) {
			this.setActive(item);
		},
		/**
		 * Gán active
		 */
		setActive(item) {
			const me = this;
			me.activeItem = item;
			me.$nextTick(() => {
				let activeEl = me.$refs.dropdownPanel.$el.querySelector('.active');
				if (activeEl && typeof activeEl.scrollIntoViewIfNeeded === 'function') {
					activeEl.scrollIntoViewIfNeeded();
				}

				me.focusInput();
			});
		},

		/**
		 * focus input nhập liệu
		 */
		focusInput() {
			this.$refs.input.focus();
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
