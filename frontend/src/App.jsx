import {useState, useEffect} from 'react'
import SessionList from './SessionList'
import SessionForm from './SessionForm'
import './App.css'

function App() {
  const [sessions, setSessions] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentSession, setCurrentSession] = useState({})

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    const response = await fetch('http://127.0.0.1:5000/sessions')
    const data = await response.json()
    setSessions(data.sessions)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setCurrentSession({})
  }

  const openCreateModal = () => {
    if (!isModalOpen) setIsModalOpen(true)
  }

  const openEditModal = (session) => {
    if (isModalOpen) return
    setCurrentSession(session)
    setIsModalOpen(true)
  }

  const onUpdate = () => {
    closeModal()
    fetchSessions()
  }

  return (
    <>
      <SessionList sessions={sessions} editSession={openEditModal} updateCallback={onUpdate} />
      <button className="create-button" onClick={openCreateModal}>Create New Session</button>
      {isModalOpen && <div className='modal'>
        <div className='modal-content'>
          <button className='modal-close-button' onClick={closeModal}>
            <i className="fas fa-times"></i>
          </button>
          <SessionForm existingSession={currentSession} updateCallback={onUpdate} />
        </div>
      </div>
      }
    </>
  )
}

export default App
