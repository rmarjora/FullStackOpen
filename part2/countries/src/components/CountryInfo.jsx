const CountryInfo = ({country}) => {
    console.log('CountryInfo component rendered with country:', country)
    return (
        <>
            <h1>{country.name.common}</h1>
            <div>
                <p>Capital {country.capital}</p>
                <p>Area {country.area}</p>
            </div>
            <h2>Languages</h2>
            <ul>
                {Object.values(country.languages).map((language, index) => (
                    <li key={index}>{language}</li>
                ))}
            </ul>
            <img src={country.flags.png} alt={`Flag of ${country.name.common}`} style={{ width: '150px' }} />
        </>
    )
}

export default CountryInfo