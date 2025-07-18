function right(questionNumber) {
  document.getElementById("result" + questionNumber).innerText = "✅ Correct!";
  document.getElementById("result" + questionNumber).style.color = "green";
}

function wrong(questionNumber) {
  document.getElementById("result" + questionNumber).innerText =
    "❌ Incorrect! Try again.";
  document.getElementById("result" + questionNumber).style.color = "red";
}

    // Correct answers for each question
    const correctAnswers = {
        1: 'A',
        2: 'A',
        3: 'A',
        4: 'A',
        5: 'B',
        6: 'C',
        7: 'A',
        8: 'D',
        9: 'A',
        10: 'B'
    };

    function checkAnswer(questionNumber, selectedOption) {
        const resultElement = document.getElementById(`result${questionNumber}`);
        
        if (selectedOption === correctAnswers[questionNumber]) {
            resultElement.textContent = "Correct!";
            resultElement.className = "result correct";
        } else {
            resultElement.textContent = "Incorrect!";
            resultElement.className = "result incorrect";
        }
    }