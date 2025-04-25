<template>
    <div className="loading-container">
        <div className="loader">
            <span className="circel"></span>
            <span className="hour"></span>
            <span className="min"></span>
        </div>
    </div>
</template>
<style scoped lang="scss">
.loading-container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    background: rgba(255, 255, 255, 0.6);
    /* Tạo nền mờ */
    z-index: 9999;
}

.loader {
    width: 65px;
    height: 65px;
    border: 8px solid var(--primary__color);
    border-radius: 50%;
    position: relative;
}

.loader span {
    display: block;
    background: #ee9b00;
}

.loader .hour,
.loader .min {
    width: 6px;
    height: 22px;
    border-radius: 50%;
    position: absolute;
    top: 24.5px;
    left: 21px;
    animation: load9243 1.2s linear infinite;
    transform-origin: top center;
}

.loader .min {
    height: 17px;
    animation: load9243 4s linear infinite;
}

.loader .circel {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    position: absolute;
    top: 19px;
    left: 19px;
    background: #ee9b00;
}

@keyframes load9243 {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
