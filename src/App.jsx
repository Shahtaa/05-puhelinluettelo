import { useState, useEffect } from 'react';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import personService from './services/persons';

const App = () => {
    const [persons, setPersons] = useState([]);
    const [newName, setNewName] = useState('');
    const [newNumber, setNewNumber] = useState('');
    const [searchInput, setSearchInput] = useState('');
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

    const handleChange = (event) => {
        const inputValue = event.target.value.toLowerCase();
        setSearchInput(inputValue);
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

    const addPerson = (event) => {
        event.preventDefault();

        const existingPerson = persons.find(person => person.name === newName);

        if (existingPerson) {
            const confirmUpdate = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`);

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
                    setPersons(persons.concat(data));
                    setFilteredPersons(filteredPersons.concat(data));
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
            <Persons persons={filteredPersons} handleDelete={handleDelete} />
        </div>
    );
};

export default App;
