import { useState, useEffect } from 'react';
import axios from 'axios';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';

const App = () => {
    const [persons, setPersons] = useState([]);
    const [newName, setNewName] = useState('');
    const [newNumber, setNewNumber] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [filteredPersons, setFilteredPersons] = useState([]);


    const hook = () => {
        console.log('effect')
        axios
            .get('http://localhost:3001/persons')
            .then(response => {
                console.log('promise fulfilled')
                setPersons(response.data);
                setFilteredPersons(response.data);
            })
    }

    useEffect(hook, [])

    const handleNameChange = (event) => {
        setNewName(event.target.value);
    };

    const handleNumberChange = (event) => {
        setNewNumber(event.target.value);
    };

    const handleChange = (event) => {
        const inputValue = event.target.value.toLowerCase();
        setSearchInput(inputValue);
        setFilteredPersons(persons.filter((person) =>
            person.name.toLowerCase().includes(inputValue)
        ));
    };

    const addPerson = (event) => {
        event.preventDefault();
        const nameExists = persons.some(person => person.name === newName);
        if (nameExists) {
            alert(`${newName} is already added to the phonebook.`);
            return;
        }
        const newPerson = { name: newName, number: newNumber };
        setPersons([...persons, newPerson]);
        setFilteredPersons([...filteredPersons, newPerson]); // Update filteredPersons using spread operator
        setNewName('');
        setNewNumber('');
    };

    return (
        <div>
            <h2>Phonebook</h2>
            <Filter value={searchInput} handleChange={handleChange} />
            <h3>Add a new</h3>
            <PersonForm
                newName={newName}
                newNumber={newNumber}
                handleNameChange={handleNameChange}
                handleNumberChange={handleNumberChange}
                addPerson={addPerson}
            />
            <h3>Numbers</h3>
            <Persons persons={filteredPersons} />
        </div>
    );
};

export default App;
