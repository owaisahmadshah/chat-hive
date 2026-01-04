import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

import { IConnection } from "@/types/connection-interface"

const initialState: IConnection[] = []

const connectionSlice = createSlice({
  name: "connection",
  initialState,
  reducers: {
    addConnection: (state, action: PayloadAction<IConnection>) => {
      state.push(action.payload)
    },
    addConnections: (state, action: PayloadAction<IConnection[]>) => {
      state = [...state, ...action.payload]
    },
    clearConnection: (
      state,
      action: PayloadAction<{ connectionId: string }>
    ) => {
      state = state.filter(
        (connection) => connection._id === action.payload.connectionId
      )
    },
    clearConnections: () => {
      return initialState
    },
  },
})

export const {
  addConnection,
  addConnections,
  clearConnection,
  clearConnections,
} = connectionSlice.actions
export default connectionSlice.reducer
