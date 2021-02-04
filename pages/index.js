import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import db from '../db.json';
import { motion } from 'framer-motion';
import Widget from '../src/components/Widget';
import Link from '../src/components/Link';
import QuizLogo from '../src/components/QuizLogo';
import QuizBackground from '../src/components/QuizBackground';
import Footer from '../src/components/Footer';
import GitHubCorner from '../src/components/GitHubCorner';
import Input from '../src/components/Input';
import Button from '../src/components/Button';
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

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    router.push(`/quiz?name=${name}`);
    console.log('Fazendo uma submissão por meio do react');
  }

  return (
    <QuizBackground backgroundImage={db.bg}>
      <QuizContainer>
        <QuizLogo fill="#18DAF5"/>
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
            <form onSubmit={handleSubmit}>

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
            <Element name="test7" className="quizes" id="containerElement">
              <h1>Quizes da Galera</h1>
              <ul>
                {db.external.map((linkExterno) => {
                  const [projectName, githubUser] = linkExterno
                  .replace(/\//g, '')
                  .replace('https:', '')
                  .replace('vercel.app', '')
                  .split('.');

                  return (
                    <li key={linkExterno}>
                      <Widget.Topic 
                        as={Link}
                        href={`/quiz/${projectName}___${githubUser}`}
                      >
                        {`${githubUser}/${projectName}`}
                      </Widget.Topic>
                    </li>
                  )
                })}
              </ul>
            </Element>
          </Widget.QuizList>
        </Widget>
        {/* <Footer
           as={motion.section}
           transition={{ delay: 0.5, duration: 0.5 }}
           variants={{
             show: {opacity: 1 },
             hidden: { opacity: 0 },
           }}
           initial="hidden"
           animate="show"
        /> */}
      </QuizContainer>
      <GitHubCorner projectUrl="https://github.com/jairodoni" />
    </QuizBackground>
  );
}
