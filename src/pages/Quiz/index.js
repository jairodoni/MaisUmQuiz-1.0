import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import db from "../../../db.json";
import Widget from "../../components/Widget";
import LoadingWidget from "../../components/LoadingWidget";
import QuizLogo from "../../components/QuizLogo";
import QuizBackground from "../../components/QuizBackground";
import QuizContainer from "../../components/QuizContainer";
import AlternativeForm from "../../components/AlternativeForm";
import Button from "../../components/Button";

function ResultWidget({ results }) {
  const router = useRouter();
  const points = results.filter((x) => x).length;
  let gif = db.result04.image;
  let description = db.result01.description;
  if(points > 0 && points < 6){
    gif = db.result02.image;
    description = db.result02.description;
  }
  if(points >= 6 && points <= 9){
    gif = db.result03.image;
    description = db.result03.description;
  }
  if(points === 10){
    gif = db.result04.image;
    description = db.result04.description;
  }

  function navigateToHome(){
    router.push(`/`);
  }

  return (
    <Widget>
      <Widget.Header>
          Seus Resultados:
      </Widget.Header>
      <img
        alt="Descrição"
        style={{
          width: "100%",
          height: "150px",
          objectFit: "cover",
        }}
        src={gif}
      />
      <Widget.Content>
        <p>
          Você acertou {points} perguntas
        </p>
        <p>
          {description}
        </p>
        <ul>
          {results.map((result, index) => (
              <li>
                #
                {index + 1}
                {' '}
                Resultado:
                {result === true ? 'Acertou' : 'Errou'}
              </li>
            ))
          }
        </ul>
        <Button onClick={navigateToHome} type="button">Voltar</Button>
      </Widget.Content>
    </Widget>
  );
}

function QuestionWidget({ screenState, setScreenState, addResult }) {
  const [selectedAlternative, setSelectedAlternative] = useState(undefined);
  const [isQuestionSubmited, setIsQuestionSubmited] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const totalQuestions = db.questions.length;
  const questionIndex = currentQuestion;
  const question = db.questions[questionIndex];
  const isCorrect = selectedAlternative === question.answer;
  const questionId = `question_${questionIndex}`;

  function handleSubmit(e) {
    e.preventDefault();
    setIsQuestionSubmited(true);
    
    setTimeout(() => {
      addResult(isCorrect);
      setIsQuestionSubmited(false);
      setSelectedAlternative(undefined);

      const nextQuestion = questionIndex + 1;
      if (nextQuestion < totalQuestions) {
        setCurrentQuestion(nextQuestion);
      } else {
        setScreenState(screenStates.RESULT);
      }
    }, 2 * 1000);
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
        <h2>
          {question.title}
        </h2>
        <p>
          {question.description}
        </p>

        <AlternativeForm onSubmit={handleSubmit}>
          {question.alternatives.map((alternative, alternativeIndex) => {
            const alternativeId = `alternative_${alternativeIndex}`;
            const alternativeStatus = isCorrect ? 'SUCCESS' : 'ERROR';
            const isSelected = selectedAlternative === alternativeIndex;
            let optionCorrect = false;

            if(alternativeIndex === question.answer && isQuestionSubmited){
              optionCorrect = true;
            }

            return (
              <Widget.Topic 
                as="label" 
                key={alternativeId}
                htmlFor={alternativeId}
                data-selected={isSelected}
                data-correct={optionCorrect}
                data-status={isQuestionSubmited && alternativeStatus}
              >
                <input 
                  style={{display: 'none'}}
                  id={alternativeId} 
                  name={questionId}
                  onChange={() => setSelectedAlternative(alternativeIndex)}
                  type="radio" 
                />
                {alternative}
              </Widget.Topic>
            );
          })}
          <Button type="submit" disabled={ selectedAlternative === undefined }>Confirmar</Button>
          {isQuestionSubmited && isCorrect && <p>VOCÊ ACERTOU!!!</p>}
          {isQuestionSubmited && !isCorrect && <p>VOCÊ ERROU :(</p>}
          
        </AlternativeForm>
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
  const [results, setResults] = useState([]);
  

  useEffect(() => {
    setTimeout(() => {
      setScreenState(screenStates.QUIZ);
    }, 1 * 1000);
  }, []);
  
  function addResult(result) {
    setResults([
      ...results,
      result
    ]);
  }

  return (
    <QuizBackground backgroundImage={db.bg}>
      <QuizContainer>
        <QuizLogo fill="#18DAF5" />
        {screenState === screenStates.QUIZ && (
          <QuestionWidget
            setScreenState={setScreenState}
            screenState={screenState}
            addResult={addResult}
            setResults={setResults}
          />
        )}

        {screenState === screenStates.LOADING && <LoadingWidget />}

        {screenState === screenStates.RESULT && <ResultWidget results={results}/>}
      </QuizContainer>
    </QuizBackground>
  );
}
