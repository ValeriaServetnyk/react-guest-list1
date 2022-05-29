import './App.css';
import { useEffect, useState } from 'react';

export default function App() {
  // get this from the user

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // send it here

  const baseUrl = 'https://guest-list-database.herokuapp.com';

  // get this from API

  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stateUpdate, setStateUpdate] = useState(true);

  // establish connection with the database

  useEffect(() => {
    async function getGuests() {
      const response = await fetch(`${baseUrl}/guests`);
      const allGuests = await response.json();
      setLoading(false);
      setGuests(allGuests);
      console.log('fetch done');
    }
    getGuests().catch(() => {
      console.log('fetch failed');
    });
  }, [stateUpdate]);

  // send new guest to the database

  async function createGuest() {
    const response = await fetch(`${baseUrl}/guests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
      }),
    });
    const addNewGuest = await response.json();
    guests.push(addNewGuest);
    setFirstName('');
    setLastName('');
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    createGuest().catch(() => {
      console.log('guest not created');
    });
  };

  // remove guest

  async function deleteGuest(id) {
    const response = await fetch(`${baseUrl}/guests/${id}`, {
      method: 'DELETE',
    });
    await response.json();
    setStateUpdate(!stateUpdate);
  }

  // update attendance via checkbox

  async function updateAttendance(id, attendance) {
    const response = await fetch(`${baseUrl}/guests/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attending: attendance }),
    });
    await response.json();
    setStateUpdate(!stateUpdate);
  }

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="Main">
      <div className="textContainer">
        <h1>My celebration of the first job offer</h1>
        <p>
          After successfully finishing the Upleveled bootcamp I got my first
          amazing job offer and since now I have money I can throw a massive
          party.
        </p>
        <p>Add your name below to make sure you are on the list!</p>
      </div>
      <form className="dataInput" onSubmit={handleSubmit}>
        <label className="Fields">
          First name
          <input
            name="firstName"
            placeholder="Add your name"
            value={firstName}
            onChange={(event) => {
              setFirstName(event.currentTarget.value);
            }}
          />
        </label>
        <label className="Fields">
          Last name
          <input
            name="lastName"
            placeholder="Add your last name"
            value={lastName}
            onChange={(event) => {
              setLastName(event.currentTarget.value);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                createGuest([firstName, lastName]).catch(() => {
                  console.log('guest not added');
                });
              }
            }}
          />
        </label>
      </form>
      {guests.map((guest) => {
        return (
          <div key={guest.id} data-test-id="guest">
            <hr />
            <div className="generatedList">
              <p className="listItems">
                {guest.firstName} {guest.lastName}
              </p>
              <label>
                <input
                  className="Checkbox"
                  aria-label="attending"
                  type="checkbox"
                  checked={guest.attending}
                  onChange={() => {
                    updateAttendance(guest.id, !guest.attending).catch(() => {
                      console.log('guest not updated');
                    });
                    console.log(guest.attending);
                  }}
                />
                {guest.attending ? ' attending' : ' not attending'}
              </label>
              <button
                aria-label="Remove"
                onClick={() => {
                  deleteGuest(guest.id).catch(() => {
                    console.log('guest not deleted');
                  });
                }}
              >
                {' '}
                Remove
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
