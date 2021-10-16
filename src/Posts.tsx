import { useState, useEffect, useMemo } from 'react'
import Loader from './Loader'
import { Post, User } from './model'
import Services from './Services'

const Posts = () => {
  const [errors, setErrors] = useState<Error[]>([])
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const [posts, setPosts] = useState<Array<Post>>([])
  const [users, setUsers] = useState<Array<User>>([])
  const [selectedAuthorId, setSelectedAuthorId] = useState<number>(0)

  useEffect(() => {
    ;(async () => {
      await Promise.all([Services.getPosts(), Services.getUsers()])
      if (Services.errors.length !== 0) {
        setErrors(Services.errors)
        return
      }
      const { posts, users } = Services
      if (posts !== null) setPosts(posts)

      if (users !== null) setUsers(users)
      setIsLoaded(true)
    })()
  }, [])

  const handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.currentTarget
    setSelectedAuthorId(parseInt(value, 10))
  }

  const usersObj = useMemo(() => {
    type UserObj = { [key: string]: User }

    return users.reduce((acc: UserObj, user) => {
      const { id } = user
      acc[id.toString()] = user
      return acc
    }, {})
  }, [users])

  if (errors.length > 0) {
    return (
      <div>
        Error:{' '}
        {errors.map((e) => (
          <>{e}</>
        ))}
      </div>
    )
  }

  if (!isLoaded) {
    return <div><Loader/></div>
  }

  let filtredPosts = posts
  if (selectedAuthorId) {
    filtredPosts = posts.filter((post) => post.userId === selectedAuthorId)
  }

  return (
    <div className="body">
      <select name="Авторы" id="" onChange={handleChangeSelect} className="sort">
        <option value={0}>Выбрать User</option>
        {users.map((user) => {
          const { id, name } = user
          return (
            <option key={id} value={id}>
              {name}
            </option>
          )
        })}
      </select>
      <div className="post">
        {filtredPosts.map((post) => (
          <div key={post.id} className="post__body">
            <h2 className="post__body-title">{post.title}</h2>
            <div className="post__body-text">
              <p>{post.body}</p>
            </div>
            <div className="post__body-author">
              <p>{usersObj[post.userId.toString()].name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Posts
