<template>
	<div style="width: 100%; height: 100%; padding: 10px 24px;">
		<div id="id-dashboard" @click="show">
		</div>
		<div style="width: 500px; margin-bottom: 6px;" class="flex">
			<div class="form-group">
				<ms-file-upload
					v-model="currentItem.DocumentIncluded"
					:disabled="false"
					:path="'/user/avatar'"
				>
				</ms-file-upload>
			</div>
		</div>
		<ms-froala
			:label="$t('i18nNews.Detail.content')"
			v-model="contentFroala"
			:pathImage="'/news/content/image'"
			:pathVideo="'/news/content/video'"
		/>
		<div style="width: 200px; margin-bottom: 6px;" class="flex">
			<div class="form-group">
				<!-- :columns="[
						{
							title: $t('i18nMenu.Detail.menu_code'),
							dataField: 'menu_code',
							width: 236,
						},
						{
							title: $t('i18nMenu.Detail.menu_name'),
							dataField: 'menu_name',
							width: 283,
						},
					]" -->
				<ms-combobox-tree-v2
					:label="'Menu'"
					valueField="menu_id"
					displayField="menu_name"
					idProperty="menu_id"
					:rules="[{ name: 'required' }, { name: 'forceSelection' }]"
					:isAsyncBeforeExpand="true"
					@beforeExpand="beforeExpandMenu"
					@selected="selectedMenu"
					:data="dataCombobox.menu"
					:dropdownWidth="500"
					:columns="[
						{
							title: $t('i18nMenu.Detail.menu_code'),
							dataField: 'menu_code',
							width: 236,
						},
						{
							title: $t('i18nMenu.Detail.menu_name'),
							dataField: 'menu_name',
							width: 283,
						},
					]"
					v-model="modelComboboxTree.menu_id"
				/>
			</div>
		</div>
		{{ modelComboboxTree }}
		<div style="width: 200px; margin-bottom: 6px;" class="flex">
			<div class="form-group">
				<ms-combobox-enum
					:label="'Lọc'"
					enum="FilterOperator"
					:placeholder="'Chọn đi'"
					:rules="[{ name: 'required' }, { name: 'forceSelection' }]"
					@selected="(metaData) => {console.log(metaData)}"
					v-model="modelComboboxEnum.value"
				></ms-combobox-enum>
			</div>
		</div>
		{{ modelComboboxEnum }}
		<div style="width: 200px; display: flex; margin-bottom: 6px;">
			<div class="form-group">
				<ms-combobox-v2
					:label="'Tỉnh thành'"
					valueField="province_id"
					displayField="province_name"
					:data="dataCombobox.dictionary_list"
					:buildFilter="buildFilterCombobox"
					:initText="modelCombobox.province_name"
					@comboboxLoadData="(payload) => onComboboxLoadData(payload, dictionaryListAPI, dataCombobox, 'dictionary_list')"
					@selected="selectedDictionaryList"
					:rules="[{ name: 'required' }, { name: 'forceSelection' }]"
					queryMode="remote"
					:remoteFilter="true"
					v-model="modelCombobox.province_id"
					v-model:display="modelCombobox.province_name"
				></ms-combobox-v2>
			</div>
		</div>
		{{ modelCombobox }}
		<div style="width: 1000px; display: flex; margin-bottom: 6px;">
			<ms-datepicker
				v-model="datePicker"
			>
			</ms-datepicker>
		</div>
		<div style="width: 200px; display: flex; margin-bottom: 6px;">
			<ms-input v-model="msInput"/> Value: {{ msInput }}
		</div>
		<div style="width: 200px; display: flex; margin-bottom: 6px;">
			<ms-number v-model="msNumber"/> Value: {{ msNumber }}
		</div>
		<div style="width: 200px; display: flex; margin-bottom: 6px;">
			<ms-checkbox v-model="msCheckbox"/> Value: {{ msCheckbox }}
		</div>
		<div style="width: 200px; display: flex; margin-bottom: 6px;">
			<ms-switch v-model="msCheckbox"/> Value: {{ msCheckbox }}
		</div>
		<div style="width: 1000px; display: flex; margin-bottom: 6px;">
			<label>{{ "Giới tính: " }}</label>
				<div class="base-radio_item">
					<ms-radio
						:label="'Nam'"
						:value="0"
						v-model.number="gender"
					></ms-radio>
					<ms-radio
						:label="'Nữ'"
						:value="1"
						v-model.number="gender"
					></ms-radio>
					<ms-radio
						:label="'Khác'"
						:value="2"
						v-model.number="gender"
					></ms-radio>
				</div>
				<div style="margin-left: 20px;">Value: {{ gender }}</div>
		</div>
		<div style="width: 1000px; display: flex; margin-bottom: 6px;">
			<ms-button @click="addNotification">addNotification</ms-button>

			<ms-button @click="showInfoFn">showInfo</ms-button>
			<ms-button @click="showAlertFn">showAlert</ms-button>
			<ms-button @click="showConfirmFn">showConfirm</ms-button>
			<ms-button @click="showErrorFn">showError</ms-button>
			<ms-button @click="showWarningFn">showWarning</ms-button>
		</div>
		<div style="height: 400px;">
			<!-- <ms-froala
				v-model="model"
				:pathImage="'/news/image'"
				:pathVideo="'/news/video'"
			/> -->
		</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, ref, reactive } from 'vue';
import popupUtil from '@/commons/popupUtil';
import { showInfo, showAlert, showConfirm, showError, showWarning } from '@/commons/globalMessage';
import dictionaryListAPI from '@/apis/sys/dictionaryListAPI';
import { useRemoteCombobox } from '@/setup/remoteCombobox';
import menuAPI from '@/apis/sys/menuAPI';
import MsComboboxTreeV2 from '@/components/comboboxTree/MsComboboxTreeV2.vue';
import MsFileUpload from '@/components/input/MsFileUpload.vue';

export default defineComponent({
  components: {
		MsComboboxTreeV2,
		MsFileUpload,
  },
	setup() {
		const { proxy } : any = getCurrentInstance();

		const { comboboxLoadData } = useRemoteCombobox();
		const modelComboboxEnum = ref({
			value: null,
		});
		const currentItem = ref({
			DocumentIncluded: '[{"FileID":"/user/avatar/d9146b2f-4196-47ff-9d09-a82cd926d83c.jpg","FileName":"FreeLook.jpg","FileSize":3230,"FileType":".jpg","UploadDate":"2025-02-04T07:12:59.901+07:00"}]',
		});
		const contentFroala = ref(null);
		const datePicker = ref(new Date());
		const msInput  = ref();
		const msNumber  = ref();
		const msCheckbox  = ref(true);
		const gender  = ref(0);
		const model = ref(null);

		const showInfoFn = async () => {
			popupUtil.show('EmployeeDetail');
			const me: any = proxy;
			const result = await showInfo('showInfoFn');
			console.log(result)
		};
		const showAlertFn = async () => {
			const me: any = proxy;
			const result = await showAlert('showAlertFn');
			console.log(result)
		};
		const showConfirmFn = async () => {
			const me: any = proxy;
			const result = await showConfirm('showConfirmFn');
			console.log(result)
		};
		const showErrorFn = async () => {
			const me: any = proxy;
			const result = await showError('showErrorFn');
			console.log(result)
		};
		const showWarningFn = async () => {
			const me: any = proxy;
			const result = await showWarning('showWarningFn');
			console.log(result)
		};


    const show = async () => {
      const me = proxy;

    }

		const addNotification = () => {
			const me: any = proxy;
			me.$ms.commonFn.pushNotification({
				type: me.$ms.constant.ENotificationType.Success,
				message: "Thành công opacity: 0; visibility: hidden; z-index: -1; position: fixed; bottom: 55px; width: 84px; height: 84px; max-width: 100%; max-height: calc(100% - 55px); min-height: 0px; min-width: 0px; background-color: transparent; border: 0px; overflow: hidden; right: 2px; transition: none !important;",
			});
		}

		const dataCombobox = reactive({
			dictionary_list: [],
			menu: [],
		});

		const modelComboboxTree = ref({
			menu_id: null,
			menu_code: null,
			menu_name: null,
		});

		const modelCombobox = ref({
			province_name: null,
			province_code: null,
			province_id: null,
		});

		const selectedMenu = (metaData) => {
			modelComboboxTree.value.menu_code = metaData.newData ? metaData.newData.menu_code : null;
			modelComboboxTree.value.menu_name = metaData.newData ? metaData.newData.menu_name : null;
		}

		const beforeExpandMenu = async (funcInCombobox: any, instance: any = {}) => {
			const me = proxy;
			//Nếu đã load rồi thì không load nữa, gọi luôn hàm trong combobox
			if (me.loadedDataMenu) {
				if(typeof funcInCombobox === 'function'){
					funcInCombobox();
				}
				return;
			}
			me.loadedDataMenu = true;
			if(typeof funcInCombobox === 'function'){
				funcInCombobox();
			}
			const payload = {
        PageIndex: 0,
        PageSize: 0,
        Columns: "*",
        Filter: JSON.stringify(["menu_type", "=", "web"]),
        Sort: "sort ASC",
        CustomParam: {},
      };
			instance.loading = true;
			const result = await menuAPI.getList(payload);
			instance.loading = false;
			if (result?.Success && result?.Data?.PageData) {
        dataCombobox.menu = result.Data.PageData;
      }
		};

		const selectedDictionaryList = (metaData) => {
			modelCombobox.value.province_name = metaData.newData ? metaData.newData.province_name : null;
			modelCombobox.value.province_code = metaData.newData ? metaData.newData.province_code : null;
		};

		const onComboboxLoadData = (payload, entityAPI, dataCombobox, name) => {
			if (name == 'dictionary_list') {

			}
			comboboxLoadData(payload, entityAPI, dataCombobox, name, null);
		};

		const buildFilterCombobox = (payload) => {
			const me: any = proxy;
			if(!payload.CustomParam){
				payload.CustomParam = {};
			}
			payload.CustomParam.ViewName = '"SYS".province';
			payload.CustomParam.columns = 'province_id,province_code,province_name';
		}

		return {
			dataCombobox,
			onComboboxLoadData,
			selectedDictionaryList,
			buildFilterCombobox,
			modelCombobox,
			show,
			addNotification,
			datePicker,
			msInput,
			contentFroala,
			msNumber,
			msCheckbox,
			gender,
			modelComboboxEnum,
			currentItem,
			model,
			showInfoFn,
			showAlertFn,
			showConfirmFn,
			showErrorFn,
			showWarningFn,
			beforeExpandMenu,
			selectedMenu,
			dictionaryListAPI,
			modelComboboxTree,
		};
	},
});
</script>

<style lang="scss" scoped>

</style>
