<template>
	<div>
		<div v-if="text" class="flex flex-row label-gap items-center mb-2">
			<div class="title-upload semi-bold" :style="`font-size: ${textSize}px`">{{ text }}</div>
			<div class="title-upload-expand">&nbsp; {{ maxSizeLabel }}</div>
		</div>
		<div class="ms-file-upload flex-column control-gap" :class="disabled ? 'disabled' : ''">
			<div v-if="showModeView" :class="disabled ? 'disabled-event' : ''">
				<div class="flex-row">
					<input type="file" :key="modelValue" @change="onChange" class="input-upload" :id="idComponent" :multiple="multiple"
						ref="fileInput" />
					<label class="btn-upload-file cursor-pointer" :class="[{ isDragOver: isDragOver }]"
						@dragover.prevent="onDragOver" @dragleave="onDragLeave" @drop.prevent="onDrop"
						:for="idComponent">
						<i style="padding: 2px 6px 0 6px;" class="fa fa-paperclip" aria-hidden="true"></i>
						{{ 
							isDragOver ? 
							$t('i18nCommon.MsFileUpload.IsDragOver') :
							$t('i18nCommon.MsFileUpload.PlaceHolder')
						}}
					</label>
				</div>
			</div>
			<div class="flex-column control-gap flex-wrap file-items">
				<div v-for="(file, index) in listFile" :key="index">
					<div class="file-item">
						<div class="mi mi-16 attackment-icon">
							<i class="fa fa-paperclip" aria-hidden="true"></i>
						</div>
						<div @click="downloadFile(file, index)" class="text-ellipsis pointer">
							<span class="file-name" :title="file.FileName">{{ file.name ? file.name : file.FileName
							}}</span>
							<span>{{ ' (' + formatSize(file.FileSize || file.size) + ')' }}</span>
						</div>
						<div :class="disabled ? 'disabled-event' : ''" class="close-button flex-center cursor-pointer"
							@click="deleteFile(file, index)" v-if="!disabled">
							<div class="mi mi-16 close-button-icon">
								<i class="fa fa-times" aria-hidden="true"></i>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { ref, getCurrentInstance, computed } from 'vue';
import { showWarning } from '@/commons/globalMessage';
import { useI18n } from 'vue-i18n';
import fileAPI from '@/apis/file/fileAPI';

export default {
	name: 'msFileUpload',
	props: {
		modelValue: {
			type: String,
			default: null,
		},
		textSize: {
			type: Number,
			default: 13,
		},
		text: {
			type: String,
			default() {
				const { t } = useI18n();
				return t('i18nCommon.MsFileUpload.Attachment');
			},
		},
		// max size MB
		maxSize: {
			type: Number,
			default: 5,
		},

		/**
		 * file chấp nhận nhập vào chương trình
		 */
		allowExt: {
			type: Array,
			default: ['doc', 'docx', 'xls', 'xlsx', 'pdf', 'xml', 'zip', 'mp4', 'ppt', 'pptx', 'xmind', 'jpg', 'jpeg', 'png'],
		},

		multiple: {
			type: Boolean,
			default: true,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		showModeView: {
			type: Boolean,
			default: true,
		},
		/**
		 * Bổ xung id để trường hợp phân biệt được 2 component giống nhau cùng được dom render
		 */
		idComponent: {
			type: String,
			default: 'fileUploadComponent',
		},

		/**
		 * Url chứa ảnh khi upload
		 */
		path: { 
			required: false, 
			default: '', 
		}
	},
	watch: {
		modelValue: {
			immediate: true,
			handler(newVal) {
				if (!newVal) {
					this.listFile = [];
				} else {
					if (this.listFile.length == 0) {
						this.listFile.append(JSON.parse(newVal));
					}
				}
			},
		},
	},
	emits: ['update:modelValue', 'onError', 'onSuccess'],
	setup(props, { emit }) {
		let listFile = ref([]);
		const { proxy } = getCurrentInstance();
		const isUploading = ref(false);

		/**
		 * format size file upload sang kb hoặc mb
		 */
		const formatSize = (bytes, decimals = 2) => {
			if (bytes === 0) return '0 bytes';
			const k = 1024;
			const dm = decimals < 0 ? 0 : decimals;
			const sizes = ['bytes', 'kb', 'mb', 'gb', 'tb', 'pb', 'eb', 'zb', 'yb'];
			const i = Math.floor(Math.log(bytes) / Math.log(k));
			let res = parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + sizes[i];
			return res.toString();
		};

		/**
		 * Xử lý event sau khi chọn file
		 * @param {*} e
		 */
		const onChange = async (e, index = -1) => {
			const isValid = validateFile(e);
			if (isValid) {
				emit('onSuccess', e.currentTarget.files);
			} else {
				emit('onError');
				let input = proxy.$refs.fileInput;
				if (input) {
					input.value = null;
				}
				return;
			}
			let files = [...e.target.files];
			if (index == -1) {
				await upload('all', files);
			} else {
				await upload(index, files);
			}
			let input = proxy.$refs.fileInput;
			if (input) {
				input.value = null;
			}
		};

		/**
		 * Xóa file
		 * @param {*} file
		 * @param {*} index
		 */
		const deleteFile = (file, index) => {
			proxy.listFile.splice(index, 1);
			emit('update:modelValue', JSON.stringify(proxy.listFile));
		};


		/**
		 * Download file
		 * @param {*} item
		 * @param {*} index
		 */
		const downloadFile = async (item) => {
			let link = fileAPI.getFileViewUrl(item.FileID);
			proxy.$ms.commonFn.downloadLink(link);
		};

		/**
		 * Upload file lên server
		 * @author ldlong 26.06.2023
		 */
		const upload = async (index, files) => {
			const me = proxy;
			isUploading.value = true;
			// Gửi file lên server
			me.$ms.commonFn.mask();
			const result = await fileAPI.uploadFile(files[0], me.path);
			me.$ms.commonFn.unmask();
			isUploading.value = false;
			if (result?.Success && result?.Data){
				let itemSuccess = {
					"FileID": result.Data,
					"FileName": files[0].name,
					"FileSize": files[0].size,
					"FileType": result.Data.split('.')[1],
					"UploadDate": result.ServeTime
				};
				if (files && files.length) {
					proxy.listFile.splice(index, 0, ...[itemSuccess]);
				} else if (files && files.length) {
					proxy.listFile.push(...[itemSuccess]);
				}
				emit('update:modelValue', JSON.stringify(proxy.listFile));
			};
		};

		/**
		 * Validate file đầu vào
		 * @param {*} e
		 */
		const validateFile = (e) => {
			const listFile = e.currentTarget.files;
			let isValid = true;
			if (listFile && listFile.length > 0) {
				if (!proxy.multiple) {
					// validate nếu ko cho chọn nhiều file mà thả nhiều file vào thì sẽ báo lỗi
					if (listFile.length > 1 || proxy.listFile?.length) {
						isValid = false;
						showWarning(proxy.$t('i18nCommon.MsFileUpload.ValidateSelectMultipleFile'));
						return isValid;
					}
				}
				for (let i = 0; i < listFile.length; i++) {
					const file = listFile[i];
					let msg = '';
					if (file) {
						if (!validateSize(file.size)) {
							isValid = false;
							msg = proxy.$t('i18nCommon.MsFileUpload.FileOverSizeMsg');
						}
						else if (!validateFileType(file)) {
							isValid = false;
							msg = proxy.$t('i18nCommon.MsFileUpload.ValidateFileType', { fileType: proxy.allowExt.join(', ') });
						}
					}
					if (!isValid) {
						showWarning(msg);
						break;
					}
				}
			}
			return isValid;
		};

		/**
		 * Validate loại file được thêm vào
		 */
		const validateFileType = (file) => {
			const me = proxy;
			const { name } = file;
			if (name) {
				let extention = name.split('.').pop();
				if (extention) {
					extention = extention.toLocaleLowerCase();
				}
				if (me.allowExt.some((x) => x.toLocaleLowerCase() === extention)) {
					return true;
				}
			}
		};

		/**
		 * Validate size của file
		 * NCPHUOC 26/07/2022
		 */
		const validateSize = (size) => {
			const oneMbInBytes = 1024 * 1024;

			const maximumFileUpload = proxy.maxSize * oneMbInBytes;
			if (size < maximumFileUpload) {
				return true;
			}
		};

		const maxSizeLabel = computed(() => {
			if (proxy.maxSize) {
				return proxy.$t('i18nCommon.MsFileUpload.MaxFileSize').replace('#fileSize#', proxy.maxSize);
			}
			return '';
		});

		/**
		 * Biến lưu trạng thái kéo thả file
		 * nktiem 21/08/2023
		 */
		const isDragOver = ref(false);

		/**
		 * Trạng thái đang kéo
		 * nktiem 21/08/2023
		 */
		const onDragOver = (event) => {
			event.preventDefault();
			isDragOver.value = true;
		};

		/**
		 * Trạng thái thả
		 * nktiem 21/08/2023
		 */
		const onDragLeave = () => {
			isDragOver.value = false;
		};

		/**
		 * Thả nhận file
		 * nktiem 21/08/2023
		 */
		const onDrop = (e) => {
			e.preventDefault();
			isDragOver.value = false;
			e.currentTarget.files = e.dataTransfer?.files;
			e.target.files = e.dataTransfer?.files;
			onChange(e);
		};

		return {
			isDragOver,
			onDragOver,
			onDragLeave,
			onDrop,
			listFile,
			formatSize,
			onChange,
			deleteFile,
			downloadFile,
			maxSizeLabel,
			isUploading,
		};
	},
};
</script>

<style scoped lang="scss">
@use "@/assets/scss/component/MsFileUpload.scss" as style;
</style>
