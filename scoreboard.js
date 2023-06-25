const timer = document.getElementById("timer");
timer.innerText = "00:00";
const team1 = document.getElementById("team1");
team1.innerText = "0";
const team2 = document.getElementById("team2");
team2.innerText = "0";
let team1Score = 0;
let team2Score = 0;
document.addEventListener("keypress", (e) => {});
document.addEventListener("keypress", (e) => {
  switch (e.key) {
    case "-":
      if (team2Score > 0) {
        team2Score--;
      }
      break;
    case "+":
      team2Score++;
      break;
    case "a":
      team1Score++;
      break;
    case "s":
      if (team1Score > 0) {
        team1Score--;
      }
      break;
  }
  team1.innerText = team1Score;
  team2.innerText = team2Score;
});
