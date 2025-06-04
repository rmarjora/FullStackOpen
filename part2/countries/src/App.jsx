import { useState } from 'react'
import axios from 'axios'
import Result from './components/Result'

function App() {
  const [filter, setFilter] = useState('')
  const [countries, setCountries] = useState(null)

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        // console.log('Countries fetched:', response.data)
        const filteredCountries = response.data.filter(country => 
          country.name.common.toLowerCase().includes(event.target.value.toLowerCase())
        )
        setCountries(filteredCountries)
      })
      .catch(error => {
        console.log('Error fetching countries:', error)
        return []
      })
  }

  return (
    <>
      <div>
        find countries
        <input type="text" onChange={handleFilterChange}/>
      </div>
      <Result countries={countries}/>
    </>
  )
}

export default App