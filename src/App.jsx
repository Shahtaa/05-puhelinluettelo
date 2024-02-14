import { useState } from 'react';
import Person from './components/Person';

const App = () => {

    const [persons, setPersons] = useState([
        { name: 'Arto Hellas' }
    ]);
    const [newName, setNewName] = useState('');

    const handleNameChange = (event) => {
        setNewName(event.target.value);
    };

    const addPerson = (event) => {
        event.preventDefault(); // Tämä estää lomakkeen oletusarvoisen toiminnan
        const nameExists = persons.some(person => person.name === newName);
        if (nameExists) {
            alert(`${newName} is already added to the phonebook.`);
            return;
        }
        const newPerson = { name: newName };

        setPersons(persons.concat(newPerson));
        setNewName('');
    };
    console.log(persons);
    return (
        <div>
            <h2>Phonebook</h2>
            <form onSubmit={addPerson}>
                <div>
                    name: <input value={newName} onChange={handleNameChange} />
                </div>
                <div>
                    <button type="submit">add</button>
                </div>
            </form>
            <h2>Numbers</h2>
            {persons.map((person) => (
                // Kentän key-arvona käytetään henkilön nimeä
                <Person key={person.name} person={person} />
            ))}
        </div>
    );
};

export default App;
