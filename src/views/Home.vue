<template>
    <main>
        <div id="layout-wrapper">
            <div class="main-content">
                <div class="page-content">
                    <div class="container-fluid">
                        <!-- title of page -->
                        <div class="row" v-if="$store.state.user?.role != 'staff'">
                            <div class="col-12 mt-3">
                                <div class="page-title-box d-sm-flex align-items-center justify-content-between">
                                    <h4 class="mb-sm-0">Dashboard</h4>
                                </div>
                            </div>
                        </div>
                        <!-- statistic resident by card -->
                        <div class="row" v-if="$store.state.user?.role != 'staff'">
                            <div class="col-md-4">
                                <div class="card custom-rounded-medium">
                                    <div class="card-body">
                                        <div class="d-flex">
                                            <div class="avatar-md">
                                                <span class="avatar-title rounded-circle bg-primary h1">
                                                    <i class="mdi mdi-map-marker-radius-outline text-white"></i>
                                                </span>
                                            </div>
                                            <div class="d-block ms-3">
                                                <p class="mb-1 text-dark">Jumlah Kopak</p>
                                                <div class="d-flex align-items-end"><h1 class="mb-0 me-2 fw-bold text-primary">{{statistic.total_kopak}}</h1> <span class="font-size-12 mb-1">area</span></div>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- end card-body -->
                                </div>
                                <!-- end card -->
                            </div>
                            <div class="col-md-4" v-if="$store.state.user?.role == 'superadmin'">
                                <div class="card custom-rounded-medium">
                                    <div class="card-body">
                                        <div class="d-flex">
                                            <div class="avatar-md">
                                                <span class="avatar-title rounded-circle bg-primary h1">
                                                    <i class="mdi mdi-account-outline text-white"></i>
                                                </span>
                                            </div>
                                            <div class="d-block ms-3">
                                                <p class="mb-1 text-dark">Jumlah Admin</p>
                                                <div class="d-flex align-items-end"><h1 class="mb-0 me-2 fw-bold text-primary">{{statistic.total_admin}}</h1> <span class="font-size-12 mb-1">orang</span></div>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- end card-body -->
                                </div>
                                <!-- end card -->
                            </div>
                            <div class="col-md-4" v-if="['admin', 'superadmin'].indexOf($store.state.user?.role) != -1">
                                <div class="card custom-rounded-medium">
                                    <div class="card-body">
                                        <div class="d-flex">
                                            <div class="avatar-md">
                                                <span class="avatar-title rounded-circle bg-primary h1">
                                                    <i class="mdi mdi-card-account-details-outline text-white"></i>
                                                </span>
                                            </div>
                                            <div class="d-block ms-3">
                                                <p class="mb-1 text-dark">Jumlah Petugas</p>
                                                <div class="d-flex align-items-end"><h1 class="mb-0 me-2 fw-bold text-primary">{{statistic.total_staff}}</h1> <span class="font-size-12 mb-1">orang</span></div>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- end card-body -->
                                </div>
                                <!-- end card -->
                            </div>
                            <!-- end col -->
                        </div>
                        <!-- resident growth -->
                        <h6 class="mb-0 fw-bold mb-3 fs-5"><i class="mdi mdi-map-marker-multiple me-2"></i>Daftar Kopak</h6>
                        <div class="row">
                            <template v-if="listKopak.length">
                                <div class="col-md-3" v-for="item in listKopak">
                                    <div class="card custom-rounded-medium">
                                        <div class="card-body">
                                            <div class="d-flex align-items-center justify-content-between mb-2">
                                                <h4 class="mt-0 mb-0 me-3 mb-2">{{ item.name }}</h4>
                                                <router-link :to="`kopak/detail/${item.id}`" class="btn btn-white border btn-sm custom-rounded-medium"><i class="mdi mdi-magnify"></i> Detail</router-link>
                                            </div>
                                            <div class="d-block bg-light py-2 px-3 custom-rounded-medium">
                                                <div class="mb-2">Penanggung Jawab</div>
                                                <div class="fw-bold">{{ item.supervisor?.name }}</div>
                                                <div class="fw-bold">{{ item.supervisor?.phone }}</div>
                                            </div>
                                        </div>
                                        <!-- end card-body -->
                                    </div>
                                    <!-- end card -->
                                </div>
                            </template>
                            <div v-else class="col-md-12">
                                <div class="bg-light p-3 custom-rounded-medium">
                                    <div class="text-muted">
                                        Belum ada kopak yang terdaftar disistem
                                    </div>
                                </div>
                            </div>
                            <!-- end col -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>
<script>
import { db } from '@/utils/firebase';
import { collection, getDocs, query, orderBy } from "firebase/firestore";

import { find } from 'lodash'
    
export default {
    name: 'Home',
    data() {
        return {
            statistic: {
                total_kopak: 0,
                total_staff: 0,
                total_admin: 0,
            },
            listKopak: [],
        }
    },
    mounted() {
        setTimeout(() => {
            this.getStatisticUser()
        }, 1000);
    },
    methods: {
        async getStatisticUser() {
            try {
                this.loading = this.$loading.show()

                // get user
                const usersQuery = query(
                    collection(db, "users"),
                    orderBy("name", 'asc'),
                );
                const querySnapshot = await getDocs(usersQuery);                
                const dataUser = querySnapshot.docs
                .map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                const dataAdmin = dataUser.filter(data => data.role == 'admin')
                const dataStaff = dataUser.filter(data => data.role == 'staff')

                this.statistic.total_admin = dataAdmin.length;
                this.statistic.total_staff = dataStaff.length;
                
                const role = this.$store.state.user?.role
                const userId = this.$store.state.user?.id

                // get kopak
                const kopakQuery = query(
                    collection(db, "kopak"),
                    orderBy("createdAt", 'asc'),
                );
                const kopakSnapshot = await getDocs(kopakQuery);                
                this.listKopak = kopakSnapshot.docs
                .map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    supervisor: find(dataAdmin, {id: doc.data().supervisorId.toString()})
                }))

                this.statistic.total_kopak = this.listKopak.length

                this.loading.hide()
            } catch (e) {
                this.loading.hide()
                console.log(
                    "Error fetching documents: " + e.message
                );
            }
        }
    }
}
</script>