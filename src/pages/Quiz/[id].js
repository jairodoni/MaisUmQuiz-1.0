import React from 'react';
import { ThemeProvider } from 'styled-components';
import QuizScreen from '../OtherQuiz';

export default function QuizDaGaleraPage({ dbExterno }) {
  return (
    <ThemeProvider theme={dbExterno.theme}>
      <QuizScreen externalDb={dbExterno} externalQuestions={dbExterno.questions} externalBg={dbExterno.bg}/>
    </ThemeProvider>
  );
}

export async function getServerSideProps(context) {
  const [projectName, githubUser] = context.query.id.split('___')
  
  try {
    const dbExterno = await fetch(`https://${projectName}.${githubUser}.vercel.app/api/db`)
    .then((respostaDoServer) =>{
      if(respostaDoServer.ok) {
        return respostaDoServer.json();
      }
      throw new Error('Falha em pegar os dados');
    })
    .then((respostaConvertidaEmObjeto) => respostaConvertidaEmObjeto )
    // .catch((err) => {
    //   let error = status(400).send({ error: 'Erro loading' });
    //   return error;
    // });
    
    return {
      props: {
        dbExterno
      },
    };
  } catch (err) {
    console.log(err);
  }
}
