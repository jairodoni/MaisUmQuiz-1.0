import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import Widget from "../../components/Widget";
import LoadingWidget from "../../components/LoadingWidget";
import QuizLogo from "../../components/QuizLogo";
import QuizBackground from "../../components/QuizBackground";
import QuizContainer from "../../components/QuizContainer";
import AlternativeForm from "../../components/AlternativeForm";
import Button from "../../components/Button";
import BackLinkArrow from "../../components/BackLinkArrow";


function ResultWidget({ results }) {
  const router = useRouter();
  function navigateToHome(){
    router.push(`/`);
  }
  return (
    <Widget>
      <Widget.Header>
        <BackLinkArrow href="/" />
          Seus Resultados:
      </Widget.Header>

      <Widget.Content>
        <p>
          Você acertou {results.filter((x) => x).length} perguntas
  
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

function QuestionWidget({ screenState, setScreenState, addResult, outQuestions  }) {
  const [selectedAlternative, setSelectedAlternative] = useState(undefined);
  const [isQuestionSubmited, setIsQuestionSubmited] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const questionIndex = currentQuestion;
  const question = outQuestions[questionIndex];
  const totalQuestions = outQuestions.length;
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
          Pergunta {`${questionIndex + 1}`} de {` ${outQuestions.length} `}
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
      </Widget.Content>
    </Widget>
  );
}

const screenStates = {
  QUIZ: "QUIZ",
  LOADING: "LOADING",
  RESULT: "RESULT",
};

export default function QuizPage({db, externalQuestions, externalBg }) {
  const [screenState, setScreenState] = useState(screenStates.LOADING);
  const [results, setResults] = useState([]);
  const bg = externalBg;
  const outQuestions = externalQuestions;
  // const teste = db.map((dados) => {
  //   return dados;
  // });
  // console.log(...props.dbExterno)

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
    <QuizBackground backgroundImage={bg}>
      <QuizContainer>
        <QuizLogo fill="#f1f1f1" />
        {screenState === screenStates.QUIZ && (
          <QuestionWidget
            setScreenState={setScreenState}
            screenState={screenState}
            addResult={addResult}
            outQuestions={outQuestions}
          />
        )}

        {screenState === screenStates.LOADING && <LoadingWidget />}

        {screenState === screenStates.RESULT && <ResultWidget results={results}/>}
      </QuizContainer>
    </QuizBackground>
  );
}
