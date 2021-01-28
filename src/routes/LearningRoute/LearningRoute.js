import React, { Component } from 'react'
import config from '../../config'
import UserContext from '../../contexts/UserContext'
import TokenService from '../../services/token-service'
import './LearningRoute.css'

class LearningRoute extends Component {
  static contextType = UserContext
  state = {}

  handleNext() {
    this.setState({
      isClicked: false,
      correct: this.state.response.wordCorrectCount,
      incorrect: this.state.response.wordIncorrectCount,
      translation: '',
      answer: null,
      nextWord: {
        nextWord: this.state.response.nextWord,
        totalScore: this.state.response.nextWord.totalScore,
        wordCorrectCount: this.state.response.wordCorrectCount,
        wordIncorrectCount: this.state.response.wordIncorrectCount,
      },
    })
  }

  async componentDidMount() {
    try {
      const response = await fetch(`${config.API_ENDPOINT}/language/head`, {
        headers: {
          authorization: `bearer ${TokenService.getAuthToken()}`,
        },
      })
      const json = await response.json()
      this.context.setNextWord(json)
      this.setState({ nextWord: json })
      this.setState({
        correct: json.wordCorrectCount,
        incorrect: json.wordIncorrectCount,
        total: json.totalScore,
        isClicked: false,
        score: null,
      })
    } catch (error) {
      this.setState({ error: error })
    }
  }

  async submitForm(event) {
    event.preventDefault()
    const guess = event.target.guess.value.toLowerCase().trim()
    event.target.guess.value = ''
    this.setState({ guess: guess })
    this.context.setGuess(guess)

    try {
      const res = await fetch(`${config.API_ENDPOINT}/language/guess`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `bearer ${TokenService.getAuthToken()}`,
        },
        body: JSON.stringify({ guess: guess }),
      })

      const json = await res.json()
      this.context.setResponse(json)
      this.setState({
        response: json,
        total: json.totalScore,
        isClicked: true,
        translation: json.answer,
      })
    } catch (error) {
      this.setState({ error: error })
    }

    if (this.state.response.isCorrect) {
      this.setState({
        answer: 'correct',
        correct: this.state.correct + 1,
      })
    } else {
      this.setState({
        answer: 'incorrect',
        incorrect: this.state.incorrect + 1,
      })
    }
  }

  render() {
    //TODO: REVISE The JSX
    console.log('ANSWER', this.state.answer)
    return (
      <div className='center-content words-card'>
        <form onSubmit={(event) => this.submitForm(event, this.context)}>
          {this.state.answer == null && (
            <h2 className='translate'>
              Translate the word{' '}
              {this.state.isClicked === false && this.state.nextWord
                ? this.state.nextWord.nextWord
                : null}
            </h2>
          )}
          {this.state.answer === 'correct' && (
            <div className='answer-response'>
              <h2>Your answer was correct!</h2>
              <p>
                The correct translation of the word{' '}
                {this.state.nextWord.nextWord} is {this.state.translation}, and
                you chose {this.state.guess}.
              </p>
            </div>
          )}
          {this.state.answer === 'incorrect' && (
            <div className='answer-response'>
              <h2>Your answer was incorrect.</h2>
              <p>
                The correct translation of the word {this.state.nextWord.nextWord} is {this.state.translation}, and
                you chose {this.state.guess}.
              </p>
            </div>
          )}
          {this.state.isClicked === false && (
            <div>
              <label htmlFor='learn-guess-input'>Translate</label>
              <input
                name='guess'
                aria-label='learn-guess-input'
                id='learn-guess-input'
                type='text'
                placeholder='Enter Translation'
                required
              ></input>
              {this.state.isClicked === false && (
                <button type='submit'>Submit Answer</button>
              )}
            </div>
          )}
          <p>
            You have translated this word correctly {this.state.correct} times.
          </p>
          <p>
            You have translated this word incorrectly {this.state.incorrect}{' '}
            times.
          </p>
          <h3 className='score'>Your total score is: {this.state.total}</h3>
        {!!this.state.answer && (
          <button onClick={() => this.handleNext()}>Next Word</button>
        )}
        </form>
      </div>
    )
  }
}

export default LearningRoute
