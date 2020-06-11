import Vue from 'vue'
import Router from 'vue-router'
import Conversations from '@/components/Conversations'
import Conversation from '@/components/Conversation'
import Messages from '@/components/Messages'
import Members from '@/components/Members'
import Profile from '@/components/Profile'
import newConversation from '@/components/newConversation'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/conversations',
      name: 'Conversations',
      component: Conversations,
      props: true
    },
    {
      path: '/conversation/:id',
      name: 'Conversation',
      component: Conversation,
      props: true,
      params: true
    },
    
    {
      path: '/conversation/:id/messages',
      name: 'Messages',
      component: Messages,
      props: true
    },
    {
      path: '/conversation/:id/members',
      name: 'Members',
      component: Members,
      props:  true, 
      params: true
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile
    },
    {
      path: '/newConversation',
      name: 'newConversation',
      component: newConversation
    },
    {
      path: '*',
      redirect: '/conversations'
    },
    
    
  ],
  mode: 'history' 
})
