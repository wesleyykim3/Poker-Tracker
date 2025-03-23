import React from 'react'

const SessionList = ({sessions, editSession, updateCallback}) => {

    const totalBuyin = sessions.reduce((total, session) => total + session.buyin, 0)
    const totalCashout = sessions.reduce((total, session) => total + session.cashout, 0)
    const totalProfit = totalCashout - totalBuyin
    const totalSessions = sessions.length
    const profitableSessions = sessions.filter(session => (session.cashout - session.buyin) > 0).length
    
    const calculateDuration = (startTime, endTime) => {

        const start = new Date(`1970-01-01T${startTime}:00`)
        const end = new Date(`1970-01-01T${endTime}:00`)

        if (end < start) {
            end.setDate(end.getDate() + 1)
        }

        const duration = end - start

        const hours = Math.floor(duration / (1000 * 60 * 60))
        const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60))

        return [hours, minutes]
    }

    const totalDuration = sessions.reduce((total, session) => total + calculateDuration(session.startTime, session.endTime)[0] + calculateDuration(session.startTime, session.endTime)[1]/60, 0)

    const onDelete = async (id) => {
        try {
            const options = {
                method: 'DELETE'
            }
            const response = await fetch(`http://127.0.0.1:5000/delete_session/${id}`, options)
            if (response.status === 200) {
                updateCallback()
            } else {
                console.error('Failed to delete')
            }
        } catch (error) {
            alert(error)
        }
    }

    return <div>
        <h2>Sessions</h2>
        <table>
            <thead>
                <tr>
                    <th>Location</th>
                    <th>Date</th>
                    <th>Time Played</th>
                    <th>Buyin</th>
                    <th>Cashout</th>
                    <th>Profit</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {sessions.map((session) => (
                    <tr key={session.id}>
                        <td>{session.location}</td>
                        <td>{session.date}</td>
                        <td>{calculateDuration(session.startTime, session.endTime).join('h ')}m</td>
                        <td>${session.buyin}</td>
                        <td>${session.cashout}</td>
                        <td>
                            {session.cashout - session.buyin < 0 ? `-$${Math.abs(session.cashout - session.buyin)}` : `$${session.cashout - session.buyin}`}
                        </td>
                        <td>
                            <button className="icon-button edit" onClick={() => editSession(session)}>
                                <i className="fas fa-pencil-alt"></i>
                            </button>
                            <button className="icon-button delete" onClick={() => onDelete(session.id)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </td>
                    </tr>
                ))}
                <tr>
                    <td>Net Profit: ${totalProfit}</td>
                    <td>Avg Profit / Hour: ${(totalProfit/totalDuration).toFixed(2)}</td>
                    <td>Avg Profit / Session: ${(totalProfit/totalSessions).toFixed(2)}</td>
                    <td>Total Hours Played: {totalDuration.toFixed(0)}</td>
                    <td>Total Sessions: {totalSessions}</td>
                    <td>Profitable Ratio: {(100*profitableSessions/totalSessions).toFixed(2)}%</td>
                </tr>
            </tbody>
        </table>
    </div>
}

export default SessionList