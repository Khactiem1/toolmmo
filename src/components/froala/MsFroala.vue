<template>
	<div v-if="config" class="froala-content">
    <input accept="image/*" @change="onImageSelected" class="separate-line-chose_image" ref="refImage" type="file">
    <input accept="video/*" @change="onVideoSelected" class="separate-line-chose_image" ref="refVideo" type="file">
    <div class="flex-between">
      <label>{{ label }}</label>
    </div>
    <jodit-editor
      class="froala-editor"
      ref="froala"
      v-model="computedValue"
      :config="config"
    />
  </div>
</template>

<script lang="ts">
import 'jodit/build/jodit.min.css'
import { JoditEditor } from 'jodit-vue'
import imageCompression from 'browser-image-compression';
import { computed, defineComponent, getCurrentInstance, ref, onMounted } from 'vue';
import fileAPI from '@/apis/file/fileAPI';
import popupUtil from '@/commons/popupUtil';

export default defineComponent({
  components: {
    JoditEditor
  },
  props: {
    /**
     * label control
     */
     label: {
      default: null,
      type: String,
    },

    modelValue: {

    },
    /**
     * Đường dẫn media muốn lưu
     */
    pathMedia: {
      type: String,
      default: '',
    },
    maxSizeImage: { 
      type: Number, 
      default: 800 * 1024 
    }, // Dung lượng tối ảnh đa cho phép (ví dụ: 800kb)
    maxSizeVideo: { 
      type: Number, 
      default: 50 * 1024 * 1024
    }, // Dung lượng tối video đa cho phép (ví dụ: 50MB)
  },
	setup(props, { emit }) {
		const { proxy } = getCurrentInstance();
    const config = ref(null); // Config froala
    const editorInstance = ref(null);

    /**
     * Mở popup trình quản lý hình ảnh
     */
    const opendFileManagement = (editor) => {
      const me = proxy;
      editorInstance.value = editor;
      popupUtil.show('FileManagement', {
        editor: me,
      });
    };

    /**
     * Insert hình ảnh
     */
    const handleInsertImage = (editor) => {
      const me: any = proxy;
      if(me.$refs['refImage']){
        me.$refs['refImage'].click();
      }
      editorInstance.value = editor;
    };

    // Xử lý khi file được chọn
    const onImageSelected = async (event: any) => {
      const me: any = proxy;
      if (event.type === 'change' && event.target.files && event.target.files.length > 0) {
        handleUploadImage(event.target.files, (url) => {
          if(url && editorInstance.value){
            me.$refs['refImage'].value = null;
            editorInstance.value.execCommand('insertImage', true, url);
          }
        });
      }
    };

    /**
     * Xử lý upload hình ảnh
     */
    const handleUploadImage = function (files: File[], callBack){
      const me: any = proxy;
      if (files.length) {
        me.$ms.commonFn.mask();
        compressImage(files[0], me.maxSizeImage).then((file) => {
          if(file){
            fileAPI.uploadFile(file, me.pathMedia).then((result) => {
              if (result?.Success && result?.Data && typeof callBack === 'function'){
                callBack(fileAPI.getFileViewUrl(result.Data));
              }
            })
            .catch(error => {
              console.error('Lỗi tải hình ảnh:', error);
            })
            .finally(() => {
              me.$ms.commonFn.unmask();
            });
          }
        }).catch(() => {
          me.$ms.commonFn.unmask();
        })
      }
      return false; // Ngăn không cho Froala xử lý upload mặc định
    };

    // Xử lý khi file được chọn
    const onVideoSelected = async (event: any) => {
      const me: any = proxy;
      if (event.type === 'change' && event.target.files && event.target.files.length > 0) {
        handleUploadVideo(event.target.files, (url) => {
          if(url && typeof editorInstance.value?.selection?.insertHTML === 'function'){
            me.$refs['refVideo'].value = null;
            editorInstance.value.selection.insertHTML(`
              <video src="${url}" 
                width="300" 
                height="300" 
                controls
                playsinline autoplay
              >
                Video không thể phát. Vui lòng kiểm tra lại!
              </video>
            `);
          }
        });
      }
    };

    /**
     * Xử lý upload video
     */
    const handleUploadVideo = function (files: File[], callBack: Function){
      const me: any = proxy;
      if (files.length) {
        me.$ms.commonFn.mask();
        fileAPI.uploadFile(files[0], me.pathMedia).then((result) => {
          if (result?.Success && result?.Data && typeof callBack === 'function'){
            callBack(fileAPI.getFileViewUrl(result.Data));
          }
        })
        .catch(error => {
          console.error('Lỗi tải video:', error);
        })
        .finally(() => {
          me.$ms.commonFn.unmask();
        });
      }
    };

    /**
     * Xử lý upload video
     */
    const handleInsertVideo = (editor) => {
      const me: any = proxy;
      if(me.$refs['refVideo']){
        me.$refs['refVideo'].click();
      }
      editorInstance.value = editor;
    };

    /**
     * Init config froala
     */
    onMounted(() => {
      const me:any = proxy;
      config.value = {
        minHeight: 500, // Chiều cao tối thiểu 500px
        removeButtons: ['image', 'video'],
        extraButtons: [
          {
            name: 'insertImageCustom',
            icon: 'image',
            exec: (editor) => {
              handleInsertImage(editor);
            },
            tooltip: 'Insert Image',
          },
          {
            name: 'insertVideoCustom',
            icon: 'video',
            exec: (editor) => {
              handleInsertVideo(editor);
            },
            tooltip: 'Insert Video',
          },
          {
            name: me.$t('i18nCommon.MsFileUpload.ImageManagement'),
            icon: 'fileManagement',
            exec: (editor) => {
              me.opendFileManagement(editor);
            },
            tooltip: me.$t('i18nCommon.MsFileUpload.ImageManagement'),
          },
        ],
      };
    });

    /**
     * Nén ảnh
     * @param file File ảnh cần nén
     * @param maxSizeKB Dung lượng tối đa (KB)
     * @param initialQuality Chất lượng ảnh ban đầu (0-1)
     * @returns File đã nén
     */
    const compressImage = async (
      file: File,
      maxSizeKB, // Dung lượng tối đa (KB)
      initialQuality = 0.9 // Chất lượng ảnh ban đầu
    ): Promise<File> => {
      let quality = initialQuality;
      let compressedFile = file;
      if(compressedFile.size <= maxSizeKB * 1024) return compressedFile;
      do {
        const options = {
          maxSizeMB: maxSizeKB / 1024, // Chuyển đổi từ KB sang MB
          initialQuality: quality, // Chất lượng hiện tại
          useWebWorker: true, // Sử dụng Web Worker
        };
        try {
          // Nén file
          compressedFile = await imageCompression(file, options);
        } catch (error) {
          console.error('Lỗi khi nén ảnh:', error);
          throw error; // Bắn lỗi để xử lý bên ngoài nếu cần
        }

        // Giảm chất lượng ảnh
        quality -= 0.1;

        // Thoát nếu chất lượng quá thấp
        if (quality <= 0.1) {
          break;
        }
      } while (compressedFile.size > maxSizeKB * 1024); // Kiểm tra nếu kích thước lớn hơn maxSizeKB

      return compressedFile;
    };

    /**
     * Giá trị v-model
     */
    const computedValue = computed({
      get() {
        return props.modelValue ? props.modelValue : '';
      },
      set(value) {
        emit("update:modelValue", value);
      },
    });

		return {
      config,
      computedValue,
      editorInstance,
      onImageSelected,
      onVideoSelected,
      opendFileManagement,
		};
	},
});
</script>

<style lang="scss" scoped>
.froala-content, .froala-editor{
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
}
.separate-line-chose_image{
  width: 0;
  height: 0;
  visibility: hidden;
}
</style>
