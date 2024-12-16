import { createRouter, createWebHashHistory } from 'vue-router'
import stores from '../stores'

import Home from '../views/Home.vue'
import Signin from '../views/authentication/Signin.vue'

// Master Data
import Kopak from '../views/master-kopak/List.vue'
import KopakForm from '../views/master-kopak/Form.vue'
import KopakFormDetail from '../views/master-kopak/FormDetailKopak.vue'
import KopakInformation from '../views/KopakInformation.vue'

import Staff from '../views/master-staff/List.vue'
import StaffForm from '../views/master-staff/Form.vue'

import Admin from '../views/master-admin/List.vue'
import AdminForm from '../views/master-admin/Form.vue'

import Maps from '../views/Maps.vue'

import NotFound from '../views/404.vue'

import Profile from '../views/Profile.vue'
import ChangePassword from '../views/ChangePassword.vue'

const nameApplication = import.meta.env.VITE_APP_TITLE

const routes = [
    // routes general
    {
        path: '/',
        name: 'home',
        component: Home,
        meta: {
            title: `${nameApplication} | Home`,
            footer: true,
            navbar: true,
        }
    },
    {
        path: '/notfound',
        name: 'notfound',
        component: NotFound,
        meta: {
            title: `${nameApplication} | Not Found`,
            footer: false,
            navbar: false,
        }
    },
    {
        path: '/signin',
        name: 'signin',
        component: Signin,
        meta: {
            title: `${nameApplication} | Login`,
            footer: false,
            navbar: false,
        }
    },
    {
        path: '/master-kopak',
        name: 'kopak',
        component: Kopak,
        meta: {
            title: `${nameApplication} | Master Kopak`,
            footer: true,
            navbar: true,
        }
    },
    {
        path: '/master-kopak/form/:id?',
        name: 'kopak.form',
        component: KopakForm,
        meta: {
            title: `${nameApplication} | Form Master Kopak`,
            footer: true,
            navbar: true,
        }
    },
    {
        path: '/master-kopak/form/detail/:kopakId/:locationId/:id?',
        name: 'kopak.form.detail',
        component: KopakFormDetail,
        meta: {
            title: `${nameApplication} | Form Master Kopak`,
            footer: true,
            navbar: true,
        }
    },
    {
        path: '/kopak/detail/:id?',
        name: 'kopak.information',
        component: KopakInformation,
        meta: {
            title: `${nameApplication} | Informasi Kopak`,
            footer: true,
            navbar: true,
        }
    },
    {
        path: '/master-staff',
        name: 'staff',
        component: Staff,
        meta: {
            title: `${nameApplication} | Master Petugas`,
            footer: true,
            navbar: true,
        }
    },
    {
        path: '/master-staff/form/:id?',
        name: 'staff.form',
        component: StaffForm,
        meta: {
            title: `${nameApplication} | Form Master Petugas`,
            footer: true,
            navbar: true,
        }
    },
    {
        path: '/master-admin',
        name: 'admin',
        component: Admin,
        meta: {
            title: `${nameApplication} | Master Admin`,
            footer: true,
            navbar: true,
        }
    },
    {
        path: '/master-admin/form/:id?',
        name: 'admin.form',
        component: AdminForm,
        meta: {
            title: `${nameApplication} | Form Master Admin`,
            footer: true,
            navbar: true,
        }
    },
    {
        path: '/maps',
        name: 'maps',
        component: Maps,
        meta: {
            title: `${nameApplication} | Master Admin`,
            footer: true,
            navbar: true,
        }
    },
    {
        path: '/profile',
        name: 'profile',
        component: Profile,
        meta: {
            title: `${nameApplication} | Profile`,
            footer: true,
            navbar: true,
        }
    },
    {
        path: '/change-password',
        name: 'changepassword',
        component: ChangePassword,
        meta: {
            title: `${nameApplication} | Ubah Password`,
            footer: true,
            navbar: true,
        }
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes: routes,
    linkActiveClass: 'active-link',
    scrollBehavior() {
        return { top: 0, left: 0 }
    }
})

router.beforeEach((to, from, next) => {
    document.title = to.meta.title;

    const localData = localStorage.getItem('token')
    const tmpRole = localStorage.getItem('role') || ''

    const authRequired  = ['signin', 'signup'].includes(to.name);
    const role = to.meta.role || ''

    let isAllow = true

    if (role) {
        if (role != tmpRole)
            isAllow = false
    }

    if (isAllow) {
        // if (localData && !authRequired) {
        //     ApiCore.get(`${apiEnpoint.ACCOUNT}/info`)
        //             .then((response) => {
        //                 if ('status' in response && !response.status) {
        //                     localStorage.removeItem('token')
        //                     localStorage.removeItem('rtId')
        //                     localStorage.removeItem('rwId')
        //                     next({name: 'home'})
        //                 } else {
        //                     stores.commit('setuser', response)
        //                     next()
        //                 }
        //             })
        //             .catch(() => {})
        // } else {
            if (to.path == '/' && !localData) {
                next({name: 'signin'})
            } else {
                next()
            }
        // }
        // next()
    } else {
        next({name: 'notfound'})
    }
})

export default router
