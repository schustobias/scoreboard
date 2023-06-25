let settings;
let scoreboard;
let elements;
function init() {
  elements = {
    settings: {
      showGlobal: document.getElementById("show-global"),
      showScoreboard: document.getElementById("show-scoreboard"),
      score: {
        show: document.getElementById("show-score"),
        team1: {
          name: document.getElementById("name-team1"),
          score: document.getElementById("score-team1"),
          show: document.getElementById("show-team1"),
          reset: document.getElementById("reset-score-team1"),
          add: document.getElementById("add-team1"),
          sub: document.getElementById("sub-team1"),
        },
        team2: {
          name: document.getElementById("name-team2"),
          score: document.getElementById("score-team2"),
          show: document.getElementById("show-team2"),
          reset: document.getElementById("reset-score-team2"),
          add: document.getElementById("add-team2"),
          sub: document.getElementById("sub-team2"),
        },
      },
      timer: {
        show: document.getElementById("show-timer"),
        seconds: document.getElementById("timer-value-seconds"),
        minutes: document.getElementById("timer-value-minutes"),
        reset: document.getElementById("reset-timer"),
        toggle: document.getElementById("toggle-timer"),
      },
    },
    scoreboard: {},
  };
  settings = {
    show: true,
    score: {
      show: true,
      team1: {
        name: "Team1",
        score: 0,
        show: true,
      },
      team2: {
        name: "Team2",
        score: 0,
        show: true,
      },
    },
    timer: {
      show: true,
      seconds: 0,
      startMillis: 0,
      timeoutHandle: null,
    },
  };
  scoreboard = null;
  // openScoreboard();
  window.onbeforeunload = function () {
    return "Hey, you're leaving the site. Bye!";
  };
  initCallbacks();
  applyEverything();
}
function openScoreboard() {
  if (!scoreboard) {
    scoreboard = window.open("scoreboard.html", "_blank", "popup=true");
    scoreboard.addEventListener(
      "load",
      () => {
        scoreboard.document = scoreboard.document;
        elements.scoreboard = {
          wrapperGlobal: scoreboard.document.getElementById("wrapper-global"),
          team1: {
            wrapper: scoreboard.document.getElementById("wrapper-team1"),
            name: scoreboard.document.getElementById("labelTeam1"),
            score: scoreboard.document.getElementById("team1"),
          },
          team2: {
            wrapper: scoreboard.document.getElementById("wrapper-team2"),
            name: scoreboard.document.getElementById("labelTeam2"),
            score: scoreboard.document.getElementById("team2"),
          },
          timer: {
            wrapper: scoreboard.document.getElementById("wrapper-timer"),
            timer: scoreboard.document.getElementById("timer"),
          },
        };
        applyEverything();
      },
      true
    );
    scoreboard.onbeforeunload = function () {
      scoreboard = null;
      applyGlobal();
    };
    window.onbeforeunload = function () {
      scoreboard.close();
      return "Hey, you're leaving the site. Bye!";
    };
  } else {
    scoreboard.focus();
  }
}
function applyEverything() {
  applyScoreboard();
  applyTimer();
  applyGlobal();
}
function applyGlobal() {
  applyGlobalSettings();
  if (scoreboard && scoreboard.document) {
    applyGlobalScoreboard();
  }
}
function applyGlobalScoreboard() {
  elements.scoreboard.wrapperGlobal.hidden = !settings.show;
}
function applyGlobalSettings() {
  elements.settings.showGlobal.checked = settings.show;
}
function applyScoreboard() {
  applyScoreboardSettings();
  if (scoreboard && scoreboard.document) {
    applyScoreboardScoreboard();
  }
}
function applyScoreboardScoreboard() {
  for (const team of ["team1", "team2"]) {
    elements.scoreboard[team].name.innerText = settings.score[team].name;
    elements.scoreboard[team].score.innerText = settings.score[team].score;
    elements.scoreboard[team].wrapper.hidden = !(
      settings.score.show && settings.score[team].show
    );
  }
}
function applyScoreboardSettings() {
  elements.settings.score.show.checked = settings.score.show;
  for (const team of ["team1", "team2"]) {
    elements.settings.score[team].show.checked = settings.score[team].show;
    elements.settings.score[team].name.value = settings.score[team].name;
    elements.settings.score[team].score.value = settings.score[team].score;
  }
}
function applyTimer() {
  applyTimerSettings();
  if (scoreboard && scoreboard.document) {
    applyTimerScoreboard();
  }
}
function applyTimerScoreboard() {
  elements.scoreboard.timer.wrapper.hidden = !settings.timer.show;
  const secondsString = String(settings.timer.seconds % 60).padStart(2, "0");
  const minutesString = String(
    Math.floor(settings.timer.seconds / 60)
  ).padStart(2, "0");
  elements.scoreboard.timer.timer.innerText = `${minutesString}:${secondsString}`;
}
function applyTimerSettings() {
  elements.settings.timer.show.checked = settings.timer.show;
  elements.settings.timer.seconds.value = settings.timer.seconds % 60;
  elements.settings.timer.minutes.value = Math.floor(
    settings.timer.seconds / 60
  );
  elements.settings.timer.minutes.disabled =
    settings.timer.timeoutHandle !== null;
  elements.settings.timer.seconds.disabled =
    settings.timer.timeoutHandle !== null;
  elements.settings.timer.toggle.innerText =
    settings.timer.timeoutHandle === null ? "start" : "stop";
  elements.settings.timer.reset.disabled =
    settings.timer.timeoutHandle !== null;
}
function startTimer() {
  const now = new Date();
  settings.timer.startMillis = now.getMilliseconds();
  timerCallback(false);
}

function stopTimer() {
  if (settings.timer.timeoutHandle) {
    try {
      clearTimeout(settings.timer.timeoutHandle);
    } catch (e) {
      console.error(e);
    }
  }
  settings.timer.timeoutHandle = null;
  applyTimer();
}

function timerCallback(decrease = true) {
  if (
    settings.timer.seconds <= 0 ||
    (decrease && settings.timer.seconds === 1)
  ) {
    settings.timer.seconds = 0;
    stopTimer();
    return;
  }
  if (decrease) {
    settings.timer.seconds--;
  }
  const now = new Date();
  const milliSecondsNow = now.getMilliseconds();
  let targetMilliseconds = settings.timer.startMillis;
  if (milliSecondsNow >= targetMilliseconds) {
    targetMilliseconds += 1e3;
  }
  const deltaMilliseconds = targetMilliseconds - milliSecondsNow;
  settings.timer.timeoutHandle = setTimeout(timerCallback, deltaMilliseconds);
  applyTimer();
}

function initCallbacks() {
  elements.settings.showGlobal.addEventListener("click", (e) => {
    settings.show = !settings.show;
    applyGlobal();
  });
  elements.settings.showScoreboard.addEventListener("click", (e) => {
    openScoreboard();
  });

  elements.settings.score.show.addEventListener("click", (e) => {
    settings.score.show = !settings.score.show;
    applyScoreboard();
  });
  for (const team of ["team1", "team2"]) {
    elements.settings.score[team].show.addEventListener("click", (e) => {
      settings.score[team].show = !settings.score[team].show;
      applyScoreboard();
    });
    elements.settings.score[team].name.addEventListener("change", (e) => {
      const newValue = e.target.value;
      if (newValue !== "") {
        settings.score[team].name = newValue;
      }
      applyScoreboard();
    });
    elements.settings.score[team].score.addEventListener("change", (e) => {
      const newValue = Number.parseInt(e.target.value);
      if (Number.isInteger(newValue)) {
        settings.score[team].score = newValue;
      }
      applyScoreboard();
    });
    elements.settings.score[team].reset.addEventListener("click", (e) => {
      settings.score[team].score = 0;
      applyScoreboard();
    });
    elements.settings.score[team].add.addEventListener("click", (e) => {
      settings.score[team].score++;
      applyScoreboard();
    });
    elements.settings.score[team].sub.addEventListener("click", (e) => {
      settings.score[team].score--;
      applyScoreboard();
    });
  }
  elements.settings.timer.show.addEventListener("click", (e) => {
    settings.timer.show = !settings.timer.show;
    applyTimer();
  });
  const handleTimerChange = (e) => {
    const minutesInput = Number.parseInt(elements.settings.timer.minutes.value);
    const secondsInput = Number.parseInt(elements.settings.timer.seconds.value);
    let minutes = Math.floor(settings.timer.seconds / 60);
    let seconds = settings.timer.seconds % 60;
    if (Number.isInteger(minutesInput) && minutesInput >= 0) {
      minutes = minutesInput;
    }
    if (Number.isInteger(secondsInput) && secondsInput >= 0) {
      seconds = secondsInput;
    }
    settings.timer.seconds = minutes * 60 + seconds;
    applyTimer();
  };
  elements.settings.timer.minutes.addEventListener("change", handleTimerChange);
  elements.settings.timer.seconds.addEventListener("change", handleTimerChange);
  elements.settings.timer.reset.addEventListener("click", (e) => {
    settings.timer.seconds = 0;
    applyTimer();
  });
  elements.settings.timer.toggle.addEventListener("click", (e) => {
    if (settings.timer.timeoutHandle) {
      stopTimer();
      return;
    }
    startTimer();
  });
}

init();
