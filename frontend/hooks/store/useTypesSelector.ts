import { TypedUseSelectorHook, useSelector } from 'react-redux'
import { RootState } from 'stores/rootReducer'

export const useTypesSelector: TypedUseSelectorHook<RootState> = useSelector
