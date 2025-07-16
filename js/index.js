function right(questionNumber) {
  document.getElementById("result" + questionNumber).innerText = "✅ Correct!";
  document.getElementById("result" + questionNumber).style.color = "green";
}

function wrong(questionNumber) {
  document.getElementById("result" + questionNumber).innerText =
    "❌ Incorrect! Try again.";
  document.getElementById("result" + questionNumber).style.color = "red";
}
