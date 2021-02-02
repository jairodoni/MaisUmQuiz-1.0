import React, { useEffect, useState } from "react";
import db from "../../db.json";
import Widget from "../../src/components/Widget";
import QuizLogo from "../../src/components/QuizLogo";
import QuizBackground from "../../src/components/QuizBackground";
import QuizContainer from "../../src/components/QuizContainer";
import AlternativeForm from "../../src/components/AlternativeForm";
import Button from "../../src/components/Button";
import { motion } from 'framer-motion';

const loaderVariants = {
  animationOne: {
    x: [-120, 120],
    
    transition: {
      yoyo: Infinity,
      duration: 1
    },
    y:{
      yoyo: Infinity,
      duration: 1
    }
  }
}

function LoadingWidget() {
  return (
    <Widget>
      <Widget.Header>Carregando...</Widget.Header>

      <Widget.Content 
        as={motion.div}
        variants={loaderVariants}
        animate="animationOne"
      >
       <Widget.Load/>
       
      </Widget.Content>
    </Widget>
  );
}
function ResultWidget({ results }) {
  return (
    <Widget>
      <Widget.Header>
          Seus Resultados:
      </Widget.Header>

      <Widget.Content>
        <p>
          Você acertou {results.filter((x) => x).length} perguntas
          
          {/* {results.reduce((somatoriaAtual, resultAtual) => {
            const isAcerto = resultAtual === true;
            if(isAcerto) {
              return somatoriaAtual + 1;
            }
            return somatoriaAtual;
          }, 0)}  */}
      
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
    addResult(isCorrect);
    setTimeout(() => {

      const nextQuestion = questionIndex + 1;
      if (nextQuestion < totalQuestions) {
        setCurrentQuestion(nextQuestion);
      } else {
        setScreenState(screenStates.RESULT);
      }
      setIsQuestionSubmited(false);
      setSelectedAlternative(undefined);

    }, 1000);
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
            return (
              <Widget.Topic 
                as="label" 
                key={alternativeId}
                htmlFor={alternativeId}
                data-selected={isSelected}
                data-status={isQuestionSubmited && alternativeStatus}
              >
                <input 
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
          {isQuestionSubmited && isCorrect && <p>Você acertou!</p>}
          {isQuestionSubmited && !isCorrect && <p>Você errou!</p>}
          
        </AlternativeForm>

        {/* <pre>
          {JSON.stringify(question, null, 4)}
        </pre> */}
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
        <QuizLogo />
        {screenState === screenStates.QUIZ && (
          <QuestionWidget
            setScreenState={setScreenState}
            screenState={screenState}
            addResult={addResult}
          />
        )}

        {screenState === screenStates.LOADING && <LoadingWidget />}

        {screenState === screenStates.RESULT && <ResultWidget results={results}/>}
      </QuizContainer>
    </QuizBackground>
  );
}
