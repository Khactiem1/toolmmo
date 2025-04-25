<template>
    <div class="rating">
        <!-- Vòng lặp qua 5 sao -->
        <span v-for="star in 5" :key="star" class="star"
            :class="{ filled: star <= currentRating, disabled: isReadOnly }" @click="setRating(star)"
            :style="{ cursor: isReadOnly ? 'not-allowed' : 'pointer' }">
            ★
        </span>
    </div>
</template>

<script>
export default {
    props: {
        isReadOnly: {
            type: Boolean,
            default: false, // Mặc định là có thể click
        },
        initialRating: {
            type: Number,
            default: 0, // Giá trị mặc định của rating
        },
    },
    data() {
        return {
            currentRating: this.initialRating, // Lưu trữ giá trị rating hiện tại
        };
    },
    watch: {
        initialRating(newVal) {
            this.currentRating = newVal; // Đồng bộ khi giá trị initialRating thay đổi
        },
    },
    methods: {
        setRating(star) {
            if (!this.isReadOnly) {
                this.currentRating = star; // Cập nhật giá trị rating
                this.$emit('update:initialRating', star); // Phát sự kiện để thông báo tới cha
            }
        },
    },
};
</script>

<style scoped>
.rating {
    display: inline-block;
    font-size: 30px;
    color: #d3d3d3;
    cursor: pointer;
}

.star.filled {
    color: #ffcc00;
}

/* .star.disabled {
    cursor: not-allowed;
    color: #d3d3d3;
} */
</style>
