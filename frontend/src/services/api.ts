import axios from 'axios';


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Configure axios with default headers
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export enum Role {
  ADMIN = 'Admin',
  USER = 'User',
}
 export interface User {
  nom: string;
  email: string;
  password: string;
  role: Role;
  telephone: string;

  avatar?: string; 
  coverPhoto?: string; 
  birthdate?: string;
  gender?: string ; 
  location?: string;
  bio?: string;


  createdAt?: Date;
}

export interface Message{
    sender: string;
    receiver: string;
    content: string;
}

export interface Post{
  content:string,
  image:File,
  //author:string,
}

export interface   comment {
  postId: string;
  content: string;
}

export interface event{
      _id: any;
      title: string,
      description: string,
      date : string,
      location: string,
      image : string,
      organizer: User,
      participants: User[],
}
export const api = {


    // Authentication
  login: async (email: string, password: string) => {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    return response.data;
  },

    register:  (data: FormData) => {
    return axios.post(`${API_URL}/auth/register`, data);
    
  },
   

logout: () => {
  const token = localStorage.getItem('token');

  return axios.post(`${API_URL}/auth/logout`, {}, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then(res => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return res;
  })
  .catch(err => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    throw err;
  });
},

SendMessage:async (data:Message)=>{
    return axios.post(`${API_URL}/messages/`, data);
},

getMessages: async (userId1: string, userId2: string) => {
    return axios.get(`${API_URL}/messages/${userId1}/${userId2}`);
  },

  getusers: () =>
  axios.get(`${API_URL}/auth/getusers`),

  getUserById: async (id: string) => {
  return axios.get(`${API_URL}/user/${id}`);
},
updateUser: async (id:string ,data: FormData) => {
  return axios.put(`${API_URL}/auth/updateuser/${id}`,data);
},

addpost: async(data:FormData)=>{
return axios.post(`${API_URL}/posts/add`, data);},

getposts : async()=>{
    return axios.get(`${API_URL}/posts/`);
  },
  fetchMyPosts : async (token: string) => {
  const response = await axios.get(`${API_URL}/posts/mine`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
},

getPostById: async (postId: string): Promise<Post[]> => {
    const response = await axios.get(`${API_URL}/posts/${postId}`);
    return response.data;
  },

  deletePost :async (id: string) => {
  return axios.delete(`${API_URL}/posts/delete/${id}`);
},

addcomment: async(data:comment)=>{
return axios.post(`${API_URL}/comments/add`, data);},

addlike : async (postId:string)=>
{
    return axios.patch(`${API_URL}/posts/${postId}/like`);
},

fetchcommentbypost : async(postId:string)=>{
    return axios.get(`${API_URL}/comments/bypost/${postId}`);
},

getuserprofil: async()=>{
    return axios.get(`${API_URL}/user/profile`);
},
SharePost: async(postId:string,data:{content:string})=>{
    return axios.post(`${API_URL}/posts/share/${postId}`,data);
},

likeComment: (commentId: string) =>{
   return axios.post(`${API_URL}/comments/${commentId}/like`)

},

replyToComment: (data: { parentCommentId: string; content: string; postId: string }) =>{
    axios.post(`${API_URL}/comments/reply`, data)

},

 addEvent: async (data: FormData) => {
    return axios.post(`${API_URL}/events/add`, data);
  },

  // Récupérer tous les événements
  getEvents: async () => {
    return axios.get(`${API_URL}/events/`);
  },

  // Récupérer un événement par ID
  getEventById: async (id: string) => {
    return axios.get(`${API_URL}/events/${id}`);
  },

  // Participer à un événement
  joinEvent: async (eventId: string) => {
    return axios.post(`${API_URL}/events/${eventId}/join`);
  },

  // Quitter un événement
  leaveEvent: async (eventId: string) => {
    return axios.post(`${API_URL}/events/${eventId}/leave`);
  },

  // Supprimer un événement
  deleteEvent: async (eventId: string) => {
    return axios.delete(`${API_URL}/events/delete/${eventId}`);
  },

  // Modifier un événement
  updateEvent: async (eventId: string, data: FormData) => {
    return axios.put(`${API_URL}/events/update/${eventId}`, data);
  },
fetchMyEvents : async (token: string) => {
  const response = await axios.get(`${API_URL}/events/mine`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
},

  fetchUserImages : async (userId: string) => {
  const res = await axios.get(`/posts/images/${userId}`);
  return res.data.images; 
},

  fetchMyImages : async (token: string) => {
  const res = await axios.get(`${API_URL}/posts/user/images`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
},
followUser: (id: string) =>
  axios.post(`${API_URL}/user/follow/${id}`, {}),

unfollowUser: (id: string, ) =>
  axios.post(`${API_URL}/user/unfollow/${id}`, {}),

getFollowers: (id: string) =>
  axios.get(`${API_URL}/user/followers/${id}`),

getFollowing: (id: string) =>
  axios.get(`${API_URL}/user/following/${id}`),

checkIsFollowing: (id: string) =>
  axios.get(`${API_URL}/user/isFollowing/${id}`
    ),

    suggestions:async () =>{
  return axios.get(`${API_URL}/user/suggestions`);

    },



}