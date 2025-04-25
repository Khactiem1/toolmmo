import { mixinSuper } from '@/mixins/common/mixinSuper';
import { permission } from '@/mixins/common/permission';
import { validateComponent } from '@/mixins/component/validateComponent';
import { showAlert } from '@/commons/globalMessage';
import { cloneDeep } from 'lodash-es';
import { shortkeyStatusbar } from '@/mixins/common/shortkeyStatusbar';

/**
 * Các thông tin chung của màn hình chi tiết
 */
export default {
	mixins: [mixinSuper, permission, validateComponent, shortkeyStatusbar],
	data() {
		return {
      /**
			 * refname control hiển thị dữ liệu: grid/tree
			 */
			viewRef: 'viewList',
			/**
			 * Store của module kế thừa base
			 */
			storeModule: {},

			/**
			 * api của module
			 */
			api: {},

      /**
       * Trạng thái from
       */
      editMode: null,

      /**
       * Dữ liệu thực hiện binding
       */
      model: {} as any,

      /**
       * Param từ form mở popup đẩy lên
       */
      _formParam: {},

      /**
       * Sau khi save có đóng form ko
       */
      hideAfterSave: true,
		};
	},
	created() {},
	mounted() {
    const me: any = this;
    me.bindData();
	},
	/**
	 * Xóa items trong grid khi unmount
	 */
	beforeUnmount() {

	},
	methods: {
    /**
     * Xử lý trước khi bind dữ liệu
     */
    async beforeBindData(){
      
    },

    /**
     * Xử lý sau khi bind xong data
     */
    async afterBindData(){

    },

    /**
     * Xử lý bind dữ liệu
     */
    async bindData(){
      const me: any = this;
      await me.beforeBindData();
      if(Object.keys(me._formParam.dataRow)?.length !== 0){
        me.model = me._formParam.dataRow;
      }
      if(me.editMode == me.$ms.constant.FormState.Add){ // nếu là model add thì reset khoá chính
        delete me.model[me.storeModule._config.field.key];
      }
      await me.afterBindData();
      setTimeout(() => {
        me.$ms.commonFn.focusFirstControl(me.$refs['slot-content']);
      }, 100);
    },

    /**
     * Xử lý khi mở popup
     */
    beforeOpen(e: any){
      const me: any = this;
      me._popup = me.$vfm.dynamicModals[me.$vfm.dynamicModals.length - 1];
			me._formParam = e.ref.params._rawValue ? e.ref.params._rawValue : e.ref.params;
      me.editMode = me._formParam.formState;
    },

    /**
		 * Đóng form nhưng không kiểm tra thay đổi
		 */
		hide() {
			try {
				const me: any = this;
				me._popup.value = false;

				me.$nextTick(() => {
					delete me._popup;
				});
			} catch (ex) {
				console.error(ex)
			}
		},

    /**
     * Hàm xử lý thêm dữ liệu trùng với dữ liệu đã xoá
     */
    async handleDuplicateDataDelete(){
      const me: any = this;
      const ask = await showAlert(me.$t('i18nCommon.AskRestoreDuplicateData'));
      if(ask){
        me.$ms.commonFn.mask();
        const result = await me.api.restoreDataDelete(me.model);
        me.$ms.commonFn.unmask();
        if(result?.Success && result?.Data){
          me.model[me.storeModule._config.field.key] = result.Data[me.storeModule._config.field.key];
          me.storeModule.insertItem(me.model);
          me.editMode = me.$ms.constant.FormState.Edit;
          me.$ms.commonFn.pushNotification({
            type: me.$ms.constant.ENotificationType.Success,
            message: me.$t('i18nCommon.crud.restore_success'),
          });
        }
      }
    },

    /**
     * Xử lý cất dữ liệu
     */
    async save(){
      const me: any = this;
      const dataSubmit = cloneDeep(me.model);
      await me.beforeSave(dataSubmit);
      if(await me.validateSave(dataSubmit)){
        let saveSuccess = false;
        let resultSave;
        me.$ms.commonFn.mask();
        switch (me.editMode) {
          case me.$ms.constant.FormState.Add:
            resultSave = await me.storeModule.insert(dataSubmit);
            if (resultSave?.Success){
              me.$ms.commonFn.pushNotification({
                type: me.$ms.constant.ENotificationType.Success,
                message: me.$t('i18nCommon.crud.save_success'),
              });
              saveSuccess = true;
            }
            else if (resultSave.Code == me.$ms.constant.EnumValidateResult.DuplicateDelete){
              await me.handleDuplicateDataDelete();
            }
            break;
          case me.$ms.constant.FormState.Edit:
            resultSave = await me.storeModule.update(dataSubmit);
            if (resultSave?.Success){
              me.$ms.commonFn.pushNotification({
                type: me.$ms.constant.ENotificationType.Success,
                message: me.$t('i18nCommon.crud.edit_success'),
              });
              saveSuccess = true;
            }
            break;
        }
        if(saveSuccess){
          await me.afterSaveSuccess(resultSave);
          if(me.hideAfterSave){
            me.hide();
          }
        }
        me.$ms.commonFn.unmask();
      }
    },

    /**
     * Xử lý trước khi save
     */
    async beforeSave(model){

    },

    /**
		 * Xử lý sau khi cất thành công
		 */
		async afterSaveSuccess(resultSave) {
      
		},

    /**
		 * Hàm validate custom trước khi save
		 */
		async validateSaveCustom(model) {
			return true;
		},

    /**
		 * Kiểm tra dữ liệu trước khi cất
		 */
		async validateSave(model) {
			const me: any = this;
			return (await me.validateComponents() && await me.validateSaveCustom(model));
		},

	},
};
