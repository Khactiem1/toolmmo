<template>
	<template v-if="columns && columns.length > 1">
		<tr
			class="combobox-item"
			:class="{
				parent: item.IsParent,
				checked: selectedValue === item[valueField],
				active: activeValue == item[valueField],
				'combobox-item--highlight': activeValue == item[valueField],
			}"
			@click="onItemClick(item, $event)"
		>
			<td class="combobox-item-td" v-for="(column, tdIndex) in columns" :title="getItemDisplay(item, column)" :style="getThStyle(column)" :ref="`td-${tdIndex}`" :key="column.dataField" :class="tdIndex === 0 ? `level-${item.level}` : null">
				<div class="flex-row">
					<div class="combobox-item--text">{{ getItemDisplay(item, column) }}</div>
				</div>
			</td>
		</tr>

		<template v-if="item.expanded">
			<ms-combobox-tree-item
				v-for="child in item.childNodes"
				:key="child[valueField]"
				:item="child"
				:columns="columns"
				:valueField="valueField"
				:displayField="displayField"
				@itemClick="onItemClick"
				:selectedValue="selectedValue"
				@toogleExpand="onChildToogleExpand"
				:activeValue="activeValue"
			/>
		</template>
	</template>
	<template v-else>
		<div
			class="combobox-item"
			:class="{
				parent: item.IsParent,
				checked: selectedValue === item[valueField],
				active: activeValue == item[valueField],
				'combobox-item--highlight': activeValue == item[valueField],
			}"
			@click="onItemClick(item, $event)"
		>
			<div :class="`level-${item.level}`" :title="item[displayField]">
				<div class="flex-row">
					<div class="combobox-item--text">{{ item[displayField] }}</div>
				</div>
			</div>
		</div>
		<template v-if="item.expanded">
			<ms-combobox-tree-item
				v-for="child in item.childNodes"
				:key="child[valueField]"
				:item="child"
				:columns="columns"
				:valueField="valueField"
				:displayField="displayField"
				@itemClick="onItemClick"
				:selectedValue="selectedValue"
				@toogleExpand="onChildToogleExpand"
				:activeValue="activeValue"
			/>
		</template>
	</template>
</template>

<script>
import { defineComponent, getCurrentInstance } from 'vue';

export default defineComponent({
	name: 'MsComboboxTreeItem',
	emits: ['itemClick', 'toogleExpand'], //khai báo emit event
	props: {
		/**
		 * truyền từ combobox để xem đang select bản ghi nào
		 */
		selectedValue: {},
		/**
		 * Item sử dụng để binding
		 */
		item: {},

		/**
		 * Cấu hình cột của menu
		 */
		columns: {
			type: Array,
			default: new Array(),
		},

		/**
		 * Trường làm value
		 * CreatedBy PDKIEN 10/12/2019
		 */
		valueField: {
			type: String,
			default: null,
		},
		/**
		 * Trường là display
		 * CreatedBy PDKIEN 10/12/2019
		 */
		displayField: {
			type: String,
			default: null,
		},
		/**
		 * Kiểu định dạng dữ liệu trên combobox
		 * Tương ứng với FormatType
		 * CreatedBy PDKIEN 07/12/2019
		 */
		formatType: {
			type: [Number, String],
			default: null,
		},
		align: {
			type: String,
			default: 'left',
		},
		/**
		 * item active
		 * truyền qua để gán style
		 */
		activeValue: {},
	},
	setup(props, { emit }) {
		//Variable
		const { proxy } = getCurrentInstance();

		const onItemClick = (item, e) => {
			if (e.cancel) {
				return;
			}

			emit('itemClick', item, e);
		};

		//Method
		/**
		 * Hàm lấy style cho td trong table
		 * dữ liệu động theo config của dev
		 */
		const getCellStyle = (column, index) => {
			if (column.isResize) {
				if (proxy.$refs[`td-${index}`] && proxy.$refs[`td-${index}`].length > 0) {
					let item = proxy.$refs[`td-${index}`][0];
					let rectTd = item.getBoundingClientRect();
					let rectParent = proxy.$parent.$el.getBoundingClientRect();
					if (rectTd.right <= rectParent.right) {
						return {
							width: rectTd.width + (rectParent.right - rectTd.right) + 'px',
							textAlign: column.columnAlign,
						};
					} else {
						return {
							width: `${column.width}px`,
							textAlign: column.columnAlign,
						};
					}
				}
			}
			return {
				width: column.isResize ? null : `${column.width}px`,
				textAlign: column.columnAlign,
			};
		};

		/**
		 * Lấy text hiển thị trên item tree
		 * Nếu có column lấy theo column.field, nếu không có column lấy theo displayField, nếu không có displayField lấy theo valueField
		 * CreatedBy PDKIEN 10/12/2019
		 */
		const getItemDisplay = (item, column) => {
			let field = column ? column.dataField : props.displayField || props.valueField;

			let value = '';
			if (field) {
				value = item[field];
			} else {
				value = item;
			}
			return proxy.$ms.commonFn.processXssValue(value);
		};

		const toogleExpand = (item, e) => {
			e.preventDefault();
			e.cancel = true;
			item.expanded = !item.expanded;

			emit('toogleExpand', item, item.expanded);
		};

		const onChildToogleExpand = (item, expanded) => {
			emit('toogleExpand', item, expanded);
		};

		/**
		 * Hàm lấy style cho th trong table
		 * dữ liệu động theo config của dev
		 */
		const getThStyle = (column) => {
			return {
				width: column.isResize ? null : `${column.width}px`,
				maxWidth: column.isResize ? null : `${column.width}px`,
				textAlign: column.columnAlign,
			};
		};

		return {
			toogleExpand,
			getCellStyle,
			getItemDisplay,
			onItemClick,
			getThStyle,
			onChildToogleExpand,
		};
	},
});
</script>

<style lang="scss" scoped>
@use "@/assets/scss/component/MsComboboxItem.scss" as style;
.combobox-item.checked{
	color: var(--while__color);
	background-color: var(--primary__color);
}
.combobox-item{
	padding-left: 0 !important;
}
</style>
