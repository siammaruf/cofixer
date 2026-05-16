import { combineReducers } from '@reduxjs/toolkit'
import authReducer from '~/redux/features/authSlice'
import userReducer from '~/redux/features/userSlice'
import cmsReducer from '~/redux/features/cmsSlice'

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  cms: cmsReducer,
})

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer
