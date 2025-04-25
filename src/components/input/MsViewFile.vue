<template>
	<div>
		<div class="ms-file-upload flex-column control-gap">
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
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { ref, getCurrentInstance } from 'vue';
import fileAPI from '@/apis/file/fileAPI';

export default {
	name: 'msViewFile',
	props: {
		modelValue: {
			type: String,
			default: null,
		},
	},
	watch: {
		modelValue: {
			immediate: true,
			handler(newVal) {
				if (!newVal) {
					this.listFile = [];
				} else {
					this.listFile = JSON.parse(newVal);
				}
			},
		},
	},
	emits: ['update:modelValue', 'onError', 'onSuccess'],
	setup(props, { emit }) {
		let listFile = ref([]);
		const { proxy } = getCurrentInstance();

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
		 * Download file
		 * @param {*} item
		 * @param {*} index
		 */
		const downloadFile = async (item) => {
			let link = fileAPI.getFileViewUrl(item.FileID);
			proxy.$ms.commonFn.downloadLink(link);
		};

		return {
			listFile,
			formatSize,
			downloadFile,
		};
	},
};
</script>

<style scoped lang="scss">
@use "@/assets/scss/component/MsFileUpload.scss" as style;
</style>
