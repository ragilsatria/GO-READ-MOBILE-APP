import axios from 'axios';
import {API} from '@env';

export const getBook = (token, search, sort, page, by) => {
  // console.log(API);
  return {
    type: 'BOOK',
    payload: axios({
      method: 'GET',
      url: `${API}/books`,
      // url: 'http://192.168.43.81:3000/api/books',
      params: {
        search: search,
        // show: show || 6,
        page: page || 1,
        sort: sort || 'latest',
        by: by,
      },
      headers: {
        Authorization: token,
      },
    }),
  };
};

export const insertBook = (token, data) => {
  // console.log(token)
  return {
    type: 'INSERT',
    payload: axios({
      method: 'POST',
      url: `${API}/books`,
      data: data,
      headers: {
        Authorization: token,
        'Content-Type': 'multipart/form-data',
      },
    }),
  };
};

export const detailBook = (token, id) => {
  // console.log(token)
  return {
    type: 'DETAIL',
    payload: axios({
      method: 'GET',
      url: `http://192.168.43.81:3000/api/books/${id}`,
      headers: {
        Authorization: token,
      },
    }),
  };
};

export const deleteBook = (token, id) => {
  // console.log(token)
  return {
    type: 'DELETE',
    payload: axios({
      method: 'DELETE',
      url: `${API}/books/${id}`,
      headers: {
        Authorization: token,
      },
    }),
  };
};
export const editBook = (token, id, data) => {
  // console.log(token)
  return {
    type: 'EDIT',
    payload: axios({
      method: 'PUT',
      url: `${API}/books/${id}`,
      data: data,
      headers: {
        Authorization: token,
      },
    }),
  };
};
