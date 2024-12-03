import { createWebHistory, createRouter } from 'vue-router'
import HomePage from '@/components/HomePage.vue'; 
import BookRide from '@/components/BookRide.vue'; 
import OfferRide from '@/components/OfferRide.vue'; 
import LoginPage from '@/components/LoginPage.vue';

const router = createRouter ({
  history: createWebHistory(process.env.BASE_URL),
  routes:  [
    { path: '/', component: HomePage },
    { path: '/bookride', component: BookRide },
    { path: '/offerride', component: OfferRide},
    { path: '/homepage', component: HomePage},
    { path: '/loginpage', component: LoginPage}
  ]
})

export default router