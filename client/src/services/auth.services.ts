import API from '@/api'

const login = async ({
  username,
  password,
}: {
  username: string
  password: string
}): Promise<any> => {
  try {
    const response = await API.post('/users/login', { username, password })

    if (response.status === 200) {
      return response
    } else {
      throw new Error('Failed to login')
    }
  } catch (error: any) {
    console.error('Login error:', error.message || error)
    throw error
  }
}

const signin = async ({
  username,
  password,
  confirmPassword,
}: {
  username: string
  password: string
  confirmPassword: string
}): Promise<any> => {
  try {
    if (password !== confirmPassword) {
      throw new Error("Passwords don't match")
    }

    const createUserResponse = await API.post('/users/create', {
      username,
      password,
    })

    if (createUserResponse.status !== 200) {
      throw new Error(
        createUserResponse.data.message || 'Failed to create user',
      )
    }

    return createUserResponse
  } catch (error: any) {
    console.error('Signin error:', error.message || error)
    throw error
  }
}

const signout = () => {
  localStorage.clear()
  console.log('User has been signed out')
}

export { login, signin, signout }
