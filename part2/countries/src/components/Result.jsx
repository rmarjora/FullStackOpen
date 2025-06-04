import CountryInfo from "./CountryInfo"

const Result = ({ countries }) => {
if (!countries) return null
  if(countries.length === 1) {
    return <CountryInfo country={countries[0]} />
  }
  if(countries.length > 10) {
    return <div>Too many matches, specify another filter</div>
  } else {
    return <div>
      {countries.map(country => <div key={country.name.common}>{country.name.common}</div>)}
    </div>
  }
}

export default Result