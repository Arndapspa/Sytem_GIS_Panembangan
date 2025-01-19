<template>
    <header id="page-topbar">
        <div class="navbar-header">
            <div class="d-flex">
                <!-- LOGO -->
                <div class="navbar-brand-box text-center">
                    <a href="/" class="logo">
                        <span class="logo-sm">
                            <img src="@/assets/images/logo.png" alt="logo-sm-dark" height="32">
                        </span>
                        <span class="logo-lg">
                            <div class="d-flex align-items-center">
                                <img src="@/assets/images/logo.png" alt="logo-dark" height="50">
                                <span class="h3 fw-bold ms-3 mb-0 text-white">DESA PANEMBANGAN</span>
                            </div>
                        </span>
                    </a>
                </div>

                <button type="button" class="btn btn-sm px-3 font-size-24 d-lg-none header-item" data-bs-toggle="collapse" data-bs-target="#topnav-menu-content" @click="toggleMenu">
                    <i class="ri-menu-2-line align-middle"></i>
                </button>
            </div>

            <div class="d-flex">
                <div class="dropdown d-inline-block user-dropdown">
                    <button type="button" class="btn header-item waves-effect" id="page-header-user-dropdown" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <img class="rounded-circle header-profile-user" src="@/assets/images/default-avatar.png" alt="Header Avatar">
                        <span class="d-none d-xl-inline-block ms-2 me-2">{{$store.state.user?.name || $store.state.user?.email}}</span>
                        <i class="mdi mdi-chevron-down d-none d-xl-inline-block"></i>
                    </button>
                    <div class="dropdown-menu dropdown-menu-end">
                        <!-- item-->
                        <router-link class="dropdown-item" to="/profile"><i class="ri-user-line align-middle me-1"></i> Profil</router-link>
                        <router-link class="dropdown-item" to="/change-password"><i class="ri-lock-line align-middle me-1"></i> Ubah Password</router-link>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item text-danger" href="javascript:void(0)" @click="logout()"><i class="ri-shut-down-line align-middle me-1 text-danger"></i> Logout</a>
                    </div>
                </div>
            </div>
        </div>
    </header>
    <div class="topnav">
            <div class="container-fluid">
                <nav class="navbar navbar-light navbar-expand-lg topnav-menu">
                    <div class="collapse navbar-collapse" :class="{'show': showMenu}">
                        <ul class="navbar-nav">
                            <template v-for="item in listMenu">
                                <li class="nav-item" v-if="item.role.indexOf($store.state.user?.role) != -1 || item.role == 'all'">
                                    <router-link :to="item.url" class="nav-link">
                                        <i class="me-2" :class="item.icon"></i> {{item.title}}
                                    </router-link>
                                </li>
                            </template>
                        </ul>
                    </div>
                </nav>
            </div>
        </div>
</template>
<script>


import { signOut } from "firebase/auth";
import { auth } from '@/utils/firebase';

export default {
    name: 'NavBar',
    data() {
        return {
            showMenu: false,
            listMenu: [
                {
                    title: 'Dashboard',
                    icon: 'mdi mdi-view-dashboard-outline',
                    url: '/',
                    role: 'all',
                },
                {
                    title: 'Admin',
                    icon: 'mdi mdi-account-supervisor-outline',
                    url: '/master-admin',
                    role: ['superadmin'],
                },
                {
                    title: 'Petugas',
                    icon: 'mdi mdi-account-group-outline',
                    url: '/master-staff',
                    role: ['superadmin', 'admin'],
                },
                {
                    title: 'Kopak',
                    icon: 'mdi mdi-map-marker-radius-outline',
                    url: '/master-kopak',
                    role: ['superadmin'],
                },
            ]
        }
    },
  
    watch: {
        $route(to, from) {
            this.showMenu = false
        },
    },
    methods: {
        toggleMenu() {
            const isShowMenu = localStorage.getItem('show-menu') || this.showMenu

            this.showMenu = isShowMenu == 1
            
            localStorage.setItem('show-menu', isShowMenu == 1 ? 0 : 1)
        },
        async logout() {
            this.$swal
                .fire({
                    title: 'Apakah kamu yakin ?',
                    text: 'Kamu akan keluar dari aplikasi',
                    icon: 'warning',
                    showDenyButton: true,
                    showCancelButton: false,
                    confirmButtonText: 'Ya',
                    confirmButtonColor: '#159895',
                    denyButtonColor: '#c0c0c0',
                    denyButtonText: 'Tidak',
                })
                .then(async (result) => {
                    if (result.isConfirmed) {
                        try {
                            await signOut(auth);
                            localStorage.removeItem('token')
                            this.$router.push("/signin");
                        } catch (error) {
                            this.$toast.error(error.message);
                        }
                    }
                });
        }
    }
}
</script>