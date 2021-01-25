import React, { Component } from 'react'
import UserContext from '../../contexts/UserContext'
import Token from '../../services/token-service'
import config from '../../config'

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
          this.context.setTotalScore(params.language.totalScore)
        })
      )
  }
  renderWords() {
    console.log('CONTEXT', this.context)
    return this.context.words.map((word, i) => (
      <li>
        <h4>{word.original}</h4> <span>Correct: {word.correct_count}</span>
        <br/>
        <span>Incorrect: {word.incorrect_count}</span>
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
            <h2>{this.context.language}</h2>
            <a href="/learn">Start Learning French!</a>
            <h3>Here are your words to practice</h3>
            <ul>{this.renderWords()}</ul>
            <p>Your correct answers: {this.context.total_score}</p>
          </div>
        )}
      </section>
    )
  }
}

export default DashboardRoute
