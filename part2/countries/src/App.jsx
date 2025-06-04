import { useState } from 'react'
import axios from 'axios'

const Result = ({ countries }) => {
  if(countries === null || countries === undefined) return null
  if(countries.length > 10) {
    return <div>Too many matches, specify another filter</div>
  } else {
    return <div>
      {countries.map(country => <div key={country}>{country}</div>)}
    </div>
  }
}

function App() {
  const [filter, setFilter] = useState('')
  const [countries, setCountries] = useState(null)

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        console.log('Countries fetched:', response.data)
        const countries = response.data.map(country => country.name.common)
        const filteredCountries = countries.filter(country => 
          country.toLowerCase().includes(event.target.value.toLowerCase())
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