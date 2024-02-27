import { useState } from 'react';
import Person from './components/Person';

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
        setNewName('');
        setNewNumber('');
    };

    return (
        <div>
            <h2>Phonebook</h2>
            <div>
                filter shown with<input
                    type="search"
                    onChange={handleChange}
                    value={searchInput} />
            </div>

            <h2>add a new</h2>
            <form onSubmit={addPerson}>
                <div>
                    name: <input value={newName} onChange={handleNameChange} />
                </div>
                <div>
                    number: <input value={newNumber} onChange={handleNumberChange} />
                </div>
                <div>
                    <button type="submit">add</button>
                </div>
            </form>

            <h2>Numbers</h2>

            {filteredPersons.map((person, index) => (
                <Person key={index} person={person} />
            ))}

        </div>
    );
};

export default App;
