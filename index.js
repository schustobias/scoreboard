let settings;
let scoreboardDocument;
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
      timeoutHandle: null,
    },
  };
  // openScoreboard();
  // window.onbeforeunload = function () {
  //   return "Hey, you're leaving the site. Bye!";
  // };
  initCallbacks();
}
function openScoreboard() {
  const scoreboard = window.open("scoreboard.html", "_blank", "popup=true");
  scoreboard.addEventListener(
    "load",
    () => {
      scoreboardDocument = scoreboard.document;
      console.log(scoreboardDocument);
      elements.scoreboard = {
        wrapperGlobal: scoreboardDocument.getElementById("wrapper-global"),
        team1: {
          wrapper: scoreboardDocument.getElementById("wrapper-team1"),
          name: scoreboardDocument.getElementById("labelTeam1"),
          score: scoreboardDocument.getElementById("team1"),
        },
        team2: {
          wrapper: scoreboardDocument.getElementById("wrapper-team2"),
          name: scoreboardDocument.getElementById("labelTeam2"),
          score: scoreboardDocument.getElementById("team2"),
        },
        timer: {
          wrapper: scoreboardDocument.getElementById("wrapper-timer"),
          timer: scoreboardDocument.getElementById("timer"),
        },
      };
      applyEverything();
    },
    true
  );
}
function applyEverything() {
  applyScoreboard();
  applyTimer();
  applyGlobal();
}
function applyGlobal() {
  applyGlobalSettings();
  applyGlobalScoreboard();
}
function applyGlobalScoreboard() {
  elements.scoreboard.wrapperGlobal.hidden = !settings.show;
}
function applyGlobalSettings() {
  elements.settings.showGlobal.checked = settings.show;
}
function applyScoreboard() {
  applyScoreboardSettings();
  applyScoreboardScoreboard();
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
}

function initCallbacks() {
  elements.settings.showGlobal.addEventListener("click", (e) => {
    console.log("show");
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
}

init();
