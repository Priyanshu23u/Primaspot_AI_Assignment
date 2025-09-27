import React, { createContext, useContext, useReducer } from 'react'

const AppContext = createContext()

const initialState = {
  selectedInfluencers: [],
  filters: {
    dateRange: '30d',
    category: 'all',
    verified: null,
  },
  settings: {
    autoRefresh: false,
    notifications: true,
  },
}

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_SELECTED_INFLUENCERS':
      return {
        ...state,
        selectedInfluencers: action.payload,
      }
    case 'ADD_SELECTED_INFLUENCER':
      return {
        ...state,
        selectedInfluencers: [...state.selectedInfluencers, action.payload],
      }
    case 'REMOVE_SELECTED_INFLUENCER':
      return {
        ...state,
        selectedInfluencers: state.selectedInfluencers.filter(
          id => id !== action.payload
        ),
      }
    case 'SET_FILTERS':
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      }
    case 'SET_SETTINGS':
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload,
        },
      }
    case 'RESET_FILTERS':
      return {
        ...state,
        filters: initialState.filters,
      }
    default:
      return state
  }
}

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const actions = {
    setSelectedInfluencers: (influencers) =>
      dispatch({ type: 'SET_SELECTED_INFLUENCERS', payload: influencers }),
    
    addSelectedInfluencer: (id) =>
      dispatch({ type: 'ADD_SELECTED_INFLUENCER', payload: id }),
    
    removeSelectedInfluencer: (id) =>
      dispatch({ type: 'REMOVE_SELECTED_INFLUENCER', payload: id }),
    
    setFilters: (filters) =>
      dispatch({ type: 'SET_FILTERS', payload: filters }),
    
    setSettings: (settings) =>
      dispatch({ type: 'SET_SETTINGS', payload: settings }),
    
    resetFilters: () =>
      dispatch({ type: 'RESET_FILTERS' }),
  }

  return (
    <AppContext.Provider value={{ ...state, ...actions }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
