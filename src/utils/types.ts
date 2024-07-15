type Session = {
  cookie: {
    originalMaxAge: number
    expires: string
    secure: boolean
    httpOnly: boolean
    path: string
    sameSite: string
  }
}

interface UserSession extends Session {
  logged_in: boolean
  user: {
    id: string
    username: string
    role: 'ENTERPRISE' | 'ADMIN' | 'PENTESTER'
  }
}
