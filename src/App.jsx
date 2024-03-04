import { useState, useEffect } from 'react';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import PersonsList from './components/PersonsList';
import personService from './services/persons';

const App = () => {
    const [persons, setPersons] = useState([]);
    const [newName, setNewName] = useState('');
    const [newNumber, setNewNumber] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPersons, setFilteredPersons] = useState([]);

    useEffect(() => {
        personService.getAll()
            .then(data => {
                setPersons(data);
                setFilteredPersons(data);
            })
            .catch(error => {
                console.error('Error fetching persons:', error);
            });
    }, []);

    const handleNameChange = (event) => {
        setNewName(event.target.value);
    };

    const handleNumberChange = (event) => {
        setNewNumber(event.target.value);
    };

    const handleSearchChange = (event) => {
        const inputValue = event.target.value.toLowerCase();
        setSearchQuery(inputValue);
        setFilteredPersons(persons.filter((person) =>
            person.name.toLowerCase().includes(inputValue)
        ));
    };

    const handleDelete = (id, name) => {
        const confirmDelete = window.confirm(`Delete ${name}?`);
        if (confirmDelete) {
            personService.remove(id)
                .then(() => {
                    const updatedPersons = persons.filter(person => person.id !== id);
                    setPersons(updatedPersons);
                    setFilteredPersons(updatedPersons);
                })
                .catch(error => {
                    console.error('Error deleting person:', error);
                });
        }
    };

    const handleAddPerson = (event) => {
        event.preventDefault();

        const existingPerson = persons.find(person => person.name === newName);

        if (existingPerson) {
            const confirmUpdate = window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`);

            if (confirmUpdate) {
                personService.update(existingPerson.id, { ...existingPerson, number: newNumber })
                    .then(updatedPerson => {
                        const updatedPersons = persons.map(person =>
                            person.id === updatedPerson.id ? updatedPerson : person
                        );
                        setPersons(updatedPersons);
                        setFilteredPersons(updatedPersons);
                        setNewName('');
                        setNewNumber('');
                    })
                    .catch(error => {
                        console.error('Error updating person:', error);
                    });
            }
        } else {
            const newPerson = { name: newName, number: newNumber };

            personService.create(newPerson)
                .then(data => {
                    setPersons(prevPersons => prevPersons.concat(data));
                    setFilteredPersons(prevFilteredPersons => prevFilteredPersons.concat(data));
                    setNewName('');
                    setNewNumber('');
                })
                .catch(error => {
                    console.error('Error adding person:', error);
                });
        }
    };

    return (
        <div>
            <h2>Phonebook</h2>
            <Filter value={searchQuery} handleChange={handleSearchChange} />
            <h3>Add a new</h3>
            <PersonForm
                newName={newName}
                newNumber={newNumber}
                handleNameChange={handleNameChange}
                handleNumberChange={handleNumberChange}
                addPerson={handleAddPerson}
            />
            <h3>Numbers</h3>
            <PersonsList persons={filteredPersons} handleDelete={handleDelete} />
        </div>
    );
};

export default App;
