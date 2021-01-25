import React, { Component } from 'react'
import AuthApiService from '../services/auth-api-service'
import TokenService from '../services/token-service'
import IdleService from '../services/idle-service'

const UserContext = React.createContext({
  user: {},
  error: null,
  setError: () => {},
  clearError: () => {},
  setUser: () => {},
  handleLogin: () => {},
  handleLogout: () => {},
  language: null,
  words: [],
  nextWord: null,
  response: null,
  guess: null,
  totalScore: 0,
  setGuess: () => {},
  setResponse: () => {},
  setError: () => {},
  clearError: () => {},
  setUser: () => {},
  setLanguage: () => {},
  setWords: () => {},
  setNextWord: () => {},
  setTotalScore: () => {},
})

export default UserContext

export class UserProvider extends Component {
  constructor(props) {
    super(props)
    const state = {
      user: {},
      error: null,
      language: null,
      words: [],
      nextWord: null,
      totalScore: 0,
      currWord: null,
      attempt: null,
      response: null,
      feedback: null,
    }

    const jwtPayload = TokenService.parseAuthToken()

    if (jwtPayload)
      state.user = {
        id: jwtPayload.user_id,
        name: jwtPayload.name,
        username: jwtPayload.sub,
      }

    this.state = state
    IdleService.setIdleCallback(this.logoutBecauseIdle)
  }

  componentDidMount() {
    if (TokenService.hasAuthToken()) {
      IdleService.regiserIdleTimerResets()
      // TokenService.queueCallbackBeforeExpiry(() => {
      //   this.fetchRefreshToken()
      // })
    }
  }

  componentWillUnmount() {
    IdleService.unRegisterIdleResets()
    TokenService.clearCallbackBeforeExpiry()
  }
  setError = (error) => {
    console.error(error)
    this.setState({ error })
  }
  clearError = () => {
    this.setState({ error: null })
  }
  setUser = (user) => {
    this.setState({ user })
  }
  handleLogin = (authToken) => {
    TokenService.saveAuthToken(authToken)
    const jwtPayload = TokenService.parseAuthToken()
    this.setUser({
      id: jwtPayload.user_id,
      name: jwtPayload.name,
      username: jwtPayload.sub,
    })
    IdleService.regiserIdleTimerResets()
    // TokenService.queueCallbackBeforeExpiry(() => {
    //   this.fetchRefreshToken()
    // })
  }
  handleLogout = () => {
    TokenService.clearAuthToken()
    // TokenService.clearCallbackBeforeExpiry()
    IdleService.unRegisterIdleResets()
    this.setUser({})
  }
  logoutBecauseIdle = () => {
    TokenService.clearAuthToken()
    // TokenService.clearCallbackBeforeExpiry()
    IdleService.unRegisterIdleResets()
    this.setUser({ idle: true })
  }
  fetchRefreshToken = () => {
    AuthApiService.refreshToken()
      .then((res) => {
        TokenService.saveAuthToken(res.authToken)
        // TokenService.queueCallbackBeforeExpiry(() => {
        //   this.fetchRefreshToken()
        // })
      })
      .catch((err) => {
        this.setError(err)
      })
  }
  setLanguage = (language) => {
    this.setState({ language: language })
  }
  setWords = (words) => {
    this.setState({ words: words })
  }
  setNextWord = (nextWord) => {
    this.setState({ nextWord: nextWord })
  }
  setResponse = (response) => {
    this.setState({ response: response })
  }
  setFeedback = (feedback) => {
    this.setState({ feedback: feedback })
  }
  setGuess = (guess) => {
    this.setState({ guess: guess })
  }
  setTotalScore = (score) => {
    this.setState({ totalScore: score })
  }

  render() {
    const value = {
      user: this.state.user,
      error: this.state.error,
      setError: this.setError,
      clearError: this.clearError,
      setUser: this.setUser,
      handleLogin: this.handleLogin,
      handleLogout: this.handleLogout,
      language: this.state.language,
      words: this.state.words,
      nextWord: this.state.nextWord,
      response: this.state.response,
      guess: this.state.guess,
      totalScore: this.state.totalScore,
      setGuess: this.setGuess,
      setResponse: this.setResponse,
      setError: this.setError,
      clearError: this.clearError,
      setUser: this.setUser,
      handleLogin: this.handleLogin,
      handleLogout: this.handleLogout,
      setLanguage: this.setLanguage,
      setWords: this.setWords,
      setNextWord: this.setNextWord,
      setTotalScore: this.setTotalScore,
    }
    return (
      <UserContext.Provider value={value}>
        {this.props.children}
      </UserContext.Provider>
    )
  }
}
