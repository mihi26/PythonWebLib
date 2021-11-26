import axios from "axios";

axios.interceptors.request.use(
  (request) => {
    const accessToken = localStorage.getItem('@token');
    if (accessToken) {
      request.headers.Authorization = `Bearer ${accessToken}`;
    }
    return request;
  },
  (err) => Promise.reject(err),
);

const mapper = res => res.data;

const apiConfig = 'http://localhost:8007';

export const ApiService = {
  Login: (payload) => {
    return axios.post(apiConfig + "/login", payload).then(mapper);
  },
  Register: (payload) => axios.post(apiConfig + "/register", payload).then(mapper),
  BookList: () => axios.get(apiConfig + "/books").then(mapper),
  BookDetails: (id) => axios.get(apiConfig + `/books/${id}`).then(mapper),
  CreateBook: (payload) => axios.post(apiConfig + `/books`, payload).then(mapper),
  UpdateBook: (payload) => axios.put(apiConfig + `/books`, payload).then(mapper),
  DeleteBook: (id) => axios.delete(apiConfig + `/books/${id}`).then(mapper),
  CategoryList: () => axios.get(apiConfig + "/categories").then(mapper),
  AuthorList: () => axios.get(apiConfig + "/authors").then(mapper),
  PublisherList: () => axios.get(apiConfig + "/publishers").then(mapper),
  LanguageList: () => axios.get(apiConfig + "/languages").then(mapper),
  UserList: () => axios.get(apiConfig + "/users").then(mapper),
  CategoryDetails: (id) => axios.get(apiConfig + `/categories/${id}`).then(mapper),
  DeleteCategory: (id) => axios.delete(apiConfig + `/categories/${id}`).then(mapper),
  CreateCategory: (payload) => axios.post(apiConfig + "/categories", payload).then(mapper),
  UpdateCategory: (payload) => axios.put(apiConfig + "/categories", payload).then(mapper),
  UserDetails: (id) => axios.get(apiConfig + `/users/${id}`).then(mapper),
  AuthorDetails: (id) => axios.get(apiConfig + `/authors/${id}`).then(mapper),
  DeleteAuthor: (id) => axios.delete(apiConfig + `/authors/${id}`).then(mapper),
  CreateAuthor: (payload) => axios.post(apiConfig + "/authors", payload).then(mapper),
  UpdateAuthor: (payload) => axios.put(apiConfig + "/authors", payload).then(mapper),
  UpdateUser: (payload) => axios.put(apiConfig + "/users", payload).then(mapper),
  PublisherDetails: (id) => axios.get(apiConfig + `/publishers/${id}`).then(mapper),
  DeletePublisher: (id) => axios.delete(apiConfig + `/publishers/${id}`).then(mapper),
  CreatePublisher: (payload) => axios.post(apiConfig + "/publishers", payload).then(mapper),
  UpdatePublisher: (payload) => axios.put(apiConfig + "/publishers", payload).then(mapper),
  LanguageDetails: (id) => axios.get(apiConfig + `/languages/${id}`).then(mapper),
  DeleteLanguage: (id) => axios.delete(apiConfig + `/languages/${id}`).then(mapper),
  CreateLanguage: (payload) => axios.post(apiConfig + "/languages", payload).then(mapper),
  CreateFile: (payload) => axios.post(apiConfig + "/files", payload).then(mapper),
  DeleteFile: (fileId) => axios.delete(apiConfig + "/files/" + fileId).then(mapper),
  UpdateLanguage: (payload) => axios.put(apiConfig + "/languages", payload).then(mapper),
  DoAction: (bookId, action, content, removeId) => axios.post(apiConfig + "/book-action/" + bookId, {
    type: action,
    delete_id: removeId,
    content,
  }).then(mapper),
  UserUpdate: (payload) => axios.post(apiConfig + '/users', payload).then(mapper),
  LikedBookList: () => axios.get(apiConfig + '/book-action/0').then(mapper)
}
