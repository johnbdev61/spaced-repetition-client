import React, { Component } from 'react'
import UserContext from '../../contexts/UserContext'
import Token from '../../services/token-service'
import config from '../../config'
import './DashboardRoute.css'

class DashboardRoute extends Component {
  static contextType = UserContext
  componentDidMount() {
    fetch(`${config.API_ENDPOINT}/language`, {
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${Token.getAuthToken()}`,
      },
    })
    .then(res =>
      !res.ok 
        ? res.json().then(event => Promise.reject(event))
        : res.json().then(params => {
          this.context.setLanguage(params.language.name)
          this.context.setWords(params.words)
          this.context.setTotalScore(params.language.total_score)
        })
      )
  }
  renderWords() {
    console.log('CONTEXT', this.context)
    return this.context.words.map((word, i) => (
      <li key={word.id}>
        <h4 className='word'>{word.original}</h4>{' '}
        <span className='score'>Correct: {word.correct_count}</span>
        <br />
        <span className='score'>Incorrect: {word.incorrect_count}</span>
      </li>
    ))
  }

  render() {
    return (
      <section className='dashboard'>
        {this.context.words === null ? (
          <p>Sorry! There are no words!</p>
        ) : (
          <div>
            <h2 className='language'>French</h2>
            <h3 className='practice'>Here are your words to practice</h3>
            <ul className='words-card'>{this.renderWords()}</ul>
            <div className='learn-link'>              
              <a className='learn' href="/learn">Start Learning French!</a>
            </div>
            <p className='answer-total'><b>Number of Correct Answers: {this.context.totalScore}</b></p>
          </div>
        )}
      </section>
    )
  }
}

export default DashboardRoute
