import { useState, useEffect } from 'react';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import Notification from './components/Notification';
import personService from './services/persons';

const App = () => {
    const [persons, setPersons] = useState([]);
    const [newName, setNewName] = useState('');
    const [newNumber, setNewNumber] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [filteredPersons, setFilteredPersons] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);

    const showMessage = (message, type) => {
        setErrorMessage({ message, type });
        setTimeout(() => {
            setErrorMessage(null);
        }, 3000); // Show the message for 3 seconds
    };
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
                    showMessage(`Deleted ${name}`, 'success');
                })
                .catch(error => {
                    console.error('Error deleting person:', error);
                    if (error.response && error.response.status === 404) {
                        // Handle the case where the resource doesn't exist
                        showMessage(`Information of ${name} has already been removed from the server.`, 'error');
                    } else {
                        showMessage(`Error deleting ${name}.`, 'error');
                    }
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
                        showMessage(`Updated ${newName}'s number`, 'success');
                        setNewName('');
                        setNewNumber('');
                    })
                    .catch(error => {
                        console.error('Error updating person:', error);
                        if (error.response && error.response.status === 404) {
                            // Handle the case where the resource doesn't exist
                            showMessage(`Information of ${newName} has already been removed from the server.`, 'error');
                        } else {
                            showMessage(`Error updating ${newName}.`, 'error');
                        }
                    });
            }
        } else {
            const newPerson = { name: newName, number: newNumber };

            personService.create(newPerson)
                .then(data => {
                    setPersons(persons.concat(data));
                    setFilteredPersons(filteredPersons.concat(data));
                    showMessage(`Added ${newName}`, 'success');
                    setNewName('');
                    setNewNumber('');
                })
                .catch(error => {
                    console.error('Error adding person:', error);
                    showMessage(`Error adding ${newName}.`, 'error');
                });
        }
    };

    return (
        <div>
            <h2>Phonebook</h2>
            <Notification message={errorMessage ? errorMessage.message : null} type={errorMessage ? errorMessage.type : null} />
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
