import React, { useEffect, useState } from "react";
import db from "../db.json";
import Widget from "../src/components/Widget";
import QuizLogo from "../src/components/QuizLogo";
import QuizBackground from "../src/components/QuizBackground";
import QuizContainer from "../src/components/QuizContainer";
import Button from "../src/components/Button";

function LoadingWidget() {
  return (
    <Widget>
      <Widget.Header>Carregando...</Widget.Header>

      <Widget.Content>[Desafio Loading]</Widget.Content>
    </Widget>
  );
}

function QuestionWidget({ question, totalQuestions, questionIndex }) {
  const questionId = `question_${questionIndex}`;
  
  function handleSubmit(e){
    e.preventDefault();
    if(nextQuestion <= totalQuestions){
      setCurrentQuestion(questionIndex + 1);
    }else{
      setScreenState(screenStates.RESULT);
    }
  }

  return (
    <Widget>
      <Widget.Header>
        <h3>
          Pergunta {`${questionIndex + 1}`} de {` ${db.questions.length} `}
        </h3>
      </Widget.Header>

      <img
        alt="Descrição"
        style={{
          width: "100%",
          height: "150px",
          objectFit: "cover",
        }}
        src={question.image}
      />
      <Widget.Content>
        <h2>{question.title}</h2>
        <p>{question.description}</p>
        <form onSubmit={handleSubmit}>
          {question.alternatives.map((alternative, alternativeIndex) => {
            const alternativeId = `alternative_${alternativeIndex}`;
            return (
              <Widget.Topic as="label" htmlFor="alternativeId">
                <input id={alternativeId} name={questionId} type="radio" />
                {alternative}
              </Widget.Topic>
            );
          })}
        </form>

        {/* <pre>
          {JSON.stringify(question, null, 4)}
        </pre> */}
        <Button type="submit">Confirmar</Button>
      </Widget.Content>
    </Widget>
  );
}

const screenStates = {
  QUIZ: "QUIZ",
  LOADING: "LOADING",
  RESULT: "RESULT",
};

export default function QuizPage() {
  const [screenState, setScreenState] = useState(screenStates.LOADING);
  const totalQuestions = db.questions.length;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const questionIndex = currentQuestion;
  const question = db.questions[questionIndex];

  useEffect(()=> {
    setTimeout(() =>{
      setScreenState(screenStates.QUIZ)
    }, 1 * 1000)
  }, [])



  return (
    <QuizBackground backgroundImage={db.bg}>
      <QuizContainer>
        <QuizLogo />
        {screenState === screenStates.QUIZ && (
          <QuestionWidget
            question={question}
            questionIndex={questionIndex}
            totalQuestions={totalQuestions}
          />
        )}

        {screenState === screenStates.LOADING && <LoadingWidget />}

        {screenState === screenStates.RESULT && (
          <div>Você acertou X questões, parabens!</div>
        )}
      </QuizContainer>
    </QuizBackground>
  );
}
