import { useState } from 'react';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';

const App = () => {
    const [persons, setPersons] = useState([
        { name: 'Arto Hellas', number: '040-123456' },
        { name: 'Ada Lovelace', number: '39-44-5323523' },
        { name: 'Dan Abramov', number: '12-43-234345' },
        { name: 'Mary Poppendieck', number: '39-23-6423122' }
    ]);
    const [newName, setNewName] = useState('');
    const [newNumber, setNewNumber] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [filteredPersons, setFilteredPersons] = useState(persons);

    const handleNameChange = (event) => {
        setNewName(event.target.value);
    };

    const handleNumberChange = (event) => {
        setNewNumber(event.target.value);
    };

    const handleChange = (event) => {
        setSearchInput(event.target.value);
        const filtered = persons.filter((person) =>
            person.name.toLowerCase().includes(event.target.value.toLowerCase())
        );
        setFilteredPersons(filtered);
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
        setFilteredPersons([...filteredPersons, newPerson]); // Update filteredPersons
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
