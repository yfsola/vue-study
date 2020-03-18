import axios from 'axios'
import {Feature} from '@/types'

export function getFeature() {
  return axios.get<Feature>('/api/list')
}