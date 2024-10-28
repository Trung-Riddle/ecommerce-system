import instance from './instance'
import { FieldValues, SubmitHandler } from 'react-hook-form'

export const getCurrentAPI = () => instance({
    method: 'GET',
    url: '/user/current'
})