import axios from 'axios'

const BASE = '/api'

export const getSongs = (page = 1, limit = 10) =>
  axios.get(`${BASE}/songs`, { params: { page, limit } }).then((r) => r.data)

export const getAllSongs = () =>
  axios.get(`${BASE}/songs/all`).then((r) => r.data)

export const searchSong = (title) =>
  axios.get(`${BASE}/songs/search`, { params: { title } }).then((r) => r.data)

export const rateSong = (index, rating) =>
  axios.put(`${BASE}/songs/${index}/rating`, { rating }).then((r) => r.data)
