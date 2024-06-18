<main>
    <h1>Loading</h1>
</main>

<div id="loader"></div>

<style>
    main {
        background-color: var(--dark-bg);
        color: var(--dark-yellow);
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 1;
    }

    h1 {
        font-size: 16vh;
        position: absolute;
        top: 50vh;
        left: 8vw;
        transform: translateY(-50%);
    }

    #loader {
        position: absolute;
        left: 55.5vw;
        top: 48vh;
        border: 4vh solid var(--light-bg);
        border-top: 4vh solid var(--yellow);
        border-radius: 50%;
        width: 20vh;
        height: 20vh;
        animation: spin 1s cubic-bezier(0.445, 0.05, 0.55, 0.95) infinite;
        z-index: 2;
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(720deg);
        }
    }
</style>
