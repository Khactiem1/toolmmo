<template>
    <div class="progress-bar">
        <div class="progress" :style="progressStyle">
            <!-- <span class="progress-text">{{ progress }}%</span> -->
        </div>
    </div>
</template>

<script>
export default {
    name: 'ProgressBar',
    props: {
        progress: {
            type: Number,
            required: true,
            validator(value) {
                return value >= 0 && value <= 100;
            }
        },
        color: {
            type: String,
            default: '#4caf50' // Màu mặc định là màu xanh lá
        }
    },
    computed: {
        progressStyle() {
            return {
                width: `${this.progress}%`,
                backgroundColor: this.color
            };
        }
    }
};
</script>

<style scoped>
.progress-bar {
    width: 100%;
    background-color: #f3f3f3;
    border-radius: 5px;
    height: 4px;
    margin-top: 10px;
}

.progress {
    height: 100%;
    text-align: center;
    line-height: 20px;
    color: white;
    border-radius: 5px;
    font-size: 14px;
}

.progress-text {
    position: absolute;
    width: 100%;
    text-align: center;
    color: white;
    font-weight: bold;
}
</style>