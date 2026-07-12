/* =========================================================
   NEURODREAM - COMPLETE SCRIPT.JS
   ========================================================= */


/* =========================================================
   1. GET HTML ELEMENTS
   ========================================================= */

const therapyScreen = document.getElementById("therapyScreen");
const therapyBackground = document.getElementById("therapyBackground");
const therapyTitle = document.getElementById("therapyTitle");
const dashboard = document.getElementById("dashboard");
const timer = document.getElementById("timer");

const brightnessSlider = document.getElementById("brightnessSlider");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const exitBtn = document.getElementById("exitBtn");

const particles = document.getElementById("particles");
const glowLayer = document.getElementById("glowLayer");

const therapyAudio = document.getElementById("therapyAudio");
const audioToggleBtn = document.getElementById("audioToggleBtn");
const volumeSlider = document.getElementById("volumeSlider");


/* =========================================================
   2. THERAPY DATA
   ========================================================= */

const therapies = {

    sleep: {
        title: "😴 Deep Sleep Therapy",
        image: "images/sleep.jpg",
        audio: "sounds/sleep.mp3",
        glow: "rgba(255, 35, 35, 0.65)",
        particleColor: "rgba(255, 70, 70, 0.75)"
    },

    forest: {
        title: "🌲 Forest Serenity",
        image: "images/forest.jpg",
        audio: "sounds/forest.mp3",
        glow: "rgba(0, 255, 120, 0.55)",
        particleColor: "rgba(80, 255, 150, 0.75)"
    },

    blue: {
        title: "🔵 Blue Serenity",
        image: "images/relax.jpg",
        audio: "sounds/relax.mp3",
        glow: "rgba(0, 150, 255, 0.60)",
        particleColor: "rgba(70, 180, 255, 0.75)"
    },

    amber: {
        title: "🟠 Amber Aura",
        image: "images/amber.jpg",
        audio: "sounds/amber.mp3",
        glow: "rgba(255, 160, 20, 0.65)",
        particleColor: "rgba(255, 190, 70, 0.80)"
    }

};


/* =========================================================
   3. VARIABLES
   ========================================================= */

let seconds = 0;
let timerInterval = null;
let hideTimer = null;

let currentBrightness = 100;
let currentTherapy = null;

/* =========================================================
   4. START THERAPY
   ========================================================= */

async function startTherapy(type) {

    const selected = therapies[type];

    if (!selected) {
        console.error("Therapy not found:", type);
        return;
    }

    /* SAVE CURRENT THERAPY */
    currentTherapy = type;

    /* SHOW THERAPY SCREEN */
    therapyScreen.style.display = "block";
    document.body.style.overflow = "hidden";

    /* SET TITLE */
    therapyTitle.textContent = selected.title;

    /* SET BACKGROUND */
    therapyBackground.style.backgroundImage =
        `url("${selected.image}")`;

    therapyBackground.style.backgroundSize = "cover";
    therapyBackground.style.backgroundPosition = "center";
    therapyBackground.style.backgroundRepeat = "no-repeat";

    /* SET GLOW */
    glowLayer.style.background = `
        radial-gradient(
            circle at center,
            ${selected.glow} 0%,
            rgba(255,255,255,0.08) 28%,
            transparent 68%
        )
    `;

    /* CREATE PARTICLES */
    createParticles(selected.particleColor);

    /* RESET BRIGHTNESS */
    brightnessSlider.value = 100;
    currentBrightness = 100;
    updateBrightness();

    /* START TIMER */
    startTimer();

    /* =====================================================
       AUDIO - DIRECT PLAY
       ===================================================== */

    try {

        /* STOP OLD AUDIO */
        therapyAudio.pause();

        /* IMPORTANT:
           Directly assign the selected audio file.
        */
        therapyAudio.src = selected.audio;

        therapyAudio.loop = true;
        therapyAudio.muted = false;

        /* VOLUME */
        therapyAudio.volume =
            Number(volumeSlider.value) / 100;

        /* START FROM BEGINNING */
        therapyAudio.currentTime = 0;

        /* LOAD AUDIO */
        therapyAudio.load();

        console.log(
            "Audio source set:",
            therapyAudio.src
        );

        /* DIRECTLY PLAY */
        await therapyAudio.play();

        console.log(
            "AUDIO STARTED SUCCESSFULLY"
        );

        console.log({
            source: therapyAudio.currentSrc,
            paused: therapyAudio.paused,
            muted: therapyAudio.muted,
            volume: therapyAudio.volume
        });

        /* UPDATE BUTTON */
        audioToggleBtn.textContent =
            "⏸ Pause Audio";

    }

    catch (error) {

        console.error(
            "AUTOPLAY FAILED:",
            error
        );

        /*
        If browser blocks automatic playback,
        user can press this button.
        */

        audioToggleBtn.textContent =
            "▶ Play Audio";

    }

    /* SHOW DASHBOARD */
    showDashboard();
}

/* =========================================================
   5. SESSION TIMER
   ========================================================= */

function startTimer() {

    clearInterval(timerInterval);

    seconds = 0;

    timer.textContent = "00:00";


    timerInterval = setInterval(() => {

        seconds++;


        const minutes = String(

            Math.floor(
                seconds / 60
            )

        ).padStart(
            2,
            "0"
        );


        const remainingSeconds = String(

            seconds % 60

        ).padStart(
            2,
            "0"
        );


        timer.textContent =

            `${minutes}:${remainingSeconds}`;


    }, 1000);

}


/* =========================================================
   6. BRIGHTNESS CONTROL
   ========================================================= */

function updateBrightness() {

    const brightnessValue =

        currentBrightness / 100;


    therapyBackground.style.filter = `

        brightness(${brightnessValue})

        saturate(1.45)

        contrast(1.08)

    `;

}


/* BRIGHTNESS SLIDER */

brightnessSlider.addEventListener(

    "input",

    () => {

        currentBrightness =

            Number(
                brightnessSlider.value
            );


        updateBrightness();

    }

);

/* =========================================================
   7. AUDIO PLAY / PAUSE BUTTON - FIXED
   ========================================================= */

audioToggleBtn.addEventListener("click", async function(event) {

    event.preventDefault();
    event.stopPropagation();

    console.log("AUDIO BUTTON CLICKED");

    /* Get currently selected therapy */
    if (!currentTherapy || !therapies[currentTherapy]) {
        console.error("No therapy selected");
        return;
    }

    const selected = therapies[currentTherapy];

    /* If source is missing, set it again */
    if (!therapyAudio.getAttribute("src")) {

        console.log("Audio source missing. Setting again...");

        therapyAudio.src = selected.audio;
        therapyAudio.loop = true;
        therapyAudio.muted = false;
        therapyAudio.volume = Number(volumeSlider.value) / 100;
        therapyAudio.load();
    }

    /* PLAY */
    if (therapyAudio.paused) {

        try {

            await therapyAudio.play();

            console.log("AUDIO IS NOW PLAYING");

            audioToggleBtn.textContent = "⏸ Pause Audio";

        } catch (error) {

            console.error("PLAY FAILED:", error);

            audioToggleBtn.textContent = "▶ Try Again";

        }

    }

    /* PAUSE */
    else {

        therapyAudio.pause();

        console.log("AUDIO PAUSED");

        audioToggleBtn.textContent = "▶ Play Audio";

    }

});

/* =========================================================
   8. VOLUME CONTROL
   ========================================================= */

volumeSlider.addEventListener(

    "input",

    () => {

        const volumeValue =

            Number(
                volumeSlider.value
            ) / 100;


        therapyAudio.volume =
            volumeValue;


        console.log(
            "Volume:",
            volumeValue
        );

    }

);


/* =========================================================
   9. AUDIO STATE EVENTS
   ========================================================= */


/* AUDIO ACTUALLY STARTED */

therapyAudio.addEventListener(

    "playing",

    () => {

        console.log(
            "AUDIO EVENT: PLAYING"
        );


        audioToggleBtn.textContent =
            "⏸ Pause Audio";

    }

);


/* AUDIO PAUSED */

therapyAudio.addEventListener(

    "pause",

    () => {

        console.log(
            "AUDIO EVENT: PAUSED"
        );


        /*
        Only change button if therapy
        is currently active.
        */

        if (currentTherapy) {

            audioToggleBtn.textContent =
                "▶ Play Audio";

        }

    }

);


/* AUDIO WAITING / BUFFERING */

therapyAudio.addEventListener(

    "waiting",

    () => {

        console.log(
            "AUDIO EVENT: BUFFERING"
        );


        if (currentTherapy) {

            audioToggleBtn.textContent =
                "⏳ Loading Audio...";

        }

    }

);


/* AUDIO READY */

therapyAudio.addEventListener(

    "canplay",

    () => {

        console.log(
            "AUDIO EVENT: CAN PLAY"
        );

    }

);


/* AUDIO ERROR */

therapyAudio.addEventListener(

    "error",

    () => {

        console.error(
            "AUDIO ELEMENT ERROR:",
            therapyAudio.error
        );


        if (currentTherapy) {

            audioToggleBtn.textContent =
                "⚠ Audio Error";

        }

    }

);


/* =========================================================
   10. CREATE PARTICLES
   ========================================================= */

function createParticles(color) {

    particles.innerHTML = "";


    for (
        let i = 0;
        i < 35;
        i++
    ) {

        const particle =

            document.createElement(
                "div"
            );


        const size =

            3 +
            Math.random() * 7;


        particle.style.position =
            "absolute";


        particle.style.width =
            `${size}px`;


        particle.style.height =
            `${size}px`;


        particle.style.borderRadius =
            "50%";


        particle.style.background =
            color;


        particle.style.boxShadow =

            `0 0 ${10 + size}px ${color}`;


        particle.style.left =

            Math.random() * 100 + "%";


        particle.style.top =

            Math.random() * 100 + "%";


        particle.style.opacity =

            0.15 +
            Math.random() * 0.55;


        particle.style.animation =

            `floatParticle ${
                12 +
                Math.random() * 18
            }s linear infinite`;


        particle.style.animationDelay =

            `-${
                Math.random() * 15
            }s`;


        particles.appendChild(
            particle
        );

    }

}


/* =========================================================
   11. PARTICLE ANIMATION
   ========================================================= */

const particleAnimationStyle =

    document.createElement(
        "style"
    );


particleAnimationStyle.innerHTML = `

@keyframes floatParticle {

    0% {

        transform:
            translateY(60px)
            translateX(0px)
            scale(0.7);

    }

    50% {

        transform:
            translateY(-100px)
            translateX(30px)
            scale(1.2);

    }

    100% {

        transform:
            translateY(-260px)
            translateX(-20px)
            scale(0.8);

    }

}

`;


document.head.appendChild(
    particleAnimationStyle
);


/* =========================================================
   12. EXIT THERAPY
   ========================================================= */

exitBtn.addEventListener(

    "click",

    (event) => {

        event.stopPropagation();


        /* STOP TIMER */

        clearInterval(timerInterval);

        seconds = 0;

        timer.textContent = "00:00";


        /* STOP AUDIO */

        therapyAudio.pause();

        therapyAudio.currentTime = 0;


        /* REMOVE AUDIO SOURCE */

        therapyAudio.removeAttribute(
            "src"
        );


        therapyAudio.load();


        /* RESET AUDIO BUTTON */

        audioToggleBtn.textContent =
            "▶ Play Audio";


        /* CLEAR PARTICLES */

        particles.innerHTML = "";


        /* HIDE THERAPY */

        therapyScreen.style.display =
            "none";


        /* RESTORE PAGE SCROLL */

        document.body.style.overflow =
            "auto";


        /* RESET CURRENT THERAPY */

        currentTherapy = null;


        /* CLEAR DASHBOARD TIMER */

        clearTimeout(hideTimer);

    }

);


/* =========================================================
   13. FULLSCREEN
   ========================================================= */

fullscreenBtn.addEventListener(

    "click",

    async () => {

        try {


            /* ENTER FULLSCREEN */

            if (!document.fullscreenElement) {


                if (
                    document.documentElement.requestFullscreen
                ) {

                    await document.documentElement
                        .requestFullscreen();

                }


                /* SAFARI */

                else if (
                    document.documentElement.webkitRequestFullscreen
                ) {

                    document.documentElement
                        .webkitRequestFullscreen();

                }

            }


            /* EXIT FULLSCREEN */

            else {

                if (
                    document.exitFullscreen
                ) {

                    await document.exitFullscreen();

                }

            }

        }


        catch (error) {

            console.error(
                "Fullscreen error:",
                error
            );

        }

    }

);


/* =========================================================
   14. AUTO-HIDE DASHBOARD
   ========================================================= */

function showDashboard() {

    if (
        therapyScreen.style.display !==
        "block"
    ) {

        return;

    }


    /* SHOW DASHBOARD */

    dashboard.style.opacity =
        "1";


    dashboard.style.transform =
        "translateX(0)";


    dashboard.style.pointerEvents =
        "auto";


    /* RESET HIDE TIMER */

    clearTimeout(
        hideTimer
    );


    /* HIDE AFTER 5 SECONDS */

    hideTimer = setTimeout(() => {


        dashboard.style.opacity =
            "0";


        dashboard.style.transform =
            "translateX(-25px)";


        dashboard.style.pointerEvents =
            "none";


    }, 5000);

}


/* =========================================================
   15. SHOW DASHBOARD ON ACTIVITY
   ========================================================= */


/* MOUSE */

therapyScreen.addEventListener(

    "mousemove",

    showDashboard

);


/* CLICK */

therapyScreen.addEventListener(

    "click",

    showDashboard

);


/* MOBILE TOUCH */

therapyScreen.addEventListener(

    "touchstart",

    showDashboard,

    {
        passive: true
    }

);


/* =========================================================
   END OF NEURODREAM SCRIPT
   ========================================================= */