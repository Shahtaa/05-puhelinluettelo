
const Persons = ({ persons }) => {
    return (
        <div>
            {persons.map((person, index) => (
                <div key={index}>
                    {person.name} {person.number}
                </div>
            ))}
        </div>
    );
};

export default Persons;
