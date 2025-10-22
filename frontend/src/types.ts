export interface ContentBlock {
  value: string
  type: string
}

export interface Service {
  id: number
  title: string
  description: string
  emphasis: string
  orderIndex: number
}

export interface ContentResponse {
  blocks: Record<string, ContentBlock>
  services: Service[]
  settings: Record<string, string>
}

export interface AuthUser {
  username: string
}

export interface AuthState {
  authenticated: boolean
  user: AuthUser | null
}
