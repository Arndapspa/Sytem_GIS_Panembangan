<template>
    <main>
        <div id="layout-wrapper">
            <div class="main-content">
                <div class="page-content">
                    <div class="container-fluid">
                        <!-- title of page -->
                        <div class="row">
                            <div class="col-12 mt-3">
                                <div class="page-title-box d-sm-flex align-items-start justify-content-between">
                                    <h4 class="mb-sm-0">Data Admin</h4>
                                    <div class="d-flex">
                                        <button class="btn button-rounded" type="button" :class="{'btn-light': selectedData.length <= 0, 'bg-white': selectedData.length > 0}" :disabled="selectedData.length <= 0" @click="deletedDataBatch()"><i class="mdi mdi-trash-can-outline me-1"></i>Hapus Terpilih</button>
                                        <router-link to="/master-admin/form" class="btn btn-primary button-rounded ms-2" type="button"><i class="mdi mdi-plus me-1"></i>Tambah Baru</router-link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-md-12">
                                <div class="input-group-left">
                                    <i class="mdi mdi-magnify fs-2 input-group-icon"></i>
                                    <input type="text" class="form-control input-group-form" placeholder="Cari berdasarkan nama atau email disini" v-model="keywords" @input="showData(true)">
                                </div>
                            </div>
                        </div>
                        <div class="spacer-medium"></div>
                        <div class="row">
                            <div class="col-md-12">
                                <p>Menampilkan {{pagination.total}} data admin</p>
                                <div class="table-responsive">
                                    <table class="table table-custom-card">
                                        <thead>
                                            <tr>
                                                <th width="2%"><input type="checkbox" class="form-check-input" v-model="isCheckAll" @change="checkAll()" v-if="pagination.total > 0" /></th>
                                                <th>Nama</th>
                                                <th>NIK</th>
                                                <th>Email</th>
                                                <th>No HP</th>
                                                <th v-if="$store.state.user?.role == 'superadmin'">Password</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <template v-if="pagination.total > 0">
                                                <tr v-for="item in listPaged">
                                                    <td class="middle-item"><input type="checkbox" class="form-check-input" v-model="item.checked" /></td>
                                                    <td class="middle-item">{{ item.name }}</td>
                                                    <td class="middle-item">{{ item.identity_number || '-' }}</td>
                                                    <td class="middle-item">{{ item.email }}</td>
                                                    <td class="middle-item">{{ item.phone }}</td>
                                                    <td class="middle-item" v-if="$store.state.user?.role == 'superadmin'">{{ item.password || '-' }}</td>
                                                    <td class="middle-item">
                                                        <div class="d-flex justify-content-end align-items-center">
                                                            <router-link :to="`master-admin/form/${item.id}`" class="btn btn-square border bg-white me-2"><i class="mdi mdi-circle-edit-outline fs-4"></i></router-link>
                                                            <button type="button" class="btn btn-square border bg-white" @click="deletedData(item)"><i class="mdi mdi-trash-can-outline fs-4"></i></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </template>
                                            <template v-else>
                                                <tr>
                                                    <td colspan="7" class="text-muted">Data tidak ditemukan</td>
                                                </tr>
                                            </template>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div class="row justify-content-center" v-if="pagination.total > 0">
                            <div class="col-auto">
                                <Pagination :page="pagination.page" :prev="pagination.prev" :next="pagination.next" v-on:fetchData="paginationData"></Pagination>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>
<script>
import simplebar from 'simplebar-vue';
import 'simplebar-core/dist/simplebar.css';

import {filter, map} from 'lodash'

import axios from 'axios';

import { db } from '@/utils/firebase';
import { collection, getDocs, deleteDoc, doc, query, where, orderBy } from "firebase/firestore"; 

export default {
    name: 'MasterKopak',
    data() {
        return {
            list: [],
            listPaged: [],
            keywords: '',
            isCheckAll: false,
            pagination: {
                prev: false,
                next: false,
                page: 1,
                limit: 5,
                total: 0
            },
            loading: null
        }
    },
    components: {
        simplebar,
    },
    setup(){
        const api = axios.create({
            timeout: 30000,
        });

        return {api}
    },
    computed: {
        selectedData() {
            return filter(this.list, function(data) { return data.checked; })
        },
    },
    mounted() {
        this.fetchData()
    },
    watch: {
        keywords(value) {
            this.keywords=value
        }
    },
    methods: {
        paginationData(page) {
            this.pagination.page = page
            this.showData()
        },
        async fetchData() {
            this.pagination.page = 1
            try {
                this.loading = this.$loading.show()
                const usersQuery = query(
                    collection(db, "users"),
                    where("role", "==", 'admin'),
                    orderBy("createdAt", 'asc'),
                );
                const querySnapshot = await getDocs(usersQuery);                
                this.list = querySnapshot.docs
                .map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))

                this.showData(true)
                this.pagination.total = this.list.length
                this.loading.hide()
            } catch (e) {
                this.error = "Error fetching documents: " + e.message;
            } finally {
            }
        },
        async deletedData(data) {
            this.$swal
                .fire({
                    title: 'Apakah kamu yakin ?',
                    html: `Kamu akan menghapus data dengan nama <b>${data.name}</b>`,
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
                            this.loading = this.$loading.show()
                            this.fetch = true
                            await deleteDoc(doc(db, "users", data.id));
                            await this.deleteAccount(data.id)
                            this.fetch = false
                            this.loading.hide()
                            
                            this.fetchData()
                            this.$toast.success('Data berhasil dihapus');
                        } catch(error) {
                            this.fetch = false
                            this.$toast.error(error);
                        }
                    }
                });
        },
        async deleteAccount(uid) {
            return new Promise((resolve, reject) => {
                this.api
                    .delete(`${import.meta.env.VITE_APP_API_ENDPOINT}/api/user/${uid}`)
                    .then((response) => {
                        if (response.statusText.toLowerCase() === 'ok' || response.status === 200) {
                            resolve(response.data);
                        } else {
                            reject(response);
                        }
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        },
        checkAll() {
            this.list.forEach(element => {
                element.checked = this.isCheckAll
            });
        },
        showData(reset=false) {
            if (reset) {
                this.pagination.page = 1
            }
            let result = []
            if (this.keywords) {
                result = this.list.filter(data => {
                    return data.name.toUpperCase().includes(this.keywords.toUpperCase()) || data.email.toUpperCase().includes(this.keywords.toUpperCase());
                });
            } else {
                result = this.list
            }

            const start = (this.pagination.page - 1) * this.pagination.limit;
            const end = start + this.pagination.limit;

            this.pagination.prev = this.pagination.page > 1
            this.pagination.next = this.list.length - end > 0
            this.pagination.total = result.length

            this.listPaged = result.slice(start, end)
        },
        async deletedDataBatch() {
            const listId = map(this.selectedData, 'id')

            this.$swal
                .fire({
                    title: 'Apakah kamu yakin ?',
                    html: `Kamu akan menghapus <b>${listId.length}</b> data yang terpilih`,
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
                            this.loading = this.$loading.show()
                            this.fetch = true

                            listId.forEach(async (element) => {
                                await deleteDoc(doc(db, "users", element))
                                await this.deleteAccount(element)
                            });

                            this.fetch = false
                            this.loading.hide()
                            
                            this.isCheckAll = false
                            this.fetchData()
                            this.$toast.success('Data berhasil dihapus');
                        } catch(error) {
                            this.fetch = false
                            this.$toast.error(error);
                        }
                    }
                });
        },
    }
}
</script>