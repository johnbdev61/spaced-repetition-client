import React, { Component } from 'react'

const LanguageContext = React.createContext({
  language: '',
  words: [],
  totalScore: 0,
  setLanguage: () => {},
  setWords: () => {},
  setScore: () => {},
  setDashboard: () => {},
})

export default LanguageContext

export class LanguageProvider extends Component {
  constructor(props) {
    super(props)
    const state = {
      language: '',
      totalScore: 0,
      words: [],
    }
  }

  setDashboard = (params) => {
    this.setState({
      language: params.language,
      words: params.words,
      totalScore: params.totalScore,
    })
  }
  setLanguage = (language) => {
    this.setState({ language: language })
  }
  setWords = (words) => {
    this.setState({ words: words })
  }
  setScore = (score) => {
    this.setState({ totalScore: score })
  }

  render() {
    const value = {
      language: this.state.language,
      words: this.state.words,
      totalScore: this.state.totalScore,
    }
    return (
      <DataContext.Provider value={value}>
        {this.props.children}
      </DataContext.Provider>
    )
  }
}
