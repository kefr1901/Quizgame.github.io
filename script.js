class Quiz {
    constructor(name) {

        this.name = name;
        this.questions = [];
        this.correct = 0;
        this.currentQuestion = 0;
        this.howManyQuestions_answer = 0;
        this.count = 0;
        this.point = 0;
    }

    checkboxAnswer() { //kollar om rätt icheckad bix stämmer överrens med rätt svar i min array med correkt index
        
        let answers = Array.from(document.getElementsByClassName("checkboxes"));

        answers = answers.map(function (checkbox) {
            return checkbox.checked
        });

        if (answers.filter(function (answer) {
            return answer == true
        }).length == quiz.questions[quiz.currentQuestion].correct.length) {

            quiz.questions[quiz.currentQuestion].correct.forEach(function (i) {
                if (answers[i]) {

                    quiz.point++

                    document.getElementById("points").innerHTML = "You have " + quiz.point + " points";
                }
            })
        }
    }

    endGame() {
        if (this.currentQuestion + 1 >= this.questions.length) {   //kollar när spelet är slut 
            console.log("DU KLARADE DET");


            document.getElementsByClassName("container")[0].style.display = "none"; //döljer sidan     
            document.getElementById("show-points").style.display = "block"; //tar fram nya sidan som visar slutliga poäng
            
            if(quiz.point == 14){
                document.getElementById("pointsp").innerHTML = "Great work, you got " + quiz.point + " out of 14 points";
            }else{
                document.getElementById("pointsp").innerHTML = "You got:  " + quiz.point + " points";
            }
           
        }
    }
        nextQuestion() {
        this.whichQuestion();
        //tar bort checkade checkboxes inför nästa fråga
        let checkboxes = Array.from(document.getElementsByClassName("checkboxes")); //hämtar hem DOMelemtet av checkboxar och sparar innehållet i en array
        checkboxes.forEach(function(checkbox) {
            if (checkbox.type === "checkbox" && checkbox.checked === true) { //om en checkbox är icheckad så klickar den ut den till nästa fråga
                checkbox.click();
            }

            document.getElementById("question").innerHTML = quiz.questions[quiz.currentQuestion].question;
            document.getElementById("category").innerHTML = "Category: " + quiz.questions[quiz.currentQuestion].category;
            document.getElementById("a1").innerHTML = quiz.questions[quiz.currentQuestion].answers[0];
            document.getElementById("a2").innerHTML = quiz.questions[quiz.currentQuestion].answers[1];
            document.getElementById("a3").innerHTML = quiz.questions[quiz.currentQuestion].answers[2];
            document.getElementById("a4").innerHTML = quiz.questions[quiz.currentQuestion].answers[3];
        })
    }

    whichQuestion() { //håller redo på x av längden frågor
        document.getElementById("progress").innerHTML = "Question " + (this.currentQuestion + 1) + " of " + this.questions.length;
    }

    howManyQuestions() { //frågar hur många frågor användaren vill använda och slicar arreyern med frågor. 
        if (this.howManyQuestions_answer <= this.questions.length) {
            this.questions = this.questions.slice(0, (this.howManyQuestions_answer));

            this.whichQuestion(); //kallar på metoden.
        }
    }

    checkboxDisable() {

        
        let checkboxes = Array.from(document.getElementsByClassName("checkboxes"));

        // kollar vilken som är checkad och 
        checkboxes.forEach(function (checkbox) {
            checkbox.addEventListener("click", function () {
                quiz.count = 0;
                for (let i = 0; i < checkboxes.length; i++) {
                    if (checkboxes[i].type === "checkbox" && checkboxes[i].checked === true) { //loopar igenom alla checkboxar och kollar om dom är checkade
                        quiz.count++;
                    }
                }
                if (quiz.count >= quiz.questions[quiz.currentQuestion].correct.length) { //kollar om räknaren är lika många tal som det finns rätt svar i min correct array 
                    checkboxes.forEach(function (checkbox) {
                        if (!checkbox.checked) { //om dom inte är checkad så blir resterande disabled
                            checkbox.disabled = true;
                        }
                    })
                } else {
                    checkboxes.forEach(function(checkbox) { 
                        checkbox.disabled = false;
                    })
                }

            });
        });
    }
}

class Question { //Lagrar mina frågor i klassen
    constructor(category, question, answers, correct) {

        this.category = category;
        this.question = question;
        this.answers = answers;
        this.correct = correct;
    }
} 

// KÖR SPELET FÖR FÖRSTA GÅNGEN NEDAN

    document.addEventListener("DOMContentLoaded", function (event) { 
    document.getElementById("btn_start").addEventListener("click", function () { //hämtar användarnamn och sparar ner det i en variabel
        let name = document.getElementById("name").value;

    document.getElementById("playername").innerHTML = "Spelare: " + name; //skriver ut inhämtat namn på spelsidan
    quiz.howManyQuestions_answer = document.getElementById("howManyQ").value; //hämtar hem antal frågor användaren valt att spela med
    document.getElementById("startgame").style.display = "none"; 
    document.getElementById("showquestion").style.display = "block";

    if(quiz.howManyQuestions_answer <= 0 || quiz.howManyQuestions_answer > 10){
        alert("You have choosen to few or to many questions, please try again! ")
        document.location.reload() //laddar om sidan om användaren matat in fel inmatning.
    }else{
        quiz.howManyQuestions(); //Kallar på metoden 
        quiz.nextQuestion();    //Kallar på metoden

             }
        })
    })


    let quiz = new Quiz(name); 
    let json = getJSON("http://www.mocky.io/v2/5d99e7763100005d0097da05") //hämtar hem mina jasonfrågor och loopar igenom dem 

    for (let question of json) {
    quiz.questions.push(new Question(question.category, question.question, question.answers, question.correct)); //pushar upp mina frågor från jasonfilen
    }


    document.getElementById("next-btn").addEventListener("click", function () { //lyssnar på när användaren klickar på next och kör mina metoder då

        quiz.checkboxAnswer();
        quiz.checkboxDisable();
        quiz.endGame();
        quiz.currentQuestion++;
        quiz.nextQuestion();

    })







