import React, { Component } from 'react'
import config from '../../config'
import UserContext from '../../contexts/UserContext'
import TokenService from '../../services/token-service'

class LearningRoute extends Component {
  static contextType = UserContext
  state = {
    score: 0,
    total: 0,
    correctCount: '',
    incorrectCount: '',
    answer: null,
    response: {},
    nextWord: null,
    response: {},
    userGuess: '',
    isClicked: false,
  }

  handleNext() {
    this.setState({
      isClicked: false,
      correctCount: this.state.response.wordCorrectCount,
      incorrectCount: this.state.response.wordIncorrectCount,
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
        correctCount: json.wordCorrectCount,
        incorrectCount: json.wordIncorrectCount,
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
    const guesses = event.target.guesses.value.toLowerCase().trim()
    event.target.guesses.value = ''
    this.setState({ guess: guesses })
    this.context.setGuess(guesses)

    try {
      const results = await fetch(`${config.API_ENDPOINT}/language/guess`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${TokenService.getAuthToken()}`,
        },
        body: JSON.stringify({ guess: guesses }),
      })

      const answers = await answers.json()
      this.context.setResponse(answers)
      this.setState({
        response: answers,
        total: answers.totalScore,
        isClicked: true,
        translation: answers.answer,
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
    return (
      <div>
        <form onSubmit={(event) => this.submitForm(event, this.context)}>
          {this.state.answer == null && <h2>Translate the word:</h2>}
          {this.state.answer === 'correct' && (
            <div className='answer-response'>
              <h2>Your answer was correct!</h2>
              <p>
                The correct answer was {this.state.translation}, for the
                translation of {this.state.nextWord.nextWord}, and you chose{' '}
                {this.state.guess}.
              </p>
            </div>
          )}
          <span className='word'>
            {this.state.isClicked === false && this.state.nextWord
              ? this.state.nextWord.nextWord
              : null}
          </span>
          <div className='score'>
            {' '}
            <p>Your total score is: {this.state.total}</p>
          </div>
          {this.state.isClicked === false && (
            <fieldset>
              <label htmlFor='guess'>
                What does this translate to?
              </label>
              <input
                name='guess'
                id='learn-guess-input'
                type='text'
                required
              ></input>
              {this.state.isClicked === false && (
                <button type='submit'>Submit Answer</button>
              )}
            </fieldset>
          )}

          <p>You have translated this correctly {this.state.correct} times!</p>
          <p>
            You have not translated this correctly {this.state.incorrect} times.
          </p>
        </form>
        {this.state.answer !== null && (
          <button onClick={() => this.handleNext()}>On to the next!</button>
        )}
      </div>
    )
  }
}

export default LearningRoute
