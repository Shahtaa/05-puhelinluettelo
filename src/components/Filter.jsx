
const Filter = ({ value, handleChange }) => {
    return (
        <div>
            filter shown with<input
                type="search"
                onChange={handleChange}
                value={value} />
        </div>
    );
};

export default Filter;
