import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import dbInternal from '../../../db.json';
import Widget from '../../components/Widget';
import Link from '../../components/Link';
import QuizLogo from '../../components/QuizLogo'
import QuizBackground from '../../components/QuizBackground';
import GitHubCorner from '../../components/GitHubCorner';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { motion } from 'framer-motion';
// import { Link, animateScroll as scroll } from "react-scroll";
import Scroll from 'react-scroll';
let Element = Scroll.Element;


export const QuizContainer = styled.div`
  width: 100%;
  max-width: 350px;
  padding-top: 45px;
  margin: auto 10%;
  @media screen and (max-width: 500px) {
    margin: auto;
    padding: 15px;
  }
`;

export default function Home({ externalDb, externalBg }) {
  const bg = externalBg;
  const db = externalDb;
  const router = useRouter();
  const [name, setName] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    router.push(`/OtherQuiz?name=${name}`, db);
  }

  return (
    <QuizBackground backgroundImage={bg}>
      <QuizContainer>
        <QuizLogo fill="#F1F1F1"/>
        <Widget
          as={motion.section}
          transition={{ delay: 0, duration: 0.5 }}
          variants={{
            show: {opacity: 1, y: '0'  },
            hidden: { opacity: 0, y: '100%' },
          }}
          initial="hidden"
          animate="show"
        >
          <Widget.Header>
            <h1>{db.title}</h1>
          </Widget.Header>
          <Widget.Content>
            <p>{db.description}</p>
            <form db={db} onSubmit={handleSubmit}>

              <Input
                id="name"
                name="name"
                placeholder="Digite seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <Button
                type="submit"
                disabled={name.length === 0}
              >
                {`Jogar ${name}`}
              </Button>
            </form>
          </Widget.Content>
        </Widget>

        <Widget
          as={motion.section}
          transition={{ delay: 0.3, duration: 0.5 }}
          variants={{
            show: {opacity: 1 },
            hidden: { opacity: 0 },
          }}
          initial="hidden"
          animate="show"
        >
          <Widget.QuizList>
            <Element className="quizes" id="containerElement">
              <h1>Quizes da Galera</h1>
              <ul>
                {dbInternal.external.map((linkExterno) => {
                  const [projectName, githubUser] = linkExterno
                  .replace(/\//g, '')
                  .replace('https:', '')
                  .replace('vercel.app', '')
                  .split('.');

                  return (
                    <li key={linkExterno}>
                      <Widget.Topic 
                        as={Link}
                        href={`/OtherMain/${projectName}___${githubUser}`}
                      >
                        {`${projectName} / ${githubUser}`}
                      </Widget.Topic>
                    </li>
                  )
                })}
              </ul>
            </Element>
          </Widget.QuizList>
        </Widget>
      </QuizContainer>
      <GitHubCorner projectUrl="https://github.com/jairodoni" />
    </QuizBackground>
  );
}
