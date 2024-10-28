import { createSlice } from '@reduxjs/toolkit'

interface IAppState {
  roles: any
  isLoading: boolean
  isShowModal: boolean
  modalContent: any
}
const initialState: IAppState = {
  roles: [],
  isLoading: false,
  isShowModal: false,
  modalContent: null,
}
const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleLoading: (state, action) => {
      state.isLoading = action.payload
    },
    modal: (state, action) => {
      state.isShowModal = action.payload.isShowModal
      state.modalContent = action.payload.modalContent
    }
  },
  extraReducers: (builder) => {
   
  }
})
export const { toggleLoading, modal } = appSlice.actions
export default appSlice.reducer