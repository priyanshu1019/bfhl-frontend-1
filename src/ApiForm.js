import React, { useState } from 'react';
import axios from 'axios';
import './ApiForm.css';

const ApiForm = () => {
    const [jsonInput, setJsonInput] = useState('');
    const [responseData, setResponseData] = useState(null);
    const [error, setError] = useState('');
    const [selectedFilters, setSelectedFilters] = useState([]);

    const handleInputChange = (e) => {
        setJsonInput(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const parsedInput = JSON.parse(jsonInput);
            if (!parsedInput.data) throw new Error('Invalid JSON structure. Please include a data array.');
            const response = await axios.post('http://localhost:3000/bfhl', parsedInput);
            setResponseData(response.data);
            setError('');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleFilterSelect = (e) => {
        const selectedFilter = e.target.value;
        if (selectedFilter && !selectedFilters.includes(selectedFilter)) {
            setSelectedFilters([...selectedFilters, selectedFilter]);
        }
    };

    const removeFilter = (filter) => {
        setSelectedFilters(selectedFilters.filter(f => f !== filter));
    };

    const renderFilteredResponse = () => {
        if (!responseData) return null;
        const { numbers, alphabets, highest_lowercase_alphabet } = responseData;
        return (
            <div className="response-container">
                {selectedFilters.includes('Numbers') && <div>Numbers: {numbers.join(',')}</div>}
                {selectedFilters.includes('Alphabets') && <div>Alphabets: {alphabets.join(',')}</div>}
                {selectedFilters.includes('HighestLowercaseAlphabet') && (
                    <div>Highest Lowercase Alphabet: {highest_lowercase_alphabet.join(',')}</div>
                )}
            </div>
        );
    };

    return (
        <div className="api-form">
            <form onSubmit={handleSubmit}>
                <textarea
                    value={jsonInput}
                    onChange={handleInputChange}
                    placeholder='{"data":["M","1","334","4","B"]}'
                    rows={4}
                    className="input-field"
                    
                />
                <br />
                <button type='submit' className="submit-button">Submit</button>
            </form>

            {error && <div style={{ color: 'red' }}>{error}</div>}

            {responseData && (
                <div className="filter-container">
                    <div className="filter-selection">
                        <div className="selected-filters">
                            {selectedFilters.map(filter => (
                                <div className="selected-filter" key={filter}>
                                    {filter} <button onClick={() => removeFilter(filter)} className="remove-filter">x</button>
                                </div>
                            ))}
                        </div>
                        <select onChange={handleFilterSelect} className="filter-dropdown">
                            <option value="" disabled selected>Select Filter</option>
                            <option value="Numbers">Numbers</option>
                            <option value="Alphabets">Alphabets</option>
                            <option value="HighestLowercaseAlphabet">Highest Lowercase Alphabet</option>
                        </select>
                    </div>

                    <h3>Filtered Response</h3>
                    {renderFilteredResponse()}
                </div>
            )}
        </div>
    );
};

export default ApiForm;
