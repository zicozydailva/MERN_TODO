import { useAppContext } from '../context/appContext'
import { useEffect } from 'react'
import Loading from './Loading'
import Job from './Job'
import Wrapper from '../assets/wrappers/JobsContainer'

const JobsContainer = () => {
  const {
    getTodos,
    todos,
    isLoading,
    search,
    searchStatus,
    searchType,
    sort
  } = useAppContext()


  useEffect(() => {
    getTodos()
    // eslint-disable-next-line
  }, [search, searchStatus, sort, searchType])


  if (isLoading) {
    return <Loading center />
  }

  if (todos.length === 0) {
    return (
      <Wrapper>
        <h2>No Todos to display...</h2>
      </Wrapper>
    )
  }

  return (
    <Wrapper>
      <h5>
        {todos.length} Todo{todos.length > 1 && 's'} found
      </h5>
      <div className='jobs'>
        { todos?.map((todo) => {
          return <Job key={todo._id} {...todo} />
        })}
      </div>
    </Wrapper>
  )
}

export default JobsContainer
