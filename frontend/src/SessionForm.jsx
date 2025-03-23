import {useState} from 'react'

const SessionForm = ({existingSession = {}, updateCallback}) => {
    const [location, setLoc] = useState(existingSession.location || '')
    const [date, setDate] = useState(existingSession.date || '')
    const [startTime, setStartTime] = useState(existingSession.start_time || '')
    const [endTime, setEndTime] = useState(existingSession.end_time || '')
    const [buyin, setBuyin] = useState(existingSession.buyin || '')
    const [cashout, setCashout] = useState(existingSession.cashout || '')

    const updating = Object.entries(existingSession).length !== 0

    const onSubmit = async (e) => {
        e.preventDefault()

        const data = {
            location,
            date,
            startTime,
            endTime,
            buyin,
            cashout
        }
        const url = 'http://127.0.0.1:5000/' + (updating ? `edit_session/${existingSession.id}` : 'create_session')
        const options = {
            method: updating ? 'PATCH' : 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }
        const response = await fetch(url, options)
        if (response.status !== 201 && response.status !== 200) {
            const data = await response.json()
            alert(data.message)
        } 
        else {
            updateCallback()
        }
    }

    return (
        <form onSubmit={onSubmit}>
            <div>
                <label htmlFor='location'>Location:</label>
                <input
                    type='text'
                    id='location'
                    value={location}
                    onChange={(e) => setLoc(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor='date'>Date:</label>
                <input
                    type='date'
                    id='date'
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor='startTime'>Start Time:</label>
                <input
                    type='time'
                    id='startTime'
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor='endTime'>End Time:</label>
                <input
                    type='time'
                    id='endTime'
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor='buyin'>Buyin:</label>
                <input
                    type='number'
                    id='buyin'
                    value={buyin}
                    onChange={(e) => setBuyin(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor='cashout'>Cashout:</label>
                <input
                    type='number'
                    id='cashout'
                    value={cashout}
                    onChange={(e) => setCashout(e.target.value)}
                />
            </div>
            <button type='submit'>{updating ? 'Update' : 'Create'}</button>
        </form>
    )
}

export default SessionForm