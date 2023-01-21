import { useContext, useEffect, useState } from 'react'
import { ThemeContext } from '../../App'
import './style.css'

function Search(props) {
  const {theme} = useContext(ThemeContext)
  const {getDataFromSearchComponent, callApi, setCallApi} = props

  const [inputValue, setInputValue] = useState('')

  const handleInput = (e) => {
    const {value} = e.target
    setInputValue(value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    getDataFromSearchComponent(inputValue)
  }

  useEffect(() => {

    if (callApi) {
      setInputValue('')
      setCallApi(false)
    }

  }, [callApi, setCallApi])
  
  return (
    <form onSubmit={handleSubmit} className="Search">
        <input name="search" onChange={handleInput} value={inputValue} placeholder="Search Recipes" id="search" />
        <button style={theme ? {  backgroundColor : '#12343b'} : {}} type="submit">Search</button>
    </form>
  )
}

export default Search